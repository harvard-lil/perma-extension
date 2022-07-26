/**
 * perma-extension
 * @module background/foldersPullList
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `FOLDERS_PULL_LIST` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Folders } from "../storage/index.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `FOLDERS_PULL_LIST` runtime message:
 * Pulls and stores the list of all the folders the user can write into, sorted hierarchically.
 * 
 * See `storage.Folders.#available` for information regarding the expected format.
 * 
 * @returns {Promise<void>}
 * @async
 */
export async function foldersPullList() {
  const auth = await Auth.fromStorage();
  const folders = await Folders.fromStorage();

  try {
    const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);

    const allFolders = [];
    const topFolder = await api.pullTopLevelFolders();

    // Pull sorted list of folders the user has access to, in the format expected by Folders.available.
    for (let folder of topFolder.objects) {
      allFolders.push({
        id: folder.id,
        depth: 0,
        name: folder.name,
      });
      await recursivePull(folder.id, allFolders, api, 1);
    }

    folders.available = allFolders;

    // Check if current value for `folders.pick` is still available.
    // Default to first folder or null otherwise.
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

    // If no folder was picked, use the first one available
    if (folders.pick === null) {
      if (folders.available && folders.available.length > 0) {
        folders.pick = folders.available[0]["id"];
      }
    }

  }
  catch(err) {
    throw err;
  }
  finally {
    await folders.save();
  }
}

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

    folders.push({
      id: child.id,
      depth: depth,
      name: child.name,
    });

    if (child.has_children) {
      await recursivePull(child.id, folders, api, depth+1);
    }
  }
}