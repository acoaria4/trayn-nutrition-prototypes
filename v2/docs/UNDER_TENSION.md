# Under Tension — WPC product and continuous scroll

11 October 2026. V2 keeps the selected Under Tension hero and extends its black, silver and red material scene through the opening scroll. The featured product is now Belgian Chocolate whey protein concentrate (WPC), using the supplied 500 g front-pack artwork.

## Current experience

On screens with enough room and motion enabled, the hero becomes one pinned scene. The same pouch remains visible while the heading recedes, the light moves across the foil, and two short chapters introduce the protein source and flavour. Scroll progress directly controls the scene, so scrolling backwards reverses the sequence. Product details, packaging inspection and contact follow in the same visual direction.

Belgian Chocolate is the only product featured on the homepage. Its product page identifies whey protein concentrate as the protein source. The old concentrate-and-isolate description and old back-label image are no longer used for this product. No matching WPC back label has been supplied, so the gallery offers the front only.

Vanilla Creme, Café Mocha and Cookies & Cream remain accessible as **archived flavour concepts**, linked from the product-information page. Their original artwork and earlier concentrate-and-isolate formulation remain accurately labelled. They are not presented as current WPC products or included in the homepage scroll.

V1 and all three opening studies remain preserved. The studies still live in `prototypes/openings/`; the V2 build includes their comparison and individual pages under `drafts/`. Their historical artwork and copy are separate from the current V2 product direction.

## Implementation and fallbacks

- `templates.js` renders eight main HTML routes, including the product alias, current product, three archived concepts, information page and 404 page. Real links remain usable without JavaScript.
- `scroll-story.css` and `motion.js` extend the original hero composition. GSAP/ScrollTrigger pins the scene and controls its pouch, lighting and chapter transitions. Hidden chapters and hidden hero controls become inert while the animated sequence is active.
- Pinning requires at least 790 px viewport height on desktop, 745 px on tablet, or 640 px on phone. Shorter screens use normal document flow so chapter text and links remain reachable.
- `prefers-reduced-motion`, `?motion=off`, an unavailable animation module, and no-JavaScript viewing retain a readable, unpinned page. The chapters remain in document order. Reduced motion also disables the decorative pouch tilt.
- One Lenis instance supplies smooth wheel scrolling only on eligible wide, fine-pointer screens. Touch scrolling remains native. Motion cleanup removes the instance and restores the static scene on media changes and page exit.
- Section navigation refreshes pin spacing before resolving its destination. It accounts for the page's scroll padding, updates the hash and moves keyboard focus to the destination. Initial hash navigation is resolved again after fonts and pin layout are ready.
- Valid legacy product links such as `product.html?flavor=cafe-mocha` redirect to the corresponding native archived route. This keeps formulation, imagery, metadata and FAQ copy on the same product page.
- The light slider remains independent of the optional scroll-animation module. Packaging inspection uses a native dialog with direct image links as its fallback; closing the dialog restores focus to its opener.
- No external runtime image, font, tracking or API service is required. The pouch remains a two-dimensional image layer; this implementation does not require video generation or a fabricated 3D model.

## Artwork provenance

The current front pack comes from the user-supplied Belgian Chocolate image. Its untouched original and social-preview copy are retained, alongside 640 px and 1024 px transparent WebP derivatives for the website. The cutout was prepared with the built-in image-generation tool; it is not pixel-identical to the original background-bearing image. The visible branding, flavour, net quantity and concept disclosure were checked at both delivery sizes.

See [WPC artwork and preparation record](WPC_ASSETS.md) for filenames, dimensions, checksums, the edit prompt and asset QA. [The earlier asset record](ASSETS.md) documents the retained campaign foil, brand assets, fonts and historical packaging. The current WPC record supersedes the earlier featured-pack mapping; archived and draft artwork remains separate.

## Verification for this revision

Completed checks:

- Both V1 and V2 production builds, including all three retained opening-study builds, pass.
- All 10 Node unit tests pass, including the current WPC formulation, removal of its old back label, preserved archive routes, base-path handling and retained-draft validation.
- Production hosting checks pass with the versioned repository prefix. Validation covered four draft documents, 293 HTML/CSS references, 80 local files, 18 local destinations and 309 browser requests.

Browser checks pass at 1440, 768, 390 and 320 px widths, with additional 1024 px layout coverage. An early keyboard-navigation issue found during testing was fixed and its four viewport cases rerun successfully. Scroll reversibility also passed its focused reruns with matrix tolerances for both translation and scale. Coverage includes accessibility checks, product/image/metadata routes, packaging dialog and focus restoration, reduced motion, blocked animation, no JavaScript, and readable short-screen fallbacks at 390×600 and 1280×720. No failures remain from the completed checks.

Visual review inspected the opening and both scroll chapters on desktop, tablet and phones, plus the product and packaging sections. The production preview reported no page errors or horizontal overflow at those four primary sizes.

No new Lighthouse score or physical-device performance result is claimed.

## Product information and metadata

This remains a concept showcase. WPC, Belgian Chocolate and the 500 g pack are grounded in the user's instruction and supplied artwork. Nutrition, full ingredients, serving instructions, prices, stock and launch dates have not been invented. The supplied concept disclosure is retained.

Static and client-rendered product metadata use the same per-product titles and descriptions. The current product is identified as whey protein concentrate; archived concepts retain their earlier blend identity. Existing contact routes, noindex policy, TRAYN-domain canonicals and Organization metadata remain. No checkout, Product/Offer markup or review claims have been added.

## Hosting and publishing

The root repository workflow, `.github/workflows/pages.yml`, builds V1 and V2, includes the V2 opening studies, and assembles them with the root chooser into one Pages artifact. Pushes to `main` and manual workflow runs deploy that artifact.

The configured Pages destinations are:

- [Version chooser](https://acoaria4.github.io/trayn-nutrition-prototypes/)
- [V2 — Under Tension](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/)
- [Compare the three opening studies](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/)
- [The Quiet Before](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/quiet.html), [Under Tension study](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/tension.html), and [The Flavour Study](https://acoaria4.github.io/trayn-nutrition-prototypes/v2/drafts/flavour.html)

The GitHub Actions deployment record identifies the commit currently published at these locations.
