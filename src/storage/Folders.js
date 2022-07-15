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
 */
export class Folders {
  /**
   * Key given to this object in `browser.storage.local`. 
   */
  static KEY = "folders";

  /**
   * Id of the folder the user picked as its default.
   * @type {?number}
   */
  #pick = null;

  /**
   * List of all the folders the user can write into, sorted hierarchically.
   * 
   * Format: 
   * [
   *   { id: 158296, depth: 0, name: 'Personal Links' },
   *   { id: 161019, depth: 1, name: 'Foo' },
   *   { id: 161022, depth: 1, name: 'Lorem' },
   *   { id: 161020, depth: 2, name: 'Bar' },
   *   { id: 161021, depth: 2, name: 'Baz' },
   *   { id: 161023, depth: 2, name: 'Ipsum' },
   *   { id: 161026, depth: 3, name: 'Amet' },
   *   { id: 161024, depth: 3, name: 'Dolor' },
   *   { id: 161025, depth: 3, name: 'Sit' },
   *   { id: 161029, depth: 4, name: 'Consequentur' }
   * ]
   * @type {Object[]}
   */
  #available = [];

  /**
   * Creates and returns an instance of `Folders` using data from storage.
   * Use this static method to load "folders" from storage.
   * 
   * Usage:
   * ```javascript
   * const status = await Folders.fromStorage();
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
   * Checks and validates `this.#available` before saving to make sure it is an array of objects containing `id` and `name`.
   * 
   * @returns {Promise<boolean>}
   * @async 
   */
  async save() {
    // Checks and filters `this.#available`
    const availableFiltered = [];

    for (let entry of this.#available) {
      if (!("id" in entry) || !("name" in entry) || !("depth" in entry)) {
        throw new Error(
          "`available` must be an array of objects containing at least `id` and `name`."
        );
      }

      availableFiltered.push({
        id: parseInt(entry.id),
        depth: parseInt(entry.depth),
        name: entry.name,
      });
    }

    this.#available = availableFiltered;

    // Save
    const toSave = {};
    toSave[Folders.KEY] = {
      pick: this.#pick,
      available: this.#available
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
   * @param {Array} newValue
   */
  set available(newValue) {
    if (!(newValue instanceof Array)) {
      throw new Error("`available` must be an array.");
    }

    this.#available = newValue;
  }

  get available() {
    return this.#available;
  }

}
