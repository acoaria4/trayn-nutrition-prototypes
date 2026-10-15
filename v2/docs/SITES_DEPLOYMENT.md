# Sites deployment

- Collection URL: https://trayn-nutrition-v2.blondridge1.chatgpt.site/
- Audience: public (anyone with the URL); access policy revision 2, confirmed during publication on 15 October 2026.
- Project: `appgprj_6ad019fa261081918a78a062818d6585`
- Saved version: `appgprj_6ad019fa261081918a78a062818d6585~appgver_5943f83ac13c81918de9522fb83aee41` (Sites version 3; separate from the website's V3 name).
- Deployment: `appgdep_6ad0345072508191a7b99f5e5ed171ce` (succeeded).
- Pushed static-source commit: `22ac67e9907eff1e4769cfd658528f02530a7ba5`.
- Local Sites checkout: `../../sites/trayn-nutrition-v2/` (independent Git repository, ignored by the parent repository).

The root is the version chooser. Independent static builds live under `/v1/`, `/v2/`, `/v3/`, and `/v2/drafts/`. All three opening studies are retained. The historical hostname remains unchanged. Previously shared root-level V2 detail and draft URLs use native HTML refresh compatibility pages to reach their new destinations; this static Sites host does not apply Pages `_redirects` files.

Editable apps remain in their respective version directories. The Sites checkout contains the tracked static snapshot in `dist/`, including assets and the supplied back-only label PDF. `.openai/hosting.json` preserves the existing Site identity and declares `dist` as the static directory. No source secrets, development folders, or credentials are published.

## Updating

1. Read the Sites skill, get the current Site/audience, obtain a short-lived write credential and open the existing checkout with its source helper before editing it.
2. From the repository root, run `node scripts/build-sites-collection.mjs`. Dependencies must already be installed in V1, V2, V3 and `v2/prototypes/openings/`.
3. Run `node scripts/verify-sites-collection.mjs` and appropriate browser checks against the assembled snapshot. The build keeps each version's prefix and rewrites absolute metadata URLs to its deployed location.
4. Use the Sites source helper to push/package the exact snapshot, save the returned commit/archive and deploy that saved version. Preserve public access unless the user requests a change. Never store credentials.
5. Restore local preview HTML with `node scripts/render-pages.mjs` from V1 and V2, and `node scripts/render-pages.mjs --dev` from V3.

These local build/check commands do not publish. Further deployment requires a user request. GitHub Pages remains independent and uses `/trayn-nutrition-prototypes/v1/`, `/trayn-nutrition-prototypes/v2/` and `/trayn-nutrition-prototypes/v3/` prefixes with its existing workflow.

## Validation

- All three packages passed syntax checks and unit tests (18 tests total).
- All version builds and retained draft builds succeeded.
- The final static collection passed 706 HTML/CSS references across 147 files.
- 44 route checks passed in desktop/laptop Chrome, phone Chrome and phone WebKit against the assembled collection. Checks include V2 hero viewport sizing, label tabs, back-preview inspection, V3 back view and the V3-to-V2 comparison link.
- Native Sites confirmed a successful public production deployment. Anonymous HTTP requests verified all eight collection/primary version/draft pages. The compatibility pages were also tested in Chrome.
