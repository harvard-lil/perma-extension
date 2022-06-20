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
 * ```
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
 * - `AUTH_SIGN_IN`: Request to register an API key (2nd param: `apiKey`).
 * - `AUTH_SIGN_OUT`: Request to remove the currently stored API key.
 * - `FOLDERS_PULL_LIST`: Request to pull the list of folders the user can create links into.
 * - `ARCHIVE_PULL_TIMELINE`: Request to pull the list of user-owned archives available for the given url (2nd param: `url`).
 * - `ARCHIVE_CREATE_PUBLIC`: Request to create a public archive for a given url (2nd param: `url`).
 * - `ARCHIVE_CREATE_PRIVATE`: Request to create a private archive for a given url (2nd param: `url`).
 * - `ARCHIVE_PRIVACY_STATUS_TOGGLE: Request to toggle the privacy status of a given archive (2nd param: `guid`)
 * 
 * @constant 
 */
export const MESSAGE_IDS = {
  AUTH_SIGN_IN: 1,
  AUTH_SIGN_OUT: 2,
  FOLDERS_PULL_LIST: 3,
  ARCHIVE_PULL_TIMELINE: 4,
  ARCHIVE_CREATE_PUBLIC: 5,
  ARCHIVE_CREATE_PRIVATE: 6,
  ARCHIVE_PRIVACY_STATUS_TOGGLE: 7,
};

/**
 * Name used by the extension's main IndexedDB database.
 * @constant
 */
export const DATABASE_NAME = 'permaExtDb';

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

  throw new Error("WebExtension API unavailable.");
})();

