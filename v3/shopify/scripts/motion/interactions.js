import { requestMotionRefresh } from "./refresh.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const motionOff = new URLSearchParams(location.search).get("motion") === "off";
const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
const modified = (event) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

function navigation() {
  const menu = document.querySelector(".site-menu");
  if (!menu || menu.dataset.bound) return;
  menu.dataset.bound = "true";
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.open = false;
    }),
  );
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  const links = [...document.querySelectorAll(".desktop-navigation a")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        if (link.hash === `#${visible.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.2, 0.5] },
  );
  links.forEach((link) => {
    if (!link.hash || link.pathname !== location.pathname) return;
    const target = document.getElementById(link.hash.slice(1));
    if (target) observer.observe(target);
  });
}

function tabs() {
  const root = document.querySelector("[data-label-tabs]");
  if (!root || root.dataset.bound) return;
  root.dataset.bound = "true";
  const list = root.querySelector(".label-tabs");
  const links = [...root.querySelectorAll("[data-label-tab]")];
  const panels = [...root.querySelectorAll("[data-label-panel]")];
  const indicator = root.querySelector(".tab-indicator");
  const basisControls = root.querySelector("[data-basis-controls]");
  root.dataset.nutritionBasis = "serving";
  basisControls.hidden = false;
  basisControls.addEventListener("change", (event) => {
    if (!event.target.matches('input[name="nutrition-basis"]')) return;
    const basis = event.target.value;
    root.dataset.nutritionBasis = basis;
    root.querySelector("[data-summary-basis]").textContent =
      basis === "100g" ? "Per 100 g" : "Per serving · 33 g";
    requestMotionRefresh();
  });
  let selected = 0;
  const position = () => {
    const tab = links[selected];
    indicator.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth})`;
  };
  root.dataset.enhanced = "true";
  list.setAttribute("role", "tablist");
  links.forEach((link, index) => {
    link.id = `${panels[index].id}-tab`;
    link.setAttribute("role", "tab");
    link.setAttribute("aria-controls", panels[index].id);
    panels[index].setAttribute("role", "tabpanel");
    panels[index].setAttribute("aria-labelledby", link.id);
    panels[index].tabIndex = 0;
  });
  const activate = (index, instant = false) => {
    selected = index;
    root.classList.toggle("is-instant", instant || reduce.matches || motionOff);
    links.forEach((link, i) => {
      link.setAttribute("aria-selected", String(i === index));
      link.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    position();
    requestMotionRefresh();
  };
  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (modified(event)) return;
      event.preventDefault();
      activate(index, event.detail === 0);
    });
    link.addEventListener("keydown", (event) => {
      const target = {
        ArrowRight: (index + 1) % links.length,
        ArrowLeft: (index + links.length - 1) % links.length,
        Home: 0,
        End: links.length - 1,
      }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      activate(target, true);
      links[target].focus({ preventScroll: true });
    });
  });
  const hash = () => {
    const index = panels.findIndex((panel) => `#${panel.id}` === location.hash);
    if (index >= 0) activate(index, true);
  };
  activate(0, true);
  hash();
  window.addEventListener("hashchange", hash);
  new ResizeObserver(position).observe(list);
  document.fonts.ready.then(position);
}

function questions() {
  const rows = [...document.querySelectorAll(".faq-list details")];
  rows.forEach((details) => {
    if (details.dataset.bound) return;
    details.dataset.bound = "true";
    const summary = details.querySelector("summary");
    const answer = details.querySelector(".faq-answer");
    let animation;
    let desired = details.open;
    details.dataset.expanded = String(desired);
    const finish = () => {
      animation?.cancel();
      animation = undefined;
      details.open = desired;
      details.style.overflow = "";
      answer.inert = false;
      requestMotionRefresh();
    };
    summary.addEventListener("click", (event) => {
      const instant = event.detail === 0 || reduce.matches || motionOff;
      details.classList.toggle("is-instant", instant);
      if (instant) {
        if (animation) finish();
        return;
      }
      event.preventDefault();
      const from = details.getBoundingClientRect().height;
      if (!animation) desired = details.open;
      animation?.cancel();
      desired = !desired;
      details.dataset.expanded = String(desired);
      details.open = true;
      answer.inert = !desired;
      const to = desired
        ? details.getBoundingClientRect().height
        : summary.getBoundingClientRect().height + 1;
      details.style.overflow = "hidden";
      animation = details.animate(
        [{ height: `${from}px` }, { height: `${to}px` }],
        { duration: 200, easing: ease },
      );
      animation.onfinish = finish;
    });
    details.addEventListener("toggle", () => {
      if (!animation) {
        desired = details.open;
        details.dataset.expanded = String(desired);
        requestMotionRefresh();
      }
    });
    reduce.addEventListener("change", () => {
      if (reduce.matches && animation) finish();
    });
    window.addEventListener("pagehide", () => {
      if (animation) finish();
    });
  });
}

