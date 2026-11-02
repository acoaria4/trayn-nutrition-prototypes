# SEO re-audit — local Shopify v3

Audited 24 October 2026, Asia/Kolkata. Source: `v3/shopify/`, commit `f1a1f72` on `1.2-launchPlan`. Target: local preview at `http://127.0.0.1:4184/`, including `/products/trayn-whey-rich-chocolate`. The Shopify/public website was not changed. No production source, design, animation, image or settings were edited during this re-audit.

## Measured scores

Google Lighthouse **13.5.0**, Chrome **156**, one fresh-profile navigation per page/device. These are local automated lab scores out of 100, not PageAudit scores, Google rankings, or a sitewide SEO health score.

| Page | Device | SEO | Performance | Accessibility | Best practices |
|---|---|---:|---:|---:|---:|
| Homepage | Mobile | **92** | **73** | **100** | **100** |
| Homepage | Desktop | **92** | **99** | **100** | **100** |
| Belgian Chocolate product | Mobile | **92** | **87** | **100** | **100** |
| Belgian Chocolate product | Desktop | **92** | **100** | **100** | **100** |

All four runs completed without runtime errors or Lighthouse run warnings. Results have not been adjusted or normalized to hide preview limitations.

**Why SEO is 92:** nine of the ten weighted SEO checks pass in every run. The sole failing check is `robots-txt`: the local preview routes `/robots.txt` to homepage HTML, which Lighthouse correctly rejects as invalid robots syntax. Its reported 123 syntax errors are lines from that HTML, not 123 separate theme SEO problems. This is a confirmed preview-server limitation, not evidence of a Shopify robots defect. The deployed robots file still needs its own verification. Do not describe the score as 100 or guarantee a future live score.

Passed checks: crawlability directive, title, meta description, HTTP status, descriptive link text, crawlable anchors, image alternatives, hreflang check and canonical check. The hreflang pass does not imply that international targeting is needed or implemented. Structured data is a manual Lighthouse item and is not certified by this numeric SEO score.

## Loading speed

| Page/device | First content | Largest content | Total blocking | Layout shift |
|---|---:|---:|---:|---:|
| Homepage/mobile | 2.7 s | **5.2 s** | 150 ms | 0 |
| Homepage/desktop | 0.3 s | 1.0 s | 0 ms | 0.000053 |
| Product/mobile | 2.4 s | **3.6 s** | 31 ms | 0.000008 |
| Product/desktop | 0.3 s | 0.7 s | 0 ms | 0.012174 |

Mobile uses Lighthouse's default simulated mobile network and 4x CPU slowdown; desktop uses its default desktop configuration. One run is a snapshot, not a median or real-user Core Web Vitals assessment. No field INP measurement was obtained.

The main measured weakness is mobile loading. The homepage's largest-content element is the hero foil image; the product page's is the front pack. Both are already discoverable in initial HTML, eager-loaded and marked high priority. Opportunities include responsive campaign images, CSS delivery, page-specific script delivery and avoiding unnecessary layout recalculation while retaining the current motion.

Lighthouse reports estimated mobile image savings of 254 KiB on home and 2,530 KiB on product, plus unused initial-load JavaScript. These estimates need interpretation: the local renderer ignores Shopify image width transformations and serves full source images even for tiny thumbnails. It also lacks production CDN cache headers and compression, and its font preload URLs differ from CSS URLs. Conversely, it omits live Shopify/app overhead. Live results can differ in either direction. Do not blindly delete animation code labelled unused during an initial-load audit; it may support scrolling and interactions.

## Verified local improvements

- Four representative landing pages — home, product, collection and Contact — have titles, descriptions, canonicals, sharing tags and one H1 each.
- All seven sampled JSON-LD blocks parse. Local Product data contains description and image; native Shopify markup still needs validation after actual product entry.
- All 17 home/product image elements have alternative-text attributes; decorative images intentionally use empty alternatives. All 12 inspected image source variants return image responses successfully.
- No missing homepage fragment targets were found. Product, collection and Contact use ordinary HTML links.
- Confirmed Belgian Chocolate facts, ingredients, milk allergen, nutrition, dry-basis protein qualification, use/storage/warnings and three retail images appear in initial product HTML. Further retail product approval is not needed.
- The hero remains **FUEL YOUR POTENTIAL**. Premium wording introduces no invented laboratory, certification, sourcing or superiority claims.
- Four utility template states render intended noindex directives in renderer checks. Actual native status and sitemap behaviour remain unverified locally.
- Existing regression evidence records **37/37 passing tests**, including motion, responsive layouts, keyboard/gallery and no-JavaScript behaviour. This log was reviewed; the suite was not rerun during this audit. Its pass count is separate from the measured SEO score.

