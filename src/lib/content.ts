import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { inventoryErrors, sceneErrors, type InvScene } from "./inventory";

let checked = false;
// throws during build so a broken reference fails CI (spec §9)
export async function loadContent() {
  const divisions = (await getCollection("divisions")).map((d) => d.data).sort((a, b) => a.order - b.order);
  const terms = (await getCollection("terms")).map((t) => ({ ...t.data, division: t.data.division.id }));
  const divOrder = new Map(divisions.map((d) => [d.id, d.order]));
  const scenes = (await getCollection("scenes"))
    .map((s) => ({ ...s.data, division: s.data.division.id }))
    .sort((a, b) => (divOrder.get(a.division) ?? 0) - (divOrder.get(b.division) ?? 0) || a.order - b.order);
  if (!checked) {
    const raw = (parse(readFileSync("src/content/terms.yaml", "utf8")) ?? []) as { id: string; division: string }[];
    // the file() loader keeps only the last entry per id, so duplicates are checked on the raw YAML
    const rawScenes = (parse(readFileSync("src/content/scenes.yaml", "utf8")) ?? []) as InvScene[];
    const errs = [
      ...inventoryErrors(raw, rawScenes.map((s) => `${s.division}/${s.id}`), divisions.map((d) => d.id)),
      ...sceneErrors(rawScenes, raw, divisions),
    ];
    if (errs.length) throw new Error("Content errors:\n" + errs.join("\n"));
    checked = true;
  }
  return { divisions, terms, scenes };
}
