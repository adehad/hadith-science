import { RESERVED } from "./terms";

export interface InvTerm { id: string; division: string; scene?: string; view?: string }

// scenes are "division/scene" ids; empty until phase 2
export function inventoryErrors(terms: InvTerm[], scenes: string[], divisions: string[]): string[] {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const t of terms) {
    if ((RESERVED as readonly string[]).includes(t.id)) errs.push(`term ${t.id}: slug is a reserved word`);
    if (seen.has(t.id)) errs.push(`term ${t.id}: duplicate slug`);
    seen.add(t.id);
    if (!divisions.includes(t.division)) errs.push(`term ${t.id}: unknown division ${t.division}`);
    if (t.view && !t.scene) errs.push(`term ${t.id}: view set but no scene`);
    if (t.scene && !scenes.includes(`${t.division}/${t.scene}`)) errs.push(`term ${t.id}: unknown scene ${t.division}/${t.scene}`);
  }
  return errs;
}

export interface InvScene {
  id: string;
  division: string;
  moons: number[];
  captions: { term: string }[];
  views?: { id: string }[];
  panels?: { x0: number; x1: number }[];
  width: number;
}
export interface InvDivision { id: string; moons: string[] }

// ties scenes to divisions and to the term inventory both ways (spec §9)
export function sceneErrors(scenes: InvScene[], terms: InvTerm[], divisions: InvDivision[]): string[] {
  const errs: string[] = [];
  const termById = new Map(terms.map((t) => [t.id, t]));
  const seen = new Set<string>();
  for (const s of scenes) {
    const at = `scene ${s.id}:`;
    if (seen.has(s.id)) errs.push(`${at} duplicate id`);
    seen.add(s.id);
    const div = divisions.find((d) => d.id === s.division);
    if (!div) errs.push(`${at} unknown division ${s.division}`);
    else for (const m of s.moons) if (m < 0 || m >= div.moons.length || !Number.isInteger(m)) errs.push(`${at} moon ${m} out of range`);
    for (const { term } of s.captions) {
      const t = termById.get(term);
      if (!t) errs.push(`${at} caption term ${term} not in inventory`);
      else if (t.scene !== s.id || t.division !== s.division) {
        const home = !t.scene ? "none" : t.division === s.division ? t.scene : `${t.division}/${t.scene}`;
        errs.push(`${at} caption term ${term} has scene ${home}`);
      }
    }
    const views = new Set<string>();
    for (const v of s.views ?? []) {
      if (views.has(v.id)) errs.push(`${at} duplicate view id ${v.id}`);
      views.add(v.id);
    }
    if (s.panels) {
      const ps = [...s.panels].sort((a, b) => a.x0 - b.x0);
      let x = 0;
      let tiles = ps.length > 0;
      for (const p of ps) {
        if (p.x0 !== x || p.x1 <= p.x0) tiles = false;
        x = p.x1;
      }
      if (!tiles || x !== s.width) errs.push(`${at} panels must tile 0..width`);
    }
  }
  for (const t of terms) {
    if (!t.scene) continue;
    // unknown scene is reported by inventoryErrors
    const s = scenes.find((x) => x.id === t.scene && x.division === t.division);
    if (!s) continue;
    if (!s.captions.some((c) => c.term === t.id)) errs.push(`term ${t.id}: scene ${s.id} does not caption it`);
    if (t.view && !(s.views ?? []).some((v) => v.id === t.view)) errs.push(`term ${t.id}: view ${t.view} not in scene ${s.id}`);
  }
  return errs;
}
