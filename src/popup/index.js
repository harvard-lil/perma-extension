/**
 * perma-extension
 * @module popup
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entrypoint for the extension's popup window.
 */
// @ts-check
/// <reference types="@types/chrome" />
import { BROWSER, MESSAGE_IDS } from "../constants/index.js";
import { Auth } from "../storage/Auth.js";

import "./components/AppHeader.js";
import "./components/ArchiveForm.js";
import "./components/ArchiveTimeline.js";
import "./components/ArchiveTimelineItem.js";
import "./components/StatusBar.js"; 

import { onPopupOpen } from "./handlers/onPopupOpen.js"
import { onStorageUpdate } from "./handlers/onStorageUpdate.js"

// Run `onPopupOpen` every time the popup is open
document.addEventListener("DOMContentLoaded", onPopupOpen);

// Run `onStorageUpdate` every time (part) of `browser.storage.local` is updated.
BROWSER.storage.local.onChanged.addListener(onStorageUpdate);
