# V4 release — 2 November 2026

Requested release branch: **1.3-v4**, based on **1.2-launchPlan** (`ca7b97e`). The cinematic V4 prototype was originally built as uncommitted work while 1.1.7-silverHeader was checked out. It is carried onto the newer 1.2 baseline without replacing the V1–V3 or Shopify sources.

Scope: V4 source, campaign assets, packed editable Blender scene, version chooser, collection helpers, and GitHub Pages Actions deployment. The Pages workflow now builds V1–V4 and the three V2 opening studies, runs the V4 browser suite in Chromium/WebKit, verifies the nested production path and the complete assembled artifact, then deploys Pages on main.

This release does not upload or publish a Shopify theme, modify commerce records, or submit additional media-generation jobs. The earlier campaign used 52 Higgsfield credits; no further credits are used for this release. Browser tests own temporary servers and stop them on completion. The persistent local review server remains stopped.

Historical QA in QA.md records the original build on the older branch. Release verification compares V1–V3 against the current 1.2 baseline, rather than treating the intentional branch-base differences as V4 edits.

Local release checks passed: V1 6 tests, V2 10 tests, V3 2 tests, V4 11 Chromium checks and 11 WebKit checks (40 total). All four production builds pass. The combined 26 MB Pages artifact passes 677 local HTML/CSS reference checks, including V1–V4 and all three opening studies. V1–V3 source matches 1.2-launchPlan exactly. V4's temporary test servers stopped on completion.
