import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { database } from "../database/index.js";
import { BROWSER, MESSAGE_IDS } from "../constants/index.js";

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await BROWSER.tabs.query(queryOptions);
  return tab;
}

document.addEventListener("DOMContentLoaded", async(e) => {
  const tab = await getCurrentTab();
  document.querySelector("h1").innerText = tab.url;
});

// Quick test:
document.querySelector("button").addEventListener("click", async(e) => {
  e.preventDefault();
});