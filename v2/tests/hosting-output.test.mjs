import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { verifyStaticHosting } from "../scripts/verify-static-hosting.mjs";

async function fixture(t, extra = "") {
  const directory = await mkdtemp(join(tmpdir(), "trayn-hosting-"));
  t.after(async () => {
    assert.equal(dirname(directory), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith("trayn-hosting-"));
    await rm(directory, { recursive: true, force: true });
  });
  await mkdir(join(directory, "drafts/assets"), { recursive: true });
  await writeFile(
    join(directory, "index.html"),
    '<main><a href="./drafts/">Drafts</a></main>',
  );
  await writeFile(join(directory, "drafts/assets/pouch.webp"), "fixture");
  await writeFile(join(directory, "drafts/assets/font.woff2"), "fixture");
  await writeFile(
    join(directory, "drafts/assets/style.css"),
    '@font-face{src:url("./font.woff2")}',
  );
  await writeFile(
    join(directory, "drafts/index.html"),
    '<main><iframe src="./quiet.html"></iframe></main>',
  );
  for (const page of ["quiet", "tension", "flavour"]) {
    await writeFile(
      join(directory, `drafts/${page}.html`),
      `<body data-variant="1"><link rel="stylesheet" href="./assets/style.css"><main><h1>${page}</h1><img src="./assets/pouch.webp"><a href="./assets/pouch.webp?download=1#image">Pack</a>${extra}</main></body>`,
    );
  }
  return directory;
}

test("preserved draft iframe, image, download and CSS font paths resolve below a nested Pages prefix", async (t) => {
  const directory = await fixture(t);
  for (const base of ["/", "/repository/nested/", "/trayn.preview/"]) {
    const result = await verifyStaticHosting(directory, base);
    assert.equal(result.drafts, 4);
    assert.ok(result.references > 10);
  }
});

test("a missing ordinary anchor asset fails even when the displayed image exists", async (t) => {
  const directory = await fixture(
    t,
    '<a href="./assets/unemitted-original.webp">Download</a>',
  );
  await assert.rejects(
    verifyStaticHosting(directory, "/repo/"),
    /Missing built destination.*unemitted-original/,
  );
});

test("root-absolute draft links cannot silently escape a repository deployment", async (t) => {
  const directory = await fixture(
    t,
    '<a href="/drafts/tension.html">Tension</a>',
  );
  await assert.rejects(
    verifyStaticHosting(directory, "/repo/"),
    /Link escaped \/repo\//,
  );
});
