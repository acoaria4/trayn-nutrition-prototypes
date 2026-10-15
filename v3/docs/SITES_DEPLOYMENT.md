# V3 Sites publication — 15 October 2026

- Public V3: https://trayn-nutrition-v2.blondridge1.chatgpt.site/v3/
- Collection: https://trayn-nutrition-v2.blondridge1.chatgpt.site/
- Project: `appgprj_6ad019fa261081918a78a062818d6585`
- Audience: public, access revision 2 retained.
- Saved version: `appgprj_6ad019fa261081918a78a062818d6585~appgver_70609579b4a881918cdc8e8f1667a788` (Sites version 4).
- Deployment: `appgdep_6ad04b104358819180d565fd3f65717b` — succeeded.
- Pushed static-source commit: `884a195b0885b30d779fe9d768a40b8102a729a1`.
- Static checkout: `sites/trayn-nutrition-v2/` from the repository root.

Only `dist/v3/` was replaced. All 132 files outside that directory, including the chooser, V1, V2, drafts and compatibility pages, match the prior snapshot byte for byte. Preserve this approach for updates scoped to V3; do not rebuild the other versions unless their publication is requested.

The V3 build used `SITE_BASE_PATH=/v3/`. It passed 45 static HTML/CSS reference checks; the collection passed 724 references across 149 files. The source passed syntax/unit checks, 66 Chrome browser checks across six viewport profiles and 33 mobile WebKit checks. Production output was checked separately in laptop Chrome and phone WebKit before packaging. Native Sites confirmed successful production deployment with public access retained. A fresh browser session verified HTTP 200 and matching main content for all eight chooser/version/draft routes, plus the live V3 label, questions and contact interactions without sign-in.

Editable source remains in `v3/`. The Sites repository tracks the static collection. Local preview paths were restored after the hosted build. Further publication requires a user request.
