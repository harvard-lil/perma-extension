/**
 * perma-extension
 * @module vite.config
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Vite configuration file. Split between two entry points: popup (extension itself) and background (service worker).
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { basename } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

/**
 * Read target browser from file, if necessary.
 * https://github.com/motdotla/dotenv
 */
process.env.TARGET ? null : await import("dotenv/config");

/**
 * Transforms `manifest.json` for target browser compatibility.
 * Swaps in Firefox-only properties for Chrome-only properties, if necessary.
 */
const transformManifest = (contents, filename) => {
  if (process.env.TARGET !== "firefox") {
    return contents;
  } else {
    console.log("Transforming manifest.json for Firefox compatibility...")
  }
  const manifest = JSON.parse(contents.toString());

  // Set minimum version
  delete manifest.minimum_chrome_version;
  manifest.browser_specific_settings = {
    gecko: {
      strict_min_version: "100"
    }
  };

  // Set background scripts
  delete manifest.background.service_worker;
  manifest.background.scripts = ["background/index.js"];

  return JSON.stringify(manifest, null, 2);
}

/**
 * Creates the CSS bundle for the `popup`.
 * Merges `index.css` with all the components-specific CSS files.
 */
const popupCSSBundle = () => {
  let config;
  let sourceCSSFiles = [];

  return {
    name: "popup-css-bundle",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    // On build start: find all CSS files and add them to the watch list
    async buildStart() {
      let popupDir = "./src/popup/";
      sourceCSSFiles.push(`${popupDir}/index.css`);

      for (let filename of readdirSync(`${popupDir}/components/`)) {
        if (filename.endsWith(".css")) {
          sourceCSSFiles.push(`${popupDir}/components/${filename}`);
        }
      }

      for (let filename of sourceCSSFiles) {
        this.addWatchFile(filename);
      }
    },

    // On bundle close: Merge all files from `sourceCSSFiles`
    async closeBundle() {
      let output = "";

      for (let filename of sourceCSSFiles) {
        output += readFileSync(filename) + `\n`;
      }

      writeFileSync(`./${config.build.outDir}/popup/index.css`, output)
      return true;
    }
  }
};

export default defineConfig({
  base: "/",

  plugins: [
    viteStaticCopy({
      targets: [
        {src: "src/manifest.json", dest: "", transform: transformManifest},
        {src: "src/assets", dest: ""},
        {src: "src/_locales", dest: ""},
        {src: "src/popup/index.html", dest: "popup"},
      ]
    }),
    popupCSSBundle()
  ],

  build: {
    outDir: "dist",
    sourcemap: true,
    devSourcemap: true,
    minify: false,
    target: ["chrome100", "firefox100"],

    rollupOptions: {
      input: {
        "popup": "src/popup/index.js",
        "background": "src/background/index.js"
      },
      output: {
        // ex: dist/popup/index.js
        entryFileNames: chunkInfo => `${chunkInfo.name}/${basename(chunkInfo.facadeModuleId)}`
      },
    }

  },

})
