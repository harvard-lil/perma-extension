/**
 * perma-extension
 * @module background/foldersPick
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `FOLDERS_PICK` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Status, Folders } from "../storage/index.js";

/**
 * Handler for the `FOLDERS_PICK` runtime message: 
 * Sets `appState.currentFolder`.
 * Stores the default folder id for future archives. 

 * 
 * @param {number} folderId
 * @async
 */
export async function foldersPick(folderId) {
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
