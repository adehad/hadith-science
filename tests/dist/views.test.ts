// S2: view integrity (audit D7). viewswitch.ts sets each [data-v-<id>]/[data-h-<id>]/[data-fill-<id>] value when
// view <id> is chosen, so an element missing one view's attribute keeps a stale value in that view; and the build
// must render the default view (inline values, class "off" on parts outside it) for no-JS readers and first paint.
import { describe, expect, it } from "vitest";
import { inlineStyle, page, scenes } from "./site";

// attribute prefix -> the style property viewswitch.ts sets from it
const PER_VIEW = { "data-v-": "transform", "data-h-": "height", "data-fill-": "fill" } as const;
const norm = (s: string | null | undefined) => s?.replace(/\s+/g, " ").replace(/\s*([(,)])\s*/g, "$1").trim();

describe("built views", () => {
  it("every scene's view parts agree with its views", () => {
    const bad: string[] = [];
    let viewScenes = 0, valued = 0;
    for (const s of scenes) {
      const path = `${s.division}/${s.id}/`;
      const doc = page(path);
      if (!doc) { bad.push(`${path}: not built`); continue; }
      const ids = s.views?.map((v) => v.id) ?? [];
      const known = new Set(ids);
      const def = ids[0];
      const box = doc.querySelector(".views[data-views]");
      if (ids.length) {
        viewScenes++;
        const buttons = [...doc.querySelectorAll(".views button[data-v]")].map((b) => b.getAttribute("data-v"));
        if (box?.getAttribute("data-views") !== ids.join(" ")) bad.push(`${path}: switch lists ${box?.getAttribute("data-views")}`);
        if (buttons.join(" ") !== ids.join(" ")) bad.push(`${path}: buttons ${buttons.join(" ")}`);
      } else if (box) bad.push(`${path}: a view switch on a scene with no views`);

      const parts = doc.querySelectorAll("[data-view-show]");
      if (ids.length && parts.length === 0) bad.push(`${path}: no [data-view-show] parts`);
      for (const el of parts) {
        const show = el.getAttribute("data-view-show")!.split(/\s+/);
        const unknown = show.filter((v) => !known.has(v));
        if (unknown.length) bad.push(`${path}: data-view-show names unknown view ${unknown.join(" ")}`);
        const off = el.classList.contains("off");
        if (off === show.includes(def)) bad.push(`${path}: part for "${show.join(" ")}" is ${off ? "off" : "on"} in the default view`);
        // a nested part is shown only inside its enclosing part, so a view it names that the outer one lacks is dead
        const outer = el.parentElement?.closest("[data-view-show]")?.getAttribute("data-view-show")!.split(/\s+/);
        const dead = outer ? show.filter((v) => !outer.includes(v)) : [];
        if (dead.length) bad.push(`${path}: part for "${show.join(" ")}" sits inside a part for "${outer!.join(" ")}"`);
      }

      for (const el of doc.querySelectorAll("*")) {
        for (const [prefix, prop] of Object.entries(PER_VIEW)) {
          const has = el.getAttributeNames().filter((a) => a.startsWith(prefix)).map((a) => a.slice(prefix.length));
          if (!has.length) continue;
          valued++;
          const tag = `${path}: <${el.tagName.toLowerCase()} ${prefix}*>`;
          const missing = ids.filter((v) => !has.includes(v));
          const extra = has.filter((v) => !known.has(v));
          if (missing.length) bad.push(`${tag} has no value for view ${missing.join(" ")}`);
          if (extra.length) bad.push(`${tag} names unknown view ${extra.join(" ")}`);
          if (def && norm(inlineStyle(el, prop)) !== norm(el.getAttribute(prefix + def)))
            bad.push(`${tag} renders ${prop} "${inlineStyle(el, prop)}", not the default view's "${el.getAttribute(prefix + def)}"`);
        }
      }
    }
    expect(viewScenes).toBeGreaterThan(0);
    expect(valued).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });
});
