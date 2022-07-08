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
 * Creates the CSS bundle for the `popup`.
 * Merges `index.css` with all the components-specific CSS files.
 */
const popupCSSBundle = () => {
  let config;

  return {
    name: "popup-css-bundle",

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async closeBundle() {
      let inputPath = `./src/popup`;
      let outputPath = `./${config.build.outDir}/popup`;

      let output = readFileSync(`${inputPath}/index.css`);

      for (let filename of readdirSync(`${inputPath}/components/`)) {
        if (!filename.endsWith(".css")) {
          continue;
        }
        output += `\n` + readFileSync(`${inputPath}/components/${filename}`);
      }
    
      writeFileSync(`${outputPath}/index.css`, output)
      return true;
    }
  }
};

export default defineConfig({
  base: "/",

  plugins: [
    viteStaticCopy({
      targets: [
        {src: "src/manifest.json", dest: ""},
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