import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const browserErrors = new WeakMap();
test.beforeEach(({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(({ page }) => {
  expect(browserErrors.get(page), "uncaught browser errors").toEqual([]);
});

async function ready(page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("body")).toHaveClass(/has-hero-motion/);
}
async function progress(page, selector, value) {
  const top = await page
    .locator(selector)
    .evaluate(
      (el, p) =>
        Number(el.dataset.scrollStart) +
        (Number(el.dataset.scrollEnd) - Number(el.dataset.scrollStart)) * p,
      value,
    );
  await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
  const name =
    selector === ".hero-story" ? "data-hero-progress" : "data-study-progress";
  await expect
    .poll(async () => Number(await page.locator(selector).getAttribute(name)))
    .toBeCloseTo(value, 2);
}
async function overflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}
async function packaging(page, testInfo) {
  if (testInfo.project.use.viewport.width >= 900) {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "The Packaging", exact: true })
      .click();
  } else {
    await page.locator(".site-menu summary").click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "The Packaging", exact: true })
      .click();
    await expect(page.locator(".site-menu")).not.toHaveAttribute("open", "");
  }
}

test("hero fits the measured header, scrubs 2040 px, delays light, and reverses", async ({
  page,
}) => {
  await ready(page);
  expect(
    await page
      .locator(".hero-story")
      .evaluate(
        (el) => Number(el.dataset.scrollEnd) - Number(el.dataset.scrollStart),
      ),
  ).toBeCloseTo(2040, 1);
  const initial = await page
    .locator(".hero-product")
    .evaluate((el) => getComputedStyle(el).transform);
  await expect(page.locator(".hero-light")).toHaveCSS("opacity", "0");
  await progress(page, ".hero-story", 0.3);
  expect(
    await page
      .locator(".hero-product")
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe(initial);
  await expect(page.locator(".hero-light")).toHaveCSS("opacity", "0");
  await progress(page, ".hero-story", 0.63);
  expect(
    Number(
      await page
        .locator(".hero-light")
        .evaluate((el) => getComputedStyle(el).opacity),
    ),
  ).toBeGreaterThan(0.5);
  await progress(page, ".hero-story", 0.9);
  const fit = await page.locator(".hero-scene").evaluate((el) => ({
    top: el.getBoundingClientRect().top,
    bottom: el.getBoundingClientRect().bottom,
    header: document.querySelector("header").offsetHeight,
    height: innerHeight,
  }));
  expect(Math.abs(fit.top - fit.header)).toBeLessThan(2);
  expect(Math.abs(fit.bottom - fit.height)).toBeLessThan(2);
  await expect(page.locator(".hero-light")).toHaveCSS("opacity", "0");
  await expect(page.locator(".hero-flavour")).not.toHaveAttribute("inert");
  await progress(page, ".hero-story", 0);
  expect(
    await page
      .locator(".hero-product")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(initial);
  expect(
    await page
      .locator(".hero-product .pouch-image")
      .evaluate((el) => getComputedStyle(el).clipPath),
  ).toContain("pouch-front-mask");
  await expect(page.locator(".study-frame,.foil-near")).toHaveCount(0);
  await overflow(page);
});

async function chapterProgress(page, selector, fraction, offset) {
  const y = await page.locator(selector).evaluate(
    (el, { fraction, offset }) => {
      const top = el.getBoundingClientRect().top + scrollY;
      const start = top - innerHeight * 0.95;
      const end = top - document.querySelector("header").offsetHeight - offset;
      return start + (end - start) * fraction;
    },
    { fraction, offset },
  );
  await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
  const attribute =
    selector === ".mindset-poster"
      ? "data-motion-progress"
      : "data-reveal-progress";
  await expect
    .poll(async () =>
      Number(await page.locator(selector).getAttribute(attribute)),
    )
    .toBeCloseTo(fraction, 2);
}

test("GET BUILT moves in opposite directions and locks without another pin or pouch", async ({
  page,
}, testInfo) => {
  await ready(page);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await expect(
    page.locator(".study-story .pin-spacer, #mindset .pouch-image"),
  ).toHaveCount(0);
  await chapterProgress(page, ".mindset-poster", 0.05, 140);
  const positions = () =>
    page.locator(".mindset-poster").evaluate((el) => {
      return [".mindset-get", ".mindset-built"].map(
        (selector) =>
          new DOMMatrix(getComputedStyle(el.querySelector(selector)).transform)
            .m41,
      );
    });
  const beginning = await positions();
  expect(beginning[0]).toBeLessThan(-5);
  expect(beginning[1]).toBeGreaterThan(5);
  await chapterProgress(page, ".mindset-poster", 1, 140);
  const end = await positions();
  expect(Math.abs(end[0])).toBeLessThan(1);
  expect(Math.abs(end[1])).toBeLessThan(1);
  await page.screenshot({ path: testInfo.outputPath("typography-poster.png") });
  await chapterProgress(page, ".mindset-poster", 0.05, 140);
  expect((await positions())[0]).toBeLessThan(-5);
  await overflow(page);
});

test("packaging pulls back from a macro crop, holds still for inspection and follows natural flow", async ({
  page,
}, testInfo) => {
  await ready(page);
  await chapterProgress(page, ".packaging-art", 0.1, 40);
  const scale = () =>
    page
      .locator(".packaging-reveal")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11);
  expect(await scale()).toBeGreaterThan(2.5);
  await chapterProgress(page, ".packaging-art", 1, 40);
  expect(await scale()).toBeCloseTo(1, 2);
  const matrix = await page.locator(".packaging-reveal").evaluate((el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return { x: m.m41, y: m.m42, rotation: m.m12 };
  });
  expect(matrix).toEqual({ x: 0, y: 0, rotation: 0 });
  await chapterProgress(page, ".packaging-art", 0.2, 40);
  expect(await scale()).toBeGreaterThan(2);
  await page.locator('[data-study-view="back"]').focus();
  expect(await scale()).toBeCloseTo(1, 2);
  await page.keyboard.press("Enter");
  await expect(page.locator("body")).toHaveAttribute("data-pack-view", "back");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await expect(page.locator("#packaging")).not.toHaveAttribute("inert");
  const desktop = testInfo.project.use.viewport.width >= 900;
  await packaging(page, testInfo);
  if (desktop) {
    const layout = await page.locator("#packaging").evaluate((el) => ({
      headingBottom: el
        .querySelector(".chapter-heading")
        .getBoundingClientRect().bottom,
      copyTop: el.querySelector(".chapter-copy").getBoundingClientRect().top,
    }));
    expect(layout.headingBottom).toBeLessThan(layout.copyTop);
  }
  await page.screenshot({ path: testInfo.outputPath("macro-packaging.png") });
  await overflow(page);
});

test("front/back inspection, original artwork, zoom and rapid reopening retain focus and scroll", async ({
  page,
}, testInfo) => {
  await ready(page);
  await packaging(page, testInfo);
  const back = page.locator('[data-study-view="back"]');
  await back.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("body")).toHaveAttribute("data-pack-view", "back");
  const opener = page.locator("[data-study-inspect]");
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("data-view", "back");
  await dialog.getByRole("button", { name: "Back Label", exact: true }).click();
  await expect(dialog.locator("[data-inspector-image]")).toHaveAttribute(
    "src",
    /back-label.webp$/,
  );
  await dialog.getByRole("button", { name: "Zoom In" }).click();
  await expect(dialog).toHaveClass(/is-zoomed/);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await page.evaluate(() => {
    const link = document.querySelector("[data-study-inspect]");
    link.click();
    document.querySelector("dialog").close();
    link.click();
  });
  await expect(dialog).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("");
  await expect(opener).toBeFocused();
});

