import { describe, expect, it } from "vitest";
import { CHIP_CHAR_W, CHIP_PAD, chipRow, chipWidth, diamondPath, discRow, gaugeCells, scaleEnds, sweepAt } from "../../src/lib/kit";

describe("chipWidth", () => {
  it("grows with the text, plus padding", () => {
    expect(chipWidth("Jābir")).toBe(5 * CHIP_CHAR_W + CHIP_PAD);
    expect(chipWidth("")).toBe(CHIP_PAD);
  });
  it("rounds away float noise", () => {
    expect(chipWidth("abc", 1.1, 0.2)).toBe(3.5);
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
