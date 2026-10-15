import { writeFile } from "node:fs/promises";
import { slipstreamDocument } from "../src/templates.js";

const v2Site =
  process.env.V2_SITE_URL ||
  (process.argv.includes("--dev") ? "http://127.0.0.1:4173/" : "../v2/");
await writeFile("index.html", slipstreamDocument({ v2Site }));
console.log("Rendered the independent V3 homepage.");
