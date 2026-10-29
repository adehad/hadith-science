import { describe, expect, it } from "vitest";
import { CHIP_CHAR_W, CHIP_PAD, bracketPath, chipRow, chipWidth, diamondPath, discRow, dotCluster, gaugeCells, letterDots, lifespanBar, pillWidth, scaleEnds, spanOverlap, stackY, sweepAt, vowelMark } from "../../src/lib/kit";

describe("chipWidth", () => {
  it("grows with the text, plus padding", () => {
    expect(chipWidth("Jābir")).toBe(5 * CHIP_CHAR_W + CHIP_PAD);
    expect(chipWidth("")).toBe(CHIP_PAD);
  });
  it("rounds away float noise", () => {
    expect(chipWidth("abc", 1.1, 0.2)).toBe(3.5);
  });
});

describe("pillWidth", () => {
  it("rounds away float noise", () => {
    expect(pillWidth("abc")).toBe(43.8);
  });
});

describe("chipRow", () => {
  it("lays chips left to right with a link between each pair", () => {
    const { chips, links, end } = chipRow(["a", "bb", "ccc"], 10, 20, { charW: 10, pad: 0 });
    expect(chips.map((c) => [c.x, c.w, c.cx, c.text])).toEqual([
      [10, 10, 15, "a"],
      [40, 20, 50, "bb"],
      [80, 30, 95, "ccc"],
    ]);
    // each link runs across the gap between two chips
    expect(links).toEqual([{ x1: 20, x2: 40 }, { x1: 60, x2: 80 }]);
    expect(end).toBe(110);
  });
  it("has no links for a single chip", () => {
    const { chips, links } = chipRow(["one"], 0, 12);
    expect(chips).toHaveLength(1);
    expect(links).toEqual([]);
  });
});

describe("gaugeCells", () => {
  it("splits the width into equal cells with gaps, filling the first ones", () => {
    const cells = gaugeCells(100, 48, 5, 3, 2);
    expect(cells).toHaveLength(5);
    expect(cells.map((c) => c.on)).toEqual([true, true, true, false, false]);
    expect(cells[0]).toEqual({ x: 100, w: 8, on: true });
    expect(cells[4].x + cells[4].w).toBe(148);
    for (let i = 1; i < 5; i++) expect(cells[i].x - (cells[i - 1].x + cells[i - 1].w)).toBe(2);
  });
  it("clamps the fill to 0..of", () => {
    expect(gaugeCells(0, 20, 4, 9).every((c) => c.on)).toBe(true);
    expect(gaugeCells(0, 20, 4, -1).some((c) => c.on)).toBe(false);
  });
  it("orders gauges: more fill means more cells on", () => {
    const on = (n: number) => gaugeCells(0, 40, 5, n).filter((c) => c.on).length;
    expect([5, 4, 3, 2].map(on)).toEqual([5, 4, 3, 2]);
  });
});

describe("scaleEnds", () => {
  it("puts the ends half the beam either side of the pivot when level", () => {
    expect(scaleEnds(390, 180, 0)).toEqual({ left: { x: 300, dy: 0 }, right: { x: 480, dy: 0 } });
  });
  it("a negative tilt lowers the left end and raises the right by the same amount", () => {
    const { left, right } = scaleEnds(390, 180, -8);
    expect(left.dy).toBeCloseTo(90 * Math.sin((8 * Math.PI) / 180), 2);
    expect(right.dy).toBe(-left.dy);
    // the pans hang from the beam's ends, which move in a little as it tilts
    expect(left.x).toBeGreaterThan(300);
    expect(right.x).toBeLessThan(480);
  });
  it("a positive tilt lowers the right end (CSS rotate is clockwise)", () => {
    const { left, right } = scaleEnds(0, 100, 8);
    expect(right.dy).toBeGreaterThan(0);
    expect(left.dy).toBeLessThan(0);
  });
});

