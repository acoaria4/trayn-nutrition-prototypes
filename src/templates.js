import {
  products,
  featuredProduct,
  productPath,
  productUrl,
  brand,
} from "./data/products.js";

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const arrow = '<span aria-hidden="true">↗</span>';

export function productImage(
  product,
  { className = "", priority = false, back = false, interactive = false } = {},
) {
  const path = back ? product.backImage : product.image;
  const sizes =
    className === "hero-pouch"
      ? "(max-width: 360px) 242px, (max-width: 600px) 265px, (max-width: 800px) 380px, 465px"
      : interactive
        ? "(max-width: 600px) 280px, (max-width: 800px) 320px, 440px"
        : "(max-width: 600px) calc(100vw - 44px), (max-width: 1000px) 70vw, 650px";
  return `<img class="${className}" ${interactive ? "data-product-image" : ""} src="${path}-640.webp" srcset="${path}-640.webp 640w, ${path}-1024.webp 1024w" sizes="${sizes}" width="1024" height="1536" alt="TRAYN ${escapeHtml(product.flavor)} 500 g whey blend ${back ? "back-label" : "pouch"} concept; not for sale" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}

export function header() {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="header-inner">
    <a class="brand" href="/" aria-label="TRAYN Nutrition home"><img src="/images/brand/trayn-logo-256.webp" srcset="/images/brand/trayn-logo-256.webp 256w, /images/brand/trayn-logo.webp 740w" sizes="(max-width: 800px) 88px, 107px" alt="TRAYN Nutrition" width="740" height="440"></a>
    <nav class="main-nav" id="main-navigation" aria-label="Main navigation"><a href="/#blend">The blend</a><a href="/#flavors">Flavour concepts</a><a href="/#story">Our mindset</a><a href="/#contact">Contact</a></nav>
    <a class="header-cta" href="${productPath}">Explore TRAYN ${arrow}</a>
    <button class="menu-toggle" aria-controls="main-navigation" aria-expanded="false" aria-label="Open menu"><span data-menu-label>Menu</span><span class="menu-bars" aria-hidden="true"></span></button>
  </div></header>`;
}

export function footer() {
  return `<footer class="site-footer" id="contact"><div class="footer-top wrap">
    <div class="contact-intro"><p class="eyebrow">The next conversation</p><h2>LET’S TALK<br>TRAYN.</h2><a class="contact-email" href="mailto:${brand.email}">${brand.email} ${arrow}</a></div>
    <div class="footer-links"><p class="eyebrow">Get in touch</p><a href="tel:${brand.phone}">${brand.phoneDisplay}</a><a href="${brand.instagram}" target="_blank" rel="noopener noreferrer">Instagram ${arrow}</a><a href="/label-information.html">About the concepts ${arrow}</a><a href="/#blend">Explore the blend ${arrow}</a><a href="/drafts/">Compare the three drafts ${arrow}</a></div>
    <a class="back-top" href="#top" aria-label="Back to top"><span aria-hidden="true">↑</span><span>Back to top</span></a>
  </div><div class="footer-bottom wrap"><a href="/" aria-label="TRAYN Nutrition home"><img src="/images/brand/trayn-logo-256.webp" width="740" height="440" alt="TRAYN Nutrition" loading="lazy"></a><p>© 2026 TRAYN Nutrition</p><p>Packaging concepts. Not for sale.</p><a href="/label-information.html">Product information</a></div></footer>`;
}

export function packagingDialog() {
  return `<dialog data-lenis-prevent class="packaging-dialog" id="packaging-dialog" aria-labelledby="packaging-title"><div class="dialog-toolbar"><div><p class="eyebrow">A closer look</p><h2 id="packaging-title">Packaging concept</h2></div><button type="button" class="dialog-close" aria-label="Close packaging view">Close <span aria-hidden="true">×</span></button></div><div class="dialog-image-wrap"><img data-dialog-image width="1024" height="1536" alt="" data-deferred-image></div><p class="dialog-caption">Concept artwork. Packaging and product information are not final.</p></dialog>`;
}

