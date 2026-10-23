# TRAYN Nutrition prototypes

V1 and V2 remain preserved as independent website previews. V3 includes the separate static Slipstream showcase and the source for the public Shopify store.

## Current Shopify source

The authoritative storefront theme is **[`v3/shopify/`](v3/shopify/README.md)**, synchronized from published theme **192621379872 — TRAYN V3 — Silver Identity** on 23 October 2026. All 59 native theme files, including editor settings and templates, were downloaded and compared. See the [sync record](v3/shopify/docs/REPO_SYNC_2026_10_23.md) and [SEO audit](v3/shopify/docs/SEO_AUDIT_2026_10_23.md).

`v3/` is a separate static concept showcase; it does not contain the live Shopify catalogue or checkout. Use `v3/shopify/` for future changes to [traynnutrition.com](https://traynnutrition.com/). No `v2/shopify/` folder was found in the available repository history. Do not use the older `traynnutrition-website-v2` project or its `new_website_3` concept as this storefront's baseline.

The sync is on `codex/sync-live-shopify-v3`. V1, V2, the version chooser and deployment workflow were left untouched. Main and public deployments are not updated by this sync branch. Product records, media, availability and policies remain managed in Shopify separately from theme source. Audit fixes have not started.

## Existing preview deployment

Two independent website versions and three opening studies share the existing GitHub Pages deployment.

- [Choose a version](https://acoaria4.github.io/trayn-nutrition-prototypes/)
- [V1 — After Dark](https://acoaria4.github.io/trayn-nutrition-prototypes/v1/), restored from commit `80ce629`.
- [V2 — Under Tension](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/), preserved from commit `9d74a99`.
- [Compare the three opening studies](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/).

The studies remain in `v2/prototypes/openings/`. Each version retains its original README, documentation, dependencies, source, and assets. The recovery branch `codex/before-versioned-layout` preserves the repository before the migration.

## Build and verify

Run from the repository root using Node.js 24:

```powershell
npm ci --prefix v1
npm ci --prefix v2
npm ci --prefix v2/prototypes/openings
npm --prefix v1 run check
npm --prefix v1 test
npm --prefix v2 run check
npm --prefix v2 test

$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v1/'
npm --prefix v1 run build

$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v2/'
npm --prefix v2 run build
npm --prefix v2 run test:hosting:static
```

Preview each package with its matching `SITE_BASE_PATH` and `npm --prefix v1 run preview` or `npm --prefix v2 run preview`. The root chooser is authored HTML; there is no root npm package.

`.github/workflows/pages.yml` builds both packages, retains all three studies under `v2/drafts/`, and combines the outputs with the chooser and a root fallback into one Pages artifact. Pushes to `main` deploy through GitHub Actions. Generated output and local dependencies are ignored.

The versioned sites preserve their product and concept disclosures. Design and packaging concepts are not for sale.