describe("discRow", () => {
  it("centres n discs on cx, gap apart", () => {
    expect(discRow(3, 100, 14)).toEqual([86, 100, 114]);
    expect(discRow(2, 0, 10)).toEqual([-5, 5]);
    expect(discRow(1, 50, 10)).toEqual([50]);
    expect(discRow(0, 50, 10)).toEqual([]);
  });
});

describe("sweepAt", () => {
  const sweep = { x0: 40, x1: 740, t0: 0.8, t1: 4.8 };
  it("is t0 at x0 and t1 at x1", () => {
    expect(sweepAt(40, sweep)).toBe(0.8);
    expect(sweepAt(740, sweep)).toBe(4.8);
  });
  it("moves at a steady speed in between", () => {
    expect(sweepAt(390, sweep)).toBe(2.8);
    expect(sweepAt(132, sweep)).toBe(1.33);
  });
  it("clamps x outside the sweep to its ends", () => {
    expect(sweepAt(0, sweep)).toBe(0.8);
    expect(sweepAt(900, sweep)).toBe(4.8);
  });
});

describe("diamondPath", () => {
  it("is a sharp diamond through the four edge midpoints when r is 0", () => {
    expect(diamondPath(50, 30, 100, 60, 0)).toBe("M50 0 L100 30 L50 60 L0 30 Z");
  });
  it("rounds each corner, starting r along the top-right edge and curving through every vertex", () => {
    // each edge of an 80 x 60 diamond is 50 long, so r = 10 is a fifth of the way along it
    const d = diamondPath(40, 30, 80, 60, 10);
    expect(d.startsWith("M48 6 ")).toBe(true);
    expect(d).toContain("L72 24 Q80 30 72 36");
    expect(d).toContain("Q40 60 32 54");
    expect(d).toContain("Q0 30 8 24");
    expect(d.endsWith("Q40 0 48 6 Z")).toBe(true);
  });
  it("clamps r to half an edge, so the corners never cross", () => {
    expect(diamondPath(40, 30, 80, 60, 99)).toBe(diamondPath(40, 30, 80, 60, 25));
  });
});

describe("bracketPath", () => {
  it("draws Support's horizontal bracket: ticks up from each end of a line", () => {
    expect(bracketPath(110, 158, 474)).toBe("M110 467 V474 H158 V467");
  });
  it("turns its ticks down", () => {
    expect(bracketPath(10, 50, 100, { ticks: "down" })).toBe("M10 107 V100 H50 V107");
  });
  it("draws a vertical bracket, ticks left by default, and right on request", () => {
    expect(bracketPath(106, 334, 200, { vertical: true })).toBe("M193 106 H200 V334 H193");
    expect(bracketPath(106, 334, 200, { vertical: true, ticks: "right" })).toBe("M207 106 H200 V334 H207");
  });
  it("adds an open arrowhead beyond the chosen end, pointing away from the bracket", () => {
    // the spine runs on 10 past the end, and a chevron 4 each side, 5 deep, opens back towards the bracket
    expect(bracketPath(106, 334, 200, { vertical: true, arrow: "start" })).toBe("M193 106 H200 V334 H193 M200 106 V96 M196 101 L200 96 L204 101");
    expect(bracketPath(10, 50, 100, { arrow: "end" })).toBe("M10 93 V100 H50 V93 M50 100 H60 M55 96 L60 100 L55 104");
  });
  it("rejects ticks that don't fit its orientation", () => {
    expect(() => bracketPath(0, 10, 0, { ticks: "left" })).toThrow();
    expect(() => bracketPath(0, 10, 0, { vertical: true, ticks: "up" })).toThrow();
  });
});

