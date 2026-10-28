// layout maths for the small SVG kit parts (Chip, Gauge), kept pure so it can be unit-tested

// round to 2 decimals, so the built SVG doesn't carry float noise (re-exported by components/svg/geom.ts)
export const f = (n: number) => +n.toFixed(2);

// chip text is 11px semibold: about 5.6 units per character, with 8 units of padding each side
export const CHIP_CHAR_W = 5.6, CHIP_PAD = 16, CHIP_H = 20;

export function chipWidth(text: string, charW = CHIP_CHAR_W, pad = CHIP_PAD): number {
  return f(text.length * charW + pad);
}

export interface RowChip { x: number; w: number; cx: number; text: string }

// chips in a row from x0, gap units apart; links are the gaps between neighbours (where an arrow goes),
// and end is the right edge of the last chip
export function chipRow(texts: string[], x0: number, gap: number, { charW = CHIP_CHAR_W, pad = CHIP_PAD } = {}) {
  const chips: RowChip[] = [];
  const links: { x1: number; x2: number }[] = [];
  let x = x0;
  texts.forEach((text, i) => {
    const w = chipWidth(text, charW, pad);
    if (i > 0) links.push({ x1: f(x - gap), x2: x });
    chips.push({ x, w, cx: f(x + w / 2), text });
    x = f(x + w + gap);
  });
  return { chips, links, end: f(x - (texts.length ? gap : 0)) };
}

// a gauge of `of` equal cells across w units from x, gap units apart, the first `fill` of them on.
// It shows relative order only, never a measure.
export function gaugeCells(x: number, w: number, of: number, fill: number, gap = 2) {
  const cw = (w - gap * (of - 1)) / of;
  const n = Math.max(0, Math.min(of, fill));
  return Array.from({ length: of }, (_, i) => ({ x: f(x + i * (cw + gap)), w: f(cw), on: i < n }));
}
