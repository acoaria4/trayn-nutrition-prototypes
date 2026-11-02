# Coming-soon flavour visibility — 24 October 2026

Owner instruction: hide Vanilla, Café Mocha and Cookies & Cream from the public website and collections; show only Belgian Chocolate. Header redesign and PageAudit changes were requested for discussion, not implementation.

Applied Shopify `publishableUnpublish` only to the Online Store publication `306417729824`:

| Product | Handle | Product ID |
|---|---|---|
| Vanilla Creme | `trayn-whey-vanilla` | `10331931607328` |
| Café Mocha | `trayn-whey-cafe-mocha` | `10331932000544` |
| Cookies & Cream | `trayn-whey-cookies-cream` | `10331932786976` |

Product records remain saved with their existing active status. Point of Sale publication is preserved. No description, media, price, inventory, theme, navigation or design was changed. Belgian Chocolate (`10331931017504`) remains published to the Online Store and otherwise unchanged.

Admin verification confirms all three Online Store removals and no changes to the other publication entries. Public `/collections/all`, `/collections/trayn-whey-collection` and `/collections/frontpage` list only Belgian Chocolate. The native product sitemap advertises only Belgian Chocolate (along with its standard homepage entry). Each hidden direct product URL returns HTTP **302** to `https://traynnutrition.com/`; no future-flavour product content is displayed. Initial automated checks followed these redirects and recorded the destination homepage's 200 response; final verification disables redirect following and records actual status/location.

Evidence: `output/shopify-hide-flavours-2026-10-24/` contains before/after publication snapshots, validated query/mutation and exact variables/results, public status/collection history and sitemap evidence. Restoring a future flavour requires publishing it back to Online Store after its launch is authorized; it does not require recreating the product.

## PageAudit discussion evidence

Owner screenshot: homepage score **70%**, target phrase **Whey Protein**, density **0.83%**, six occurrences, title pass, description/H1 phrase failures, and readability/image recommendations. These are PageAudit's results from the supplied screenshot, not independently reproduced scoring.

Live inspection confirmed:

- Title: `Premium Whey Protein | TRAYN Nutrition`.
- Description: `Explore TRAYN Nutrition, Belgian Chocolate whey, product information and the TRAYN mindset.` It has a description but omits the exact phrase **whey protein**. This is a genuine opportunity for a clearer category-specific summary.
- H1 remains the owner-approved **FUEL YOUR POTENTIAL**. Keep this campaign headline; a visible descriptive category line and natural supporting copy can clarify the product without sacrificing the headline.
- All nine initial homepage image elements have alt attributes. Three are empty: decorative hero foil, decorative slipstream and the initially empty inspector image. Do not replace appropriate empty decorative alternatives with keywords merely to satisfy a generic image warning.
- Readability should be assessed in marketing copy separately from required ingredient names, nutrition tables and warnings. No Flesch score was visible in the supplied screenshot, so no independent readability number is claimed.

The public Lighthouse SEO scores of 100/100 check technical essentials; they do not assess the chosen keyword's density, brand positioning, topical depth or ranking potential. The two tools' scores are not directly comparable. Improve natural category wording and the homepage description, while preserving exact product facts and the approved headline. No metadata, H1, copy or header change was made during this task.

Primary guidance: [Google's SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [meta descriptions](https://developers.google.com/search/docs/appearance/snippet), [W3C decorative images](https://www.w3.org/WAI/tutorials/images/decorative/). API: [publishableUnpublish](https://shopify.dev/docs/api/admin-graphql/2026-07/mutations/publishableUnpublish).
