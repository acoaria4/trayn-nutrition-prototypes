import {
  initializeInteractions,
  packagingDialogMotion,
} from "./interactions.js";
import {
  featuredProduct,
  getProduct,
  productUrl,
  productTitle,
  productDescription,
} from "./data/products.js";
import { withBasePath, withoutBasePath } from "./site-paths.js";

const basePath = import.meta.env.BASE_URL;
const localUrl = (path) => withBasePath(path, basePath);

document.documentElement.classList.add("js");

// Keep anchor and hero offsets accurate across responsive header sizes.
const siteHeader = document.querySelector(".site-header");
const measureHeader = () => {
  document.documentElement.style.setProperty(
    "--header-height",
    `${siteHeader.offsetHeight}px`,
  );
};
measureHeader();
const headerObserver = new ResizeObserver(measureHeader);
headerObserver.observe(siteHeader);

// Disclosure navigation keeps the document scrollable and never traps focus.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
function closeMenu(returnFocus = false) {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  menuButton.querySelector("[data-menu-label]").textContent = "Menu";
  navigation.classList.remove("is-open");
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  if (!open) return closeMenu();
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close menu");
  menuButton.querySelector("[data-menu-label]").textContent = "Close";
  navigation.classList.add("is-open");
});
navigation.addEventListener("click", (event) => {
  const anchor = event.target.closest("a");
  if (!anchor) return;
  closeMenu();
  const destination = new URL(anchor.href);
  if (destination.pathname === location.pathname && destination.hash) {
    const section = document.getElementById(destination.hash.slice(1));
    if (section) {
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
      section.addEventListener(
        "blur",
        () => section.removeAttribute("tabindex"),
        { once: true },
      );
    }
  }
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  )
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".site-header") &&
    menuButton.getAttribute("aria-expanded") === "true"
  )
    closeMenu();
});
const mobileQuery = matchMedia("(max-width: 600px)");
mobileQuery.addEventListener("change", () => closeMenu());

function clearImageError(image) {
  image.hidden = false;
  image.parentElement.classList.remove("has-image-error");
  image.parentElement
    .querySelector(".image-fallback, .brand-fallback")
    ?.remove();
}
function imageFailed(image) {
  if (image.hasAttribute("data-deferred-image") && !image.getAttribute("src"))
    return;
  image.hidden = true;
  const parent = image.parentElement;
  if (image.getAttribute("src")?.includes("/images/brand/")) {
    if (parent.querySelector(".brand-fallback")) return;
    const wordmark = document.createElement("span");
    wordmark.className = "brand-fallback";
    wordmark.textContent = "TRAYN";
    parent.append(wordmark);
    return;
  }
  parent.classList.add("has-image-error");
  if (parent.querySelector(".image-fallback")) return;
  const fallback = document.createElement("p");
  fallback.className = "image-fallback";
  fallback.setAttribute("role", "status");
  fallback.textContent = `${image.alt || "Packaging concept"} — Image unavailable. Product details remain available below.`;
  parent.append(fallback);
}
document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => imageFailed(image));
  image.addEventListener("load", () => clearImageError(image));
  if (image.complete && !image.naturalWidth && image.getAttribute("src"))
    imageFailed(image);
});

