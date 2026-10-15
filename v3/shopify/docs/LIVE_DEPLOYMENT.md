# Shopify publication — 15 October 2026

The user approved publishing the reviewed Shopify theme so it could be accessed from the main domains.

- Published theme: `192540770592`, `TRAYN V3 Slipstream — Store Preview`.
- Primary domain: https://traynnutrition.com/
- Connected alias: https://www.traynnutrition.com/ (redirects to the primary domain).
- Previous theme: `192176914720`, `trayn-nutrition-theme-v0-6-4`, retained in the theme library for rollback.

The existing remote draft was published with Shopify CLI `theme publish`, using its exact theme ID. No new source upload, product edit, inventory edit, checkout configuration, domain change or Sites deployment was performed.

The preview passed read-only laptop Chrome and mobile WebKit checks before publication: theme identity, persistent header, 2,040 px hero scroll distance, GET BUILT sequence, flavour artwork, packaging inspector, red reveal, product information controls, native cart rendering and product route. Shopify analytics requests can be blocked by WebKit access controls; these are recorded separately from theme errors.

After publication, both domains returned HTTP 200 with theme `192540770592` in the main role. The same browser checks passed on the public primary domain in fresh laptop Chrome and mobile WebKit sessions without a preview parameter. No theme asset failures or page errors were reported in the post-publication run. Shopify's theme list confirmed the previous theme is now unpublished and retained.

The product remains Sold Out according to Shopify. No order or payment was attempted. Successful add/change/remove paths were previously tested with isolated responses; payment, shipping and complete order testing remain separate commerce readiness tasks.

Rollback is available by publishing the retained previous theme. Do this only when the user requests a rollback:

```sh
shopify theme publish --store trayn-nutrition.myshopify.com --theme 192176914720
```
