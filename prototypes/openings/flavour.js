import "./flavour.css";

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const arrow = '<span aria-hidden="true">↗</span>';
const optionalAsset = (asset, name) => {
  try {
    return asset(name);
  } catch {
    return "";
  }
};

// Original campaign photography generated with built-in imagegen, 11 October 2026.
// Hero prompt: horizontal editorial food photograph; sculptural glossy chocolate
// ribbon, broken chocolate shard and cocoa dust on almond cream; grounded soft
// studio shadows; no text, branding, packaging, people or ingredient claims.
// Detail prompt: separate horizontal photograph; folded ivory vanilla cream
// ribbon and two vanilla pods in the same almond studio world, no text/packaging.
// These are flavour-inspired campaign scenes, not photographs of the formulation.

export function render({ asset, logo, pouch, backPouch }) {
  const vanillaPouch = optionalAsset(asset, "vanilla-pouch.webp");
  return `<main class="flavour" id="flavour-top" data-flavour-current="vanilla">
    <header class="flavour-nav">
      <a class="flavour-logo" href="#flavour-top" aria-label="TRAYN Nutrition — back to the opening"><img src="${escape(logo)}" width="740" height="440" alt="TRAYN Nutrition"></a>
      <span class="flavour-nav-title">The Flavour Study</span>
      <nav aria-label="Flavour study navigation"><a href="#flavour-notes">Explore the notes <span aria-hidden="true">↓</span></a><a href="mailto:traynnutrition@gmail.com">Say hello ${arrow}</a></nav>
    </header>

    <section class="flavour-opening" aria-labelledby="flavour-heading">
      <div class="flavour-opening-caption"><span>TRAYN WHEY BLEND</span><span>A different kind of daily ritual.</span></div>
      <h1 id="flavour-heading"><span>A taste for</span> <em>the everyday.</em></h1>
      <div class="flavour-hero-canvas">
        <div class="flavour-hero-frame"><img class="flavour-hero-image" src="${escape(asset("flavour-hero.webp"))}" width="1536" height="1024" alt="Flavour-inspired campaign still life: a sculptural dark chocolate ribbon, chocolate shard and cocoa on a warm cream surface" fetchpriority="high" decoding="async"></div>
        <span class="flavour-image-note">A STUDY IN CHOCOLATE</span>
        <a class="flavour-hero-cta" href="#flavour-notes"><span>Find your<br><em>flavour.</em></span><span class="flavour-cta-arrow" aria-hidden="true">↓</span></a>
        <aside class="flavour-catalogue" aria-label="Featured packaging concept">
          <span class="flavour-catalogue-top">THE ORIGINAL CHAPTER</span>
          <img src="${escape(pouch)}" width="1024" height="1536" alt="TRAYN Belgian Chocolate 500 g whey blend front packaging concept, not for sale" decoding="async">
          <div><p>Belgian Chocolate</p><span>500 g · Packaging concept</span></div>
          <a href="${escape(pouch)}" data-flavour-inspect>Meet the pack ${arrow}</a>
        </aside>
      </div>
      <div class="flavour-opening-bottom"><p>Whey concentrate + whey isolate.<br>A familiar ritual, seen in a new light.</p><span>Crafted as a concept.<br>Imagined for your everyday.</span><a href="#flavour-notes">The flavour notes <span aria-hidden="true">↓</span></a></div>
    </section>

    <section class="flavour-study" id="flavour-notes" aria-labelledby="flavour-study-heading">
      <header class="flavour-study-heading"><p class="flavour-eyebrow">A MATTER OF TASTE</p><h2 id="flavour-study-heading">Same spirit.<br><em>Another expression.</em></h2><p>Two flavour directions.<br>One unmistakable TRAYN.</p></header>
      <div class="flavour-study-layout">
        <figure class="flavour-study-visual"><div class="flavour-study-frame"><img data-flavour-scene src="${escape(asset("flavour-detail.webp"))}" width="1536" height="1024" alt="Vanilla-inspired campaign still life: an ivory cream ribbon and vanilla pods in warm studio light" loading="lazy" decoding="async"></div><figcaption><span data-flavour-caption>Soft folds. A quieter palette.</span><span>CAMPAIGN STUDY</span></figcaption></figure>
        <div class="flavour-notebook">
          <div class="flavour-selector" role="group" aria-label="Choose a flavour"><button type="button" data-flavour-choice="chocolate" aria-pressed="false"><span class="flavour-dot chocolate-dot" aria-hidden="true"></span>Chocolate</button><button type="button" data-flavour-choice="vanilla" aria-pressed="true"><span class="flavour-dot vanilla-dot" aria-hidden="true"></span>Vanilla</button></div>
          <div class="flavour-story" aria-live="polite" aria-atomic="true"><p class="flavour-eyebrow" data-flavour-status>THE FUTURE FLAVOUR CONCEPT</p><h3 data-flavour-name>Vanilla <em>Creme.</em></h3><p class="flavour-story-copy" data-flavour-description>A softer side of the story. Ivory folds, warm light, and room for something new.</p><p class="flavour-concept-note" data-flavour-availability>Future flavour exploration. Not confirmed for sale.</p></div>
          <dl class="flavour-specs"><div><dt>The blend</dt><dd>Whey concentrate + isolate</dd></div><div><dt>The concept pack</dt><dd>500 g · Contains milk</dd></div></dl>
          <div class="flavour-study-product"><div class="flavour-mini-pack"><img data-flavour-pouch src="${escape(vanillaPouch || pouch)}" ${vanillaPouch ? "" : "hidden"} width="1024" height="1536" alt="TRAYN Vanilla Creme 500 g packaging concept, not for sale" loading="lazy" decoding="async"><span data-flavour-pack-fallback ${vanillaPouch ? "hidden" : ""}>A future<br>packaging study.</span></div><div><span class="flavour-eyebrow">THE NEXT CONVERSATION</span><a href="mailto:traynnutrition@gmail.com?subject=TRAYN%20Vanilla%20Creme%20concept" data-flavour-enquiry>Let’s talk flavour ${arrow}</a><p>Product enquiries, directly with TRAYN.</p></div></div>
        </div>
      </div>
      <footer class="flavour-footer"><span class="flavour-footer-brand">TRAYN <em>Nutrition.</em></span><p>Flavour-inspired campaign imagery and packaging concepts.<br>Not ingredient declarations or finished retail products. Not for sale.</p><a href="#flavour-top">Back to the beginning <span aria-hidden="true">↑</span></a></footer>
    </section>

    <dialog class="flavour-dialog" aria-labelledby="flavour-dialog-title" data-flavour-dialog data-lenis-prevent><div class="flavour-dialog-head"><div><p class="flavour-eyebrow">THE PACKAGING STUDY</p><h2 id="flavour-dialog-title">Belgian Chocolate.</h2></div><button type="button" data-flavour-close aria-label="Close packaging view">Close <span aria-hidden="true">×</span></button></div><div class="flavour-dialog-views" role="group" aria-label="Packaging view"><button type="button" data-flavour-pack-view="front" aria-pressed="true">Front</button>${backPouch ? '<button type="button" data-flavour-pack-view="back" aria-pressed="false">Back</button>' : ""}</div><div class="flavour-dialog-art" data-lenis-prevent><img data-flavour-dialog-image width="1024" height="1536" alt=""></div><p class="flavour-dialog-note">500 g concentrate + isolate blend concept. Final product information remains pending. Not for sale.</p></dialog>
  </main>`;
}

