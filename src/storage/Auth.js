/**
 * perma-extension
 * @module storage/Auth
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class used to interact with the "auth" key in storage (`browser.storage.local`).
 */
/// <reference types="@types/chrome" />
// @ts-check

import { BROWSER } from "../constants/index.js"

/**
 * This class directly interacts with `browser.storage.local` to push / pull and manage the "auth" key.
 */
export class Auth {
  /**
   * Key given to this object in `browser.storage.local`. 
   */
  static KEY = "auth";

  /**
   * Perma.CC API Key provided by the user.
   * @type {string}
   */
  #apiKey = "";

  /**
   * Whether or not the current API key has been checked against the Perma.cc API.
   * @type {boolean}
   */
  #isChecked = false;

  /**
   * Date + time at which the API key was checked last.
   * @type {?Date}
   */
  #lastCheck = null;

  /**
   * Creates and returns an instance of `Auth` using data from storage.
   * Use this static method to load "auth" from storage.
   * 
   * Usage:
   * ```javascript
   * const auth = await Auth.fromStorage();
   * ```
   * 
   * @return {Promise<Auth>}
   * @static
   * @async
   */
  static async fromStorage() {
    const auth = new Auth();
    const data = await BROWSER.storage.local.get([Auth.KEY]);

    if (Auth.KEY in data) {
      for (let [key, value] of Object.entries(data[Auth.KEY])) {
        auth[key] = value;
      }
    }

    return auth;
  }

  /**
   * Saves the current object in store.
   * @returns {Promise<boolean>}
   * @async 
   */
  async save() {
    const toSave = {};
    toSave[Auth.KEY] = {
      apiKey: this.#apiKey,
      isChecked: this.#isChecked,
      lastCheck: this.#lastCheck === null ? null : String(this.#lastCheck),
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
    await new Auth().save();
    return true;
  }

  /**
   * @param {any} newValue - Will be cast into a string.
   */
  set apiKey(newValue) {
    this.#apiKey = String(newValue);
  }

  get apiKey() {
    return this.#apiKey;
  }

  /**
   * @param {any} newValue - Will be cast into a boolean
   */
  set isChecked(newValue) {
    this.#isChecked = Boolean(newValue);
  }

  get isChecked() {
    return this.#isChecked;
  }

  /**
   * @param {any} newValue - Will try to read date from string if not null.
   */
  set lastCheck(newValue) {
    if (newValue !== null) {
      newValue = new Date(newValue);
    }

    this.#lastCheck = newValue;
  }

  get lastCheck() {
    return this.#lastCheck;
  }
}
