import test from "node:test";
import assert from "node:assert/strict";
import { rebaseHtml } from "../src/site-paths.js";
import { slipstreamDocument } from "../src/templates.js";

test("V3 assets stay in V3 while comparison links retain the sibling V2 destination", () => {
  const html = rebaseHtml(
    slipstreamDocument(),
    "/trayn-nutrition-prototypes/v3/",
  );
  assert.ok(
    html.includes(
      'src="/trayn-nutrition-prototypes/v3/images/products/belgian-chocolate-wpc-1024.webp"',
    ),
  );
  assert.ok(html.includes('href="../v2/#blend"'));
  assert.ok(html.includes('href="../v2/"'));
  assert.ok(!html.includes("prototypes/slipstream"));
  assert.equal(rebaseHtml(html, "/trayn-nutrition-prototypes/v3/"), html);
});

test("independent local preview points back to the V2 preview without sharing its assets", () => {
  const html = slipstreamDocument({ v2Site: "http://127.0.0.1:4173/" });
  assert.ok(html.includes('href="http://127.0.0.1:4173/#blend"'));
  assert.ok(html.includes('href="/src/styles.css"'));
  assert.ok(!html.includes('src="http://127.0.0.1:4173/'));
});
