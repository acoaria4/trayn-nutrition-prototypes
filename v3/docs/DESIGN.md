# V3 — Slipstream: complete showcase

Purpose: introduce the Belgian Chocolate WPC packaging concept, express the TRAYN mindset, and let visitors inspect the pack and read the supplied label. Shopify, sales and checkout remain deferred. V2 is unchanged. The current V3 iteration is published on Sites; later edits require a new publication request.

## Art direction

Black foil and a single continuous red/silver sweep come from the pouch itself. Remove the rectangular inspection frame and the separate rotated foreground foil rectangle: neither belongs to the physical product. Use one full-bleed foil surface, with an edge mask where it meets the black page. Clip the existing front/back images to their actual pouch silhouettes using native SVG masks; do not fabricate a 3D model.

Palette: foil black `#090909`, graphite `#151313`, paper silver `#f5f4f0`, brushed silver `#c8c4c0`, muted silver `#979391`, packaging red `#f82030`. Barlow Condensed 800 carries display headlines; Manrope carries navigation, reading and label data. Retain the existing easing token.

## Page and motion score

| Sequence | Content | Motion purpose and behaviour |
| --- | --- | --- |
| 01 / Opening | FUEL YOUR POTENTIAL; pouch and scroll invitation | The product is the lead object. The headline stays legible while the pouch moves to introduce the flavour. |
| 02 / Flavour | Belgian Chocolate; WPC; 500 g | Same hero stage, a delayed light sweep after the pouch has moved. Exactly 2,040 px of scroll on every supported viewport. Short landscape and reduced motion use normal flow. |
| 03 / Mindset | GET BUILT; built for those who show up | The red words travel in opposite directions and settle into a typographic poster as the section enters. No pouch or pin. Reading copy remains stationary. |
| 04 / Packaging | A closer look; front, back, label inspection | A macro crop of the actual red/silver pouch artwork pulls back to the complete pack on black. No lateral product travel or rotation. Front/back controls settle the reveal for immediate inspection. Native accessible inspection works by touch and keyboard. |
| 05 / Product | Readable nutrition, ingredients, usage and storage | Three contiguous slices of the supplied back-label artwork unfold and square into a single flat reference. Red corner markers follow the selected information tab. Reading panels and printed values never transform or count up. All panels remain available without JavaScript. |
| 06 / Questions | Four useful questions about the concept and label | Dividing rules extend as rows enter; the visitor controls the rest. Open rows activate a red edge and plus-to-minus feedback, with a selected-question index on desktop. Native details use a 200 ms interruptible expansion, with immediate keyboard/reduced-motion state changes. Mobile retains feedback within each row. |
| Contact | LET’S TALK; email; original label and version comparison | Two red/silver strokes converge into the email underline. The arrow makes a short outward-and-return gesture. Headline and email remain stationary. The link settles the decorative sequence immediately on focus or touch. |

Persistent header: Our Story / The Packaging / The Product / Questions / Contact. Use its measured height for all offsets. Mobile uses a native details navigation menu with a readable no-JavaScript fallback. No snap scrolling or wheel interception.

The hero is the only pinned sequence. All later sections use content height on desktop and phones. Typography and macro reveal scrub reversibly through normal scrolling; reduced-motion and no-JavaScript views show the settled poster and complete pouch.

Motion is explanatory marketing motion plus state feedback. Existing GSAP/ScrollTrigger handles scroll-linked transforms and opacity; native CSS/WAAPI handles controls. Keyboard actions are immediate, reduced motion removes scrubbed movement and pinning, pointer effects require a fine hover-capable pointer. Stop decorative layers clear of text and controls.

## Verification

Exercise desktop, laptop, tablet, phone and compact phone; include WebKit. Check hero fit and its unchanged 2,040 px distance, the absence of another pin, opposing typography travel, reversible macro reveal, the absence of hard image edges/frame, anchor offsets, mobile navigation, front/back state, inspector focus/rapid reopening, label-tab keyboard behaviour, FAQ interruption, reduced-motion changes, no-JavaScript reading and static builds under a version prefix. Use only the supplied back-label transcription, clearly distinguished from approved retail data.

## Implemented and checked — 15 October 2026

The complete page and inspector are available locally at `http://127.0.0.1:4175/` and publicly at `https://trayn-nutrition-v2.blondridge1.chatgpt.site/v3/`. The publication updated only V3; the other collection files were preserved. V2's main, template, hero CSS and interaction source fingerprints are unchanged.

Syntax and unit checks passed. The repository-prefixed `/trayn-nutrition-prototypes/v3/` static build passed all 45 HTML/CSS references across 17 output files. All 66 browser checks across six Chrome profiles and all 33 checks across three WebKit phone profiles passed, covering keyboard controls, reduced motion, no-JavaScript content, source-backed label tabs, inspector zoom/focus/rapid reopening, reversible art, native anchor offsets and viewport-height changes.

The hero still pins a wrapper around its dynamically sized surface so WebKit cannot freeze the surface at its previous height; direct anchors refresh pin measurements before alignment. The hero timeline, hero/GET BUILT/packaging markup, their CSS and the chapter-motion module are unchanged by the lower-section iteration. The second 1,800 px pinned sequence and its shared product/ribbon stage remain removed. The back-label transcription remains unchanged. Existing generic pouch/question/ribbon drift has been removed from the lower sections in favour of the distinct sequences above; no extra assets or libraries were added.
