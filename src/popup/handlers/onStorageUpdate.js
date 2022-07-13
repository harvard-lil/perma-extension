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
  //console.log(updatedKeys);

  //
  // Elements to feed info to
  //
  const appHeader = document.querySelector("body > app-header");
  const archiveForm = document.querySelector("body > archive-form");
  const archiveTimeline = document.querySelector("body > archive-timeline");
  const statusBar = document.querySelector("body > status-bar");

  // If `changes` is empty, assume everything needs to be pulled from storage.
  if (updatedKeys.length === 0 ) {
    updatedKeys.push(
      CurrentTab.KEY,
      Status.KEY,
      Auth.KEY,
      Archives.KEY,
      Folders.KEY
    );
  }

  console.log(updatedKeys);

  // Changes to CurrentTab
  if (updatedKeys.indexOf(CurrentTab.KEY) > -1) {
    console.log("Hm ...")
    const currentTab = await CurrentTab.fromStorage();

    appHeader?.setAttribute("tab-url", currentTab.url);
    appHeader?.setAttribute("tab-title", currentTab.title);

    archiveForm?.setAttribute("tab-url", currentTab.url);
    archiveForm?.setAttribute("tab-title", currentTab.title);
  }

  // Changes to Status
  if (updatedKeys.indexOf(Status.KEY) > -1) {
    const status = await Status.fromStorage();

    archiveForm?.setAttribute("is-loading", status.isLoading);

    statusBar?.setAttribute("is-loading", status.isLoading);
    statusBar?.setAttribute("message", status.message);

    archiveTimeline?.setAttribute("is-loading", status.isLoading);
  }

  // Changes to Auth
  if (updatedKeys.indexOf(Auth.KEY) > -1) {
    const auth = await Auth.fromStorage();

    archiveForm?.setAttribute("is-authenticated", auth.isChecked);

    statusBar?.setAttribute("is-authenticated", auth.isChecked);
  
    archiveTimeline?.setAttribute("is-authenticated", auth.isChecked);
  }

  // Changes to Archives
  if (updatedKeys.indexOf(Archives.KEY) > -1) {
    //const archives = await Archives.fromStorage();
  }

  // Changes to Folders
  if (updatedKeys.indexOf(Folders.KEY) > -1) {
    const folders = await Folders.fromStorage();

    archiveForm?.setAttribute("folders-list", JSON.stringify(folders.available));
    archiveForm?.setAttribute("folders-pick", folders.pick);
  }
  

}