function flavorLinks(selectedId = featuredProduct.id) {
  return products
    .map(
      (product) =>
        `<a href="${productUrl(product)}" class="flavor-option ${product.id === selectedId ? "is-active" : ""}" data-flavor="${product.id}" aria-current="${product.id === selectedId ? "true" : "false"}"><span class="flavor-swatch" style="--flavor-color:${product.color}" aria-hidden="true"></span><span>${escapeHtml(product.flavor)}</span><span class="flavor-choice" aria-hidden="true">${product.id === selectedId ? "↗" : "+"}</span></a>`,
    )
    .join("");
}

function specificationRows(product) {
  return `<dl class="spec-list"><div><dt>Blend</dt><dd>Whey concentrate + isolate</dd></div><div><dt>Flavour</dt><dd data-product-flavor>${escapeHtml(product.flavor)}</dd></div><div><dt>Net quantity</dt><dd>500 g <span>on concept pack</span></dd></div><div><dt>Allergen shown</dt><dd>Contains milk</dd></div></dl>`;
}

export function home() {
  return `<main id="main">
  <section class="hero tension-hero" aria-labelledby="hero-heading">
    <div class="tension-material" aria-hidden="true"><img src="/images/campaign/tension-hero-1672.webp" srcset="/images/campaign/tension-hero-960.webp 960w, /images/campaign/tension-hero-1672.webp 1672w" sizes="100vw" width="1672" height="941" alt="" fetchpriority="high"></div>
    <div class="tension-heading"><h1 id="hero-heading"><span>UNDER</span> <span>TENSION.</span></h1></div>
    <p class="tension-statement">Made for the work. Considered in every detail.</p>
    <div class="tension-stage"><span class="tension-word" aria-hidden="true">WHEY</span><div class="tension-pack">${productImage(featuredProduct, { className: "hero-pouch", priority: true })}<span class="tension-sheen" aria-hidden="true"></span></div></div>
    <div class="tension-hero-bottom">
      <p class="tension-product-note">Belgian Chocolate.<br>Concentrate + isolate.<span>500 g packaging concept. Not for sale.</span></p>
      <a class="tension-explore" href="#blend" aria-label="Discover the blend"><span>Closer to the detail</span><span aria-hidden="true">↓</span></a>
      <div class="tension-light-control" hidden><div class="tension-light-label"><label for="tension-light">Move the light</label><output for="tension-light">Centre</output></div><input type="range" id="tension-light" min="0" max="100" value="50" step="1" aria-valuetext="Light centred"><div class="tension-light-ticks" aria-hidden="true"><span>Left</span><span>Right</span></div></div>
    </div>
  </section>
  <section class="blend-section section-space wrap" id="blend" aria-labelledby="blend-heading">
    <div class="section-top"><p class="eyebrow">01 / Meet the blend</p><span class="section-caption">Two whey sources. One considered direction.</span></div>
    <div class="blend-layout"><figure class="detail-art"><img class="detail-foil" src="/images/campaign/tension-detail-1672.webp" srcset="/images/campaign/tension-detail-960.webp 960w, /images/campaign/tension-detail-1672.webp 1672w" sizes="(max-width: 800px) 100vw, 50vw" width="1672" height="941" alt="" loading="lazy" aria-hidden="true"><div class="detail-crop">${productImage(featuredProduct)}</div><figcaption><span>The Slipstream concept</span><a href="/images/products/belgian-chocolate-1024.webp" data-open-packaging>Inspect packaging <span aria-hidden="true">+</span></a></figcaption></figure>
    <div class="blend-copy"><h2 id="blend-heading">THE BLEND.<br>IN FOCUS.</h2><p class="intro-copy">Concentrate.<br>Isolate.</p><p class="body-copy">Two whey sources. The Belgian Chocolate blend concept brings them together in a 500 g pack, with TRAYN’s red and silver signature.</p>${specificationRows(featuredProduct)}<a class="text-link" href="${productPath}">Explore product details ${arrow}</a><p class="small-note">Details shown reflect the concept artwork. Final formulation and nutrition information are pending.</p></div></div>
  </section>
  <section class="flavors-section section-space" id="flavors" aria-labelledby="flavors-heading"><div class="wrap"><div class="section-top"><p class="eyebrow">The flavour study</p><span class="section-caption">One identity. Different expressions.</span></div><div class="flavor-heading"><h2 id="flavors-heading">FOUR EXPRESSIONS.<br>ONE DIRECTION.</h2><p>Belgian Chocolate leads the way.<br>Explore three future flavour concepts.</p></div>
    <div class="product-explorer home-explorer" data-product-explorer><div class="flavor-art"><span class="flavor-backdrop" aria-hidden="true">TRAYN</span><div class="explorer-image">${productImage(featuredProduct, { interactive: true })}</div><p class="image-label" data-flavor-status aria-live="polite">Featured concept · Not for sale</p></div><div class="flavor-controls"><p class="eyebrow">Explore the concepts</p><div class="flavor-options" aria-label="Flavour concepts">${flavorLinks()}</div><div class="selected-flavor"><p data-product-status>Featured concept</p><h3 data-product-name>Belgian Chocolate</h3><a class="text-link" href="${productPath}" data-product-link>View concept details ${arrow}</a></div><p class="small-note">Concept renders, not retail photography. Future flavours and final packaging are not confirmed for sale.</p></div></div>
  </div></section>
  <section class="mindset section-space wrap" id="story" aria-labelledby="mindset-heading"><div class="mindset-label"><p class="eyebrow">The TRAYN mindset</p><span class="mindset-rule" aria-hidden="true"></span></div><div class="mindset-content"><h2 id="mindset-heading">FOR THE ONES<br>WHO SHOW UP.</h2><div class="mindset-bottom"><p>The early starts. The last set.<br>The decision to go again.</p><p>Discipline is built in the everyday.<br>That’s the spirit of TRAYN.</p><span class="mindset-signature">KEEP<br>BUILDING.</span></div></div></section>
  <section class="transparency wrap" aria-labelledby="transparency-heading"><p class="eyebrow">Clarity comes first</p><div><h2 id="transparency-heading">A concept. An honest introduction.</h2><p>You’re exploring the next TRAYN product direction. The artwork is a packaging concept, not a finished retail label. Ingredients, nutrition and availability will be shared when verified.</p><a class="text-link" href="/label-information.html">Read the product information ${arrow}</a></div></section>
  </main>`;
}

