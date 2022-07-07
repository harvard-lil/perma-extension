/**
 * perma-extension
 * @module database/tables/folders
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class and utility functions for the `folders` table.
 */
/// <reference types="Dexie" />
// @ts-check

import { PermaAPI } from '@harvard-lil/perma-js-sdk';
import { getDatabase } from '../index.js';

/**
 * Describes the indexes used by the `appState` table. 
 * See Dexie's documentation: https://dexie.org/docs/Version/Version.stores()#schema-syntax
 * @constant
 */
export const INDEXES = "&id";
