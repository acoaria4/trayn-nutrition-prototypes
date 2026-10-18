# Phone motion — published 17 October 2026

Published as theme `192617939232`, TRAYN V3 — Phone Motion, at https://traynnutrition.com/. The local preview was stopped. The previous theme `192605356320` is retained unpublished for rollback. Fresh laptop Chrome and mobile WebKit checks passed before and after publication. The implementation and pre-publication evidence below describe the reviewed change.

Scope: the V3 Shopify theme below 900 px. Desktop layout and choreography remain unchanged. V1, V2, drafts, product records and the live Shopify theme were not modified.

## Changes

- The phone hero uses native CSS sticky positioning. GSAP retains the pouch, delayed lighting, foil and slipstream animations over the same 2,040 px scroll distance.
- The hero's outer geometry uses the large viewport height; its main content fits the small viewport. Browser-bar changes therefore do not continuously resize the hero's scroll container. Bottom links follow the currently visible viewport.
- Portrait phones stay animated when browser chrome reduces the CSS viewport below 520 px. The old height-only gate could rebuild the whole hero as a static layout. Short landscape screens retain the readable static fallback.
- The mobile slipstream layer uses its artwork aspect ratio instead of an oversized empty container. Transform hints are scoped to the active hero sequence. Desktop layer sizing is unchanged.
- The mobile shop section places its title before a smaller chocolate composition, then price and purchase controls. Artwork height also responds to short phone screens.
- The shop artwork makes a reversible lateral entrance with a small rotation and pullback. Heading lines move horizontally with it. Purchase controls stay still, and keyboard/touch interaction settles the decorative entrance immediately.
- Reduced motion and no-JavaScript content remain readable.

## Verification

- The 24-test browser suite passed in Chrome and WebKit across desktop, laptop, tablet and compact phone layouts. Final focused phone checks also passed after the viewport-gate correction.
- The focused regression checks preserve the 2,040 px interval, delayed light, moving pouch/background, reverse scrolling and a gap-free hero/shop boundary. They also cover touch emulation, keyboard access, rotation and distinct small/large viewport sizes in Chrome.
- Local Liquid/schema checks passed. Shopify CLI Theme Check inspected 39 files with no offenses. Automatic approval review blocked the separate external validator because it may upload theme source; local validation was used instead.
- Candidate assets were substituted only inside private automated browser sessions against the real Shopify page structure. Chrome and WebKit confirmed native sticking, no horizontal overflow and visible purchase controls. Nothing was uploaded.
- Desktop hero comparison had no pixel differences above two channel levels; the shop comparison was identical. The remaining hero difference was minor rendering variation.
- A repeat 390 × 844, 3× DPR Chrome profile with 4× CPU throttling stayed near 16.7 ms per frame, with no frame intervals above 33.5 ms across hero, handoff and shop. The baseline was also smooth in this environment. The initial candidate trace had one isolated GPU scheduling stall; both reports are retained under ignored `artifacts/phone-motion/`.
- These measurements do not establish a physical iPhone/Android frame rate or a universal speed improvement. The browser-bar layout switch is reproduced and covered; actual-device feel still needs review.

Historical local preview: `http://127.0.0.1:4180/?review=phone-motion` (stopped). The preview used sample commerce data and could not place real orders.

The approved release changed `assets/trayn.css`, `assets/trayn.js` and `snippets/purchase-art.liquid` on top of a fresh live-theme copy. Live settings, templates, locales and all other files were preserved.
