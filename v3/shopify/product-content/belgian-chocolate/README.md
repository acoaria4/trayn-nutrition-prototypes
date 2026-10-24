# Belgian Chocolate — local retail review, 24 October 2026

This folder prepares the current Belgian Chocolate product for review. It does not update Shopify.

## Prepared content

- `description.html`: product introduction, exact original nutrition/amino-acid tables, ingredients, allergens, usage, storage and warnings. The confirmed label's **protein (dry basis)** measurement remains explicit.
- `product.json`: exact existing product handle/title, proposed search metadata and the ordered three-image gallery with alternative text and SHA-256 checksums. It is a review manifest, not an executable Admin API payload or an automatic import.
- `front-retail-master.webp`: lossless front master. Only the obsolete “PACKAGING CONCEPT — NOT FOR SALE” line was removed, following the owner's confirmation that the existing information/images are retail material.

The description uses `<!-- TRAYN product details -->` to separate the short buying summary from detailed information. The theme displays the summary beside the purchase controls and the detailed sections below them. Keep this marker when eventually entering the prepared native product description.

## Gallery files

1. `../../assets/belgian-chocolate-wpc-front-retail.webp` — web-optimized front, 1024 × 1536. 152,842 bytes versus the original's 170,938 bytes.
2. `../../assets/belgian-chocolate-wpc-back-manufacturer-blank.webp` — back pouch, 1024 × 1536.
3. `../../assets/belgian-chocolate-wpc-label-manufacturer-blank.webp` — readable back label, 2711 × 3600.

The manufacturer areas stay blank in both displayed back images. The original source images and original reference PDF are retained. That PDF still contains its original manufacturer information.

The front edit used the built-in image-generation tool for the blank fill. Only the bounded footer patch was integrated into the original image. The lossless master has zero changed visible pixels outside that patch and preserves the original transparency. The displayed front is a quality-90 WebP encoding of that master; normal compression differences apply. The generated full-image output is not used to replace the rest of the original artwork.

## Positioning

Owner direction: **elite, premium, no compromise on quality**.

Expressed through restrained, confident copy: “For those who expect more” and “A higher standard. Every day.” The mindset paragraph now connects discipline with high personal standards. No purity, sourcing, testing, certification, comparative superiority or performance guarantee has been added.

The original campaign headlines, section order, black/silver/red identity, compiled campaign CSS/JavaScript and motion modules remain intact. Populating native media no longer replaces the homepage chocolate scene: the full media gallery is for the product page. Homepage buying controls stay in their existing layout.

## Review

- Product: <http://127.0.0.1:4184/products/trayn-whey-rich-chocolate>
- Homepage: <http://127.0.0.1:4184/>

Run `node scripts/preview.mjs` from `v3/shopify` to load this prepared content locally (`npm run preview` is equivalent when npm is configured). Default port is 4180; PORT can select another. The HTTP preview reads these local files and verifies image checksums. It labels price/stock as sample data and disables checkout. The default test renderer still supports the empty native-record fixture so missing-data regressions remain covered.

Radio thumbnails and native detail disclosures work with keyboard navigation and without JavaScript. Full images open from the selected gallery image. The native platform Product serializer remains in production; the local renderer's schema is an approximation.

## Verification

- Final full suite: **37/37 pass** (10 SEO/content render checks and 27 existing/new browser regressions).
- Chrome desktop/phone and WebKit phone verify gallery selection, full-width mobile layout, disclosures and accessibility; the gallery and disclosures also work without JavaScript.
- All original motion checks pass without weakening their assertions. One timing-sensitive WebKit compact check failed in the first run, then passed in the focused rerun and both subsequent full runs. No motion code was changed to address it.
- Local parser checks 35 Liquid files; Theme Check inspects 50 files with no offenses; the official skill validator passes all seven updated native text/code files.
- Original campaign CSS/JavaScript, motion modules, theme settings, homepage section order, V1, V2 and static V3 have no changes in this work. Only the front-image reference and mindset copy change within the campaign; the product layout/support CSS is isolated from the homepage.
- Populating the prepared product data leaves the homepage purchase scene's rendered HTML identical to the empty-record fixture, while the product page shows native media, description and detail sections.

## Later store action

Nothing has been uploaded, published or changed in Shopify. Price, stock, availability, publication and other flavours are excluded from this preparation. Native description/media entry and theme upload require a later explicit instruction. Uploading theme code alone will not populate product records.

Vanilla, Café Mocha and Cookies & Cream remain future products, outside this review. Before a later release, review native collections/sitemap/publication so new catalogue links do not promote their existing public URLs unintentionally.

## Image edit prompt

Built-in tool mode, original front WebP supplied as edit target:

Use case: precise-object-edit. Edit target: supplied TRAYN Belgian Chocolate front pouch image, 1024 x1536. Remove ONLY the small obsolete footer line 'PACKAGING CONCEPT — NOT FOR SALE' printed at the bottom of the pouch (roughly x345–675 y1347–1361). Replace that lettering with the natural unprinted black foil pouch surface matching nearby texture and lighting. This is approved retail artwork; leave that former footer area blank. Preserve every other word, logo, red/silver curve, shape, position, highlight, pouch silhouette and original canvas exactly. Preserve the transparent background/alpha. Do not redraw the whole pouch or alter its framing. In particular retain Belgian Chocolate and Net Quantity: 500 g verbatim. Exact original 2:3 aspect ratio, 1024x1536. No new text or watermark.

Working evidence, generated master output, bounded patch comparison and test logs are in `output/belgian-retail-2026-10-24/` at repository root.

