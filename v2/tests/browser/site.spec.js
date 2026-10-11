import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  products,
  featuredProduct,
  productUrl,
} from "../../src/data/products.js";

const routes = [
  { path: "/", name: "home" },
  { path: "/products/trayn-whey-rich-chocolate/", name: "wpc-product" },
  { path: "/product.html?flavor=cafe-mocha", name: "legacy-mocha-product" },
  ...products
    .filter((product) => product !== featuredProduct)
    .map((product) => ({
      path: productUrl(product),
      name: `${product.id}-product`,
    })),
  { path: "/label-information.html", name: "label-information" },
  { path: "/404.html", name: "not-found" },
];
const currentProduct = "/products/trayn-whey-rich-chocolate/";

async function expectNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(
    dimensions.page,
    "Content must fit the viewport without horizontal scrolling",
  ).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectAccessible(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);
}

async function inspectLinks(page) {
  const invalid = await page.locator("a[href]").evaluateAll((links) =>
    links.flatMap((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#")
        return [`Empty destination: ${link.textContent.trim()}`];
      const target = new URL(href, location.href);
      if (
        target.origin !== location.origin ||
        target.pathname !== location.pathname ||
        !target.hash
      )
        return [];
      const id = decodeURIComponent(target.hash.slice(1));
      return document.getElementById(id) ? [] : [`Missing anchor ${href}`];
    }),
  );
  expect(invalid).toEqual([]);
}

async function capturePage(page, name, project) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("scroll-behavior");
    const priority = root.style.getPropertyPriority("scroll-behavior");
    root.style.setProperty("scroll-behavior", "auto", "important");
    try {
      const step = Math.max(300, innerHeight * 0.75);
      for (let top = 0; top < root.scrollHeight; top += step) {
        scrollTo({ top, behavior: "instant" });
        await new Promise((done) => setTimeout(done, 70));
      }
      scrollTo({ top: 0, behavior: "instant" });
    } finally {
      if (previous)
        root.style.setProperty("scroll-behavior", previous, priority);
      else root.style.removeProperty("scroll-behavior");
    }
  });
  await page.waitForTimeout(350);
  await mkdir(resolve("docs/screenshots"), { recursive: true });
  await page.screenshot({
    path: resolve(`docs/screenshots/${project}-${name}.png`),
    fullPage: true,
    animations: "disabled",
  });
}

for (const route of routes) {
  test(`${route.name}: renders, loads its assets, remains accessible, and fits the viewport`, async ({
    page,
  }, testInfo) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (
        response
          .url()
          .startsWith(
            testInfo.project.use.baseURL || "http://127.0.0.1:4173",
          ) &&
        response.status() >= 400
      ) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    const response = await page.goto(route.path);
    expect(response.ok()).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/TRAYN/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /[\s\S]{20,}/,
    );
    await expectNoOverflow(page);
    await inspectLinks(page);
    await capturePage(page, route.name, testInfo.project.name);
    const brokenImages = await page
      .locator("img:not([data-deferred-image])")
      .evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
      );
    expect(
      brokenImages,
      "Every image must load, including lazy images reached during scrolling",
    ).toEqual([]);
    await expectAccessible(page);
    expect(
      errors,
      "No runtime exceptions, failed local assets, or console errors",
    ).toEqual([]);
  });
}

test("home navigation reaches the real section destinations", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText(/FUEL YOUR\s*POTENTIAL\./i);
  await expect(page.locator(".hero-pouch")).toHaveAttribute(
    "src",
    /belgian-chocolate-wpc/,
  );
  await expect(page.locator("main")).not.toContainText(
    /whey protein isolate|WPI|concentrate\s*\+\s*isolate/i,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /whey protein concentrate/i,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /wpc/,
  );
  for (const id of ["blend", "story", "about", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(
      page.locator(`a[href="#${id}"], a[href="/#${id}"]`).first(),
    ).toHaveAttribute("href", new RegExp(`^/?#${id}$`));
  }
  const menu = page.getByRole("button", { name: /menu/i });
  if (await menu.isVisible()) await menu.click();
  await page
    .locator('a[href="#blend"], a[href="/#blend"]')
    .filter({ visible: true })
    .first()
    .click();
  await expect(page).toHaveURL(/#blend$/);
  await expect(page.locator("#flavors, main [data-flavor]")).toHaveCount(0);
  if (await menu.isVisible()) await menu.click();
  await page.locator('#main-navigation a[href="/#about"]').click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
  await page
    .locator("#about")
    .screenshot({
      path: resolve(`docs/screenshots/${testInfo.project.name}-mindset.png`),
    });
  const availability = page.locator("#questions details").last();
  await availability.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(availability).toHaveAttribute("open", "");
  await expect(availability.locator('a[href^="mailto:"]')).toBeVisible();
});

test("mobile menu works by keyboard, closes on Escape and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.getByRole("button", { name: /menu/i });
  test.skip(
    !(await menu.isVisible()),
    "The wide navigation does not need a disclosure menu",
  );
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .locator(
      '#main-navigation a[href="#blend"], #main-navigation a[href="/#blend"]',
    )
    .filter({ visible: true })
    .first()
    .click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#blend$/);
});

test("archived flavours remain reachable from information and preserve shareable URLs", async ({
  page,
}) => {
  await page.goto("/label-information.html");
  await page.locator('main a[href="/concepts/cafe-mocha/"]').click();
  const name = page.locator("[data-product-name]");
  await expect(name).toContainText(/Café Mocha/i);
  await expect(page.locator("[data-product-status]")).toContainText(
    /Archived/i,
  );
  await expect(page.locator("[data-product-image]").first()).toHaveAttribute(
    "src",
    /cafe-mocha/,
  );
  await expect(page).toHaveURL(/\/concepts\/cafe-mocha\/$/);
  await page.reload();
  await expect(name).toContainText(/Café Mocha/i);
  await expect(page).toHaveTitle(/Café Mocha/);
  await page.goBack();
  await expect(page).toHaveURL(/\/label-information\.html$/);
  await page.goForward();
  await expect(name).toHaveText("Café Mocha");
  await expectNoOverflow(page);
});

