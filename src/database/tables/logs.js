/**
 * perma-extension
 * @module database/tables/logs
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class and utility functions for the `logs` table.
 */
/// <reference types="Dexie" />
// @ts-check

import { getDatabase } from '../index.js';

/**
 * Describes the indexes used by the `appState` table. 
 * See Dexie's documentation: https://dexie.org/docs/Version/Version.stores()#schema-syntax
 * @constant
 */
export const INDEXES = "++id";

class Log {
  /**
   * @type {number}
   */
  id;

  /**
   * If true, this log is considered to be an error.
   * @type {boolean}
   */
  isError = false;

  /**
   * Must match with an entry from `_locales`.
   * @type {string}
   */
  messageKey = "";

  /**
   * Date at which the logged event ocurred.
   * @type {Date}
   */
  created = new Date();

  /** 
   * Saves the current `Log` entry in the database.
   * @returns {Promise}
   */
  save() {
    return getTable().put(this, ["id"])
  }
}

/**
 * Returns a reference to the `logs` table from the database.
 * @returns {Dexie.Table}
 */
export function getTable() {
  return getDatabase().logs;
}

/**
 * Returns all entries from the `logs` table.
 * @returns {Promise<Log[]>}
 * @async
 */
 export async function getAll() {
  return await getTable().toArray();
}

/**
 * Returns the most recent entry from the `log` table.
 * @return {Promise<Log>}
 * @async
 */
export async function getMostRecent() {
  return await getTable().orderBy("id").reverse().limit(1).toArray()
}