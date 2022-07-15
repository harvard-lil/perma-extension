/**
 * perma-extension
 * @module background/statusCleanUp
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `STATUS_CLEAN_UP` runtime message.
 */
// @ts-check

import { Status } from "../storage/index.js";

/**
 * Handler for the `STATUS_CLEAN_UP` runtime message: 
 * Clean up utility for the "status" object. Useful to recover from hangs.
 * Resets `isLoading` and `message` if stuck.
 * 
 * @param {Promise<void>}
 * @async
 */
export async function statusCleanUp() {
  const status = await Status.fromStorage();
  let wasUpdated = false;
  const secondsSinceLastLoadingInit = (new Date() - status.lastLoadingInit) / 1000;

  // If `isLoading` has been `true` for more than 45 seconds, force it back to false.
  if (status.isLoading === true && secondsSinceLastLoadingInit > 45) {
    status.isLoading = false;
    wasUpdated = true;
  }

  // If `isLoading` is `false` and the last `lastLoadingInit` happened more than 5 seconds ago, set the current status message to "status_default".
  if (status.isLoading === false && secondsSinceLastLoadingInit > 5) {
    status.message = "status_default";
    wasUpdated = true;
  }

  if (wasUpdated === true) {
    await status.save();
  }
}
