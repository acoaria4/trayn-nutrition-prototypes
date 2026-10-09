import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import desktopConfig from "lighthouse/core/config/lr-desktop-config.js";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const argumentsByName = Object.fromEntries(
  process.argv.slice(2).map((value) => {
    const [name, ...rest] = value.replace(/^--/, "").split("=");
    return [name, rest.join("=")];
  }),
);
const baseUrl = argumentsByName["base-url"] || "http://127.0.0.1:4174/";
const output = resolve("docs/performance");
const cases = [
  { id: "mobile-home", path: "/", preset: "mobile" },
  { id: "desktop-home", path: "/", preset: "desktop" },
  {
    id: "mobile-product",
    path: "/products/trayn-whey-rich-chocolate/",
    preset: "mobile",
  },
].filter((test) => !argumentsByName.case || argumentsByName.case === test.id);
if (!cases.length)
  throw new Error(
    "Unknown --case. Use mobile-home, desktop-home or mobile-product.",
  );
await mkdir(output, { recursive: true });

const summaries = [];
const metricIds = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "cumulative-layout-shift",
  "total-byte-weight",
  "mainthread-work-breakdown",
];
function summarize(lhr, test) {
  const failed = Object.values(lhr.audits).filter(
    (audit) => typeof audit.score === "number" && audit.score < 1,
  );
  return {
    id: test.id,
    url: lhr.finalDisplayedUrl,
    fetchedAt: lhr.fetchTime,
    lighthouseVersion: lhr.lighthouseVersion,
    browser: lhr.environment.hostUserAgent,
    settings: {
      formFactor: lhr.configSettings.formFactor,
      throttlingMethod: lhr.configSettings.throttlingMethod,
      throttling: lhr.configSettings.throttling,
      screenEmulation: lhr.configSettings.screenEmulation,
    },
    scores: Object.fromEntries(
      Object.entries(lhr.categories).map(([id, category]) => [
        id,
        Math.round(category.score * 100),
      ]),
    ),
    metrics: Object.fromEntries(
      metricIds.map((id) => [
        id,
        {
          value: lhr.audits[id]?.numericValue,
          unit: lhr.audits[id]?.numericUnit,
          display: lhr.audits[id]?.displayValue,
        },
      ]),
    ),
    warnings: lhr.runWarnings,
    failedAudits: failed.map((audit) => ({
      id: audit.id,
      title: audit.title,
      score: audit.score,
      display: audit.displayValue,
      savingsMs: audit.details?.overallSavingsMs,
      savingsBytes: audit.details?.overallSavingsBytes,
    })),
  };
}

for (const test of cases) {
  console.log(`Starting ${test.id}: ${new URL(test.path, baseUrl)}`);
  const chrome = await launch({
    chromePath: argumentsByName.chrome || process.env.CHROME_PATH,
    chromeFlags: [
      "--headless=new",
      "--no-first-run",
      "--no-default-browser-check",
    ],
    logLevel: "silent",
    handleSIGINT: false,
  });
  try {
    const result = await lighthouse(
      new URL(test.path, baseUrl).href,
      {
        port: chrome.port,
        logLevel: "error",
        output: ["json", "html"],
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
      test.preset === "desktop" ? desktopConfig : undefined,
    );
    if (!result?.lhr) throw new Error(`No Lighthouse result for ${test.id}`);
    await writeFile(
      resolve(output, `${test.id}.json`),
      JSON.stringify(result.lhr, null, 2),
    );
    const html = Array.isArray(result.report)
      ? result.report[1]
      : result.report;
    await writeFile(resolve(output, `${test.id}.html`), html);
    if (result.lhr.runtimeError)
      throw new Error(JSON.stringify(result.lhr.runtimeError));
    const summary = summarize(result.lhr, test);
    summaries.push(summary);
    await writeFile(
      resolve(output, `${test.id}-summary.json`),
      JSON.stringify(summary, null, 2) + "\n",
    );
    console.log(
      JSON.stringify({
        id: test.id,
        scores: summary.scores,
        metrics: summary.metrics,
        warnings: summary.warnings,
      }),
    );
  } finally {
    try {
      await chrome.kill();
    } catch (error) {
      console.warn(`Chrome cleanup warning after ${test.id}: ${error.message}`);
    }
  }
}

// Regenerate the compact summary from available results, including partial reruns.
const available = [];
for (const id of ["mobile-home", "desktop-home", "mobile-product"]) {
  try {
    available.push(
      JSON.parse(await readFile(resolve(output, `${id}-summary.json`), "utf8")),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
await writeFile(
  resolve(output, "summary.json"),
  JSON.stringify(available, null, 2) + "\n",
);
const lines = [
  "# Local production-preview Lighthouse measurements",
  "",
  "Single navigation runs against the built Vite preview, not the development server. Lighthouse 12.8.2 launches a fresh headless Chrome profile for each case. Mobile uses the default simulated mobile/slow-4G preset; desktop uses the official desktop configuration. Exact emulation, browser, throttling and timestamps are in each JSON report.",
  "",
  "These are local lab measurements, not field Core Web Vitals, CrUX or a deployed-store performance claim. Loopback delivery cannot measure production hosting, CDN, TLS or real network conditions. Single-run scores can vary with host load. TBT is a navigation lab metric; it is not INP.",
  "",
  "| Page / preset | Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | TBT | Speed index | Transfer |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
];
for (const item of available) {
  const m = item.metrics;
  lines.push(
    `| ${item.id} | ${item.scores.performance} | ${item.scores.accessibility} | ${item.scores["best-practices"]} | ${item.scores.seo} | ${m["first-contentful-paint"].display} | ${m["largest-contentful-paint"].display} | ${m["cumulative-layout-shift"].display} | ${m["total-blocking-time"].display} | ${m["speed-index"].display} | ${m["total-byte-weight"].display} |`,
  );
}
lines.push("", "## Diagnostics", "");
for (const item of available) {
  lines.push(
    `### ${item.id}`,
    "",
    `URL: ${item.url}. Recorded ${item.fetchedAt}.`,
    "",
  );
  for (const audit of item.failedAudits) {
    lines.push(
      `- ${audit.title}${audit.display ? `: ${audit.display}` : ""} (${audit.id}).`,
    );
  }
  if (!item.failedAudits.length) lines.push("- No scored audit failures.");
  for (const warning of item.warnings)
    lines.push(`- Lighthouse warning: ${warning}`);
  lines.push("");
}
lines.push(
  "## Reproduce",
  "",
  "```sh",
  'node scripts/performance.mjs --base-url=http://127.0.0.1:4174/ --chrome="/path/to/chrome"',
  "```",
  "",
  "Use `--case=mobile-home`, `--case=desktop-home` or `--case=mobile-product` for one case. Keep the production preview stable during measurement. JSON and HTML reports are saved beside this summary.",
  "",
);
await writeFile(resolve(output, "README.md"), lines.join("\n"));
console.log(
  `Saved ${summaries.length} completed navigation runs under docs/performance/.`,
);
