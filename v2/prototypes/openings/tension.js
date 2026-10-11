import "./tension.css";

const html = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

export function render({ asset, logo, pouch, backPouch }) {
  return `<main class="tension" id="tension-top">
    <section class="tension-hero" aria-labelledby="tension-title">
      <div class="tension-hero-art" aria-hidden="true"><img class="tension-foil" src="${html(asset("tension-hero.webp"))}" width="1672" height="941" alt="" fetchpriority="high"><div class="tension-art-shade"></div><div class="tension-light-wash"></div></div>
      <header class="tension-nav">
        <a class="tension-logo" href="#tension-top" aria-label="TRAYN Nutrition, back to top"><img src="${html(logo)}" alt="TRAYN Nutrition" width="740" height="440"></a>
        <span class="tension-edition">Whey protein blend</span>
        <nav aria-label="Under Tension navigation"><a href="#tension-detail">The blend <span aria-hidden="true">↓</span></a><a href="mailto:traynnutrition@gmail.com?subject=TRAYN%20product%20enquiry">Enquire <span aria-hidden="true">↗</span></a></nav>
      </header>
      <div class="tension-title-wrap"><h1 id="tension-title"><span>UNDER</span><span>TENSION.</span></h1><p>Made for the work. Considered in every detail.</p></div>
      <span class="tension-word" aria-hidden="true">WHEY</span>
      <div class="tension-stage" data-tension-stage>
        <div class="tension-pouch-shell"><div class="tension-pouch-reactive"><img data-tension-product class="tension-main-pouch" src="${html(pouch)}" width="1024" height="1536" alt="TRAYN Belgian Chocolate 500 g whey blend packaging concept" fetchpriority="high"><span class="tension-pouch-glint" aria-hidden="true"></span><p class="tension-image-fallback" hidden>TRAYN<br>Belgian Chocolate<br>500 g packaging concept</p></div></div>
      </div>
      <div class="tension-hero-bottom">
        <p class="tension-hero-note">Belgian Chocolate.<br>Concentrate + isolate.<span>500 g packaging concept. Not for sale.</span></p>
        <a class="tension-discover" href="#tension-detail" aria-label="Explore the blend details"><span>Closer to the detail</span><span class="tension-down" aria-hidden="true">↓</span></a>
        <div class="tension-light-control"><div class="tension-light-label"><label for="tension-light">Move the light</label><output for="tension-light" data-tension-light-output>Centre</output></div><input type="range" id="tension-light" min="0" max="100" value="50" step="1" aria-valuetext="Light centred"><div class="tension-light-limits" aria-hidden="true"><span>Left</span><span>Right</span></div></div>
      </div>
    </section>

    <section class="tension-detail" id="tension-detail" aria-labelledby="tension-detail-title">
      <div class="tension-detail-heading"><h2 id="tension-detail-title">THE BLEND.<br>IN FOCUS.</h2><p>Look a little closer.<br>Two whey sources. One considered direction.</p></div>
      <div class="tension-detail-grid">
        <figure class="tension-material">
          <img class="tension-detail-foil" src="${html(asset("tension-detail.webp"))}" alt="" width="1672" height="941" loading="lazy" aria-hidden="true">
          <div class="tension-detail-vignette" aria-hidden="true"></div>
          <div class="tension-detail-pack"><img data-tension-product data-tension-detail-image src="${html(pouch)}" alt="Front of the TRAYN Belgian Chocolate 500 g packaging concept" width="1024" height="1536" loading="lazy"><p class="tension-image-fallback" hidden>TRAYN<br>Belgian Chocolate<br>500 g packaging concept</p></div>
          <figcaption><span>Packaging study</span><div class="tension-view-controls" aria-label="Packaging view"><button type="button" data-tension-view="front" data-image="${html(pouch)}" aria-pressed="true">Front</button><button type="button" data-tension-view="back" data-image="${html(backPouch)}" aria-pressed="false">Back</button></div></figcaption>
        </figure>
        <div class="tension-facts">
          <p class="tension-facts-label">Whey protein blend</p>
          <p class="tension-blend-name">Concentrate<span aria-hidden="true">+</span>Isolate</p>
          <dl><div><dt>Flavour</dt><dd>Belgian Chocolate</dd></div><div><dt>Pack size</dt><dd>500 g <span>concept</span></dd></div><div><dt>Product direction</dt><dd>Whey protein blend</dd></div></dl>
          <a class="tension-artwork-link" data-tension-artwork href="${html(pouch)}" target="_blank" rel="noopener">Inspect the full artwork <span aria-hidden="true">↗</span></a>
          <p class="tension-disclosure">This is a packaging concept. Final ingredients, nutrition and availability will be shared when verified.</p>
        </div>
      </div>
      <footer class="tension-footer"><p>Keep showing up.<br><strong>We’ll meet you there.</strong></p><a href="mailto:traynnutrition@gmail.com?subject=TRAYN%20product%20enquiry">Let’s talk TRAYN <span aria-hidden="true">↗</span></a><span>TRAYN Nutrition<br>Packaging concept · Not for sale</span></footer>
    </section>
  </main>`;
}

