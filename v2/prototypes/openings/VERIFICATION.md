# Prototype verification — 11 October 2026

## Build and scope

- Independent Vite production build passes: four HTML entry points, shared motion runtime, and separate direction modules/styles.
- All 43 local HTML resource references resolve in the built output, including original packaging download links.
- Each direction has real static HTML content before JavaScript enhancement. This is a source/output check, not a browser run with JavaScript disabled.
- Git review shows only the new `prototypes/` directory; tracked production files are unchanged. No deployment or Git commit was made.

## Browser review

Reviewed the local production preview in Chromium at 1440×1000, 390×844, 320×740, and 768×1024. No horizontal overflow at these widths. Hero compositions were inspected visually at desktop and phone sizes; six viewport screenshots are in `captures/`.

- **Quiet Before:** corrected mobile photo crop and top navigation contrast. Tested the first transition, front/back switch, enlarged back artwork, Escape dismissal, and return of focus to the opening control.
- **Under Tension:** verified keyboard End on the light slider, the first transition, back artwork swapping, and resolved full-artwork links. Mobile light control fits in the opening viewport. A separate agent's accessibility review of this direction reported zero axe violations at all four widths.
- **Flavour Study:** tested Chocolate/Vanilla switching, arrow-key selection, matching content changes, front/back dialog control, Escape dismissal, and focus return. The empty image element in the closed dialog is intentionally populated on opening.
- **Comparison:** tested picker switching, numeric shortcuts, arrow shortcuts from inside an experience, replay, 390 px mobile mode, fullscreen link updates, URL state, and Reduce motion. The small-screen picker and top bar fit at 320 px.
- **Reduced motion:** all three production pages set their reduced state and retain visible content with `?motion=off`. System preference changes use the same setup/cleanup path. Tension's separate review also verified zero active animation and ScrollTrigger instances in that state.

## Limits and next stage

These are two-scene creative studies. They are not the completed store or an Awwwards submission. Six campaign PNG originals are retained for art-direction review; responsive image compression, full-site content, wider device/browser testing, and production performance measurement belong to the selected direction's rebuild. No Lighthouse score or physical-device performance result is claimed.

Campaign images are generated art. The supplied packaging is used directly, with concept status retained. Under Tension uses image layers and controlled lighting; it is not a three-dimensional product model.
