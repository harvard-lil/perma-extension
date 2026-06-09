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
import { selectFolder, toFolderOptions } from "./foldersPick.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `FOLDERS_PULL_LIST` runtime message:
 * Loads the user's top-level folders into the first cascade level, then restores the previously
 * selected folder path if it still exists (so the choice persists across popup opens), falling
 * back to the first top-level folder otherwise. Deeper folders are fetched lazily, only along the
 * restored path (see `foldersPick`), so this stays an O(depth) operation regardless of tree size.
 *
 * @returns {Promise<void>}
 * @async
 */
export async function foldersPullList() {
  const auth = await Auth.fromStorage();
  const folders = await Folders.fromStorage();

  const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);

  // Remember the previous selection before rebuilding the cascade from a fresh top-level pull.
  const savedPath = [...folders.path];

  const topLevel = await api.pullTopLevelFolders(300);
  folders.levels = [toFolderOptions(topLevel.objects)];
  folders.path = [];
  folders.pick = null;

  // Restore the remembered path, level by level, as far as the folders still exist.
  for (let level = 0; level < savedPath.length; level++) {
    const options = folders.levels[level];

    if (!options || !options.some((o) => o.id === savedPath[level])) {
      break; // Folder no longer exists at this level: keep the valid prefix.
    }

    await selectFolder(folders, api, level, savedPath[level]);
  }

  // Nothing restored (no prior selection, or it's gone): default to the first top-level folder.
  if (folders.pick === null && folders.levels[0].length > 0) {
    await selectFolder(folders, api, 0, folders.levels[0][0].id);
  }

  await folders.save();
}
