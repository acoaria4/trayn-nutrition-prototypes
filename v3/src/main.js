import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initializeInteractions } from "./interactions.js";
import { initializeFullPageMotion } from "./motion.js";
import { initializeChapterMotion } from "./chapter-motion.js";
import { initializeLowerMotion } from "./lower-motion.js";

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const forcedReduction =
  new URLSearchParams(location.search).get("motion") === "off";
const header = document.querySelector(".study-header");
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

initializeFullPageMotion({ header });
initializeChapterMotion({ header });
initializeInteractions();
initializeLowerMotion({ header });

const restoreAnchor = () => {
  if (!location.hash) return;
  ScrollTrigger.refresh();
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
window.addEventListener("pagehide", () => headerObserver.disconnect());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) headerObserver.observe(header);
});
