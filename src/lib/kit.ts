// layout maths for the small SVG kit parts (Chip, Gauge, Scale, Decision) and the iʿtibār sweep, kept pure so
// it can be unit-tested

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

// a balance beam w units wide, pivoting at px and tilted by `tilt` degrees (CSS rotate: positive is clockwise,
// so the right end goes down). Each end's x and how far it moves in y from level; the pans hang from the ends,
// so they translate by dy and stay level rather than rotating with the beam.
export function scaleEnds(px: number, w: number, tilt: number) {
  const a = (tilt * Math.PI) / 180;
  const dx = (w / 2) * Math.cos(a), dy = (w / 2) * Math.sin(a);
  return { left: { x: f(px - dx), dy: f(-dy) || 0 }, right: { x: f(px + dx), dy: f(dy) || 0 } };
}

// the centres of n weight discs in a row, centred on cx and gap apart
export function discRow(n: number, cx: number, gap: number): number[] {
  return Array.from({ length: n }, (_, i) => f(cx + (i - (n - 1) / 2) * gap));
}

// when a sweep moving at a steady speed from x0 (at t0 seconds) to x1 (at t1) reaches x; x outside the sweep
// clamps to its ends. Support.astro times each route's lighting to the iʿtibār lens passing its book.
export function sweepAt(x: number, { x0, x1, t0, t1 }: { x0: number; x1: number; t0: number; t1: number }): number {
  const u = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
  return f(t0 + u * (t1 - t0));
}

// a diamond centred on (cx, cy), w wide and h tall, as an SVG path with each corner rounded: the straight edges
// stop r units short of every vertex and a quadratic curve turns through it (Decision.astro). r is clamped to
// half an edge so neighbouring corners never cross; r = 0 gives the sharp diamond.
export function diamondPath(cx: number, cy: number, w: number, h: number, r: number): string {
  const v = [[cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2], [cx - w / 2, cy]];
  const p = (x: number, y: number) => `${f(x)} ${f(y)}`;
  if (r <= 0) return `M${v.map(([x, y]) => p(x, y)).join(" L")} Z`;
  const t = Math.min(r / Math.hypot(w / 2, h / 2), 0.5);
  const along = (a: number[], b: number[]) => p(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
  let d = `M${along(v[0], v[1])}`;
  for (let i = 1; i <= 4; i++) {
    const [prev, cur, next] = [v[i - 1], v[i % 4], v[(i + 1) % 4]];
    d += ` L${along(cur, prev)} Q${p(cur[0], cur[1])} ${along(cur, next)}`;
  }
  return `${d} Z`;
}

export interface BracketOpts {
  /** a vertical bracket runs down from a0 to a1 at x = at; a horizontal one (the default) across at y = at */
  vertical?: boolean;
  /** which way the end ticks point: up (the default) or down when horizontal, left (the default) or right when
   *  vertical */
  ticks?: "up" | "down" | "left" | "right";
  /** an open arrowhead beyond one end (a0 is the start), pointing away from the bracket */
  arrow?: "start" | "end";
  /** the ticks' length */
  tick?: number;
}

// a bracket (Bracket.astro) as one SVG path: a spine from a0 to a1 with a tick at each end, and optionally the spine
// running on past one end to an open chevron (the isnād bracket's "towards the matn")
export function bracketPath(a0: number, a1: number, at: number, { vertical = false, ticks, arrow, tick = 7 }: BracketOpts = {}): string {
  const dir = ticks ?? (vertical ? "left" : "up");
  if (vertical !== (dir === "left" || dir === "right")) throw new Error(`bracketPath: ticks ${dir} don't fit a ${vertical ? "vertical" : "horizontal"} bracket`);
  const t = f(at + (dir === "up" || dir === "left" ? -tick : tick));
  const AR = 10, HW = 4, HD = 5;
  // p(along, across) writes a point in the bracket's own frame
  const p = (a: number, c: number) => (vertical ? `${f(c)} ${f(a)}` : `${f(a)} ${f(c)}`);
  let d = vertical ? `M${t} ${f(a0)} H${f(at)} V${f(a1)} H${t}` : `M${f(a0)} ${t} V${f(at)} H${f(a1)} V${t}`;
  if (arrow) {
    const end = arrow === "start" ? a0 : a1;
    const s = (arrow === "start") === a0 < a1 ? -1 : 1; // away from the bracket
    const tip = end + s * AR, back = tip - s * HD;
    d += ` M${p(end, at)} ${vertical ? "V" : "H"}${f(tip)} M${p(back, at - HW)} L${p(tip, at)} L${p(back, at + HW)}`;
  }
  return d;
}

// n dots in pairs, centred on (cx, cy) and gap apart, an odd last dot centred under its pair: the mustafīḍ inset's
// narrators at one stage of a chain (Sorting.astro). Dots, not digits, so it shows a pattern without a count.
export function dotCluster(n: number, cx: number, cy: number, gap: number): { x: number; y: number }[] {
  const rows = Math.ceil(n / 2);
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / 2);
    const alone = i === n - 1 && n % 2 === 1;
    return { x: f(alone ? cx : cx + (i % 2 ? gap : -gap) / 2) || 0, y: f(cy + (row - (rows - 1) / 2) * gap) || 0 };
  });
}
