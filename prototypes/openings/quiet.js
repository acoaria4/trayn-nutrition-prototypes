import "./quiet.css";

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const arrow = '<span aria-hidden="true">↗</span>';

export function render({ asset, logo, pouch, backPouch }) {
  return `<main class="quiet" id="quiet-top">
    <section class="quiet-hero" id="quiet-opening" aria-labelledby="quiet-heading">
      <div class="quiet-hero-media"><img src="${escape(asset("quiet-hero.webp"))}" alt="Campaign concept: a person quietly preparing a lifting strap in a training room at dawn" width="1672" height="941" fetchpriority="high" decoding="async"></div>
      <div class="quiet-hero-shade" aria-hidden="true"></div>
      <header class="quiet-nav">
        <a class="quiet-logo" href="#quiet-top" aria-label="TRAYN Nutrition — back to the opening"><img src="${escape(logo)}" alt="TRAYN Nutrition" width="740" height="440"></a>
        <nav aria-label="The quiet before navigation"><a href="#quiet-opening">The ritual</a><a href="#quiet-blend">The blend</a></nav>
        <a class="quiet-nav-contact" href="mailto:traynnutrition@gmail.com">Get in touch ${arrow}</a>
      </header>
      <div class="quiet-opening-label"><span>TRAYN NUTRITION</span><span>A study in preparation</span></div>
      <div class="quiet-hero-content">
        <div class="quiet-lead">
          <p class="quiet-kicker">A moment, before the movement.</p>
          <h1 id="quiet-heading"><span>The quiet</span> <em>before.</em></h1>
          <a class="quiet-hero-cta" href="#quiet-blend"><span>Meet the blend</span><span class="quiet-circle" aria-hidden="true">↓</span></a>
        </div>
        <div class="quiet-margin-note"><span class="quiet-note-line" aria-hidden="true"></span><p>The strap. The breath.<br>A little time to begin.</p></div>
      </div>
      <div class="quiet-hero-bottom"><p>Built around your practice.</p><a href="#quiet-blend">Continue the story <span aria-hidden="true">↓</span></a></div>
    </section>

    <section class="quiet-blend" id="quiet-blend" aria-labelledby="quiet-blend-heading">
      <header class="quiet-blend-heading"><p class="quiet-kicker">THE DAILY PRACTICE</p><h2 id="quiet-blend-heading">Before the <em>first rep.</em></h2><p>Care in the small things.<br>Room for what comes next.</p></header>
      <div class="quiet-editorial-grid">
        <figure class="quiet-detail"><div class="quiet-detail-frame"><img src="${escape(asset("quiet-detail.webp"))}" alt="Campaign detail: hands drawing an olive lifting strap around a wrist" width="1672" height="941" loading="lazy" decoding="async"></div><figcaption><span>01 — Take a moment.</span><span>Then begin.</span></figcaption></figure>
        <div class="quiet-product-figure" id="quiet-product">
          <p class="quiet-product-caption">TRAYN / WHEY BLEND</p>
          <div class="quiet-pack-stage"><img data-quiet-pack src="${escape(pouch)}" alt="TRAYN Belgian Chocolate 500 g whey blend — front packaging concept, not for sale" width="1024" height="1536" loading="lazy" decoding="async"></div>
          ${backPouch ? '<button class="quiet-turn" type="button" data-quiet-turn aria-pressed="false"><span data-quiet-turn-label>View back of pack</span><span aria-hidden="true">↻</span></button>' : ""}
        </div>
        <div class="quiet-product-copy"><p class="quiet-kicker">MEET THE BLEND</p><h3>Belgian<br><em>Chocolate.</em></h3><p class="quiet-product-intro">Whey concentrate.<br>Whey isolate.<br>A new expression of TRAYN.</p><dl class="quiet-specs"><div><dt>Net quantity</dt><dd>500 g</dd></div><div><dt>Status</dt><dd>Packaging concept</dd></div></dl><a class="quiet-inspect" href="${escape(pouch)}" data-quiet-inspect>Look a little closer ${arrow}</a><p class="quiet-product-note">Intended details shown on concept artwork.<br>Not available to purchase.</p></div>
      </div>
      <footer class="quiet-end"><p>Original AI-generated campaign imagery. Supplied packaging concept; not for sale.<br>Final formulation and availability are unconfirmed. No athlete endorsement is implied.</p><a href="mailto:traynnutrition@gmail.com">A conversation with TRAYN ${arrow}</a></footer>
    </section>
    <dialog class="quiet-dialog" data-lenis-prevent aria-labelledby="quiet-dialog-heading"><div class="quiet-dialog-top"><div><p class="quiet-kicker">A CLOSER LOOK</p><h2 id="quiet-dialog-heading">The packaging concept.</h2></div><button type="button" data-quiet-close aria-label="Close packaging view">Close <span aria-hidden="true">×</span></button></div><img data-quiet-dialog-image src="${escape(pouch)}" alt="Enlarged TRAYN Belgian Chocolate packaging concept, not for sale" width="1024" height="1536"><p>Concept artwork. Packaging and product information are not final.</p></dialog>
  </main>`;
}

