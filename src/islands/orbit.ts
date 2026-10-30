// map: planets move along their orbits (ported from the mockup's placePlanets/mapTick), and a clicked
// planet hands an HTML stand-in to the view transition so it appears to grow into the division page
import { MAP_CENTRE, angularSpeed, moonAt, planetAt } from "../lib/orbit";
import { motionAllowed, onMotionChange } from "../lib/motion";

const svg = document.querySelector<SVGSVGElement>("svg.map");
if (svg) {
  const planets = [...svg.querySelectorAll<SVGAElement>("a.planet")].map((el) => {
    const body = el.querySelector<SVGCircleElement>(".pbody")!;
    return {
      el, body,
      i: Number(el.dataset.i),
      start: Number(el.dataset.angle),
      r: Number(body.getAttribute("r")),
      sats: [...el.querySelectorAll<SVGCircleElement>(".sat")],
    };
  });

  let t = 0, last = 0, raf = 0, held = false, gone = false;
  const narrow = matchMedia("(max-width: 640px)");
  // portrait phones show the nested list instead of the map (index.astro), so don't animate a hidden map
  const tree = matchMedia("(max-width: 640px) and (orientation: portrait)");

  function place() {
    for (const p of planets) {
      const a = p.start + t * angularSpeed(p.i), [x, y] = planetAt(p.i, a, MAP_CENTRE);
      p.el.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      p.el.dataset.angle = a.toFixed(3);
      p.sats.forEach((c, k) => {
        const [sx, sy] = moonAt(k, p.sats.length, p.r, t);
        c.setAttribute("cx", sx.toFixed(2)); c.setAttribute("cy", sy.toFixed(2));
      });
    }
  }
  function tick(now: number) {
    const dt = Math.min(0.1, (now - (last || now)) / 1000);
    last = now;
    t += narrow.matches ? dt * 0.5 : dt;
    place();
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf && !held && !gone && !document.hidden && !tree.matches && motionAllowed()) { last = 0; raf = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  // start() declines while motion is stopped (the switch, or reduced motion), so every listener can stay registered and
  // the setting can change live
  // pause while the reader is pointing at or focused inside the map, so a planet holds still to be chosen
  const hold = (on: boolean) => { held = on; on ? stop() : start(); };
  svg.addEventListener("pointerenter", () => hold(true));
  svg.addEventListener("pointerleave", () => hold(svg.contains(document.activeElement)));
  svg.addEventListener("focusin", () => hold(true));
  svg.addEventListener("focusout", (e) => { if (!svg.contains(e.relatedTarget as Node)) hold(svg.matches(":hover")); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  tree.addEventListener("change", () => (tree.matches ? stop() : start()));
  onMotionChange(() => (motionAllowed() ? start() : stop()));
  start();

  // the stand-in: view-transition-name is only captured on boxed elements, never on SVG <a>/<g>
  let chosen: (typeof planets)[number] | null = null;
  function standIn() {
    if (!chosen) return;
    document.querySelector(".vt-planet")?.remove();
    const box = chosen.body.getBoundingClientRect(), div = document.createElement("div");
    div.className = "vt-planet";
    Object.assign(div.style, {
      left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px`,
      background: getComputedStyle(chosen.body).fill,
    });
    div.style.viewTransitionName = "planet";
    document.body.append(div);
  }
  const pageswap = "onpageswap" in window;
  svg.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<SVGAElement>("a.planet");
    if (!a || e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    choose(a);
  });
  function choose(a: SVGAElement) {
    chosen = planets.find((p) => p.el === a) ?? null;
    gone = true;
    stop();
    // where pageswap exists, wait for it so the stand-in only appears when a transition will actually run
    if (!pageswap) standIn();
  }
  // native SVG <a> only follows Enter, and SVG elements have no .click(); Space opens a planet the same way
  svg.addEventListener("keydown", (e) => {
    const a = (e.target as Element).closest<SVGAElement>("a.planet");
    if (!a || e.key !== " ") return;
    e.preventDefault();
    choose(a);
    location.assign(new URL(a.href.baseVal, location.href));
  });
  addEventListener("pageswap", (e) => {
    if ((e as Event & { viewTransition?: unknown }).viewTransition && motionAllowed()) standIn();
  });
  // coming back via the back/forward cache: drop the stand-in and let the planets move again
  addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    document.querySelector(".vt-planet")?.remove();
    chosen = null; gone = false; held = svg.matches(":hover") || svg.contains(document.activeElement);
    start();
  });
}
