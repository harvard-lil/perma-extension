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
 * Send `TAB_SWITCH` message on popup open
 */
document.addEventListener("DOMContentLoaded", async(e) => {
  let [tab] = await BROWSER.tabs.query({ active: true, lastFocusedWindow: true });

  BROWSER.runtime.sendMessage({
    messageId: MESSAGE_IDS.TAB_SWITCH,
    url: tab.url,
    title: tab.title
  });
});
