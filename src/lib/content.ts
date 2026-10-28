import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { inventoryErrors } from "./inventory";

let checked = false;
// throws during build so a broken reference fails CI (spec §9)
export async function loadContent() {
  const divisions = (await getCollection("divisions")).map((d) => d.data).sort((a, b) => a.order - b.order);
  const terms = (await getCollection("terms")).map((t) => ({ ...t.data, division: t.data.division.id }));
  if (!checked) {
    const raw = (parse(readFileSync("src/content/terms.yaml", "utf8")) ?? []) as { id: string; division: string }[];
    const errs = inventoryErrors(raw, [], divisions.map((d) => d.id));
    if (errs.length) throw new Error("Content errors:\n" + errs.join("\n"));
    checked = true;
  }
  return { divisions, terms };
}
