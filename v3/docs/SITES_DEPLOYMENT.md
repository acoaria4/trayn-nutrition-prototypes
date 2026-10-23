# V3 Sites publication — 15 October 2026

- Public V3: https://trayn-nutrition-v2.blondridge1.chatgpt.site/v3/
- Collection: https://trayn-nutrition-v2.blondridge1.chatgpt.site/
- Project: `appgprj_6ad019fa261081918a78a062818d6585`
- Audience: public, access revision 2 retained.
- Saved version: `appgprj_6ad019fa261081918a78a062818d6585~appgver_d43b193f98f08191b2d0eb7c8cce226c` (Sites version 6).
- Deployment: `appgdep_6ad05e02257c81919d899c489f1027a3` — succeeded.
- Pushed static-source commit: `2529a3c37f433804af0faf0964621cf31fee03e1`.
- Static checkout: `sites/trayn-nutrition-v2/` from the repository root.

Only `dist/v3/` was replaced. All 132 files outside that directory, including the chooser, V1, V2, drafts and compatibility pages, match the prior snapshot byte for byte. Preserve this approach for updates scoped to V3; do not rebuild the other versions unless their publication is requested.

The V3 build used `SITE_BASE_PATH=/v3/`. It passed 44 static HTML/CSS reference checks across 17 output files; the collection passed 723 references across 149 files. The source passed syntax/unit checks, 72 Chrome browser checks across six viewport profiles and 36 mobile WebKit checks. Production output was checked separately in laptop Chrome and phone WebKit before packaging. Native Sites confirmed successful production deployment with public access retained. A fresh browser session verified HTTP 200 and matching main content for all eight chooser/version/draft routes. Live desktop Chrome verified the charcoal reader and expandable nutrition table; phone WebKit verified per-100 g selection, usage/storage notes and layout without sign-in.

Editable source remains in `v3/`. The Sites repository tracks the static collection. Local preview paths were restored after the hosted build. Further publication requires a user request.

Version 6 adds 8–12 px red side and bottom gutters to the charcoal reader below 900 px, compensating its inner padding to retain reading width. The gutter revision passed 18 Chrome and 9 phone WebKit checks, plus geometry/overflow measurements at 320, 390, 768, 1280 and 1440 px. The version 6 build and full collection reference checks passed; all 132 files outside V3 remain byte-identical to version 5.
