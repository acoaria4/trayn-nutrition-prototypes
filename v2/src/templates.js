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
  return `<img class="${className}" ${interactive ? "data-product-image" : ""} src="${path}-640.webp" srcset="${path}-640.webp 640w, ${path}-1024.webp 1024w" sizes="${sizes}" width="1024" height="1536" alt="TRAYN ${escapeHtml(product.flavor)} ${escapeHtml(product.name)} 500 g ${back ? "back-label" : "pouch"} concept; not for sale" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}

export function header() {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="header-inner">
    <a class="brand" href="/" aria-label="TRAYN Nutrition home"><img src="/images/brand/trayn-logo-256.webp" srcset="/images/brand/trayn-logo-256.webp 256w, /images/brand/trayn-logo.webp 740w" sizes="(max-width: 800px) 88px, 107px" alt="TRAYN Nutrition" width="740" height="440"></a>
    <nav class="main-nav" id="main-navigation" aria-label="Main navigation"><a href="/#about">Our story</a><a href="/#story">The packaging</a><a href="/#blend">The product</a><a href="/#contact">Contact</a></nav>
    <a class="header-cta" href="${productPath}">View product ${arrow}</a>
    <button class="menu-toggle" aria-controls="main-navigation" aria-expanded="false" aria-label="Open menu"><span data-menu-label>Menu</span><span class="menu-bars" aria-hidden="true"></span></button>
  </div></header>`;
}

export function footer() {
  return `<footer class="site-footer" id="contact"><div class="footer-top wrap">
    <div class="contact-intro"><p class="eyebrow">Contact TRAYN</p><h2>LET’S TALK.</h2><p class="contact-copy">Product questions or partnerships? Get in touch with TRAYN.</p><a class="contact-email" href="mailto:${brand.email}">${brand.email} ${arrow}</a></div>
    <div class="footer-links"><p class="eyebrow">Get in touch</p><a href="tel:${brand.phone}">${brand.phoneDisplay}</a><a href="${brand.instagram}" target="_blank" rel="noopener noreferrer">Instagram ${arrow}</a><a href="${productPath}">Belgian Chocolate ${arrow}</a><a href="/label-information.html">Product information ${arrow}</a><a href="/drafts/">Compare the three drafts ${arrow}</a></div>
    <a class="back-top" href="#top" aria-label="Back to top"><span aria-hidden="true">↑</span><span>Back to top</span></a>
  </div><div class="footer-bottom wrap"><a href="/" aria-label="TRAYN Nutrition home"><img src="/images/brand/trayn-logo-256.webp" width="740" height="440" alt="TRAYN Nutrition" loading="lazy"></a><p>© 2026 TRAYN Nutrition</p><p>Packaging concept. Not for sale.</p><a href="/label-information.html">Product information</a></div></footer>`;
}

export function packagingDialog() {
  return `<dialog data-lenis-prevent class="packaging-dialog" id="packaging-dialog" aria-labelledby="packaging-title"><div class="dialog-toolbar"><div><p class="eyebrow">A closer look</p><h2 id="packaging-title">Packaging concept</h2></div><button type="button" class="dialog-close" aria-label="Close packaging view">Close <span aria-hidden="true">×</span></button></div><div class="dialog-image-wrap"><img data-dialog-image width="1024" height="1536" alt="" data-deferred-image></div><p class="dialog-caption">Concept artwork. Packaging and product information are not final.</p></dialog>`;
}

function specificationRows(product) {
  return `<dl class="spec-list"><div><dt>Protein source</dt><dd data-product-formulation>${escapeHtml(product.blend)}</dd></div><div><dt>Flavour</dt><dd data-product-flavor>${escapeHtml(product.flavor)}</dd></div><div><dt>Net quantity</dt><dd>500 g</dd></div><div><dt>Allergen</dt><dd>Milk</dd></div></dl>`;
}

