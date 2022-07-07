/**
 * perma-extension
 * @module background
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entrypoint of the extension's service worker. Handles incoming runtime messages and time-based background tasks.
 */
/// <reference types="@types/chrome" />
// @ts-check
import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { BROWSER, MESSAGE_IDS } from "../constants";

/**
 * Handles incoming messages.
 * This function runs for every incoming `runtime` message.
 * See constants.MESSAGE_IDS for details regarding the messages handled.
 *
 * @param {object} message
 * @param {chrome.runtime.MessageSender} [sender]
 * @param {function} [sendResponse]
 * @returns {Promise}
 * @async
 */
async function backgroundMessageHandler(message, sender, sendResponse) {
  // Ignore messages that don't have a `messageId` property.
  if (!message.messageId) {
    return;
  }

  switch (message.messageId) {
    case MESSAGE_IDS.AUTH_SIGN_IN:
      console.log("AUTH_SIGN_IN");
      break;

    case MESSAGE_IDS.AUTH_SIGN_OUT:
      console.log("AUTH_SIGN_OUT");
      break;

    case MESSAGE_IDS.AUTH_CHECK:
      console.log("AUTH_CHECK");
      break;

    case MESSAGE_IDS.FOLDERS_PULL_LIST:
      console.log("FOLDERS_PULL_LIST");
      break;

    case MESSAGE_IDS.ARCHIVE_PULL_TIMELINE:
      console.log("ARCHIVE_PULL_TIMELINE");
      break;

    case MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC:
      console.log("ARCHIVE_CREATE_PUBLIC");
      break;

    case MESSAGE_IDS.ARCHIVE_CREATE_PRIVATE:
      console.log("ARCHIVE_CREATE_PRIVATE");
      break;

    case MESSAGE_IDS.ARCHIVE_PRIVACY_STATUS_TOGGLE:
      console.log("ARCHIVE_PRIVACY_STATUS_TOGGLE");
      break;

    default:
      throw new Error(`Service Worker does not recognize message id ${message.messageId}`);
      break;
  }

}
BROWSER.runtime.onMessage.addListener(backgroundMessageHandler);
