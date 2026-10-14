# Asset provenance and browser derivatives

All package artwork is reused from the existing TRAYN repository. No product imagery was generated or altered, and source originals remain unchanged. Package images are concepts, not verified retail photography or print-ready labels.

## Under Tension campaign update — 11 October 2026

The main site reuses the two original generated foil images from `prototypes/openings/assets/`. Their PNG masters remain there. Main-site delivery uses separate WebP derivatives at widths 960 and 1672; these change encoding/size only. Sharp 0.35.5, WebP quality 88, effort 6 produced the following files:

| File                                              |   Bytes |
| ------------------------------------------------- | ------: |
| `public/images/campaign/tension-hero-960.webp`    |  59,712 |
| `public/images/campaign/tension-hero-1672.webp`   | 136,702 |
| `public/images/campaign/tension-detail-960.webp`  | 128,292 |
| `public/images/campaign/tension-detail-1672.webp` | 308,656 |

All six retained draft campaign images also have full-resolution WebP copies at quality 90/effort 6, ranging from 100,904 to 350,218 bytes. The draft pages use these copies; native PNGs stay in source control but are not required in deployment output. Existing logos and packaging files are unchanged.

The main site now uses the prototype's 53,728-byte Manrope variable WOFF2 with its OFL licence in `public/licenses/Manrope-OFL.txt`. Original Barlow/Montserrat files remain available for historical source compatibility.

## Rebuild

```sh
python scripts/prepare_assets.py --source ../traynnutrition-website-v2
```

Requires Python with Pillow, fontTools and brotli. The source is supplied through the CLI; no absolute machine paths enter runtime assets. Outputs are deterministic for fixed source bytes and library versions. The script refuses to write within the source repository.

## Artwork

The earlier Belgian Chocolate blend front/back come from root `assets/slipstream-front.webp` and `assets/slipstream-back-concept.webp`. The three future flavours come from `new_website_3/assets/`. The approved supplied `new_website_3/assets/package renders/revised/approved-logo.png` supersedes the reconstructed logo kit.

All pouch canvases retain their original 2:3 aspect ratio. The 1024 px exports preserve original WebP bytes; 640 px exports use Lanczos downsampling and WebP quality 87. Existing alpha is preserved; the three future-flavour images retain their opaque source backgrounds. No clipping, reshaping, background removal or package-label retouching is performed.

The logo master is lossless WebP at its original 740 × 440 dimensions and preserves every RGBA pixel. A 256 × 152 lossless WebP derivative retains the complete logo and its proportions, with natural pixel rounding, for responsive header/footer delivery. The favicon contains the complete proportionally scaled logo. The 1200 × 630 social image places the supplied logo and pouch over solid obsidian with product identity and a visible concept disclosure; it adds no product claims.

| Browser path                                        | Dimensions  |   KiB | Alpha |
| --------------------------------------------------- | ----------- | ----: | ----- |
| `/images/products/belgian-chocolate-640.webp`       | 640 × 960   |  79.8 | Yes   |
| `/images/products/belgian-chocolate-1024.webp`      | 1024 × 1536 | 213.9 | Yes   |
| `/images/products/belgian-chocolate-back-640.webp`  | 640 × 960   | 107.2 | Yes   |
| `/images/products/belgian-chocolate-back-1024.webp` | 1024 × 1536 | 261.5 | Yes   |
| `/images/products/vanilla-creme-640.webp`           | 640 × 960   |  34.7 | No    |
| `/images/products/vanilla-creme-1024.webp`          | 1024 × 1536 | 101.8 | No    |
| `/images/products/cafe-mocha-640.webp`              | 640 × 960   |  33.5 | No    |
| `/images/products/cafe-mocha-1024.webp`             | 1024 × 1536 |  93.0 | No    |
| `/images/products/cookies-cream-640.webp`           | 640 × 960   |  41.3 | No    |
| `/images/products/cookies-cream-1024.webp`          | 1024 × 1536 | 128.3 | No    |
| `/images/brand/trayn-logo.webp`                     | 740 × 440   |  40.5 | Yes   |
| `/images/brand/trayn-logo-256.webp`                 | 256 × 152   |  15.5 | Yes   |
| `/images/brand/favicon.png`                         | 128 × 128   |   8.7 | Yes   |
| `/images/social-share.jpg`                          | 1200 × 630  |  92.4 | No    |

## Fonts and licensing

Local Barlow Condensed and Montserrat source fonts are licensed under the SIL Open Font License. Their complete source licence texts are copied to `/licenses/`. WOFF2 exports retain font copyright/licence metadata and Latin, combining accents, punctuation and currency characters present in each source. This includes the café accent and rupee symbol where supported by the original font. Kerning and available OpenType layout features are retained.

| Browser path                  | Family           | Weight |  KiB |
| ----------------------------- | ---------------- | -----: | ---: |
| `/fonts/barlow-700.woff2`     | Barlow Condensed |    700 | 27.2 |
| `/fonts/barlow-800.woff2`     | Barlow Condensed |    800 | 27.1 |
| `/fonts/montserrat-400.woff2` | Montserrat       |    400 | 30.7 |
| `/fonts/montserrat-500.woff2` | Montserrat       |    500 | 30.6 |

Machine-readable dimensions, sizes, relative provenance and SHA-256 checksums are recorded in `/images/assets-manifest.json`. All image files were decoded successfully after export; logo pixel equality, product dimensions/alpha and font weight/glyph availability were checked. These are file checks, not a browser performance score.

## Current WPC back (14 October 2026)

The current back artwork comes only from page 2 of the supplied `Trayn WHEY 500g Pouch.pdf`. The new `belgian-chocolate-wpc-back` assets are distinct from the earlier blend back.

- `belgian-chocolate-wpc-back-640.webp`: 640 × 960 pouch visualisation, 157,284 bytes.
- `belgian-chocolate-wpc-back-1024.webp`: 1024 × 1536 pouch visualisation, 355,876 bytes.
- `belgian-chocolate-wpc-back-label.webp`: lossless 2711 × 3600 rendering of page 2, 1,469,798 bytes.
- `belgian-chocolate-wpc-back-label.pdf`: unchanged page 2 extraction, 2,067,462 bytes.

All four files are under `public/images/products/`. The mockup uses the built-in image-generation tool; the original label views preserve the supplied small print. See [the source record and generation prompt](assets/wpc-back-mockup.md).
