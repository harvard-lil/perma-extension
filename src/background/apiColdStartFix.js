/**
 * perma-extension
 * @module background/apiColdStartFix
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `API_COLD_START_FIX` runtime message.
 */
// @ts-check
import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth } from "../storage/index.js";

/**
 * Handler for the `API_COLD_START_FIX` runtime message: 
 * Keeps the archive creation endpoint "warm" by sending an invalid request (temporary workaround).
 * Errors are ignored. 
 * Should be run every 45 seconds at most.
 * 
 * @returns {Promise<void>}
 * @async
 */
export async function apiColdStartFix(isPrivate = false) {
  const auth = await Auth.fromStorage();

  try {
    const api = new PermaAPI(String(auth.apiKey)); // Will throw if no API key provided.

    const random = String(Math.random()).replace("0.", "");
    const url = `http://perma-test-${random}.extension/`;

    // We expect this to throw and return HTTP 400
    const archive = await api.createArchive(url);

    // In case the request went through, try to delete the archive that was accidentally created 
    await api.deleteArchive(archive.guid);
  }
  catch(err) {
    // This is the expected result
  }
}
