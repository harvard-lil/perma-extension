// [!] Quick test
// @ts-check
/// <reference types="@types/chrome" />

import { CurrentTab } from "../../storage/CurrentTab.js";
import { Status } from "../../storage/Status.js";
import { Auth } from "../../storage/Auth.js";
import { Archives } from "../../storage/Archives.js";
import { Folders } from "../../storage/Folders.js";

/**
 * 
 * @param {*} changes 
 */
export async function onStorageUpdate(changes = {}) {
  console.log(changes);

  // (To think-through): If `changes` is empty, assume `currentTab`, `status` and `auth` have changed.

  // Quick test
  const currentTab = await CurrentTab.fromStorage();
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();
  const folders = await Folders.fromStorage();
  const archives = await Archives.fromStorage();

  const archiveForm = document.querySelector("body > archive-form");
  const statusBar = document.querySelector("body > status-bar");
  const archiveTimeline = document.querySelector("body > archive-timeline");

  archiveForm?.setAttribute("url", currentTab.url);
  archiveForm?.setAttribute("title", currentTab.title);
  archiveForm?.setAttribute("loading", status.isLoading);
  archiveForm?.setAttribute("authenticated", auth.isChecked);

  statusBar?.setAttribute("loading", status.isLoading);
  statusBar?.setAttribute("authenticated", auth.isChecked);
  statusBar?.setAttribute("message", status.message);

  archiveTimeline?.setAttribute("loading", status.isLoading);
  archiveTimeline?.setAttribute("authenticated", auth.isChecked);
}