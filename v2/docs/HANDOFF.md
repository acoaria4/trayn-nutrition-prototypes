# TRAYN After Dark — completed redesign

Historical handoff. The current main site uses Under Tension; see [the 11 October implementation and verification record](UNDER_TENSION.md). The measurements below describe the earlier build, not the current revision.

Delivered 9 October 2026. Local production preview: http://127.0.0.1:4174/

The complete eight-page showcase lives in `G:/Programs/traynnutrition3`. The original `G:/Programs/traynnutrition-website-v2` repository is unchanged. Nothing has been published to the live store.

## 1. Creative concept

**TRAYN After Dark** uses the approved Slipstream pouch as the central subject: a dark studio composition, oversized Barlow Condensed typography, metallic identity and a controlled red plane derived from the package. The rest of the page alternates detailed packaging, quiet specification rows, flavour exploration and editorial brand language. No stock fitness scenes, artificial testimonials or invented proof points were introduced.

The full experience includes the hero, blend story/specifications, packaging inspection, four existing flavour concepts, brand mindset, product transparency and working contact links. Mobile has its own stacked composition and larger reading text.

## 2. Specialist capabilities

| Capability | Actually available and used |
| --- | --- |
| Awwwards design | Installed `build-awwwards-quality-sites` instructions read and applied, with `framed-tech-dark-border-gradient` selected as the compatible visual system. Quality audit used its composition, product focus, static fallback, complete semantic page, responsiveness and restrained-effects criteria. No award or score is claimed. |
| Anthropic frontend design | Exact skill was not installed in searched local roots. Its complete official remote SKILL.md was read and used as design guidance. |
| GSAP / ScrollTrigger / Lenis | Installed GSAP skill read. GSAP 3.15.0 and its ScrollTrigger plugin implemented with matchMedia cleanup. Official documentation consulted. Lenis considered and omitted because native scrolling fits this unpinned experience. |
| Browser automation | Playwright 1.64.0 used with installed Chrome, including screenshots and interaction tests. CUA browser tooling was available but not needed for the automated audit. |
| Accessibility / performance / SEO | Official Playwright/axe, web.dev and Search Central guidance consulted; axe and Lighthouse 12.8.2 actually executed. No dedicated combined auditing skill was claimed. |

Exact design/reference records are in `DESIGN.md`. The industrial-brutalist skill was inspected and rejected as too dense for this product presentation. Interface arrows and plus signs use ordinary text symbols; the design does not claim literal adherence to every optional skill treatment.

## 3. Asset inventory

- Approved supplied logo from `new_website_3/assets/package renders/revised/approved-logo.png`; exact-pixel lossless WebP master, responsive 256-pixel derivative and favicon.
- Later approved root `assets/slipstream-front.webp` and `slipstream-back-concept.webp`; original 1024×1536 files preserved, plus separate 640×960 web derivatives.
- Existing Vanilla Creme, Café Mocha and Cookies & Cream concept renders from `new_website_3/assets`; shown explicitly as future concepts.
- Existing Barlow Condensed 700/800 and Montserrat 400/500 fonts, converted/subset to four WOFF2 files totaling 118.4 KB, with OFL licences retained.
- A 1200×630 social card composed from supplied assets. No new product photography or fabricated pack angles.

Dimensions, byte sizes, provenance and reproducible preparation are in `ASSETS.md` and `public/images/assets-manifest.json`. Original source assets were not altered.

## 4. Important files

- `src/templates.js`: shared page components and eight static page presentations.
- `src/data/products.js`: catalogue, verified/intended facts, image references and safe null commercial fields.
- `src/main.js`: flavour/history controls, mobile menu, gallery/dialog, fallback handling and section navigation.
- `src/motion.js`: scoped GSAP entrance and hero scroll sequence.
- `src/styles.css`: formatted responsive design system, typography, focus states and reduced-motion rules.
- `scripts/render-pages.mjs`, `scripts/prepare_assets.py`, `scripts/performance.mjs`: page generation, reproducible assets and lab audits.
- `vite.config.js`, package files, Playwright configuration and tests: build and verification tooling.
- `public/robots.txt`, `public/_redirects`: preview indexing and static host routing conventions.

Generated HTML is an output of the templates, not the authoring source. Production output is in `dist/`.

## 5. Architecture

The existing static/vanilla approach is retained in a separate recoverable implementation, with Vite 7.3.7 added for bundling. Product content is generated into HTML, so key content is available without JavaScript. JS enhances real links; each future flavour has a distinct static route. The original `/products/trayn-whey-rich-chocolate` handle and local `/product.html` entry remain available.

Runtime dependencies are limited to GSAP; browser auditing/formatting tools are development dependencies. Core JS is 10.21 KB uncompressed / 3.76 KB gzip. The separately loaded home motion chunk is 115.06 KB / 45.59 KB gzip. CSS is 29.13 KB / 6.96 KB gzip.

