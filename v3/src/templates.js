import { featuredProduct } from "./data/product.js";
import { wpcLabelArtwork as label } from "./data/label-artwork.js";

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const arrow = '<span aria-hidden="true">↗</span>';
const front = `${featuredProduct.image}-1024.webp`;
const back = `${featuredProduct.backImage}-1024.webp`;
const pouch = (kind = "front", priority = false, interactive = true) =>
  `<img class="pouch-image pouch-${kind}" ${interactive ? `data-study-${kind}` : ""} ${interactive && kind === "back" ? 'hidden aria-hidden="true"' : ""} src="${kind === "front" ? front : back}" width="1024" height="1536" alt="TRAYN Belgian Chocolate 500 g ${kind} pouch concept" decoding="async" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

const masks = `<svg class="pouch-masks" width="0" height="0" aria-hidden="true"><defs>
<clipPath id="pouch-front-mask" clipPathUnits="objectBoundingBox"><path d="M.115 .058 C.101 .058 .089 .063 .086 .078 L.079 .153 C.076 .195 .087 .30 .092 .40 L.123 .876 C.124 .898 .129 .908 .148 .914 Q.50 .942 .848 .917 C.869 .914 .879 .901 .88 .881 L.915 .20 L.918 .081 C.919 .065 .909 .057 .893 .057 Z"/></clipPath>
<clipPath id="pouch-back-mask" clipPathUnits="objectBoundingBox"><path d="M.095 .044 C.068 .046 .057 .054 .055 .077 L.05 .18 L.075 .894 C.077 .926 .086 .942 .12 .946 Q.50 .978 .882 .947 C.914 .944 .923 .93 .923 .909 L.944 .17 L.943 .077 C.943 .053 .926 .044 .903 .044 Z"/></clipPath>
</defs></svg>`;

const stream = (
  className,
) => `<svg class="${className}" viewBox="0 0 1440 900" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
<path d="M-180 985C420 940 1015 615 1570-240L1580-100C1045 710 455 1040-180 1050Z" fill="#f82030"/>
<path d="M-180 1070C500 1015 1110 705 1580-50L1585-8C1100 760 490 1050-180 1090Z" fill="#c8c4c0"/>
<path d="M-180 965C450 895 1050 560 1560-300" stroke="#f82030" stroke-width="3"/>
</svg>`;
const art = (priority = false) =>
  `<figure class="chapter-art"><img class="mobile-foil" src="/images/campaign/tension-hero-960.webp" width="960" height="540" alt="" aria-hidden="true">${stream("mobile-stream")}<div class="mobile-product"><div class="pouch-pair">${pouch("front", priority)}${pouch("back")}</div></div></figure>`;

const navigation = () =>
  `<a href="#mindset" data-study-jump="0">Our Story</a><a href="#packaging" data-study-jump="0.88">The Packaging</a><a href="#product">The Product</a><a href="#questions">Questions</a><a href="#contact">Contact</a>`;
const table = (rows, caption) =>
  `<div class="table-scroll" tabindex="0" role="region" aria-label="${caption}"><table><caption>${caption}</caption><thead><tr><th scope="col">Nutrient</th><th scope="col">Unit</th><th scope="col">Per 100 g</th><th scope="col">Per serving<br>33 g</th></tr></thead><tbody>${rows.map(([name, unit, per100, serving]) => `<tr><th scope="row">${escape(name)}</th><td>${unit}</td><td>${per100}</td><td>${serving}</td></tr>`).join("")}</tbody></table></div>`;

function productInformation() {
  return `<section class="product-section section-shell" id="product" tabindex="-1" aria-labelledby="product-heading">
