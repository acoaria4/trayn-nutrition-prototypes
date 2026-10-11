const names = ["The Quiet Before", "Under Tension", "The Flavour Study"];
const paths = ["./quiet.html", "./tension.html", "./flavour.html"];
const frame = document.querySelector("#experience");
const picker = document.querySelector(".proto-picker");
const highlight = picker.querySelector(".proto-picker-highlight");
const items = [
  ...picker.querySelectorAll(".proto-picker-item:not(.proto-picker-replay)"),
];
const replay = picker.querySelector(".proto-picker-replay");
let current = 0;
let reduced = new URLSearchParams(location.search).get("motion") === "off";
const motionButton = document.querySelector("#reduce-motion");
motionButton.setAttribute("aria-pressed", String(reduced));
const experiencePath = (i) => `${paths[i]}${reduced ? "?motion=off" : ""}`;

function moveHighlight() {
  const el = items[current];
  highlight.style.width = el.offsetWidth + "px";
  highlight.style.transform = `translateX(${el.offsetLeft}px)`;
}
function mount(i) {
  frame.src = experiencePath(i);
  frame.title = `${names[i]} — interactive opening prototype`;
}
function setActive(i) {
  if (i < 0 || i >= names.length) return;
  current = i;
  items.forEach((el, j) => {
    el.toggleAttribute("data-active", j === i);
    if (j === i) el.setAttribute("aria-current", "true");
    else el.removeAttribute("aria-current");
  });
  moveHighlight();
  const url = new URL(location);
  url.searchParams.set("v", i + 1);
  history.replaceState(null, "", url);
  document.querySelector(".studio-direction").textContent =
    `0${i + 1} — ${names[i]}`;
  document.querySelector("#open-experience").href = experiencePath(i);
  mount(i);
}
function onKey(e) {
  if (
    /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) ||
    e.target?.isContentEditable
  )
    return;
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= names.length) {
    e.preventDefault?.();
    setActive(num - 1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault?.();
    setActive((current + 1) % names.length);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault?.();
    setActive((current - 1 + names.length) % names.length);
  } else if (e.key === "r" || e.key === "R") mount(current);
}
items.forEach((el, i) => el.addEventListener("click", () => setActive(i)));
replay.addEventListener("click", () => mount(current));
motionButton.addEventListener("click", () => {
  reduced = !reduced;
  motionButton.setAttribute("aria-pressed", String(reduced));
  const url = new URL(location);
  if (reduced) url.searchParams.set("motion", "off");
  else url.searchParams.delete("motion");
  history.replaceState(null, "", url);
  document.querySelector("#open-experience").href = experiencePath(current);
  mount(current);
});
window.addEventListener("resize", moveHighlight);
document.addEventListener("keydown", onKey);
window.addEventListener("message", (event) => {
  if (event.origin !== location.origin || event.source !== frame.contentWindow)
    return;
  if (event.data?.type === "proto:key") onKey({ key: event.data.key });
});
document.querySelectorAll("[data-viewport]").forEach((button) =>
  button.addEventListener("click", () => {
    const mode = button.dataset.viewport;
    document.body.dataset.viewport = mode;
    document
      .querySelectorAll("[data-viewport]")
      .forEach((el) =>
        el.setAttribute("aria-pressed", String(el.dataset.viewport === mode)),
      );
    const url = new URL(location);
    url.searchParams.set("viewport", mode);
    history.replaceState(null, "", url);
  }),
);
const params = new URLSearchParams(location.search);
if (params.get("viewport") === "mobile")
  document.querySelector('[data-viewport="mobile"]').click();
setActive(Math.max(0, Math.min(2, (parseInt(params.get("v"), 10) || 1) - 1)));
requestAnimationFrame(() =>
  requestAnimationFrame(() => picker.setAttribute("data-ready", "")),
);
