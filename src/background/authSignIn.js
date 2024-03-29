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
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();

  try {
    status.isLoading = true;
    status.message = "status_in_progress";
    status.lastLoadingInit = new Date();
    await status.save();

    const api = new PermaAPI(String(apiKey), PERMA_API_BASE_URL); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid

    auth.apiKey = apiKey;
    auth.isChecked = true;

    status.message = "status_signed_in";
  }
  catch(err) {
    auth.apiKey = "";
    auth.isChecked = false;

    status.message = "error_verifying_api_key";
    //console.log(err);
    throw err;
  }
  finally {
    status.isLoading = false;
    auth.lastCheck = new Date();

    await status.save();
    await auth.save();
  }
}
