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
import { BROWSER, MESSAGE_IDS } from "../constants/index.js";
import { Auth, Status, CurrentTab, Folders, Archives } from "../storage/index.js";

/**
 * Handles incoming messages.
 * This function runs for every incoming `runtime` message.
 * See `constants.MESSAGE_IDS` for details regarding the messages handled.
 *
 * @param {Object} message
 * @param {chrome.runtime.MessageSender} sender
 * @param {function} sendResponse
 */
function backgroundMessageHandler(message, sender, sendResponse) {
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

    case MESSAGE_IDS.FOLDERS_PICK:
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

    default:
      throw new Error(`Service Worker does not recognize message id ${message.messageId}`);
      break;
  }

  return true;
}
BROWSER.runtime.onMessage.addListener(backgroundMessageHandler);

/**
 * Updates the current tab in storage.
 * Will not go through if the extension is busy.
 * Called on `TAB_SWITCH`.
 * 
 * @param {string} url - Must be a valid url
 * @param {string} title
 * @param {Promise<void>}
 * @async
 */
async function tabSwitch(url, title) {
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

/**
 * Verifies and stores a Perma API key.
 * Called on `AUTH_SIGN_IN`.
 * 
 * @param {string} apiKey 
 * @returns {Promise<void>}
 * @async
 */
async function authSignIn(apiKey) {
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();

  try {
    status.isLoading = true;
    await status.save();

    const api = new PermaAPI(String(apiKey)); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid

    auth.apiKey = apiKey;
    auth.isChecked = true;

    status.message = "status_signed_in";
  }
  catch(err) {
    auth.apiKey = "";
    auth.isChecked = true;

    status.message = "error_verifying_api_key";
  }
  finally {
    status.isLoading = false;
    auth.lastCheck = new Date();

    await status.save();
    await auth.save();
  }
}

/**
 * Clears personal information from storage.
 * Called on `AUTH_SIGN_OUT`.
 * 
 * @returns {Promise<void>}
 * @async
 */
async function authSignOut() {
  const auth = await Auth.fromStorage();
  await auth.reset();

  const folders = await Folders.fromStorage();
  await folders.reset();

  const archives = await Archives.fromStorage();
  await archives.reset();

  const status = await Status.fromStorage();
  await status.reset();

  status.message = "status_signed_out";
  await status.save();
}

/**
 * Checks that the Perma API key currently stored is valid (if any). 
 * Clears user data (and throws) otherwise.
 * Called on `AUTH_CHECK`.
 * 
 * @returns {Promise<void>}
 * @async
 */
async function authCheck() {
  try {
    const auth = await Auth.fromStorage();

    if (!auth.apiKey || auth.apiKey == "") {
      throw new Error("No API key provided.");
    }

    const api = new PermaAPI(String(auth.apiKey)); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid
  }
  // If the verification fails, clear any user-related data.
  catch(err) {
    //console.error(err);
    authSignOut();
    throw err;
  }
}

/**
 * Pulls and stores the list of all the folders the user can write into. 
 * Called on `FOLDERS_PULL_LIST`.
 * 
 * See `storage.Folders.#available` for information regarding the expected format.
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
      if (child.read_only === true) {
        continue;
      }

      folders.push({id: child.id, name: `${"-".repeat(depth)} ${child.name}`});
  
      if (child.has_children) {
        await recursivePull(child.id, folders, api, depth+1);
      }
    }
  }

  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();
  const folders = await Folders.fromStorage();

  try {
    status.isLoading = true;
    await status.save();

    const api = new PermaAPI(String(auth.apiKey));

    const allFolders = [];
    const topFolder = await api.pullTopLevelFolders();

    for (let folder of topFolder.objects) {
      allFolders.push({id: folder.id, name: folder.name});
      await recursivePull(folder.id, allFolders, api, 1);
    }

    folders.available = allFolders;

    // Check if current value for `folders.pick` is still available.
    // Default to first folder or null otherwise
    if (folders.pick !== null) {
      let found = false;

      for (let folder of allFolders) {
        if (folder.id === folders.pick) {
          found = true;
          break;
        }
      }

      if (found === false) {
        folders.pick = null;
      }
    }

    if (folders.pick === null) {
      // Pick first folder as default
      if (folders.available && folders.available.length > 0) {
        folders.pick = folders.available[0]["id"];
      }
    }

  }
  catch(err) {
    status.message = "error_pulling_folders";
    throw err;
  }
  finally {
    status.isLoading = false;
    await status.save();

    await folders.save();
  }
}

/**
 * Stores the default folder id for future archives. 
 * Called on `FOLDERS_PICK`.
 * 
 * @param {number} folderId
 * @returns {Promise<void>}
 * @async
 */
async function foldersPick(folderId) {
  const status = await Status.fromStorage();
  const folders = await Folders.fromStorage();

  try {
    new PermaAPI().validateFolderId(folderId); // Will throw if `folderId` is not a suitable folder id.
    
    // Check that folderId exists in available folders
    let found = false;
    for (let folder of folders.available) {
      if (folder.id === folderId) {
        found = true;
        break;
      }
    }

    if (found == false) {
      throw new Error("`folderId` does not match a folder the user has write access to.");
    }

    folders.pick = folderId;
  }
  catch(err) {
    status.message = "error_picking_folder";
    //console.error(err);
    throw err;
  }
  finally {
    await status.save();
    await folders.save();
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
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();
  const currentTab = await CurrentTab.fromStorage();
  const archives = await Archives.fromStorage();

  try {
    status.isLoading = true;
    await status.save();

    const api = new PermaAPI(String(auth.apiKey));

    if (!currentTab.url) {
      throw new Error("`currentTab.url` is not set.");
    }

    const archivesFromAPI = await api.pullArchives(100, 0, currentTab.url);
    archives.byUrl[currentTab.url] = archivesFromAPI.objects;
  }
  catch(err) {
    status.message = "error_pulling_timeline";
    //console.error(err);
    throw err;
  }
  finally {
    status.isLoading = false;

    await archives.save();
    await status.save();
  }
}

/**
 * Creates a new archive.
 * Automatically updates timeline for the current tab.
 * Called on `ARCHIVE_CREATE_PUBLIC` and `ARCHIVE_CREATE_PRIVATE`.
 * 
 * @param {boolean} [isPrivate=false]
 * @returns {Promise<void>}
 * @async
 */
async function archiveCreate(isPrivate = false) {
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();
  const currentTab = await CurrentTab.fromStorage();
  const folders = await Folders.fromStorage();

  try {
    status.isLoading = true;
    await status.save();

    const api = new PermaAPI(String(auth.apiKey));

    if (!currentTab.url) {
      throw new Error("`currentTab.url` is not set.");
    }

    await api.createArchive(currentTab.url, {
      isPrivate: Boolean(isPrivate), 
      parentFolderId: folders.pick
    });

    status.message = "status_archive_created";

    await archivePullTimeline(); // Will update the timeline once the archive is created
  }
  catch(err) {
    status.message = "error_creating_archive";
    //console.error(err);
    throw err;
  }
  finally {
    status.isLoading = false;
    await status.save();
  }
}

/**
 * Tries to toggle the privacy status of a given archive.
 * Automatically updates timeline for the current tab.
 * Called on `ARCHIVE_PRIVACY_STATUS_TOGGLE`.
 * 
 * @param {string} guid
 * @param {boolean} [isPrivate=false]
 * @returns {Promise<void>}
 * @async
 */
async function archiveTogglePrivacyStatus(guid, isPrivate = false) {
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();

  try {
    status.isLoading = true;
    await status.save();

    const api = new PermaAPI(String(auth.apiKey));

    await api.editArchive(guid, {isPrivate: Boolean(isPrivate)});
    
    await archivePullTimeline(); // Will update the timeline once the archive is created
  }
  catch(err) {
    status.message = "error_toggling_archive_privacy_status";
    //console.error(err);
    throw err;
  }
  finally {
    status.isLoading = false;
    await status.save();
  }
}

/**
 * Tries to delete an archive.
 * Automatically updates timeline for the current tab.
 * Called on `ARCHIVE_DELETE`.
 * 
 * @param {string} guid
 * @returns {Promise<void>}
 * @async
 */
async function archiveDelete(guid) {
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();
  const currentTab = await CurrentTab.fromStorage();
  const folders = await Folders.fromStorage();

  try {
    status.isLoading = true;
    await status.save();

    const api = new PermaAPI(String(auth.apiKey));

    await api.deleteArchive(guid);

    status.message = "status_archive_deleted";
    
    await archivePullTimeline(); // Will update the timeline once the archive is created
  }
  catch(err) {
    status.message = "error_deleting_archive";
    //console.error(err);
    throw err;
  }
  finally {
    status.isLoading = false;
    await status.save();
  }
}
