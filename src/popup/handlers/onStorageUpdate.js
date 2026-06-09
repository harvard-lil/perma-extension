/**
 * perma-extension
 * @module popup/handlers/onStorageUpdate
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Function run when `browser.storage.local` is updated. 
 */
// @ts-check
/// <reference types="@types/chrome" />

import { CurrentTab } from "../../storage/CurrentTab.js";
import { Status } from "../../storage/Status.js";
import { Auth } from "../../storage/Auth.js";
import { Archives } from "../../storage/Archives.js";
import { Folders } from "../../storage/Folders.js";

/**
 * Reacts to changes in storage and feeds data to the UI.
 * @param {chrome.storage.StorageChange} [changes={}] - See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageChange  
 */
export async function onStorageUpdate(changes = {}) {
  const updatedKeys = Object.keys(changes);

  //
  // Elements to feed info to
  //
  const appHeader = document.querySelector("body > app-header");
  const archiveForm = document.querySelector("body > archive-form");
  const archiveTimeline = document.querySelector("body > archive-timeline");
  const statusBar = document.querySelector("body > status-bar");

  if (!appHeader || !archiveForm || !archiveTimeline || !statusBar) {
    return;
  }

  //
  // If `changes` is empty, assume everything needs to be pulled from storage.
  //
  if (updatedKeys.length === 0 ) {
    updatedKeys.push(
      CurrentTab.KEY,
      Status.KEY,
      Auth.KEY,
      Archives.KEY,
      Folders.KEY
    );
  }

  //
  // Changes to CurrentTab
  //
  if (updatedKeys.indexOf(CurrentTab.KEY) > -1) {
    const currentTab = await CurrentTab.fromStorage();

    appHeader?.setAttribute("tab-url", currentTab.url);
    appHeader?.setAttribute("tab-title", currentTab.title);

    archiveForm?.setAttribute("tab-url", currentTab.url);
    archiveForm?.setAttribute("tab-title", currentTab.title);
  }

  //
  // Changes to Status
  //
  if (updatedKeys.indexOf(Status.KEY) > -1) {
    const status = await Status.fromStorage();

    archiveForm?.setAttribute("is-loading", status.isLoading);

    statusBar?.setAttribute("is-loading", status.isLoading);
    statusBar?.setAttribute("message", status.message);

    archiveTimeline?.setAttribute("is-loading", status.isLoading);

    // Reflect capture progress on the matching timeline item (if a capture is in progress).
    archiveTimeline?.setActiveCapture(status.captureGuid, status.captureStep);
  }

  //
  // Changes to Auth
  //
  if (updatedKeys.indexOf(Auth.KEY) > -1) {
    const auth = await Auth.fromStorage();

    // Tri-state auth, consumed by the components below:
    // - "valid": signed in with a working key -> archive form, timeline, sign-out button.
    // - "invalid": key on file but rejected (401/403) -> "invalid key" panel; timeline stays.
    // - "signedout": no usable key -> sign-in form.
    const authState = auth.isInvalid ? "invalid" : (auth.isChecked ? "valid" : "signedout");

    archiveForm?.setAttribute("auth-state", authState);
    // Last 4 chars of the key, shown in the "invalid key" panel so users can tell which key failed.
    archiveForm?.setAttribute("key-hint", auth.apiKey ? auth.apiKey.slice(-4) : "");
    statusBar?.setAttribute("auth-state", authState);
    archiveTimeline?.setAttribute("auth-state", authState);
  }

  //
  // Changes to Archives
  //
  if (updatedKeys.indexOf(Archives.KEY) > -1) {
    const archives = await Archives.fromStorage();
    const currentTab = await CurrentTab.fromStorage();
    const status = await Status.fromStorage();

    // Add archives for the current url to `<archive-timeline>`
    archiveTimeline.addArchives(archives.byUrl[currentTab.url])

    // Re-apply capture progress: `addArchives` rebuilds the items from scratch.
    archiveTimeline.setActiveCapture(status.captureGuid, status.captureStep);
  }

  //
  // Changes to Folders
  //
  if (updatedKeys.indexOf(Folders.KEY) > -1) {
    const folders = await Folders.fromStorage();

    archiveForm?.setAttribute("folders-cascade", JSON.stringify({
      levels: folders.levels,
      path: folders.path,
      pick: folders.pick,
    }));
  }
  

}