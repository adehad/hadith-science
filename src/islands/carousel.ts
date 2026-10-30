// portrait carousel (spec §5): dots and prev/next scroll to a panel, the dot of the nearest panel is marked
// aria-current, ←/→ on the focused scroller move by a panel, and window.nuzhah.reveal centres the carousel on an
// element (the term landing, popover.ts). Scroll-snap does the snapping; outside portrait nothing scrolls, so
// all of this is inert there.
import { motionAllowed } from "../lib/motion";

// the same query as Carousel.astro's CSS
const portrait = matchMedia("(max-width: 640px) and (orientation: portrait)");

// how far scroller must scroll to bring el's centre to its own centre
function offsetTo(scroller: HTMLElement, el: Element) {
  const r = el.getBoundingClientRect(), sr = scroller.getBoundingClientRect();
  return r.left + r.width / 2 - (sr.left + sr.width / 2);
}

document.querySelectorAll<HTMLElement>(".carousel").forEach((car) => {
  const scroller = car.querySelector<HTMLElement>(".scroller")!;
  const snaps = [...car.querySelectorAll<HTMLElement>(".snap")];
  const dots = [...car.querySelectorAll<HTMLButtonElement>(".cdot")];

  // the markup keeps the scroller focusable so portrait works without JS; outside portrait it doesn't scroll,
  // so drop it from the tab order and the landmarks there
  const label = scroller.getAttribute("aria-label") ?? "";
  const a11y = () => {
    if (portrait.matches) {
      scroller.setAttribute("tabindex", "0");
      scroller.setAttribute("role", "region");
      scroller.setAttribute("aria-label", label);
    } else {
      ["tabindex", "role", "aria-label"].forEach((a) => scroller.removeAttribute(a));
    }
  };
  a11y();
  portrait.addEventListener("change", a11y);

  // the panel a go() is heading for, so a quick second prev/next steps on from it rather than from where the
  // smooth scroll has got to; cleared once the scroll settles
  let target: number | undefined;

  const nearest = () => {
    let best = 0, d = Infinity;
    snaps.forEach((s, i) => {
      const o = Math.abs(offsetTo(scroller, s));
      if (o < d) { d = o; best = i; }
    });
    return best;
  };
  const go = (i: number) => {
    target = Math.max(0, Math.min(snaps.length - 1, i));
    const s = snaps[target];
    scroller.scrollTo({ left: scroller.scrollLeft + offsetTo(scroller, s), behavior: motionAllowed() ? "smooth" : "auto" });
  };
  const mark = () => {
    const n = nearest();
    if (n === target) target = undefined;
    dots.forEach((b, i) => (i === n ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
  };

  dots.forEach((b, i) => b.addEventListener("click", () => go(i)));
  const step = (d: number) => go((target ?? nearest()) + d);
  car.querySelector(".cprev")?.addEventListener("click", () => step(-1));
  car.querySelector(".cnext")?.addEventListener("click", () => step(1));
  scroller.addEventListener("keydown", (e) => {
    if (!portrait.matches) return;
    // leave modified arrows (word/line jumps, browser shortcuts) alone
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    // only on the scroller itself: a focused term inside keeps its own keys
    if (e.target !== scroller || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    step(e.key === "ArrowRight" ? 1 : -1);
  });
  scroller.addEventListener("scrollend", () => (target = undefined));

  let queued = false;
  scroller.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; mark(); });
  }, { passive: true });
});

function reveal(el: Element) {
  const scroller = el.closest(".carousel")?.querySelector<HTMLElement>(".scroller");
  // no animation: the landing scrolls the page and opens the popover straight after; snapping settles it
  if (scroller) scroller.scrollLeft += offsetTo(scroller, el);
}
window.nuzhah = { ...window.nuzhah, reveal };
