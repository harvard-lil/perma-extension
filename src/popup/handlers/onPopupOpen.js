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
 * 
 * Called on `DOMContentLoaded`.
 * @param {Event} e 
 */
export async function onPopupOpen(e) {
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

  // [2] Call `onStorageUpdate` on popup open as a way to hydrate the app.
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

  // [4] If authenticated and not busy: 
  // - Send `FOLDERS_PULL_LIST` to refresh the list of available folders
  // - Send `ARCHIVE_PULL_TIMELINE` to fetch user-created archives for the current tab.
  auth = await Auth.fromStorage();  // Needs to be refreshed
  status = await Status.fromStorage();

  if (auth.isChecked === true && status.isLoading === false) {
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.FOLDERS_PULL_LIST });
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.ARCHIVE_PULL_TIMELINE });
  }

}