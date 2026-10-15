import config from "./playwright.config.js";

export default {
  ...config,
  outputDir: "test-results/webkit",
  reporter: [["list"]],
  use: { ...config.use, browserName: "webkit", launchOptions: {} },
  projects: config.projects.filter((project) => project.use.isMobile),
};
