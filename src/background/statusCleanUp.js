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
  // Run the read + conditional write atomically against other status writers (the capture poll,
  // archive create/delete/toggle) so we never reset a freshly-set loading state from a stale read.
  await Status.update((status) => {
    let wasUpdated = false;
    const secondsSinceLastLoadingInit = (new Date() - status.lastLoadingInit) / 1000;

    // If `isLoading` has been `true` for more than 60 seconds, force it back to false.
    if (status.isLoading === true && secondsSinceLastLoadingInit > 60) {
      status.isLoading = false;
      wasUpdated = true;
    }

    // If `isLoading` is `false` and the last `lastLoadingInit` happened more than 5 seconds ago, set the current status message to "status_default".
    if (status.isLoading === false && secondsSinceLastLoadingInit > 5) {
      status.message = "status_default";
      wasUpdated = true;
    }

    return wasUpdated; // `false` -> skip the save (nothing changed), avoiding a needless storage event.
  });
}