export function mount(root, { gsap, ScrollTrigger, reducedMotion, asset }) {
  const surface = root.querySelector(".tension");
  const hero = root.querySelector(".tension-hero");
  const stage = root.querySelector("[data-tension-stage]");
  const slider = root.querySelector("#tension-light");
  const output = root.querySelector("[data-tension-light-output]");
  const detailImage = root.querySelector("[data-tension-detail-image]");
  const artwork = root.querySelector("[data-tension-artwork]");
  const imageUrls = {
    front: asset("pouch.webp"),
    back: asset("pouch-back.webp"),
  };
  artwork.href = imageUrls.front;
  const listeners = [];
  const on = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    listeners.push(() => target.removeEventListener(event, handler, options));
  };
  let frame = 0;
  let pointer = 0;
  let amount = Number(slider.value);
  const finePointer = matchMedia("(pointer: fine)");

  const paintLight = () => {
    frame = 0;
    const normal = (amount - 50) / 50;
    const offset = reducedMotion ? 0 : pointer;
    hero.style.setProperty("--tension-light-x", `${amount}%`);
    hero.style.setProperty("--tension-turn", `${normal * 9 + offset * 3}deg`);
    hero.style.setProperty("--tension-lean", `${normal * 2 + offset}deg`);
    hero.style.setProperty(
      "--tension-light-opacity",
      String(0.2 + Math.abs(normal) * 0.16),
    );
  };
  const resetPointer = () => {
    pointer = 0;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    paintLight();
  };
  const setLight = () => {
    amount = Number(slider.value);
    output.value =
      amount < 43 ? "From the left" : amount > 57 ? "From the right" : "Centre";
    slider.setAttribute("aria-valuetext", `${output.value}, ${amount} percent`);
    paintLight();
  };
  on(slider, "input", setLight);
  on(stage, "pointermove", (event) => {
    if (reducedMotion || !finePointer.matches || event.pointerType === "touch")
      return;
    const bounds = stage.getBoundingClientRect();
    pointer = Math.max(
      -1,
      Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
    );
    if (!frame) frame = requestAnimationFrame(paintLight);
  });
  on(stage, "pointerleave", resetPointer);
  on(window, "blur", resetPointer);
  on(document, "visibilitychange", () => {
    if (document.hidden) resetPointer();
  });
  setLight();

  root.querySelectorAll("[data-tension-view]").forEach((button) =>
    on(button, "click", () => {
      const view = button.dataset.tensionView;
      detailImage.src = imageUrls[view];
      detailImage.alt = `${view === "front" ? "Front" : "Back"} of the TRAYN Belgian Chocolate 500 g packaging concept`;
      artwork.href = imageUrls[view];
      root
        .querySelectorAll("[data-tension-view]")
        .forEach((control) =>
          control.setAttribute("aria-pressed", String(control === button)),
        );
    }),
  );
  root.querySelectorAll("[data-tension-product]").forEach((image) => {
    const fallback = image.parentElement.querySelector(
      ".tension-image-fallback",
    );
    const handleError = () => {
      image.hidden = true;
      if (fallback) fallback.hidden = false;
    };
    const handleLoad = () => {
      image.hidden = false;
      if (fallback) fallback.hidden = true;
      ScrollTrigger?.refresh();
    };
    on(image, "error", handleError);
    on(image, "load", handleLoad);
    if (image.complete && image.naturalWidth === 0) handleError();
  });

  const media = gsap.matchMedia(root);
  if (!reducedMotion)
    media.add(
      {
        wide: "(min-width: 800px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions.motion) return;
        gsap.from(".tension-title-wrap h1 span", {
          y: 20,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        });
        gsap.from(".tension-pouch-shell", {
          y: 24,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform",
        });
        if (context.conditions.wide) {
          gsap.to(".tension-hero-art", {
            yPercent: 10,
            scale: 1.09,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          gsap.to(".tension-word", {
            yPercent: 35,
            opacity: 0.02,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
          gsap.from(".tension-detail-foil", {
            scale: 1.24,
            yPercent: 9,
            ease: "none",
            scrollTrigger: {
              trigger: ".tension-detail",
              start: "top 95%",
              end: "top 15%",
              scrub: 0.65,
            },
          });
          gsap.from(".tension-detail-pack", {
            y: 42,
            rotation: -5,
            ease: "none",
            scrollTrigger: {
              trigger: ".tension-detail-grid",
              start: "top 90%",
              end: "top 25%",
              scrub: 0.65,
            },
          });
        }
      },
    );

  return () => {
    if (frame) cancelAnimationFrame(frame);
    listeners.forEach((remove) => remove());
    media.revert();
    [
      "--tension-light-x",
      "--tension-turn",
      "--tension-lean",
      "--tension-light-opacity",
    ].forEach((property) => hero.style.removeProperty(property));
    surface.removeAttribute("data-tension-mounted");
  };
}
