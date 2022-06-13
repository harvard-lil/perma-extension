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
        {src: "src/popup/index.html", dest: ""},
        {src: "src/popup/index.css", dest: ""},
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