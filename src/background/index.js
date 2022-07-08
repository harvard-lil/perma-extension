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
 * See `constants.MESSAGE_IDS` for details regarding the messages handled.
 *
 * @param {Object} message
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
    case MESSAGE_IDS.TAB_SWITCH:
      await tabSwitch(message["url"], message["title"]);  
      break;

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

    case MESSAGE_IDS.FOLDERS_PICK:
      await foldersPick(message["folderId"]);
      break;

    case MESSAGE_IDS.ARCHIVE_PULL_TIMELINE:
      await archivePullTimeline();
      break;

    case MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC:
      await archiveCreate(false);
      break;

    case MESSAGE_IDS.ARCHIVE_CREATE_PRIVATE:
      await archiveCreate(true);
      break;

    case MESSAGE_IDS.ARCHIVE_PRIVACY_STATUS_TOGGLE:
      await archiveTogglePrivacyStatus(message["guid"], message["isPrivate"]);
      break;

    case MESSAGE_IDS.ARCHIVE_DELETE:
      await archiveDelete(message["guid"]);
      break;

    default:
      throw new Error(`Service Worker does not recognize message id ${message.messageId}`);
      break;
  }
}
BROWSER.runtime.onMessage.addListener(backgroundMessageHandler);

/**
 * Updates `appState.currentTabUrl` and `appState.currentTabTitle` if:
 * - Provided and valid.
 * - `appState.loadingBlocking` and `appState.loadingBackground` are not true.
 * 
 * Called on `TAB_SWITCH`.
 * 
 * @param {string} url
 * @param {string} title
 * @param {Promise<void>}
 * @async
 */
async function tabSwitch(url, title) {
  url = new URL(url).href; // Will throw if invalid;
  title = String(title);

  const loadingBlocking = await database.appState.get("loadingBlocking");
  const loadingBackground = await database.appState.get("loadingBackground");

  if (loadingBlocking && loadingBlocking.value === true) {
    return;
  }

  if (loadingBackground && loadingBackground.value === true) {
    return;
  }

  await database.appState.set("currentTabUrl", url);
  await database.appState.set("currentTabTitle", title);
}

/**
 * Verifies and stores a Perma API key (`appState.apiKey`).
 * Called on `AUTH_SIGN_IN`.
 * 
 * @param {string} apiKey 
 * @returns {Promise<void>}
 * @async
 */
