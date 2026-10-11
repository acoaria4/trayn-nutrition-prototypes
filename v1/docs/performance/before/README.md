# Local production-preview Lighthouse measurements

Single navigation runs against the built Vite preview, not the development server. Lighthouse 12.8.2 launches a fresh headless Chrome profile for each case. Mobile uses the default simulated mobile/slow-4G preset; desktop uses the official desktop configuration. Exact emulation, browser, throttling and timestamps are in each JSON report.

These are local lab measurements, not field Core Web Vitals, CrUX or a deployed-store performance claim. Loopback delivery cannot measure production hosting, CDN, TLS or real network conditions. Single-run scores can vary with host load. TBT is a navigation lab metric; it is not INP.

| Page / preset | Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | TBT | Speed index | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mobile-home | 89 | 100 | 96 | 69 | 1.5 s | 3.5 s | 0.091 | 0 ms | 1.5 s | Total size was 432 KiB |
| desktop-home | 100 | 100 | 100 | 69 | 0.4 s | 0.6 s | 0 | 0 ms | 0.4 s | Total size was 298 KiB |
| mobile-product | 94 | 100 | 96 | 69 | 1.2 s | 3.0 s | 0 | 0 ms | 1.2 s | Total size was 359 KiB |

## Diagnostics

### mobile-home

URL: http://127.0.0.1:4174/. Recorded 2026-10-09T09:01:11.642Z.

- First Contentful Paint: 1.5 s (first-contentful-paint).
- Largest Contentful Paint: 3.5 s (largest-contentful-paint).
- Cumulative Layout Shift: 0.091 (cumulative-layout-shift).
- Time to Interactive: 3.5 s (interactive).
- Largest Contentful Paint element: 3,460 ms (largest-contentful-paint-element).
- Eliminate render-blocking resources: Est savings of 560 ms (render-blocking-resources).
- Reduce unused JavaScript: Est savings of 26 KiB (unused-javascript).
- Properly size images: Est savings of 168 KiB (uses-responsive-images).
- Document doesn't use legible font sizes: 32.12% legible text (font-size).
- Page is blocked from indexing (is-crawlable).
- Improve image delivery: Est savings of 226 KiB (image-delivery-insight).
- Network dependency tree (network-dependency-tree-insight).
- Render blocking requests: Est savings of 560 ms (render-blocking-insight).

### desktop-home

URL: http://127.0.0.1:4174/. Recorded 2026-10-09T09:01:19.958Z.

- Properly size images: Est savings of 40 KiB (uses-responsive-images).
- Page is blocked from indexing (is-crawlable).
- Improve image delivery: Est savings of 40 KiB (image-delivery-insight).
- Network dependency tree (network-dependency-tree-insight).
- Render blocking requests (render-blocking-insight).

### mobile-product

URL: http://127.0.0.1:4174/products/trayn-whey-rich-chocolate/. Recorded 2026-10-09T09:01:27.964Z.

- First Contentful Paint: 1.2 s (first-contentful-paint).
- Largest Contentful Paint: 3.0 s (largest-contentful-paint).
- Time to Interactive: 3.0 s (interactive).
- Largest Contentful Paint element: 3,010 ms (largest-contentful-paint-element).
- Eliminate render-blocking resources: Est savings of 410 ms (render-blocking-resources).
- Properly size images: Est savings of 204 KiB (uses-responsive-images).
- Document doesn't use legible font sizes: 14.19% legible text (font-size).
- Page is blocked from indexing (is-crawlable).
- Improve image delivery: Est savings of 238 KiB (image-delivery-insight).
- Network dependency tree (network-dependency-tree-insight).
- Render blocking requests: Est savings of 410 ms (render-blocking-insight).

## Reproduce

```sh
node scripts/performance.mjs --base-url=http://127.0.0.1:4174/ --chrome="/path/to/chrome"
```

Use `--case=mobile-home`, `--case=desktop-home` or `--case=mobile-product` for one case. Keep the production preview stable during measurement. JSON and HTML reports are saved beside this summary.
