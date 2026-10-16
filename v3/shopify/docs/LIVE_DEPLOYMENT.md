# Compact layout publication — 16 October 2026

Published theme: `192591069472`, TRAYN V3 — Compact Layout, at https://traynnutrition.com/. The www alias redirects to the primary domain. Both addresses returned HTTP 200 with the new theme in the main role.

The release was based on a fresh pull of live theme `192588677408`, preserving its current config/settings_data.json and template files. Only four reviewed theme files were overlaid: assets/trayn.css, assets/trayn.js, sections/trayn-mindset.liquid and snippets/purchase-art.liquid. The new theme passed strict upload, was checked as an unpublished preview, and was then published with Shopify CLI using its exact ID. The previous live theme `192588677408` is confirmed unpublished and retained for rollback.

This update reduces the desktop chocolate artwork and purchase headings, tightens purchase spacing, removes the GET BUILT rule, halves its extra pinned distance to 320 px desktop / 210 px mobile, and positions the phone poster nearer the header. Hero pacing remains 2,040 px. See COMPACT_LAYOUT.md.

Fresh laptop Chrome and mobile WebKit checks passed both before and after publication: theme identity, decoded responsive artwork, shortened visible typography movement, persistent header, hero sizing/pacing, smooth desktop/native phone scroll, packaging inspector, red reveal, label controls, read-only Shopify cart rendering and the product route. No theme asset failures or page errors were reported. Availability assertions now follow the Shopify-selected variant instead of assuming the product is sold out.

No products, inventory, prices, payment settings, checkout configuration, domains, V1/V2, the parent V3 showcase or Sites versions were changed. No real cart addition, order or payment was attempted. Release file hashes and preserved live configuration hashes are recorded in ignored artifacts/compact-release-manifest.json.

This record supersedes the historical publication records below.

# Seamless shop publication — 16 October 2026

The user approved publishing the reviewed shop composition. Shopify CLI published the existing remote theme `192588677408` (TRAYN V3 — Seamless Shop Review). The previous live theme `192579830048` remains saved in Shopify for rollback. No source upload or change to products, inventory, payment settings, policies, domains, V1/V2, the parent V3 showcase or Sites was made during publication.

Live site: https://traynnutrition.com/ (https://www.traynnutrition.com/ redirects to it). Both domains returned HTTP 200 with theme `192588677408` in the main role.

Fresh public laptop Chrome and mobile WebKit checks passed: current main theme, persistent header, 2,040 px hero pacing, decoded responsive flavour artwork and layout, desktop smooth/native mobile scrolling, visible GET BUILT and red wipe, inspector, Shopify cart rendering, label controls and direct product route. No theme asset failures or page errors were reported. See FLAVOUR_FLOW.md for artwork and pre-publication validation.

Checkout remains the native Shopify cart submission, so store-level payment providers apply without a separate theme integration. The user reports Razorpay is configured in test mode. Available Admin API schemas do not expose its activation or test-mode flag, and no authenticated admin browser session was available to confirm that setting independently. No order or payment was attempted. The featured product remains Sold Out in the public storefront.

This record supersedes the historical publication records below.

# Scroll-performance publication — 16 October 2026

The user approved publishing the tested scroll fix to the main domain. Shopify CLI published the existing reviewed remote theme `192579830048` (TRAYN V3 — Scroll Performance Review). The previous theme `192540770592` remains saved in Shopify. No source files were uploaded during publication and no commerce records, domains or Sites versions were changed.

Current site: https://traynnutrition.com/ (https://www.traynnutrition.com/ redirects to it).

See SCROLL_PERFORMANCE.md for changes, profiling evidence and validation. Both primary and www domains returned HTTP 200 with theme `192579830048` in the main role. Shopify confirms `192540770592` is now unpublished and retained; it is the immediate rollback target for this update, only if the user requests rollback. The publication supersedes the historical deployment record below.

# Shopify publication — 15 October 2026

The user approved publishing the reviewed Shopify theme so it could be accessed from the main domains.

- Published theme: `192540770592`, `TRAYN V3 Slipstream — Store Preview`.
- Primary domain: https://traynnutrition.com/
- Connected alias: https://www.traynnutrition.com/ (redirects to the primary domain).
- Previous theme: `192176914720`, `trayn-nutrition-theme-v0-6-4`, retained in the theme library for rollback.

The existing remote draft was published with Shopify CLI `theme publish`, using its exact theme ID. No new source upload, product edit, inventory edit, checkout configuration, domain change or Sites deployment was performed.

The preview passed read-only laptop Chrome and mobile WebKit checks before publication: theme identity, persistent header, 2,040 px hero scroll distance, GET BUILT sequence, flavour artwork, packaging inspector, red reveal, product information controls, native cart rendering and product route. Shopify analytics requests can be blocked by WebKit access controls; these are recorded separately from theme errors.

After publication, both domains returned HTTP 200 with theme `192540770592` in the main role. The same browser checks passed on the public primary domain in fresh laptop Chrome and mobile WebKit sessions without a preview parameter. No theme asset failures or page errors were reported in the post-publication run. Shopify's theme list confirmed the previous theme is now unpublished and retained.

The product remains Sold Out according to Shopify. No order or payment was attempted. Successful add/change/remove paths were previously tested with isolated responses; payment, shipping and complete order testing remain separate commerce readiness tasks.

Rollback is available by publishing the retained previous theme. Do this only when the user requests a rollback:

```sh
shopify theme publish --store trayn-nutrition.myshopify.com --theme 192176914720
```

Post-publication verification on 16 October 2026 passed in fresh desktop Chrome and mobile WebKit sessions on the primary domain: correct main theme, decoded artwork, desktop smooth wheel distance, native mobile mode, header, hero, GET BUILT, packaging inspector, red reveal, label controls, cart rendering and direct product route. The initial navigation/font screenshot timeouts were resolved by allowing a 30-second network timeout and retrying the affected mobile case. No theme asset failures or page errors were reported in the successful runs.
