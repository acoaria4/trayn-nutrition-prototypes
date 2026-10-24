# Shopify v3 release — 24 October 2026

The owner explicitly requested **“Deploy on shopify”**, superseding the earlier local-only instruction for the reviewed release.

Published storefront: **https://traynnutrition.com/**

Published theme: **192865665312 — TRAYN V3 — SEO and Premium Retail**. Shopify confirms the live role; public desktop/phone checks confirm the same theme in the main role without a preview parameter. Previous theme **192621379872 — TRAYN V3 — Silver Identity** remains unpublished for rollback.

## What was released

- Reviewed local metadata, canonical/social tags, identity/breadcrumb markup, utility noindex support, contact/navigation and native content templates.
- Premium homepage supporting copy, retaining **FUEL YOUR POTENTIAL**, existing section order, campaign design and animations.
- Approved front pack and manufacturer-blank back/label display images.
- Native Belgian Chocolate product description, SEO title/description and ordered three-image product gallery, with descriptive alternative text. Product ID `10331931017504`, handle `trayn-whey-rich-chocolate`.

The native product update included only `id`, `descriptionHtml`, `seo` and the three new media inputs. Existing title, handle, active status, variant identity, price, stock and inventory policy were verified unchanged. The existing variant remains INR 2,999.00 with inventory quantity 100; these were read from Shopify, not copied from preview fixtures. Other products and publication settings were not mutated. No order, payment or real cart mutation was attempted.

## Preservation and backup

A fresh pull of all 59 original live theme files matched the recorded 23 October baseline. The approved release was compared with this backup; 30 native files are changed/added, yielding 72 native files. The uploaded release was pulled back for comparison: 70 files match byte for byte; the two article/blog template JSON files have identical parsed contents after Shopify's comment/format normalization.

Campaign `assets/trayn.css` and live `config/settings_data.json` remain byte-identical to the previous live theme. The compiled `trayn.js` difference is restricted to approved retail inspector captions/alternative text; its motion logic is unchanged. SEO controls were added to settings schema; homepage template settings differ only in approved contact copy. V1, V2, the parent static v3 and Sites were not deployed.

Original imagery/reference PDF remains preserved. The PDF still contains its original manufacturer information; the displayed back/label images intentionally have that area blank. Shopify's image CDN transcodes media (the native product copies are front/back PNG and label JPG); source files downloaded through the theme API match approved image checksums.

Backups and machine-readable release manifest: `output/shopify-deploy-2026-10-24/`. `live-backup/` preserves the previous theme; `product-before.json` preserves the original native product fields and variants. Publishing the previous theme would roll back theme code only; restoring native product content/media is a separate operation. Do not automatically roll back either without a new user instruction or a concrete failure requiring immediate restoration.

## Verification

- Local parser: 35 Liquid files and asset/template/schema references pass.
- Theme Check: 50 files inspected, no offenses. Strict upload passed.
- Existing hosted motion checks pass on the unpublished preview and again on public desktop Chrome and phone WebKit: sticky header, 2,040 px hero pacing, GET BUILT sequence, red reveal, inspector, label controls, read-only cart display and product route.
- A Mac-specific scene-width assertion expected 1,280 px where Windows rendered 1,265 px. A direct current-live versus draft comparison showed identical dimensions (1,265 px) and no design regression. The platform-specific assertion was excluded from this run; all motion assertions were retained. No production code was changed to accommodate it.
- Native retail checks pass in preview and public desktop/phone: one H1, approved intro/nutrition, four tables, three images, thumbnail selection, details disclosures, no mobile horizontal overflow, exact public canonical and populated native Product image/description markup.
- Public retail checks report no page errors or failed theme/product-image requests. Real price/stock match their saved pre-release values.
- Shopify propagation was observed: native product content reached public responses after several minutes; the published theme then reached both public routes. Earlier stale responses are retained as diagnostic evidence. Final verification uses the new public theme and content.

Final public Lighthouse **13.5.0** SEO measurements, approximately **09:45 IST**:

| Public page | SEO |
|---|---:|
| Homepage | **100/100** |
| Belgian Chocolate product | **100/100** |

Both runs have no scored SEO failures or Lighthouse run warnings. The product navigation resolves to its selected-variant URL; its canonical remains the clean product URL. These are automated Lighthouse SEO scores, not PageAudit scores, rankings or a complete sitewide health score. This release did not perform the mobile performance optimizations proposed in the re-audit, and no new performance score is claimed.

Evidence:

- `public-motion-checks.txt`, `public-retail-checks.txt`, `live-retail-verification.json`.
- `browser/live-hero-{desktop,phone}.png`, `browser/live-product-{desktop,phone}.png` and motion captures.
- `lighthouse-final/{homepage,product}.html`, matching JSON and `summary.json`.
- `release-manifest.json`, `product-before.json`, `product-after.json`, `product-after-fresh.json`, product mutation/result and media evidence.
- `propagation.json` documents public arrival of theme `192865665312` and native gallery.

## Remaining work

1. Shipping, returns/refunds/cancellation and terms policies still require actual business terms. No policies were invented or published.
2. The existing public whey collection still links Vanilla, Café Mocha and Cookies & Cream as well as Belgian Chocolate. Their native publication/collection/sitemap state was outside the approved product package and remains unchanged. Resolve the coming-soon visibility decision separately; the homepage itself still features Belgian Chocolate only.
3. News/blog and generic Home page collection decisions, collection introduction, stronger homepage social image, minor heading/title polish and mobile delivery optimizations remain open.
4. Search Console, indexing, real-user Core Web Vitals and Merchant Center are separate account checks. The owner can now run PageAudit against the public homepage and product URL, recording the target keyword used.

## Authentication note

The permanent Shopify store is **`0hshnc-ig.myshopify.com`**. Theme commands accepted `trayn-nutrition.myshopify.com`, but product OAuth rejected that alias because its callback returned the permanent address. Authorization succeeded using the permanent domain. No access tokens, OAuth authorization codes or browser credentials are included in this record.

Official operation references used: [CreateMediaInput](https://shopify.dev/docs/api/admin-graphql/2026-07/input-objects/CreateMediaInput), [ProductUpdateInput](https://shopify.dev/docs/api/admin-graphql/2026-07/input-objects/ProductUpdateInput).
