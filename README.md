# TRAYN Nutrition prototypes

Three independent website versions and three opening studies are hosted together on Sites, with a version chooser. GitHub Pages retains its separate build workflow.

Public Sites collection: **[Choose a version](https://trayn-nutrition-v2.blondridge1.chatgpt.site/)** — [V1](https://trayn-nutrition-v2.blondridge1.chatgpt.site/v1/), [V2](https://trayn-nutrition-v2.blondridge1.chatgpt.site/v2/), [V3](https://trayn-nutrition-v2.blondridge1.chatgpt.site/v3/), [opening studies](https://trayn-nutrition-v2.blondridge1.chatgpt.site/v2/drafts/). All are public; no visitor sign-in is required. The original hostname is retained for previously shared links.

- [Choose a version](https://acoaria4.github.io/trayn-nutrition-prototypes/)
- [V1 — After Dark](https://acoaria4.github.io/trayn-nutrition-prototypes/v1/), restored from commit `80ce629`.
- [V2 — Under Tension](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/), preserved from commit `9d74a99`.
- **V3 — Slipstream:** the independent graphic motion direction in [`v3/`](v3/README.md). Local preview: `http://127.0.0.1:4175/`.
- [Compare the three opening studies](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/).

The studies remain in `v2/prototypes/openings/`. Each version retains its original README, documentation, dependencies, source, and assets. The recovery branch `codex/before-versioned-layout` preserves the repository before the migration.

To prepare an update for the existing Sites checkout after installing each package's locked dependencies, run `node scripts/build-sites-collection.mjs` and `node scripts/verify-sites-collection.mjs` from the repository root. These commands assemble and check the static snapshot; they do not publish it. Follow [the Sites deployment notes](v2/docs/SITES_DEPLOYMENT.md) for the source and publication workflow. Publish only when requested.

## Build and verify

Run from the repository root using Node.js 24:

```powershell
npm ci --prefix v1
npm ci --prefix v2
npm ci --prefix v3
npm ci --prefix v2/prototypes/openings
npm --prefix v1 run check
npm --prefix v1 test
npm --prefix v2 run check
npm --prefix v2 test
npm --prefix v3 run check
npm --prefix v3 test

$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v1/'
npm --prefix v1 run build

$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v2/'
npm --prefix v2 run build
npm --prefix v2 run test:hosting:static

$env:SITE_BASE_PATH = '/trayn-nutrition-prototypes/v3/'
npm --prefix v3 run build
npm --prefix v3 run test:hosting:static
```

Preview each package with its matching `SITE_BASE_PATH` and `npm --prefix v1 run preview` or `npm --prefix v2 run preview`. The root chooser is authored HTML; there is no root npm package.

`.github/workflows/pages.yml` builds all three packages, retains all three opening studies under `v2/drafts/`, and combines the outputs with the chooser and a root fallback into one Pages artifact. Pushes to `main` deploy through GitHub Actions; no push or deployment is part of this local version split. Generated output and local dependencies are ignored.

The versioned sites preserve their product and concept disclosures. Design and packaging concepts are not for sale.
