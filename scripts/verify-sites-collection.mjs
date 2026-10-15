import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../sites/trayn-nutrition-v2/dist");
const origin = "https://trayn-nutrition-v2.blondridge1.chatgpt.site";
async function filesWithin(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.ok(!entry.isSymbolicLink());
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithin(path));
    else files.push(path);
  }
  return files;
}
for (const route of ["index.html", "v1/index.html", "v2/index.html", "v3/index.html", "v2/drafts/index.html", "v2/drafts/quiet.html", "v2/drafts/tension.html", "v2/drafts/flavour.html"]) {
  assert.match(await readFile(resolve(root, route), "utf8"), /<main\b/);
}
let checked = 0;
const files = await filesWithin(root);
for (const path of files) {
  const extension = extname(path);
  if (![".html", ".css", ".js"].includes(extension)) continue;
  const text = await readFile(path, "utf8");
  assert.ok(!text.includes("http://127.0.0.1:"), `Localhost URL in ${path}`);
  assert.ok(!text.includes("/trayn-nutrition-prototypes/"), `GitHub-only prefix in ${path}`);
  let refs = [];
  if (extension === ".css") refs = [...text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)].map(m => m[1]);
  if (extension === ".html") {
    refs = [...text.matchAll(/\b(?:href|src|poster)="([^"]*)"/g)].map(m => m[1]);
    for (const m of text.matchAll(/\b(?:srcset|imagesrcset)="([^"]*)"/g)) {
      refs.push(...m[1].split(",").map(candidate => candidate.trim().split(/\s+/)[0]));
    }
  }
  for (const ref of refs) {
    const url = new URL(ref.replaceAll("&amp;", "&"), `${origin}/${relative(root, path).split(sep).join("/")}`);
    if (url.origin !== origin) continue;
    let destination = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    assert.ok(destination === root || destination.startsWith(`${root}${sep}`));
    let info;
    try {
      info = await stat(destination);
      if (info.isDirectory()) info = await stat(resolve(destination, "index.html"));
    } catch { assert.fail(`Missing destination: ${relative(root, path)} → ${ref}`); }
    assert.ok(info.isFile());
    checked++;
  }
}
console.log(`PASS: ${files.length} files, ${checked} HTML/CSS references; all versions and drafts are present.`);
