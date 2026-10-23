# TRAYN v3 — next-run implementation queue

Audit baseline: 23 October 2026. Theme-side fixes are now prepared locally on `codex/v3-seo-audit-fixes`; see [implementation status](SEO_FIXES_2026_10_23.md). Nothing has been uploaded or published. The table below remains the original dependency queue; product facts, native product media/descriptions, policies and account checks remain pending as detailed in [PRODUCT_INPUT_REQUIRED.md](PRODUCT_INPUT_REQUIRED.md).

| Order | Priority | Work | Depends on | Completion check |
|---|---|---|---|---|
| 1 | High | Confirm approved formula, pack size, nutrition/ingredients/allergens, label PDF, actual SKU and final pack images; classify each flavour as active, temporarily unavailable or unfinished | Product owner records | One approved record agrees with the actual saleable SKU; no invented data |
| 2 | High | Populate product records and shared product template with complete flavour-specific information and gallery | 1 | All four product URLs directly answer buying questions on mobile/desktop |
| 3 | High | Render proper titles/descriptions and social preview fields from Shopify data | 1; template support can be built alongside 2 | Unique appropriate metadata and preview image on intended landing pages |
| 4 | High | Repair Product JSON-LD image/description; preserve dynamic INR prices/availability; add truthful brand identity | 1–2 | Required fields validate; raw/rendered/page/record values agree |
| 5 | High | Publish shipping, refund and terms policies, plus buyer-facing links/summaries | Approved business policies | All policy URLs return substantive 200 pages; checkout and summaries agree |
| 6 | Medium | Fill Contact and factual company/process information | Validated public support details | Contact is useful and visibly linked |
| 7 | Medium | Link intended collection/catalogue; add useful breadcrumb/category links; decide frontpage collection purpose | 1 | Normal navigation reaches intended catalogue and no sampled important page is link-isolated |
| 8 | Medium | Resolve sitemap-listed /blogs/news 404 at Shopify source | Decision to retain blog or remove unused record | Sitemap re-crawl has no advertised missing content |
| 9 | Medium | Run usable mobile/desktop Lighthouse and inspect field data where available | Working test service/local runtime | Store real report and LCP/CLS; field INP only if available, no invented score |
| 10 | Follow-up | Validate GSC, Merchant Center and analytics setup/status; measure changes | Account access if provided and deployment | Record indexing/enhancement/organic landing-page baseline and compare after recrawl |

Implement in an unpublished theme first. Preserve existing product handles and truthful unavailable states. Review and validate the concrete theme/product changes before release. Do not delete sold-out products, remove concept disclaimers, or invent reviews/testing/claims merely to clear audit warnings.

The full report explains evidence, limitations, impact and acceptance criteria. No confirmed storewide indexing blocker was found. No trustworthy performance or organic-visibility score was obtained.
