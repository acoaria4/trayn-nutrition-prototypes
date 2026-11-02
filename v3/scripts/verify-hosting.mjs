import { resolve } from "node:path";
import { normalizeBasePath } from "../src/site-paths.js";
import { verifyStaticHosting } from "./verify-static-hosting.mjs";

const base = normalizeBasePath(process.env.SITE_BASE_PATH);
const result = await verifyStaticHosting(resolve("dist"), base);
console.log(
  `PASS: V3 ${result.references} HTML/CSS references in ${result.files} files (${base})`,
);
