# V3 — Slipstream

A complete TRAYN product showcase: FUEL YOUR POTENTIAL → Belgian Chocolate → GET BUILT → packaging → product information → questions → contact. V2 keeps its current design. V3 owns its source, assets, dependencies, tests and build output.

The complete-site iteration is **local and unpublished**. The public Sites V3 URL still contains the earlier two-chapter motion study until publication is requested. No build or test command publishes anything.

## Preview

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4175/`. The local footer compares with the public V2 site by default. Set `V2_SITE_URL=http://127.0.0.1:4173/` if you prefer a separately running local V2 preview.

## Check and build

```sh
npm run check
npm test
PLAYWRIGHT_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:browser
npm run test:browser:webkit # when Playwright WebKit is installed
SITE_BASE_PATH=/trayn-nutrition-prototypes/v3/ npm run build
SITE_BASE_PATH=/trayn-nutrition-prototypes/v3/ npm run test:hosting:static
node scripts/render-pages.mjs --dev
```

Production comparison links use `../v2/` alongside V3. The version chooser and both hosting workflows include V3; further publication still requires a user request.

## Design and motion

[Design plan and motion score](docs/DESIGN.md).

- The header stays visible and its measured height drives pinning and anchor offsets.
- The two-part hero has 2,040 px of reversible scroll on all supported screen sizes. Its light sweep starts after the pouch moves. Short landscape and reduced-motion views use normal flow.
- Desktop uses a second bounded 1,800 px GET BUILT-to-packaging scene. Phones retain natural, content-sized chapters with scroll-driven artwork.
- The rectangular frame and detached foreground foil tile are removed. Native SVG clip paths follow the actual pouch silhouettes without changing the supplied raster artwork.
- Native packaging inspection supports front/back/original label, zoom, Escape, focus restoration and touch scrolling.
- Label tabs, a full amino-acid profile, source usage notes, native questions and email contact remain usable by keyboard. Printed values do not animate. No-JavaScript HTML retains all reading content and direct artwork/PDF links.
- GSAP scrubs the decorative objects and ribbons beside the product, questions and contact. There is no snap scrolling or wheel interception. Reduced motion removes pinning and decorative travel.

## Product information

`src/data/label-artwork.js` is an independent copy of the existing transcription from the supplied printer PDF's back page, retained exactly as printed. Its values are not commercial approval or independently verified retail data. The earlier blend concepts do not inherit this data. Front/back pouch views are visualisations, not a 360° model. No prices, availability, testimonials, new product claims or checkout are introduced; Shopify remains deferred.