describe("dotCluster", () => {
  it("stacks dots in pairs, centred on (cx, cy), gap apart", () => {
    expect(dotCluster(4, 50, 100, 6)).toEqual([
      { x: 47, y: 97 }, { x: 53, y: 97 },
      { x: 47, y: 103 }, { x: 53, y: 103 },
    ]);
  });
  it("centres an odd last dot under its pair", () => {
    expect(dotCluster(3, 50, 100, 6)).toEqual([{ x: 47, y: 97 }, { x: 53, y: 97 }, { x: 50, y: 103 }]);
    expect(dotCluster(1, 10, 20, 6)).toEqual([{ x: 10, y: 20 }]);
  });
  it("keeps the whole cluster centred as it grows", () => {
    const ys = dotCluster(6, 0, 0, 5).map((d) => d.y);
    expect(Math.min(...ys)).toBe(-5);
    expect(Math.max(...ys)).toBe(5);
  });
  it("draws nothing for zero", () => expect(dotCluster(0, 0, 0, 5)).toEqual([]));
});

describe("stackY", () => {
  it("centres n lines on y, lh apart", () => {
    expect([0, 1, 2].map((j) => stackY(100, j, 3))).toEqual([86, 100, 114]);
    expect([0, 1].map((j) => stackY(100, j, 2, 10))).toEqual([95, 105]);
  });
  it("puts a single line on y", () => expect(stackY(42, 0, 1)).toBe(42));
  it("rounds to 2 decimals", () => expect(stackY(10, 0, 2, 1 / 3)).toBe(9.83));
});

describe("lifespanBar", () => {
  it("is a rounded bar centred on y, from x0 to x1, with its name just past the right end", () => {
    expect(lifespanBar(30, 200, 78)).toEqual({ x: 30, y: 74, w: 170, h: 8, rx: 4, name: { x: 206, y: 82 } });
  });
  it("takes its height from h, and orders reversed ends", () => {
    expect(lifespanBar(100, 40, 50, { h: 6, gap: 10 })).toEqual({ x: 40, y: 47, w: 60, h: 6, rx: 3, name: { x: 110, y: 54 } });
  });
  it("throws on a bar with no length", () => {
    expect(() => lifespanBar(10, 10, 0)).toThrow(/no length/);
  });
});

describe("spanOverlap", () => {
  it("is the shared stretch of two spans, and its middle", () => {
    expect(spanOverlap([30, 200], [80, 240])).toEqual({ x0: 80, x1: 200, mid: 140 });
    expect(spanOverlap([80, 240], [30, 200])).toEqual({ x0: 80, x1: 200, mid: 140 });
  });
  it("is null when the spans only touch or don't meet", () => {
    expect(spanOverlap([0, 10], [10, 20])).toBeNull();
    expect(spanOverlap([0, 10], [15, 20])).toBeNull();
  });
  it("rounds away float noise", () => {
    expect(spanOverlap([0.1, 0.3], [0.2, 1])).toEqual({ x0: 0.2, x1: 0.3, mid: 0.25 });
  });
});

describe("letterDots", () => {
  it("places each dot at its offset from the letter's centre", () => {
    expect(letterDots(80, 128, [[0, 20]])).toEqual([{ cx: 80, cy: 148, r: 3.6 }]);
    expect(letterDots(10, 10, [[-6, -22], [6, -22]], 3)).toEqual([{ cx: 4, cy: -12, r: 3 }, { cx: 16, cy: -12, r: 3 }]);
  });
  it("has no dots for the bare outline", () => expect(letterDots(80, 128, [])).toEqual([]));
});

describe("vowelMark", () => {
  it("puts the fatḥa and ḍamma above the letter and the kasra below it", () => {
    const top = (d: string) => Math.min(...[...d.matchAll(/-?[\d.]+ (-?[\d.]+)/g)].map((m) => Number(m[1])));
    expect(top(vowelMark(80, 128, "fatha"))).toBeLessThan(128 - 14);
    expect(top(vowelMark(80, 128, "damma"))).toBeLessThan(128 - 14);
    expect(top(vowelMark(80, 128, "kasra"))).toBeGreaterThan(128 + 8);
  });
});
