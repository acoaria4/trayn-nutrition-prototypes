# Under Tension — selected direction and retained drafts

11 October 2026. The user chose Under Tension and explicitly requested keeping all three opening studies for external feedback.

## Implemented

The main eight-page showcase now carries the selected black, silver and red material direction. Its central approved pouch, expansive Manrope heading and user-controlled light establish the opening. A pale blend/packaging scene follows, then the four existing flavour concepts, a red material brand statement, product transparency and contact. Product detail, information and 404 pages share the typography and surface system.

The three opening studies remain independent in `prototypes/openings/`; their compositions and interactions are preserved. The combined build places their comparison at `/drafts/` and their direct pages at `/drafts/quiet.html`, `/drafts/tension.html` and `/drafts/flavour.html`. `?v=2` selects Tension in the comparison. The main footer links to the drafts.

## Architecture and capabilities

- Static rendered HTML and Vite multi-page output preserve all eight main routes, source product handles, legacy flavour queries and no-JavaScript links.
- Existing catalogue, flavour/history handling, image fallback, native packaging dialog, mobile navigation and contact links remain in place.
- `under-tension.css` defines the new visual layer; `under-tension.js` provides lighting independently of the optional animation import.
- GSAP/ScrollTrigger supplies bounded entrances and unpinned material transitions. One Lenis instance runs only on wide fine-pointer screens and is disposed on media changes/page exit. Touch scrolling remains native.
- Reduced motion disables decorative movement and smooth scrolling; the direct light control still changes illumination. Pointer response stops on leave, blur and hidden documents.
- Installed skills applied: build-awwwards-quality-sites, editorial-tech, cinematic-gsap-lenis-motion-system, and publish-project-to-github. The previously created prototype surface is retained at the user's request.
- Three.js remains unnecessary for this implementation: supplied two-dimensional packaging is presented honestly as image layers. No fabricated three-dimensional product model is claimed.
- Six original generated campaign images, exact supplied logo/packaging, local fonts and their provenance remain in the repository. WebP delivery derivatives improve transfer size; see ASSETS.md.
- No external runtime image, font, tracking or API service is required.

## Verification performed

- Source syntax checks pass; the new light module also passes `node --check`.
- All 9 Node tests pass, covering truthful catalogue state, route mapping, root/subdirectory rewriting and retained-draft hosting failures.
- Combined production builds pass at `/` and `/traynnutrition3/`.
- Static deployment validation resolves 330 HTML/CSS references, covering the eight main pages and four draft pages, including iframe and packaging download paths.
- CUA browser review used the production preview at the actual repository-style prefix. Main opening inspected at 1440×1000, 768×1024, 390×844 and 320×740. Light slider fits the first phone viewport.
- All eight main routes checked at 320 and 1440 pixels: one H1, no horizontal overflow and no failed loaded images. Legacy product query still resolves to the requested concept.
- Mobile menu opens, Escape closes it, navigation reaches sections. Flavour selection updates the name, image and shareable destination. Product details open at the nested route.
- Belgian Chocolate back-label inspection opens in the native dialog; Escape closes it and restores focus to its opener. Future concepts retain no invented back view.
- The main footer opens `/drafts/`; all picker choices load under the prefix. Tension's keyboard light control and Flavour's selection work. The comparison reduced-motion control sets the selected page's reduced state.
- The browser log included an unattributed MutationObserver error with no source URL while using navigation tooling. No broken site interaction was reproduced. A fully clean automated console audit is not claimed.
- The packaging audit found no publication-blocking issues. Both packages report zero production dependency advisories. The main package retains 27 existing development-only advisories in the Lighthouse dependency tree; existing dependency versions were unchanged.

This turn used CUA for browser verification. The existing full Playwright/axe suites remain available but were not rerun; earlier axe or Lighthouse results must not be attributed to this revision. No fresh Lighthouse score or physical-device performance result is claimed.

## Product truth and SEO

This remains a non-selling concept showcase. Prices, stock, nutrition, final ingredient records and launch dates are not invented. The verified contact routes, concept disclosures, noindex policy, TRAYN-domain canonicals and Organization metadata remain. No checkout, fake submission or Product/Offer/review schema was introduced.

## Publishing

The Pages workflow installs both lockfiles, builds the combined artifact, validates paths, and deploys on the repository's default branch. Configure Settings → Pages → Source as GitHub Actions, then push the source changes.

For the configured remote, the standard address after a successful deployment is `https://acoaria4.github.io/traynnutrition3/`, with the comparison at `drafts/`. The GitHub CLI was not signed in during this work. No push or public deployment is claimed. The live Shopify/source repository remains untouched.
