// shared diagram geometry

// round to 2 decimals, so the built SVG doesn't carry float noise
export const f = (n: number) => +n.toFixed(2);

export interface TitleTriggerOpts {
  /** estimated width per character of the title (11 for the 20px display title) */
  charW?: number;
  /** offset of the (i) from the centre per character; a little over half of charW, so it clears wide titles */
  half?: number;
  /** extra half-width for wide letters (Unknown's m and w), added each side of the title and before the (i) */
  extra?: number;
}

// a centred title as a term trigger (worked out first in Routes.astro): the (i) placement and a hit area that
// runs from just before the title to just past the (i). text is the visible title, cx its centre, y its baseline.
export function titleTrigger(text: string, cx: number, y: number, { charW = 11, half = 6.4, extra = 0 }: TitleTriggerOpts = {}) {
  const n = text.length;
  const tw = n * charW + extra * 2;
  const info = { cx: f(cx + n * half + extra + 16), cy: y - 6 };
  const x0 = f(cx - tw / 2 - 6);
  return { info, hit: { x: x0, y: y - 22, w: f(info.cx + 13 - x0), h: 30 } };
}
