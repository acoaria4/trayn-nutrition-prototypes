import { defineConfig } from "vite";
import { normalizeBasePath, rebaseHtml } from "./src/site-paths.js";

const basePath = normalizeBasePath(process.env.SITE_BASE_PATH);
let resolvedBasePath = basePath;
export default defineConfig({
  server: { port: 4175, strictPort: true },
  preview: { port: 4176 },
  base: basePath,
  plugins: [
    {
      name: "trayn-public-paths",
      configResolved(config) {
        resolvedBasePath = normalizeBasePath(config.base);
      },
      transformIndexHtml: {
        order: "post",
        handler: (html) => rebaseHtml(html, resolvedBasePath),
      },
    },
  ],
  build: {
    target: "es2022",
  },
});
