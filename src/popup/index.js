import Dexie from "dexie";
import { BROWSER, MESSAGE_IDS } from "../constants";

// Quick test: message passing
document.querySelector("button").addEventListener("click", (e) => {
  e.preventDefault();
  
  for (let [messageName, messageId] of Object.entries(MESSAGE_IDS)) {
    setTimeout(() => { 
      console.log(`Sending ${messageName}`);
      BROWSER.runtime.sendMessage({messageId})
    }, messageId * 1000);
  }
})