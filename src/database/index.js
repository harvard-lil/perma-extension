/**
 * perma-extension
 * @module database
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entry point for the shared database module. Uses Dexie to define and manage IndexedDB tables.
 */
// @ts-check

import Dexie from "dexie";
import { DATABASE_NAME } from "../constants/index.js";
import * as appState from "./tables/appState.js";
import * as logs from "./tables/logs.js";

/**
 * Reference to individual table modules, containing data classes and functions to help work with database tables.
 * 
 * These modules automatically connect to the app's database.
 * 
 * Usage example:
 * ```
 * import { database } from './database/index.js';
 * 
 * // Using a utility function
 * const logs = await database.logs.getAll();
 * 
 * // Direct access to the database table (`Dexie.Table` reference)
 * const table = database.logs.getTable();
 * ```
 * 
 * See `database.tables` for more information about each table.
 */
export const database = {
  appState,
  logs,
};

/**
 * Local reference to a database instance.
 * 
 * @type {?Dexie}
 */
let dbRef = null;

/**
 * Returns a Dexie database instance, initialized using the app's schema.
 * Uses a module-level reference to prevent unnecessary duplicate connections. 
 *
 * See `shared.database.tables` for details about each table.
 *
 * @param {string} databaseName - If not given, `shared.constants.DATABASE_NAME` will be used by default.
 * @returns {Dexie} Database instance.
 */
export function getDatabase(databaseName = DATABASE_NAME) {
  // Only create a new instance if needed.
  if (dbRef) {
    return dbRef;
  }

  dbRef = new Dexie(databaseName);

  // Create stores and associated indexes.
  dbRef.version(1).stores({
    appState: appState.INDEXES,
    logs: logs.INDEXES
  });

  // Map tables to data classes.
  // This allows Dexie to return instances of these classes when pulling data out of the IndexedDB.
  dbRef.appState.mapToClass(appState.AppState);
  dbRef.logs.mapToClass(logs.Log);

  return dbRef;
}

/**
 * Deletes a given Dexie-managed IndexedDB.
 * Will also clear out module-level reference to the database. 
 *
 * @param {string} databaseName - If not given, `shared.constants.DATABASE_NAME` will be used by default.
 * @returns {Promise<void>}
 * @async 
 */
export async function deleteDatabase(databaseName = DATABASE_NAME) {
  dbRef = null;

  try {
    return await Dexie.delete(databaseName);
  }
  catch (err) {
    console.log(`Database ${DATABASE_NAME} could not be deleted.`);
  }
}
