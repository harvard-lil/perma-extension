/**
 * perma-extension
 * @module background/authSignOut
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `AUTH_SIGN_OUT` runtime message.
 */
// @ts-check

import { Auth, Status, Folders, Archives } from "../storage/index.js";

/**
 * Handler for the `AUTH_SIGN_OUT` runtime message:
 * Clears personal information from storage.
 * 
 * @returns {Promise<void>}
 * @async
 */
export async function authSignOut() {
  const auth = await Auth.fromStorage();
  await auth.reset();

  const folders = await Folders.fromStorage();
  await folders.reset();

  const archives = await Archives.fromStorage();
  await archives.reset();

  const status = await Status.fromStorage();
  await status.reset();

  status.message = "status_signed_out";
  await status.save();
}