No fake commerce was added. The original repository’s Shopify cart, native contact form, consent-controlled analytics and deployment configuration remain intact. `COMMERCE.md` identifies the boundaries for adapting that genuine integration later.

## 6. Signature interaction

The pouch starts visible in a finished composition. A short GSAP entrance settles the product and headline; one desktop ScrollTrigger gently changes pouch scale/position and the red light plane as the hero exits. There is no pinning, scroll interception, long intro or continuous offscreen effect.

GSAP matchMedia reverts motion immediately when reduced motion is enabled. Mobile omits scroll-linked motion. No-JS content remains useful, and a failed animation import leaves the static design. A failed entry module restores visible navigation; failed product images show readable fallback text, and failed logos preserve the header’s dimensions.

## 7. Responsive testing

Real installed Chrome inspected at **1440×1000, 768×1024, 390×844 and 320×740**. All eight page variants were checked. Screenshots cover the complete pages; the final mobile headline refinement was rechecked at both narrow sizes. `docs/screenshots/final-desktop-hero.png` and `final-mobile-hero.png` show the final first screens.

Testing covers page/asset loads, internal anchors, active navigation, keyboard menus/dialogs, flavour selection and static URLs, reload/Back/Forward, reduced motion, JavaScript disabled, blocked entry scripts, image failures and horizontal overflow. Actual Chrome BFCache restoration was independently verified. Physical phones and Safari/Firefox were not tested.

## 8. Build and tests

| Command / check | Actual result |
| --- | --- |
| `npm run build` | Pass; eight static pages and production assets emitted |
| `npm run check` | Pass; JavaScript syntax checks |
| `npm test` | 3 catalogue/product-truth tests pass |
| Full production Playwright suite | 63 pass; 5 intentional skips for wide-layout mobile menus and mobile/tablet desktop-only motion |
| Final mobile headline adjustment | 2 relevant home rendering/axe/asset/overflow cases rerun and pass |
| Source formatting | Prettier applied to JS, CSS, scripts and tests |
| Asset preparation | All outputs decode; deterministic rerun and original master integrity checked |
| Original source status | Git remains clean |

`VERIFICATION.md` records baseline issues, environment recovery and defects corrected during review. The full-suite HTML report is in `test-results/report/index.html`; screenshots are retained in `docs/screenshots/`.

## 9. Accessibility

The tested WCAG A/AA axe scans reported zero violations across all page variants and the opened menu/dialog states. Manual/automated keyboard checks verified skip link, Escape, native dialog focus containment/return and disclosure navigation. Text and focus contrast were checked by axe and visual review. Mobile reading copy was increased to 12–14 px after the first Lighthouse run.

Reduced motion was tested both on load and while the actual scroll sequence was running. No-JS and failed-script cases remain navigable. These results are evidence of the tested states, not a complete accessibility certification or screen-reader/device lab audit.

## 10. Performance

Local single-navigation Lighthouse lab results, not field Core Web Vitals:

| Production page / preset | Performance | Accessibility | Best practices | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile home | 95 | 100 | 100 | 2.784 s | 0 | 26.5 ms |
| Desktop home | 100 | 100 | 100 | 0.557 s | 0.00021 | 0 ms |
| Mobile product | 99 | 100 | 100 | 2.111 s | 0 | 0 ms |

The measured mobile homepage LCP remains above 2.5 s under simulated slow-network conditions. This is a documented remaining optimization opportunity, not a claimed field pass. Mobile INP was not measured. Initial mobile scores were 89 home and 94 product. Accurate image sizing and early menu initialization reduced critical image cost and removed the measurable mobile layout shift. Total homepage transfer is about 491 KiB because both hero and detailed crop resolutions load; the product page is about 204 KiB. Final reports and unchanged before-runs are under `docs/performance/`.

## 11. SEO

Every page has a descriptive title, meta description, canonical, social card and crawlable static content. The established product handle is retained. Organization metadata uses source-supported identity only; there is no misleading Product, Offer, review, price or stock schema.

The preview intentionally retains **noindex, follow**. Robots allows crawling to read that directive. No sitemap submits unapproved preview pages. Lighthouse SEO is 69 solely because of intentional noindex; indexing is a commercial launch decision. The live website’s indexing and SEO configuration were not changed.

## 12. Remaining work and limits

The showcase is complete and usable locally. It has not been deployed or connected to a live checkout. Future selling needs approved final packaging, ingredients, nutrition, serving/preparation/storage information, business records, actual merchant variants/prices/inventory and operating policies. Future-flavour launch decisions remain unconfirmed.

Email controls open the visitor’s email app; no email was sent during testing. No server-side waitlist was invented. Production hosting/CDN behavior, field performance and non-Chrome browsers need validation when the real deployment is selected. See the README for running/building and `COMMERCE.md` for the future integration path.
