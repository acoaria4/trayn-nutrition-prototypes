import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./base.css";

gsap.registerPlugin(ScrollTrigger);
const assets = import.meta.glob("./assets/*.{webp,woff2}", {
  eager: true,
  query: "?url",
  import: "default",
});
const asset = (name) => {
  const value = assets[`./assets/${name}`];
  if (!value) throw new Error(`Missing prototype asset: ${name}`);
  return value;
};
const loaders = import.meta.glob("./{quiet,tension,flavour}.js");
const directionFiles = ["./quiet.js", "./tension.js", "./flavour.js"];
const titles = ["The Quiet Before", "Under Tension", "The Flavour Study"];
const i = Math.max(
  0,
  Math.min(
    2,
    (parseInt(
      document.body.dataset.variant ||
        new URLSearchParams(location.search).get("v"),
      10,
    ) || 1) - 1,
  ),
);
const direction = await loaders[directionFiles[i]]();
const root = document.querySelector("#experience-content");
document.title = `${titles[i]} — TRAYN`;
document.body.dataset.variant = String(i + 1);
if (!root.querySelector("main"))
  root.innerHTML = direction.render({
    asset,
    logo: asset("trayn-logo.webp"),
    pouch: asset("pouch.webp"),
    backPouch: asset("pouch-back.webp"),
  });

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const forceReduced =
  new URLSearchParams(location.search).get("motion") === "off";
let lenis;
let cleanup;
const tick = (time) => lenis?.raf(time * 1000);
function scrollTo(target) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;
  if (lenis) lenis.scrollTo(element, { duration: 0.85 });
  else element.scrollIntoView({ behavior: "instant", block: "start" });
}
function setup() {
  const reducedMotion = forceReduced || reduce.matches;
  cleanup?.();
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = undefined;
  if (!reducedMotion && matchMedia("(pointer: fine)").matches) {
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
  document.documentElement.dataset.motion = reducedMotion
    ? "reduced"
    : "enabled";
  cleanup = direction.mount(root, {
    gsap,
    ScrollTrigger,
    reducedMotion,
    scrollTo,
    asset,
  });
  ScrollTrigger.refresh();
}
setup();
reduce.addEventListener("change", setup);
root.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
    return;
  const href = link.getAttribute("href");
  if (href.length < 2) return;
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();
  scrollTo(target);
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});
document.fonts.ready.then(() => ScrollTrigger.refresh());
root.querySelectorAll("img").forEach((img) => {
  if (!img.complete)
    img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
});
document.addEventListener("keydown", (event) => {
  if (window.parent === window) return;
  if (
    /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) ||
    event.target.isContentEditable ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  )
    return;
  if (
    /^[123rR]$/.test(event.key) ||
    ["ArrowLeft", "ArrowRight"].includes(event.key)
  ) {
    // Preserve arrow navigation on custom radio/tab controls.
    if (event.target.closest('[role="tablist"], [role="radiogroup"]')) return;
    event.preventDefault();
    window.parent.postMessage(
      { type: "proto:key", key: event.key },
      location.origin,
    );
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    gsap.ticker.remove(tick);
    lenis?.stop();
  } else {
    lenis?.start();
    if (lenis) gsap.ticker.add(tick);
    ScrollTrigger.refresh();
  }
});
window.addEventListener("pagehide", () => {
  cleanup?.();
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = undefined;
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) setup();
});

// Read-only evidence used by the local prototype review.
window.__prototypeReview = () => ({
  variant: i + 1,
  reducedMotion: forceReduced || reduce.matches,
  smoothScroll: Boolean(lenis),
  triggers: ScrollTrigger.getAll().length,
  runningAnimations: gsap.globalTimeline
    .getChildren()
    .filter((t) => t.isActive()).length,
  images: [...root.querySelectorAll("img")].map((img) => ({
    src: img.currentSrc,
    loaded: img.complete && img.naturalWidth > 0,
  })),
});
