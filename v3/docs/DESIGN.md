# V3 — Slipstream: complete showcase

Purpose: introduce the Belgian Chocolate WPC packaging concept, express the TRAYN mindset, and let visitors inspect the pack and read the supplied label. Shopify, sales and checkout remain deferred. V2 is unchanged. The red product section and completed question dividers are local only. The Sites deployment record describes the earlier published snapshot; a new publication request is required to update it.

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
| 05 / Product | Readable nutrition, ingredients, usage and storage | Packaging red replaces the white surface. A black cover retracts horizontally as the section enters and clears early, over a shorter interval on phones. Focus/touch clears it immediately. Black reading type and a white oversized PACK headline provide contrast; no white table panels remain. Values never transform or count up. The folding image is removed, with source PDF and all reading content retained. |
| 06 / Questions | Four useful questions about the concept and label | All five dividing rules extend as they enter, including the final rule below the last question. Its trigger follows answer expansion and completes while visible. Open rows retain red edges and plus-to-minus feedback. The extra selected index and captions are removed. Native details use a 200 ms interruptible expansion, with immediate keyboard/reduced-motion state changes. |
| Contact | LET’S TALK; email; original label and version comparison | Two red/silver strokes converge into the email underline. The arrow makes a short outward-and-return gesture. Headline and email remain stationary. The link settles the decorative sequence immediately on focus or touch. |

Persistent header: Our Story / The Packaging / The Product / Questions / Contact. Use its measured height for all offsets. Mobile uses a native details navigation menu with a readable no-JavaScript fallback. No snap scrolling or wheel interception.

The hero is the only pinned sequence. All later sections use content height on desktop and phones. Typography and macro reveal scrub reversibly through normal scrolling; reduced-motion and no-JavaScript views show the settled poster and complete pouch.

Motion is explanatory marketing motion plus state feedback. Existing GSAP/ScrollTrigger handles scroll-linked transforms and opacity; native CSS/WAAPI handles controls. Keyboard actions are immediate, reduced motion removes scrubbed movement and pinning, pointer effects require a fine hover-capable pointer. Stop decorative layers clear of text and controls.

## Verification

Exercise desktop, laptop, tablet, phone and compact phone; include WebKit. Check hero fit and its unchanged 2,040 px distance, the absence of another pin, opposing typography travel, reversible macro reveal, the absence of hard image edges/frame, anchor offsets, mobile navigation, front/back state, inspector focus/rapid reopening, label-tab keyboard behaviour, FAQ interruption, reduced-motion changes, no-JavaScript reading and static builds under a version prefix. Use only the supplied back-label transcription, clearly distinguished from approved retail data.

## Implemented and checked — 15 October 2026

The current red product and question-rule revision is available locally at `http://127.0.0.1:4175/` and is unpublished. The preceding snapshot remains public at `https://trayn-nutrition-v2.blondridge1.chatgpt.site/v3/`; see the deployment record. The current work leaves that collection unchanged. V2's main, template, hero CSS and interaction source fingerprints are unchanged.

Syntax and unit checks passed. The repository-prefixed `/trayn-nutrition-prototypes/v3/` static build passed all 44 HTML/CSS references across 17 output files. All 66 browser checks across six Chrome profiles and all 33 checks across three WebKit phone profiles passed, covering keyboard controls, reduced motion, no-JavaScript content, source-backed label tabs, inspector zoom/focus/rapid reopening, the reversible red entry cover, contrast across all information panels, all five question dividers before/after expansion, native anchor offsets and viewport-height changes.

The hero still pins a wrapper around its dynamically sized surface so WebKit cannot freeze the surface at its previous height; direct anchors refresh pin measurements before alignment. The hero timeline, hero/GET BUILT/packaging markup, their CSS and the chapter-motion module are unchanged by the lower-section iteration. The second 1,800 px pinned sequence and its shared product/ribbon stage remain removed. The back-label transcription remains unchanged. Existing generic pouch/question/ribbon drift has been removed from the lower sections in favour of the distinct sequences above; no extra assets or libraries were added.
