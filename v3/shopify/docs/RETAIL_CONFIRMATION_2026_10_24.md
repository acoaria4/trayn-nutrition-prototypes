# Retail product confirmation — 24 October 2026

The owner stated in this conversation:

> Everything in the site and images are the actual confirmed retail product information. Other flavors are coming soon but not shown on our website now

## Accepted scope

- The existing Belgian Chocolate site information and images are approved retail source material. The current description is whey protein concentrate, 500 g, approximately 33 g per scoop and 15 servings. Preserve the existing full nutrition table, dry-basis protein label, ingredients, allergens, directions, storage, warnings and printed business details.
- This is owner approval of existing information, not a new independent laboratory, regulatory or certification assessment. No additional claims, nutrition calculations, licence validation, launch dates, prices or availability are inferred.
- The earlier manufacturer-blank instruction remains in force for the displayed back-pouch and enlarged-label assets. Do not put a permanent manufacturer back into those images. The original reference PDF is retained.
- Vanilla, Café Mocha and Cookies & Cream are coming soon; keep them out of the current product presentation and local review catalogue.

## Local changes

Replaced customer-facing “concept” and “not an approved retail specification” wording with factual product/label wording in hero/packaging image alternative text, the product information introduction and the packaging inspector captions. Nutrition, ingredients, directions, warnings, source images, layout, CSS, motion logic, settings and prices were not changed.

The source and compiled JavaScript receive the same literal text substitutions; no rebuild or animation rewrite is needed. Earlier audit/baseline reports remain historical evidence.

Validation: 34 Liquid files pass local parsing/reference/schema checks; 8/8 existing SEO rendering tests pass; Shopify Theme Check inspects 48 files with no offenses; the Shopify skill validator passes all five updated native files using its existing cached documentation. A separate comparison confirms only the intended JavaScript strings and product-introduction text changed, with nutrition content, motion logic, CSS, settings and prior versions unchanged. The validator could not refresh one cache metadata file in the sandbox but completed successfully with cached schemas.

## Remaining work

Owner confirmation resolves the product-information approval dependency. Native product description/media entry and schema completion still require implementation and later Shopify verification; they are not automatically fixed by this confirmation.

The audit found existing future-flavour URLs reachable through sitemap/collections. That is compatible with their absence from the homepage but needs release review before adding catalogue navigation. No store record has been hidden, deleted or published.

Missing business policies and blog/collection decisions remain listed in [PRODUCT_INPUT_REQUIRED.md](PRODUCT_INPUT_REQUIRED.md). No public website or Shopify record was changed.

