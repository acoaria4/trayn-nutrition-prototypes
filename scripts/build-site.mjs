import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cp, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const draftsRoot = resolve(root, "prototypes/openings");
const output = resolve(root, "dist");

function runNode(script, args, cwd) {
  return new Promise((done, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd,
      stdio: "inherit",
      shell: false,
      windowsHide: true,
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) done();
      else reject(new Error(`${script} failed (${signal ?? `exit ${code}`})`));
    });
  });
}

// Each package retains its own renderer, dependencies, Vite configuration and
// output. Only the final static files are combined. Vite's --base arguments
// affect the main site; the retained studies deliberately keep relative URLs.
await runNode(resolve(root, "scripts/render-pages.mjs"), [], root);
await runNode(
  resolve(root, "node_modules/vite/bin/vite.js"),
  ["build", ...process.argv.slice(2)],
  root,
);
await runNode(resolve(draftsRoot, "render-static.mjs"), [], draftsRoot);
await runNode(
  resolve(draftsRoot, "node_modules/vite/bin/vite.js"),
  ["build"],
  draftsRoot,
);

for (const page of [
  "index.html",
  "quiet.html",
  "tension.html",
  "flavour.html",
]) {
  assert.ok(
    (await stat(resolve(draftsRoot, "dist", page))).isFile(),
    `Missing draft: ${page}`,
  );
}
assert.ok(
  (await stat(resolve(output, "index.html"))).isFile(),
  "Main site build is missing",
);
await cp(resolve(draftsRoot, "dist"), resolve(output, "drafts"), {
  recursive: true,
  force: false,
  errorOnExist: true,
});
await cp(resolve(draftsRoot, "licenses"), resolve(output, "drafts/licenses"), {
  recursive: true,
  force: false,
  errorOnExist: true,
});
console.log("Built main site and all three retained studies at dist/drafts/.");