<div class="product-intro"><p class="eyebrow"><span>05</span> / The product</p><h2 id="product-heading">KNOW<br>YOUR <span>PACK.</span></h2><p class="reading-copy">Belgian Chocolate whey protein concentrate. The information below is transcribed from the supplied back-label artwork.</p><div class="product-mark" aria-hidden="true"><span>500<span>g</span></span><div class="detail-pouch">${pouch("front", false, false)}</div></div><p class="source-note">Packaging artwork, not an approved retail specification. Values and wording are retained as printed.</p><a class="study-link" href="${featuredProduct.backLabelPdf}" target="_blank" rel="noopener noreferrer">Read the original back label ${arrow}</a></div>
<div class="label-reader" data-label-tabs>
<nav class="label-tabs" aria-label="Product information"><a href="#label-nutrition" data-label-tab>Nutrition</a><a href="#label-ingredients" data-label-tab>Ingredients</a><a href="#label-usage" data-label-tab>How to Use</a><i class="tab-indicator" aria-hidden="true"></i></nav>
<section class="label-panel" id="label-nutrition" data-label-panel><h3>Nutrition</h3><p class="label-serving">${label.serving}<br>${label.servingsPerContainer} servings per container, as printed.</p>${table(label.nutrition, "Nutrition facts · approximate values on supplied label")}<details class="amino-details"><summary>Full amino acid profile <span aria-hidden="true">+</span></summary>${label.aminoAcids.map((group) => table(group.rows, group.name)).join("")}</details></section>
<section class="label-panel" id="label-ingredients" data-label-panel><h3>Ingredients</h3><ol class="ingredients-list">${label.ingredients.map((item, index) => `<li><span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>${escape(item)}</li>`).join("")}</ol><p class="allergen"><span aria-hidden="true">!</span> Contains milk.</p><ul class="label-notes">${label.ingredientNotes.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></section>
<section class="label-panel" id="label-usage" data-label-panel><h3>How to use</h3><p class="label-serving">Directions as printed on the supplied label.</p><ol class="usage-steps">${label.preparation.map(([name, description], i) => `<li><span aria-hidden="true">0${i + 1}</span><div><h4>${name}</h4><p>${escape(description)}</p></div></li>`).join("")}</ol><h4>Recommended usage on the label</h4><p>${label.recommendedUsage}</p><h4>Storage</h4><p>${label.storage}</p><details class="amino-details"><summary>Read all usage notes <span aria-hidden="true">+</span></summary><ul class="label-notes">${label.usageNotes.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></details></section>
</div></section>`;
}

const faqs = [
  [
    "What is TRAYN showcasing?",
    "A 500 g Belgian Chocolate whey protein concentrate packaging concept, and the mindset behind TRAYN Nutrition. The front and back pouch images are visualisations.",
  ],
  [
    "Can I buy it here?",
    "This is a product showcase. Prices, availability and a launch date have not been announced here. For product enquiries, contact TRAYN using the email below.",
  ],
  [
    "Where can I read the full label?",
    'Use the packaging inspector’s Back Label view, or <a href="' +
      featuredProduct.backLabelPdf +
      '" target="_blank" rel="noopener noreferrer">open the original back-label PDF</a>. The product section also presents a readable transcription of the supplied artwork.',
  ],
  [
    "Does it contain allergens?",
    "The supplied label states: Contains Milk. Read the complete ingredients and usage notes in the product section and original artwork.",
  ],
];

function inspector() {
  return `<dialog class="pack-inspector" id="pack-inspector" aria-labelledby="inspector-title"><div class="inspector-toolbar"><div><p class="eyebrow">The packaging</p><h2 id="inspector-title">A closer look.</h2></div><button class="inspector-close" type="button" aria-label="Close packaging inspector">Close <span aria-hidden="true">×</span></button></div><div class="inspector-options"><div role="group" aria-label="Inspector view"><button type="button" data-inspector-view="front" aria-pressed="true">Front</button><button type="button" data-inspector-view="back" aria-pressed="false">Back</button><button type="button" data-inspector-view="label" aria-pressed="false">Back Label</button></div><button type="button" class="zoom-toggle" aria-pressed="false">Zoom In <span aria-hidden="true">+</span></button></div><div class="inspector-canvas" tabindex="0" role="region" aria-label="Packaging image"><img data-inspector-image width="1024" height="1536" alt=""></div><div class="inspector-bottom"><p data-inspector-caption aria-live="polite">Front pouch visualisation. Packaging concept.</p><a class="study-link" href="${featuredProduct.backLabelPdf}" target="_blank" rel="noopener noreferrer">Original label PDF ${arrow}</a></div></dialog>`;
}

export function slipstreamDocument({ v2Site = "../v2/" } = {}) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#090909"><meta name="description" content="Fuel your potential. Explore the TRAYN mindset, Belgian Chocolate WPC pouch and the supplied product label."><title>TRAYN Nutrition — Fuel Your Potential · V3</title><link rel="icon" href="/images/brand/favicon.png" type="image/png"><link rel="preload" href="/fonts/barlow-800.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/src/styles.css"></head>
<body data-pack-view="front">${masks}<a class="study-skip" href="#product">Skip to product information</a>
<header class="study-header"><a href="#top" aria-label="TRAYN home"><img src="/images/brand/trayn-logo-256.webp" width="740" height="440" alt="TRAYN Nutrition"></a><nav class="desktop-navigation" aria-label="Main navigation">${navigation()}</nav><details class="site-menu"><summary>Menu <span aria-hidden="true">+</span></summary><nav aria-label="Mobile navigation">${navigation()}</nav></details></header>
<main id="top">
<section class="hero-story" aria-label="Fuel your potential">
 <div class="hero-pin"><div class="hero-scene">
  <img class="hero-foil" src="/images/campaign/tension-hero-1672.webp" srcset="/images/campaign/tension-hero-960.webp 960w, /images/campaign/tension-hero-1672.webp 1672w" sizes="100vw" width="1672" height="941" alt="" fetchpriority="high">
  ${stream("hero-stream")}
  <div class="hero-opening"><p class="eyebrow"><span>01</span> / TRAYN Nutrition</p><h1>FUEL YOUR<br><span>POTENTIAL.</span></h1><p class="hero-intro">For the work you put in.<br>And the person you’re building.</p></div><a href="#mindset" class="hero-scroll" data-study-jump="0"><span>Scroll to explore</span><span aria-hidden="true">↓</span></a>
  <div class="hero-product"><div class="hero-product-pose">${pouch("front", true, false)}<div class="hero-light" aria-hidden="true"></div></div></div>
  <article class="hero-flavour"><p class="eyebrow"><span>02</span> / The flavour</p><h2>BELGIAN<br>CHOCOLATE.</h2><p>Whey protein concentrate.</p><div class="hero-spec"><span>500 <small>g</small></span><span>Net quantity,<br>as shown on the pack.</span></div><a class="study-link" href="#packaging" data-study-jump="0.88">Explore the pack ${arrow}</a></article>
  <div class="hero-bottom"><span>Belgian Chocolate / WPC</span><div><i></i></div><span>Packaging concept · Not for sale</span></div>
 </div></div>
</section>
<div class="study-story">
 <div class="study-stage">
  <div class="foil-plane foil-far" aria-hidden="true"><img src="/images/campaign/tension-hero-1672.webp" width="1672" height="941" alt=""></div>
  ${stream("stream-far")}
  <div class="study-product"><div class="product-pose">${pouch("front")}${pouch("back")}</div></div>
  ${stream("stream-near")}
  <div class="study-copy-shade" aria-hidden="true"></div>
  <div class="scene-progress" aria-hidden="true"><span>THE MINDSET</span><div><i></i></div><span>THE PACKAGING</span></div>
 </div>
 <section class="study-chapter chapter-mindset" id="mindset" aria-labelledby="study-mindset-heading">
  <div class="chapter-heading"><p class="eyebrow"><span>03</span> / The TRAYN mindset</p><h2 id="study-mindset-heading">GET<br>BUILT.</h2></div>
  ${art()}
  <div class="chapter-copy"><h3>Built for those<br>who show up.</h3><p>Discipline. Grit. The drive to show up every day. That’s the spirit behind TRAYN.</p><a href="#packaging" data-study-jump="0.88" class="study-link">Meet the pack <span aria-hidden="true">↓</span></a></div>
 </section>
 <section class="study-chapter chapter-packaging" id="packaging" aria-labelledby="study-packaging-heading">
  <div class="chapter-heading"><p class="eyebrow"><span>04</span> / The packaging</p><h2 id="study-packaging-heading">A CLOSER<br>LOOK.</h2></div>
  ${art()}
  <div class="chapter-copy"><p>Belgian Chocolate.<br>Whey protein concentrate. 500 g.</p><div class="study-views" role="group" aria-label="Pouch view"><a href="${front}" data-study-view="front" aria-current="true">Front</a><a href="${back}" data-study-view="back" aria-current="false">Back</a></div><a class="study-link" data-study-inspect href="${front}">Inspect the packaging ${arrow}</a><a class="original-label" href="${featuredProduct.backLabelPdf}" target="_blank" rel="noopener noreferrer">Read the original back label ${arrow}</a><p class="small-note">Front and back pouch visualisations. Packaging concept. Not for sale.</p></div>
 </section>
</div>
${productInformation()}
<section class="questions-section section-shell" id="questions" aria-labelledby="questions-heading"><div class="questions-heading"><p class="eyebrow"><span>06</span> / Questions</p><h2 id="questions-heading">GOOD<br>QUESTIONS.</h2><span class="question-art" aria-hidden="true">?</span></div><div class="faq-list">${faqs.map(([question, answer], i) => `<details><summary><span class="question-number" aria-hidden="true">0${i + 1}</span><h3>${question}</h3><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${answer}</p></div></details>`).join("")}</div></section>
<section class="contact-section" id="contact" aria-labelledby="contact-heading"><div class="contact-top"><p class="eyebrow">Contact TRAYN</p><p>For product enquiries.<br>For what comes next.</p></div><h2 id="contact-heading">LET’S <span>TALK.</span></h2><a class="contact-email" href="mailto:traynnutrition@gmail.com"><span>traynnutrition@gmail.com</span><span class="contact-arrow" aria-hidden="true">↗</span></a><div class="contact-ribbon" aria-hidden="true">${stream("closing-stream")}</div><p class="contact-note">Fuel your potential. Keep showing up.</p></section>
</main>
<footer class="study-footer"><a href="#top" aria-label="TRAYN, back to top"><img src="/images/brand/trayn-logo-256.webp" width="740" height="440" alt="TRAYN Nutrition" loading="lazy"></a><p>© 2026 TRAYN Nutrition<br>Packaging concept. Not for sale.</p><a href="${v2Site}">Compare with V2 ${arrow}</a><a href="#top">Back to Top <span aria-hidden="true">↑</span></a></footer>
${inspector()}
<script type="module" src="/src/main.js"></script></body></html>`;
}
