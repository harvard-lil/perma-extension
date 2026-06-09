/**
 * perma-extension
 * @module popup/handlers/onPopupOpen
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Function run when the popup UI is open. 
 */
// @ts-check

import { BROWSER, MESSAGE_IDS } from "../../constants/index.js";
import { Status } from "../../storage/Status.js";
import { Auth } from "../../storage/Auth.js";
import { CurrentTab } from "../../storage/CurrentTab.js";
import { Archives } from "../../storage/Archives.js";

import { onStorageUpdate } from "./onStorageUpdate.js";

/**
 * Function run when the popup UI is open.
 * - Updates tab-related information
 * - Hydrates the app using data from storage (first hydration)
 * - Checks authentication as needed
 * - Schedule runtime messages 
 * 
 * Called on `DOMContentLoaded`.
 * @param {?Event} e 
 */
export async function onPopupOpen(e = null) {
  let auth = await Auth.fromStorage();
  let status = await Status.fromStorage();

  // Pull current tab info
  const [tab] = await BROWSER.tabs.query({ active: true, lastFocusedWindow: true });

  // [1] Send `TAB_SWITCH` runtime message to update storage with current tab info.
  // This needs to be awaited
  await new Promise((resolve) => {
    BROWSER.runtime.sendMessage({
      messageId: MESSAGE_IDS.TAB_SWITCH,
      url: tab.url, // Needs to be sanitized
      title: tab.title, // Needs to be sanitized
    },
    (response) => resolve(response));
  }); 

  // [2] Call `onStorageUpdate` to hydrate the app.
  await onStorageUpdate();

  // [3] Re-check API Key if necessary 
  // - Checks are valid for an hour. Send `AUTH_CHECK` to the service worker otherwise to revalidate.
  if (
    status.isLoading === false &&
    auth.isChecked === true &&
    (new Date() - auth.lastCheck) / 1000 > 3600
  ) {
    await new Promise((resolve) => {
      BROWSER.runtime.sendMessage(
        { messageId: MESSAGE_IDS.AUTH_CHECK }, 
        (response) => resolve(response)
      );
    });
  }

  //
  // [4] If authenticated, load data and schedule capture polling.
  //

  // `FOLDERS_PULL_LIST` to populate the folder picker. Once on open: the folder list is
  // stable within a popup session (it is also refreshed on sign-in).
  sendMessageIfAuth(MESSAGE_IDS.FOLDERS_PULL_LIST);

  // `ARCHIVE_PULL_TIMELINE` to fetch the user's existing archives for the current tab.
  // Once on open — the timeline for a url only changes when this user captures it, which we
  // track separately below.
  await sendMessageIfAuth(MESSAGE_IDS.ARCHIVE_PULL_TIMELINE);

  // If a capture is already in progress for this page (popup reopened mid-capture, or a
  // capture started from another client), adopt it so its progress resumes.
  await adoptInProgressCapture();

  // `ARCHIVE_PULL_CAPTURE_STATUS` polls the lightweight `/v1/capture_jobs/{guid}` endpoint to
  // drive the progress bar and refresh the timeline when a capture finishes. It only generates
  // traffic while a capture is actually running (`status.captureGuid` is set) — an idle popup
  // makes no requests. Matches the 2s cadence the main Perma web app uses.
  setInterval(async () => {
    const status = await Status.fromStorage();
    if (status.captureGuid) {
      await sendMessageIfAuth(MESSAGE_IDS.ARCHIVE_PULL_CAPTURE_STATUS);
    }
  }, 2000);

  // `STATUS_CLEAN_UP` to clean up potential status hangs (local only — no network).
  // Once + every 2.5 seconds.
  sendMessageIfAuth(MESSAGE_IDS.STATUS_CLEAN_UP)
  setInterval(async () => {
    await sendMessageIfAuth(MESSAGE_IDS.STATUS_CLEAN_UP);
  }, 2500);

}

/**
 * If no capture is currently being tracked but the timeline shows a pending capture for the
 * current tab, start tracking it (so `ARCHIVE_PULL_CAPTURE_STATUS` resumes its progress).
 *
 * @returns {Promise<void>}
 * @async
 */
async function adoptInProgressCapture() {
  const status = await Status.fromStorage();

  if (status.captureGuid) {
    return; // Already tracking a capture.
  }

  const currentTab = await CurrentTab.fromStorage();
  const archives = await Archives.fromStorage();
  const archivesForUrl = archives.byUrl[currentTab.url] || [];

  for (let archive of archivesForUrl) {
    const primaryCapture = (archive.captures || []).find((c) => c.role === "primary");

    if (primaryCapture && primaryCapture.status === "pending") {
      status.captureGuid = archive.guid;
      status.captureStep = 0;
      await status.save();
      return;
    }
  }
}

/**
 * Sends a given runtime message if user is authenticated.
 * Pulls latest Auth info from storage. Resolves once the service worker has handled the message.
 *
 * @param {number} messageId
 * @returns {Promise<*>}
 * @async
 */
async function sendMessageIfAuth(messageId) {
  const auth = await Auth.fromStorage();

  if (auth.isChecked !== true) {
    return;
  }

  return await new Promise((resolve) => {
    BROWSER.runtime.sendMessage({ messageId }, (response) => resolve(response));
  });
}