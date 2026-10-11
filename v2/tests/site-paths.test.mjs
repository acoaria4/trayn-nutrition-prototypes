import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeBasePath,
  withBasePath,
  withoutBasePath,
  rebaseHtml,
} from "../src/site-paths.js";
import {
  document,
  home,
  productPage,
  informationPage,
} from "../src/templates.js";

test("root and repository deployments preserve local links and external destinations", () => {
  for (const base of [undefined, "", "/"])
    assert.equal(normalizeBasePath(base), "/");
  assert.equal(normalizeBasePath("/trayn-preview"), "/trayn-preview/");
  assert.equal(withBasePath("/", "/trayn-preview/"), "/trayn-preview/");
  assert.equal(
    withBasePath("/#blend", "/trayn-preview/"),
    "/trayn-preview/#blend",
  );
  for (const external of [
    "#main",
    "mailto:trayn@example.test",
    "https://traynnutrition.com/",
    "//example.test/image.webp",
  ]) {
    assert.equal(withBasePath(external, "/trayn-preview/"), external);
  }
  for (const invalid of [
    "https://example.test/",
    "//example.test/",
    "/../preview/",
    "/preview/?x=1",
  ]) {
    assert.throws(() => normalizeBasePath(invalid));
  }
});

test("history can identify products without confusing the repository prefix with the route", () => {
  assert.equal(
    withoutBasePath("/trayn-preview/concepts/cafe-mocha/", "/trayn-preview/"),
    "/concepts/cafe-mocha/",
  );
  assert.equal(
    withoutBasePath(
      "/trayn-preview/products/trayn-whey-rich-chocolate/",
      "/trayn-preview/",
    ),
    "/products/trayn-whey-rich-chocolate/",
  );
  assert.equal(
    withoutBasePath("/trayn-preview-other/", "/trayn-preview/"),
    "/trayn-preview-other/",
  );
});

test("real static templates rebase assets, image candidates and navigation for no-JS use", () => {
  for (const content of [home(), productPage()]) {
    const html = rebaseHtml(
      document({
        type: "home",
        title: "TRAYN",
        description: "Packaging concept",
        canonical: "/",
        content,
      }),
      "/trayn-preview/",
    );
    assert.ok(html.includes('href="/trayn-preview/#blend"'));
    assert.ok(!html.includes('href="/trayn-preview/concepts/cafe-mocha/"'));
    assert.ok(
      html.includes(
        "/trayn-preview/images/products/belgian-chocolate-wpc-640.webp 640w, /trayn-preview/images/products/belgian-chocolate-wpc-1024.webp 1024w",
      ),
    );
    assert.ok(html.includes('href="https://traynnutrition.com/"'));
    assert.equal(/(?:href|src)="\/(?!trayn-preview\/)/.test(html), false);
    assert.equal(
      rebaseHtml(html, "/trayn-preview/"),
      html,
      "Vite's already-prefixed asset URLs must not be prefixed twice",
    );
  }
  const information = rebaseHtml(informationPage(), "/trayn-preview/");
  for (const id of ["vanilla-creme", "cafe-mocha", "cookies-cream"]) {
    assert.ok(
      information.includes(`href="/trayn-preview/concepts/${id}/"`),
      "Archived flavour studies remain reachable without JavaScript",
    );
  }
});
