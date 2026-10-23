# V3 source and release context

- The user's current target is the live Shopify v3. Its canonical source is `shopify/` relative to this file (`v3/shopify/` from the repository root). The parent `v3/src/` package is a separate static concept/showcase.
- V1 and V2 are preserved. Do not overwrite, rebuild or migrate their source as part of Shopify v3 work unless the user requests it. Keep existing untracked documents and audit artifacts.
- All 59 native Shopify theme files were synchronized from live theme `192621379872`, TRAYN V3 — Silver Identity, on 23 October 2026. Use `shopify/docs/REPO_SYNC_2026_10_23.md` and the hash manifest for provenance. The sync branch is `codex/sync-live-shopify-v3`.
- The audit and next-run queue are in `shopify/docs/SEO_AUDIT_2026_10_23.md` and `SEO_ACTION_PLAN_2026_10_23.md`. The sync did not implement those fixes.
- Preserve the current storefront design and motion when making SEO changes. Keep artwork transcription separate from approved retail information. Never invent product facts, prices, availability, reviews, licences, testing claims or policies.
- Shopify-generated JSON files can have a leading comment header. Preserve it and use `scripts/shopify-json.mjs` for local reads. Live editor settings and templates belong in the baseline; do not regenerate them from the static showcase or rerun the initial import script over edited Liquid.
- Product records, product media, policies, inventory and store settings are not fully captured by a theme pull. Record changes to them separately and keep schema/page content truthful.
- Current user instruction: do not change the public website. Do not upload, publish, run live commerce mutations or push to a branch that triggers public deployment without a subsequent explicit request. Read-only pulls and local checks are allowed.
- From `v3/shopify/`, use `npm run check` and `npm run theme:check` for local syntax/schema checks. `npm run preview` is local-only with checkout disabled and fixture product data. Its data is not an exact copy of live catalogue records. A theme rebuild changes generated CSS/JS; verify any such change against the live baseline before accepting it.
