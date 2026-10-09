# Verification record

## Baseline, before redesign

The source repository was clean at `7e101adc2ce2595820c23c81794ba340c7bcd520`. It is a static HTML/CSS/JS site plus native Shopify OS 2.0 theme, with no package.json/build framework.

- Root navigation/contact/consent/cart checks: 50 assertions passed.
- Root Liquid-render tests: missing `liquidjs` prevented execution. This was a source dependency limitation, not a redesign failure.
- Source/theme synchronization: passed.
- Fifteen source JavaScript syntax checks: passed.
- `new_website_3` store tests: six passed.
- `new_website_3/tests/verify.py`: existing stale ZIP failure at `shopify-theme/assets/back-label.svg`; preceding verification stages passed.

No source files were modified. Its complete Git checkout provides rollback for this separately built redesign.

## Environment recovery

The normal sandbox shell could not start (`helper_unknown_error: setup refresh had errors`). Authorized elevated commands provided access. Initial npm installation encountered `UNABLE_TO_VERIFY_LEAF_SIGNATURE`; it was stopped and retried with Node’s Windows system CA support. TLS verification was not disabled. The first build attempt before dependencies finished reported missing Vite; subsequent installed builds passed.

## Review and fixes

Initial screenshot/browser review found and corrected:

- Missing space between hero sentences on mobile.
- A hidden flavour navigation link at tablet width.
- Missing static future-flavour pages when JavaScript is unavailable.
- A generic image fallback making failed logos expand the header.
- Active navigation remaining on the footer at the top, and observers not reconnecting after BFCache restoration.
- Mobile images loading a larger resolution than their actual display required.
- Small secondary reading text and a layout shift from late navigation enhancement.

Some initial browser failures were caused by Vite hot reload during active tests or superseded query-URL assertions. Final verification used a stable production preview on port 4174. Assertions were not removed to conceal implementation defects.

## Final evidence

Full final suite: **63 passed, 5 intentional skips**. Skips are desktop/tablet mobile-menu cases and mobile/tablet desktop-only scroll-motion cases. All eight variants at four viewport sizes passed route, image, console, axe and overflow checks. Screenshots were inspected visually. After the last mobile headline-size adjustment, the two affected mobile/compact homepage cases were rerun and passed.

Additional independent real-Chrome checks verified 76 px mobile / 94 px desktop headers with blocked logos, top-of-page active-state clearing, and a real `pageshow.persisted=true` history restoration with resumed section highlighting.

`npm run build`, `npm run check`, and all three catalogue tests passed. Final runtime source scan found no TODO/FIXME/placeholder copy or absolute workstation file references. Package lockfile records exact dependency versions.

Accessibility is not certified; automated scans do not cover every assistive technology. Browser results come from installed Chrome on Windows with emulated viewport/touch settings, not a physical mobile lab. Lighthouse values are local lab measurements, not deployed-site or field guarantees.

## GitHub Pages hosting follow-up

Production builds were tested at both `/` and `/trayn-preview/` using `npm run test:hosting` and an isolated static server with real directory indexes and HTTP 404 responses. Both passed: eight page routes, thirteen local destinations and 172 browser requests per build. Checks covered responsive images, fonts, legacy flavour queries, client-side selection, reload, Back/Forward, front/back gallery images, the full-size dialog, custom deep-path 404 assets and home links, and mobile links with JavaScript disabled. Images cancelled when a flavour replaces the initial pack were checked separately for successful responses; displayed images were required to finish loading.

The check found a favicon reference that used the wrong extension; it now points to the supplied PNG. Six catalogue/path tests, source syntax checks and formatting checks passed. The final local `dist/` was restored to a root build, and its `.nojekyll` marker was confirmed. The GitHub Actions workflow has been prepared but has not run on GitHub; this folder has no Git repository or remote yet.

Ignore rules were checked against 87 representative paths: all 51 intended exclusions and 36 intended inclusions matched. Source, public assets, licences, the package lockfile, workflow and authored Markdown remain trackable. Generated HTML, dependency/build output, browser/Lighthouse artifacts and local secrets are excluded; no files were deleted.
