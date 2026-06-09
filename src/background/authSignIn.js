/**
 * perma-extension
 * @module background/authSignIn
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `AUTH_SIGN_IN` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Status } from "../storage/index.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `AUTH_SIGN_IN` runtime message:
 * Verifies and stores a Perma API key.
 * 
 * Triggers a loading status.
 * 
 * @param {string} apiKey 
 * @returns {Promise<void>}
 * @async
 */
export async function authSignIn(apiKey) {
  const auth = await Auth.fromStorage();

  try {
    await Status.update((status) => {
      status.isLoading = true;
      status.message = "status_in_progress";
      status.lastLoadingInit = new Date();
    });

    const api = new PermaAPI(String(apiKey), PERMA_API_BASE_URL); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid

    auth.apiKey = apiKey;
    auth.isChecked = true;

    await Status.update((status) => { status.message = "status_signed_in"; });
  }
  catch(err) {
    auth.apiKey = "";
    auth.isChecked = false;

    await Status.update((status) => { status.message = "error_verifying_api_key"; });
    //console.log(err);
    throw err;
  }
  finally {
    auth.lastCheck = new Date();
    auth.isInvalid = false; // A fresh sign-in attempt always supersedes a prior "invalid key" state.

    await Status.update((status) => { status.isLoading = false; });
    await auth.save();
  }
}
