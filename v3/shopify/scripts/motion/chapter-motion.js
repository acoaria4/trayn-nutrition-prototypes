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
        const usableHeight = () => innerHeight - header.offsetHeight;
        const hold = ScrollTrigger.create({
          trigger: poster.parentElement,
          start: () => `top top+=${Math.round(header.offsetHeight + Math.max(16, (usableHeight() - poster.offsetHeight) / 2))}`,
          end: wide ? "+=640" : "+=420",
          pin: poster.parentElement,
          pinSpacing: true,
          refreshPriority: 5,
          invalidateOnRefresh: true,
        });
        const entryDistance = () => Math.round(Math.min(200, usableHeight() * 0.3));
        const travel = () => Math.min(wide ? 280 : 150, poster.clientWidth * (wide ? 0.24 : 0.48));
        const type = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: poster.parentElement,
            start: () => hold.start - entryDistance(),
            end: () => hold.end,
            refreshPriority: 4,
            onRefresh: (self) => {
              poster.dataset.motionStart = String(self.start);
              poster.dataset.motionEnd = String(self.end);
              poster.dataset.holdStart = String(hold.start);
              poster.dataset.holdEnd = String(hold.end);
            },
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              poster.dataset.motionProgress = self.progress.toFixed(3);
              poster.querySelectorAll(".mindset-word").forEach(word => {
                word.dataset.motionProgress = self.progress.toFixed(3);
              });
            },
          },
        });
        type
          .fromTo(".mindset-get",
            { x: () => -travel() },
            { x: 0, duration: 0.85 }, 0,
          )
          .fromTo(".mindset-built",
            { x: travel },
            { x: 0, duration: 0.85 }, 0,
          )
          .fromTo(".mindset-rule",
            { scaleX: 0.05 }, { scaleX: 1, duration: 0.2 }, 0.8,
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
          ["motionStart", "motionEnd", "holdStart", "holdEnd"].forEach(key => delete poster.dataset[key]);
          poster.querySelectorAll(".mindset-word").forEach(word => word.removeAttribute("data-motion-progress"));
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
