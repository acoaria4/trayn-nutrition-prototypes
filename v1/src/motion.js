import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initializeMotion() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  let media;
  const setup = () => {
    media?.revert();
    media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 801px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions.motion) {
          document.documentElement.dataset.motion = "reduced";
          return;
        }
        document.documentElement.dataset.motion = "enabled";
        const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
        timeline
          .from(".hero h1>span", { y: 16, duration: 0.65, stagger: 0.07 }, 0)
          .fromTo(
            ".hero-product",
            { y: 12, rotation: 6.5 },
            { y: 0, rotation: 5, duration: 0.9 },
            0.05,
          );
        if (context.conditions.desktop) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            })
            .to(
              ".hero-pouch",
              { y: -65, rotation: -4, scale: 1.04, ease: "none" },
              0,
            )
            .to(".stage-light", { y: 65, opacity: 0.35, ease: "none" }, 0);
        }
      },
      hero,
    );
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    const pouch = hero.querySelector("img");
    if (!pouch.complete)
      pouch.addEventListener("load", () => ScrollTrigger.refresh(), {
        once: true,
      });
  };
  setup();
  window.addEventListener("pagehide", () => media?.revert());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) setup();
  });
}
