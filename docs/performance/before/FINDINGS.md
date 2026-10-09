# Performance interpretation — first production-preview run

Measured 9 October 2026 against `http://127.0.0.1:4174/`, with Lighthouse 12.8.2 and headless Chrome 154. Each page used a fresh browser profile. The full machine-readable settings and UTC capture timestamps are in the JSON reports. There were no Lighthouse run warnings.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home, mobile | 89 | 100 | 96 | 69 | 3.46 s | 0.09114 | 0 ms |
| Home, desktop | 100 | 100 | 100 | 69 | 0.56 s | 0.00021 | 0 ms |
| Product, mobile | 94 | 100 | 96 | 69 | 3.01 s | 0 | 0 ms |

Mobile emulation: 412 × 823, DPR 1.75, simulated slow 4G with 150 ms RTT, 1,638.4 Kbps throughput and 4× CPU slowdown. Desktop uses Lighthouse's official desktop preset at 1350 × 940, DPR 1. Exact settings are preserved in each report.

## Material findings

1. **Mobile product image selection.** Both mobile pages request the 218,986-byte 1024 px pouch. Their visible image widths are approximately 299 px (home) and 280 px (product). The declared `90vw` slot at this viewport/DPR slightly exceeds the 640 px candidate. Matching `sizes` to the actual slots should allow the existing 81,698-byte 640 px asset to serve these cases. This is a measurable transfer opportunity, not a guaranteed score improvement. Higher-density screens may still appropriately select the larger image.
2. **Mobile reading size.** The sole weighted Best Practices failure is `font-size`: only 32.12% of homepage text and 14.19% of product-page text meet that audit's 12 px threshold. Product FAQ paragraphs are 11 px; homepage disclosure and footer copy are frequently 8–11 px. Increase readable body/disclosure sizes before treating the design as finished. A Lighthouse Accessibility score of 100 does not invalidate this finding or constitute a full accessibility audit.
3. **Hero layout movement.** The mobile homepage's main shift is its hero section (0.09111 of the 0.09114 total). A very small additional shift is associated with font loading. The trace identifies the moved region but does not prove one exact cause for the large shift; investigate font metrics and responsive hero sizing. Desktop movement is negligible and the product run has none.
4. **Smaller delivery opportunities.** The 41,476-byte, 740 px logo is displayed at about 85 px in the mobile header. A smaller proportional derivative would reduce its transfer. Lighthouse also estimates 26 KiB of unused motion JavaScript on initial navigation, though TBT is 0 ms in all runs. The stylesheet is about 7 KiB transferred, so image selection and reading size are higher-priority changes than restructuring CSS solely for the render-blocking diagnostic.

## Expected and bounded results

- The only weighted SEO failure is the intentional `noindex, follow` directive. Keep it on the unpublished concept; changing it merely to raise the score would be inappropriate.
- These are single-run local lab measurements. They do not measure production CDN/TLS/hosting, real visitor devices, INP or field Core Web Vitals. Repeat after material changes using the same presets; do not present the results as deployed-store measurements.
- This first measured build served `main-BOc-VmXe.css`, `main-eToF-OLj.js` and `motion-EoBzWxY4.js`. Later builds require fresh results. No site source or build output was edited while collecting this evidence.

The complete reports, opportunity details and audit nodes are linked from the sibling `README.md` and the three `.html`/`.json` report pairs. The reproducible runner is `scripts/performance.mjs`.