test("label tabs preserve printed values and questions interrupt cleanly", async ({
  page,
}) => {
  await ready(page);
  const tabs = page.locator("[data-label-tabs]");
  await expect(
    tabs.getByRole("row", { name: /Protein \(dry basis\)/ }),
  ).toContainText("23.00");
  const nutrition = tabs.getByRole("tab", { name: "Nutrition", exact: true });
  await nutrition.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    tabs.getByRole("tab", { name: "Ingredients", exact: true }),
  ).toBeFocused();
  await expect(tabs.getByRole("tabpanel")).toContainText("Contains milk");
  await expect(tabs.getByRole("tabpanel")).toContainText("Sweetener (INS 955)");
  await page.keyboard.press("End");
  await expect(tabs.getByRole("tabpanel")).toContainText(
    "200 ml cold water or milk",
  );
  await expect(tabs.getByRole("tabpanel")).toContainText("Two servings daily");
  const first = page.locator(".faq-list details").first();
  await first.locator("summary").click();
  await first.locator("summary").click();
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
  await expect(first.locator(".faq-answer")).not.toHaveAttribute("inert");
  await first.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(first).not.toHaveAttribute("open", "");
  await overflow(page);
});

async function entryProgress(page, selector, fraction, startViewport, endViewport, headerOffset = 0) {
  const top = await page.locator(selector).first().evaluate((el, values) => {
    const docTop = el.getBoundingClientRect().top + scrollY;
    const start = docTop - innerHeight * values.startViewport;
    const end = docTop - (values.headerOffset ? document.querySelector("header").offsetHeight + values.headerOffset : innerHeight * values.endViewport);
    // WebKit rounds scroll positions to whole pixels. Cross the end by two
    // pixels so a fractional trigger boundary can reach its settled state.
    return start + (end - start) * values.fraction + (values.fraction === 1 ? 2 : 0);
  }, { fraction, startViewport, endViewport, headerOffset });
  await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), top);
}

