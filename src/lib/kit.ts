// layout maths for the small SVG kit parts (Chip, Gauge, Scale, Decision) and the iʿtibār sweep, kept pure so
// it can be unit-tested

// round to 2 decimals, so the built SVG doesn't carry float noise (re-exported by components/svg/geom.ts)
export const f = (n: number) => +n.toFixed(2);

// the --d (animation delay) of the ith of a row of elements that come in one after another (motion.css .m-draw,
// .m-enter): start seconds, then step seconds apart
export const stagger = (i: number, { start = 0, step }: { start?: number; step: number }) => `${f(start + i * step)}s`;

// chip text is 11px semibold: about 5.6 units per character, with 8 units of padding each side
export const CHIP_CHAR_W = 5.6, CHIP_PAD = 16, CHIP_H = 20;

export function chipWidth(text: string, charW = CHIP_CHAR_W, pad = CHIP_PAD): number {
  return f(text.length * charW + pad);
}

// a verdict pill (Pill.astro) is 11.5px bold: about 6.6 units per character, with 12 units of padding each side.
// Scenes use it to keep a pill inside its panel.
export function pillWidth(text: string): number {
  return f(text.length * 6.6 + 24);
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

// the baseline of line j of n stacked text lines, lh apart and centred on y: a narrator's name lines beside his
// figure (Report.astro, Lone.astro)
export function stackY(y: number, j: number, n: number, lh = 14): number {
  return f(y + (j - (n - 1) / 2) * lh);
}

// a lifespan bar (Lifespan.astro): a rounded bar h tall centred on y, from x0 to x1, with its name's start point
// gap units past the right end, on the bar's middle. The bars show overlap only: no axis, no dates.
export function lifespanBar(x0: number, x1: number, y: number, { h = 8, gap = 6 } = {}) {
  const [a, b] = x0 <= x1 ? [x0, x1] : [x1, x0];
  if (b - a <= 0) throw new Error("lifespanBar: a bar with no length");
  return { x: f(a), y: f(y - h / 2), w: f(b - a), h, rx: f(h / 2), name: { x: f(b + gap), y: f(y + 4) } };
}

// the stretch two spans [x0, x1] share, and its middle, or null if they only touch or don't meet: where two
// lifespans overlap (the hidden scene's "met" knot and "?")
export function spanOverlap(a: [number, number], b: [number, number]): { x0: number; x1: number; mid: number } | null {
  const x0 = Math.max(Math.min(...a), Math.min(...b));
  const x1 = Math.min(Math.max(...a), Math.max(...b));
  if (x1 <= x0) return null;
  return { x0: f(x0), x1: f(x1), mid: f((x0 + x1) / 2) };
}

// a run of n unnamed narrators as rings (Beads.astro, phase 3 lataif design §11): each ring's centre, every gap
// units from (x, y) down the page or to the right, and the edge points where a chain's arrow meets the first ring
// (start) and leaves the last (end), so scenes join their arrows to a run without repeating the ring radius
export const BEAD_R = 4;
export function beadRun(x: number, y: number, n: number, gap: number, dir: "down" | "right" = "down") {
  const down = dir === "down";
  const rings = Array.from({ length: n }, (_, i) => (down ? { x, y: f(y + i * gap) } : { x: f(x + i * gap), y }));
  const first = rings[0], last = rings[n - 1];
  const start = down ? { x, y: f(first.y - BEAD_R) } : { x: f(first.x - BEAD_R), y };
  const end = down ? { x, y: f(last.y + BEAD_R) } : { x: f(last.x + BEAD_R), y };
  return { rings, start, end };
}

// one undotted letter outline, a dotless bāʾ bowl centred on (gx, gy), as an SVG path: the written shape that its
// dots or vowels decide how to read (Names.astro's muʾtalif cell, Changes.astro's muṣaḥḥaf and muḥarraf cell).
// Single letter shapes only, never words.
export function letterShape(gx: number, gy: number): string {
  return `M${f(gx - 26)} ${f(gy - 14)} Q${f(gx - 28)} ${f(gy + 8)} ${f(gx)} ${f(gy + 8)} Q${f(gx + 28)} ${f(gy + 8)} ${f(gx + 26)} ${f(gy - 14)}`;
}

// the dot patterns that read the outline as bāʾ (one below), tāʾ (two above) or thāʾ (three above), as offsets
// from the letter's centre
export const LETTER_DOTS = {
  none: [],
  below: [[0, 20]],
  two: [[-6, -22], [6, -22]],
  three: [[-6, -22], [6, -22], [0, -31]],
} as const satisfies Record<string, readonly (readonly [number, number])[]>;

// the dots of a letter centred on (cx, cy), each r in radius
export function letterDots(cx: number, cy: number, dots: readonly (readonly [number, number])[], r = 3.6) {
  return dots.map(([dx, dy]) => ({ cx: f(cx + dx), cy: f(cy + dy), r }));
}

// a short vowel over or under a letter centred on (cx, cy), as an SVG path to stroke: the fatḥa a slanted stroke
// above, the kasra the same stroke below, the ḍamma a small curl above (Changes.astro's muḥarraf)
export function vowelMark(cx: number, cy: number, kind: "fatha" | "damma" | "kasra"): string {
  const p = (dx: number, dy: number) => `${f(cx + dx)} ${f(cy + dy)}`;
  if (kind === "fatha") return `M${p(-7, -21)} L${p(7, -27)}`;
  if (kind === "kasra") return `M${p(-7, 21)} L${p(7, 15)}`;
  return `M${p(1, -22)} Q${p(-4, -22)} ${p(-3, -27)} Q${p(2, -31)} ${p(3, -25)} Q${p(3, -18)} ${p(-4, -16)}`;
}
