import { test, expect } from "@playwright/test";

async function sectionTop(page, selector) {
  return page
    .locator(selector)
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
}

async function moveTo(page, top) {
  await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), top);
  await page.waitForTimeout(150);
}

async function expectScrollAt(page, top) {
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(top, 0);
}

const transform = (locator) =>
  locator.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
  });
const difference = (first, second) =>
  Math.max(...first.map((value, index) => Math.abs(value - second[index])));

async function scrollStory(page, progress) {
  // ScrollTrigger refreshes after the browser's resize event settles.
  await expect
    .poll(() =>
      page.locator(".tension-story").evaluate((story) => {
        const hero = story.querySelector(".tension-hero");
        return Math.abs(story.offsetHeight - hero.offsetHeight - 2040);
      }),
    )
    .toBeLessThan(3);

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
  const sheen = page.locator(".tension-sheen");
  const initialLight = await transform(sheen);
  await expect(sheen).toHaveCSS("opacity", "0");
  await scrollStory(page, 0.34);
  await expect(sheen).toHaveCSS("opacity", "0");
  await expectRestoredTransform(sheen, initialLight);
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
  const firstLight = await transform(sheen);
  expect(difference(firstLight, initialLight)).toBeGreaterThan(1);
  expect(
    await sheen.evaluate((el) => Number(getComputedStyle(el).opacity)),
  ).toBeGreaterThan(0);
  await scrollStory(page, 0.8);
  await expect
    .poll(async () => difference(await transform(stage), firstChapter))
    .toBeGreaterThan(0.01);
  await scrollStory(page, 0.4);
  await expectRestoredTransform(stage, firstChapter);
  await expectRestoredTransform(sheen, firstLight);
  await scrollStory(page, 0);
  await expectRestoredTransform(stage, initial);
  await expect(sheen).toHaveCSS("opacity", "0");
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
    { width: 844, height: 390 },
    { width: 1280, height: 480 },
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

test("the opening and both scroll chapters fit the viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "enabled");
  await page.evaluate(() => document.fonts.ready);
  for (const progress of [0, 0.4, 0.8]) {
    await scrollStory(page, progress);
    await expect
      .poll(() =>
        page.evaluate(() => {
          const hero = document.querySelector(".tension-hero");
          const scene = document.querySelector(".tension-scene");
          return Math.max(
            Math.abs(hero.getBoundingClientRect().bottom - innerHeight),
            Math.abs(scene.getBoundingClientRect().bottom - innerHeight),
          );
        }),
      )
      .toBeLessThan(2);
    const bounds = await page.evaluate((progress) => {
      const selectors =
        progress === 0
          ? [
              ".tension-heading",
              ".tension-stage .hero-pouch",
              ".tension-hero-bottom",
            ]
          : [
              ".tension-stage .hero-pouch",
              `[data-chapter="${progress < 0.7 ? 1 : 2}"]`,
              ".story-progress",
            ];
      return selectors.map((selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return {
          selector,
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: innerWidth,
          height: innerHeight,
        };
      });
    }, progress);
    for (const rect of bounds) {
      expect(rect.top, rect.selector).toBeGreaterThanOrEqual(-1);
      expect(rect.bottom, rect.selector).toBeLessThanOrEqual(rect.height + 1);
      expect(rect.left, rect.selector).toBeGreaterThanOrEqual(-1);
      expect(rect.right, rect.selector).toBeLessThanOrEqual(rect.width + 1);
    }
    if (["laptop", "mobile", "compact"].includes(testInfo.project.name)) {
      await page.screenshot({
        path: testInfo.outputPath(`hero-${progress}.png`),
      });
    }
    if (progress > 0 && (await page.viewportSize()).width <= 800) {
      const pouch = await page
        .locator(".tension-stage .hero-pouch")
        .boundingBox();
      const chapter = await page
        .locator(`[data-chapter="${progress < 0.7 ? 1 : 2}"]`)
        .boundingBox();
      expect(pouch.y + pouch.height).toBeLessThan(chapter.y);
    }
  }
});

test("resizing a laptop keeps one working scroll scene", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "laptop",
    "Laptop resize regression runs once",
  );
  await page.goto("/");
  await scrollStory(page, 0.4);
  for (const height of [600, 900, 1400]) {
    await page.setViewportSize({ width: 1280, height });
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    const progress = height === 600 ? 0.8 : 0.4;
    await scrollStory(page, progress);
    await expect(
      page.locator(`[data-chapter="${progress === 0.8 ? 2 : 1}"]`),
    ).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(".tension-hero")
          .evaluate((el) =>
            Math.abs(el.getBoundingClientRect().bottom - innerHeight),
          ),
      )
      .toBeLessThan(2);
  }
});

