# Manufacturer-blank package preview — 23 October 2026

The user's request is to keep manufacturer details blank in the back-package images because the manufacturer can change. This follow-up is local to `v3/shopify`; nothing was uploaded to Shopify, published, or pushed to a deployment branch.

## Final assets

- `assets/belgian-chocolate-wpc-back-manufacturer-blank.webp` — back pouch, 1024 × 1536.
- `assets/belgian-chocolate-wpc-label-manufacturer-blank.webp` — enlarged back label, 2711 × 3600.

The manufacturer heading, name, address and associated manufacturer FSSAI mark/licence are blank. TRAYN's marketer details and separate licence, nutrition, ingredients, directions, artwork and batch/date panel are retained.

The built-in image generation tool supplied the blank fill. Only the bounded manufacturer regions were integrated into the original images, then encoded as lossless WebP. Comparison of decoded pixels confirms **zero changed visible pixels outside the manufacturer regions** and unchanged transparency outside those regions. RGB values beneath fully transparent pixels are ignored because they cannot affect the displayed image.

Original source images and the original source PDF are retained. The existing links labelled “original” still open that unmodified reference PDF, including its original manufacturer details. The updated pouch and enlarged label displayed in the packaging viewer use the new assets. Static V3, V1 and V2 are preserved.

## Design and verification

- No layout, animation timing, motion logic, compiled CSS or theme settings changed in this follow-up.
- The only JavaScript changes are the label image's alternative text and caption, in source and compiled output, to disclose the intentional blank area truthfully.
- Local parser: 34 Liquid files, references and schemas pass.
- Shopify Theme Check: 48 files, no offenses.
- Shopify skill validator: both updated Liquid files pass. Automatic review initially blocked this over a possible external-data concern; source inspection established that this path invokes local Theme Check and the reporting function returns unconditionally. Review approved the retry. No validator/plugin code was changed.
- Full existing suite: 32/32 tests pass, including Chrome and WebKit, mobile and desktop motion, package inspection, reduced motion, cart fixtures and SEO rendering.
- Local review preview: <http://127.0.0.1:4182/>. Checkout is disabled and catalogue data is a fixture, not a live catalogue replica.

Evidence and generated masters are retained under `output/packaging-manufacturer-blank-2026-10-23/`. The image comparison rectangles and counts are in `preservation-check.json`.

## Final image-edit prompts

Built-in tool mode was used, with the respective original local WebP as the edit target. No CLI image model fallback was used.

### Back pouch

Use case: precise-object-edit. Edit target: the supplied back-of-pouch product photograph, 1024 x 1536. Make ONLY one local correction: erase the entire manufacturer block at the bottom centre, from 'Manufactured by:' through GMN HEALTHCARE PVT LTD, its address and its FSSAI logo/licence number (roughly x455–619 y1304–1388). Replace the printing there with the natural unprinted dark black pouch surface, matching the local folds and lighting. Leave this area blank; add no replacement text, label or rectangle. Preserve the adjacent Marketed by TRAYN NUTRITION block and its FSSAI licence on the left exactly; preserve Best Before and batch/date box on the right exactly. Preserve ALL other original typography, nutritional table digits, logos, package silhouette, framing, black/red/silver swirls, lighting and background unchanged. Do not re-render or redesign the whole package, do not reflow any text. Keep the exact 2:3 canvas and placement, 1024 x1536 if possible. This is a manufacturer-only text removal.

### Enlarged label

Use case: precise-object-edit. Edit target: the supplied flat back-label artwork. Make ONLY one local correction: erase the entire manufacturer block at the bottom centre between the Marketed by block and Best Before/batch panel, including 'Manufactured by:', GMN HEALTHCARE PVT LTD, its address and its FSSAI logo/licence number. This is the small block near x1190–1640 y3280–3480 in the original 2711 x3600 image. Fill that area with the same plain black background so it is blank, with no replacement text or rectangle. Preserve the Marketed by TRAYN NUTRITION information and its own FSSAI licence on the left exactly; preserve Best Before and batch/date panel on the right exactly. Preserve ALL remaining text, table numbers, logos, red/silver curves, layout, border, canvas aspect ratio and black background unchanged. Do not retype or redesign the artwork, do not move any element. Manufacturer-only text removal; preserve every other detail.

