import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const motionOff = new URLSearchParams(location.search).get("motion") === "off";

export function initializeChapterMotion({ header }) {
  const poster = document.querySelector(".mindset-poster");
  const art = document.querySelector(".packaging-art");
  const packaging = document.querySelector(".chapter-packaging");
  let media;
  const setup = () => {
    media?.revert();
    media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 900px)",
      },
      (context) => {
        if (!context.conditions.motion || motionOff) return;
        const wide = context.conditions.desktop;
        const type = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: poster,
            start: "top 95%",
            end: () => `top top+=${header.offsetHeight + 140}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              poster.dataset.motionProgress = self.progress.toFixed(3);
            },
          },
        });
        type
          .fromTo(
            ".mindset-get",
            { xPercent: wide ? -22 : -14, scale: 1.08 },
            { xPercent: 0, scale: 1, duration: 0.82 },
            0,
          )
          .fromTo(
            ".mindset-built",
            { xPercent: wide ? 22 : 14, scale: 1.08 },
            { xPercent: 0, scale: 1, duration: 0.82 },
            0,
          )
          .fromTo(
            ".mindset-rule",
            { scaleX: 0.15 },
            { scaleX: 1, duration: 0.22 },
            0.78,
          );

        const reveal = gsap.fromTo(
          ".packaging-reveal",
          { scale: wide ? 3.2 : 2.8 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: art,
              start: "top 95%",
              end: () => `top top+=${header.offsetHeight + 40}`,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                art.dataset.revealProgress = self.progress.toFixed(3);
              },
            },
          },
        );
        // Give an inspection decision priority over decorative scroll motion.
        // No layout or scroll position changes: only the existing zoom settles.
        const settle = (event) => {
          if (!event.target.closest("[data-study-view], [data-study-inspect]"))
            return;
          reveal.progress(1);
          reveal.scrollTrigger.disable(false);
          art.dataset.revealProgress = "1";
        };
        packaging.addEventListener("focusin", settle);
        packaging.addEventListener("pointerdown", settle);
        return () => {
          packaging.removeEventListener("focusin", settle);
          packaging.removeEventListener("pointerdown", settle);
          poster.removeAttribute("data-motion-progress");
          art.removeAttribute("data-reveal-progress");
        };
      },
    );
  };
  setup();
  window.addEventListener("pagehide", () => media?.revert());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) setup();
  });
}
