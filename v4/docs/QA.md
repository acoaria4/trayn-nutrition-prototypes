# V4 verification — 1 November 2026

No deployment or Shopify write was performed.

- Chrome: 11/11 browser checks passed.
- WebKit 27.2: 11/11 browser checks passed.
- Viewports: 1440×900 desktop, 1280×650 laptop, 320×640 / 390×844 / 430×932 phones, 768×1024 tablet.
- Hero: 2,040 px scroll interval, fills the viewport below the measured sticky header, no horizontal overflow through the checked chapters.
- Inspection: exactly one canvas, hero/inspection handoff, repeated entry, front/back/detail, rotation/zoom/light, keyboard, horizontal drag, expanded native dialog, source-label dialog and focus return.
- Fallbacks: reduced motion, pause/resume without layout collapse, JavaScript disabled, optional 3D disabled and simulated WebGL context loss.
- Reading: tab keyboard navigation, native FAQ disclosure, original label image/PDF, no-JS content.
- Accessibility: axe WCAG A/AA checks on the reading/interaction sections in both engines; full-page laptop and phone scans in Chrome reported zero violations. Automated results do not replace assistive-technology review.
- Media: six local H.264 film exports, portrait/landscape pairs, muted with no audio streams. Training film frames were visually inspected. At most one film plays, and the training film pauses once its hero image has faded out.
- Build: production HTML, fonts, CSS, split JS, WebP images, videos and GLB verified under `/trayn-nutrition-prototypes/v4/`.
- Existing work: SHA-256 comparison preserved all 403 captured files in V1–V3, including their drafts/Shopify sources.
- GLB: 840,496 bytes, 13,928 triangles including seams/zipper; one demand-driven renderer and bounded DPR.
- Synthetic Chrome scroll: approximately 16.7 ms median / 16.7–16.8 ms p95 frame interval, zero observed tasks over 50 ms, both at laptop settings and a phone viewport with 4× CPU throttling. Captures and metrics are in ignored `artifacts/`. This is emulation, not evidence of physical phone GPU performance.
- Higgsfield balance: 551.25 → 499.25, exactly 52 credits. Eight credits of the approved 60-credit cap remain unused.

The self-contained Blender scene is in `source/trayn-campaign.blend`. The model is a visual reconstruction from supplied imagery; printed folds and highlights partly remain in the projected texture. It does not establish manufacturing dimensions or verified retail label approval.
