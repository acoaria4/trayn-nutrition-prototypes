# Red header brand and commerce refinement — 16 October 2026

Status: local review only. Live Shopify theme 192591069472 is unchanged. No theme upload, publication, store-name setting, payment setting, order, product, inventory or price record was changed.

Review: http://127.0.0.1:4180/?demo=cart&review=brand-cart#purchase

## Brand

The header uses the alpha silhouette of the supplied 256 px logo as a static CSS mask, filled with the existing #f82030 accent. Its geometry is unchanged; there is no metallic tint filter, generated replacement lettering, new motion or additional image asset. The original image remains the accessibility content and unsupported-mask fallback. The mask is on the inner mark so the link focus outline stays visible. Header height remains 80 px desktop / 72 px phone. The footer keeps the original silver logo.

The visible website name, page-title brand suffix and og:site_name use the translated TRAYN Nutrition name. Page titles normalize Trayn Nutrition to TRAYN Nutrition. This is website presentation; Shopify business/account records and merchant-authored product names are unchanged.

## Purchase controls and prices

A native numeric input is enhanced with 44 px touch targets for minus/plus. It respects Shopify minimum, increment and optional maximum values, supports manual keyboard entry, and disables adjustment while a request is pending. With JavaScript off the buttons remain hidden and the native form/input still work. Purchase feedback keeps reserved space and the tax/shipping note sits closer to the controls.

The reusable price snippet uses Shopify money_without_trailing_zeros for INR, respecting the merchant's currency format and retaining genuine decimal amounts. Other currencies retain money_with_currency to keep their code explicit. Variant prices, cart line totals, cart subtotal and the mobile bar all use the same policy; no conversion or amount is hardcoded into the theme. The store may display Rs. rather than the rupee symbol according to its own configured money format.

## Cart

The empty cart groups its message with Shop Belgian Chocolate for the known featured product, or Shop TRAYN otherwise. View cart and Checkout are hidden when empty. The action closes the dialog, returns to the purchase area and puts keyboard focus on that section. Modified clicks retain normal link behavior.

Filled rows show merchant product media when supplied. The known Belgian Chocolate product can use the flavour campaign artwork as a thumbnail without implying a package size or nutritional claim. Quantities use the same native steppers; cart decrements can reach zero to remove a line. Invalid nonzero quantities below the variant minimum are rejected before a request. Removal, line properties, selling plans, discounts and Shopify totals are preserved.

The drawer uses an internally scrolling content area with the checkout controls outside that scroll area. Keyboard focus survives server-rendered quantity updates and falls back to the quantity input at a button limit. Empty-state footers update after additions/removal. If cart rendering fails after an addition, the stale empty message is hidden and View cart remains available; an addition is never retried automatically. Checkout remains the native Shopify form submission.

## Local cart demo

Opt in with demo=cart. The localhost server keeps an isolated in-memory cookie-scoped sample cart and serves its own cart/section responses. It never calls Shopify. The banner identifies sample prices/stock and checkout is disabled, including a server-side POST guard. Normal local previews retain disabled commerce. These preview scripts are excluded by .shopifyignore.

## Validation

- Build, asset references and 27 Liquid/schema files pass. Native Shopify Theme Check has zero errors/warnings.
- Full browser suite: 21/21 pass, including Chrome desktop/laptop/tablet/phones, WebKit phones, hero pacing, inspector, motion, cart edits/removal/errors, accessibility, reduced motion and no-JavaScript forms.
- Focused new cases verify minimum/increment/maximum rules, manual invalid values, actual submitted quantity, cart decrement-to-zero, server-rendered totals, focus after updates, empty-cart return, native-pointer page-position preservation and a visible Checkout button on a 390 × 600 WebKit phone. Naming and formatting checks preserve fractional amounts and foreign currency codes.
- Isolated local demo add/read/change behavior was exercised in desktop Chrome and phone WebKit. Empty and filled layouts were visually inspected, along with the red header logo and purchase controls. No browser page errors were reported.
- The bundled Shopify skill validator remains unavailable due to its missing theme-check-common dependency; native CLI validation was used.

The apparent background shift in an initial screenshot came from Playwright locator auto-scrolling to a sticky header link. Native pointer and scripted clicks preserve scroll position in both browsers; no production scroll-lock change was required.

Future publication must start from a fresh copy of the current live theme to preserve editor settings. Apply the reviewed layout/header/footer, cart/purchase snippets, new price/quantity snippets and rebuilt CSS/JS. Merge the new English locale keys with current live translations. Do not upload preview fixtures, documentation or tests.

Sources: https://shopify.dev/docs/api/liquid/filters/money_without_trailing_zeros and https://shopify.dev/docs/api/liquid/objects/quantity_rule.