Compared with the 23 October live audit, missing metadata support, sparse product content, placeholder product imagery, contact discovery and internal navigation are addressed in the local work. There is no valid earlier numeric score for a before/after percentage comparison.

## Remaining priorities

1. **Before release: populate native Shopify product fields.** The local preview injects prepared Belgian Chocolate description, images and search fields. A theme upload alone will not populate the native product record. Later authorized release must enter these fields and verify native Product schema, preserving real price and stock. Local price/stock are examples.
2. **Before release: supply buying policies.** Shipping regions/costs/timelines, returns/refunds/cancellations and terms remain business information to confirm. The original live audit found missing policy pages; this re-audit did not re-fetch them. Retail product facts are already confirmed, so this is a policy dependency rather than another product-approval request.
3. **Review mobile speed while preserving motion.** Optimize actual image delivery and initial rendering, then measure on Shopify. Distinguish genuine direct-asset opportunities from missing local CDN behaviour.
4. **Review native catalogue and sitemap exposure.** Future flavours are absent from sampled local presentation. The earlier live crawl found their product URLs exposed through native collections/sitemaps; the single-product preview cannot establish current publication state. Also decide the purpose of the empty News blog and generic Home page collection.
5. **Optional polish:** add a useful collection introduction and dedicated homepage sharing image; inspect the 67-character product title for search display fit; correct the product details H2-to-H4 heading jump. These are not indexing blockers.

The local collection's `₹NaN` price is a missing fixture value, not a demonstrated Shopify pricing defect. The preserved original packaging PDF still contains its original manufacturer details; only the two displayed back/label images were intentionally blanked in earlier work.

## Agent-readiness checks

The new Lighthouse agentic-browsing category is reported as **2/4 applicable checks passed** on each page/device: accessibility tree and layout stability pass; `llms.txt` and `ai-catalog.json` checks fail because the preview serves HTML at those paths. Three WebMCP checks are not applicable. This is neither an AI visibility percentage nor evidence that those optional files are required to rank. No production AI-bot, citation, WebMCP or external authority claim is made. Product answers and tables remain readable in raw HTML.

## PageAudit and deployment verification

[PageAudit](https://pageaudit.com/) asks for a page URL and target keyword. Its public form does not disclose a scoring formula; its results should not be equated with Lighthouse. After separately authorized deployment, test the public homepage and Belgian Chocolate product URL individually. Verify actual descriptions/media, robots/sitemap, redirects/statuses, native schema, policies and catalogue first. Then capture PageAudit and public Lighthouse results against the same deployed version and record the target keyword used.

No sitewide weighted score is assigned because this pass does not measure live indexing, domain authority/backlinks, search traffic, real-user field metrics or all native Shopify data. A local 92/100 Lighthouse SEO result alone does not establish full launch readiness or predict ranking.

## Evidence

Full local artifacts are under `output/seo-reaudit-2026-10-24/`:

- `lighthouse/{homepage,product}-{mobile,desktop}.html` and matching JSON files — original reports.
- `lighthouse/summary.json` — category results, metrics, settings and scored audits.
- `run-lighthouse.mjs` — local measurement runner; sequential isolated profiles.
- `technical/TECHNICAL_REAUDIT.md`, HTML snapshots and response/schema inventories.
- `content/CONTENT-ECOMMERCE-REVIEW.md`, extraction JSON and five HTML snapshots.
- `agent-readiness/REPORT.md`, HTML snapshots and semantic inventory.
- Prior regression evidence: `output/homepage-copy-2026-10-24/all-tests.txt`.

Method: saved AgricIDaniel/claude-seo audit checklists plus direct source/HTML checks and Google Lighthouse. Checklist heuristics are not Google's internal ranking model. [Google Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview/) and [performance scoring guidance](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/) describe the tool and lab-score variability.
