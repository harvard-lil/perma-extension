/**
 * perma-extension
 * @module storage/Archives
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class used to interact with the "archives" key in storage (`browser.storage.local`).
 */
/// <reference types="@types/chrome" />
// @ts-check

import { BROWSER } from "../constants/index.js"

/**
 * This class directly interacts with `browser.storage.local` to push / pull and manage the "archives" key.
 */
export class Archives {
  /**
   * Key given to this object in `browser.storage.local`. 
   */
  static KEY = "archives";

  /**
   * Hashmap associating urls to list of archive objects.
   * 
   * @type {Object}
   */
  #byUrl = {};

  /**
   * Creates and returns an instance of `Folders` using data from storage.
   * Use this static method to load "folders" from storage.
   * 
   * Usage:
   * ```javascript
   * const status = await Folders.fromStorage();
   * ```
   * 
   * @return {Promise<Archives>}
   * @static
   * @async
   */
  static async fromStorage() {
    const archives = new Archives();
    const data = await BROWSER.storage.local.get([Archives.KEY]);

    if (Archives.KEY in data) {
      for (let [key, value] of Object.entries(data[Archives.KEY])) {
        archives[key] = value;
      }
    }

    return archives;
  }

  /**
   * Saves the current object in store.
   * Checks and validates `this.#byUrl` before saving to make sure it is an object of PermaArchive, indexed by url.
   * @returns {Promise<boolean>}
   * @async 
   */
  async save() {
    // Checks and validates `this.#byUrl`
    for (let [url, archives] of Object.entries(this.#byUrl)) {
      try {
        new URL(url); // Will throw if invalid
        
        for (let archive of archives) {
          // @ts-ignore
          archive.guid; // Will throw if not present
          // @ts-ignore
          archive.url; // Will throw if not present
        }
      }
      catch(err) {
        throw new Error("`byUrl` must be an object associating urls to an array of archive objects.");
      }
    }

    // Save
    const toSave = {};
    toSave[Archives.KEY] = {byUrl: this.#byUrl};

    await BROWSER.storage.local.set(toSave);
    return true;
  }

  /**
   * Replaces the current object in store with an "empty" one.
   * @returns {Promise<boolean>}
   * @async 
   */
  async reset() {
    await new Archives().save();
    return true;
  }

  /**
   * @param {Object} newValue
   */
  set byUrl(newValue) {
    if (!(newValue instanceof Object)) {
      throw new Error("`byUrl` must be an object.");
    }

    this.#byUrl = newValue;
  }

  get byUrl() {
    return this.#byUrl;
  }


}
