/**
 * perma-extension
 * @module database/tables/appState
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class and utility functions for the `appState` table.
 */
/// <reference types="Dexie" />
// @ts-check

import { getDatabase } from '../index.js';

/**
 * Lists keys that can be used to store data in the `appState` table, alongside their suggested type.
 * `AppState` uses this object to enforce key names checks.
 * There can only be 1 entry for a given key from list in the `appState` table.
 *
 * Keys detail:
 * - `apiKey`: API key for Perma.cc, as provided by the user.
 * - `apiKeyChecked`: If true, indicates that the API key currently in store has been checked. 
 * - `lastApiKeyCheck`: Date (+time) at which the API key was checked for the last time.
 * - `loadingBlocking`: If `true`, indicates that the app is currently performing an operation that should be considered blocking, UI wise.
 * - `loadingBackground`: If `true`, indicates that the app is currently performing an operation that should be considered a non-blocking, UI wise.
 * - `folders`: Sorted array containing key/value associations (id -> name) of folders the user can write into.
 * - `currentFolder`: Id of the folder the user selected (last) as a destination.
 * - `currentTabUrl`: Url of the current tab.
 * - `currentTabTitle`: Title of the current tab.
 * 
 * @constant
 */ 
export const KEYS = {
  "apiKey": String,
  "apiKeyChecked": Boolean,
  "lastApiKeyCheck": Date,
  "loadingBlocking": Boolean,
  "loadingBackground": Boolean,
  "currentFolder": Number,
  "folders": Array,
  "currentTabUrl": String,
  "currentTabTitle": String
};

/**
 * Describes the indexes used by the `appState` table. 
 * See Dexie's documentation: https://dexie.org/docs/Version/Version.stores()#schema-syntax
 * @constant
 */
export const INDEXES = "&key";

/**
 * Data class for the "appState" database store. Represents a single piece of app state information.
 */
export class AppState {
  /** 
   * Key used as an index to store this piece of user information.
   * Must be a key of `database.appState.KEYS
   * @type {string} 
   */
  key;

  /** 
   * Value associated with this entry.
   * @type {?any} 
   */
  value = null;

  /** 
   * Saves the current `AppState` entry in the database.
   * - If an entry already exists for the current key, the record will be replaced.
   * 
   * @returns {Promise<number>} - Id of the entry that was created.
   */
   save() {
    const validKeys = Object.keys(KEYS);

    if (!this.key || typeof this.key !== 'string') {
      throw new Error(`UserInfo.key is required and must be a string.`);
    }

    if (!validKeys.includes(this.key)) {
      throw new Error(`"${this.key}" is not a valid value for UserInfo.key. Can be: ${validKeys.join(', ')}`)
    }

    if (KEYS[this.key] === Boolean) {
      this.value = this.value ? true : false;
    }

    if (KEYS[this.key] === Number) {
      this.value = Number(this.value);
    }

    if (KEYS[this.key] === Date) {
      if (this.value instanceof Date !== true) {
        this.value = new Date(this.value);
      }
    }

    if (KEYS[this.key] === String && this.value !== undefined && this.value !== null) {
      this.value = String(this.value);
    }    

    return getTable().put(this, "key");
  }

}

/**
 * Returns a reference to the `appState` table from the database.
 * @returns {Dexie.Table}
 */
export function getTable() {
  return getDatabase()["appState"];
}

/**
 * Returns all entries from the `appState` table.
 * @returns {Promise<AppState[]>}
 * @async
 */
export async function getAll() {
  return await getTable().toArray();
}

/**
 * Returns all entries from the `appState` table as a key / value association.
 * @returns {Promise<Object>}
 * @async
 */
export async function getAllAsMap() {
  const all = {};
  
  for (let entry of await getAll()) {
    all[entry.key] = entry.value;
  }

  return all;
}

/**
 * Return a specific entry from user entry by key.
 * @param {string} key - Must be a key of `database.appState.KEYS
 * @returns {Promise<?AppState>}
 * @async
 */
export async function get(key) {
  return await getTable().get(key);
}

/**
 * Clears the `appState` table.
 * @returns {Promise<void>} 
 * @async
 */
export async function clearAll() {
  return await getTable().clear();
}

/**
 * Creates or updates a single entry in the `appState` table.
 * @param {string} key - Must be a key of `database.appState.KEYS.
 * @param {any} value 
 * @returns {Promise<AppState>}
 * @async
 */
export async function set(key, value) {
  let entry = new AppState();
  
  entry.key = key;
  entry.value = value;
  
  await entry.save();
  return entry;
}
