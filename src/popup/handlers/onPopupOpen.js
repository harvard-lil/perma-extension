/**
 * perma-extension
 * @module popup/handlers/onPopupOpen
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Function run when the popup UI is open. 
 */
// @ts-check

import { BROWSER, MESSAGE_IDS } from "../../constants/index.js";
import { Status } from "../../storage/Status.js";
import { Auth } from "../../storage/Auth.js";

import { onStorageUpdate } from "./onStorageUpdate.js";

/**
 * Function run when the popup UI is open.
 * - Updates tab-related information
 * - Hydrates the app using data from storage (first hydration)
 * - Checks authentication as needed
 * - Schedule runtime messages 
 * 
 * Called on `DOMContentLoaded`.
 * @param {?Event} e 
 */
export async function onPopupOpen(e = null) {
  let auth = await Auth.fromStorage();
  let status = await Status.fromStorage();

  // Pull current tab info
  const [tab] = await BROWSER.tabs.query({ active: true, lastFocusedWindow: true });

  // [1] Send `TAB_SWITCH` runtime message to update storage with current tab info.
  // This needs to be awaited
  await new Promise((resolve) => {
    BROWSER.runtime.sendMessage({
      messageId: MESSAGE_IDS.TAB_SWITCH,
      url: tab.url, // Needs to be sanitized
      title: tab.title, // Needs to be sanitized
    },
    (response) => resolve(response));
  }); 

  // [2] Call `onStorageUpdate` to hydrate the app.
  await onStorageUpdate();

  // [3] Re-check API Key if necessary 
  // - Checks are valid for an hour. Send `AUTH_CHECK` to the service worker otherwise to revalidate.
  if (
    status.isLoading === false &&
    auth.isChecked === true &&
    (new Date() - auth.lastCheck) / 1000 > 3600
  ) {
    await new Promise((resolve) => {
      BROWSER.runtime.sendMessage(
        { messageId: MESSAGE_IDS.AUTH_CHECK }, 
        (response) => resolve(response)
      );
    });
  }

  //
  // [4] If authenticated, send the following messages on schedule: 
  // 

  // `FOLDERS_PULL_LIST` to refresh the list of available folders.
  // Once + every 20 seconds.
  sendMessageIfAuth(MESSAGE_IDS.FOLDERS_PULL_LIST)
  setInterval(async () => {
    await sendMessageIfAuth(MESSAGE_IDS.FOLDERS_PULL_LIST);
  }, 20000);

  // `ARCHIVE_PULL_TIMELINE` to fetch user-created archives for the current tab.
  // Once + every 5 seconds.
  sendMessageIfAuth(MESSAGE_IDS.ARCHIVE_PULL_TIMELINE)
  setInterval(async () => {
    await sendMessageIfAuth(MESSAGE_IDS.ARCHIVE_PULL_TIMELINE);
  }, 5000);

  // `STATUS_CLEAN_UP` to clean up potential status hangs.
  // Once + every 2.5 seconds.
  sendMessageIfAuth(MESSAGE_IDS.STATUS_CLEAN_UP)
  setInterval(async () => {
    await sendMessageIfAuth(MESSAGE_IDS.STATUS_CLEAN_UP);
  }, 2500);

}

/**
 * Sends a given runtime message if user is authenticated.
 * Pulls latest Auth info from storage. 
 * 
 * @param {number} messageId 
 * @returns {Promise<void>}
 * @async
 */
async function sendMessageIfAuth(messageId) {
  const auth = await Auth.fromStorage();

  if (auth.isChecked !== true) {
    return;
  }

  BROWSER.runtime.sendMessage({ messageId });
}