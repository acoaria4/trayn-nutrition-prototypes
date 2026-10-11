import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { verifyStaticHosting } from "./verify-static-hosting.mjs";
import { normalizeBasePath } from "../src/site-paths.js";

// Verify the existing build under a real directory prefix, without an SPA fallback.
// Usage: node scripts/verify-hosting.mjs --base=/trayn-preview/
const requestedBase =
  process.argv.find((argument) => argument.startsWith("--base="))?.slice(7) ??
  process.env.SITE_BASE_PATH ??
  "/";
const base = normalizeBasePath(requestedBase);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");
const staticResult = await verifyStaticHosting(distRoot, base);
console.log(
  `PASS: ${staticResult.drafts} draft pages and ${staticResult.references} HTML/CSS references in ${staticResult.files} built files (${base})`,
);
if (process.argv.includes("--static")) process.exit(0);
const custom404 = await readFile(resolve(distRoot, "404.html"));
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};
const server = createServer(async (request, response) => {
  const send = (status, content, contentType = "text/html; charset=utf-8") => {
    response.writeHead(status, {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  };
  try {
    if (!["GET", "HEAD"].includes(request.method))
      return send(405, "Method not allowed", "text/plain");
    const url = new URL(request.url, "http://localhost");
    if (base !== "/" && url.pathname === base.slice(0, -1)) {
      response.writeHead(301, { Location: `${base}${url.search}` });
      return response.end();
    }
    if (!url.pathname.startsWith(base))
      return send(404, "Outside site prefix", "text/plain");
    const relativePath = decodeURIComponent(url.pathname.slice(base.length));
    const filename = resolve(distRoot, relativePath || ".");
    if (filename !== distRoot && !filename.startsWith(`${distRoot}${sep}`))
      return send(404, custom404);
    let target = filename;
    let details;
    try {
      details = await stat(target);
    } catch (error) {
      if (["ENOENT", "ENOTDIR"].includes(error.code))
        return send(404, custom404);
      throw error;
    }
    if (details.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        return response.end();
      }
      target = resolve(target, "index.html");
    }
    try {
      return send(
        200,
        await readFile(target),
        mimeTypes[extname(target)] ?? "application/octet-stream",
      );
    } catch (error) {
      if (["ENOENT", "ENOTDIR", "EISDIR"].includes(error.code))
        return send(404, custom404);
      throw error;
    }
  } catch (error) {
    send(error instanceof URIError ? 400 : 500, error.message, "text/plain");
  }
});

await new Promise((done, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", done);
});
const origin = `http://127.0.0.1:${server.address().port}`;
const siteUrl = (path = "/") => `${origin}${base}${path.replace(/^\//, "")}`;
const missingPath = `${base}__hosting-check-not-found__/deep/`;
const failures = [];
const requests = [];
const localLinks = new Set();
const supersededImages = new Set();
let browser;

function observePage(page) {
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(15000);
  page.on("pageerror", (error) =>
    failures.push(`Runtime error: ${error.message}`),
  );
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol === "data:" || url.protocol === "blob:") return;
    requests.push({ url: request.url(), type: request.resourceType() });
    if (url.origin !== origin)
      failures.push(`Unexpected external resource: ${request.url()}`);
    else if (!url.pathname.startsWith(base))
      failures.push(`Escaped site prefix: ${request.url()}`);
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (
      response.status() >= 400 &&
      !(
        response.status() === 404 &&
        url.pathname === missingPath &&
        response.request().resourceType() === "document"
      )
    ) {
      failures.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    // A legacy flavour query can replace the static pack image before it loads.
    // Verify that cancelled asset separately; displayed images must still load.
    if (
      request.resourceType() === "image" &&
      request.failure()?.errorText === "net::ERR_ABORTED"
    ) {
      supersededImages.add(request.url());
      return;
    }
    failures.push(
      `Request failed: ${request.url()} (${request.failure()?.errorText})`,
    );
  });
}

