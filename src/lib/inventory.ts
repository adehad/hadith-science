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
