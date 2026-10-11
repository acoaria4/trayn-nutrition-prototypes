import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const origin = "https://hosting-check.invalid";
const draftPages = ["index.html", "quiet.html", "tension.html", "flavour.html"];

async function filesWithin(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.ok(
      !entry.isSymbolicLink(),
      `Static output must not contain symlinks: ${entry.name}`,
    );
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesWithin(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function references(text, extension) {
  if (extension === ".css") {
    return [...text.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g)].map(
      (match) => match[2],
    );
  }
  const urls = [
    ...text.matchAll(/\b(?:src|href|poster)\s*=\s*(["'])(.*?)\1/gi),
  ].map((match) => match[2]);
  for (const match of text.matchAll(
    /\b(?:srcset|imagesrcset)\s*=\s*(["'])(.*?)\1/gi,
  )) {
    if (!match[2].startsWith("data:")) {
      urls.push(
        ...match[2].split(",").map((item) => item.trim().split(/\s+/)[0]),
      );
    }
  }
  return urls;
}

export async function verifyStaticHosting(distRoot, base) {
  const root = resolve(distRoot);
  for (const page of draftPages) {
    const path = resolve(root, "drafts", page);
    const html = await readFile(path, "utf8");
    assert.match(html, /<main\b/, `${page} must contain real static content`);
    if (page !== "index.html") {
      assert.match(
        html,
        /<h1\b/,
        `${page} must contain its opening without JavaScript`,
      );
      assert.match(
        html,
        /<body\b[^>]*data-variant=/,
        `${page} must retain its direction`,
      );
    }
  }
  let checked = 0;
  const files = await filesWithin(root);
  for (const path of files) {
    const extension = extname(path);
    if (![".html", ".css"].includes(extension)) continue;
    const relative = path
      .slice(root.length + 1)
      .split(sep)
      .join("/");
    const sourceUrl = new URL(`${base}${relative}`, origin);
    const text = await readFile(path, "utf8");
    for (const reference of references(text, extension)) {
      const url = new URL(reference.replace(/&amp;/g, "&"), sourceUrl);
      if (url.origin !== origin) continue;
      assert.ok(
        url.pathname.startsWith(base),
        `Link escaped ${base}: ${relative} → ${reference}`,
      );
      const local = resolve(
        root,
        decodeURIComponent(url.pathname.slice(base.length)) || ".",
      );
      assert.ok(
        local === root || local.startsWith(`${root}${sep}`),
        `Unsafe local path: ${reference}`,
      );
      let details;
      try {
        details = await stat(local);
        if (details.isDirectory())
          details = await stat(resolve(local, "index.html"));
      } catch {
        assert.fail(`Missing built destination: ${relative} → ${reference}`);
      }
      assert.ok(details.isFile(), `Destination is not a file: ${reference}`);
      checked++;
    }
  }
  return {
    files: files.length,
    references: checked,
    drafts: draftPages.length,
  };
}
