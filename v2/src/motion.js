import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// Preserve the original 1000px desktop pacing (906px hero × 2.25), on every screen.
const STORY_SCROLL_DISTANCE = 2040;
export function initializeMotion() {
  const hero = document.querySelector(".tension-hero");
  const story = document.querySelector(".tension-story");
  if (!hero || !story) return;
  const scene = story.querySelector(".tension-scene");
  const stage = hero.querySelector(".tension-stage");
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
        room: "(min-height: 520px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { wide, fine, room, motion } = context.conditions;
        if (forcedReduction || !motion || !room) {
          document.documentElement.dataset.motion = "reduced";
          return resetStory;
        }
        document.documentElement.dataset.motion = "enabled";
        story.classList.add("is-story-motion");
        if (fine) {
          lenis = new Lenis({
            autoRaf: false,
            smoothWheel: true,
            syncTouch: false,
            duration: 0.85,
          });
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(tick);
        }
        const chapterScale = () =>
          Math.min(
            window.innerWidth > 600 ? 0.72 : 0.88,
            (chapters[0].offsetTop - 60) / stage.offsetHeight,
          );
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
            start: () =>
              `top ${document.querySelector(".site-header").offsetHeight}px`,
            end: `+=${STORY_SCROLL_DISTANCE}`,
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
            ".tension-heading",
            { y: -28, autoAlpha: 0, duration: 0.18 },
            0.02,
          )
          .to(bottom, { autoAlpha: 0, y: 20, duration: 0.16 }, 0.04)
          .to(
            ".tension-stage",
            {
              x: () => (wide ? -window.innerWidth * 0.225 : 0),
              y: () => {
                if (wide) return -hero.offsetHeight * 0.015;
                const scale = chapterScale();
                const chapterTop = chapters[0].offsetTop;
                // Fit the pouch above the chapter, including shorter phone windows.
                return (
                  chapterTop -
                  30 -
                  (stage.offsetHeight * scale) / 2 -
                  (stage.offsetTop + stage.offsetHeight / 2)
                );
              },
              scale: () => (wide ? 1.12 : chapterScale()),
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
            ".tension-sheen",
            { xPercent: -60 },
            { xPercent: 60, duration: 0.58 },
            0.36,
          )
          .to(".tension-sheen", { opacity: 0.18, duration: 0.06 }, 0.36)
          .to(".tension-sheen", { opacity: 0, duration: 0.06 }, 0.94)
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
              scale: () => (wide ? 1.04 : chapterScale() * 0.95),
              duration: 0.36,
            },
            0.58,
          )
          .to(chapters[1], { autoAlpha: 1, y: 0, duration: 0.12 }, 0.7);
        updateAccess(timeline.scrollTrigger.progress);
        // Keep pin bounds and spacing in sync with the dynamic-height material,
        // including small touch resizes that ScrollTrigger ignores by default.
        let viewportFrame;
        let previousHeight = hero.offsetHeight;
        const viewportObserver = new ResizeObserver(() => {
          const height = hero.offsetHeight;
          if (height === previousHeight) return;
          previousHeight = height;
          cancelAnimationFrame(viewportFrame);
          viewportFrame = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        });
        viewportObserver.observe(hero);
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
          viewportObserver?.disconnect();
          cancelAnimationFrame(viewportFrame);
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
