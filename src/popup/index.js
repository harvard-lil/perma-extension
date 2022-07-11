/**
 * perma-extension
 * @module popup
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entrypoint for the extension's popup window.
 */
// @ts-check
import "./components/ArchiveForm.js";
import "./components/ArchiveTimeline.js";
import "./components/StatusBar.js"; 

import { BROWSER, MESSAGE_IDS } from "../constants/index.js";

/**
 * Trickle-down state-to-props management here?
 */
// TODO
 
/**
 * On popup open:
 */
document.addEventListener("DOMContentLoaded", async(e) => {
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

  // [2] Determine if user is authenticated.
  // - If `appState.apiKeyChecked` is `true` and the last check was than an hour ago. Assume user is logged in.
  // - Otherwise, send `AUTH_CHECK` to check against the API.
  /*
  // This needs to be awaited
  const isAuthenticated = await new Promise(resolve => { 
    BROWSER.runtime.sendMessage(
      { messageId: MESSAGE_IDS.AUTH_CHECK }, 
      response => resolve(response)
    );
  });

  // [3] If authenticated: 
  // - Send `FOLDERS_PULL_LIST` to refresh the list of available folders
  // - Send `ARCHIVE_PULL_TIMELINE` to fetch user-created archives for the current tab.
  if (isAuthenticated === true) {
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.FOLDERS_PULL_LIST });
    BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.ARCHIVE_PULL_TIMELINE });
  }
  */
});
