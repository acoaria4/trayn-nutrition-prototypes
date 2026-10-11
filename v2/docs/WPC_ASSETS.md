# Belgian Chocolate WPC artwork

The user supplied the front package image on 11 October 2026 and confirmed that the product uses whey protein concentrate (WPC), replacing the previous WPI + WPC concept. The supplied front says **WHEY**, **Belgian Chocolate**, **Net Quantity: 500 g**, and **PACKAGING CONCEPT — NOT FOR SALE**. No new ingredient, nutrition, efficacy, or certification claims have been added to the artwork.

## Files

| Asset | Dimensions | Bytes | Purpose |
| --- | --- | ---: | --- |
| `public/images/source/belgian-chocolate-wpc-supplied.jpeg` | 1024 × 1536 | 267,550 | Byte-identical copy of the user-supplied image; retains its original studio background. |
| `public/images/products/belgian-chocolate-wpc-1024.webp` | 1024 × 1536 | 170,938 | Transparent hero/product cutout. |
| `public/images/products/belgian-chocolate-wpc-640.webp` | 640 × 960 | 85,336 | Smaller responsive cutout. |
| `public/images/social-share-wpc.jpg` | 1024 × 1536 | 267,550 | Byte-identical supplied image for social previews, retaining the original accurate artwork. |

Source SHA-256: `7000a72dbdc058930a74177df0a7c2601199e80c54af4e4eed7947353a6406e1`.

1024 WebP SHA-256: `decdc3daa1a93429a78c5a462c8c6848412ae2ddfd92ee5a247bf9aee133846b`.

640 WebP SHA-256: `e054dec51ecb231f8cf10f944e730924ec378136a52a488ff8269fe34a28fc55`.

## Preparation and QA

The built-in imagegen tool extracted the supplied pouch onto a genuine transparent background. This is a generated background extraction, so the cutout is not pixel-identical to the supplied photograph; the untouched source is retained for comparison. Visual inspection at both delivery resolutions confirmed the logo, large WHEY wordmark, flavour, weight, disclaimer, and red/silver artwork remain readable and consistent with the supplied package. No old WPI + WPC artwork was used.

Sharp performed format conversion and downsampling only after the built-in edit. The 1024 asset retains the generated native resolution, and the 640 asset is downsampled; neither is upscaled. Both WebP files have alpha channels, with zero alpha at the inspected canvas edges/corners. The pouch has near-opaque alpha. The 2:3 canvas and original frontal composition are retained for stable image sizing.

The social image is the original supplied JPEG, preserving all supplied pixels. Its metadata must use 1024 × 1536, rather than the previous social image's landscape dimensions.

## Final built-in imagegen prompt

> Use case: background-extraction. Asset type: transparent product cutout for a dark premium website hero. Input image 1 is the edit target, supplied by the user. Primary request: remove ONLY the grey studio background, tabletop, cast floor shadow and surrounding environment. Return the exact same frontal black foil TRAYN NUTRITION whey pouch, at the exact same angle, centered in a 2:3 portrait canvas. Use a genuinely transparent alpha background. Preserve the visible pouch perimeter, bottom seam and realistic foil texture. Preserve all existing pixels/appearance on the pouch as faithfully as possible. DO NOT redesign or relight the pouch. Preserve the silver logo, TRAYN NUTRITION lettering, huge WHEY lettering, red/silver swoosh artwork, Belgian Chocolate wording, Net Quantity: 500 g, and PACKAGING CONCEPT — NOT FOR SALE exactly as supplied. Do not add WPC or WPI words or any new text. Do not create a different package. Keep the subtle anti-aliased edges clean with no grey halo and no background shadow. Whole pouch fully visible with transparent margin, same framing and scale as original 1024 x 1536.

Input: `WhatsApp Image 2026-10-10 at 18.13.13.jpeg`. Tool option: `transparent_background: true`. Built-in tool mode was used; no API/CLI fallback was used.
