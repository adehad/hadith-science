// whether the site may move (WCAG 2.2.2): the reader can stop every looping animation with the header's motion
// switch (data-motion="off" on <html>, set before paint by Page.astro's head script), and the system's reduced-motion
// setting stops it too, whatever the switch says. Islands that drive motion from script (the starfield, the map's
// orbits, SMIL, the carousel's smooth scroll, view-switch transitions) ask motionAllowed() and re-check on
// onMotionChange(); motion.css does the same for CSS animations and transitions.

export type MotionState = "on" | "off" | "system";
export const MOTION_KEY = "nuzhah-motion";
const EVENT = "nuzhah:motion";

// the switch's state from the system setting and the <html> attribute; kept pure so it can be unit-tested
export function motionState(reduced: boolean, attr: string | undefined): MotionState {
  if (reduced) return "system";
  return attr === "off" ? "off" : "on";
}

const reducedQuery = () => matchMedia("(prefers-reduced-motion: reduce)");

export function currentMotion(): MotionState {
  return motionState(reducedQuery().matches, document.documentElement.dataset.motion);
}

export function motionAllowed(): boolean {
  return currentMotion() === "on";
}

// the switch: set or clear the attribute and tell every island
export function setMotion(on: boolean) {
  if (on) delete document.documentElement.dataset.motion;
  else document.documentElement.dataset.motion = "off";
  dispatchEvent(new Event(EVENT));
}

// fn runs whenever motion may have started or stopped: the switch flipped or the system setting changed
export function onMotionChange(fn: () => void) {
  reducedQuery().addEventListener("change", fn);
  addEventListener(EVENT, fn);
}
