import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { database } from "../database/index.js";
import { BROWSER, MESSAGE_IDS } from "../constants/index.js";

// Quick test:
document.querySelector("button").addEventListener("click", async(e) => {
  e.preventDefault();

  const api = new PermaAPI();

  /*
  for (let guid of ["6U2D-7AU6", "4BW9-MWXN"]) {
    const archive = await api.pullPublicArchive(guid);
    console.log(await database.archives.add(archive));
  }*/

  console.log(await database.archives.getByUrl("https://principles.green"));
})