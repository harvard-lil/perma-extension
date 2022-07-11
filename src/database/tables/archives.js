/**
 * perma-extension
 * @module database/tables/archives
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class and utility functions for the `archives` table.
 */
/// <reference types="Dexie" />
// @ts-check

import { PermaAPI } from '@harvard-lil/perma-js-sdk';
import { getDatabase } from '../index.js';

/**
 * Describes the indexes used by the `archives` table. 
 * See Dexie's documentation: https://dexie.org/docs/Version/Version.stores()#schema-syntax
 * @constant
 */
export const INDEXES = "guid,url";

/**
 * Data class for the "archives" database store.
 */
export class Archive {
    /**
     * Should be taken from PermaArchive.guid.
     * @type {?string}
     */
    guid = null;

    /**
     * Should be taken from PermaArchive.url.
     * @type {?string}
     */
    url = null;

    /**
     * @type {?PermaArchive}
     */
    data = null;
 
    /** 
     * Saves the current `Log` entry in the database.
     * @returns {Promise<number>} - Id of the new entry
     */
    save() {
      // `guid` must be a valid archive id
      new PermaAPI().validateArchiveId(String(this.guid)); // Throws if not valid.

      // `url` must be a valid url
      this.url = new URL(String(this.url)).href; // Checks and normalizes the url. Throws if not valid.

      // `data` must be a valid `PermaArchive` (loose  check)
      if (
        !this.data ||
        !("guid" in this.data) ||
        !("url" in this.data) ||
        !("creation_timestamp" in this.data)
      ) {
        throw new Error("`this.data` must be a PermaArchive object.");
      }

      return getTable().put(this)
    }
 }

/**
 * Returns a reference to the `archives` table from the database.
 * @returns {Dexie.Table}
 */
export function getTable() {
  return getDatabase()["archives"];
}

/**
 * Clears the `archives` table.
 * @returns {Promise<void>} 
 * @async
 */
export async function clearAll() {
  return await getTable().clear();
}

/**
 * Pulls all entries by url.
 * @param {string} url
 * @param {boolean} [timelineMode=true] - If true, will sort entries by data.creation_timestamp desc.
 * @returns {Promise<Archive[]>} 
 * @async
 */
export async function getByUrl(url, timelineMode = true) {
  url = new URL(url).href;

  const results = await getTable().where("url").equals(url).toArray();

  if (timelineMode) {
    results.sort(
      (a, b) => new Date(b.data.creation_timestamp) - new Date(a.data.creation_timestamp)
    );
  }

  return results;
}

/**
 * Deletes all entries matching a given url.
 * @param {string} url
 * @return {Promise<void>}
 */
export async function deleteByUrl(url) {
  const archives = await getByUrl(url);
  return await getTable().bulkDelete(archives.map((archive) => archive.guid));
}

/**
 * Adds an entry to the `archives` table.
 * @param {PermaArchive} archiveData 
 * @returns {Promise<Archive>}
 */
export async function add(archiveData) {
  let archive = new Archive();
  
  archive.guid = archiveData.guid;
  archive.url = archiveData.url;
  archive.data = archiveData;

  await archive.save();
  return archive;
}