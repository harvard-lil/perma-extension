import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { database } from "../database/index.js";
import { BROWSER, MESSAGE_IDS } from "../constants/index.js";

// Quick test:
document.querySelector("button").addEventListener("click", async(e) => {
  e.preventDefault();

  BROWSER.runtime.sendMessage({
    messageId: MESSAGE_IDS.FOLDERS_PULL_LIST
  });

})