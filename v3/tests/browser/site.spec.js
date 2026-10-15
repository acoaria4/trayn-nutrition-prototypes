import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const path = "/";
const overflow = async (page) =>
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
const productPosition = (page) =>
  page.locator(".study-product").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.x,
      width: rect.width,
      transform: getComputedStyle(el).transform,
    };
  });
const move = async (page, progress) => {
  await page.evaluate(
    (value) => scrollTo({ top: 1800 * value, behavior: "instant" }),
    progress,
  );
  await expect
    .poll(async () =>
      Number(
        await page.locator(".study-story").getAttribute("data-study-progress"),
      ),
    )
    .toBeCloseTo(progress, 2);
};

test("graphic stage moves the pouch and material layers, reverses, and retains a stable inspection beat", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.use.viewport.width < 900);
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("body")).toHaveClass(/is-cinematic/);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  const start = await productPosition(page);
  const ribbon = await page
    .locator(".stream-far")
    .evaluate((el) => getComputedStyle(el).transform);
  await move(page, 0.45);
  const middle = await productPosition(page);
  expect(start.x - middle.x).toBeGreaterThan(100);
  expect(middle.width).toBeGreaterThan(start.width);
  expect(
    await page
      .locator(".stream-far")
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe(ribbon);
  await move(page, 0.9);
  const end = await productPosition(page);
  expect(middle.x - end.x).toBeGreaterThan(100);
  await expect(page.locator("#packaging")).not.toHaveAttribute("inert");
  await page.locator('[data-study-view="back"]').click();
  await expect(page.locator("body")).toHaveAttribute("data-pack-view", "back");
  await expect(page.locator(".study-product [data-study-back]")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator("[data-study-inspect]")).toHaveAttribute(
    "href",
    /wpc-back-1024/,
  );
  const layout = await page.locator("#packaging").evaluate((el) => {
    const heading = el
      .querySelector(".chapter-heading")
      .getBoundingClientRect();
    const copy = el.querySelector(".chapter-copy").getBoundingClientRect();
    return { headingBottom: heading.bottom, copyTop: copy.top };
  });
  expect(layout.headingBottom).toBeLessThan(layout.copyTop);
  await page.screenshot({
    path: testInfo.outputPath("slipstream-packaging.png"),
  });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.setViewportSize({ ...testInfo.project.use.viewport, height: 620 });
  await move(page, 0.9);
  const shortLayout = await page.locator("#packaging").evaluate((el) => ({
    heading: el.querySelector(".chapter-heading").getBoundingClientRect()
      .bottom,
    copy: el.querySelector(".chapter-copy").getBoundingClientRect().top,
  }));
  expect(shortLayout.heading).toBeLessThan(shortLayout.copy);
  await page.setViewportSize(testInfo.project.use.viewport);
  await move(page, 0);
  expect(Math.abs((await productPosition(page)).x - start.x)).toBeLessThan(2);
  await page.screenshot({
    path: testInfo.outputPath("slipstream-mindset.png"),
  });
  await overflow(page);
});

test("phone chapters keep natural flow while pouch and ribbon move with scroll", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.use.viewport.width >= 900);
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const art = page.locator(".chapter-mindset .chapter-art");
  await art.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight + 30),
  );
  await page.waitForTimeout(100);
  const initial = await art
    .locator(".mobile-stream")
    .evaluate((el) => getComputedStyle(el).transform);
  await art.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 90),
  );
  await expect
    .poll(() =>
      art
        .locator(".mobile-stream")
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe(initial);
  await page.locator('header a[href="#packaging"]').click();
  await page.locator('[data-study-view="back"]').click();
  await expect(page.locator("body")).toHaveAttribute("data-pack-view", "back");
  await expect(page.locator(".chapter-packaging [data-study-back]")).toHaveCSS(
    "opacity",
    "1",
  );
  await page
    .locator("#packaging")
    .evaluate((el) =>
      el.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await page.screenshot({ path: testInfo.outputPath("slipstream-phone.png") });
  await overflow(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("reduced motion releases the stage and keeps keyboard views and content readable", async ({
  page,
}) => {
  await page.goto(path);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("#mindset")).not.toHaveAttribute("inert");
  await expect(page.locator("#packaging")).not.toHaveAttribute("inert");
  await expect(page.locator("#study-mindset-heading")).toBeVisible();
  const back = page.locator('[data-study-view="back"]');
  await back.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".chapter-packaging [data-study-back]")).toHaveCSS(
    "opacity",
    "1",
  );
  expect(
    await page
      .locator(".chapter-packaging .mobile-product")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await overflow(page);
});

test("without JavaScript both chapters and direct pack links remain available", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: testInfo.project.use.viewport,
  });
  try {
    const page = await context.newPage();
    await page.goto(
      new URL(path, testInfo.project.use.baseURL || "http://127.0.0.1:4175")
        .href,
    );
    await expect(page.locator("#study-mindset-heading")).toBeVisible();
    await expect(page.locator("#study-packaging-heading")).toBeVisible();
    await expect(page.locator('[data-study-view="back"]')).toHaveAttribute(
      "href",
      /wpc-back-1024/,
    );
    await expect(
      page.locator(".chapter-packaging [data-study-front]"),
    ).toBeVisible();
    await overflow(page);
  } finally {
    await context.close();
  }
});
