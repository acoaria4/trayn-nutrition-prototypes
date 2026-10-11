# Final local lab results and comparison

Measured 9 October 2026 at approximately 14:36 IST, with the mobile homepage refreshed at 14:40 IST after the final mobile-only headline fit adjustment, against the frozen production preview at `http://127.0.0.1:4174/`. Lighthouse 12.8.2 ran in headless Chrome 154 with a fresh browser profile for each case. The same three presets were used before and after the targeted changes. There were no Lighthouse run warnings.

| Final result | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home, mobile | 95 | 100 | 100 | 69 | 2.784 s | 0 | 26.5 ms | 491 KiB |
| Home, desktop | 100 | 100 | 100 | 69 | 0.557 s | 0.0002100 | 0 ms | 491 KiB |
| Product, mobile | 99 | 100 | 100 | 69 | 2.111 s | 0 | 0 ms | 204 KiB |

Mobile emulation: 412 × 823, DPR 1.75, simulated slow 4G with 150 ms RTT, 1,638.4 Kbps throughput and 4× CPU slowdown. Desktop uses Lighthouse's official desktop preset at 1350 × 940, DPR 1. JSON reports preserve exact device, throttling, browser and UTC timestamp data.

## Changes observed in the same lab setup

| Measurement | Before | Final | Difference |
| --- | ---: | ---: | ---: |
| Mobile home performance | 89 | 95 | +6 points |
| Mobile home LCP | 3.460 s | 2.784 s | −0.676 s |
| Mobile home CLS | 0.0911431 | 0 | −0.0911431 |
| Mobile home Best Practices | 96 | 100 | +4 points |
| Mobile product performance | 94 | 99 | +5 points |
| Mobile product LCP | 3.009 s | 2.111 s | −0.898 s |
| Mobile product Best Practices | 96 | 100 | +4 points |
| Desktop home performance | 100 | 100 | Unchanged |
| Desktop home LCP | 0.560 s | 0.557 s | Essentially unchanged |

- **Critical image selection is corrected.** The final mobile home LCP image uses the existing 640 px pouch at 81,698 bytes instead of the 218,986-byte 1024 px source. The header uses the complete 256 px logo at 15,858 bytes instead of the 41,476-byte master.
- **Mobile reading size passes the audit.** Text meeting Lighthouse's 12 px legibility threshold increased from 32.12% to 92.66% on the homepage and from 14.19% to 97.88% on the product page. No weighted Best Practices failures remain. Accessibility also scores 100; these automated scores are not a full accessibility certification.
- **Initial homepage movement is effectively removed in this run.** Mobile CLS fell from 0.09114 to 0 after the early enhancement class and layout changes. The report supports the observed reduction; it does not isolate each change's individual causal effect.
- **Transfer did not fall on every page.** Mobile product transfer fell from 367,233 to 208,654 bytes. Homepage transfer increased from 441,991 to 502,737 bytes on mobile and from 304,701 to 502,723 bytes on desktop: the final navigation loads both the critical 640 px pouch and a lower-priority 1024 px image used in the larger product-detail crop. Initial rendering improved despite that total-transfer increase. Do not describe the whole homepage as downloading fewer bytes.

## Remaining interpretation

The mobile homepage LCP remains 2.784 seconds in simulated slow-4G conditions. Lighthouse still identifies lower-page image sizing and approximately 26 KiB of motion JavaScript unused during initial navigation as possible delivery opportunities. The final mobile homepage TBT is 26.5 ms (the HTML report rounds this to 30 ms), compared with 0 ms in its initial run. Desktop home and mobile product TBT remain 0 ms. Final mobile-home FCP is 1.871 seconds. These small single-run timing differences should not be interpreted as isolated effects of the headline change.

The only weighted SEO failure is the intentional `noindex, follow` directive. Keep it on the unpublished concept; removing it solely to raise the score would be inappropriate. No weighted accessibility or best-practices failures remain in the final three reports.

These are single-run **local lab measurements**, not field Core Web Vitals, CrUX, INP or deployed-store performance. Loopback delivery does not measure production hosting, CDN, TLS, real networks or visitor devices. Scores and timings can vary with host load. TBT is a navigation metric, not INP.

## Evidence and reproduction

- Final reports: [mobile home](mobile-home.html), [desktop home](desktop-home.html), [mobile product](mobile-product.html), with matching `.json` source results and compact `*-summary.json` files.
- Initial reports and first interpretation are preserved unchanged under [before/](before/README.md).
- The final mobile-home run served `main-DFoPeYtG.css`, `main-C2WPWI1f.js` and `motion-EoBzWxY4.js`. Desktop/product reports are retained from the immediately preceding build (`main-BOiiIaUj.css`, `main-BXNLPPyv.js`); the last change affected only the homepage headline at mobile widths. The initial build served `main-BOc-VmXe.css`, `main-eToF-OLj.js` and the same motion bundle. No source or build output was changed during any measurement run.
- Reproduce with `node scripts/performance.mjs --base-url=http://127.0.0.1:4174/ --chrome="/path/to/chrome"`. Use the same stable production preview and presets.