export function mount(root, { gsap, ScrollTrigger, reducedMotion, asset }) {
  const abort = new AbortController();
  const signal = abort.signal;
  const page = root.querySelector(".flavour");
  const scene = root.querySelector("[data-flavour-scene]");
  const pack = root.querySelector("[data-flavour-pouch]");
  const packFallback = root.querySelector("[data-flavour-pack-fallback]");
  const choiceButtons = [...root.querySelectorAll("[data-flavour-choice]")];
  const dialog = root.querySelector("[data-flavour-dialog]");
  const inspect = root.querySelector("[data-flavour-inspect]");
  const dialogImage = root.querySelector("[data-flavour-dialog-image]");
  const dialogViews = [...root.querySelectorAll("[data-flavour-pack-view]")];
  const chocolatePouch = asset("pouch.webp");
  const vanillaPouch = optionalAsset(asset, "vanilla-pouch.webp");
  const backPouch = optionalAsset(asset, "pouch-back.webp");
  let opener;
  let previousOverflow;
  let choiceVersion = 0;
  let active = page.dataset.flavourCurrent || "vanilla";
  let destroyed = false;

  const stories = {
    chocolate: {
      name: "Belgian <em>Chocolate.</em>",
      label: "Belgian Chocolate",
      status: "THE ORIGINAL FLAVOUR CONCEPT",
      copy: "Deep curves. Cocoa tones. A bolder expression of the everyday, led by Belgian Chocolate.",
      caption: "Deep curves. A bolder expression.",
      availability: "Featured packaging concept. Not for sale.",
      image: asset("flavour-hero.webp"),
      alt: "Chocolate-inspired campaign still life: glossy dark chocolate ribbon and cocoa on warm cream",
      pouch: chocolatePouch,
    },
    vanilla: {
      name: "Vanilla <em>Creme.</em>",
      label: "Vanilla Creme",
      status: "THE FUTURE FLAVOUR CONCEPT",
      copy: "A softer side of the story. Ivory folds, warm light, and room for something new.",
      caption: "Soft folds. A quieter palette.",
      availability: "Future flavour exploration. Not confirmed for sale.",
      image: asset("flavour-detail.webp"),
      alt: "Vanilla-inspired campaign still life: an ivory cream ribbon and vanilla pods in warm studio light",
      pouch: vanillaPouch,
    },
  };

  const context = gsap?.context(() => {
    if (reducedMotion) return;
    gsap.fromTo(
      root.querySelectorAll(".flavour-opening h1 > *"),
      { y: 22 },
      {
        y: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
    gsap.fromTo(
      root.querySelector(".flavour-hero-image"),
      { scale: 1.025 },
      { scale: 1, duration: 1.1, ease: "power2.out", clearProps: "transform" },
    );
    if (ScrollTrigger) {
      gsap.fromTo(
        root.querySelector(".flavour-study-frame"),
        { y: 24 },
        {
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: root.querySelector(".flavour-study-layout"),
            start: "top 88%",
            once: true,
          },
        },
      );
    }
  }, root);

  function animateSelection() {
    if (reducedMotion || !context) return;
    context.add(() => {
      gsap.killTweensOf([scene, pack]);
      gsap.fromTo(
        [scene, pack],
        { opacity: 0.65, y: 5 },
        {
          opacity: 1,
          y: 0,
          duration: 0.24,
          stagger: 0.015,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
      );
    });
  }

  function choose(key) {
    if (!stories[key] || key === active) return;
    active = key;
    page.dataset.flavourCurrent = key;
    const story = stories[key];
    const version = ++choiceVersion;
    choiceButtons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.flavourChoice === key),
      ),
    );
    root.querySelector("[data-flavour-name]").innerHTML = story.name;
    root.querySelector("[data-flavour-status]").textContent = story.status;
    root.querySelector("[data-flavour-description]").textContent = story.copy;
    root.querySelector("[data-flavour-availability]").textContent =
      story.availability;
    root.querySelector("[data-flavour-caption]").textContent = story.caption;
    root.querySelector("[data-flavour-enquiry]").href =
      `mailto:traynnutrition@gmail.com?subject=${encodeURIComponent(`TRAYN ${story.label} concept`)}`;
    pack.hidden = !story.pouch;
    packFallback.hidden = Boolean(story.pouch);
    if (story.pouch) {
      pack.src = story.pouch;
      pack.alt = `TRAYN ${story.label} 500 g packaging concept, not for sale`;
    }
    const next = new Image();
    next.src = story.image;
    const apply = () => {
      if (destroyed || version !== choiceVersion) return;
      scene.src = story.image;
      scene.alt = story.alt;
      animateSelection();
    };
    if (next.complete) apply();
    else {
      next.addEventListener("load", apply, { once: true });
      next.addEventListener("error", apply, { once: true });
    }
  }

  choiceButtons.forEach((button) =>
    button.addEventListener(
      "click",
      () => choose(button.dataset.flavourChoice),
      { signal },
    ),
  );
  root.querySelector(".flavour-selector").addEventListener(
    "keydown",
    (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      event.stopPropagation();
      const key =
        event.key === "Home"
          ? "chocolate"
          : event.key === "End"
            ? "vanilla"
            : active === "chocolate"
              ? "vanilla"
              : "chocolate";
      choose(key);
      choiceButtons
        .find((button) => button.dataset.flavourChoice === key)
        ?.focus();
    },
    { signal },
  );
  pack.addEventListener(
    "error",
    () => {
      pack.hidden = true;
      packFallback.hidden = false;
    },
    { signal },
  );

  function packView(view) {
    const back = view === "back" && backPouch;
    dialogImage.src = back ? backPouch : chocolatePouch;
    dialogImage.alt = `TRAYN Belgian Chocolate ${back ? "back label" : "front pouch"} packaging concept, not for sale`;
    dialogViews.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.flavourPackView === (back ? "back" : "front")),
      ),
    );
    dialog.querySelector(".flavour-dialog-art").scrollTop = 0;
  }
  if (typeof dialog.showModal === "function") {
    inspect.addEventListener(
      "click",
      (event) => {
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
          return;
        event.preventDefault();
        opener = inspect;
        packView("front");
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();
        dialog.querySelector("[data-flavour-close]").focus();
      },
      { signal },
    );
    root
      .querySelector("[data-flavour-close]")
      .addEventListener("click", () => dialog.close(), { signal });
    dialogViews.forEach((button) =>
      button.addEventListener(
        "click",
        () => packView(button.dataset.flavourPackView),
        { signal },
      ),
    );
    dialog.addEventListener(
      "click",
      (event) => {
        const rect = dialog.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          dialog.close();
      },
      { signal },
    );
    dialog.addEventListener(
      "close",
      () => {
        document.body.style.overflow = previousOverflow ?? "";
        opener?.focus({ preventScroll: true });
      },
      { signal },
    );
  }

  return () => {
    destroyed = true;
    choiceVersion++;
    if (dialog.open) dialog.close();
    abort.abort();
    context?.revert();
    if (previousOverflow !== undefined)
      document.body.style.overflow = previousOverflow;
  };
}
