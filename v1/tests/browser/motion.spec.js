import { test, expect } from "@playwright/test";

test("hero motion responds to scroll and reverts immediately when reduced motion is enabled", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "The scroll composition is deliberately desktop-only",
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "enabled");
  await page.waitForTimeout(1100);
  const pouch = page.locator(".hero-pouch");
  const initial = await pouch.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: "instant" }));
  await page.waitForTimeout(1100);
  const scrolled = await pouch.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  expect(
    scrolled,
    "ScrollTrigger should produce a real, bounded change in the product composition",
  ).not.toBe(initial);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  const reduced = await pouch.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(200);
  expect(
    await pouch.evaluate((element) => getComputedStyle(element).transform),
  ).toBe(reduced);
  await expect(page.locator("h1")).toBeVisible();
});