export function productPage(product = featuredProduct) {
  return `<main id="main" class="product-page wrap"><div class="breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/#blend">The blend</a><span aria-hidden="true">/</span><span>Whey protein</span></div>
  <section class="product-explorer detail-explorer" data-product-explorer aria-labelledby="product-heading"><div class="product-gallery"><div class="gallery-stage"><span class="gallery-word" aria-hidden="true">WHEY</span>${productImage(product, { interactive: true, priority: true })}<a class="gallery-enlarge" href="${product.image}-1024.webp" data-open-packaging aria-label="Enlarge packaging concept"><span aria-hidden="true">+</span></a></div><div class="gallery-controls"><a href="${product.image}-1024.webp" data-gallery-view="front" aria-current="true">Front concept</a><a ${product.backImage ? `href="${product.backImage}-1024.webp"` : "hidden"} data-gallery-view="back" aria-current="false">Back concept</a><span>Concept artwork</span></div><p class="small-note">Packaging renders are design concepts, not retail photography.</p></div>
  <div class="product-information"><p class="eyebrow"><span class="signal"></span><span data-product-status>${escapeHtml(product.status)}</span></p><h1 id="product-heading">WHEY<br>PROTEIN BLEND.</h1><h2 data-product-name>${escapeHtml(product.flavor)}</h2><p class="body-copy">Whey protein concentrate + whey protein isolate. A new chapter for TRAYN, shown as a 500 g packaging concept.</p><div class="detail-flavors"><p class="field-label">Flavour concepts</p><div class="flavor-options" aria-label="Flavour concepts">${flavorLinks(product.id)}</div></div><p class="selection-status" data-flavor-status aria-live="polite">${escapeHtml(product.status)} · Not for sale</p>${specificationRows(product)}<a class="button button-primary" href="mailto:${brand.email}?subject=TRAYN%20product%20enquiry">Enquire about TRAYN ${arrow}</a><p class="small-note">Opens your email app. These concepts are not available to purchase.</p></div></section>
  <section class="product-facts" aria-labelledby="facts-heading"><h2 id="facts-heading">BEHIND THE LABEL.</h2><div class="faq-list"><details open><summary>What does the concept show?<span aria-hidden="true">+</span></summary><p>The intended product is a 500 g whey protein concentrate and whey protein isolate blend. The artwork states “Contains Milk.” This is not a final ingredient or allergen declaration.</p></details><details><summary>Where is the nutrition information?<span aria-hidden="true">+</span></summary><p>Final nutrition, ingredients, serving size and preparation instructions have not been verified. We’ll publish them when approved product records are available. We do not infer them from older packaging.</p></details><details><summary>Can I buy this product?<span aria-hidden="true">+</span></summary><p>This website is a product showcase. These concepts are not offered for sale, and no price, stock or launch date is confirmed here. Contact TRAYN for product enquiries.</p></details><details><summary>What about the other flavours?<span aria-hidden="true">+</span></summary><p>Vanilla Creme, Café Mocha and Cookies & Cream are future flavour explorations using existing concept artwork. Their inclusion does not confirm a commercial launch.</p></details></div></section>
  <div class="product-page-end"><a class="text-link" href="/label-information.html">Read all concept information ${arrow}</a><a class="text-link" href="/#flavors">Back to the flavour study ${arrow}</a></div></main>`;
}

