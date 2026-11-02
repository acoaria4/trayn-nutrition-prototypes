import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const HERO_DISTANCE = 2040;
const motionOff = new URLSearchParams(location.search).get("motion") === "off";

export function initializeFullPageMotion({ header }) {
  const story = document.querySelector(".hero-story");
  const scene = story.querySelector(".hero-scene");
  const opening = story.querySelector(".hero-opening");
  const flavour = story.querySelector(".hero-flavour");
  let media;
  let resizeObserver;
  let refreshFrame;
  const restore = () => {
    document.body.classList.remove("has-hero-motion");
    [opening, flavour].forEach((el) => {
      el.inert = false;
      el.removeAttribute("aria-hidden");
    });
    resizeObserver?.disconnect();
    cancelAnimationFrame(refreshFrame);
  };
  const setup = () => {
    media?.revert();
    restore();
    media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        room: "(min-height: 520px)",
        desktop: "(min-width: 900px)",
      },
      (context) => {
        if (!context.conditions.motion || motionOff) return;
        const desktop = context.conditions.desktop;
        if (context.conditions.room) {
          document.body.classList.add("has-hero-motion");
          gsap.set(flavour, { autoAlpha: 0 });
          flavour.inert = true;
          flavour.setAttribute("aria-hidden", "true");
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: story,
              start: () => `top top+=${header.offsetHeight}`,
              end: `+=${HERO_DISTANCE}`,
              pin: scene.parentElement,
              refreshPriority: 10,
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                story.dataset.scrollStart = String(self.start);
                story.dataset.scrollEnd = String(self.end);
              },
              onUpdate: (self) => {
                story.dataset.heroProgress = self.progress.toFixed(3);
                opening.inert = self.progress > 0.38;
                flavour.inert = self.progress < 0.61;
                opening.setAttribute("aria-hidden", String(opening.inert));
                flavour.setAttribute("aria-hidden", String(flavour.inert));
              },
            },
          });
          story.dataset.scrollDistance = String(HERO_DISTANCE);
          timeline
            .to(".hero-foil", { scale: 1.1, xPercent: -4, duration: 1 }, 0)
            .to(
              ".hero-stream",
              {
                xPercent: desktop ? -24 : -12,
                yPercent: 18,
                rotation: -6,
                duration: 0.8,
              },
              0.05,
            )
            .to(
              [opening, scene.querySelector(".hero-scroll")],
              { autoAlpha: 0, x: desktop ? -45 : 0, duration: 0.2 },
              0.15,
            )
            .to(
              ".hero-product",
              {
                x: () => (desktop ? -scene.clientWidth * 0.48 : 0),
                y: () => (desktop ? 0 : scene.clientHeight * 0.04),
                rotation: desktop ? -7 : -4,
                scale: desktop ? 0.96 : 0.88,
                duration: 0.36,
              },
              0.1,
            )
            // Light arrives after the first movement; no idle spotlight on load.
            .to(".hero-light", { opacity: 0.7, duration: 0.08 }, 0.49)
            .fromTo(
              ".hero-light",
              { xPercent: -120 },
              { xPercent: 120, duration: 0.27 },
              0.49,
            )
            .to(".hero-light", { opacity: 0, duration: 0.08 }, 0.76)
            .to(flavour, { autoAlpha: 1, duration: 0.18 }, 0.45)
            .fromTo(
              ".hero-bottom i",
              { scaleX: 0 },
              { scaleX: 1, duration: 1 },
              0,
            );
          let lastHeight = scene.offsetHeight;
          resizeObserver = new ResizeObserver(() => {
            const height = scene.offsetHeight;
            if (height === lastHeight) return;
            lastHeight = height;
            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
          });
          resizeObserver.observe(scene);
        }
        return restore;
      },
    );
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  };
  setup();
  window.addEventListener("pagehide", () => {
    media?.revert();
    restore();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) setup();
  });
}
