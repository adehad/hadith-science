import { describe, expect, it } from "vitest";
import { CHIP_CHAR_W, CHIP_PAD, chipRow, chipWidth, gaugeCells } from "../../src/lib/kit";

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
