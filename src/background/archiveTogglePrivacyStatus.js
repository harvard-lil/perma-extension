/**
 * perma-extension
 * @module background/archiveTogglePrivacyStatus
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `ARCHIVE_PRIVACY_STATUS_TOGGLE` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Status } from "../storage/index.js";
import { archivePullTimeline } from "./archivePullTimeline.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `ARCHIVE_PRIVACY_STATUS_TOGGLE` runtime message: 
 * Tries to toggle the privacy status of a given archive.
 * Automatically updates timeline for the current tab.
 * 
 * Triggers a loading status.
 * 
 * @param {string} guid
 * @param {boolean} [isPrivate=false] - State the archive should be in after the update (public or private)
 * @returns {Promise<void>}
 * @async
 */
export async function archiveTogglePrivacyStatus(guid, isPrivate = false) {
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();

  try {
    status.isLoading = true;
    status.message = "status_in_progress";
    status.lastLoadingInit = new Date();
    await status.save();

    const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);

    isPrivate = Boolean(isPrivate);
    await api.editArchive(guid, {isPrivate});
    status.message = isPrivate ? "status_archive_made_private" : "status_archive_made_public";

    await archivePullTimeline(); // Will update the timeline once the archive is created
  }
  catch(err) {
    status.message = "error_toggling_archive_privacy_status";
    //console.error(err);
    throw err;
  }
  finally {
    status.isLoading = false;
    await status.save();
  }
}
