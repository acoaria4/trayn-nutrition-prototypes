import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initializeFlavourMotion() {
  const section = document.querySelector(".purchase-section--flavour");
  const stage = section?.querySelector(".purchase-art-stage");
  if (!stage) return;
  let media;
  const setup = () => {
    media?.revert();
    media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (new URLSearchParams(location.search).get("motion") === "off") return;
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