export function home() {
  return `<main id="main">
  <section class="tension-story" aria-label="Belgian Chocolate: a closer look">
    <div class="tension-scene">
      <section class="hero tension-hero" aria-labelledby="hero-heading" data-story-progress="0">
        <div class="tension-material" aria-hidden="true"><img src="/images/campaign/tension-hero-1672.webp" srcset="/images/campaign/tension-hero-960.webp 960w, /images/campaign/tension-hero-1672.webp 1672w" sizes="100vw" width="1672" height="941" alt="" fetchpriority="high"></div>
        <div class="tension-opening">
        <div class="tension-heading"><h1 id="hero-heading"><span>FUEL YOUR</span> <span class="campaign-accent">POTENTIAL.</span></h1></div>
        <div class="tension-stage"><div class="tension-pack">${productImage(featuredProduct, { className: "hero-pouch", priority: true })}<span class="tension-light" aria-hidden="true"><span class="tension-sheen"></span></span></div></div>
        <div class="tension-hero-bottom">
          <p class="tension-product-note">Belgian Chocolate.<br>Whey protein concentrate.<span>500 g packaging concept. Not for sale.</span></p>
          <a class="tension-explore" href="#about" aria-label="Explore the TRAYN mindset"><span>Scroll to explore</span><span aria-hidden="true">↓</span></a>
        </div>
        </div>
      </section>
      <div class="tension-chapters">
        <article class="tension-chapter" data-chapter="1"><p class="eyebrow"><span class="section-index">01</span> / The drive</p><h2>FOR THE<br>WORK.</h2><p>Early starts. Hard sessions. The decision to keep going.</p></article>
        <article class="tension-chapter" data-chapter="2"><p class="eyebrow"><span class="section-index">02</span> / The routine</p><h2>DAY AFTER<br>DAY.</h2><p>Build a routine you can return to.</p><a class="text-link" href="#blend">Explore the product ${arrow}</a></article>
      </div>
      <div class="story-progress" aria-hidden="true"><span>TRAYN / BELGIAN CHOCOLATE</span><div><i></i></div><span>WPC · 500 g</span></div>
    </div>
  </section>
  <section class="trayn-mindset section-space" id="about" aria-labelledby="mindset-heading">
    <div class="trayn-mindset-inner wrap">
      <div><p class="eyebrow"><span class="section-index">03</span> / The TRAYN mindset</p><h2 id="mindset-heading">GET<br>BUILT.</h2></div>
      <div class="trayn-mindset-copy"><p class="eyebrow">TRAYN by gLitCh</p><h3>Built for those<br>who show up.</h3><p>Discipline. Grit. The drive to show up every day. That’s the spirit behind TRAYN.</p><p>For regular gym goers, competitive athletes and people starting their first training routine. Wherever you begin, keep showing up.</p><a class="text-link" href="#contact">Get to know TRAYN ${arrow}</a></div>
    </div>
  </section>
  <section class="wpc-packaging wrap" id="story" aria-labelledby="packaging-heading">
    <figure class="wpc-pack-detail"><a href="/images/products/belgian-chocolate-wpc-1024.webp" data-open-packaging aria-label="Inspect Belgian Chocolate packaging">${productImage(featuredProduct)}<span aria-hidden="true">Inspect packaging +</span></a></figure>
    <div class="wpc-pack-copy"><p class="eyebrow"><span class="section-index">04</span> / The packaging</p><h2 id="packaging-heading">A CLOSER<br>LOOK.</h2><p class="body-copy">Explore the front of the Belgian Chocolate pouch: the product name, flavour and 500 g pack size, together.</p><a class="text-link" href="/images/products/belgian-chocolate-wpc-1024.webp" data-open-packaging>See the pack up close ${arrow}</a><p class="small-note">Front packaging concept. Final label information is still to be confirmed.</p></div>
  </section>
  <section class="wpc-product section-space wrap" id="blend" aria-labelledby="blend-heading">
    <div class="section-top"><p class="eyebrow"><span class="section-index">05</span> / The details</p><span class="section-caption">Belgian Chocolate / 500 g</span></div>
    <div class="wpc-product-layout"><div><h2 id="blend-heading">KNOW YOUR<br>PROTEIN.</h2><p class="body-copy">WPC stands for whey protein concentrate. It’s the protein source in our Belgian Chocolate pack.</p><p class="body-copy">The essentials are here: protein source, flavour, pack size and the known milk allergen.</p><a class="text-link" href="${productPath}">View product details ${arrow}</a></div><div>${specificationRows(featuredProduct)}<p class="small-note">Looking for nutrition values or serving directions? <a href="/label-information.html">Check the current product information.</a></p></div></div>
  </section>
  <section class="wpc-questions section-space wrap" id="questions" aria-labelledby="questions-heading">
    <div><p class="eyebrow"><span class="section-index">06</span> / Before your next scoop</p><h2 id="questions-heading">KNOW<br>YOUR PACK.</h2><p class="body-copy">Clear product information belongs alongside the training mindset.</p><a class="text-link" href="/label-information.html">Read the product information ${arrow}</a></div>
    <div class="faq-list">
      <details open><summary>What does WPC mean?<span aria-hidden="true">+</span></summary><p>WPC means whey protein concentrate. The current TRAYN product direction is Belgian Chocolate WPC in a 500 g pack.</p></details>
      <details><summary>Does this product contain milk?<span aria-hidden="true">+</span></summary><p>Yes. Milk is the known allergen for this whey product. The full ingredient and allergen information will appear with the final label.</p></details>
      <details><summary>Where are the nutrition and serving details?<span aria-hidden="true">+</span></summary><p>Final nutrition values, ingredients, serving size and preparation instructions are still being confirmed. They will be published with the approved product information.</p></details>
      <details><summary>Can I buy this pack?<span aria-hidden="true">+</span></summary><p>This is a product and packaging preview. Pricing, availability and a launch date have not been announced here. <a href="mailto:${brand.email}">Contact TRAYN</a> for product enquiries.</p></details>
    </div>
  </section>
  </main>`;
}

