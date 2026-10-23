import { writeFile } from "node:fs/promises";
import { slipstreamDocument } from "../src/templates.js";

const v2Site =
  process.env.V2_SITE_URL ||
  (process.argv.includes("--dev")
    ? "https://trayn-nutrition-v2.blondridge1.chatgpt.site/v2/"
    : "../v2/");
await writeFile("index.html", slipstreamDocument({ v2Site }));
console.log("Rendered the independent V3 homepage.");
