# Local production-preview Lighthouse measurements

Single navigation runs against the built Vite preview, not the development server. Lighthouse 12.8.2 launches a fresh headless Chrome profile for each case. Mobile uses the default simulated mobile/slow-4G preset; desktop uses the official desktop configuration. Exact emulation, browser, throttling and timestamps are in each JSON report.

These are local lab measurements, not field Core Web Vitals, CrUX or a deployed-store performance claim. Loopback delivery cannot measure production hosting, CDN, TLS or real network conditions. Single-run scores can vary with host load. TBT is a navigation lab metric; it is not INP.

| Page / preset | Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | TBT | Speed index | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mobile-home | 95 | 100 | 100 | 69 | 1.9 s | 2.8 s | 0 | 30 ms | 1.9 s | Total size was 491 KiB |
| desktop-home | 100 | 100 | 100 | 69 | 0.4 s | 0.6 s | 0 | 0 ms | 0.4 s | Total size was 491 KiB |
| mobile-product | 99 | 100 | 100 | 69 | 1.2 s | 2.1 s | 0 | 0 ms | 1.2 s | Total size was 204 KiB |

## Diagnostics

### mobile-home

URL: http://127.0.0.1:4174/. Recorded 2026-10-09T09:10:03.035Z.

- First Contentful Paint: 1.9 s (first-contentful-paint).
- Largest Contentful Paint: 2.8 s (largest-contentful-paint).
- Max Potential First Input Delay: 100 ms (max-potential-fid).
- Time to Interactive: 2.8 s (interactive).
- Largest Contentful Paint element: 2,780 ms (largest-contentful-paint-element).
- Eliminate render-blocking resources: Est savings of 450 ms (render-blocking-resources).
- Reduce unused JavaScript: Est savings of 26 KiB (unused-javascript).
- Properly size images: Est savings of 166 KiB (uses-responsive-images).
- Page is blocked from indexing (is-crawlable).
- Forced reflow (forced-reflow-insight).
- Improve image delivery: Est savings of 267 KiB (image-delivery-insight).
- Network dependency tree (network-dependency-tree-insight).
- Render blocking requests: Est savings of 450 ms (render-blocking-insight).

### desktop-home

URL: http://127.0.0.1:4174/. Recorded 2026-10-09T09:06:45.967Z.

- Properly size images: Est savings of 184 KiB (uses-responsive-images).
- Page is blocked from indexing (is-crawlable).
- Improve image delivery: Est savings of 186 KiB (image-delivery-insight).
- Network dependency tree (network-dependency-tree-insight).
- Render blocking requests (render-blocking-insight).

### mobile-product

URL: http://127.0.0.1:4174/products/trayn-whey-rich-chocolate/. Recorded 2026-10-09T09:06:53.995Z.

- First Contentful Paint: 1.2 s (first-contentful-paint).
- Largest Contentful Paint: 2.1 s (largest-contentful-paint).
- Time to Interactive: 2.1 s (interactive).
- Eliminate render-blocking resources: Est savings of 420 ms (render-blocking-resources).
- Properly size images: Est savings of 33 KiB (uses-responsive-images).
- Page is blocked from indexing (is-crawlable).
- Improve image delivery: Est savings of 79 KiB (image-delivery-insight).
- Network dependency tree (network-dependency-tree-insight).
- Render blocking requests: Est savings of 420 ms (render-blocking-insight).

## Reproduce

```sh
node scripts/performance.mjs --base-url=http://127.0.0.1:4174/ --chrome="/path/to/chrome"
```

Use `--case=mobile-home`, `--case=desktop-home` or `--case=mobile-product` for one case. Keep the production preview stable during measurement. JSON and HTML reports are saved beside this summary.
