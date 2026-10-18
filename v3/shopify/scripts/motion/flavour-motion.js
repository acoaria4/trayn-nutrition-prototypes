import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initializeFlavourMotion({ header }) {
  const section = document.querySelector(".purchase-section--flavour");
  const stage = section?.querySelector(".purchase-art-stage");
  if (!stage) return;
  let media;
  const setup = () => {
    media?.revert();
    media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 900px)",
    }, ({ conditions }) => {
      if (!conditions.motion) return;
      if (new URLSearchParams(location.search).get("motion") === "off") return;
      if (!conditions.desktop) {
        const titles = section.querySelectorAll(".purchase-copy h2 > span, .purchase-copy h1");
        const entrance = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            end: () => `top top+=${header.offsetHeight + 24}`,
            scrub: true,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              stage.style.willChange = self.isActive ? "transform" : "";
            },
          },
        });
        entrance
          .fromTo(stage, { x: 42, y: 12, rotation: -3, scale: 1.08 },
            { x: 0, y: 0, rotation: 0, scale: 1, duration: 1 }, 0)
          .fromTo(titles, { x: (index) => index % 2 ? 20 : -20 },
            { x: 0, duration: 0.75 }, 0);
        const settle = (event) => {
          if (!event.target.closest("a, button, input, select, textarea")) return;
          entrance.progress(1);
          entrance.scrollTrigger.disable(false);
          stage.style.willChange = "";
        };
        section.addEventListener("focusin", settle);
        section.addEventListener("pointerdown", settle);
        return () => {
          stage.style.willChange = "";
          section.removeEventListener("focusin", settle);
          section.removeEventListener("pointerdown", settle);
        };
      }
      gsap.fromTo(stage, { y: 18 }, {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onToggle: (self) => { stage.style.willChange = self.isActive ? "transform" : ""; },
        },
      });
      return () => { stage.style.willChange = ""; };
    });
  };
  setup();
  window.addEventListener("pagehide", () => media?.revert());
  window.addEventListener("pageshow", (event) => { if (event.persisted) setup(); });
}
