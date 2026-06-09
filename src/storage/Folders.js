/**
 * perma-extension
 * @module storage/Folders
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class used to interact with the "folders" key in storage (`browser.storage.local`).
 */
/// <reference types="@types/chrome" />
// @ts-check

import { BROWSER } from "../constants/index.js"

/**
 * This class directly interacts with `browser.storage.local` to push / pull and manage the "folders" key.
 *
 * Folders are navigated as a lazy cascade rather than loaded all at once: only the folders along
 * the path the user has opened are fetched (top-level on open, a folder's children when it is
 * selected). This keeps loading O(depth) instead of O(tree size) — registrar users can have very
 * large trees. See `background/foldersPullList` and `background/foldersPick`.
 */
export class Folders {
  /**
   * Key given to this object in `browser.storage.local`.
   */
  static KEY = "folders";

  /**
   * Id of the folder the user picked as the capture target (the deepest folder selected in the
   * cascade). Read by `archiveCreate` as `parentFolderId`.
   * @type {?number}
   */
  #pick = null;

  /**
   * Selected folder id at each cascade level. `path[i]` is the folder chosen in the i-th select.
   * The last entry is the current target (`pick`). Empty until a folder is chosen.
   * @type {number[]}
   */
  #path = [];

  /**
   * Option lists for each cascade level. `levels[0]` is the top-level folders; `levels[i]` (i > 0)
   * is the children of `path[i - 1]`. Each entry is `{ id, name, hasChildren }` (read-only folders,
   * which can't be capture targets, are filtered out upstream).
   * @type {Array<Array<{id: number, name: string, hasChildren: boolean}>>}
   */
  #levels = [];

  /**
   * Creates and returns an instance of `Folders` using data from storage.
   * Use this static method to load "folders" from storage.
   *
   * Usage:
   * ```javascript
   * const folders = await Folders.fromStorage();
   * ```
   *
   * @return {Promise<Folders>}
   * @static
   * @async
   */
  static async fromStorage() {
    const folders = new Folders();
    const data = await BROWSER.storage.local.get([Folders.KEY]);

    if (Folders.KEY in data) {
      for (let [key, value] of Object.entries(data[Folders.KEY])) {
        folders[key] = value;
      }
    }

    return folders;
  }

  /**
   * Saves the current object in store.
   * @returns {Promise<boolean>}
   * @async
   */
  async save() {
    const toSave = {};
    toSave[Folders.KEY] = {
      pick: this.#pick,
      path: this.#path,
      levels: this.#levels
    };

    await BROWSER.storage.local.set(toSave);
    return true;
  }

  /**
   * Replaces the current object in store with an "empty" one.
   * @returns {Promise<boolean>}
   * @async
   */
  async reset() {
    await new Folders().save();
    return true;
  }

  /**
   * @param {?any} newValue - Will be run through `parseInt`.
   */
  set pick(newValue) {
    this.#pick = newValue === null ? null : parseInt(newValue);
  }

  get pick() {
    return this.#pick;
  }

  /**
   * @param {number[]} newValue - Selected folder id per cascade level.
   */
  set path(newValue) {
    if (!(newValue instanceof Array)) {
      throw new Error("`path` must be an array.");
    }

    this.#path = newValue.map((id) => parseInt(id));
  }

  get path() {
    return this.#path;
  }

  /**
   * @param {Array} newValue - Option lists, one per cascade level.
   */
  set levels(newValue) {
    if (!(newValue instanceof Array)) {
      throw new Error("`levels` must be an array.");
    }

    this.#levels = newValue;
  }

  get levels() {
    return this.#levels;
  }

}
