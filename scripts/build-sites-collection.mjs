import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkout = resolve(root, "sites/trayn-nutrition-v2");
const output = resolve(checkout, "dist");
const manifest = JSON.parse(await readFile(resolve(checkout, ".openai/hosting.json"), "utf8"));
assert.equal(manifest.project_id, "appgprj_6ad019fa261081918a78a062818d6585");
assert.equal(manifest.static.directory, "dist");
const origin = "https://trayn-nutrition-v2.blondridge1.chatgpt.site";

function run(version, args, env = {}) {
  const result = spawnSync("npm", args, {
    cwd: resolve(root, version),
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
  assert.equal(result.status, 0, `${version}: npm ${args.join(" ")} failed`);
}

async function filesWithin(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.ok(!entry.isSymbolicLink(), `Unexpected symlink: ${entry.name}`);
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithin(path));
    else files.push(path);
  }
  return files;
}

// Keep the editable versions independent; assemble only their static output.
for (const version of ["v1", "v2", "v3"]) {
  run(version, ["run", "build"], { SITE_BASE_PATH: `/${version}/` });
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const version of ["v1", "v2", "v3"]) {
  const target = resolve(output, version);
  await cp(resolve(root, version, "dist"), target, { recursive: true });
  for (const path of await filesWithin(target)) {
    if (!/\.(html|xml|json|txt)$/.test(path)) continue;
    const source = await readFile(path, "utf8");
    await writeFile(path, source.replaceAll("https://traynnutrition.com", `${origin}/${version}`));
  }
}
const chooser = (await readFile(resolve(root, "index.html"), "utf8"))
  .replaceAll("/trayn-nutrition-prototypes/", "/")
  .replace("</title>", '</title><link rel="icon" href="/v2/images/brand/favicon.png" type="image/png">');
await writeFile(resolve(output, "index.html"), chooser);
await writeFile(resolve(output, "404.html"), chooser);
// Sites' static host does not apply Pages _redirects files. Native HTML refresh
// pages keep the old V2 page bookmarks usable, including without JavaScript.
const v2Output = resolve(output, "v2");
for (const path of await filesWithin(v2Output)) {
  if (!path.endsWith(".html") || path === resolve(v2Output, "index.html") || path === resolve(v2Output, "404.html")) continue;
  const route = path.slice(v2Output.length + 1).split("\\").join("/");
  const destination = `/v2/${route.replace(/index\.html$/, "")}`;
  const legacy = resolve(output, route);
  await mkdir(dirname(legacy), { recursive: true });
  await writeFile(legacy, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url=${destination}"><meta name="robots" content="noindex,follow"><title>TRAYN — Page moved</title><link rel="canonical" href="${origin}${destination}"></head><body style="background:#111;color:#f2f0eb;font:18px/1.6 system-ui;padding:32px"><main><h1>This page has moved.</h1><a style="color:inherit" href="${destination}">Continue to TRAYN</a><p><a style="color:inherit" href="/">Choose a version</a></p></main></body></html>`);
}
console.log(`Assembled the public collection at ${output}`);
