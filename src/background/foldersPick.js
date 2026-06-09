/**
 * perma-extension
 * @module background/foldersPick
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `FOLDERS_PICK_ONE` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Folders } from "../storage/index.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Maps `PermaFolder` objects from the API into the lightweight option shape stored in
 * `Folders.levels`. Read-only folders are dropped: they can't be capture targets.
 *
 * @param {Array} permaFolders - `PermaFolder[]` as returned by the API.
 * @returns {Array<{id: number, name: string, hasChildren: boolean}>}
 */
export function toFolderOptions(permaFolders) {
  return permaFolders
    .filter((folder) => folder.read_only !== true)
    .map((folder) => ({
      id: folder.id,
      name: folder.name,
      hasChildren: Boolean(folder.has_children),
    }));
}

/**
 * Selects a folder at a given cascade level, mutating `folders` in place (does not save):
 * - Sets it as the current capture target (`pick`) and truncates any deeper selection.
 * - If the folder has children, lazily fetches them and adds the next cascade level.
 * - An empty `folderId` clears the selection at this level ("file in the parent folder").
 *
 * Shared by `foldersPullList` (to default-select the first top-level folder) and `foldersPick`.
 *
 * @param {Folders} folders - Folders storage object to mutate.
 * @param {PermaAPI} api - Authenticated API instance, used to fetch children on demand.
 * @param {number} level - Cascade level being changed (0 = top-level).
 * @param {?(number|string)} folderId - Folder selected at this level, or empty to clear it.
 * @returns {Promise<void>}
 * @async
 */
export async function selectFolder(folders, api, level, folderId) {
  const levels = folders.levels;

  // Empty selection: "use the parent folder". Drop this selection and any deeper level.
  if (!folderId) {
    folders.path = folders.path.slice(0, level);
    folders.pick = folders.path.length ? folders.path[folders.path.length - 1] : null;
    folders.levels = levels.slice(0, level + 1);
    return;
  }

  folderId = parseInt(folderId);
  folders.path = [...folders.path.slice(0, level), folderId];
  folders.pick = folderId;

  // Reveal the next cascade level only if the chosen folder actually has children.
  const option = (levels[level] || []).find((o) => o.id === folderId);

  if (option && option.hasChildren) {
    const children = await api.pullFolderChildren(folderId, 300);
    folders.levels = [...levels.slice(0, level + 1), toFolderOptions(children.objects)];
  }
  else {
    folders.levels = levels.slice(0, level + 1);
  }
}

/**
 * Handler for the `FOLDERS_PICK_ONE` runtime message:
 * Updates the folder cascade when the user changes a selection at a given level.
 *
 * @param {number} level - Cascade level being changed (0 = top-level).
 * @param {?(number|string)} folderId - Folder selected at this level, or empty to clear it.
 * @returns {Promise<void>}
 * @async
 */
export async function foldersPick(level = 0, folderId = null) {
  const auth = await Auth.fromStorage();
  const folders = await Folders.fromStorage();

  const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);
  await selectFolder(folders, api, parseInt(level), folderId);

  await folders.save();
}