export function informationPage() {
  return `<main id="main" class="information-page wrap"><p class="eyebrow">Product transparency</p><h1>KNOW WHAT<br>YOU’RE LOOKING AT.</h1><p class="information-lead">A clear introduction to the TRAYN product concepts.</p><div class="information-grid"><section><h2>What’s shown</h2><p>The featured Belgian Chocolate artwork presents an intended 500 g whey protein concentrate and whey protein isolate blend. It states “Contains Milk.” The Slipstream front and back are packaging concepts, not approved commercial labels.</p><p>Vanilla Creme, Café Mocha and Cookies & Cream are future flavour explorations. Their images use earlier concept packaging and are not confirmed retail products.</p></section><section><h2>What’s still to come</h2><p>Final ingredients, nutrition, serving size, preparation and storage instructions, complete allergen information and approved retail packaging are not yet provided. Prices, inventory, launch dates and delivery information are not confirmed here.</p></section><section><h2>About the images</h2><p>We use TRAYN’s supplied brand identity and existing digitally rendered packaging concepts. The foil imagery is original AI-generated campaign artwork. They are not photographs of finished retail products. Enlarging the artwork lets you inspect it; the artwork itself is not evidence of final product approval.</p></section><section><h2>Product enquiries</h2><p>This is a showcase. There is no checkout or waitlist on this site. Contact TRAYN directly for product information.</p><a class="text-link" href="mailto:${brand.email}">${brand.email} ${arrow}</a></section></div><a class="button button-primary" href="${productPath}">Explore the blend ${arrow}</a></main>`;
}

export function notFoundPage() {
  return `<main id="main" class="not-found wrap"><p class="eyebrow">404 / Page not found</p><h1>BACK TO<br>THE WORK.</h1><p>This page isn’t here. Explore the TRAYN blend or get in touch.</p><a class="button button-primary" href="/">Back to TRAYN ${arrow}</a></main>`;
}

export function document(page) {
  const canonical = `${brand.domain}${page.canonical}`;
  const schema =
    page.type === "home"
      ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: brand.name, url: brand.domain, logo: `${brand.domain}/images/brand/trayn-logo.webp`, email: brand.email })}</script>`
      : "";
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><script>document.documentElement.classList.add('js');window.addEventListener('error',function(e){if(e.target.tagName==='SCRIPT'&&e.target.type==='module')document.documentElement.classList.remove('js')},true)</script><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#090A0C"><title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}"><meta name="robots" content="noindex, follow"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${brand.domain}/images/social-share.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="TRAYN Nutrition Belgian Chocolate packaging concept"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/png" href="/images/brand/favicon.png"><link rel="preload" href="/fonts/manrope-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/src/styles.css"><link rel="stylesheet" href="/src/under-tension.css">${schema}</head><body id="top" data-page="${page.type}"${page.initialFlavor ? ` data-initial-flavor="${escapeHtml(page.initialFlavor)}"` : ""}>${header()}${page.content}${footer()}${packagingDialog()}<script type="module" src="/src/main.js"></script></body></html>`;
}
