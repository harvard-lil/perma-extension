/**
 * perma-extension
 * @module background/statusMessageClear
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `STATUS_MESSAGE_CLEAR` runtime message.
 */
// @ts-check

import { Status } from "../storage/index.js";

/**
 * Handler for the `STATUS_MESSAGE_CLEAR` runtime message:
 * 
 * @param {Promise<void>}
 * @async
 */
export async function statusMessageClear() {
  const status = await Status.fromStorage();
  status.message = "status_default";
  await status.save();
}