test("red takeover clears early, settles for input and keeps every information panel readable", async ({ page }, testInfo) => {
  await ready(page);
  const product = page.locator("#product");
  const end = testInfo.project.use.viewport.width >= 900 ? 0.72 : 0.84;
  const curtain = page.locator(".product-curtain");
  await expect(product).toHaveCSS("background-color", "rgb(248, 32, 48)");
  await expect(product.locator("img,.label-study,.label-assembly")).toHaveCount(0);
  await entryProgress(page, "#product", 0.15, 0.95, end);
  await expect.poll(async () => Number(await product.getAttribute("data-takeover-progress"))).toBeGreaterThan(0.02);
  const travel = () => curtain.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41 / el.clientWidth);
  expect(await travel()).toBeLessThan(0.3);
  await entryProgress(page, "#product", 1, 0.95, end);
  await expect.poll(travel).toBeCloseTo(1, 2);
  await entryProgress(page, "#product", 0.15, 0.95, end);
  await expect.poll(travel).toBeLessThan(0.3);
  await page.getByRole("tab", { name: "Ingredients", exact: true }).focus();
  await expect(product).toHaveAttribute("data-takeover-progress", "1");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tabpanel")).toContainText("200 ml cold water or milk");
  await expect(page.locator(".tab-indicator")).toHaveCSS("transition-duration", "0s");
  for (const name of ["Nutrition", "Ingredients", "How to Use"]) {
    await page.getByRole("tab", { name, exact: true }).click();
    await expect(page.getByRole("tabpanel")).toHaveCSS("transform", "none");
    await expect(page.getByRole("tabpanel").locator("p").first()).toHaveCSS("color", "rgb(9, 9, 9)");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.getByRole("tab", { name: "Nutrition", exact: true }).click();
  for (const heading of await page.getByRole("tabpanel").locator("thead").all()) {
    await expect(heading).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  }
  await expect(product.locator('a[href$=".pdf"]')).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("red-product.png") });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await overflow(page);
});

test("all five question dividers fill, including the final line after answer expansion", async ({ page }, testInfo) => {
  await ready(page);
  await expect(page.locator(".faq-rule")).toHaveCount(5);
  await expect(page.locator(".question-index,[data-question-caption]")).toHaveCount(0);
  const row = page.locator(".faq-list details").first();
  const rule = row.locator(".faq-rule");
  await expect(rule).toBeVisible();
  await entryProgress(page, ".faq-list details", 0.05, 0.95, 0.72);
  const scale = el => el.evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m11);
  await expect.poll(() => scale(rule)).toBeLessThan(0.3);
  await entryProgress(page, ".faq-list details", 1, 0.95, 0.72);
  await expect.poll(() => scale(rule)).toBeCloseTo(1, 2);
  const final = page.locator(".faq-rule-final");
  await expect(final).toBeVisible();
  await entryProgress(page, ".faq-end", 0.05, 0.95, 0.72);
  await expect.poll(() => scale(final)).toBeLessThan(0.3);
  await entryProgress(page, ".faq-end", 1, 0.95, 0.72);
  await expect.poll(() => scale(final)).toBeCloseTo(1, 2);
  await expect(final).toHaveCSS("background-color", "rgb(245, 244, 240)");
  const last = page.locator(".faq-list details").last();
  await last.locator("summary").click();
  await expect(last).toHaveAttribute("data-expanded", "true");
  await expect(last.locator(".faq-icon i").last()).toHaveCSS("opacity", "0");
  await expect.poll(() => last.evaluate(el => el.getAnimations().length)).toBe(0);
  await entryProgress(page, ".faq-end", 1, 0.95, 0.72);
  await expect.poll(() => scale(final)).toBeCloseTo(1, 2);
  await last.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(last).not.toHaveAttribute("open", "");
  await entryProgress(page, ".faq-end", 1, 0.95, 0.72);
  await expect.poll(() => scale(final)).toBeCloseTo(1, 2);
  await page.screenshot({ path: testInfo.outputPath("complete-question-rules.png") });
  await overflow(page);
});

