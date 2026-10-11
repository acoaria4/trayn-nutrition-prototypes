# Transition from showcase to commerce

The current implementation is intentionally complete as a product showcase. Data is separate from presentation; unknown commercial fields are null rather than fabricated.

## Existing systems preserved

The original `traynnutrition-website-v2` repository remains intact at revision `7e101adc2ce2595820c23c81794ba340c7bcd520`. It contains the native Shopify OS 2.0 theme, functional locale-aware cart endpoints, contact form, structured-data snippets and consent-controlled analytics. This separate implementation does not migrate or publish that store.

## Integration boundaries

1. Replace intended concept fields in `src/data/products.js` with approved product data from the chosen source. Retain stable IDs and the established `/products/trayn-whey-rich-chocolate` handle.
2. A genuine commerce adapter should provide real variant IDs, prices, currencies and availability. Keep inventory authoritative on the merchant platform. An image, a historic price or a front-end flag is not approval to sell.
3. Port the static page presentation into native Shopify sections/snippets if Shopify remains the selected platform. Reuse the original theme’s cart and native contact integration, including focus, error and locale handling; do not add a second speculative backend.
4. Product galleries already handle genuine front/back assets and missing views. Populate approved retail images, ingredients, nutrition, preparation and storage instructions as accessible text.
5. Add Product/Offer structured data only when a real purchasable item and merchant records support it. Ratings and reviews require authentic records. Revisit canonicals, redirects, indexing and sitemap as part of deployment.
6. Preserve the original consent gate if analytics is reinstated. No tracking is installed in this local showcase.

## Information still needed

- Final formula, nutrition, serving size, ingredients and full allergen/cross-contact records.
- Approved preparation/storage instructions and final retail packaging.
- Responsible business/manufacturer records and any applicable substantiated claims.
- Actual pricing, variants, inventory, policies and commercial availability.
- Confirmed launch decisions for the three future flavour concepts.

These are content/integration dependencies for future selling, not unfinished controls in the delivered showcase.
