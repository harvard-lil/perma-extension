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
 * @param {?number} [folderId=null]
 * @async
 */
export async function foldersPick(folderId = null) {
  const status = await Status.fromStorage();
  const folders = await Folders.fromStorage();

  try {
    // If a `folderId` was passed:
    if (folderId) {
      // Validate (will throw if `folderId` is not a suitable folder id.)
      new PermaAPI().validateFolderId(folderId);
      folderId = parseInt(String(folderId));
    
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

    }
    // Make sure it's `null` otherwise (no default)
    else {
      folderId = null;
    }

    folders.pick = folderId;
  }
  catch(err) {
    status.message = "error_picking_folder";
    console.error(err);
    throw err;
  }
  finally {
    await status.save();
    await folders.save();
  }
}