export function mount(root, { gsap, ScrollTrigger, reducedMotion, asset }) {
  const main = root.matches?.(".quiet") ? root : root.querySelector(".quiet");
  if (!main) return () => {};
  const removers = [];
  const on = (element, event, handler) => {
    if (!element) return;
    element.addEventListener(event, handler);
    removers.push(() => element.removeEventListener(event, handler));
  };
  const pack = main.querySelector("[data-quiet-pack]");
  const front = pack.getAttribute("src");
  const turn = main.querySelector("[data-quiet-turn]");
  // Keep package views tied to the approved assets supplied by the harness.
  const back = asset("pouch-back.webp");
  const dialog = main.querySelector(".quiet-dialog");
  const inspect = main.querySelector("[data-quiet-inspect]");
  let view = "front";
  let previousOverflow = "";
  let opener;

  on(turn, "click", () => {
    if (!back) return;
    view = view === "front" ? "back" : "front";
    pack.src = view === "front" ? front : back;
    pack.alt = `TRAYN Belgian Chocolate 500 g whey blend — ${view} packaging concept, not for sale`;
    turn.setAttribute("aria-pressed", String(view === "back"));
    turn.querySelector("[data-quiet-turn-label]").textContent =
      view === "front" ? "View back of pack" : "View front of pack";
    inspect.href = pack.src;
  });
  if (typeof dialog.showModal === "function") {
    on(inspect, "click", (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return;
      event.preventDefault();
      opener = inspect;
      dialog.querySelector("[data-quiet-dialog-image]").src = pack.src;
      dialog.querySelector("[data-quiet-dialog-image]").alt =
        `Enlarged TRAYN Belgian Chocolate ${view} packaging concept; not for sale`;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      dialog.querySelector("[data-quiet-close]").focus();
    });
    on(main.querySelector("[data-quiet-close]"), "click", () => dialog.close());
    on(dialog, "close", () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    });
    on(dialog, "click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    });
  }
  let media;
  let disposed = false;
  const context = gsap.context(() => {
    if (reducedMotion) return;
    gsap.from(".quiet-lead h1 > *", {
      y: 24,
      duration: 0.95,
      stagger: 0.08,
      ease: "power3.out",
    });
    gsap.from(".quiet-hero-media img", {
      scale: 1.045,
      duration: 1.6,
      ease: "power2.out",
    });
    media = gsap.matchMedia();
    media.add("(min-width: 801px)", () => {
      gsap.to(".quiet-hero-media", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: main.querySelector(".quiet-hero"),
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".quiet-lead", {
        y: -55,
        ease: "none",
        scrollTrigger: {
          trigger: main.querySelector(".quiet-hero"),
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.from(".quiet-detail-frame img", {
        scale: 1.12,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: main.querySelector(".quiet-blend"),
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      });
      gsap.from(".quiet-pack-stage img", {
        y: 45,
        rotation: -3,
        ease: "none",
        scrollTrigger: {
          trigger: main.querySelector(".quiet-blend"),
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      });
    });
  }, main);
  const refresh = () => {
    if (!disposed) ScrollTrigger.refresh();
  };
  document.fonts.ready.then(refresh);
  main.querySelectorAll("img").forEach((image) => {
    if (!image.complete) on(image, "load", refresh);
  });
  return () => {
    disposed = true;
    if (dialog.open) {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    }
    removers.forEach((remove) => remove());
    media?.revert();
    context.revert();
  };
}