export function productPage(product = featuredProduct) {
  return `<main id="main" class="product-page wrap"><div class="breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/#blend">The product</a><span aria-hidden="true">/</span><span>${escapeHtml(product.flavor)}</span></div>
  <section class="product-explorer detail-explorer" data-product-explorer aria-labelledby="product-heading"><div class="product-gallery"><div class="gallery-stage"><span class="gallery-word" aria-hidden="true">WHEY</span>${productImage(product, { interactive: true, priority: true })}<a class="gallery-enlarge" href="${product.image}-1024.webp" data-open-packaging aria-label="Enlarge packaging concept"><span aria-hidden="true">+</span></a></div><div class="gallery-controls"><a href="${product.image}-1024.webp" data-gallery-view="front" aria-current="true">Front concept</a><a ${product.backImage ? `href="${product.backImage}-1024.webp"` : "hidden"} data-gallery-view="back" aria-current="false">Back concept</a><span>Concept artwork</span></div><p class="small-note">${product.archived ? "Earlier packaging study, separate from the current WPC product." : "Belgian Chocolate. Current WPC packaging concept."}</p></div>
  <div class="product-information"><p class="eyebrow"><span class="signal"></span><span data-product-status>${escapeHtml(product.status)}</span></p><h1 id="product-heading" data-product-type>${escapeHtml(product.name)}</h1><h2 data-product-name>${escapeHtml(product.flavor)}</h2><p class="body-copy" data-product-description>${escapeHtml(product.description)}</p><p class="selection-status" data-flavor-status aria-live="polite">${escapeHtml(product.status)} · Not for sale</p>${specificationRows(product)}<a class="button button-primary" href="mailto:${brand.email}?subject=TRAYN%20product%20enquiry">Enquire about TRAYN ${arrow}</a><p class="small-note">Opens your email app. This concept is not available to purchase.</p></div></section>
  <section class="product-facts" aria-labelledby="facts-heading"><h2 id="facts-heading">PRODUCT INFORMATION.</h2><div class="faq-list"><details open><summary>What is this product?<span aria-hidden="true">+</span></summary><p>${product.archived ? "This is an archived 500 g whey concentrate and isolate blend concept. It is separate from the current Belgian Chocolate WPC product." : "The current product direction is Belgian Chocolate whey protein concentrate (WPC), in a 500 g pack. The image is a packaging concept, not a final retail label."}</p></details><details><summary>Where are the ingredients and nutrition facts?<span aria-hidden="true">+</span></summary><p>Final ingredients, nutrition, serving size and preparation instructions are still to be confirmed. They will be published when approved product records are available.</p></details><details><summary>Is it available to buy?<span aria-hidden="true">+</span></summary><p>This is a product showcase. Sales, pricing and a launch date have not been announced here. Contact TRAYN for product enquiries.</p></details></div></section>
  <div class="product-page-end"><a class="text-link" href="/label-information.html">More product information ${arrow}</a><a class="text-link" href="/#blend">Back to TRAYN ${arrow}</a></div></main>`;
}

