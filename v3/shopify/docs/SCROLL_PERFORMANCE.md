# Scroll performance review — 16 October 2026

Published theme: **TRAYN V3 — Scroll Performance Review**, ID `192579830048` (live since user approval on 16 October 2026).

Preview: https://trayn-nutrition.myshopify.com?preview_theme_id=192579830048

Live site: https://traynnutrition.com/. Previous theme `192540770592` is retained in the theme library. The draft was reviewed before the user explicitly approved publication. No product, inventory, payment or domain setting was changed.

## Findings and changes

The Shopify fork did not carry over the desktop Lenis setup from V2. Wheel input stepped directly into scrubbed animations. The theme now uses the same pinned Lenis version as V2, on wide fine-pointer devices only, with one GSAP clock and ScrollTrigger updates on each scroll step. Interpolation uses `lerp: 0.18` and a wheel multiplier of 1; animation distances and the 2,040 px hero interval are unchanged. Phones, coarse pointers, reduced motion and the theme editor retain native scrolling. Keyboard and anchor input interrupt wheel inertia. Modal content scrolls natively while background interpolation is stopped.

The oversized inline hero SVG incurred first-use GPU stalls in the initial Retina profile. Its exact paths and colors are now an independently cached SVG image inside a transformed HTML layer. The pouch previously had the same SVG clip applied to both wrapper and image; only the outer silhouette clip remains. No new raster art or visual redesign was introduced.

Per-image global refreshes were removed because the theme already reserves image geometry. Header changes and reading-control changes now coalesce into safe deferred ScrollTrigger refreshes. Accessibility state changes in the hero are written when a threshold is crossed, rather than on every scroll frame. The redundant scene ResizeObserver and duplicate font-ready refresh were removed. Browser resize and the measured header still update pin geometry.

A wheel-navigation regression test also exposed the purchase anchor applying the header offset twice; its margin now supplies only the 16 px reading gap, in addition to the document's measured header padding. The current accessibility checker exposed the enabled CTA's existing white-on-red contrast issue; enabled red buttons now use charcoal text. Disabled Sold Out styling is unchanged.

## Evidence and limits

Chrome was profiled at 1440 × 900, 2× device scale and 4× CPU throttling, with two-second sweeps through the hero, GET BUILT, packaging, product details and questions. Profiling uses native programmatic scroll to measure rendering independently of wheel interpolation; wheel behavior has its own real-input browser test.

- Initial live hero sweep: 86 frames, four frame intervals over 33.5 ms; GPU tasks reached approximately 247 ms. No main-thread long tasks were recorded during the sweeps.
- Motion disabled, and separately the hero SVG hidden: approximately 120 frames in the hero sweep with no intervals over 33.5 ms.
- Cached SVG image candidate: 120 frames with no intervals over 33.5 ms; artwork decoding was explicitly checked.
- On later warm runs, both original and candidate produced approximately 120 frames per two-second sweep. The first-use stalls were not persistent after graphics caches warmed. This is not a promise of a particular frame rate on every device.
- A read-only live-page overlay kept Shopify's scripts and page content in place while substituting the candidate theme assets and hero markup. That run also stayed within approximately 16.8 ms frame intervals. Raw traces and reports are under ignored `artifacts/scroll-profile/`.

Eighteen local scenarios passed: desktop, short laptop, tablet, phone, compact sizes, mobile WebKit, real wheel interpolation/reversal, keyboard interruption, anchor navigation, resize, cart/background isolation, inspector scrolling, reduced motion, no JavaScript, accessibility and existing purchase/label interactions. Local parsing covers 25 Liquid files. Native Shopify Theme Check and strict draft upload report no errors or warnings.

Read-only checks on the uploaded Shopify draft passed in laptop Chrome and mobile WebKit: correct unpublished theme identity, decoded slipstream image, desktop wheel distance, native mobile mode, persistent header, hero pacing, GET BUILT, red reveal, inspector, cart rendering, label controls and product route. No theme asset failures or page errors were reported. Shopify's live-theme list still identifies `192540770592`.

The skill's bundled validator could not load its `@shopify/theme-check-common` dependency; native Shopify CLI Theme Check was used. Its initial scan of the large raw trace JSON exhausted Node's heap; `.theme-check.yml` now excludes development folders, including trace artifacts, while retaining all shipped theme files.

## References

- [Shopify event-handler performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/debounce-throttle-event-handlers)
- [GSAP safe refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.refresh()/)
- [Lenis GSAP integration and native touch options](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger)
- [Theme Check ignore configuration](https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration)

Post-publication verification on 16 October 2026 passed in fresh desktop Chrome and mobile WebKit sessions on the primary domain: correct main theme, decoded artwork, desktop smooth wheel distance, native mobile mode, header, hero, GET BUILT, packaging inspector, red reveal, label controls, cart rendering and direct product route. The initial navigation/font screenshot timeouts were resolved by allowing a 30-second network timeout and retrying the affected mobile case. No theme asset failures or page errors were reported in the successful runs.
