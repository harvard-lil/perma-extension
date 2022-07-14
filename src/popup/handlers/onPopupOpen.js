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
 * - Hydrates the app (first hydration)
 * - Checks authentication if needed
 * - Updates list of available folders and available archives for the current url
 * 
 * Called on `DOMContentLoaded`.
 * @param {Event} e 
 */
export async function onPopupOpen(e) {
  /** @type {?Auth} */
  let auth = null;

  /** @type {?Status} */
  let status = null;

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

  // [3] Handle pending loading status:
  // - Cleanup of loading status if it's been more than a minute
  // - Otherwise, stop here
  status = await Status.fromStorage();
  
  if (status.isLoading === true && (new Date() - status.lastLoadingInit) / 1000 > 60) {
    status.isLoading = false;
    await status.save();
  }

  if (status.isLoading === true) {
    return;
  }

  // [4] Determine if user is authenticated.
  // - If `auth.isChecked` is `true` and the last check was than an hour ago. Assume user is logged in.
  // - Otherwise, send `AUTH_CHECK` to check against the API.
  auth = await Auth.fromStorage();

  if (auth.isChecked === true && (new Date() - auth.lastCheck) / 1000 > 3600) {
    await new Promise(resolve => { 
      BROWSER.runtime.sendMessage(
        { messageId: MESSAGE_IDS.AUTH_CHECK }, 
        response => resolve(response)
      );
    });
  }

  // [5] If authenticated and not busy: 
  // - Send `FOLDERS_PULL_LIST` to refresh the list of available folders
  // - Send `ARCHIVE_PULL_TIMELINE` to fetch user-created archives for the current tab.
  auth = await Auth.fromStorage(); 
  status = await Status.fromStorage();

  if (auth.isChecked === true && status.isLoading === false) {
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.FOLDERS_PULL_LIST });
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.ARCHIVE_PULL_TIMELINE });
  }

  // [6] Schedule cleanup of status message
  setTimeout(async() => {
    status = await Status.fromStorage();

    if (status.isLoading === true) {
      return;
    }

    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.STATUS_MESSAGE_CLEAR });
  }, 3000);

}