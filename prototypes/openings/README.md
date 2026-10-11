# TRAYN — Three opening studies

Three isolated, working creative directions. Each contains an opening, a first transition and a product interaction, with dedicated responsive composition. The production site is not imported by or modified for these studies.

**Decision:** Under Tension was selected for the main-site rebuild. These three drafts remain preserved independently so the original comparison can still be reviewed and shared. The main site's evolution does not overwrite this study.

## Run

From this directory:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4186/. Use the bottom picker or **1 / 2 / 3**, **left / right arrows**, and **R** to replay. The top bar switches between desktop and a 390 px phone preview; the diagonal arrow opens the selected experience directly. **Reduce motion** removes entrance and scroll animation while preserving interactions. System reduced-motion preferences are also respected. On an actual phone, the design uses the available screen width.

```sh
npm run build
npm run preview
```

The independent production preview runs at http://127.0.0.1:4187/. All paths are relative so its `dist/` can be served from a subdirectory. No deployment is triggered by this prototype package.

## Shared deployment

From the repository root, install both packages with `npm ci` and `npm ci --prefix prototypes/openings`, then run `npm run build`. The root build copies this package's output and font licences into `dist/drafts/`; the GitHub Pages workflow uploads that together with the main site.

| Path beneath the deployed site | Shareable view                                            |
| ------------------------------ | --------------------------------------------------------- |
| `drafts/`                      | All three directions with the comparison picker           |
| `drafts/?v=2`                  | Comparison opened on the selected Under Tension direction |
| `drafts/?v=2&viewport=mobile`  | Under Tension comparison in its phone viewport            |
| `drafts/quiet.html`            | The Quiet Before on its own                               |
| `drafts/tension.html`          | Under Tension on its own                                  |
| `drafts/flavour.html`          | The Flavour Study on its own                              |

For example, a repository deployment uses `https://OWNER.github.io/REPOSITORY/drafts/`. Relative assets, iframe navigation and packaging download aliases keep working beneath this additional directory. The root `npm run test:hosting:static -- --base=/REPOSITORY/` checks the combined output without a browser; `npm run test:hosting` also provides durable browser coverage when run with the matching base.

Commit this package's source, lockfile, licences and all six native campaign PNGs. Its generated HTML pages, `dist/`, `node_modules/` and review captures stay ignored. The alternative directions remain source-controlled rather than being retained only as screenshots.

## The directions

| Direction         | Composition and character                                                                                 | Interaction                                                       | Tradeoff                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| The Quiet Before  | Full-bleed preparation scene, spacious type, slate and olive, followed by a pale editorial product spread | Scene parallax, front/back pack inspection and a full-size dialog | Strong human context; the product arrives in the second scene                      |
| Under Tension     | Central pack, wide poster typography, sculptural black/red foil, close material study                     | User-controlled light sweep and product motion                    | Strong physical drama; a final version would benefit from custom product rendering |
| The Flavour Study | Cream and espresso, expressive serif type, sculptural food still life, asymmetric product stamp           | Chocolate/Vanilla selection and packaging inspection              | Strong appetite and warmth; moves furthest from the current sports aesthetic       |

All product details remain concepts. The supplied logo and packaging are used as original files. Generated imagery is campaign art, not evidence of actual ingredients, finished products or an athlete endorsement.

## Implementation

- `studio.js` and `picker.css`: isolated comparison harness. Picker styling follows the installed prototype skill; the experience switches immediately, with a small selection indicator transition.
- `quiet.js/css`, `tension.js/css`, `flavour.js/css`: independent directions and scoped motion/interaction lifecycles.
- `experience.js`: shared GSAP/ScrollTrigger setup, one Lenis instance on desktop, native touch scrolling, reduced-motion handling and cleanup.
- `render-static.mjs`: generates three real HTML pages with content and CSS before the build. JavaScript enhances those pages.
- `assets/`: six original generated PNGs, optimized WebP derivatives for delivery, supplied packaging/logo copies and self-hosted fonts.
- `licenses/`: OFL licences for Manrope and Instrument Serif.

Lenis was selected over Locomotive because the two-scene studies need a small shared scroll layer with direct GSAP integration. Three.js was considered but not used: the available approved pack is a two-dimensional asset. The Tension study uses layered imagery and controllable lighting rather than presenting a fabricated model as a faithful product render.

## Asset provenance

The six campaign images were generated separately with the built-in image generation tool, saved under Codex's generated-images directory, inspected, then copied into this workspace. They contain no generated logos or packaging typography. Their native PNG originals remain in the repository. The deployed drafts use optimized WebP derivatives of those same images, preserving composition and dimensions while reducing image transfer size.

| Files                                    | Prompt direction                                                                                                                                                                                                                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `quiet-hero.png`, `quiet-detail.png`     | A dawn concrete training room with an adult preparing an olive lifting strap on a leather bench, right-side subject and generous left negative space; a separate tactile closeup of hands and strap in the same natural slate/olive light. No text, logos or endorsement framing. |
| `tension-hero.png`, `tension-detail.png` | Black metallic foil, hard grazing silver light and one sculptural red sweep, with a calm central area for the exact product image; a separate close study of folded vermilion material. No text or invented packaging.                                                            |
| `flavour-hero.png`, `flavour-detail.png` | Sculptural chocolate ribbon, cocoa and chocolate on warm almond paper; a matching ivory cream ribbon and vanilla-pod still life. Original editorial food imagery, no text or branding.                                                                                            |

Logo and front/back Belgian Chocolate packaging come from this project's supplied public assets; Vanilla uses its existing future-concept artwork. These are not altered by the prototypes. Font sources are the official Google Fonts `ofl/manrope` and `ofl/instrumentserif` directories, converted to WOFF2 for local delivery. Original font source files and licences are retained.

Applied skills: prototype, build-awwwards-quality-sites, editorial-tech, imagegen-frontend-web, imagegen, cinematic-gsap-lenis-motion-system, and optimize-web-animations. Each direction remains separate after selection; Under Tension supplies the creative direction for the main rebuild.

Review results and limits are recorded in [VERIFICATION.md](VERIFICATION.md). Desktop and mobile reference screenshots are saved locally in the ignored `captures/` directory.
