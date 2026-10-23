import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const motionOff = new URLSearchParams(location.search).get("motion") === "off";

export function initializeLowerMotion({ header }) {
  const product = document.querySelector(".product-section");
  const curtain = product.querySelector(".product-curtain");
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
        const usableHeight = () => innerHeight - header.offsetHeight;
        gsap.set(curtain, { display: "block" });
        const takeover = gsap.fromTo(curtain, { xPercent: 0 }, {
          xPercent: 100,
          ease: "none",
          scrollTrigger: {
            trigger: product.querySelector(".product-intro"),
            start: () => `top top+=${header.offsetHeight + Math.round(usableHeight() * 0.72)}`,
            end: () => `top top+=${header.offsetHeight + Math.round(usableHeight() * 0.24)}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              product.dataset.takeoverProgress = self.progress.toFixed(3);
            },
          },
        });
        const settleProduct = (event) => {
          if (event.type === "pointerdown" &&
              !event.target.closest("a, button, input, select, textarea, summary, [role='tab']")) return;
          takeover.progress(1);
          takeover.scrollTrigger.disable(false);
          product.dataset.takeoverProgress = "1";
        };
        product.addEventListener("focusin", settleProduct);
        product.addEventListener("pointerdown", settleProduct);

        const rules = [];
        document.querySelectorAll(".faq-rule").forEach((rule) => {
          const details = rule.closest("details");
          const tween = gsap.fromTo(rule, { scaleX: 0.08 }, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: details ?? rule.parentElement,
              start: "top 95%",
              end: "top 72%",
              scrub: true,
            },
          });
          const settle = () => {
            tween.progress(1);
            tween.scrollTrigger.disable(false);
          };
          // The final divider has its own scroll trigger after the last row.
          if (!details) return;
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
          product.removeEventListener("focusin", settleProduct);
          product.removeEventListener("pointerdown", settleProduct);
          email.removeEventListener("focusin", settleContact);
          email.removeEventListener("pointerdown", settleContact);
          rules.forEach((remove) => remove());
          product.removeAttribute("data-takeover-progress");
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
