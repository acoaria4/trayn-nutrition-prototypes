import { defineConfig } from "vite";
import { resolve } from "node:path";
import { normalizeBasePath, rebaseHtml } from "./src/site-paths.js";

const basePath = normalizeBasePath(process.env.SITE_BASE_PATH);
let resolvedBasePath = basePath;
export default defineConfig({
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
    rollupOptions: {
      input: {
        home: resolve("index.html"),
        product: resolve("product.html"),
        retainedProduct: resolve(
          "products/trayn-whey-rich-chocolate/index.html",
        ),
        vanillaConcept: resolve("concepts/vanilla-creme/index.html"),
        mochaConcept: resolve("concepts/cafe-mocha/index.html"),
        cookiesConcept: resolve("concepts/cookies-cream/index.html"),
        information: resolve("label-information.html"),
        notFound: resolve("404.html"),
      },
    },
  },
});
