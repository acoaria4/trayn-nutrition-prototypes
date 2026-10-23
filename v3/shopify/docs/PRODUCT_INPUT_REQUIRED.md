# Information needed to finish the SEO audit fixes

The code can display approved content, but it cannot establish the retail facts or business terms. Nothing below has been invented or published. You can supply the final approved label document and images rather than retyping facts already contained in them.

## 1. Confirm the actual Belgian Chocolate product

- Is the sold SKU whey concentrate only, or a concentrate/isolate blend? The public artwork says concentrate; older separate concepts described a blend. Confirm which applies to this actual SKU.
- Confirm net quantity, serving size/count, ingredients in order, allergens, nutrition values and their measurement basis, directions, storage and applicable warnings.
- Confirm that the supplied back-label PDF is approved for the actual retail SKU. If it is a design draft, provide the final approved version.
- Supply any manufacturer/marketer and applicable licence/support details that should appear publicly, with the exact approved wording.
- Supply a short approved product description and any substantiated differentiators. Testing/certification/performance claims need supporting evidence; no claims were added in this change.

**Why this is still open:** the current catalogue description is empty, and the homepage explicitly describes its facts as a transcription of unapproved packaging artwork. That disclosure and the original values have been preserved. Do not remove the disclosure until the underlying approval is resolved.

## 2. Supply actual product images

Provide the final front/back pack images for each product to be offered. The chocolate campaign illustration and pouch concepts have been preserved visually, but are not substituted into Product.image as approved retail photography.

The theme already reads Shopify product media and Shopify's native Product structured data. An actual featured product image and nonempty native product description are required to complete the missing-image/description finding. Optional product detail blocks supplement the description; they do not replace those native fields.

A separate approved brand sharing image, ideally 1200 × 630 px, would improve link previews. Until one is configured, pages use their native resource/Shopify sharing image or the existing brand logo. The logo fallback uses a small summary card and is not described as a product photograph.

## 3. Classify the other three flavours

For Vanilla, Café Mocha and Cookies & Cream, confirm whether each is a real temporarily unavailable product, a forthcoming product, or an unfinished development entry. For any real product, provide its own description, images and approved facts. No sold-out product was deleted, hidden or made artificially available.

## 4. Confirm commercial policies

Provide the approved terms for:

- Delivery regions, shipping charges/free-shipping threshold if any, dispatch and estimated delivery times.
- Returns/refunds/cancellations, including eligibility, opened products, damaged/incorrect deliveries, time limits and support process.
- Terms of service and any additional buyer-facing terms you require.

The theme now links available native policies. Publishing these records in Shopify would affect the live store, so no policy record has been created or changed. Policy links remain absent until real policy content exists; fake links or generic policy text have not been inserted.

## 5. Confirm public support details and catalogue/content decisions

- The Contact fallback uses the store's existing email. Confirm any public support phone, address and response hours you want added. Phone/address from the privacy policy were not silently promoted into new copy.
- Decide whether the generic “Home page” collection should be kept, renamed or consolidated. No collection record has been changed.
- Decide whether News should become a real blog. Native blog/article templates are now present. An empty blog is noindex until it has published articles; unused-blog removal or real article publication needs an explicit later store-content change.

## How approved content will be entered

1. Keep an approved product record for each SKU, then populate its native Shopify description and product media when store changes are authorized.
2. Optional nutrition/ingredient/usage sections can be added in the product template editor as **Approved product detail** blocks. Select the exact product and enable **Content approved for sale** only after verification. Unapproved blocks and blocks for another product do not render.
3. Enter confirmed delivery notes and publish the actual native policy records when store changes are authorized.
4. Verify the rendered page and native Product JSON-LD against the approved record before release. No field should be filled just to silence an SEO warning.

Search Console, Merchant Center, analytics and live performance checks remain account/release validation tasks. Do not send passwords or API secrets in the content response; account access can be handled through the normal sign-in flow if needed later.
