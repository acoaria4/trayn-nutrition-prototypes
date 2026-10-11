# TRAYN After Dark

A complete, non-selling product showcase using TRAYN’s existing approved identity and packaging concepts. Built separately from `../traynnutrition-website-v2`; the source website and Shopify theme remain unchanged.

## Run locally

Requires Node.js 20.19+ or 22.12+ (verified with Node 24.15.0).

```sh
npm ci
npm run dev
```

The dev server prints its local URL. Production:

```sh
npm run build
npm run preview -- --port 4174
```

`dist/` is the complete static deployment output. Domain-root and repository-subdirectory hosting are supported. Vite preview is a local review server, not a production server.

## GitHub Pages

The site can run on GitHub Pages; it needs no server-side runtime. The included `.github/workflows/pages.yml` installs dependencies, runs source/catalogue/path checks, builds the website and deploys `dist/` when the repository's default branch is pushed. It also supports a manual run from the Actions tab.

1. Create a GitHub repository and push this project's source, `package-lock.json`, `public/` assets and workflow. This local folder has not yet been initialized as a Git repository or connected to a remote.
2. In the repository, open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
3. Run **Deploy website to GitHub Pages** from the Actions tab on the default branch, or push another commit to that branch.
4. Use the deployment URL shown by the workflow. GitHub's Pages metadata automatically supplies the right base path for `https://OWNER.github.io/REPOSITORY/`, an account site, or a configured custom domain.

The workflow generates HTML rather than committing compiled pages or `dist/`. All eight page routes are real static files, so direct navigation and reloads work without an SPA fallback. GitHub Pages serves `404.html` for missing paths; it does not use the optional Netlify-style `_redirects` file. The `/product` convenience alias in that file is not available on Pages; use `/product.html` or the full product route.

To reproduce a repository-path build locally in PowerShell:

```powershell
$env:SITE_BASE_PATH = '/traynnutrition3/'
npm run build
npm run preview -- --port 4175
# Open http://127.0.0.1:4175/traynnutrition3/
```

Set `SITE_BASE_PATH` back to `/` before making a normal root build. For a Bash build, use `SITE_BASE_PATH=/traynnutrition3/ npm run build`. Vite's `--base` option is also supported. Local links, responsive image sources, CSS fonts and enhanced product navigation share the resolved base path.

The concept preview keeps its existing `noindex` and canonical TRAYN-domain metadata. Publishing to Pages does not activate ecommerce or change those content decisions.

Reference: [Vite's GitHub Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub's custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## What belongs in Git

Commit source, scripts, tests, the lockfile, public images/fonts/licences, workflow configuration and authored Markdown documentation. `.gitignore` excludes dependencies, `dist/`, generated HTML, build caches, test screenshots/reports, generated Lighthouse HTML/JSON, local environment secrets, Python caches and editor/OS state. Environment examples remain trackable. Ignoring a path does not delete its local files.

## Verify

```sh
npm run check
npm test
npm run test:browser
```

For deployment-specific checks, first build, then run `npm run test:hosting -- --base=/` (root) or `npm run test:hosting -- --base=/traynnutrition3/` after a matching repository-path build. This launches an isolated local static server and checks real directory routes, 404 responses, assets, history and no-JavaScript links in Chrome.

Browser tests use an installed Chrome browser. Set `PLAYWRIGHT_CHROME_PATH` to your Chrome executable if it differs from the Windows default in `playwright.config.js`. An existing production preview can be tested using `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174` (set the variable with the syntax appropriate to your shell). Otherwise the suite starts its own dev server.

The local environment initially had a Node certificate-chain issue during installation. Using the Windows system trust store (`NODE_USE_SYSTEM_CA=1`) resolved it without disabling TLS verification. This is an environment note, not a required project configuration.

## Authoring

- `src/data/products.js`: intended product facts, concept approval state, image references, null commercial/nutrition fields and route mapping.
- `src/templates.js`: semantic static page components, shared navigation/footer, product gallery, accessible disclosure content and metadata.
- `scripts/render-pages.mjs`: renders all eight HTML pages before dev/build. Edit templates, not generated HTML.
- `src/styles.css`: responsive visual system, tokens, fonts, focus and reduced-motion styles.
- `src/main.js`: navigation, progressive flavour selection, direct-image/modal gallery, history, image fallbacks and active navigation.
- `src/motion.js`: optional GSAP entrance and one unpinned ScrollTrigger sequence; absent from non-home pages’ execution.
- `public/`: self-hosted images, fonts and licences. No remote media or third-party trackers are required at runtime.
- `tests/`: product-truth checks and real Chrome browser verification.
- `docs/`: design/capability audit, provenance, verification, screenshots and performance evidence.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Complete campaign/showcase |
| `/products/trayn-whey-rich-chocolate/` | Preserved product handle; featured Belgian Chocolate concept |
| `/product.html` | Existing local detail URL; legacy `?flavor=` is supported with JS |
| `/concepts/vanilla-creme/` | Static future flavour concept |
| `/concepts/cafe-mocha/` | Static future flavour concept |
| `/concepts/cookies-cream/` | Static future flavour concept |
| `/label-information.html` | Concept status, image provenance and unavailable product facts |
| `/404.html` | Custom missing-page presentation |

Main section anchors are `#blend`, `#flavors`, `#story` and `#contact`. Links are real destinations; JavaScript progressively enhances flavour selection and image inspection. There is no fake cart, checkout, purchase state, waitlist or form submission. Enquiry controls open the user’s email app with the verified source email address.

## Assets

See `docs/ASSETS.md` for exact provenance, dimensions and sizes. The supplied approved logo and later Slipstream artwork take precedence over earlier brand explorations. All packaging is identified as concept imagery; future flavour renders are earlier existing concepts.

To reproduce the optimized files, install Pillow, fontTools and Brotli in Python, then run:

```sh
python scripts/prepare_assets.py --source ../traynnutrition-website-v2
```

This reads original files and writes separate derivatives; it does not alter the source repository.

## Publishing and commerce

The output is deliberately `noindex, follow`, matching the source preview. Robots permits crawling so noindex can be read. No sitemap advertises unapproved concept pages for indexing. Canonicals retain the established TRAYN domain and product handle; Open Graph cards and Organization metadata contain verified identity only. Product/Offer/review structured data is absent.

`public/_redirects` supplies existing-handle and custom-404 rules for hosts supporting that file. Configure equivalent directory-index/404 behavior for another host. Nothing has been published, and the existing Shopify deployment is unchanged.

Before a commercial release, obtain approved label/product records, replace concept media as appropriate, validate merchant policy and contact information, and explicitly review indexing/metadata. The original repository retains its genuine Shopify cart, native contact form, locale-aware endpoints and consent-controlled analytics. Adapt those existing integrations to this presentation when real selling requirements and merchant access are available; do not replace them with simulated services. See `docs/COMMERCE.md`.
