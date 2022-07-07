import { database } from "../database/index.js";
import { BROWSER, MESSAGE_IDS } from "../constants/index.js";

// Quick test:
document.querySelector("button").addEventListener("click", async(e) => {
  e.preventDefault();
  console.log(await database.logs.clearAll());
})