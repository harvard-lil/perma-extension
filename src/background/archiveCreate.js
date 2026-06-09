/**
 * perma-extension
 * @module background/archiveCreate
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `ARCHIVE_CREATE_PUBLIC` and `ARCHIVE_CREATE_PRIVATE` runtime messages.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Status, CurrentTab, Folders } from "../storage/index.js";
import { archivePullTimeline } from "./archivePullTimeline.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `ARCHIVE_CREATE_PUBLIC` and `ARCHIVE_CREATE_PRIVATE` runtime messages: 
 * Creates a new archive.
 * Automatically updates timeline for the current tab.
 * 
 * Triggers a loading status.
 * 
 * @param {boolean} [isPrivate=false]
 * @returns {Promise<void>}
 * @async
 */
export async function archiveCreate(isPrivate = false) {
  const auth = await Auth.fromStorage();
  const currentTab = await CurrentTab.fromStorage();
  const folders = await Folders.fromStorage();

  try {
    await Status.update((status) => {
      status.isLoading = true;
      status.lastLoadingInit = new Date();
      status.message = "status_in_progress";
    });

    const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);

    if (!currentTab.url) {
      throw new Error("`currentTab.url` is not set.");
    }

    const archive = await api.createArchive(currentTab.url, {
      isPrivate: Boolean(isPrivate),
      parentFolderId: folders.pick
    });

    await Status.update((status) => {
      status.message = "status_archive_created";

      // Track the new capture so the popup can poll its capture-job status (instead of
      // re-pulling the whole timeline on a fixed interval). See `archivePullCaptureStatus`.
      status.captureGuid = archive?.guid;
      status.captureStep = 0;
    });

    await archivePullTimeline(); // Shows the new (pending) archive in the timeline right away.
  }
  catch(err) {
    await Status.update((status) => { status.message = "error_creating_archive"; });
    //console.error(err);
    throw err;
  }
  finally {
    await Status.update((status) => { status.isLoading = false; });
  }
}
