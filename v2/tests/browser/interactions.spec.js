import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const productPath = "/products/trayn-whey-rich-chocolate/";
async function accessible(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

test("label tabs show source-backed information and support keyboard navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const root = page.locator("[data-label-tabs]");
  const nutrition = root.getByRole("tab", { name: "Nutrition", exact: true });
  await expect(nutrition).toHaveAttribute("aria-selected", "true");
  await expect(root.getByRole("tabpanel")).toBeVisible();
  await expect(
    root.getByRole("row", { name: /Protein \(dry basis\)/ }),
  ).toContainText("23.00");
  await nutrition.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    root.getByRole("tab", { name: "Ingredients", exact: true }),
  ).toBeFocused();
  await expect(root.getByRole("tabpanel")).toContainText("Sweetener (INS 955)");
  await expect(root.getByRole("tabpanel")).toContainText("Contains milk");
  await page.keyboard.press("End");
  await expect(root.getByRole("tabpanel")).toContainText(
    "200 ml cold water or milk",
  );
  await expect(root.getByRole("tabpanel")).toContainText("Two servings daily");
  await root
    .locator("summary")
    .filter({ hasText: "Usage notes from the label" })
    .click();
  await expect(root.getByRole("tabpanel")).toContainText(
    "Not recommended for children",
  );
  await accessible(page);
  await nutrition.click();
  await root.getByRole("tabpanel").locator("summary").click();
  await expect(root.getByRole("table")).toHaveCount(4);
  await expect(root.getByRole("row", { name: /Leucine/ })).toContainText(
    "2.79",
  );
  if (["laptop", "mobile", "compact"].includes(testInfo.project.name)) {
    await root.getByRole("tabpanel").locator("summary").click();
    await root.evaluate((el) =>
      el.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    await page.screenshot({ path: testInfo.outputPath("label-tabs.png") });
  }
  await page.goto(productPath);
  await page.getByRole("tab", { name: "Ingredients", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Cocoa Powder (Alkalized)",
  );
  await page.goto("/concepts/cafe-mocha/");
  await expect(page.locator("[data-label-tabs]")).toHaveCount(0);
});

test("front/back section preview keeps inspection in sync through rapid changes", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  const preview = page.locator("[data-pack-preview]");
  const back = page.locator('[data-pack-view="back"]');
  const front = page.locator('[data-pack-view="front"]');
  await back.click();
  await front.click();
  await back.click();
  await expect(preview).toHaveAttribute("data-view", "back");
  await expect(preview.locator(".pack-preview-back")).toHaveCSS("opacity", "1");
  await expect(preview.locator(".pack-preview-front")).toHaveCSS(
    "opacity",
    "0",
  );
  await expect(preview.locator("[data-open-packaging]")).toHaveAttribute(
    "href",
    /wpc-back-1024/,
  );
  await preview.locator("[data-open-packaging]").click();
  await expect(page.locator("#packaging-dialog")).toHaveAttribute(
    "data-selected-view",
    "back",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#packaging-dialog")).not.toBeVisible();
  await expect(preview.locator("[data-open-packaging]")).toBeFocused();
  await front.focus();
  await page.keyboard.press("Enter");
  await expect(preview.locator(".pack-preview-front")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(preview).toHaveClass(/is-instant/);
  await accessible(page);
  if (["laptop", "mobile"].includes(testInfo.project.name)) {
    await page.locator("#story").scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("pack-preview.png") });
  }
});

test("FAQ pointer animations reverse cleanly and keyboard toggles remain native", async ({
  page,
}) => {
  await page.goto("/");
  const question = page.locator("#questions details").nth(1);
  const summary = question.locator("summary");
  await summary.click();
  await page.waitForTimeout(30);
  await summary.click();
  await page.waitForTimeout(30);
  await summary.click();
  await expect(question).toHaveAttribute("open", "");
  await expect
    .poll(() => question.evaluate((el) => el.getAnimations().length))
    .toBe(0);
  await expect(question.locator(".faq-answer")).toHaveJSProperty(
    "inert",
    false,
  );
  await expect(question).toHaveCSS("overflow", "visible");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(question).not.toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("open", "");
  await expect(question.locator("p")).toBeVisible();
  await accessible(page);
});

test("reduced motion leaves section controls functional without movement", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('[data-pack-view="back"]').click();
  await expect(page.locator(".pack-preview-back")).toHaveCSS("opacity", "1");
  await expect(page.locator(".pack-preview-back")).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await page.getByRole("tab", { name: "How to use", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toBeVisible();
  const question = page.locator("#questions details").nth(1);
  await question.locator("summary").click();
  expect(await question.evaluate((el) => el.getAnimations().length)).toBe(0);
  await expect(page.locator(".trayn-mindset")).not.toHaveClass(
    /mindset-entered/,
  );
});

test("without JavaScript all label panels and direct packaging links remain readable", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: testInfo.project.use.viewport,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("[data-label-panel]")).toHaveCount(3);
  for (const panel of await page.locator("[data-label-panel]").all())
    await expect(panel).toBeVisible();
  await expect(page.locator(".pack-preview-front")).toBeVisible();
  await expect(page.locator(".pack-preview-back")).not.toBeVisible();
  await expect(page.locator('[data-pack-view="back"]')).toHaveAttribute(
    "href",
    /wpc-back-1024/,
  );
  await page.locator("#home-label-preparation summary").click();
  await expect(page.locator("#home-label-preparation")).toContainText(
    "Not recommended for children",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await context.close();
});

test("packaging inspector survives an interrupted close and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.locator(".wpc-pack-copy [data-open-packaging]");
  const dialog = page.locator("#packaging-dialog");
  await opener.click();
  await expect(dialog).toBeVisible();
  await dialog.locator(".dialog-close").click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".dialog-close")).toBeFocused();
  await expect(dialog).not.toHaveAttribute("data-closing");
  expect(await dialog.evaluate((el) => el.getAnimations().length)).toBe(0);
  await page.keyboard.press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  // Reopen within the same task, before the native queued close event runs.
  await opener.evaluate((link) => {
    link.click();
    document.querySelector("#packaging-dialog").close();
    link.click();
  });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
