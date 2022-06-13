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
        {src: "src/popup/popup.html", dest: "popup"},
        {src: "src/popup/popup.css", dest: "popup"},
      ]
    })
  ],

  build: {
    outDir: "dist",
    sourcemap: true,
    devSourcemap: true,

    rollupOptions: {
      input: {
        "popup": "src/popup/popup.js",
        "background": "src/background/background.js"
      },
      output: {
        entryFileNames: chunkInfo => `${chunkInfo.name}/${chunkInfo.name}.js`
      },
    }

  }

})