// The source catalogue is intentionally non-selling. No price or inventory is inferred.
const explorers = [...document.querySelectorAll("[data-product-explorer]")];
// Older shared links used a query to switch flavours. Each concept now has its
// own complete page so the gallery, formulation and supporting copy stay aligned.
const legacyFlavor = new URLSearchParams(location.search).get("flavor");
if (document.body.dataset.page === "product" && legacyFlavor) {
  const legacyProduct = getProduct(legacyFlavor);
  if (legacyProduct.id === legacyFlavor) {
    const destination = new URL(location.href);
    destination.pathname = localUrl(productUrl(legacyProduct));
    destination.searchParams.delete("flavor");
    location.replace(destination.href);
  }
}
function currentProduct() {
  const queryFlavor =
    document.body.dataset.page === "product"
      ? null
      : new URLSearchParams(location.search).get("flavor");
  const pathname = withoutBasePath(location.pathname, basePath);
  const conceptFlavor = pathname.match(/^\/concepts\/([^/]+)\/?$/)?.[1];
  const routeFlavor = pathname.startsWith("/products/trayn-whey-rich-chocolate")
    ? featuredProduct.id
    : conceptFlavor;
  return getProduct(
    queryFlavor ?? routeFlavor ?? document.body.dataset.initialFlavor,
  );
}
function setImage(image, product, view = "front") {
  const base =
    view === "back" && product.backImage ? product.backImage : product.image;
  clearImageError(image);
  image.srcset = `${localUrl(`${base}-640.webp`)} 640w, ${localUrl(`${base}-1024.webp`)} 1024w`;
  image.src = localUrl(`${base}-640.webp`);
  image.alt = `TRAYN ${product.flavor} ${product.netQuantityGrams} g ${product.name.toLowerCase()} ${view === "back" ? "back-label" : "pouch"} concept${product.archived ? "; archived artwork" : ""}`;
}
function setProduct(explorer, product, { announce = true } = {}) {
  explorer.dataset.selectedFlavor = product.id;
  explorer.dataset.selectedView = "front";
  explorer
    .querySelectorAll("[data-product-name], [data-product-flavor]")
    .forEach((element) => (element.textContent = product.flavor));
  for (const [selector, value] of [
    ["[data-product-type]", product.name],
    ["[data-product-formulation]", product.blend],
    ["[data-product-description]", product.description],
  ]) {
    explorer
      .querySelectorAll(selector)
      .forEach((element) => (element.textContent = value));
  }
  explorer
    .querySelectorAll("[data-product-status]")
    .forEach((element) => (element.textContent = product.status));
  const status = explorer.querySelector("[data-flavor-status]");
  if (announce && status)
    status.textContent = `${product.flavor} · ${product.status} · Not for sale`;
  const image = explorer.querySelector("[data-product-image]");
  if (image) setImage(image, product);
  explorer.querySelectorAll("[data-flavor]").forEach((link) => {
    const current = link.dataset.flavor === product.id;
    link.classList.toggle("is-active", current);
    link.setAttribute("aria-current", String(current));
    link.querySelector(".flavor-choice").textContent = current ? "↗" : "+";
  });
  const detailLink = explorer.querySelector("[data-product-link]");
  if (detailLink) detailLink.href = localUrl(productUrl(product));
  const enlarge = explorer.querySelector("[data-open-packaging]");
  if (enlarge) enlarge.href = localUrl(`${product.image}-1024.webp`);
  explorer.querySelectorAll("[data-gallery-view]").forEach((link) => {
    const isBack = link.dataset.galleryView === "back";
    link.hidden = isBack && !product.backImage;
    link.href = localUrl(
      `${isBack && product.backImage ? product.backImage : product.image}-1024.webp`,
    );
    link.setAttribute("aria-current", String(!isBack));
  });
  if (document.body.dataset.page === "product") {
    document.title = productTitle(product);
    const description = document.querySelector('meta[name="description"]');
    description.content = productDescription(product);
    const canonical = new URL(productUrl(product), "https://traynnutrition.com")
      .href;
    document.querySelector('link[rel="canonical"]').href = canonical;
    document.querySelector('meta[property="og:title"]').content =
      document.title;
    document.querySelector('meta[property="og:description"]').content =
      description.content;
    document.querySelector('meta[property="og:url"]').content = canonical;
  }
}
explorers.forEach((explorer) => {
  const initial = currentProduct();
  setProduct(explorer, initial);
  explorer.addEventListener("click", (event) => {
    const flavorLink = event.target.closest("[data-flavor]");
    if (
      flavorLink &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const product = getProduct(flavorLink.dataset.flavor);
      setProduct(explorer, product);
      const url = new URL(location.href);
      if (document.body.dataset.page === "product") {
        url.pathname = localUrl(productUrl(product));
        url.searchParams.delete("flavor");
      } else if (product.id === featuredProduct.id)
        url.searchParams.delete("flavor");
      else url.searchParams.set("flavor", product.id);
      history.pushState({ flavor: product.id }, "", url);
    }
    const viewLink = event.target.closest("[data-gallery-view]");
    if (
      viewLink &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const product = getProduct(explorer.dataset.selectedFlavor);
      const view = viewLink.dataset.galleryView;
      setImage(explorer.querySelector("[data-product-image]"), product, view);
      explorer.dataset.selectedView = view;
      explorer
        .querySelectorAll("[data-gallery-view]")
        .forEach((link) =>
          link.setAttribute("aria-current", String(link === viewLink)),
        );
      explorer.querySelector("[data-open-packaging]").href = viewLink.href;
      explorer.querySelector("[data-flavor-status]").textContent =
        `${product.flavor} · ${view === "back" ? "Back-label" : "Front"} concept · Not for sale`;
    }
  });
});
window.addEventListener("popstate", () =>
  explorers.forEach((explorer) => setProduct(explorer, currentProduct())),
);