test("contact strokes join the email underline and settle before interaction", async ({ page }, testInfo) => {
  await ready(page);
  const email = page.locator(".contact-email");
  await entryProgress(page, ".contact-email", 0.05, 0.95, 0.65);
  const matrix = () => page.locator(".contact-stroke-red").evaluate(el => {
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return { x: m.m41, y: m.m42, rotation: m.m12, scale: m.m11 };
  });
  await expect.poll(async () => (await matrix()).y).toBeGreaterThan(10);
  await page.evaluate(() => scrollTo({top: document.documentElement.scrollHeight, behavior: "instant"}));
  await expect.poll(async () => Number(await email.getAttribute("data-closing-progress"))).toBe(1);
  const end = await matrix();
  expect(end.x).toBe(0); expect(end.y).toBe(0); expect(end.rotation).toBe(0); expect(end.scale).toBe(1);
  await email.focus();
  await expect(email).toHaveAttribute("data-closing-progress", "1");
  await expect(page.locator("#contact-heading")).toHaveCSS("transform", "none");
  await expect(email).toHaveAttribute("href", "mailto:traynnutrition@gmail.com");
  await expect(page.locator(".contact-ribbon")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("contact-resolution.png") });
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  await overflow(page);
});

test("reduced motion and short landscape keep all chapters readable without pinning", async ({
  page,
}) => {
  await ready(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  for (const selector of [
    ".hero-opening",
    ".hero-flavour",
    "#mindset",
    "#packaging",
  ]) {
    await expect(page.locator(selector)).toBeVisible();
    await expect(page.locator(selector)).not.toHaveAttribute("inert");
  }
  for (const selector of [".product-curtain", ".faq-rule", ".contact-stroke-red"]) {
    expect(await page.locator(selector).first().evaluate(el => el.style.transform)).toBe("");
  }
  await expect(page.locator(".product-curtain")).toBeHidden();
  await expect(page.locator("#product")).toHaveCSS("background-color", "rgb(248, 32, 48)");
  await page.setViewportSize({ width: 844, height: 390 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("#study-packaging-heading")).toBeVisible();
  await overflow(page);
});

test("no JavaScript retains the full story, original-label link and all information panels", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: testInfo.project.use.viewport,
  });
  try {
    const page = await context.newPage();
    await page.goto(testInfo.project.use.baseURL || "http://127.0.0.1:4175/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const id of [
      "study-mindset-heading",
      "study-packaging-heading",
      "product-heading",
      "questions-heading",
      "contact-heading",
    ]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await expect(page.locator(".product-curtain")).toBeHidden();
    await expect(page.locator("#product")).toHaveCSS("background-color", "rgb(248, 32, 48)");
    await expect(page.locator("[data-label-panel]")).toHaveCount(3);
    await expect(page.locator("#label-ingredients")).toBeVisible();
    await expect(page.locator("#label-usage")).toBeVisible();
    await expect(page.locator('[data-study-view="back"]')).toHaveAttribute(
      "href",
      /wpc-back-1024/,
    );
    await expect(page.locator('.product-intro a[href$=".pdf"]')).toHaveCount(1);
    await overflow(page);
  } finally {
    await context.close();
  }
});

test("viewport changes preserve hero pacing and direct anchors clear the header", async ({
  page,
}, testInfo) => {
  await ready(page);
  await progress(page, ".hero-story", 0.2);
  const initial = await page.evaluate(() => scrollY);
  const viewport = testInfo.project.use.viewport;
  await page.setViewportSize({ ...viewport, height: viewport.height + 100 });
  await expect
    .poll(() =>
      page
        .locator(".hero-scene")
        .evaluate((el) =>
          Math.abs(el.getBoundingClientRect().bottom - innerHeight),
        ),
    )
    .toBeLessThan(2);
  expect(
    await page
      .locator(".hero-story")
      .evaluate(
        (el) => Number(el.dataset.scrollEnd) - Number(el.dataset.scrollStart),
      ),
  ).toBeCloseTo(2040, 1);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(initial, 0);
  await page.setViewportSize(viewport);
  await page.goto("/#product");
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page
        .locator("#product")
        .evaluate((el) =>
          Math.abs(
            el.getBoundingClientRect().top -
              document.querySelector("header").offsetHeight,
          ),
        ),
    )
    .toBeLessThan(2);
  await page.goto("/");
  await page.locator(".study-skip").focus();
  await expect(page.locator(".study-skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#product")).toBeFocused();
});
