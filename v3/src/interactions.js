import { ScrollTrigger } from "gsap/ScrollTrigger";

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const motionOff = new URLSearchParams(location.search).get("motion") === "off";
const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
const modified = (event) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

function navigation() {
  const menu = document.querySelector(".site-menu");
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
  links.forEach((link) => observer.observe(document.querySelector(link.hash)));
}

function tabs() {
  const root = document.querySelector("[data-label-tabs]");
  const list = root.querySelector(".label-tabs");
  const links = [...root.querySelectorAll("[data-label-tab]")];
  const panels = [...root.querySelectorAll("[data-label-panel]")];
  const indicator = root.querySelector(".tab-indicator");
  const artwork = document.querySelector(".label-study");
  const sheet = artwork.querySelector(".label-assembly");
  // Normalised bounds measured from the supplied back-label artwork.
  const regions = [
    { name: "Nutrition", view: "nutrition", box: [0.08, 0.335, 0.72, 0.195] },
    { name: "Ingredients", view: "ingredients", box: [0.08, 0.532, 0.43, 0.061] },
    { name: "How to Use", view: "usage", box: [0.08, 0.639, 0.36, 0.121] },
  ];
  let selected = 0;
  const positionArtwork = (instant = true) => {
    artwork.classList.toggle("is-instant", instant || reduce.matches || motionOff);
    const { name, view, box: [x, y, w, h] } = regions[selected];
    artwork.dataset.labelView = view;
    artwork.dataset.enhanced = "true";
    artwork.querySelector("[data-label-caption]").textContent = name;
    const width = sheet.clientWidth;
    const height = sheet.clientHeight;
    [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([left, top], i) => {
      sheet.querySelectorAll(".label-region i")[i].style.transform =
        `translate(${left * width}px, ${top * height}px)`;
    });
  };
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
    positionArtwork(instant);
    root.dispatchEvent(new CustomEvent("labelselect"));
    requestAnimationFrame(() => ScrollTrigger.refresh());
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
  new ResizeObserver(() => positionArtwork()).observe(sheet);
  document.fonts.ready.then(position);
}

function questions() {
  const rows = [...document.querySelectorAll(".faq-list details")];
  const index = document.querySelector("[data-question-index]");
  const caption = document.querySelector("[data-question-caption]");
  let lastActive;
  const select = (details, open, instant) => {
    details.dataset.expanded = String(open);
    if (open) lastActive = details;
    if (lastActive?.dataset.expanded !== "true")
      lastActive = rows.findLast((row) => row.dataset.expanded === "true");
    const display = document.querySelector(".question-index");
    display.classList.toggle("is-instant", instant || reduce.matches || motionOff);
    display.dataset.active = String(Boolean(lastActive));
    index.textContent = lastActive ? String(rows.indexOf(lastActive) + 1).padStart(2, "0") : "—";
    caption.textContent = lastActive ? "Selected question / 04" : "04 questions";
  };
  rows.forEach((details) => {
    const summary = details.querySelector("summary");
    const answer = details.querySelector(".faq-answer");
    let animation;
    let desired = details.open;
    select(details, desired, true);
    const finish = () => {
      animation?.cancel();
      animation = undefined;
      details.open = desired;
      details.style.overflow = "";
      answer.inert = false;
      requestAnimationFrame(() => ScrollTrigger.refresh());
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
      select(details, desired, instant);
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
        select(details, desired, details.classList.contains("is-instant"));
        requestAnimationFrame(() => ScrollTrigger.refresh());
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
  const image = dialog.querySelector("[data-inspector-image]");
  const caption = dialog.querySelector("[data-inspector-caption]");
  const viewControls = [...dialog.querySelectorAll("[data-inspector-view]")];
  const zoom = dialog.querySelector(".zoom-toggle");
  const pdf = dialog.querySelector('a[href$=".pdf"]').href;
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
      src: pdf.replace(/\.pdf$/, ".webp"),
      alt: "Original back-label artwork supplied for the Belgian Chocolate WPC pouch",
      caption:
        "Original supplied back-label artwork. Transcribed information is not an approved retail specification.",
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
  document.querySelectorAll(".amino-details").forEach((details) => {
    details.addEventListener("toggle", () =>
      requestAnimationFrame(() => ScrollTrigger.refresh()),
    );
  });
}
