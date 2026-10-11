import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function initializeMotion() {
  const hero = document.querySelector(".tension-hero");
  const story = document.querySelector(".tension-story");
  if (!hero || !story) return;
  const scene = story.querySelector(".tension-scene");
  const chapters = [...story.querySelectorAll(".tension-chapter")];
  const bottom = hero.querySelector(".tension-hero-bottom");
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
  const resetStory = () => {
    story.classList.remove("is-story-motion");
    hero.dataset.storyProgress = "0";
    bottom.inert = false;
    bottom.removeAttribute("aria-hidden");
    chapters.forEach((chapter) => {
      chapter.inert = false;
      chapter.removeAttribute("aria-hidden");
    });
    destroyScroll();
  };
  const setup = () => {
    media?.revert();
    resetStory();
    media = gsap.matchMedia();
    media.add(
      {
        wide: "(min-width: 801px)",
        fine: "(pointer: fine)",
        desktopRoom: "(min-width: 801px) and (min-height: 790px)",
        tabletRoom:
          "(min-width: 601px) and (max-width: 800px) and (min-height: 745px)",
        phoneRoom: "(max-width: 600px) and (min-height: 640px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { wide, fine, desktopRoom, tabletRoom, phoneRoom, motion } =
          context.conditions;
        if (
          forcedReduction ||
          !motion ||
          !(desktopRoom || tabletRoom || phoneRoom)
        ) {
          document.documentElement.dataset.motion = "reduced";
          return resetStory;
        }
        document.documentElement.dataset.motion = "enabled";
        story.classList.add("is-story-motion");
        if (wide && fine) {
          lenis = new Lenis({
            autoRaf: false,
            smoothWheel: true,
            syncTouch: false,
            duration: 0.85,
          });
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(tick);
        }
        const updateAccess = (progress) => {
          hero.dataset.storyProgress = progress.toFixed(4);
          const introVisible = progress < 0.18;
          bottom.inert = !introVisible;
          bottom.setAttribute("aria-hidden", String(!introVisible));
          chapters.forEach((chapter, index) => {
            const visible =
              index === 0
                ? progress >= 0.25 && progress < 0.64
                : progress >= 0.71;
            chapter.inert = !visible;
            chapter.setAttribute("aria-hidden", String(!visible));
          });
        };
        gsap.set(chapters, { autoAlpha: 0, y: 28 });
        gsap.set(".story-progress", { autoAlpha: 0 });
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: story,
            pin: scene,
            start: "top top",
            end: () => "+=" + hero.offsetHeight * (wide ? 2.25 : 1.65),
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateAccess(self.progress),
            onRefresh: (self) => {
              lenis?.resize();
              updateAccess(self.progress);
            },
          },
        });
        timeline
          .to(
            ".tension-heading, .tension-statement",
            { y: -28, autoAlpha: 0, duration: 0.18 },
            0.02,
          )
          .to(bottom, { autoAlpha: 0, y: 20, duration: 0.16 }, 0.04)
          .to(".tension-word", { autoAlpha: 0.025, duration: 0.24 }, 0.06)
          .to(
            ".tension-stage",
            {
              x: () => (wide ? -window.innerWidth * 0.225 : 0),
              y: () =>
                wide ? -hero.offsetHeight * 0.015 : -hero.offsetHeight * 0.19,
              scale: () =>
                wide ? 1.12 : window.innerWidth > 600 ? 0.72 : 0.88,
              rotation: -2,
              duration: 0.3,
            },
            0.04,
          )
          .to(
            ".tension-material",
            { xPercent: 3, yPercent: 3, scale: 1.1, duration: 1 },
            0,
          )
          .fromTo(
            hero,
            { "--story-light": "-18%" },
            { "--story-light": "24%", duration: 1 },
            0,
          )
          .to(".story-progress", { autoAlpha: 1, duration: 0.12 }, 0.18)
          .fromTo(
            ".story-progress i",
            { scaleX: 0 },
            { scaleX: 1, duration: 1 },
            0,
          )
          .to(chapters[0], { autoAlpha: 1, y: 0, duration: 0.12 }, 0.24)
          .to(chapters[0], { autoAlpha: 0, y: -24, duration: 0.1 }, 0.58)
          .to(
            ".tension-stage",
            {
              rotation: 1,
              scale: () =>
                wide ? 1.04 : window.innerWidth > 600 ? 0.69 : 0.84,
              duration: 0.36,
            },
            0.58,
          )
          .to(chapters[1], { autoAlpha: 1, y: 0, duration: 0.12 }, 0.7);
        updateAccess(timeline.scrollTrigger.progress);
        // Resolve after the pin has established its spacing, including very early
        // keyboard activation. Native anchor scrolling can retain pre-pin bounds.
        const navigateSection = (event) => {
          const anchor = event.target.closest("a[href]");
          if (
            !anchor ||
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const url = new URL(anchor.href);
          if (
            url.origin !== location.origin ||
            url.pathname !== location.pathname ||
            url.search !== location.search ||
            !url.hash
          )
            return;
          let target;
          try {
            target = document.getElementById(
              decodeURIComponent(url.hash.slice(1)),
            );
          } catch {
            return;
          }
          if (!target) return;
          event.preventDefault();
          ScrollTrigger.refresh();
          lenis?.resize();
          const padding =
            parseFloat(
              getComputedStyle(document.documentElement).scrollPaddingTop,
            ) || 0;
          const top =
            target.getBoundingClientRect().top + window.scrollY - padding;
          if (location.hash !== url.hash) history.pushState(null, "", url.hash);
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.addEventListener(
            "blur",
            () => target.removeAttribute("tabindex"),
            { once: true },
          );
          if (lenis) lenis.scrollTo(top);
        else window.scrollTo({ top, behavior: "instant" });
        };
        document.addEventListener("click", navigateSection);
        return () => {
          document.removeEventListener("click", navigateSection);
          resetStory();
        };
      },
    );
    ScrollTrigger.refresh();
    lenis?.resize();
  };
  setup();
  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
    lenis?.resize();
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const target = id && document.getElementById(id);
    if (target) {
      if (lenis) lenis.scrollTo(target, { immediate: true });
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
    resetStory();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) setup();
  });
}