export function informationPage() {
  const archiveLinks = products
    .filter((product) => product.archived)
    .map(
      (product) =>
        `<a class="text-link" href="${productUrl(product)}">${escapeHtml(product.flavor)} ${arrow}</a>`,
    )
    .join("");
  return `<main id="main" class="information-page wrap"><p class="eyebrow">Product information</p><h1>THE DETAILS,<br>CLEARLY.</h1><p class="information-lead">What’s confirmed, and what’s still in development.</p><div class="information-grid"><section><h2>The current product</h2><p>Belgian Chocolate whey protein concentrate (WPC), shown in a 500 g packaging concept. The current direction uses whey protein concentrate as its protein source.</p></section><section><h2>Still to be confirmed</h2><p>Final ingredients, nutrition, serving size, preparation and storage instructions, complete allergen information and approved retail packaging are pending. Prices and a launch date have not been announced here.</p></section><section><h2>About the images</h2><p>The featured pouch uses TRAYN’s supplied WPC packaging concept, prepared with a transparent background. Campaign foil imagery is AI-generated. These images are not photographs of a finished retail product.</p></section><section><h2>Product enquiries</h2><p>For product information, contact TRAYN directly.</p><a class="text-link" href="mailto:${brand.email}">${brand.email} ${arrow}</a></section><section class="archived-concepts"><h2>Earlier flavour studies</h2><p>These archived designs show an earlier concentrate and isolate blend. They are separate from the current Belgian Chocolate WPC product.</p>${archiveLinks}</section></div><a class="button button-primary" href="${productPath}">View Belgian Chocolate ${arrow}</a></main>`;
}

export function notFoundPage() {
  return `<main id="main" class="not-found wrap"><p class="eyebrow">404 / Page not found</p><h1>PAGE NOT<br>FOUND.</h1><p>This page isn’t here. Return to TRAYN to explore Belgian Chocolate.</p><a class="button button-primary" href="/">Back to TRAYN ${arrow}</a></main>`;
}

export function document(page) {
  const canonical = `${brand.domain}${page.canonical}`;
  const schema =
    page.type === "home"
      ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: brand.name, url: brand.domain, logo: `${brand.domain}/images/brand/trayn-logo.webp`, email: brand.email })}</script>`
      : "";
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><script>document.documentElement.classList.add('js');window.addEventListener('error',function(e){if(e.target.tagName==='SCRIPT'&&e.target.type==='module')document.documentElement.classList.remove('js')},true)</script><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#090A0C"><title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}"><meta name="robots" content="noindex, follow"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${brand.domain}/images/social-share-wpc.jpg"><meta property="og:image:width" content="1024"><meta property="og:image:height" content="1536"><meta property="og:image:alt" content="TRAYN Nutrition Belgian Chocolate WPC packaging concept"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/png" href="/images/brand/favicon.png"><link rel="preload" href="/fonts/manrope-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/src/styles.css"><link rel="stylesheet" href="/src/under-tension.css"><link rel="stylesheet" href="/src/scroll-story.css">${schema}</head><body id="top" data-page="${page.type}"${page.initialFlavor ? ` data-initial-flavor="${escapeHtml(page.initialFlavor)}"` : ""}>${header()}${page.content}${footer()}${packagingDialog()}<script type="module" src="/src/main.js"></script></body></html>`;
}