function inspector() {
  const dialog = document.querySelector("#pack-inspector");
  if (!dialog || !document.querySelector('[data-study-view="front"]')) return;
  if (dialog.dataset.bound) return;
  dialog.dataset.bound = "true";
  const image = dialog.querySelector("[data-inspector-image]");
  const caption = dialog.querySelector("[data-inspector-caption]");
  const viewControls = [...dialog.querySelectorAll("[data-inspector-view]")];
  const zoom = dialog.querySelector(".zoom-toggle");
  const labelSource = dialog.querySelector("[data-inspector-label-image]");
  const views = {
    front: {
      src: document.querySelector('[data-study-view="front"]').href,
      alt: "TRAYN Belgian Chocolate 500 g front pouch concept",
      caption: "Front pouch visualisation. Packaging concept.",
    },
    back: {
      src: document.querySelector('[data-study-view="back"]').href,
      alt: "TRAYN Belgian Chocolate 500 g back pouch visualisation",
      caption:
        "Back pouch visualisation. Use Back Label or the original PDF to read the supplied artwork.",
    },
    label: {
      src: labelSource.dataset.inspectorLabelImage,
      alt: "Belgian Chocolate WPC back-label artwork; manufacturer details intentionally blank",
      caption:
        "Back-label visualisation; manufacturer details intentionally blank. Transcribed information is not an approved retail specification.",
    },
  };
  let opener;
  let oldOverflow;
  let scrollLocked = false;
  let entrance;
  const resetZoom = () => {
    dialog.classList.remove("is-zoomed");
    zoom.setAttribute("aria-pressed", "false");
    zoom.innerHTML = 'Zoom In <span aria-hidden="true">+</span>';
    dialog.querySelector(".inspector-canvas").scrollTo(0, 0);
  };
  const select = (view) => {
    dialog.dataset.view = view;
    image.src = views[view].src;
    image.alt = views[view].alt;
    caption.textContent = views[view].caption;
    viewControls.forEach((control) =>
      control.setAttribute(
        "aria-pressed",
        String(control.dataset.inspectorView === view),
      ),
    );
    resetZoom();
  };
  document.querySelectorAll("[data-study-inspect]").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (modified(event) || !dialog.showModal) return;
      event.preventDefault();
      opener = link;
      select(document.body.dataset.packView);
      entrance?.cancel();
      if (!dialog.open) {
        if (!scrollLocked) {
          oldOverflow = document.documentElement.style.overflow;
          document.documentElement.style.overflow = "hidden";
          scrollLocked = true;
        }
        dialog.showModal();
      }
      if (event.detail !== 0 && !reduce.matches && !motionOff)
        entrance = dialog.animate(
          [
            { opacity: 0, transform: "scale(0.97)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: 200, easing: ease },
        );
    }),
  );
  viewControls.forEach((control) =>
    control.addEventListener("click", () =>
      select(control.dataset.inspectorView),
    ),
  );
  zoom.addEventListener("click", () => {
    const expanded = dialog.classList.toggle("is-zoomed");
    zoom.setAttribute("aria-pressed", String(expanded));
    zoom.innerHTML = expanded
      ? 'Zoom Out <span aria-hidden="true">−</span>'
      : 'Zoom In <span aria-hidden="true">+</span>';
  });
  dialog
    .querySelector(".inspector-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    entrance?.cancel();
    document.documentElement.style.overflow = oldOverflow || "";
    scrollLocked = false;
    opener?.focus({ preventScroll: true });
    resetZoom();
  });
}

export function initializeInteractions() {
  navigation();
  tabs();
  questions();
  inspector();
  document.querySelectorAll(".label-disclosure").forEach((details) => {
    if (details.dataset.bound) return;
    details.dataset.bound = "true";
    details.addEventListener("toggle", () =>
      requestMotionRefresh(),
    );
  });
}
