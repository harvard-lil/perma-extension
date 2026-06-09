/**
 * perma-extension
 * @module background/markKeyInvalidOnAuthError
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Shared handling for Perma API auth rejections coming back from any authenticated call.
 */
// @ts-check

import { PermaAPIError } from "@harvard-lil/perma-js-sdk";
import { Auth, Status } from "../storage/index.js";

// Mirror of the SDK's accepted key format (`PermaAPI` constructor): 40 alphanumeric chars.
const VALID_API_KEY_FORMAT = /^[0-9a-zA-Z]{40}$/;

/**
 * If `err` means the stored API key is definitively unusable, flag it invalid — the same state the
 * periodic `authCheck` produces — so the popup routes to the "invalid key" panel instead of failing
 * silently. Two cases count as definitive:
 *   - a Perma auth rejection (HTTP 401/403): the server rejected an otherwise well-formed key; or
 *   - a malformed key on file: the SDK's `PermaAPI` constructor rejects anything that isn't 40
 *     alphanumeric chars with a plain `Error`, *before* any request goes out (so there's no network
 *     error to see). Without this branch a corrupt stored key just produces a generic failure.
 *
 * This is what catches a key that's revoked or rotated *between* hourly `authCheck`s: any
 * authenticated request (folders, timeline, create, delete, …) that fails this way trips it, via
 * the dispatcher in `background/index.js`. The key is kept on file (so it can be shown / retried);
 * folders, archives, and the timeline are left untouched.
 *
 * Only a currently-valid session (`isChecked`) transitions to invalid — if it's already invalid or
 * signed out, there's nothing to do (and we skip redundant writes). `AUTH_SIGN_IN` deliberately
 * does NOT go through here: a 401 there is a bad *new* key typed into the sign-in form, which that
 * handler surfaces on the form itself rather than as a revoked-key panel.
 *
 * @param {unknown} err
 * @returns {Promise<boolean>} `true` if the key was treated as invalid (auth rejection or malformed key).
 * @async
 */
export async function markKeyInvalidOnAuthError(err) {
  const auth = await Auth.fromStorage();

  const isAuthRejection =
    err instanceof PermaAPIError && (err.httpStatusCode === 401 || err.httpStatusCode === 403);
  // Only a non-empty malformed key is "invalid"; an empty key is the signed-out state, not a bad key.
  const isMalformedKey = Boolean(auth.apiKey) && !VALID_API_KEY_FORMAT.test(String(auth.apiKey));

  if (!isAuthRejection && !isMalformedKey) {
    return false;
  }

  if (auth.isChecked) {
    auth.isChecked = false;
    auth.isInvalid = true;
    await auth.save();

    await Status.update((status) => { status.message = "error_api_key_invalid"; });
  }

  return true;
}
