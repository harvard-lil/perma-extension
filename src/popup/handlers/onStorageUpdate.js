// [!] Quick test
// @ts-check
/// <reference types="@types/chrome" />

import { CurrentTab } from "../../storage/CurrentTab.js";
import { Status } from "../../storage/Status.js";
import { Auth } from "../../storage/Auth.js";

export async function onStorageUpdate(changes = {}) {
  console.log(changes);

  // (To think-through): If `changes` is empty, assume `currentTab`, `status` and `auth` have changed.

  // Quick test
  const currentTab = await CurrentTab.fromStorage();
  const status = await Status.fromStorage();
  const auth = await Auth.fromStorage();

  const archiveForm = document.querySelector("archive-form");
  archiveForm?.setAttribute("tab-url", currentTab.url);
  archiveForm?.setAttribute("tab-title", currentTab.title);
  archiveForm?.setAttribute("loading", status.isLoading);
  archiveForm?.setAttribute("authenticated", auth.isChecked);
}