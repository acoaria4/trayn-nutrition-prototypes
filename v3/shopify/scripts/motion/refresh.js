import { ScrollTrigger } from "gsap/ScrollTrigger";

let pending;
export function requestMotionRefresh() {
  if (pending) return;
  pending = requestAnimationFrame(() => {
    pending = undefined;
    ScrollTrigger.refresh(true);
  });
}
