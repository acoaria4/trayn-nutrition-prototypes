# V4 — The Work

Independent TRAYN Nutrition prototype. Cinematic training × interactive product craft. V1–V3, the opening studies and the live Shopify store remain unchanged. Publication target: the versioned GitHub Pages collection; the Shopify storefront is a separate deployment.

## Preview

From this directory:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4184/**. The local version chooser is at **http://127.0.0.1:4184/versions/**; older versions link to their existing public previews. Production builds use the collection's parent chooser.

## Experience and implementation

- Native scrolling with one 2,040 px sticky hero; measured persistent header; training film hands over to a physically lit pouch after the initial scroll. Lighting changes after the pouch moves.
- A red GET BUILT composition with opposing typography and a training-image aperture. No second long pin.
- Chocolate imagery, a packaging close-up, calm label reading, native question disclosures and a studio closing image.
- One reusable Three.js renderer moves between the hero and inspection. GLB mesh: 13,928 triangles including weld and zipper geometry, 840 KB including artwork textures. Front/back/detail views, horizontal drag, rotation range, zoom, lighting, keyboard controls and an expanded dialog.
- GSAP ScrollTrigger handles scroll relationships. No Lenis, forced snapping or continuously running WebGL render loop. Three.js is loaded separately, material programs prepare during idle loading, and the canvas renders on demand. Offscreen media pauses; at most one muted decorative film plays. Bounded device pixel ratio and separate phone media keep the workload contained.
- Native HTML remains readable without JavaScript. Reduced motion retains stills and normal document flow. A pause control freezes decorative motion without collapsing the page. WebGL/context-loss fallback keeps the images and original label available.
- The Shop links lead to the existing store. This prototype has no checkout, cart or fabricated prices/availability.

## Assets and provenance

The original silver logo, front/back pouch references, original back-label image/PDF and Manrope/Barlow fonts were copied into V4. Label values are sourced from the supplied printer PDF's back page. Transcribed artwork remains distinct from verified retail records. See `src/label-artwork.js`; the readable HTML retains printed units and rounding.

**Higgsfield:** six 2K stills (preparation, effort, flavour, each landscape/portrait) and two four-second 720p training films. The `docs/credits.json` job ledger records **52 credits spent**, confirmed by a balance change from 551.25 to 499.25. The 60-credit cap was respected; the 8-credit reserve is unused. No additional video attempts or paid upscales were made. Campaign imagery depicts creative studies, not endorsements.

**Blender:** locally constructed pouch geometry with original artwork projected onto front/back surfaces, foil edges, side welds, zipper and gusset details. It is a proportion-based visual reconstruction, not a manufacturing model. Surface folds/shading partly come from the supplied photographic artwork. Six local product/detail/closing renders accompany the WebGL model. Material/flavour loops are local camera moves over stills, not additional paid AI video generations.

The self-contained editable Blender scene is `source/trayn-campaign.blend` (textures packed). Rebuild it with:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/build-pouch.py
```

The script writes GLB and PNG renders. WebP deliverables use Pillow. `scripts/export-media.py` converts local renders and makes the local H.264 loops using FFmpeg. Raw generation outputs and QA captures remain in ignored `artifacts/`; deployable assets live in `public/`. Font license texts are in `docs/`.

## Checks

```sh
npm run check
npm test
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/trayn-v4-browsers BROWSER=webkit npm test
SITE_BASE_PATH=/trayn-nutrition-prototypes/v4/ npm run build
npm run test:hosting:static
node scripts/preserve.mjs --check
```

Browser tests start and stop their own temporary local server. They use installed Chrome on macOS and Playwright’s pinned Chromium on Linux/CI (`PLAYWRIGHT_CHROME_PATH` can override either). Install the WebKit runtime into the indicated temporary path with Playwright before running that engine. Both engines cover desktop/laptop, 320/390/430 px phones and tablet, hero fill/distance, tabs/disclosures, keyboard/drag controls, dialogs, media bounds, reduced motion, no JavaScript, WebGL fallback/context loss, and axe checks on reading/interaction sections. Prefix verification serves the actual built files beneath a nested V4 path.

`scripts/profile.mjs` records a synthetic Chrome scroll profile, including a 4× CPU-throttled phone viewport. These measurements do not establish physical phone GPU performance; real-device review remains useful before publication. No publication is performed by any check command.
