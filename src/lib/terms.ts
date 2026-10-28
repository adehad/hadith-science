// share-link rules (spec §6); paths are base-relative, callers wrap them with href()
export const RESERVED = ["t", "view", "q"] as const;

export interface TermTarget { slug: string; division: string; scene?: string; view?: string }

export function targetPath(t: TermTarget): string {
  if (!t.scene) return `terms/#${t.slug}`;
  const view = t.view ? `?view=${encodeURIComponent(t.view)}` : "";
  return `${t.division}/${t.scene}/${view}#${t.slug}`;
}

export type SlugQuery = { kind: "t" | "bare"; slug: string };

export function parseSlugQuery(search: string): SlugQuery | null {
  const raw = search.replace(/^\?/, "");
  if (!raw) return null;
  const params = [...new URLSearchParams(raw)];
  const t = params.find(([k]) => k === "t");
  if (t) return t[1] ? { kind: "t", slug: t[1].toLowerCase() } : null;
  // bare form: exactly one key, no "=" at all, not a reserved word
  if (params.length !== 1 || raw.includes("=")) return null;
  const key = params[0][0].toLowerCase();
  return key && !(RESERVED as readonly string[]).includes(key) ? { kind: "bare", slug: key } : null;
}

export function resolveQuery(search: string, index: Record<string, string>): string | null {
  const q = parseSlugQuery(search);
  if (!q) return null;
  if (index[q.slug]) return index[q.slug];
  return q.kind === "t" ? `terms/?q=${encodeURIComponent(q.slug)}` : null;
}
