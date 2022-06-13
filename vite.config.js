/**
 * perma-extension
 * @module vite.config
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Vite configuration file. Split between two entry points: popup (extension itself) and background (service worker).
 */
import { basename } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: "/",

  plugins: [
    viteStaticCopy({
      targets: [
        {src: "src/manifest.json", dest: ""},
        {src: "src/assets", dest: ""},
        {src: "src/_locales", dest: ""},
        {src: "src/popup/index.html", dest: "popup"},
        {src: "src/popup/index.css", dest: "popup"},
      ]
    })
  ],

  build: {
    outDir: "dist",
    sourcemap: true,
    devSourcemap: true,

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

  }

})