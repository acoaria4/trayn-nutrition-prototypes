import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initializeSmoothScroll() {
  const media = matchMedia("(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const root = document.documentElement;
  let scroll;
  const tick = (time) => scroll?.raf(time * 1000);
  const reset = () => scroll?.reset();
  const lock = () => {
    if (!scroll) return;
    if (document.hidden || ["hidden", "clip"].includes(root.style.overflow)) scroll.stop();
    else scroll.start();
  };
  const destroy = () => {
    gsap.ticker.remove(tick);
    scroll?.destroy();
    scroll = undefined;
  };
  const setup = () => {
    destroy();
    if (!media.matches || window.Shopify?.designMode || new URLSearchParams(location.search).get("motion") === "off") return;
    scroll = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.18,
      wheelMultiplier: 1,
      anchors: false,
      prevent: (node) => node.matches("dialog, [data-lenis-prevent], input, select, textarea"),
    });
    scroll.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    lock();
  };
  const resize = () => scroll?.resize();
  ScrollTrigger.addEventListener("refresh", resize);
  media.addEventListener("change", setup);
  new MutationObserver(lock).observe(root, { attributes: true, attributeFilter: ["style"] });
  document.addEventListener("visibilitychange", lock);
  document.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Escape"].includes(event.key)) reset();
  }, true);
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (link?.hash && link.origin === location.origin && link.pathname === location.pathname) reset();
  }, true);
  window.addEventListener("hashchange", reset);
  window.addEventListener("pagehide", destroy);
  window.addEventListener("pageshow", (event) => { if (event.persisted) setup(); });
  setup();
}