test("the current WPC pack has accurate copy, artwork and a keyboard accessible dialog", async ({
  page,
}) => {
  await page.goto(currentProduct);
  const image = page.locator("[data-product-image]").first();
  await expect(image).toHaveAttribute("src", /belgian-chocolate-wpc/);
  await expect(image).toHaveAttribute("alt", /whey protein concentrate/i);
  await expect(page.locator("h1")).toContainText(
    /WHEY\s*PROTEIN\s*CONCENTRATE/i,
  );
  await expect(page.locator("main")).not.toContainText(
    /whey protein isolate|WPI|concentrate\s*\+\s*isolate/i,
  );
  await expect(page.locator("[data-flavor]")).toHaveCount(0);
  await expect(page.locator('[data-gallery-view="back"]')).not.toBeVisible();
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:description"]',
  ]) {
    await expect(page.locator(selector)).toHaveAttribute(
      "content",
      /whey protein concentrate/i,
    );
    await expect(page.locator(selector)).not.toHaveAttribute(
      "content",
      /isolate|blend/i,
    );
  }
  const opener = page.locator("[data-open-packaging]");
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator("#packaging-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("open", "");
  await expect(dialog.locator("img")).toHaveAttribute(
    "src",
    /belgian-chocolate-wpc/,
  );
  await expect(dialog.getByRole("button", { name: /close/i })).toBeVisible();
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await dialog.getByRole("button", { name: /close/i }).click();
  await expect(dialog).not.toBeVisible();
});

test("reduced motion keeps content visible and disables continuous decorative animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const hiddenSections = await page
    .locator("main section")
    .evaluateAll((sections) =>
      sections
        .filter(
          (section) =>
            getComputedStyle(section).opacity === "0" ||
            getComputedStyle(section).visibility === "hidden",
        )
        .map((section) => section.id),
    );
  expect(hiddenSections).toEqual([]);
  const activeContinuousAnimations = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect.getTiming().iterations === Infinity,
        ).length,
  );
  expect(activeContinuousAnimations).toBe(0);
  await expectNoOverflow(page);
});

test("without JavaScript, content and product navigation remain useful", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: testInfo.project.use.viewport,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173",
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    for (const id of ["blend", "story", "about", "contact"])
      await expect(page.locator(`#${id}`)).toBeVisible();
    await expectNoOverflow(page);
    await page.goto(currentProduct);
    await expect(page.locator("[data-product-name]")).toBeVisible();
    await expect(page.locator("[data-flavor]")).toHaveCount(0);
    await page.goto("/label-information.html");
    await page.locator('main a[href="/concepts/cafe-mocha/"]').click();
    await expect(page).toHaveURL(/\/concepts\/cafe-mocha\/$/);
    await expect(page.locator("[data-product-name]")).toHaveText("Café Mocha");
    await expect(page.locator("[data-product-image]").first()).toHaveAttribute(
      "src",
      /cafe-mocha/,
    );
    await expectNoOverflow(page);
    for (const product of products.filter(
      (product) => product !== featuredProduct,
    )) {
      await page.goto(productUrl(product));
      await expect(page.locator("[data-product-name]")).toHaveText(
        product.flavor,
      );
      await expect(
        page.locator("[data-product-image]").first(),
      ).toHaveAttribute("src", new RegExp(product.id));
    }
  } finally {
    await context.close();
  }
});

test("image failures preserve readable content and usable contact navigation", async ({
  page,
}) => {
  await page.route("**/images/**", (route) => route.abort("failed"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/\bjs\b/);
  expect(
    (await page.locator(".site-header").boundingBox()).height,
    "Failed logo must not expand the header",
  ).toBeLessThanOrEqual(100);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
  await expect(
    page.locator('#contact a[href^="mailto:"]').first(),
  ).toBeVisible();
  await expectNoOverflow(page);
  await page.goto(currentProduct);
  await expect(page.locator("html")).toHaveClass(/\bjs\b/);
  expect(
    (await page.locator(".site-header").boundingBox()).height,
    "Failed logo must not expand the product header",
  ).toBeLessThanOrEqual(100);
  await expect(page.locator("[data-product-name]")).toBeVisible();
  await expect(page.locator("[data-product-image]").first()).toHaveAttribute(
    "alt",
    /[\s\S]{10,}/,
  );
  await expectNoOverflow(page);
});

test("a blocked entry module restores visible native navigation", async ({
  page,
}) => {
  let blockedEntries = 0;
  await page.route(
    /\/(?:assets\/main-[^/]+|src\/main)\.js(?:\?.*)?$/,
    (route) => {
      blockedEntries += 1;
      return route.abort("failed");
    },
  );
  await page.goto("/");
  expect(
    blockedEntries,
    "The test must actually block the entry module",
  ).toBeGreaterThan(0);
  await expect(page.locator("html")).not.toHaveClass(/\bjs\b/);
  await expect(page.locator("h1")).toBeVisible();
  const navigation = page.locator("#main-navigation");
  await expect(navigation).toBeVisible();
  for (const id of ["blend", "story", "about", "contact"]) {
    await expect(navigation.locator(`a[href="/#${id}"]`)).toBeVisible();
  }
  await navigation.locator('a[href="/#blend"]').click();
  await expect(page).toHaveURL(/#blend$/);
  await expectNoOverflow(page);
});
