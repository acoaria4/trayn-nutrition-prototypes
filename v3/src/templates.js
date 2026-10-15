import { featuredProduct } from "./data/product.js";

const pack = (kind = "front", priority = false) => {
  const path =
    kind === "front" ? featuredProduct.image : featuredProduct.backImage;
  return `<img data-study-${kind} ${kind === "back" ? 'hidden aria-hidden="true"' : ""} src="${path}-1024.webp" width="1024" height="1536" alt="TRAYN Belgian Chocolate 500 g ${kind} pouch concept" decoding="async" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
};

// The long sweep comes from the pouch's red/silver artwork; it is an original
// vector scene element rather than a cropped corner ornament.
const stream = (
  className,
) => `<svg class="${className}" viewBox="0 0 1440 900" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
  <path d="M-180 985C420 940 1015 615 1570-240L1580-100C1045 710 455 1040-180 1050Z" fill="#f82030"/>
  <path d="M-180 1070C500 1015 1110 705 1580-50L1585-8C1100 760 490 1050-180 1090Z" fill="#bcb9b5"/>
  <path d="M-180 965C450 895 1050 560 1560-300" stroke="#f82030" stroke-width="3"/>
</svg>`;

const art = (priority = false) =>
  `<figure class="chapter-art"><img class="mobile-foil" src="/images/campaign/${priority ? "tension-hero" : "tension-detail"}-960.webp" width="960" height="540" alt="" aria-hidden="true">${stream("mobile-stream")}<div class="mobile-product">${pack("front", priority)}${pack("back")}</div></figure>`;

export function slipstreamDocument({ v2Site = "../v2/" } = {}) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#090909"><title>TRAYN V3 — Slipstream</title><link rel="preload" href="/fonts/barlow-800.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/src/styles.css"></head>
<body data-pack-view="front"><a class="study-skip" href="#packaging">Skip to the packaging</a>
<header class="study-header"><a href="#mindset" data-study-jump="0" aria-label="TRAYN V3 home"><img src="/images/brand/trayn-logo-256.webp" width="740" height="440" alt="TRAYN Nutrition"></a><nav aria-label="V3 navigation"><a href="#mindset" data-study-jump="0">The Mindset</a><a href="#packaging" data-study-jump="0.88">The Packaging</a><a href="${v2Site}">V2 site <span aria-hidden="true">↗</span></a></nav></header>
<main><div class="study-story">
  <div class="study-stage">
    <div class="foil-plane foil-far" aria-hidden="true"><img src="/images/campaign/tension-hero-1672.webp" width="1672" height="941" alt=""></div>
    <div class="foil-plane foil-near" aria-hidden="true"><img src="/images/campaign/tension-detail-1672.webp" width="1672" height="941" alt=""></div>
    ${stream("stream-far")}
    <div class="study-frame" aria-hidden="true"></div>
    <div class="study-product"><div class="product-pose">${pack("front", true)}${pack("back")}</div></div>
    ${stream("stream-near")}
    <div class="study-copy-shade" aria-hidden="true"></div>
    <div class="scene-progress" aria-hidden="true"><span>THE MINDSET</span><div><i></i></div><span>THE PACKAGING</span></div>
  </div>
  <section class="study-chapter chapter-mindset" id="mindset" aria-labelledby="study-mindset-heading">
    <div class="chapter-heading"><p class="eyebrow">03 / The TRAYN mindset</p><h1 id="study-mindset-heading">GET<br>BUILT.</h1></div>
    ${art(true)}
    <div class="chapter-copy"><h2>Built for those<br>who show up.</h2><p>Discipline. Grit. The drive to show up every day. That’s the spirit behind TRAYN.</p><a href="#packaging" data-study-jump="0.88" class="study-link">Explore the pack <span aria-hidden="true">↓</span></a></div>
  </section>
  <section class="study-chapter chapter-packaging" id="packaging" aria-labelledby="study-packaging-heading">
    <div class="chapter-heading"><p class="eyebrow">04 / The packaging</p><h2 id="study-packaging-heading">A CLOSER<br>LOOK.</h2></div>
    ${art()}
    <div class="chapter-copy"><p>Belgian Chocolate.<br>Whey protein concentrate. 500 g.</p><div class="study-views" role="group" aria-label="Pouch view"><a href="${featuredProduct.image}-1024.webp" data-study-view="front" aria-current="true">Front</a><a href="${featuredProduct.backImage}-1024.webp" data-study-view="back" aria-current="false">Back</a></div><a class="study-link" data-study-inspect href="${featuredProduct.image}-1024.webp" target="_blank" rel="noopener noreferrer">Open the pack up close <span aria-hidden="true">↗</span></a><p class="small-note">Front and back pouch visualisations. Packaging concept. Not for sale.</p></div>
  </section>
</div>
<section class="study-end"><p class="eyebrow">Belgian Chocolate / TRAYN Nutrition</p><h2>THE DETAILS,<br>CLEARLY.</h2><div><a class="study-link" href="${v2Site}#blend">Read the product information <span aria-hidden="true">↗</span></a><a class="study-link" href="${featuredProduct.backLabelPdf}" target="_blank" rel="noopener noreferrer">Read the original back label <span aria-hidden="true">↗</span></a></div></section>
</main><footer class="study-footer"><a href="${v2Site}">Back to V2 <span aria-hidden="true">↗</span></a><span>TRAYN Nutrition · Packaging concept</span></footer>
<script type="module" src="/src/main.js"></script></body></html>`;
}
