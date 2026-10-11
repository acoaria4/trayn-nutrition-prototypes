# TRAYN After Dark — implementation direction

Prepared before implementation, 9 October 2026.

## Source and rollback
The source of truth is `G:/Programs/traynnutrition-website-v2`, at clean Git revision `7e101adc2ce2595820c23c81794ba340c7bcd520`. This separate implementation in the previously empty `traynnutrition3` workspace preserves that entire repository as rollback. No source assets, Shopify files, integrations or routes are overwritten.

## Creative decision
An editorial product campaign after the lights go down: the approved transparent Slipstream pouch occupies the hero's right half; massive tightly set type anchors its left. The curved red package detail informs a restrained diagonal light plane. The pouch remains the single visual focus. Avoid unrelated gym stock, decorative stats, certificates and commercial claims. Quiet technical product rows follow the dramatic first screen, then the four existing flavour concepts, a typographic brand statement and direct contact.

- Obsidian `#090A0C`, charcoal `#151619`, graphite `#222328`, silver `#C5C7CB`, white `#F3F3F1`, signal red `#E51B2B`.
- Locally hosted, OFL-licensed Barlow Condensed 700/800 display; Montserrat 400/500 for body and navigation; system monospace only for package annotations.
- Desktop: left aligned editorial type, asymmetrical 48/52 hero split, large uninterrupted product canvas, fine boundaries. Mobile: text first, large full-width pouch, stacked information and horizontally scrollable flavour controls.
- Section sequence: campaign hero → product identity strip → blend and packaging inspection → flavour exploration → discipline/brand voice → label transparency → contact/footer.
- Static HTML rendered at build time; modular vanilla JS, Vite, GSAP/ScrollTrigger. Native scrolling; Lenis considered unnecessary for a short unpinned narrative. No Three.js: genuine 2D product imagery supplies the depth without a rendering loop.
- Retain `/products/trayn-whey-rich-chocolate`, `/product.html`, `/label-information.html` and useful source anchors. No false cart/checkout or Product/Offer schema.

## Signature interaction specification
1. Initial state: complete readable hero, visible product, CTA and navigation. Never a loading gate.
2. Product: right-hand centre, about 560 px high at a 1440 px viewport, natural aspect ratio, bounded rotation.
3. Trigger: progressive enhancement after JS loads; subsequent native page scroll.
4. Entrance: 900 ms product settle from 12 px lower and 1.5 degrees rotation; heading lines travel 16 px over 650 ms with 70 ms offsets. No content starts invisible.
5. Typography remains readable; foreground headline stays independent of the product layer.
6. Scroll: one hero-only ScrollTrigger gently lifts/scales the pouch and moves its red plane during the hero exit. No pinning or scroll interception.
7. Mobile: no scrub or pointer effect, shortened settle only when motion is allowed.
8. Reduced motion: matchMedia bypasses all timeline and scrub creation; static final states, CSS smooth scroll disabled.
9. No-JS fallback: server-generated headings, images, specs, anchors and flavour links remain usable; packaging links open original images.
10. Failure: explicit image fallback text preserves product identity; motion failure leaves the static page intact. Scoped matchMedia is reverted on pagehide and restored after BFCache navigation.

## Capability verification
| Capability | Actual availability and application |
| --- | --- |
| Awwwards design | Installed `build-awwwards-quality-sites` skill read completely. Apply its semantic page, original composition, truthful asset, static fallback, responsive and verification criteria. Compatible installed `framed-tech-dark-border-gradient` skill read and selected for restrained rails/surfaces. Industrial-brutalist skill inspected but not selected: its telemetry density does not fit a product campaign. |
| Anthropic frontend-design | No exact installed skill found in the local skill directories. Complete official remote SKILL.md read, not installed. Apply compact token plan, subject-derived composition, one focal element, restrained motion and screenshot critique. |
| GSAP/ScrollTrigger/Lenis | Installed GSAP skill read. Official documentation reviewed. Source has a vendored Lenis file but no package manager. Add GSAP only; retain native scrolling. |
| Playwright | CUA browser automation available; Chrome and Edge installed. Add Playwright as a development dependency for controlled viewports, interaction and screenshot checks. |
| Accessibility/performance/SEO | No dedicated combined installed auditing skill loaded. Official Playwright axe guidance, web.dev Vitals and Google Search Central reviewed. Use axe, keyboard checks, responsive checks, bundle sizes and local measurements; distinguish lab evidence from field data. |

## Pre-implementation baseline
Source is HTML/CSS/vanilla JS and an independent native Shopify OS 2.0 theme, with no package.json or conventional app build. Existing safe navigation/contact/consent/cart checks passed 50 assertions. Six new_website_3 store tests pass. Some root tests require missing liquidjs; new_website_3 verify.py reports a stale theme ZIP. Existing theme sync check passes. These are baseline findings, not redesign regressions.

## Product truth
Use latest `docs/SPRINT_2_PRODUCT_FACTS.md`, not stale PRODUCT.md. Belgian Chocolate is the featured current concept; 500 g, concentrate + isolate and contains milk are supported as intended packaging text, not final commercial specifications. Three other flavour assets are future concept explorations. Nutrition, ingredients, prices, stock, endorsements and certifications stay absent. Image provenance: existing supplied/generated package concepts, not claimed product photography. Approved supplied logo supersedes the reconstructed logo kit.

## Reference sources
- https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://github.com/darkroomengineering/lenis
- https://playwright.dev/docs/accessibility-testing
- https://web.dev/articles/vitals
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
