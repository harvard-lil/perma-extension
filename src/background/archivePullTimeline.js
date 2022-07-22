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
  const auth = await Auth.fromStorage();
  const currentTab = await CurrentTab.fromStorage();
  const archives = await Archives.fromStorage();

  try {
    const api = new PermaAPI(String(auth.apiKey));

    if (!currentTab.url) {
      throw new Error("`currentTab.url` is not set.");
    }

    const archivesFromAPI = await api.pullArchives(100, 0, currentTab.url);

    // Debug: Filter-out entries that don't exactly match the current url.
    const filteredArchives = [];

    for (let archive of archivesFromAPI.objects) {
      if (new URL(archive.url).href === currentTab.url) {
        filteredArchives.push(archive);
      }
    }

    archives.byUrl[currentTab.url] = filteredArchives;
  }
  catch(err) {
    //console.error(err);
    throw err;
  }
  finally {
    await archives.save();
  }
}