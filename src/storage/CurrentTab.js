/**
 * perma-extension
 * @module storage/CurrentTab
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Data class used to interact with the "currentTab" key in storage (`browser.storage.local`).
 */
/// <reference types="@types/chrome" />
// @ts-check

import { BROWSER } from "../constants/index.js";

/**
 * This class directly interacts with `browser.storage.local` to push / pull and manage the "currentTab" key.
 */
export class CurrentTab {
  /**
   * Key given to this object in `browser.storage.local`. 
   */
  static KEY = "currentTab";

  /**
   * Url for the current tab.
   * @type {string}
   */
  #url = "";

  /**
   * Title for the current tab.
   * @type {string}
   */
  #title = "";

  /**
   * Creates and returns an instance of `CurrentTab` using data from storage.
   * Use this static method to load "currentTab" from storage.
   * 
   * Usage:
   * ```
   * const status = await CurrentTab.fromStorage();
   * ```
   * 
   * @return {Promise<CurrentTab>}
   * @static
   * @async
   */
  static async fromStorage() {
    const currentTab = new CurrentTab();
    const data = await BROWSER.storage.local.get([CurrentTab.KEY]);

    if (CurrentTab.KEY in data) {
      for (let [key, value] of Object.entries(data[CurrentTab.KEY])) {
        currentTab[key] = value;
      }
    }

    return currentTab;
  }

  /**
   * Saves the current object in store.
   * @returns {Promise<boolean>}
   * @async 
   */
  async save() {
    const toSave = {};
    toSave[CurrentTab.KEY] = {
      url: this.#url,
      title: this.#title
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
    await new CurrentTab().save();
    return true;
  }

  /**
   * @param {any} newValue - Will be cast into a string. `<` and `>` will be encoded.
   */
  set url(newValue) {
    this.#url = String(newValue);
    this.#url = this.#url.replace(/</g, "%3C").replace(/>/g, "%3E");
  }

  get url() {
    return this.#url;
  }

  /**
   * @param {any} newValue - Will be cast into a string. `<` and `>` will be encoded.
   */
   set title(newValue) {
    this.#title = String(newValue);
    this.#title = this.#title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  get title() {
    return this.#title;
  }

}
