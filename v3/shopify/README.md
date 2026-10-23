# TRAYN Shopify theme — V3 Slipstream

**Verified live baseline — 23 October 2026:** All 59 native theme files in `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/` and `templates/` were downloaded from published theme `192621379872` and synchronized here, including current editor settings. Shopify-generated JSON comments are preserved. See [REPO_SYNC_2026_10_23.md](docs/REPO_SYNC_2026_10_23.md), the [file hash manifest](docs/LIVE_BASELINE_2026_10_23.json) and the [SEO audit](docs/SEO_AUDIT_2026_10_23.md). No audit fixes or public deployment were included. Changes under `scripts/` support reading the downloaded JSON and serving local assets on Windows; they are excluded from uploads.

An independent Shopify Online Store theme under `v3/shopify/`. Current live theme: `192621379872`, TRAYN V3 — Silver Identity, published to `traynnutrition.com` on 17 October 2026. It restores the silver header logo and adds a subtle red GET BUILT accent while retaining the phone scroll improvements, compact layout and commerce controls. The previous live theme remains saved in Shopify; the V3 showcase and Sites collection are unchanged. Shopify renders the storefront with Liquid; existing GSAP sequences are bundled as theme assets. See docs/LIVE_DEPLOYMENT.md for the deployment record.

Published layout update: the shop artwork and desktop headings are smaller, purchase spacing is tighter, and GET BUILT has half its previous pinned distance. See docs/COMPACT_LAYOUT.md.

Published branding/cart update: red header logo, original silver footer logo, TRAYN Nutrition website naming, native quantity steppers, cleaner price formatting and refined empty/filled carts. Review at `http://127.0.0.1:4180/?demo=cart&review=brand-cart#purchase`; this opt-in demo uses sample prices/stock with checkout disabled. See docs/BRAND_CART.md.

## Store and scope

- Store: `trayn-nutrition.myshopify.com`; primary domain `traynnutrition.com`.
- Featured product selected by handle: `trayn-whey-rich-chocolate` (confirmed in the connected store on 15 October 2026).
- Price, product variants, quantity rules and availability are read from Shopify at render time. Nothing creates or updates inventory, products, prices, orders or policies.
- The shop gallery uses Shopify media or a section image override first. The known Belgian Chocolate product falls back to a seamless chocolate-ribbon composition with responsive artwork; unrelated products do not inherit that image. The hero and inspector keep the original pouch artwork. See docs/FLAVOUR_FLOW.md for the current asset files and exact generation prompt.
- GET and BUILT travel together from opposite sides by up to 280 px on desktop and 150 px on mobile. Movement begins before the poster reaches its centered position, followed by a dedicated hold of 320 px desktop / 210 px mobile. The decorative rule and its separate animation beat are removed. The desktop phrase occupies one large line with more side space; phones keep a stacked composition held nearer the header to avoid an empty upper half. Type is capped against viewport height. This replaces the late, short natural-scroll effect; it does not restore the old long shared product pin. The red reading-section wipe runs from 72% to 24% of the usable viewport, using the introduction as its trigger. Touch scrolling on text does not cancel it; control focus and intentional control taps settle it immediately.
- The hero keeps the measured sticky header and 2,040 px scroll distance. Home adds a direct Shop link and purchase panel before GET BUILT. Product URLs show the purchase panel directly without the hero.
- Native product forms work without JavaScript. JavaScript adds cart drawer feedback, quantity changes by line-item key, removal, server-rendered totals, stock errors and a compact mobile add-to-cart bar. Checkout uses the standard Shopify checkout submission.
- The cart is a native modal dialog with focus containment, Escape dismissal and focus restoration. Its 250 ms entry uses transform only; keyboard/reduced-motion entry is immediate. Prices and reading content do not animate.
- Label artwork remains explicitly transcribed from the supplied printer PDF, separate from the commerce record. The direct product page does not inherit the showcase's 500 g WPC specifications. Other products do not inherit this data either.
- No subscriptions, bundles, customer-account template customization or checkout extensions are included. Subscription-only products are blocked rather than submitted without a selling plan.

## Setup and review

```sh
npm ci
npm run build
npm run check
npm run theme:check
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/trayn-playwright-browsers npm test
npm run preview
```

Run these from this directory. Local review is at `http://127.0.0.1:4180/`; it approximates Liquid rendering and explicitly disables live commerce. Its captured catalog snapshot has no photography and is unavailable by default. Browser tests isolate simulated availability and cart responses; fixtures are never uploaded as catalog data. Shopify's renderer and the unpublished theme preview remain the authority for store behaviour.

For a Shopify development preview after signing in:

```sh
npm run theme:dev
```

`build` compiles `scripts/storefront-entry.js` and combines the frozen V3 CSS snapshot with `scripts/commerce.css`. Theme sections remain editable and are not regenerated. `scripts/import-v3.mjs` records the initial import only; do not rerun it over edited Liquid sections.

## Theme editor

Choose the featured product in Theme settings → Featured product, or override it in the home Featured product section. An optional Shop image setting in the featured/product sections supports a separate merchant-provided composition. Home sections can be reordered, removed or restored. Hero copy, mindset copy, contact introduction and delivery notes have editor settings. Prices and stock stay in the Shopify product editor. Decorative scroll sequences are settled in the theme editor so editing does not pin the canvas.

## Upload and package

```sh
npm run package
npm run theme:push -- --theme 'TRAYN V3 Slipstream — Store Preview' --strict --json
```

The push script creates an **unpublished** theme. Do not repeat it to update an existing preview; use its exact returned theme ID instead:

```sh
shopify theme push --store trayn-nutrition.myshopify.com --theme THE_RETURNED_PREVIEW_ID --strict
```

Never use `--live`, `--publish` or `--allow-live` without a new explicit launch request. Theme archives contain only `assets`, `config`, `layout`, `locales`, `sections`, `snippets` and `templates`. Local tooling, fixtures, screenshots, credentials and the prototype collection are excluded.

## Before customer launch

The connected Belgian Chocolate record has no images or description and reported zero total inventory at inspection. Shopify's actual variant availability—not an assumption based on the inventory count—controls the buttons. Add approved product photography and confirmed description/specifications, confirm the printer artwork matches the product being sold, and review stock/overselling policy. Enter confirmed delivery information and store policies. Payments, shipping zones/rates, tax settings and a complete test order still need verification in the store before launch. No test order or charge is created by the local tests.
