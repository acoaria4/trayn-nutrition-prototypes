// The light control stays usable even when the optional animation chunk fails.
export function initializeLight() {
  const hero = document.querySelector(".tension-hero");
  if (!hero) return;
  const stage = hero.querySelector(".tension-stage");
  const slider = hero.querySelector("#tension-light");
  const output = hero.querySelector("output");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const forcedReduction =
    new URLSearchParams(location.search).get("motion") === "off";
  let pointer = 0;
  let frame = 0;
  const paint = () => {
    frame = 0;
    const amount = Number(slider.value);
    const normal = (amount - 50) / 50;
    const noMotion = forcedReduction || reduced.matches;
    hero.style.setProperty("--tension-light-x", `${amount}%`);
    hero.style.setProperty(
      "--tension-turn",
      `${noMotion ? 0 : normal * 7 + pointer * 2}deg`,
    );
    hero.style.setProperty(
      "--tension-lean",
      `${noMotion ? 0 : normal + pointer}deg`,
    );
  };
  const reset = () => {
    pointer = 0;
    if (frame) cancelAnimationFrame(frame);
    paint();
  };
  const setLight = () => {
    const amount = Number(slider.value);
    output.value =
      amount < 43 ? "From the left" : amount > 57 ? "From the right" : "Centre";
    slider.setAttribute("aria-valuetext", `${output.value}, ${amount} percent`);
    paint();
  };
  slider.addEventListener("input", setLight);
  stage.addEventListener("pointermove", (event) => {
    if (
      forcedReduction ||
      reduced.matches ||
      !finePointer.matches ||
      event.pointerType === "touch"
    )
      return;
    const box = stage.getBoundingClientRect();
    pointer = Math.max(
      -1,
      Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2),
    );
    if (!frame) frame = requestAnimationFrame(paint);
  });
  stage.addEventListener("pointerleave", reset);
  reduced.addEventListener("change", reset);
  finePointer.addEventListener("change", reset);
  window.addEventListener("blur", reset);
  window.addEventListener("pagehide", reset);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) reset();
  });
  setLight();
  hero.querySelector(".tension-light-control").hidden = false;
}
