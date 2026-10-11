import { test, expect } from "@playwright/test";

const transform = (locator) =>
  locator.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
  });
const difference = (first, second) =>
  Math.max(...first.map((value, index) => Math.abs(value - second[index])));

async function scrollStory(page, progress) {
  const position = await page
    .locator(".tension-story")
    .evaluate((story, value) => {
      const hero = story.querySelector(".tension-hero");
      const start = story.getBoundingClientRect().top + scrollY;
      return start + (story.offsetHeight - hero.offsetHeight) * value;
    }, progress);
  await page.evaluate(
    (top) => scrollTo({ top, behavior: "instant" }),
    position,
  );
  await expect
    .poll(async () =>
      Number(
        await page.locator(".tension-hero").getAttribute("data-story-progress"),
      ),
    )
    .toBeCloseTo(progress, 1);
}

async function expectRestoredTransform(stage, expected) {
  await expect
    .poll(
      async () => {
        const measured = await transform(stage);
        return Math.max(
          ...measured.map(
            (value, index) =>
              Math.abs(value - expected[index]) / (index < 4 ? 0.001 : 0.6),
          ),
        );
      },
      {
        message:
          "Revisiting the same scroll position must restore the same pouch composition",
      },
    )
    .toBeLessThan(1);
}

test("one continuous pouch scene stays pinned, advances and reverses with scroll", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "enabled");
  await expect(page.locator(".tension-story")).toHaveClass(/is-story-motion/);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await expect(page.locator(".tension-stage .hero-pouch")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);

  const stage = page.locator(".tension-stage");
  await scrollStory(page, 0);
  // Wait for any short opening reveal before measuring a scroll-owned transform.
  await page.waitForTimeout(1000);
  const initial = await transform(stage);
  await scrollStory(page, 0.4);
  await expect
    .poll(async () => difference(await transform(stage), initial))
    .toBeGreaterThan(1);
  await expect
    .poll(async () =>
      Math.abs((await page.locator(".tension-scene").boundingBox()).y),
    )
    .toBeLessThan(3);
  await page.waitForTimeout(800);
  const firstChapter = await transform(stage);
  await scrollStory(page, 0.8);
  await expect
    .poll(async () => difference(await transform(stage), firstChapter))
    .toBeGreaterThan(0.01);
  await scrollStory(page, 0.4);
  await expectRestoredTransform(stage, firstChapter);
  await scrollStory(page, 0);
  await expectRestoredTransform(stage, initial);
  await expect(page.locator("h1")).toBeVisible();
});

test("enabling reduced motion releases the scene and restores readable chapters", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await scrollStory(page, 0.65);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".tension-story")).not.toHaveClass(
    /is-story-motion/,
  );
  const stage = page.locator(".tension-stage");
  const reduced = await transform(stage);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expectRestoredTransform(stage, reduced);
  const chapters = page.locator(".tension-chapter");
  await expect(chapters).toHaveCount(2);
  for (const chapter of await chapters.all()) {
    await expect(chapter).toBeVisible();
    await expect(chapter).not.toHaveAttribute("aria-hidden", "true");
    expect(
      await chapter.evaluate((element) =>
        Number(getComputedStyle(element).opacity),
      ),
    ).toBeGreaterThan(0.99);
  }
});

test("keyboard navigation and direct section URLs reach the static product summary", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  const menu = page.getByRole("button", { name: /menu/i });
  if (await menu.isVisible()) {
    await menu.focus();
    await page.keyboard.press("Enter");
  }
  const link = page.locator('#main-navigation a[href="/#blend"]');
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#blend$/);
  await expect(page.locator("#blend")).toBeInViewport();
  expect(
    await page
      .locator("#blend")
      .evaluate((element) => Boolean(element.closest(".pin-spacer"))),
  ).toBe(false);
  await page.goto("/#blend");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await expect(page.locator("#blend")).toBeInViewport();
});

test("the 1024px layout retains a bounded reversible composition", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "One extra 1024px layout check complements the configured widths",
  );
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await scrollStory(page, 0.6);
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  const box = await page.locator(".tension-stage .hero-pouch").boundingBox();
  expect(box.width).toBeGreaterThan(100);
  expect(box.x + box.width).toBeGreaterThan(0);
  expect(box.x).toBeLessThan(1024);
  await scrollStory(page, 0);
  await expect(page.locator("h1")).toBeVisible();
});

test("short viewports keep the chapters and product link in normal scroll flow", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Explicit short viewport coverage runs once",
  );
  for (const viewport of [
    { width: 390, height: 600 },
    { width: 1280, height: 720 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator(".tension-story")).not.toHaveClass(
      /is-story-motion/,
    );
    for (const chapter of await page.locator(".tension-chapter").all()) {
      await expect(chapter).toBeVisible();
      await expect(chapter).not.toHaveAttribute("aria-hidden", "true");
    }
    const productLink = page.locator('.tension-chapter a[href="#blend"]');
    await productLink.scrollIntoViewIfNeeded();
    await expect(productLink).toBeInViewport();
    await productLink.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#blend")).toBeInViewport();
  }
});
