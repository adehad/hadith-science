// "Other views" switch (spec §5, §7.4). The island is generic: diagram parts opt in through attributes.
//   data-view-show="a b"        shown only when the active view is a or b (class "off" otherwise)
//   data-v-<id>="<transform>"   the element's style.transform in view <id>
//   data-h-<id>="<px>"          its style.height in view <id> (the staircase's rect.step)
//   data-fill-<id>="<colour>"   its style.fill in view <id>
// The build renders the default view (inline values, class="off" on parts outside it); this island applies a
// ?view= on load and the buttons switch views, keeping the URL in step so a link opens on the same view.
import { readView, writeView } from "../lib/views";
import { motionAllowed } from "../lib/motion";

const box = document.querySelector<HTMLElement>(".views[data-views]");

if (box) {
  const ids = box.dataset.views!.split(/\s+/);
  const buttons = box.querySelectorAll<HTMLButtonElement>("button[data-v]");
  // bumped by every apply, so only the latest one's double rAF sets values (a quick second click wins)
  let seq = 0;

  // the per-view styles; a view sets only the properties it has attributes for
  function setValues(id: string) {
    document.querySelectorAll<HTMLElement | SVGElement>(`[data-v-${id}]`)
      .forEach((el) => (el.style.transform = el.getAttribute(`data-v-${id}`)!));
    document.querySelectorAll<HTMLElement | SVGElement>(`[data-h-${id}]`)
      .forEach((el) => (el.style.height = el.getAttribute(`data-h-${id}`)!));
    document.querySelectorAll<HTMLElement | SVGElement>(`[data-fill-${id}]`)
      .forEach((el) => (el.style.fill = el.getAttribute(`data-fill-${id}`)!));
  }

  function apply(id: string, animate: boolean) {
    const n = ++seq;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === id)));
    // page-wide, so the note under the switch and the diagram's parts change together
    document.querySelectorAll<Element>("[data-view-show]")
      .forEach((el) => el.classList.toggle("off", !el.getAttribute("data-view-show")!.split(/\s+/).includes(id)));
    if (animate && motionAllowed()) {
      // the mockup's slideStairs: set the targets in the frame after layout so the CSS transitions run
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (n === seq) setValues(id);
      }));
    } else if (animate) {
      setValues(id); // motion stopped: motion.css already turns transitions off
    } else {
      // instant (on load, on a term landing): .stepg / rect.step transitions would otherwise still animate
      // from the built default, so suspend them (svg.css .no-anim), set, force a reflow, then restore
      const root = document.documentElement;
      root.classList.add("no-anim");
      setValues(id);
      void document.body.offsetWidth;
      root.classList.remove("no-anim");
    }
  }

  function select(id: string, animate: boolean) {
    if (!ids.includes(id)) return;
    apply(id, animate);
    history.replaceState(history.state, "", writeView(location.href, id, ids));
  }

  buttons.forEach((b) => b.addEventListener("click", () => select(b.dataset.v!, true)));
  // a term that only shows in another view (Task 6 landing) switches to it at once
  window.nuzhah = { ...window.nuzhah, setView: (id) => select(id, false) };

  apply(readView(location.search, ids), false);
}
