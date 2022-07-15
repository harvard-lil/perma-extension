/**
 * perma-extension
 * @module storage
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entry point for storage management classes. Exports all individual data classes used to interact with `browser.storage.local`.
 */
/// <reference types="@types/chrome" />
// @ts-check

import { Auth } from "./Auth.js";
import { Status } from "./Status.js";
import { CurrentTab } from "./CurrentTab.js";
import { Folders } from "./Folders.js";
import { Archives } from "./Archives.js";

/**
 * Exports all individual data classes used to interact with `browser.storage.local`.
 * 
 * Usage example:
 * ```javascript
 * import { CurrentTab } from "../storage/index.js";
 * 
 * const tab = await CurrentTab.fromStorage();
 * tab.url = "https://lil.harvard.edu";
 * tab.title = "Harvard Library Innovation Lab";
 * await tab.save();
 * ```
 * 
 * Observing changes on a given key:
 * ```
 * browser.storage.local.onChanged.addListener((change) => {
 *  // `CurrentTab.KEY` can be used to check if the "currentTab" object has just been updated.
 * })
 * ```
 * 
 * Related documentation:
 * - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
 * - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/onChanged
 */
export {
  Auth,
  Status,
  CurrentTab,
  Folders,
  Archives
}