# V3 — Slipstream

Independent version of the GET BUILT → packaging motion direction. V2 keeps its
current design. V3 owns its source, assets, dependencies, tests and build output.
Nothing is published by running the commands below.

Public preview: [V3 — Slipstream](https://trayn-nutrition-v2.blondridge1.chatgpt.site/v3/), included in the [version collection](https://trayn-nutrition-v2.blondridge1.chatgpt.site/).

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4175/`. Run V2 separately on port 4173 to use the V2
comparison links. Override `V2_SITE_URL` if that preview runs elsewhere.

```sh
npm run check
npm test
PLAYWRIGHT_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:browser
SITE_BASE_PATH=/trayn-nutrition-prototypes/v3/ npm run build
SITE_BASE_PATH=/trayn-nutrition-prototypes/v3/ npm run test:hosting:static
node scripts/render-pages.mjs --dev
```

Production comparison links use `../v2/` alongside the V3 deployment. The version
picker and build workflow include V3. Further deployment requires an explicit
request, using Sites publication or the independent GitHub Pages workflow.

Desktop uses a bounded, reversible 1,800 px graphic scene. Phones retain normal,
content-sized chapters with scroll-driven artwork. Reduced motion and readable
no-JavaScript layouts are retained. The original V2 hero remains unchanged.

Pouch and foil assets are copies of the existing concept artwork. Front/back
views are not a 360° product model. The PDF contains only the supplied back-label
artwork. No prices, availability or commercial approval are supplied.
