/**
 * perma-extension
 * @module constants
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description App-wide constants.
 */
/// <reference types="@types/chrome" />
// @ts-check

/**
 * Identifiers for the runtime messages passed between the extension and its service worker. 
 * These are meant to be passed as `messageId`.
 * 
 * Usage example:
 * ```javascript
 * import { MESSAGE_IDS, BROWSER } from './constants'
 * 
 * // Sending a message, at popup level.
 * BROWSER.runtime.sendMessage({
 *  messageId: MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC,
 *  url: urlToArchive
 * });
 * 
 * // Receiving a message, at service-worker level.
 * BROWSER.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
 *   if (request.messageId === MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC) {
 *     // Code for handling the archive creation request
 *   }
 * });
 * ```
 * 
 * Message identifiers detail:
 * - `TAB_SWITCH`: Request to update the current tab of interest. Params: `url`, `title`.
 * - `AUTH_SIGN_IN`: Request to register an API key. Params: `apiKey`.
 * - `AUTH_SIGN_OUT`: Request to remove the currently stored API key.
 * - `AUTH_CHECK`: Request to check that the API currently stored is (still) valid.
 * - `FOLDERS_PULL_LIST`: Request to pull the list of folders the user can create links into.
 * - `FOLDERS_PICK_ONE`: Request to update the "default" target folder. Params: `folderId`.
 * - `ARCHIVE_PULL_TIMELINE`: Request to pull the list of user-owned archives available for the current url.
 * - `ARCHIVE_CREATE_PUBLIC`: Request to create a public archive for a given url.
 * - `ARCHIVE_CREATE_PRIVATE`: Request to create a private archive for a given url.
 * - `ARCHIVE_PRIVACY_STATUS_TOGGLE`: Request to toggle the privacy status of a given archive. Params: `guid`, `isPrivate`.
 * - `ARCHIVE_DELETE`: Request the deletion of an archive. Params: `guid`.
 * - `STATUS_CLEAN_UP`: Request a clean up of the status (i.e: recover from hanging loading state).
 * 
 * @constant 
 */
export const MESSAGE_IDS = {
  TAB_SWITCH: 1,
  AUTH_SIGN_IN: 2,
  AUTH_SIGN_OUT: 3,
  AUTH_CHECK: 4,
  FOLDERS_PULL_LIST: 5,
  FOLDERS_PICK_ONE: 6,
  ARCHIVE_PULL_TIMELINE: 7,
  ARCHIVE_CREATE_PUBLIC: 8,
  ARCHIVE_CREATE_PRIVATE: 9,
  ARCHIVE_PRIVACY_STATUS_TOGGLE: 10,
  ARCHIVE_DELETE: 11,
  STATUS_CLEAN_UP: 12
};

/**
 * Proxy for accessing the browser API, which in the case of Chromium-based browser, is vendor-specific.
 * Will throw if ran outside of a browser extension context.
 * @constant 
 */
export const BROWSER = (() => {
  if ("chrome" in globalThis) {
    return globalThis.chrome;
  }

  if ("browser" in globalThis) {
    return globalThis.browser;
  }

  throw new Error("WebExtensions API unavailable.");
})();

