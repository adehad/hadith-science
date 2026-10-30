import { describe, expect, it } from "vitest";
import { panelTrigger, rowTrigger, titleTrigger } from "../../src/components/svg/geom";

const PANELS = [{ x0: 0, x1: 260 }, { x0: 260, x1: 520 }, { x0: 520, x1: 780 }];

describe("panelTrigger", () => {
  it("gives the same (i) and hit area as titleTrigger when the trigger fits its panel", () =>
    expect(panelTrigger("Maḥfūẓ", 390, 506, PANELS)).toEqual(titleTrigger("Maḥfūẓ", 390, 506)));
  it("throws when the hit area runs past its panel's right edge", () =>
    expect(() => panelTrigger("Ziyādat al-thiqa", 230, 506, PANELS)).toThrow(/leaves its panel/));
  it("throws when the hit area starts before its panel's left edge", () =>
    expect(() => panelTrigger("Ziyādat al-thiqa", 300, 506, PANELS)).toThrow(/leaves its panel/));
  it("throws when the centre is in no panel", () => expect(() => panelTrigger("Munkar", 800, 506, PANELS)).toThrow(/leaves its panel/));
  it("names the trigger in the error", () =>
    expect(() => panelTrigger("Ziyādat al-thiqa", 230, 506, PANELS, { name: "Opposition: ziyadat-al-thiqa" })).toThrow(
      "Opposition: ziyadat-al-thiqa trigger leaves its panel",
    ));
  it("can start the hit area further left, to take in something before the title", () => {
    const t = panelTrigger("Iʿtibār", 598, 37, PANELS, { x0: 536 });
    const plain = titleTrigger("Iʿtibār", 598, 37);
    expect(t.hit.x).toBe(536);
    expect(t.hit.x + t.hit.w).toBeCloseTo(plain.hit.x + plain.hit.w);
    expect(t.info).toEqual(plain.info);
  });
  it("checks the widened hit area against the panel", () =>
    expect(() => panelTrigger("Iʿtibār", 598, 37, PANELS, { x0: 500 })).toThrow(/leaves its panel/));
});

describe("rowTrigger", () => {
  it("puts the (i) after the text and the hit area from just before the text to just past the (i)", () => {
    const t = rowTrigger("ʿadl", 100, 66);
    expect(t.info).toEqual({ cx: 138.8, cy: 62, r: 7 });
    expect(t.hit).toEqual({ x: 94, y: 53, w: 54.8, h: 18 });
  });
  it("can run the hit area from x0 to x1", () => expect(rowTrigger("ʿadl", 100, 66, { x0: 80, x1: 420 }).hit).toMatchObject({ x: 80, w: 340 }));
});