test("mobile browser height changes leave no gap and preserve scroll pacing", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.use.isMobile,
    "Touch browser viewport regression",
  );
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await scrollStory(page, 0.1);
  const openingHeight = await page
    .locator(".tension-opening")
    .evaluate((el) => el.offsetHeight);
  // Model iPhone browser controls retracting: the small viewport composition
  // remains stable while the dynamic viewport grows by less than 25%.
  await page.addStyleTag({
    content: `.tension-hero { --hero-opening-height: ${openingHeight}px !important; }`,
  });
  const viewport = page.viewportSize();
  const originalScroll = await page.evaluate(() => scrollY);
  for (const height of [viewport.height + 120, viewport.height]) {
    await page.setViewportSize({ width: viewport.width, height });
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(() => {
          const hero = document.querySelector(".tension-hero");
          const scene = document.querySelector(".tension-scene");
          const story = document.querySelector(".tension-story");
          return Math.max(
            Math.abs(hero.getBoundingClientRect().bottom - innerHeight),
            Math.abs(scene.getBoundingClientRect().bottom - innerHeight),
            Math.abs(story.offsetHeight - hero.offsetHeight - 2040),
          );
        }),
      )
      .toBeLessThan(2);
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(originalScroll, 0);
    await expect(page.locator(".tension-opening")).toHaveCSS(
      "height",
      `${openingHeight}px`,
    );
    await expect
      .poll(async () =>
        Number(
          await page
            .locator(".tension-hero")
            .getAttribute("data-story-progress"),
        ),
      )
      .toBeCloseTo(0.1, 3);
  }
  await scrollStory(page, 0.4);
  await expect(page.locator('[data-chapter="1"]')).toBeVisible();
  await scrollStory(page, 0.8);
  await expect(page.locator('[data-chapter="2"]')).toBeVisible();
});

test("desktop softly settles at selected starts and leaves reading positions free", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.use.isMobile || testInfo.project.use.viewport.width <= 800,
    "Desktop wheel snapping",
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "enabled");
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(20, 200);
  for (const id of ["about", "story", "blend"]) {
    const top = await sectionTop(page, `#${id}`);
    await moveTo(page, top - 80);
    await page.mouse.wheel(0, 40);
    await expectScrollAt(page, top);
    await page.mouse.wheel(0, 20);
    await expectScrollAt(page, top + 20);
    await page.waitForTimeout(400);
    await expectScrollAt(page, top + 20);
  }
  const interruptTarget = await sectionTop(page, "#story");
  await moveTo(page, interruptTarget - 80);
  await page.mouse.wheel(0, 40);
  await page.waitForFunction(
    (top) => scrollY > top - 28 && scrollY < top - 1,
    interruptTarget,
    { polling: "raf" },
  );
  await page.keyboard.press("Shift");
  const interruptedPosition = await page.evaluate(() => scrollY);
  expect(interruptedPosition).toBeLessThan(interruptTarget - 1);
  await page.waitForTimeout(400);
  await expectScrollAt(page, interruptedPosition);
  const middle = (await sectionTop(page, "#story")) + 200;
  await moveTo(page, middle);
  await page.mouse.wheel(0, 30);
  await expectScrollAt(page, middle + 30);
  await page.waitForTimeout(400);
  await expectScrollAt(page, middle + 30);
  await scrollStory(page, 0.4);
  const heroPosition = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 40);
  await expectScrollAt(page, heroPosition + 40);
  await page.waitForTimeout(400);
  await expectScrollAt(page, heroPosition + 40);
  const questions = Math.min(
    (await sectionTop(page, "#questions")) + 100,
    await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight - 60,
    ),
  );
  await moveTo(page, questions);
  await page.mouse.wheel(0, 30);
  await expectScrollAt(page, questions + 30);
  await page.waitForTimeout(400);
  await expectScrollAt(page, questions + 30);
});

test("touch, narrow and reduced-motion layouts scroll freely near section starts", async ({
  page,
}, testInfo) => {
  if (testInfo.project.use.viewport.width > 800)
    await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion",
    /enabled|reduced/,
  );
  await page.evaluate(() => document.fonts.ready);
  const top = await sectionTop(page, "#about");
  await moveTo(page, top - 80);
  await page.mouse.move(20, 200);
  await page.mouse.wheel(0, 40);
  await expectScrollAt(page, top - 40);
  await page.waitForTimeout(500);
  await expectScrollAt(page, top - 40);
});
