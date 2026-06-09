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
   * GUID of the archive whose capture is currently in progress, if any.
   * Empty string when no capture is being tracked. Used to drive capture-status polling.
   * @type {string}
   */
  #captureGuid = "";

  /**
   * Number of capture steps completed for the archive being captured (`PermaCaptureJob.step_count`).
   * Used to render a progress bar. Perma capture jobs report ~5 steps.
   * @type {number}
   */
  #captureStep = 0;

  /**
   * Creates and returns an instance of `Status` using data from storage.
   * Use this static method to load "status" from storage.
   * 
   * Usage:
   * ```javascript
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
   * Lock used by `update()` to serialize read-modify-write cycles. Each queued mutation runs only
   * after the previous one has finished saving.
   * @type {Promise<any>}
   */
  static #updateChain = Promise.resolve();

  /**
   * Atomically reads "status" from storage, applies `mutator`, and saves it back — serialized
   * against every other `update()` call.
   *
   * The whole status blob is written as one object, so two handlers that each did
   * `fromStorage()` → mutate → `save()` concurrently would clobber each other's fields with a
   * stale snapshot (last write wins on the *entire* object). Several writers run on overlapping
   * timers — the 2s capture-status poll, the 2.5s `statusCleanUp`, and archive create/delete/
   * toggle — so this matters. Routing every mutation through this single chain guarantees each one
   * sees the freshest stored value and no write is lost.
   *
   * The mutator receives the freshly-loaded `Status` and may be async. Return `false` from it to
   * skip the save (e.g. nothing actually changed, to avoid a needless `storage.onChanged` event);
   * any other return value (including `undefined`) saves.
   *
   * @param {(status: Status) => (boolean | void | Promise<boolean | void>)} mutator
   * @returns {Promise<Status>} The (possibly mutated) status.
   */
  static update(mutator) {
    const run = Status.#updateChain.then(async () => {
      const status = await Status.fromStorage();
      const result = await mutator(status);

      if (result !== false) {
        await status.save();
      }

      return status;
    });

    // Advance the chain even if this mutator throws, so one failure can't wedge the queue.
    Status.#updateChain = run.catch(() => {});
    return run;
  }

  /**
   * Saves the current object in store.
   *
   * @returns {Promise<boolean>}
   * @async
   */
  async save() {
    const toSave = {};
    toSave[Status.KEY] = {
      isLoading: this.#isLoading,
      lastLoadingInit: String(this.#lastLoadingInit),
      message: this.#message,
      captureGuid: this.#captureGuid,
      captureStep: this.#captureStep
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

  /**
   * @param {any} newValue - Will be cast into a string.
   */
  set captureGuid(newValue) {
    this.#captureGuid = newValue ? String(newValue) : "";
  }

  get captureGuid() {
    return this.#captureGuid;
  }

  /**
   * @param {any} newValue - Will be cast into a number (0 if not parseable).
   */
  set captureStep(newValue) {
    const parsed = parseInt(newValue);
    this.#captureStep = Number.isNaN(parsed) ? 0 : parsed;
  }

  get captureStep() {
    return this.#captureStep;
  }

}
