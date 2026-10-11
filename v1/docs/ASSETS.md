# Asset provenance and browser derivatives

All package artwork is reused from the existing TRAYN repository. No product imagery was generated or altered, and source originals remain unchanged. Package images are concepts, not verified retail photography or print-ready labels.

## Rebuild

```sh
python scripts/prepare_assets.py --source ../traynnutrition-website-v2
```

Requires Python with Pillow, fontTools and brotli. The source is supplied through the CLI; no absolute machine paths enter runtime assets. Outputs are deterministic for fixed source bytes and library versions. The script refuses to write within the source repository.

## Artwork

The current Belgian Chocolate front/back come from root `assets/slipstream-front.webp` and `assets/slipstream-back-concept.webp`. The three future flavours come from `new_website_3/assets/`. The approved supplied `new_website_3/assets/package renders/revised/approved-logo.png` supersedes the reconstructed logo kit.

All pouch canvases retain their original 2:3 aspect ratio. The 1024 px exports preserve original WebP bytes; 640 px exports use Lanczos downsampling and WebP quality 87. Existing alpha is preserved; the three future-flavour images retain their opaque source backgrounds. No clipping, reshaping, background removal or package-label retouching is performed.

The logo master is lossless WebP at its original 740 × 440 dimensions and preserves every RGBA pixel. A 256 × 152 lossless WebP derivative retains the complete logo and its proportions, with natural pixel rounding, for responsive header/footer delivery. The favicon contains the complete proportionally scaled logo. The 1200 × 630 social image places the supplied logo and pouch over solid obsidian with product identity and a visible concept disclosure; it adds no product claims.

| Browser path | Dimensions | KiB | Alpha |
| --- | --- | ---: | --- |
| `/images/products/belgian-chocolate-640.webp` | 640 × 960 | 79.8 | Yes |
| `/images/products/belgian-chocolate-1024.webp` | 1024 × 1536 | 213.9 | Yes |
| `/images/products/belgian-chocolate-back-640.webp` | 640 × 960 | 107.2 | Yes |
| `/images/products/belgian-chocolate-back-1024.webp` | 1024 × 1536 | 261.5 | Yes |
| `/images/products/vanilla-creme-640.webp` | 640 × 960 | 34.7 | No |
| `/images/products/vanilla-creme-1024.webp` | 1024 × 1536 | 101.8 | No |
| `/images/products/cafe-mocha-640.webp` | 640 × 960 | 33.5 | No |
| `/images/products/cafe-mocha-1024.webp` | 1024 × 1536 | 93.0 | No |
| `/images/products/cookies-cream-640.webp` | 640 × 960 | 41.3 | No |
| `/images/products/cookies-cream-1024.webp` | 1024 × 1536 | 128.3 | No |
| `/images/brand/trayn-logo.webp` | 740 × 440 | 40.5 | Yes |
| `/images/brand/trayn-logo-256.webp` | 256 × 152 | 15.5 | Yes |
| `/images/brand/favicon.png` | 128 × 128 | 8.7 | Yes |
| `/images/social-share.jpg` | 1200 × 630 | 92.4 | No |

## Fonts and licensing

Local Barlow Condensed and Montserrat source fonts are licensed under the SIL Open Font License. Their complete source licence texts are copied to `/licenses/`. WOFF2 exports retain font copyright/licence metadata and Latin, combining accents, punctuation and currency characters present in each source. This includes the café accent and rupee symbol where supported by the original font. Kerning and available OpenType layout features are retained.

| Browser path | Family | Weight | KiB |
| --- | --- | ---: | ---: |
| `/fonts/barlow-700.woff2` | Barlow Condensed | 700 | 27.2 |
| `/fonts/barlow-800.woff2` | Barlow Condensed | 800 | 27.1 |
| `/fonts/montserrat-400.woff2` | Montserrat | 400 | 30.7 |
| `/fonts/montserrat-500.woff2` | Montserrat | 500 | 30.6 |

Machine-readable dimensions, sizes, relative provenance and SHA-256 checksums are recorded in `/images/assets-manifest.json`. All image files were decoded successfully after export; logo pixel equality, product dimensions/alpha and font weight/glyph availability were checked. These are file checks, not a browser performance score.
