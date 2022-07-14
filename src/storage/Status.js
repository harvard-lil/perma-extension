/**
 * perma-extension
 * @module storage/Status
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class used to interact with the "status" key in storage (`browser.storage.local`).
 */
/// <reference types="@types/chrome" />
// @ts-check

import { BROWSER } from "../constants/index.js"

/**
 * This class directly interacts with `browser.storage.local` to push / pull and manage the "status" key.
 */
 export class Status {
  /**
   * Key given to this object in `browser.storage.local`. 
   */
  static KEY = "status";

  /**
   * If `true`, the current operation should be considered blocking, UI-wise.
   * @type {boolean}
   */
  #isLoading = false;

  /**
   * Date + time at with `isLoading` was set to `true` for the last time.
   * Allows to recover from crashes. Set automatically on save.
   * @type {?Date}
   */
  #lastLoadingInit = null;

  /**
   * Latest status message (`browser.i18n` key).
   * @type {string}
   */
  #message = "";

  /**
   * Creates and returns an instance of `Status` using data from storage.
   * Use this static method to load "status" from storage.
   * 
   * Usage:
   * ```
   * const status = await Status.fromStorage();
   * ```
   * 
   * @return {Promise<Status>}
   * @static
   * @async
   */
  static async fromStorage() {
    const status = new Status();
    const data = await BROWSER.storage.local.get([Status.KEY]);

    if (Status.KEY in data) {
      for (let [key, value] of Object.entries(data[Status.KEY])) {
        status[key] = value;
      }
    }

    return status;
  }

  /**
   * Saves the current object in store.
   * 
   * Note:
   * Automatically sets `lastLoadingInit` is `isLoading` is `true`.
   * 
   * @returns {Promise<boolean>}
   * @async 
   */
  async save() {
    if (this.isLoading) {
      this.lastLoadingInit = new Date();
    }

    const toSave = {};
    toSave[Status.KEY] = {
      isLoading: this.#isLoading,
      lastLoadingInit: String(new Date()),
      message: this.#message
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
    await new Status().save();
    return true;
  }

  /**
   * @param {any} newValue - Will be cast into a boolean
   */
  set isLoading(newValue) {
    this.#isLoading = Boolean(newValue);
  }

  get isLoading() {
    return this.#isLoading;
  }

  get lastLoadingInit() {
    return this.#lastLoadingInit;
  }

  /**
   * @param {any} newValue - Will try to read date from string if not null.
   */
  set lastLoadingInit(newValue) {
    if (newValue !== null) {
      newValue = new Date(newValue);
    }

    this.#lastLoadingInit = newValue;
  }

  /**
   * @param {any} newValue - Will be cast into a string.
   */
  set message(newValue) {
    this.#message = String(newValue);
  }

  get message() {
    return this.#message;
  }

}