async function inspectPage(page, expectedStatus = 200) {
  assert.ok(
    new URL(page.url()).pathname.startsWith(base),
    `Page escaped ${base}: ${page.url()}`,
  );
  assert.equal(
    await page.locator("main").count(),
    1,
    "Every destination must contain its actual page content",
  );
  assert.equal(
    await page.locator("h1").count(),
    1,
    "Every destination must have one heading",
  );
  // Request every real image without relying on in-page timers or RAF, which
  // are unavailable in the JavaScript-disabled verification context.
  const images = page.locator(
    "img[src]:not([data-deferred-image]), img[srcset]:not([src]):not([data-deferred-image])",
  );
  await images.evaluateAll((elements) => {
    elements.forEach((image) => {
      image.loading = "eager";
    });
  });
  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements
            .filter((image) => !image.complete || !image.naturalWidth)
            .map((image) => image.currentSrc || image.src),
        ),
      {
        timeout: 8000,
        message: `Every image must load at ${page.url()}`,
      },
    )
    .toEqual([]);
  await expect
    .poll(() => page.evaluate(() => document.fonts.status), {
      timeout: 8000,
      message: `Fonts must finish loading at ${page.url()}`,
    })
    .toBe("loaded");
  const assets = await page.evaluate(() => ({
    brokenFonts: [...document.fonts]
      .filter((font) => font.status === "error")
      .map((font) => font.family),
    links: [...document.querySelectorAll("a[href]")].map((link) => link.href),
  }));
  assert.deepEqual(assets.brokenFonts, [], `Broken fonts at ${page.url()}`);
  for (const href of assets.links) {
    const url = new URL(href);
    if (url.origin !== origin) continue;
    assert.ok(
      url.pathname.startsWith(base),
      `Local link escaped the prefix: ${href}`,
    );
    if (expectedStatus !== 404 || url.pathname !== missingPath) {
      url.hash = "";
      localLinks.add(url.href);
    }
  }
}

async function assertFlavor(page, id, name) {
  await expect(page.locator("[data-product-name]")).toHaveText(name, {
    timeout: 8000,
  });
  const image = page.locator("[data-product-image]").first();
  assert.match(
    await image.getAttribute("src"),
    new RegExp(`${base}images/products/${id}`),
  );
  await waitForImage(image);
}

async function waitForImage(image) {
  await expect
    .poll(
      () =>
        image.evaluate(
          (element) => element.complete && element.naturalWidth > 0,
        ),
      {
        timeout: 8000,
        message: "The selected packaging image must load",
      },
    )
    .toBe(true);
}

