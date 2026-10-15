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

// Each composition gets its own entrance: on a phone the copy may be a full
// screen below its heading or image. No hidden "waiting for JS" state, no pin.
function initializeSectionSequence() {
  if (!("IntersectionObserver" in window)) return;
  const groups = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const group = groups.get(entry.target);
        if (!canAnimate()) continue;
        entry.target.dataset.entrance = "running";
        group.play(group.animate);
        Promise.allSettled([...group.animations].map((a) => a.finished)).then(
          () => {
            entry.target.dataset.entrance = "complete";
          },
        );
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
  );
  const register = (target, play) => {
    if (!target) return;
    const animations = new Set();
    const finish = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const animate = (element, frames, duration, delay = 0) => {
      const animation = element.animate(frames, {
        duration,
        delay,
        easing: easeOut,
        fill: "backwards",
      });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    groups.set(target, { play, animate, animations, finish });
    // Focusing an actual control or touching the pouch settles its entrance.
    // A navigation anchor focusing the section itself must NOT skip the reveal.
    target.addEventListener("focusin", (event) => {
      if (event.target.matches("a, button, input, summary")) finish();
    });
    target.addEventListener("pointerdown", finish);
    observer.observe(target);
  };
  const revealLines = (root, animate, delay = 0) => {
    root.querySelectorAll(".motion-line > span").forEach((line, index) => {
      animate(
        line,
        [
          { transform: "translateY(108%) rotate(3deg)" },
          { transform: "translateY(0) rotate(0deg)" },
        ],
        900,
        delay + index * 80,
      );
    });
  };
  const revealCopy = (elements, animate, delay = 0) => {
    elements.forEach((element, index) => {
      // Keep touch/keyboard targets stationary and available throughout entry.
      if (element.matches("a, button, .pack-view-controls")) return;
      animate(
        element,
        [
          { clipPath: "inset(0 0 100% 0)", transform: "translateY(28px)" },
          { clipPath: "inset(0 0 0% 0)", transform: "translateY(0)" },
        ],
        650,
        delay + index * 60,
      );
    });
  };
  const title = document.querySelector(".mindset-title");
  register(title, (animate) => {
    revealCopy([title.querySelector(".eyebrow")], animate);
    revealLines(title, animate, 60);
    animate(
      title.querySelector(".mindset-trail"),
      [
        { clipPath: "inset(0 100% 0 0)", transform: "translateX(-20px)" },
        { clipPath: "inset(0 0% 0 0)", transform: "translateX(0)" },
      ],
      1000,
      220,
    );
  });
  const mindsetCopy = document.querySelector(".trayn-mindset-copy");
  register(mindsetCopy, (animate) => {
    revealCopy([...mindsetCopy.children], animate);
  });
  const pack = document.querySelector("[data-pack-preview]");
  register(pack, (animate) => {
    const mobile = matchMedia("(max-width: 800px)").matches;
    animate(
      pack.querySelector(".pack-preview-images"),
      [
        {
          transform: `translate(${mobile ? "6%, 8%" : "12%, 12%"}) rotate(6deg) scale(1.08)`,
          opacity: 0,
        },
        { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1 },
      ],
      1100,
    );
    revealCopy([pack.querySelector(".pack-preview-enlarge")], animate, 180);
  });
  const packCopy = document.querySelector(".wpc-pack-copy");
  register(packCopy, (animate) => {
    revealCopy([packCopy.querySelector(".eyebrow")], animate);
    revealLines(packCopy, animate, 60);
    revealCopy(
      [...packCopy.children].filter((child) => !child.matches("h2, .eyebrow")),
      animate,
      180,
    );
  });
  const settle = () => groups.forEach((group) => group.finish());
  reduced.addEventListener("change", () => {
    if (!canAnimate()) settle();
  });
  window.addEventListener("pagehide", () => {
    observer.disconnect();
    settle();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted)
      groups.forEach((_, target) => {
        if (!target.dataset.entrance) observer.observe(target);
      });
  });
}

// Keep the native dialog's focus, Escape and backdrop behaviour. Only its
// presentation is enhanced; keyboard opening/closing remains immediate.
export function packagingDialogMotion(dialog) {
  let animation;
  let closing = false;
  const reset = () => {
    animation?.cancel();
    animation = undefined;
    closing = false;
    delete dialog.dataset.closing;
  };
  const close = (instant = false) => {
    if (!dialog.open) return;
    if (instant || !canAnimate()) {
      reset();
      dialog.close();
      return;
    }
    if (closing) return;
    const style = getComputedStyle(dialog);
    const from = { transform: style.transform };
    reset();
    closing = true;
    dialog.dataset.closing = "true";
    animation = dialog.animate(
      [from, { transform: "translateY(16px) scale(0.96)" }],
      { duration: 200, easing: easeOut },
    );
    animation.onfinish = () => {
      dialog.close();
      reset();
    };
  };
  dialog.addEventListener("close", () => {
    if (!dialog.open) reset();
  });
  window.addEventListener("pagehide", () => {
    if (dialog.open) dialog.close();
    reset();
  });
  reduced.addEventListener("change", () => {
    if (!canAnimate()) {
      if (closing) dialog.close();
      reset();
    }
  });
  return {
    open(instant = false) {
      reset();
      if (!canAnimate() || instant) return;
      animation = dialog.animate(
        [
          { transform: "translateY(24px) scale(0.96)" },
          { transform: "translateY(0) scale(1)" },
        ],
        { duration: 250, easing: easeOut },
      );
    },
    close,
  };
}

export function initializeInteractions() {
  initializeLabelTabs();
  initializePackPreview();
  initializeFaqMotion();
  initializeSectionSequence();
}