// The anchor remains a direct image link when JavaScript or dialog support is absent.
const dialog = document.querySelector("#packaging-dialog");
const dialogMotion = packagingDialogMotion(dialog);
let dialogOpener;
let dialogProduct;
function setDialogView(view) {
  const product = dialogProduct;
  const image = dialog.querySelector("[data-dialog-image]");
  const views = {
    front: {
      path: `${product.image}-1024.webp`,
      label: "front pouch",
      caption: "Front packaging concept.",
    },
    back: {
      path: `${product.backImage}-1024.webp`,
      label: "back pouch visualisation",
      caption:
        "Back pouch visualisation. For small print, use the supplied back label.",
    },
    label: {
      path: product.backLabelImage,
      label: "original back label artwork from the supplied printer PDF",
      caption: "Original back artwork from the supplied printer PDF.",
    },
  };
  const selected = views[view];
  clearImageError(image);
  image.src = localUrl(selected.path);
  image.alt = `TRAYN ${product.flavor} ${selected.label}`;
  dialog.dataset.selectedView = view;
  dialog.querySelector(".dialog-caption").textContent = selected.caption;
  dialog.querySelectorAll("[data-dialog-view]").forEach((link) => {
    const key = link.dataset.dialogView;
    link.hidden =
      key === "back"
        ? !product.backImage
        : key === "label"
          ? !product.backLabelImage
          : false;
    if (views[key].path) link.href = localUrl(views[key].path);
    link.setAttribute("aria-current", String(key === view));
  });
  const labelPdf = dialog.querySelector("[data-dialog-label-pdf]");
  labelPdf.hidden = !product.backLabelPdf;
  if (product.backLabelPdf) labelPdf.href = localUrl(product.backLabelPdf);
  dialog.scrollTop = 0;
}
let priorBodyOverflow = "";
let packagingScrollLocked = false;
if (typeof dialog.showModal === "function") {
  document.querySelectorAll("[data-open-packaging]").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      dialogOpener = link;
      const explorer = link.closest("[data-product-explorer]");
      dialogProduct = getProduct(explorer?.dataset.selectedFlavor);
      setDialogView(
        explorer?.dataset.selectedView === "back" ||
          link.dataset.packagingView === "back"
          ? "back"
          : "front",
      );
      // Native close events are queued. A fast reopen must retain the original
      // overflow value until the last dialog closes, rather than saving hidden.
      if (!packagingScrollLocked) {
        priorBodyOverflow = document.body.style.overflow;
        packagingScrollLocked = true;
      }
      document.body.style.overflow = "hidden";
      dialog.showModal();
      dialogMotion.open(event.detail === 0);
      dialog.querySelector(".dialog-close").focus();
    }),
  );
  dialog.querySelectorAll("[data-dialog-view]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      setDialogView(link.dataset.dialogView);
    });
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", (event) =>
      dialogMotion.close(event.detail === 0),
    );
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    )
      dialogMotion.close();
  });
  dialog.addEventListener("close", () => {
    if (dialog.open) return; // Ignore a queued close from the previous opening.
    document.body.style.overflow = priorBodyOverflow;
    packagingScrollLocked = false;
    dialogOpener?.focus({ preventScroll: true });
  });
}

if (document.body.dataset.page === "home" && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigation.querySelectorAll("a").forEach((link) => {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
  );
  const observeSections = () =>
    document
      .querySelectorAll(".hero, #blend, #flavors, #story, #about, #contact")
      .forEach((section) => observer.observe(section));
  observeSections();
  window.addEventListener("pagehide", () => observer.disconnect());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) observeSections();
  });
}

initializeInteractions();

// Motion is optional: interaction and readable HTML survive a blocked animation chunk.
if (document.querySelector(".hero")) {
  import("./motion.js")
    .then(({ initializeMotion }) => initializeMotion())
    .catch(() => {
      document.documentElement.dataset.motion = "static";
    });
}
