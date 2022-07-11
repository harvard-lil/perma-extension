/**
 * perma-extension
 * @module background/tabSwitch
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `TAB_SWITCH` runtime message.
 */
// @ts-check

import { Status, CurrentTab } from "../storage/index.js";

/**
 * Handler for the `TAB_SWITCH` runtime message:
 * Updates the current tab in storage.
 * Will not go through if the extension is busy.
 * 
 * @param {string} url - Must be a valid url
 * @param {string} title
 * @param {Promise<void>}
 * @async
 */
export async function tabSwitch(url, title) {
  url = new URL(url).href; // Will throw if invalid;
  title = String(title);

  const status = await Status.fromStorage();
  const currentTab = await CurrentTab.fromStorage();

  // Do not update tab if the extension is busy
  if (status.isLoading === true) {
    return;
  }

  currentTab.url = url;
  currentTab.title = title;
  await currentTab.save();
}
