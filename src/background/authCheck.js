/**
 * perma-extension
 * @module background/authCheck
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `AUTH_CHECK` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Status } from "../storage/index.js";
import { markKeyInvalidOnAuthError } from "./markKeyInvalidOnAuthError.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `AUTH_CHECK` runtime message:
 * Checks that the Perma API key currently stored is (still) valid.
 *
 * The key is an API token, not a login session, so a failed check does not mean "sign out".
 * We only react to a *definitive* rejection (HTTP 401/403): the key is flagged as invalid
 * (`auth.isInvalid`) but kept on file, and the popup moves the user to the "invalid key" panel
 * where they can retry or paste a new key. Folders, archives, and the rest of the session are
 * left untouched. Transient failures (network errors, timeouts, 5xx) are rethrown without
 * touching stored state — a dropped connection must never look like a revoked key.
 *
 * @returns {Promise<void>}
 * @async
 */
export async function authCheck() {
  const auth = await Auth.fromStorage();

  if (!auth.apiKey || auth.apiKey == "") {
    return; // Nothing to check.
  }

  try {
    const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);
    await api.pullUser(); // Throws `PermaAPIError` (401/403) if the key is no longer valid.

    // Success. If the key was previously flagged invalid (e.g. the user just hit "Retry", or a
    // transient 401 has cleared), restore the working session. A plain re-check of an already
    // valid key changes nothing.
    if (auth.isInvalid) {
      auth.isChecked = true;
      auth.isInvalid = false;
      auth.lastCheck = new Date();
      await auth.save();

      await Status.update((status) => { status.message = "status_signed_in"; });
    }
  }
  catch(err) {
    // Only a definitive auth rejection (401/403) means the key itself is bad; `markKeyInvalidOnAuthError`
    // flags it. Everything else (network errors, timeouts, 5xx) is transient and left untouched, for
    // the next check (or a manual retry) to resolve.
    await markKeyInvalidOnAuthError(err);
    throw err;
  }
}