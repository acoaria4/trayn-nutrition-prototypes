import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const motionOff = new URLSearchParams(location.search).get("motion") === "off";

export function initializeLowerMotion({ header }) {
  const label = document.querySelector(".label-assembly");
  const reader = document.querySelector(".label-reader");
  const email = document.querySelector(".contact-email");
  let media;
  const setup = () => {
    media?.revert();
    media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 900px)",
      },
      ({ conditions }) => {
        if (!conditions.motion || motionOff) return;
        const wide = conditions.desktop;
        const assembly = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: label,
            start: "top 95%",
            end: () => `top top+=${header.offsetHeight + 100}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              label.dataset.assemblyProgress = self.progress.toFixed(3);
            },
          },
        });
        assembly
          .fromTo(
            ".label-fold-left",
            { rotationY: wide ? -68 : -52, xPercent: -16, rotation: -4 },
            { rotationY: 0, xPercent: 0, rotation: 0, duration: 0.8 },
            0,
          )
          .fromTo(
            ".label-fold-right",
            { rotationY: wide ? 68 : 52, xPercent: 16, rotation: 4 },
            { rotationY: 0, xPercent: 0, rotation: 0, duration: 0.8 },
            0,
          )
          .fromTo(
            ".label-fold-center",
            { yPercent: 7, scaleY: 0.94 },
            { yPercent: 0, scaleY: 1, duration: 0.8 },
            0,
          )
          .fromTo(".label-region", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.8);

        const settleLabel = () => {
          assembly.progress(1);
          assembly.scrollTrigger.disable(false);
          label.dataset.assemblyProgress = "1";
        };
        reader.addEventListener("focusin", settleLabel);
        reader.addEventListener("pointerdown", settleLabel);
        reader.addEventListener("labelselect", settleLabel);

        const rules = [];
        document.querySelectorAll(".faq-rule").forEach((rule) => {
          const details = rule.closest("details");
          const tween = gsap.fromTo(rule, { scaleX: 0.08 }, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: details,
              start: "top 95%",
              end: "top 72%",
              scrub: true,
            },
          });
          const settle = () => {
            tween.progress(1);
            tween.scrollTrigger.disable(false);
          };
          const summary = details.querySelector("summary");
          summary.addEventListener("focusin", settle);
          summary.addEventListener("pointerdown", settle);
          rules.push(() => {
            summary.removeEventListener("focusin", settle);
            summary.removeEventListener("pointerdown", settle);
          });
        });

        const closing = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: email,
            start: "top 95%",
            end: "clamp(top 65%)",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              email.dataset.closingProgress = self.progress.toFixed(3);
            },
          },
        });
        closing
          .fromTo(".contact-stroke-red", {
            xPercent: -35, y: wide ? 65 : 40, rotation: -12, scaleX: 0.45,
          }, { xPercent: 0, y: 0, rotation: 0, scaleX: 1, duration: 0.8 }, 0)
          .fromTo(".contact-stroke-silver", {
            xPercent: 35, y: wide ? 65 : 40, rotation: 12, scaleX: 0.45,
          }, { xPercent: 0, y: 0, rotation: 0, scaleX: 1, duration: 0.8 }, 0)
          .fromTo(".contact-arrow-flight", { x: 0, y: 0 }, { x: 8, y: -8, duration: 0.1 }, 0.8)
          .to(".contact-arrow-flight", { x: 0, y: 0, duration: 0.1 }, 0.9);
        const settleContact = () => {
          closing.progress(1);
          closing.scrollTrigger.disable(false);
          email.dataset.closingProgress = "1";
        };
        email.addEventListener("focusin", settleContact);
        email.addEventListener("pointerdown", settleContact);
        return () => {
          reader.removeEventListener("focusin", settleLabel);
          reader.removeEventListener("pointerdown", settleLabel);
          reader.removeEventListener("labelselect", settleLabel);
          email.removeEventListener("focusin", settleContact);
          email.removeEventListener("pointerdown", settleContact);
          rules.forEach((remove) => remove());
          label.removeAttribute("data-assembly-progress");
          email.removeAttribute("data-closing-progress");
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
