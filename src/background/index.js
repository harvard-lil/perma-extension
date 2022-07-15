/**
 * perma-extension
 * @module background
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entrypoint of the extension's service worker. Handles incoming runtime messages and time-based background tasks.
 */
/// <reference types="@types/chrome" />
// @ts-check
import { BROWSER, MESSAGE_IDS } from "../constants/index.js";

import { archiveCreate } from "./archiveCreate.js";
import { archiveDelete } from "./archiveDelete.js";
import { archivePullTimeline } from "./archivePullTimeline.js";
import { archiveTogglePrivacyStatus } from "./archiveTogglePrivacyStatus.js";
import { authCheck } from "./authCheck.js";
import { authSignIn } from "./authSignIn.js";
import { authSignOut } from "./authSignOut.js";
import { foldersPick } from "./foldersPick.js";
import { foldersPullList } from "./foldersPullList.js";
import { statusCleanUp } from "./statusCleanUp.js";
import { tabSwitch } from "./tabSwitch.js";

/**
 * Set a 1-minute "alarm" cycle for this service worker.
 */
chrome.alarms.create("background-1-minute", { periodInMinutes: 1 });

/**
 * Listens and handles incoming alarm cycles.
 * 
 * Alarms handled:
 * - `background-1-minute`: Send `STATUS_CLEAN_UP`
*/
chrome.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case "background-1-minute":
      backgroundMessageHandler({messageId: MESSAGE_IDS.STATUS_CLEAN_UP})
      break;
  }
});

/**
 * Handles incoming messages.
 * This function runs for every incoming `runtime` message.
 * See `constants.MESSAGE_IDS` for details regarding the messages handled.
 *
 * @param {Object} message
 * @param {chrome.runtime.MessageSender} [sender]
 * @param {function} [sendResponse]
 */
function backgroundMessageHandler(message, sender = {}, sendResponse = ()=>{}) {
  // Ignore messages that don't have a `messageId` property.
  if (!message.messageId) {
    return sendResponse(false);
  }

  switch (message.messageId) {
    case MESSAGE_IDS.TAB_SWITCH:
      tabSwitch(message["url"], message["title"])
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.AUTH_SIGN_IN:
      authSignIn(message["apiKey"])
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.AUTH_SIGN_OUT:
      authSignOut()
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.AUTH_CHECK:
      authCheck()
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.FOLDERS_PULL_LIST:
      foldersPullList()
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.FOLDERS_PICK_ONE:
      foldersPick(message["folderId"])
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.ARCHIVE_PULL_TIMELINE:
      archivePullTimeline()
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC:
      archiveCreate(false)
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.ARCHIVE_CREATE_PRIVATE:
      archiveCreate(true)
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.ARCHIVE_PRIVACY_STATUS_TOGGLE:
      archiveTogglePrivacyStatus(message["guid"], message["isPrivate"])
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.ARCHIVE_DELETE:
      archiveDelete(message["guid"])
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    case MESSAGE_IDS.STATUS_CLEAN_UP:
      statusCleanUp()
        .then(() => sendResponse(true))
        .catch(() => sendResponse(false));
      break;

    default:
      throw new Error(`Service Worker does not recognize message id ${message.messageId}`);
      break;
  }

  return true;
}
BROWSER.runtime.onMessage.addListener(backgroundMessageHandler);
