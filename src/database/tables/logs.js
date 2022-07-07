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

export class Log {
  /**
   * Auto-increment identifier. Leave blank when creating a new entry.
   * @type {number}
   */
  id;

  /**
   * If true, this log is considered to be an error.
   * @type {boolean}
   */
  isError = false;

  /**
   * Should match with an entry from `browser.i18n`.
   * @type {string}
   */
  messageKey = "";

  /**
   * Date at which the log entry was added.
   * @type {Date}
   */
  createdAt = new Date();

  /** 
   * Saves the current `Log` entry in the database.
   * @returns {Promise<number>} - Id of the new entry
   */
  save() {
    return getTable().put(this)
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
 * @return {Promise<?Log>}
 * @async
 */
export async function getMostRecent() {
  const entries = await getTable().orderBy("id").reverse().limit(1).toArray();
  return entries.length > 0 ? entries[0] : null;
}

/**
 * Clears the `logs` table.
 * @returns {Promise<void>} 
 * @async
 */
 export async function clearAll() {
  return await getTable().clear();
}

/**
 * Creates a new log entry.
 * @param {string} messageKey - Should match a key from `browser.i18n`.
 * @param {boolean} [isError=false]
 * @return {Promise<Log>}
 * @async
 */
export async function add(messageKey, isError = false) {
  const entry = new Log();

  entry.messageKey = String(messageKey);
  entry.isError = Boolean(isError);

  await entry.save();
  return entry;
}