const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const forcedReduction =
  new URLSearchParams(location.search).get("motion") === "off";
const canAnimate = () => !reduced.matches && !forcedReduction;
const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";

function initializeLabelTabs() {
  document.querySelectorAll("[data-label-tabs]").forEach((root) => {
    const list = root.querySelector(".label-tabs");
    const tabs = [...root.querySelectorAll("[data-label-tab]")];
    const panels = [...root.querySelectorAll("[data-label-panel]")];
    list.setAttribute("role", "tablist");
    tabs.forEach((tab, index) => {
      tab.id = `${panels[index].id}-tab`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panels[index].id);
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      panels[index].tabIndex = 0;
    });
    const activate = (index) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
    };
    const hashIndex = panels.findIndex(
      (panel) => `#${panel.id}` === location.hash,
    );
    activate(Math.max(0, hashIndex));
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        activate(index);
      });
      tab.addEventListener("keydown", (event) => {
        const keys = {
          ArrowRight: (index + 1) % tabs.length,
          ArrowLeft: (index - 1 + tabs.length) % tabs.length,
          Home: 0,
          End: tabs.length - 1,
        };
        if (!(event.key in keys)) return;
        event.preventDefault();
        const next = keys[event.key];
        activate(next);
        tabs[next].focus({ preventScroll: true });
      });
    });
    window.addEventListener("hashchange", () => {
      const index = panels.findIndex(
        (panel) => `#${panel.id}` === location.hash,
      );
      if (index >= 0) activate(index);
    });
  });
}

function initializePackPreview() {
  const preview = document.querySelector("[data-pack-preview]");
  if (!preview) return;
  const opener = preview.querySelector("[data-open-packaging]");
  const front = preview.querySelector(".pack-preview-front");
  const back = preview.querySelector(".pack-preview-back");
  const controls = [...document.querySelectorAll("[data-pack-view]")];
  const cta = document.querySelector(".wpc-pack-copy [data-open-packaging]");
  back.hidden = false;
  preview.dataset.view = "front";
  back.setAttribute("aria-hidden", "true");
  controls.forEach((control) =>
    control.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      preview.classList.toggle(
        "is-instant",
        !canAnimate() || event.detail === 0,
      );
      const isBack = control.dataset.packView === "back";
      preview.dataset.view = control.dataset.packView;
      front.setAttribute("aria-hidden", String(isBack));
      back.setAttribute("aria-hidden", String(!isBack));
      for (const link of [opener, cta]) {
        link.href = control.href;
        link.dataset.packagingView = control.dataset.packView;
      }
      controls.forEach((link) =>
        link.setAttribute("aria-current", String(link === control)),
      );
    }),
  );
}

function initializeFaqMotion() {
  document.querySelectorAll(".faq-list details").forEach((details) => {
    const summary = details.querySelector("summary");
    const body = document.createElement("div");
    body.className = "faq-answer";
    [...details.childNodes]
      .filter((node) => node !== summary)
      .forEach((node) => body.append(node));
    details.append(body);
    let animation;
    let targetOpen = details.open;
    const finish = () => {
      animation?.cancel();
      animation = undefined;
      details.open = targetOpen;
      details.style.overflow = "";
      body.inert = false;
    };
    summary.addEventListener("click", (event) => {
      if (event.detail === 0 || !canAnimate()) {
        if (animation) finish();
        targetOpen = details.open;
        return; // Native details behaviour for keyboard/reduced motion.
      }
      event.preventDefault();
      const startHeight = details.getBoundingClientRect().height;
      if (!animation) targetOpen = details.open;
      animation?.cancel();
      targetOpen = !targetOpen;
      details.open = true;
      body.inert = !targetOpen;
      const style = getComputedStyle(details);
      const collapsedHeight =
        summary.getBoundingClientRect().height +
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        parseFloat(style.borderTopWidth) +
        parseFloat(style.borderBottomWidth);
      const endHeight = targetOpen
        ? details.getBoundingClientRect().height
        : collapsedHeight;
      details.style.overflow = "hidden";
      animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: 200, easing: easeOut },
      );
      animation.onfinish = finish;
    });
    details.addEventListener("toggle", () => {
      if (!animation) targetOpen = details.open;
    });
    reduced.addEventListener("change", () => {
      if (animation && !canAnimate()) finish();
    });
    window.addEventListener("pagehide", finish);
  });
}

function initializeMindsetReveal() {
  const section = document.querySelector(".trayn-mindset");
  if (!section || !("IntersectionObserver" in window)) return;
  const heading = section.querySelector("h2");
  let animation;
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      if (!canAnimate() || section.contains(document.activeElement)) return;
      section.classList.add("mindset-entered");
      animation = heading.animate(
        [
          { opacity: 0.75, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 450, easing: easeOut },
      );
    },
    { rootMargin: "-12% 0px -12% 0px", threshold: 0.15 },
  );
  observer.observe(heading);
  reduced.addEventListener("change", () => {
    if (!canAnimate()) {
      animation?.cancel();
      section.classList.remove("mindset-entered");
    }
  });
  window.addEventListener("pagehide", () => {
    observer.disconnect();
    animation?.cancel();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) section.classList.remove("mindset-entered");
  });
}

export function initializeInteractions() {
  initializeLabelTabs();
  initializePackPreview();
  initializeFaqMotion();
  initializeMindsetReveal();
}
