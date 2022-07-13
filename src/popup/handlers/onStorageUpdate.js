// [!] WIP
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
 * 
 * @param {chrome.storage.StorageChange} [changes={}] - See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageChange  
 */
export async function onStorageUpdate(changes = {}) {
  console.log(changes);

  // (To think-through): If `changes` is empty, assume `currentTab`, `status` and `auth` have changed.

  // [!] Quick test
  const currentTab = await CurrentTab.fromStorage();
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();
  const folders = await Folders.fromStorage();
  const archives = await Archives.fromStorage();

  const appHeader = document.querySelector("body > app-header");
  const archiveForm = document.querySelector("body > archive-form");
  const archiveTimeline = document.querySelector("body > archive-timeline");
  const statusBar = document.querySelector("body > status-bar");

  appHeader?.setAttribute("tab-url", currentTab.url);
  appHeader?.setAttribute("tab-title", currentTab.title);

  archiveForm?.setAttribute("tab-url", currentTab.url);
  archiveForm?.setAttribute("tab-title", currentTab.title);
  archiveForm?.setAttribute("is-loading", status.isLoading);
  archiveForm?.setAttribute("is-authenticated", auth.isChecked);

  statusBar?.setAttribute("is-loading", status.isLoading);
  statusBar?.setAttribute("is-authenticated", auth.isChecked);
  statusBar?.setAttribute("message", status.message);

  archiveTimeline?.setAttribute("is-loading", status.isLoading);
  archiveTimeline?.setAttribute("is-authenticated", auth.isChecked);
}