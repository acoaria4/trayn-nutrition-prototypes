import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  publicDir: false,
  plugins: [
    {
      name: "static-packaging-downloads",
      async buildStart() {
        // Vite hashes <img src> assets but leaves ordinary download-link hrefs.
        // Keep the three original packaging links usable with JS disabled too.
        for (const name of [
          "pouch.webp",
          "pouch-back.webp",
          "vanilla-pouch.webp",
        ]) {
          this.emitFile({
            type: "asset",
            fileName: `assets/${name}`,
            source: await readFile(
              new URL(`./assets/${name}`, import.meta.url),
            ),
          });
        }
      },
    },
  ],
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        comparison: fileURLToPath(new URL("./index.html", import.meta.url)),
        quiet: fileURLToPath(new URL("./quiet.html", import.meta.url)),
        tension: fileURLToPath(new URL("./tension.html", import.meta.url)),
        flavour: fileURLToPath(new URL("./flavour.html", import.meta.url)),
      },
    },
  },
});
