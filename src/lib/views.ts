// the chosen view lives in ?view= so a link opens on it (spec §5); the first id is the default (Ibn Ḥajar's)

/** The view named by ?view= in `search`; a missing or unknown value gives the default, ids[0]. */
export function readView(search: string, ids: string[]): string {
  const v = new URLSearchParams(search).get("view");
  return v && ids.includes(v) ? v : ids[0];
}

/** `url` with ?view=id, or with view removed when id is the default (or unknown); other params and the hash stay. */
export function writeView(url: string, id: string, ids: string[]): string {
  const u = new URL(url);
  if (id !== ids[0] && ids.includes(id)) u.searchParams.set("view", id);
  else u.searchParams.delete("view");
  return u.href;
}
