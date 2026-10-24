# Refined header and SEO copy publication — 24 October 2026

Published theme **192866746656 — TRAYN V3 — Refined Header and SEO** at https://traynnutrition.com/ after the owner approved the local preview. The previous theme **192865665312** remains unpublished for rollback. Header/navigation, homepage category wording, metadata defaults and FAQ copy are updated; **FUEL YOUR POTENTIAL**, campaign CSS/JavaScript, animations, label facts, product data and the Belgian-Chocolate-only public catalogue are preserved. All 73 uploaded files match the prepared release; hosted desktop/phone checks pass before and after publication.

See [the complete refinement and deployment record](HEADER_SEO_REFINEMENT_2026_10_24.md). No new PageAudit score is claimed. This supersedes the historical deployment entries below.

# SEO and premium retail publication — 24 October 2026

Published theme **192865665312 — TRAYN V3 — SEO and Premium Retail** at https://traynnutrition.com/. The previous theme **192621379872** is retained unpublished for rollback. The approved Belgian Chocolate native description, search fields and three retail images are deployed; real price/inventory and other products are preserved. Desktop/phone motion, gallery, native Product schema and public rendering checks pass. Final public Lighthouse SEO scores are **100/100** for home and product. Policies and future-flavour catalogue decisions remain pending.

See [the complete release and verification record](SHOPIFY_RELEASE_2026_10_24.md). This supersedes the historical deployment entries below.

# Silver identity publication — 17 October 2026

Published theme: `192621379872`, TRAYN V3 — Silver Identity, at https://traynnutrition.com/. The previous live theme `192617939232`, TRAYN V3 — Phone Motion, is confirmed unpublished and retained for rollback.

The release began with a fresh pull of the live theme. Only `assets/trayn.css`, `assets/trayn.js` and `sections/trayn-mindset.liquid` were replaced. The prior CSS/JS hashes matched the phone-motion release, and the prior section matched the reviewed baseline. The other 56 release files, including live settings, templates and translations, were preserved and checked by hash. Strict theme upload and local Theme Check passed.

The header now shows the original silver logo. GET BUILT includes a low-opacity red logo that briefly appears clear of the typography, with a separate cropped phone placement. The footer remains silver. Hero pacing, the phone scroll fixes, commerce controls and other sections retain their existing behaviour. See SILVER_HEADER.md.

Fresh laptop Chrome and mobile WebKit checks passed on the unpublished preview and on the public primary domain after publication. They verify the silver header image, original footer image, red accent visibility and clearance, theme identity, sticky header, hero pacing, typography motion, packaging inspection, product information controls, read-only cart rendering and the product route. No storefront errors or theme asset failures were reported. These browser checks do not constitute physical-phone performance measurements.

No product, inventory, pricing, payment, checkout or domain settings were changed. V1, V2, the parent V3 showcase and Sites were not deployed. No real cart addition, order or payment was attempted. The release manifest is recorded in ignored artifacts/silver-logo-release-manifest.json.

This record supersedes the historical publication records below.

# Phone motion publication — 17 October 2026

Published theme: `192617939232`, TRAYN V3 — Phone Motion, at https://traynnutrition.com/. The previous live theme `192605356320`, TRAYN V3 — Brand and Cart, is confirmed unpublished and retained for rollback.

The release was prepared from a fresh pull of the current live theme. Its three changed files (`assets/trayn.css`, `assets/trayn.js`, `snippets/purchase-art.liquid`) matched the reviewed baseline before replacement; the other 56 files were preserved. No local fixture, demo, test or documentation files were uploaded. Strict theme upload and local Theme Check passed.

Fresh laptop Chrome and mobile WebKit checks passed on both the unpublished preview and the published primary domain. They verified theme identity, hero pacing, persistent header, phone shop layout, artwork, GET BUILT, packaging inspection, red reveal, product information controls, read-only cart rendering and product route. No storefront errors or theme asset failures were reported. These checks do not establish a physical phone frame rate.

The update retains the animations and the 2,040 px hero distance, uses native sticky positioning for the mobile hero, stabilizes its viewport sizing and portrait height gate, and coordinates the smaller mobile chocolate scene with its heading and purchase controls. Desktop layout and motion remain unchanged. See PHONE_MOTION.md and ignored artifacts/phone-motion-release-manifest.json.

The local preview server on port 4180 was stopped at the user's request. No product, inventory, pricing, payment, checkout, domain, V1/V2, parent V3 showcase or Sites settings were changed. No real cart addition, order or payment was attempted.

This record supersedes the historical publication records below.

# Brand and cart publication — 16 October 2026

Published theme: `192605356320`, TRAYN V3 — Brand and Cart, at https://traynnutrition.com/. The www alias redirects to the primary domain. Both domains returned HTTP 200 with the new theme in the main role and the page title TRAYN Nutrition.

The release began with a fresh pull of live theme `192591069472`. Current editor config and templates were preserved. Ten reviewed theme files were overlaid (layout, header/footer, cart/purchase snippets, new quantity/price snippets and rebuilt CSS/JS); the eleventh file merges only the new English brand/quantity/cart keys into current live translations, preserving Shopify's generated comment header and other keys. Strict upload passed. The prior theme is confirmed unpublished and retained for rollback.

The update includes the flat red header logo, original silver footer logo, TRAYN Nutrition website naming, native quantity steppers, cleaner Shopify-sourced prices and revised empty/filled cart layouts. Business/account store-name settings, products, inventory, prices, payment providers, checkout configuration, domains, V1/V2, the parent V3 showcase and Sites were not changed.

Laptop Chrome and mobile WebKit checks passed on the unpublished theme and on the public main domain after publication. They verify theme identity, title/site name, the red mask asset, untouched footer image, quantity adjustment without cart mutation, actual variant price consistency, empty-cart controls/return focus, product route, hero pacing, sticky header, previous motion sequences, inspector, labels and cart rendering. No theme asset failures or storefront page errors were reported in the successful public runs. Native checkout is enabled; local demo markers and sample code are absent.

The WebKit runtime had been removed from the temporary cache and was restored before mobile verification. One preview run blocked Shopify's event collection endpoint by browser access controls. Its origin was verified in Shopify's own cdn/shopifycloud/storefront/assets/storefront/event_observer_reporter script; that exact tracking failure is recorded separately from storefront errors. Both final public browser runs passed.

Local demo fixtures, disabled-checkout behavior, documentation, test scripts and source assets were not uploaded. No real cart addition, order or payment was attempted. See BRAND_CART.md for implementation and local validation, and ignored artifacts/brand-cart-release-manifest.json for release and preserved-config hashes.

This record supersedes the historical publication records below.

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
