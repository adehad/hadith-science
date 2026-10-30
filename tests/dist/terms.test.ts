// S1: every term's /t/<slug>/ share page sends the reader to a target that exists in the build
import { describe, expect, it } from "vitest";
import { targetPath } from "../../src/lib/terms";
import { href } from "../../src/lib/url";
import { BASE, page, resolve, scenes, terms } from "./site";

const TRIGGER = "[data-term][data-term-json]";

describe("built terms", () => {
  it("each /t/<slug>/ refreshes to its term's target path", () => {
    expect(terms.length).toBeGreaterThan(0);
    const bad: string[] = [];
    for (const t of terms) {
      const refresh = page(`t/${t.id}/`)?.querySelector('meta[http-equiv="refresh"]')?.getAttribute("content");
      const want = `0; url=${href(targetPath({ slug: t.id, ...t }), BASE)}`;
      if (refresh !== want) bad.push(`${t.id}: ${refresh ?? "no share page"} (want ${want})`);
    }
    expect(bad).toEqual([]);
  });

  it("a scene term has exactly one trigger on its scene, shown in the view it lands on", () => {
    const built = terms.filter((t) => t.scene);
    expect(built.length).toBeGreaterThan(0);
    const bad: string[] = [];
    for (const t of built) {
      const doc = page(`${t.division}/${t.scene}/`);
      if (!doc) { bad.push(`${t.id}: no page ${t.division}/${t.scene}/`); continue; }
      const found = [...doc.querySelectorAll(TRIGGER)].filter((el) => el.getAttribute("data-term") === t.id);
      if (found.length !== 1) { bad.push(`${t.id}: ${found.length} triggers`); continue; }
      // the landing view: the term's own view:, else the scene's default
      const scene = scenes.find((s) => s.id === t.scene && s.division === t.division);
      const view = t.view ?? scene?.views?.[0].id;
      // every enclosing view part must show it: an outer part hides it even when an inner one lists the view
      for (let part = found[0].closest("[data-view-show]"); view && part; part = part.parentElement?.closest("[data-view-show]") ?? null)
        if (!part.getAttribute("data-view-show")!.split(/\s+/).includes(view)) { bad.push(`${t.id}: trigger hidden in view ${view}`); break; }
    }
    expect(bad).toEqual([]);
  });

  it("a pending term lands on its glossary entry", () => {
    // pending terms run out once every division is built, so this one has no non-zero guard of its own
    const bad: string[] = [];
    for (const t of terms.filter((x) => !x.scene)) {
      const target = resolve(href(targetPath({ slug: t.id, ...t }), BASE), "")!;
      const entry = page(target.path)?.getElementById(target.hash);
      if (!entry?.hasAttribute("data-entry")) bad.push(`${t.id}: no #${target.hash}[data-entry] on /${target.path}`);
    }
    expect(bad).toEqual([]);
  });
});
