/**
 * perma-extension
 * @module background/authCheck
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `AUTH_CHECK` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth } from "../storage/index.js";
import { authSignOut } from "./authSignOut.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `AUTH_CHECK` runtime message:
 * Checks that the Perma API key currently stored is valid (if any). 
 * Clears user data (and throws) otherwise.
 * 
 * @returns {Promise<void>}
 * @async
 */
export async function authCheck() {
  try {
    const auth = await Auth.fromStorage();

    if (!auth.apiKey || auth.apiKey == "") {
      throw new Error("No API key provided.");
    }

    const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL); // Will throw if API key is invalid
    await api.pullUser(); // Will throw if API key is invalid
  }
  // If the verification fails, clear any user-related data.
  catch(err) {
    //console.error(err);
    authSignOut();
    throw err;
  }
}