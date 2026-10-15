# v2 section interactions

Shopify migration is deferred. These changes use the existing site and assets.

- Packaging: two overlapping images crossfade for pointer clicks (200 ms, `--ease-out`), keeping inspection links in sync. Keyboard and reduced-motion switches are immediate. The inspector can still show the original back-label artwork/PDF.
- Label details: Nutrition, Ingredients and How to use panels follow the ARIA tabs pattern, including arrow keys, Home/End and roving focus. Information appears immediately so numeric data does not move while being read. Native anchor links and all panels remain readable without JavaScript.
- FAQs: existing native details elements retain keyboard behaviour; pointer transitions measure height and run for 200 ms. A fresh click reverses from the current height. Reduced motion switches immediately.
- GET BUILT: one-time 450 ms headline reveal and a restrained 600 ms slipstream entrance. Content is visible before enhancement; reduced motion and section-focus navigation bypass the reveal.
- Contact: fine-pointer hover moves link arrows 3 px over 160 ms; touch press changes colour.

## Label source

`src/data/label-artwork.js` transcribes only page 2 of the supplied `Trayn WHEY 500g Pouch.pdf`. Compare it with `public/images/products/belgian-chocolate-wpc-back-label.pdf`, whose page contents were verified unchanged from the supplied PDF. The flat label, rather than the generated pouch mockup, is the numerical/text source. Unit/spacing and heading capitalisation are normalised for readable web tables.

Values remain as printed, including the approximate 33 g serving column; they are not recalculated from the 100 g column. This source record remains separate from the catalog's verified retail fields and from archived blend products. No pricing or launch availability has been added.

## Check the feel

Use Front/Back repeatedly, change tabs with arrow keys, reverse a FAQ while it opens and revisit GET BUILT. Check on a physical phone as well as the tested viewport sizes; the hero retains its 2,040 px scroll distance and persistent-header offset.
