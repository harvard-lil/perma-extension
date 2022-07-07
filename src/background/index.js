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
import { database } from "../database";

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
      await authSignIn(message["apiKey"]);
      break;

    case MESSAGE_IDS.AUTH_SIGN_OUT:
      await authSignOut();
      break;

    case MESSAGE_IDS.AUTH_CHECK:
      await authCheck();
      break;

    case MESSAGE_IDS.FOLDERS_PULL_LIST:
      await foldersPullList();
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

/**
 * Verifies and stores a Perma API key (`appState.permaApiKey`).
 * Called on `AUTH_SIGN_IN`.
 * @param {string} apiKey 
 * @returns {Promise<void>}
 * @async
 */
async function authSignIn(apiKey) {
  try {
    await database.appState.set("loadingBlocking", true);

    const api = new PermaAPI(String(apiKey)); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid
    await database.appState.set("permaApiKey", apiKey);
    await database.appState.set("permaApiKeyChecked", true);
  }
  catch(err) {
    await database.appState.set("permaApiKey", "");
    await database.appState.set("permaApiKeyChecked", false);
    await database.logs.add("status_invalid_api_key", true);
    throw err;
  }
  finally {
    await database.appState.set("lastApiKeyCheck", new Date());
    await database.appState.set("loadingBlocking", false);
  }
}

/**
 * Clears personal information from the database.
 * Called on `AUTH_SIGN_OUT`.
 * @returns {Promise<void>}
 * @async
 */
async function authSignOut() {
  await database.archives.clearAll();
  await database.logs.clearAll();
  await database.appState.clearAll();
  await database.logs.add("status_signed_out");
}

/**
 * Checks that the Perma API key stored in the database is valid. 
 * Clears user data (and throws) otherwise.
 * 
 * @returns {Promise<void>}
 * @async
 */
async function authCheck() {
  try {
    const apiKey = await database.appState.get("permaApiKey"); // Is there an API key in the database?
    const api = new PermaAPI(String(apiKey.value)); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid
  }
  // If the verification fails, clear any user-related data.
  catch(err) {
    authSignOut();
    throw err;
  }

}

/**
 * Pulls and stores the list of all the folders the user can write into. 
 * This data is stored in `appState.permaFolders`
 * 
 * Format:
 * ```
 * [
 *   { id: 158296, name: 'Personal Links' },
 *   { id: 161019, name: '- Foo' },
 *   { id: 161022, name: '- Lorem' },
 *   { id: 161020, name: '-- Bar' },
 *   { id: 161021, name: '-- Baz' },
 *   { id: 161023, name: '-- Ipsum' },
 *   { id: 161026, name: '--- Amet' },
 *   { id: 161024, name: '--- Dolor' },
 *   { id: 161025, name: '--- Sit' },
 *   { id: 161029, name: '---- Consequentur' }
 * ]
 * ```
 * 
 * @returns {Promise<void>}
 * @async
 */
async function foldersPullList() {
  /**
   * Utility function to recursively traverse the folders tree and append info to the `folders` array.
   * @param {number} folderId - Folder id of the parent
   * @param {array} folders - Reference to the `folders` array to append to
   * @param {PermaAPI} api - PermaAPI instance to use 
   * @param {number} [depth=1] - Used to represent the nesting level of the folders.
   */
  async function recursivePull(folderId, folders, api, depth=1) {
    const children = await api.pullFolderChildren(folderId);
  
    for (let child of children.objects) {
      folders.push({id: child.id, name: `${"-".repeat(depth)} ${child.name}`});
  
      if (child.has_children) {
        await recursivePull(child.id, folders, api, depth+1);
      }
    }
  }

  try {
    await database.appState.set("loadingBlocking", true);

    const apiKey = await database.appState.get("permaApiKey");
    const api = new PermaAPI(String(apiKey.value));
    const folders = [];

    const top = await api.pullTopLevelFolders();

    for (let folder of top.objects) {
      folders.push({id: folder.id, name: folder.name});
      await recursivePull(folder.id, folders, api, 1);
    }

    await database.appState.set("permaFolders", folders);
  }
  catch(err) {
    await database.logs.add("error_pulling_folders", true);
    throw err;
  }
  finally {
    await database.appState.set("loadingBlocking", false);
  }
}