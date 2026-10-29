// shared diagram geometry

// round to 2 decimals, so the built SVG doesn't carry float noise; it lives with the other pure layout maths
export { f } from "../../lib/kit";
import { f } from "../../lib/kit";

export interface TitleTriggerOpts {
  /** estimated width per character of the title (11 for the 20px display title) */
  charW?: number;
  /** offset of the (i) from the centre per character; a little over half of charW, so it clears wide titles */
  half?: number;
  /** extra half-width for wide letters (Unknown's m and w), added each side of the title and before the (i) */
  extra?: number;
  /** space between the title's estimated end and the (i)'s centre */
  gap?: number;
  /** how far the hit area reaches above the baseline, and its height */
  top?: number;
  h?: number;
  /** the (i)'s radius, when not InfoIcon's default */
  r?: number;
  /** start the hit area here instead, to take in something before the title (Support's lens) */
  x0?: number;
}

// a centred title as a term trigger (worked out first in Routes.astro): the (i) placement and a hit area that
// runs from just before the title to just past the (i). text is the visible title, cx its centre, y its baseline.
export function titleTrigger(
  text: string, cx: number, y: number,
  { charW = 11, half = 6.4, extra = 0, gap = 16, top = 22, h = 30, r, x0 }: TitleTriggerOpts = {},
) {
  const n = text.length;
  const tw = n * charW + extra * 2;
  const info = { cx: f(cx + n * half + extra + gap), cy: y - 6, ...(r ? { r } : {}) };
  const x = f(x0 ?? cx - tw / 2 - 6);
  return { info, hit: { x, y: y - top, w: f(info.cx + 13 - x), h } };
}

// the 15px display sub-title as a term trigger (Grades' lifts, Support's brackets, ActedOn's cards): about 9.2
// units per character, the widest of the phase 3 titles, so every scene estimates their width the same way
const SUBT_W = 9.2;
export const SUBT_TRIGGER = { charW: SUBT_W, half: SUBT_W / 2, gap: 12, top: 17, h: 24, r: 7 } as const satisfies TitleTriggerOpts;

// a centred 13px bold row label as a term trigger (Sorting's alias row): about 6.7 units per character, as rowTrigger
const ROW_W = 6.7;
export const ROW_TITLE_TRIGGER = { charW: ROW_W, half: ROW_W / 2, gap: 12, top: 13, h: 18, r: 7 } as const satisfies TitleTriggerOpts;

export interface RowTriggerOpts {
  /** estimated width per character of the row text (6.7 for 13px bold) */
  charW?: number;
  /** where the hit area starts, when something before the text (a glyph) belongs to it; default just before x */
  x0?: number;
  /** where the hit area ends, when it runs on past the (i) (to the edge of a row); default just past the (i) */
  x1?: number;
  /** how far the hit area reaches above the baseline, and its height */
  top?: number;
  h?: number;
}

// a left-aligned row label as a term trigger: the text starts at x on baseline y, the (i) follows it, and the hit
// area covers both (Grades' checklist and ladder rungs)
export function rowTrigger(text: string, x: number, y: number, { charW = 6.7, x0 = x - 6, x1, top = 13, h = 18 }: RowTriggerOpts = {}) {
  const info = { cx: f(x + text.length * charW + 12), cy: y - 4, r: 7 };
  const end = x1 ?? info.cx + 10;
  return { info, hit: { x: f(x0), y: y - top, w: f(end - x0), h } };
}
