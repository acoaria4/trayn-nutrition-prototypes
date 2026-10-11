import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "test-results/report", open: "never" }],
  ],
  outputDir: "test-results/browser",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173",
    browserName: "chromium",
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROME_PATH ||
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "laptop", use: { viewport: { width: 1280, height: 720 } } },
    {
      name: "short-mobile",
      use: {
        viewport: { width: 390, height: 600 },
        isMobile: true,
        hasTouch: true,
      },
    },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "compact",
      use: {
        viewport: { width: 320, height: 740 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --port 4173 --strictPort",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
