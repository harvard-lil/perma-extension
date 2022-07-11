// [!] Quick test
// @ts-check
/// <reference types="@types/chrome" />

import { BROWSER, MESSAGE_IDS } from "../../constants/index.js";
import { onStorageUpdate } from "./onStorageUpdate.js";

/**
 * 
 * @param {*} e 
 */
export async function onPopupOpen(e) {
  // Pull current tab info
  const [tab] = await BROWSER.tabs.query({ active: true, lastFocusedWindow: true });

  // [1] Send `TAB_SWITCH` runtime message to update `appState` with current tab info.
  // This needs to be awaited
  await new Promise((resolve) => {
    BROWSER.runtime.sendMessage({
      messageId: MESSAGE_IDS.TAB_SWITCH,
      url: tab.url, // Needs to be sanitized
      title: tab.title, // Needs to be sanitized
    },
    (response) => resolve(response));
  }); 

  // [2] Force `onStorageUpdate` on popup open as a way to hydrate the app.
  await onStorageUpdate();

  // Stop here if the extension is busy
  // TODO

  // [3] Determine if user is authenticated.
  // - If `auth.isChecked` is `true` and the last check was than an hour ago. Assume user is logged in.
  // - Otherwise, send `AUTH_CHECK` to check against the API.
  // This needs to be awaited
  /*
  const isAuthenticated = await new Promise(resolve => { 
    BROWSER.runtime.sendMessage(
      { messageId: MESSAGE_IDS.AUTH_CHECK }, 
      response => resolve(response)
    );
  });

  // [4] If authenticated and not busy: 
  // - Send `FOLDERS_PULL_LIST` to refresh the list of available folders
  // - Send `ARCHIVE_PULL_TIMELINE` to fetch user-created archives for the current tab.
  if (isAuthenticated === true) {
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.FOLDERS_PULL_LIST });
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.ARCHIVE_PULL_TIMELINE });
  }
  */
}