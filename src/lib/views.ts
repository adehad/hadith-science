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

// the per-view attributes viewswitch.ts reads: data-v-<id> (transform), data-h-<id> (height), data-fill-<id> (fill)
const VIEW_CSS = { v: "transform", h: "height", fill: "fill" } as const;
export type ViewProp = keyof typeof VIEW_CSS;

/**
 * An element's attributes for the view switch: for each property, a data-<prop>-<id> value for every view, and an
 * inline style with the default view's (ids[0]) values, which is what the build shows. Throws if a view has no
 * value (the element would keep the last view's when the reader switches to it) or a value names no view.
 */
export function viewAttrs(byProp: Partial<Record<ViewProp, Record<string, string>>>, ids: readonly string[]): Record<string, string> {
  const attrs: Record<string, string> = {};
  const style: string[] = [];
  for (const [prop, byView] of Object.entries(byProp) as [ViewProp, Record<string, string>][]) {
    for (const id of ids) {
      if (!(id in byView)) throw new Error(`viewAttrs: no ${prop} for view ${id}`);
      attrs[`data-${prop}-${id}`] = byView[id];
    }
    const stray = Object.keys(byView).filter((id) => !ids.includes(id));
    if (stray.length) throw new Error(`viewAttrs: ${prop} for unknown view ${stray.join(", ")}`);
    style.push(`${VIEW_CSS[prop]}:${byView[ids[0]]}`);
  }
  attrs.style = style.join(";");
  return attrs;
}