async function authSignIn(apiKey) {
  try {
    await database.appState.set("loadingBlocking", true);

    const api = new PermaAPI(String(apiKey)); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid
    await database.appState.set("apiKey", apiKey);
    await database.appState.set("apiKeyChecked", true);
  }
  catch(err) {
    await database.appState.set("apiKey", "");
    await database.appState.set("apiKeyChecked", false);
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
 * 
 * @returns {Promise<void>}
 * @async
 */
async function authSignOut() {
  await database.archives.clearAll();
  //await database.logs.clearAll();
  await database.appState.clearAll();
  await database.logs.add("status_signed_out");
}

/**
 * Checks that the Perma API key stored in the database is valid. 
 * Clears user data (and throws) otherwise.
 * Called on `AUTH_CHECK`.
 * 
 * @returns {Promise<void>}
 * @async
 */
async function authCheck() {
  try {
    const apiKey = await database.appState.get("apiKey"); // Is there an API key in the database?
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
 * This data is stored in `appState.folders`
 * Called on `FOLDERS_PULL_LIST`.
 * 
 * `folders` format:
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

    const apiKey = await database.appState.get("apiKey");
    const api = new PermaAPI(String(apiKey.value));

    const folders = [];

    const top = await api.pullTopLevelFolders();

    for (let folder of top.objects) {
      folders.push({id: folder.id, name: folder.name});
      await recursivePull(folder.id, folders, api, 1);
    }

    await database.appState.set("folders", folders);
  }
  catch(err) {
    await database.logs.add("error_pulling_folders", true);
    throw err;
  }
  finally {
    await database.appState.set("loadingBlocking", false);
  }
}

/**
 * Sets `appState.currentFolder`.
 * Called on `FOLDERS_PICK`.
 * 
 * @param {number} folderId
 * @returns {Promise<void>}
 * @async
 */
async function foldersPick(folderId) {
  try {
    new PermaAPI().validateFolderId(folderId); // Will throw if `folderId` is not a suitable folder id.
    await database.appState.set("currentFolder", folderId);
  }
  catch(err) {
    await database.logs.add("error_picking_folder", true);
    throw err;
  }
}

/**
 * Pulls and stores a list archives created by the user for the current tab.
 * Clears user data (and throws) otherwise.
 * Called on `ARCHIVE_PULL_TIMELINE`.
 * 
 * @returns {Promise<void>}
 * @async
 */
async function archivePullTimeline() {
  try {
    await database.appState.set("loadingBlocking", true);

    const apiKey = await database.appState.get("apiKey");
    const api = new PermaAPI(String(apiKey.value));

    const currentTabUrl = await database.appState.get("currentTabUrl");

    if (!currentTabUrl || currentTabUrl.value) {
      throw new Error("`currentTabUrl` is not set.");
    }

    const archives = await api.pullArchives(100, 0, currentTabUrl.value);

    for (let archive of archives.objects) {
      await database.archives.add(archive);
    }
  }
  catch(err) {
    await database.logs.add("error_pulling_timeline", true);
    throw err;
  }
  finally {
    await database.appState.set("loadingBlocking", false);
  }
}

/**
 * Creates a new archive.
 * Automatically calls `archivePullTimeline` to update the timeline for the current tab.
 * Called on `ARCHIVE_CREATE_PUBLIC` and `ARCHIVE_CREATE_PRIVATE`.
 * 
 * @param {boolean} [isPrivate=false]
 * @returns {Promise<void>}
 * @async
 */
async function archiveCreate(isPrivate = false) {
  try {
    await database.appState.set("loadingBlocking", true);

    const apiKey = await database.appState.get("apiKey");
    const api = new PermaAPI(String(apiKey.value));

    const currentTabUrl = await database.appState.get("currentTabUrl");
    const currentFolder = await database.appState.get("currentFolder");

    if (!currentTabUrl || currentTabUrl.value) {
      throw new Error("`currentTabUrl` is not set.");
    }

    if (!currentFolder || currentFolder.value) {
      throw new Error("`currentFolder` is not set.");
    }

    await api.createArchive(currentTabUrl.value, {
      isPrivate: Boolean(isPrivate), 
      parentFolderId: currentFolder.value
    });

    await archivePullTimeline(); // Will update the timeline once the archive is created
  }
  catch(err) {
    await database.logs.add("error_creating_archive", true);
    throw err;
  }
  finally {
    await database.appState.set("loadingBlocking", false);
  }
}

/**
 * Tries to toggle the privacy status of a given archive.
 * Automatically calls `archivePullTimeline` to update the timeline for the current tab.
 * Called on `ARCHIVE_PRIVACY_STATUS_TOGGLE`.
 * 
 * @param {string} guid
 * @param {boolean} [isPrivate=false]
 * @returns {Promise<void>}
 * @async
 */
async function archiveTogglePrivacyStatus(guid, isPrivate = false) {
  try {
    await database.appState.set("loadingBlocking", true);

    const apiKey = await database.appState.get("apiKey");
    const api = new PermaAPI(String(apiKey.value));

    await api.editArchive(guid, {isPrivate: Boolean(isPrivate)});
    
    await archivePullTimeline(); // Will update the timeline once the archive is created
  }
  catch(err) {
    await database.logs.add("error_toggling_archive_privacy_status", true);
    throw err;
  }
  finally {
    await database.appState.set("loadingBlocking", false);
  }
}

/**
 * Tries to delete an archive.
 * Automatically calls `archivePullTimeline` to update the timeline for the current tab.
 * Called on `ARCHIVE_DELETE`.
 * 
 * @param {string} guid
 * @returns {Promise<void>}
 * @async
 */
async function archiveDelete(guid) {
  try {
    await database.appState.set("loadingBlocking", true);

    const apiKey = await database.appState.get("apiKey");
    const api = new PermaAPI(String(apiKey.value));

    await api.deleteArchive(guid);
    
    await archivePullTimeline(); // Will update the timeline once the archive is created
  }
  catch(err) {
    await database.logs.add("error_deleting_archive", true);
    throw err;
  }
  finally {
    await database.appState.set("loadingBlocking", false);
  }
}