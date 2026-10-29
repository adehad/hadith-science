import type { loadContent } from "./content";

// what a diagram needs to draw a term trigger: names for the label, and the popover payload
export interface Cap { slug: string; translit: string; ar: string; en: string; section: string; note: string; json: string }

interface CapScene { id: string; captions: { term: string; note: string }[] }
interface CapTerm { id: string; translit: string; ar: string; en: string; section: string }

// keyed by slug; the popover shows this scene's longer note in place of the glossary def
export function captionsFor(scene: CapScene, terms: CapTerm[]): Record<string, Cap> {
  const caps: Record<string, Cap> = {};
  for (const { term, note } of scene.captions) {
    const t = terms.find((x) => x.id === term);
    if (!t) throw new Error(`scene ${scene.id}: caption term ${term} not in inventory`);
    const { translit, ar, en, section } = t;
    caps[term] = { slug: term, translit, ar, en, section, note, json: JSON.stringify({ translit, ar, def: note, section }) };
  }
  return caps;
}

// throws so a typo in a diagram fails the build
export function cap(caps: Record<string, Cap>, slug: string): Cap {
  const c = caps[slug];
  if (!c) throw new Error(`scene caption ${slug} missing`);
  return c;
}

// the props every scene diagram takes; [scene].astro picks the diagram by the scene's `diagram` field
export interface DiagramProps { caps: Record<string, Cap>; scene: Awaited<ReturnType<typeof loadContent>>["scenes"][number] }

interface NavScene { id: string; division: string }

/** a scene's prev and next within its own division; `scenes` sorted by division, then order (as loadContent gives) */
export function neighbours<S extends NavScene>(scenes: S[], scene: S): { prev?: S; next?: S } {
  const mine = scenes.filter((s) => s.division === scene.division);
  const i = mine.indexOf(scene);
  if (i < 0) throw new Error(`neighbours: scene ${scene.division}/${scene.id} is not in the list`);
  return { prev: mine[i - 1], next: mine[i + 1] };
}

/** a division's scenes under each of its moons, in scene order; a scene covering several moons is under each */
export function scenesByMoon<S extends NavScene & { moons: number[] }>(division: { id: string; moons: unknown[] }, scenes: S[]): S[][] {
  return division.moons.map((_, k) => scenes.filter((s) => s.division === division.id && s.moons.includes(k)));
}
