# Unpublished Shopify preview — 15 October 2026

Historical preview record. The user subsequently approved publishing this theme on 15 October 2026; current live status is recorded in LIVE_DEPLOYMENT.md.

- Theme: **TRAYN V3 Slipstream — Store Preview**
- Theme ID: `192540770592`
- Role: `unpublished`
- Store: `trayn-nutrition.myshopify.com`
- Preview: https://trayn-nutrition.myshopify.com?preview_theme_id=192540770592
- Editor: https://trayn-nutrition.myshopify.com/admin/themes/192540770592/editor
- Existing live theme retained: `192176914720`, `trayn-nutrition-theme-v0-6-4`.

Shopify CLI uploaded the theme and confirmed its unpublished role. The live-theme list was checked after upload and still identifies the existing theme above. No product, inventory, payment, policy or domain settings were changed. The Sites collection was not rebuilt or deployed.

## Validation

- Shopify Theme Check: zero errors and warnings.
- Local Liquid parsing: 25 files, section schema JSON, referenced assets and JSON template sections passed.
- Ten browser scenarios passed using isolated cart responses across desktop 1440 px, laptop 1280 px, tablet 768 px, phone 390 px and compact 320 px, including phone/compact WebKit. They exercise hero pacing/header fit, native inspector with versioned asset URLs, add/update/remove, prevention of duplicate quantity requests, empty cart, stock errors, section-render failures, no-JavaScript forms, keyboard focus restoration, accessibility of the direct product page and horizontal overflow.
- Read-only checks on the actual unpublished Shopify theme passed in laptop Chrome and phone WebKit: role/ID, sticky header, 2,040 px hero distance, back-label image decoding, cart section rendering, label disclosures/value controls and direct product route. No theme asset failures or JavaScript errors were recorded.
- The actual Shopify product renders Sold Out. No live cart addition, checkout completion, order or payment was attempted. Successful add/change/remove paths were tested with isolated responses; end-to-end checkout remains a launch task once product availability and store settings are ready.
- The theme archive in `artifacts/trayn-slipstream-theme.zip` includes only Shopify theme directories. Tests, fixtures, tooling and screenshots are excluded.

## Launch dependencies

The selected Belgian Chocolate catalog item has no photos or description. Its commercial pack size and formulation have not been confirmed against the supplied 500 g WPC printer artwork. The theme does not attach that transcription to the product record; the homepage keeps the artwork's source qualification, and the product URL uses commerce data only. Confirm the match, add approved photography/content, review inventory/overselling, enter delivery/policy details and test payments, shipping, tax calculation and order notifications before any request to publish the theme.

The existing public V3 showcase and all other prototype versions remain independent. Publishing this theme is a separate, explicit launch decision.

## Artwork and motion update — 15 October 2026

The Belgian Chocolate shop gallery now uses an original generated dark-chocolate/cocoa flavour image, with responsive 640/1120 px WebP copies and an image-picker override. It replaces the repeated tilted pouch treatment. The original pouch assets remain in the hero and packaging inspector; no catalog media was changed. Source and the exact prompt are recorded in FLAVOUR_ASSET.md.

GET and BUILT now travel together from opposite sides by up to 280 px on desktop / 150 px on mobile. Their shared interval begins up to 200 px before the poster reaches its centered hold. The hold lasts 640 px desktop / 420 px mobile, keeping the words visible while they lock into position and the rule draws. Desktop uses one large line; phones retain stacked words. The hero remains at 2,040 px. This is a short independent typography hold, not the removed long shared product sequence. The red wipe runs as its introduction travels from 72% to 24% of usable viewport height. Ordinary touch scrolling no longer cancels it; input focus/control taps still settle it immediately.

Seventeen local scenarios cover the original commerce regressions plus the flavour image, shared typography progress, substantial measured travel and visible words at 10/50/85%, plus reverse scrolling, the red wipe halfway through its visible reveal, short laptop/phone viewports, reduced motion, no-JavaScript reading and accessibility. Shopify Theme Check has zero errors/warnings and local Liquid/schema/assets checks pass for 25 files. The bundled skill validator could not load its own @shopify/theme-check-common dependency; the installed Shopify CLI's native Theme Check was used successfully instead.
