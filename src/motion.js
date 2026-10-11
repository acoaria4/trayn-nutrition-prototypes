import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function initializeMotion() {
  const hero = document.querySelector(".tension-hero");
  if (!hero) return;
  const forcedReduction =
    new URLSearchParams(location.search).get("motion") === "off";
  let media;
  let lenis;
  const tick = (time) => lenis?.raf(time * 1000);
  const destroyScroll = () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = undefined;
  };
  const setup = () => {
    media?.revert();
    destroyScroll();
    media = gsap.matchMedia();
    media.add(
      {
        wide: "(min-width: 801px)",
        fine: "(pointer: fine)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (forcedReduction || !context.conditions.motion) {
          document.documentElement.dataset.motion = "reduced";
          return;
        }
        document.documentElement.dataset.motion = "enabled";
        if (context.conditions.wide && context.conditions.fine) {
          lenis = new Lenis({
            autoRaf: false,
            smoothWheel: true,
            syncTouch: false,
            duration: 0.85,
          });
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
        }
        gsap.from(".tension-heading h1 span", {
          y: 22,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        });
        // Separate wrappers keep intro/scroll transforms independent of manual lighting.
        gsap.from(".tension-stage", {
          y: 28,
          duration: 0.95,
          ease: "power3.out",
          clearProps: "transform",
        });
        if (context.conditions.wide) {
          gsap.to(".tension-material", {
            yPercent: 9,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          gsap.to(".tension-word", {
            yPercent: 25,
            opacity: 0.02,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
          gsap.from(".detail-crop", {
            y: 45,
            rotation: -4,
            ease: "none",
            scrollTrigger: {
              trigger: "#blend",
              start: "top 85%",
              end: "top 15%",
              scrub: 0.65,
            },
          });
          gsap.from(".detail-foil", {
            scale: 1.13,
            ease: "none",
            scrollTrigger: {
              trigger: "#blend",
              start: "top 95%",
              end: "bottom bottom",
              scrub: 0.65,
            },
          });
        }
        document
          .querySelectorAll(
            "#blend h2, #flavors h2, #story h2, .contact-intro h2",
          )
          .forEach((heading) => {
            gsap.from(heading, {
              y: 24,
              duration: 0.75,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: { trigger: heading, start: "top 90%", once: true },
            });
          });
        return destroyScroll;
      },
    );
    ScrollTrigger.refresh();
  };
  setup();
  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
    // A delayed motion import must not displace a directly opened section URL.
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const target = id && document.getElementById(id);
    if (target) {
      if (lenis) lenis.scrollTo(target, { immediate: true, offset: -100 });
      else target.scrollIntoView({ behavior: "instant", block: "start" });
    }
  });
  document.querySelectorAll("main img").forEach((image) => {
    if (!image.complete)
      image.addEventListener("load", () => ScrollTrigger.refresh(), {
        once: true,
      });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      gsap.ticker.remove(tick);
      lenis?.stop();
    } else if (lenis) {
      lenis.start();
      gsap.ticker.add(tick);
      ScrollTrigger.refresh();
    }
  });
  window.addEventListener("pagehide", () => {
    media?.revert();
    destroyScroll();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) setup();
  });
}
