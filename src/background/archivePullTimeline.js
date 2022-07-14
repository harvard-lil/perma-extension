/**
 * perma-extension
 * @module background/archivePullTimeline
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `ARCHIVE_PULL_TIMELINE` runtime message.
 */
// @ts-check

import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { Auth, Status, CurrentTab, Archives } from "../storage/index.js";

/**
 * Handler for the `ARCHIVE_PULL_TIMELINE` runtime message:
 * Pulls and stores a list archives created by the user for the current tab.
 * Clears user data (and throws) otherwise.
 * 
 * @returns {Promise<void>}
 * @async
 */
export async function archivePullTimeline() {
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();
  const currentTab = await CurrentTab.fromStorage();
  const archives = await Archives.fromStorage();

  try {
    status.isLoading = true;
    await status.save();

    const api = new PermaAPI(String(auth.apiKey));

    if (!currentTab.url) {
      throw new Error("`currentTab.url` is not set.");
    }

    const archivesFromAPI = await api.pullArchives(100, 0, currentTab.url);
    archives.byUrl[currentTab.url] = archivesFromAPI.objects;
  }
  catch(err) {
    status.message = "error_pulling_timeline";
    console.error(err);
    throw err;
  }
  finally {
    status.isLoading = false;

    await archives.save();
    await status.save();
  }
}