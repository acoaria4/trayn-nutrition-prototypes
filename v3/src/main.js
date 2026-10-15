import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initializeInteractions } from "./interactions.js";
import { initializeFullPageMotion } from "./motion.js";

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const forcedReduction =
  new URLSearchParams(location.search).get("motion") === "off";
const story = document.querySelector(".study-story");
const header = document.querySelector(".study-header");
const first = document.querySelector(".chapter-mindset");
const second = document.querySelector(".chapter-packaging");
const product = document.querySelector(".study-product");
let trigger;
let media;
const measureHeader = () =>
  document.documentElement.style.setProperty(
    "--header-height",
    `${header.offsetHeight}px`,
  );
const headerObserver = new ResizeObserver(measureHeader);
headerObserver.observe(header);
measureHeader();

document.querySelectorAll("[data-study-back]").forEach((image) => {
  image.hidden = false;
});
document.querySelectorAll("[data-study-view]").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    const back = link.dataset.studyView === "back";
    document.body.classList.toggle(
      "is-instant",
      reduced.matches || forcedReduction || event.detail === 0,
    );
    document.body.dataset.packView = back ? "back" : "front";
    document
      .querySelectorAll("[data-study-front]")
      .forEach((image) => image.setAttribute("aria-hidden", String(back)));
    document
      .querySelectorAll("[data-study-back]")
      .forEach((image) => image.setAttribute("aria-hidden", String(!back)));
    document
      .querySelectorAll("[data-study-view]")
      .forEach((control) =>
        control.setAttribute("aria-current", String(control === link)),
      );
    document.querySelector("[data-study-inspect]").href = link.href;
  }),
);

const restore = () => {
  document.body.classList.remove("is-cinematic");
  first.inert = false;
  second.inert = false;
  first.removeAttribute("aria-hidden");
  second.removeAttribute("aria-hidden");
  trigger = undefined;
  story.dataset.studyProgress = "0";
};
const setup = () => {
  media?.revert();
  restore();
  media = gsap.matchMedia();
  media.add(
    {
      desktop: "(min-width: 900px) and (min-height: 620px)",
      motion: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      if (!context.conditions.motion || forcedReduction) return;
      if (context.conditions.desktop) {
        document.body.classList.add("is-cinematic");
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: story,
            start: () => `top top+=${header.offsetHeight}`,
            end: "+=1800",
            pin: true,
            refreshPriority: 5,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              story.dataset.scrollStart = String(self.start);
              story.dataset.scrollEnd = String(self.end);
            },
            onUpdate: (self) => {
              story.dataset.studyProgress = self.progress.toFixed(3);
              first.inert = self.progress > 0.48;
              second.inert = self.progress < 0.78;
              first.setAttribute("aria-hidden", String(self.progress > 0.48));
              second.setAttribute("aria-hidden", String(self.progress < 0.78));
            },
          },
        });
        trigger = timeline.scrollTrigger;
        story.dataset.scrollDistance = "1800";
        gsap.set(second, { autoAlpha: 0 });
        gsap.set(".study-copy-shade", { opacity: 0 });
        timeline
          .to(
            ".foil-far",
            { xPercent: -10, yPercent: -8, scale: 1.12, duration: 1 },
            0,
          )
          .to(
            ".stream-far",
            { xPercent: -48, yPercent: 28, rotation: -12, duration: 0.8 },
            0,
          )
          .to(
            ".stream-near",
            { xPercent: 32, yPercent: -34, rotation: 6, duration: 0.85 },
            0.05,
          )
          .to(first, { xPercent: -22, autoAlpha: 0, duration: 0.32 }, 0.15)
          .to(
            product,
            {
              x: () => -story.clientWidth * 0.25,
              scale: 1.18,
              rotation: -5,
              duration: 0.4,
            },
            0.12,
          )
          .to(
            product,
            {
              x: () => -story.clientWidth * 0.47,
              scale: 1.12,
              rotation: -8,
              y: () => story.clientHeight * 0.01,
              duration: 0.3,
            },
            0.52,
          )
          .to(".study-copy-shade", { opacity: 1, duration: 0.2 }, 0.55)
          .fromTo(
            second,
            { x: 45, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.2 },
            0.58,
          )
          .fromTo(
            ".scene-progress i",
            { scaleX: 0 },
            { scaleX: 1, duration: 1 },
            0,
          );
        // A stable final beat leaves the pack controls available before unpinning.
        timeline.to({}, { duration: 0.18 }, 0.82);
        first.inert = trigger.progress > 0.48;
        second.inert = trigger.progress < 0.78;
        return restore;
      }
      // Phones retain natural, content-sized chapters. Only the art is scrubbed;
      // headings, labels and controls remain in normal document flow.
      document.querySelectorAll(".chapter-art").forEach((art) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: art,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          defaults: { ease: "none" },
        });
        timeline
          .fromTo(
            art.querySelector(".mobile-foil"),
            { scale: 1.18, yPercent: -6 },
            { scale: 1.04, yPercent: 6, duration: 1 },
            0,
          )
          .fromTo(
            art.querySelector(".mobile-stream"),
            { xPercent: 16, rotation: -8 },
            { xPercent: -18, rotation: 8, duration: 1 },
            0,
          )
          .fromTo(
            art.querySelector(".mobile-product"),
            { rotation: 4, yPercent: 7, scale: 0.97 },
            { rotation: -3, yPercent: -5, scale: 1.06, duration: 1 },
            0,
          );
      });
    },
  );
};
initializeFullPageMotion({ header });
setup();
initializeInteractions();

document.querySelectorAll("[data-study-jump]").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !trigger
    )
      return;
    event.preventDefault();
    const progress = Number(link.dataset.studyJump);
    const target = progress ? second : first;
    history.replaceState(null, "", link.hash);
    scrollTo({
      top: trigger.start + 1800 * progress,
      behavior: event.detail === 0 ? "instant" : "smooth",
    });
    if (event.detail === 0) {
      ScrollTrigger.update();
      target.inert = false;
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }),
);

const pose = document.querySelector(".product-pose");
story.addEventListener("pointermove", (event) => {
  if (
    !document.body.classList.contains("is-cinematic") ||
    !matchMedia("(hover: hover) and (pointer: fine)").matches ||
    reduced.matches
  )
    return;
  const rect = story.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  pose.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg)`;
});
const resetPose = () => {
  pose.style.transform = "";
};
story.addEventListener("pointerleave", resetPose);
reduced.addEventListener("change", resetPose);
const restoreAnchor = () => {
  if (!location.hash) return;
  ScrollTrigger.refresh();
  if (trigger && ["#mindset", "#packaging"].includes(location.hash)) {
    scrollTo(
      0,
      trigger.start + (location.hash === "#packaging" ? 1800 * 0.88 : 0),
    );
    return;
  }
  const target = document.getElementById(
    decodeURIComponent(location.hash.slice(1)),
  );
  target?.scrollIntoView({ block: "start", behavior: "instant" });
};
window.addEventListener("hashchange", restoreAnchor);
document.fonts.ready.then(() => {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  restoreAnchor();
});
document.querySelectorAll("main img").forEach((image) =>
  image.addEventListener("load", () => ScrollTrigger.refresh(), {
    once: true,
  }),
);
window.addEventListener("pagehide", () => {
  media?.revert();
  restore();
  resetPose();
  headerObserver.disconnect();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    headerObserver.observe(header);
    setup();
  }
});
