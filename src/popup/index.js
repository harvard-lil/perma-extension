/**
 * perma-extension
 * @module popup
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entrypoint for the extension's popup window.
 */
// @ts-check
/// <reference types="@types/chrome" />
import { BROWSER } from "../constants/index.js";

import "./components/AppHeader.js";
import "./components/ArchiveForm.js";
import "./components/ArchiveTimeline.js";
import "./components/StatusBar.js"; 

import { onPopupOpen } from "./handlers/onPopupOpen.js"
import { onStorageUpdate } from "./handlers/onStorageUpdate.js"

// Run `onPopupOpen` every time the popup is open
document.addEventListener("DOMContentLoaded", onPopupOpen);

// Run `onStorageUpdate` every time (part) of `browser.storage.local` is updated.
BROWSER.storage.local.onChanged.addListener(onStorageUpdate);
