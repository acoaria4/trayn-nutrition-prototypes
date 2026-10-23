# Compact shop and GET BUILT review — 16 October 2026

Published as Shopify theme 192591069472 on 16 October 2026. The prior theme 192588677408 is retained unchanged for rollback. Current live editor settings were preserved by pulling that theme before applying the four reviewed theme files. V1, V2, the parent V3 showcase, Sites, commerce records and payment settings are unchanged.

Live: https://traynnutrition.com/. Local review: http://127.0.0.1:4180/?review=compact-layout#purchase and #mindset.

## Layout

The same chocolate artwork renders at 84% viewport width on desktop, with matching image sizes metadata and the existing feathered edges. The desktop purchase heading is about 12% smaller. Eyebrow, heading, price, status and link spacing are tighter. Windows at most 760 px tall use 40 px vertical padding so the purchase information fits more comfortably below the persistent header. Content is never clipped into a fixed viewport height. Phones retain their own 175% artwork crop, readable heading size and natural content height.

Desktop GET BUILT type is 10% smaller with more room at the sides. Phone type retains its existing scale; its pin offset is capped at 64 px below the header to avoid the large empty upper half of the screen. Supporting copy follows as the words settle.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| 640 px desktop / 420 px phone pinned hold | 320 px / 210 px (`scripts/motion/chapter-motion.js`) | Halves the added scrolling while keeping the earlier approach movement |
| Red rule draws after the words approach their resting position | Rule markup and tween removed (`sections/trayn-mindset.liquid`) | Removes a decorative beat and the remaining idle end of the timeline |
| Both words reach rest at 85% of the timeline | Both move linearly across the full scroll interval | Keeps the original opposing travel up to 280 px / 150 px without a pause before release |
| Phone poster centered vertically in the full usable viewport | Phone offset capped below the measured header | Makes the poster and supporting copy readable together |

Missed simplifications: the rule and its additional animation beat are removed. Interruptibility and timing: this rare marketing sequence uses the existing GSAP setup and transform only, scrubbed directly and reversibly to scroll position with ease none. Accessibility: reduced motion, motion=off, no-JavaScript and the theme editor keep the static readable composition. Hero scroll remains 2,040 px; no wheel speed or interpolation settings changed. Packaging and the other section motion sequences are unchanged.

Decision: Approve. The settled composition and three intermediate motion positions were checked visually at desktop, short-laptop and phone sizes.

## Validation

- Build and local schema/reference checks pass (25 Liquid files).
- Native Shopify Theme Check: zero errors or warnings. The bundled skill validator remains unavailable because its theme-check-common dependency is missing; native CLI validation was used.
- Full local browser suite: 18/18 pass, including Chrome desktop/laptop/tablet/phones, WebKit phones, cart interactions/errors, keyboard and modal isolation, hero sizing/pacing, no JavaScript, reduced motion and accessibility.
- After the final phone pin-position adjustment, all six targeted artwork/motion scenarios pass again, including short phone and compact WebKit. These checks verify the shortened hold, early entry, substantial opposing word travel, complete settlement, reverse scrolling, visible text, red reveal and no horizontal overflow.
- Final desktop, 1280 × 650 laptop and 390 × 844 WebKit phone screenshots were visually inspected. Captures are in ignored artifacts/compact-shop-*.png and artifacts/compact-mindset-*.png.

No real cart additions, orders or payments were attempted. The local preview uses the existing isolated catalog fixture and disables live commerce; its Sold Out state and price are not a refreshed store inventory record.

The uploaded theme passed strict validation and read-only laptop Chrome/mobile WebKit checks before publication. The same checks passed on the public primary domain afterward; both primary and www domains serve theme 192591069472 in the main role.