try {
  const executablePath =
    process.env.PLAYWRIGHT_CHROME_PATH ||
    (process.platform === "win32"
      ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
      : undefined);
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : { channel: "chrome" }),
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  context.on("page", observePage);
  const page = await context.newPage();
  const routes = [
    "/",
    "/product.html",
    "/products/trayn-whey-rich-chocolate/",
    "/concepts/vanilla-creme/",
    "/concepts/cafe-mocha/",
    "/concepts/cookies-cream/",
    "/label-information.html",
    "/404.html",
  ];
  for (const route of routes) {
    const response = await page.goto(siteUrl(route));
    assert.equal(response.status(), 200, `${route} must be a real built page`);
    if (route === "/404.html")
      assert.equal(await page.locator("body").getAttribute("data-page"), "404");
    await inspectPage(page);
  }
  console.log(
    `PASS: 8 direct page routes, images, fonts, and local URL prefixes (${base})`,
  );

  for (const direction of ["quiet", "tension", "flavour"]) {
    const response = await page.goto(siteUrl(`/drafts/${direction}.html`));
    assert.equal(
      response.status(),
      200,
      `The ${direction} draft must be directly shareable`,
    );
    await inspectPage(page);
    await expect
      .poll(() => page.evaluate(() => typeof window.__prototypeReview))
      .toBe("function");
  }
  await page.locator('[data-flavour-choice="chocolate"]').click();
  await expect(page.locator("[data-flavour-name]")).toHaveText(
    "Belgian Chocolate.",
  );
  await waitForImage(page.locator("[data-flavour-scene]"));
  await page.locator('[data-flavour-choice="chocolate"]').press("ArrowRight");
  await expect(page.locator("[data-flavour-name]")).toHaveText(
    "Vanilla Creme.",
  );
  await waitForImage(page.locator("[data-flavour-scene]"));

  await page.goto(siteUrl("/drafts/tension.html"));
  await page.locator('[data-tension-view="back"]').click();
  await expect(page.locator('[data-tension-view="back"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await waitForImage(page.locator("[data-tension-detail-image]"));
  await page.locator("#tension-light").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#tension-light")).toHaveValue("51");

  await page.goto(siteUrl("/drafts/"));
  await expect(
    page.frameLocator("#experience").locator("main.quiet"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Flavour", exact: true }).click();
  await expect(
    page.frameLocator("#experience").locator("main.flavour"),
  ).toBeVisible();
  const selectedDraft = new URL(
    await page.locator("#experience").getAttribute("src"),
    page.url(),
  );
  assert.equal(selectedDraft.href, siteUrl("/drafts/flavour.html"));
  await page.locator('[data-viewport="mobile"]').click();
  await expect(page.locator("body")).toHaveAttribute("data-viewport", "mobile");
  assert.equal(
    new URL(
      await page.locator("#open-experience").getAttribute("href"),
      page.url(),
    ).href,
    siteUrl("/drafts/flavour.html"),
  );
  console.log(
    "PASS: retained draft pages, flavour keyboard control, packaging, lighting and comparison links stay under /drafts/",
  );

  const redirect = await fetch(siteUrl("/products/trayn-whey-rich-chocolate"), {
    redirect: "manual",
    signal: AbortSignal.timeout(8000),
  });
  assert.equal(
    redirect.status,
    301,
    "Directory URLs must redirect to their index path",
  );
  assert.equal(
    redirect.headers.get("location"),
    `${base}products/trayn-whey-rich-chocolate/`,
  );
  await page.goto(siteUrl("/product.html?flavor=cafe-mocha"));
  await assertFlavor(page, "cafe-mocha", "Café Mocha");
  await page.goto(siteUrl("/products/trayn-whey-rich-chocolate/"));
  await page.locator('[data-flavor="cafe-mocha"]').click();
  await assertFlavor(page, "cafe-mocha", "Café Mocha");
  assert.equal(page.url(), siteUrl("/concepts/cafe-mocha/"));
  await page.reload();
  await assertFlavor(page, "cafe-mocha", "Café Mocha");
  await page.goBack();
  await assertFlavor(page, "belgian-chocolate", "Belgian Chocolate");
  assert.equal(page.url(), siteUrl("/products/trayn-whey-rich-chocolate/"));
  await page.goForward();
  await assertFlavor(page, "cafe-mocha", "Café Mocha");
  assert.equal(page.url(), siteUrl("/concepts/cafe-mocha/"));
  console.log(
    "PASS: legacy query, flavor selection, reload, and Back/Forward preserve the hosting prefix",
  );

  await page.goto(siteUrl("/products/trayn-whey-rich-chocolate/"));
  await page.locator('[data-gallery-view="back"]').click();
  const image = page.locator("[data-product-image]").first();
  assert.match(await image.getAttribute("src"), /belgian-chocolate-back/);
  await waitForImage(image);
  await page.locator("[data-open-packaging]").click();
  const dialog = page.locator("#packaging-dialog");
  await dialog.waitFor({ state: "visible" });
  assert.ok(
    (await dialog.locator("img").getAttribute("src")).startsWith(
      siteUrl("/images/"),
    ),
  );
  await waitForImage(dialog.locator("img"));
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  await page.locator('[data-gallery-view="front"]').click();
  assert.doesNotMatch(await image.getAttribute("src"), /-back/);
  await waitForImage(image);
  console.log(
    "PASS: front/back packaging and full-size dialog assets load under the prefix",
  );

  const missing = await page.goto(`${origin}${missingPath}`);
  assert.equal(
    missing.status(),
    404,
    "Unknown deep URLs must produce a real HTTP 404",
  );
  assert.equal(
    await page.locator("body").getAttribute("data-page"),
    "404",
    "Unknown URLs must render the custom 404 page",
  );
  await inspectPage(page, 404);
  await page.locator("main a").click();
  await page.waitForURL(siteUrl("/"));
  assert.equal(await page.locator("body").getAttribute("data-page"), "home");
  await inspectPage(page);
  console.log(
    "PASS: a genuine deep 404 loads styled assets and returns home within the prefix",
  );

  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  noScript.on("page", observePage);
  const nativePage = await noScript.newPage();
  for (const direction of ["quiet", "tension", "flavour"]) {
    await nativePage.goto(siteUrl(`/drafts/${direction}.html`));
    await inspectPage(nativePage);
  }
  console.log(
    "PASS: all three draft openings and packaging links retain static mobile content without JavaScript",
  );
  await nativePage.goto(siteUrl("/products/trayn-whey-rich-chocolate/"));
  for (const [id, flavor] of [
    ["vanilla-creme", "Vanilla Creme"],
    ["cafe-mocha", "Café Mocha"],
    ["cookies-cream", "Cookies & Cream"],
  ]) {
    await nativePage.locator(`[data-flavor="${id}"]`).click();
    assert.equal(nativePage.url(), siteUrl(`/concepts/${id}/`));
    await assertFlavor(nativePage, id, flavor);
    await inspectPage(nativePage);
  }
  await noScript.close();
  console.log(
    "PASS: all future flavor links and content work without JavaScript",
  );

  for (const url of new Set([...localLinks, ...supersededImages])) {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
    });
    assert.equal(
      response.status,
      200,
      `Local link must resolve without an SPA fallback: ${url}`,
    );
  }
  assert.ok(
    requests.some((request) => request.type === "font"),
    "The verifier must observe real font loading",
  );
  assert.ok(
    requests.some((request) => request.type === "image"),
    "The verifier must observe real image loading",
  );
  assert.deepEqual(
    [...new Set(failures)],
    [],
    "Runtime requests must load successfully without leaving the site prefix",
  );
  console.log(
    `PASS: ${localLinks.size} local link destinations and ${requests.length} browser requests verified`,
  );
  console.log(`Hosting verification passed for ${base}`);
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((done) => server.close(done));
}
