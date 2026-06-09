/**
 * perma-extension
 * @module background/archiveDelete
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `ARCHIVE_DELETE` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Status } from "../storage/index.js";
import { archivePullTimeline } from "./archivePullTimeline.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Handler for the `ARCHIVE_DELETE` runtime message: 
 * Tries to delete an archive.
 * Automatically updates timeline for the current tab.
 * 
 * Triggers a loading status.
 * 
 * @param {string} guid
 * @returns {Promise<void>}
 * @async
 */
export async function archiveDelete(guid) {
  const auth = await Auth.fromStorage();

  try {
    await Status.update((status) => {
      status.isLoading = true;
      status.lastLoadingInit = new Date();
    });

    const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);

    // `safeMode=false`: the extension only ever deletes archives the timeline already shows as
    // finished, so skip the SDK's safe-mode pre-delete `pullArchive` + up-to-~60s polling for
    // pending captures. The delete becomes a single request.
    await api.deleteArchive(guid, false);

    await Status.update((status) => { status.message = "status_archive_deleted"; });

    await archivePullTimeline(); // Will update the timeline once the archive is deleted.
  }
  catch(err) {
    await Status.update((status) => { status.message = "error_deleting_archive"; });
    //console.error(err);
    throw err;
  }
  finally {
    await Status.update((status) => { status.isLoading = false; });
  }
}
