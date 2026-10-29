import { describe, expect, it } from "vitest";
import { rowTrigger, titleTrigger } from "../../src/components/svg/geom";

describe("titleTrigger", () => {
  it("can start the hit area further left, to take in something before the title, keeping its end and the (i)", () => {
    const t = titleTrigger("Iʿtibār", 598, 37, { x0: 536 });
    const plain = titleTrigger("Iʿtibār", 598, 37);
    expect(t.hit.x).toBe(536);
    expect(t.hit.x + t.hit.w).toBeCloseTo(plain.hit.x + plain.hit.w);
    expect(t.info).toEqual(plain.info);
  });
});

describe("rowTrigger", () => {
  it("puts the (i) after the text and the hit area from just before the text to just past the (i)", () => {
    const t = rowTrigger("ʿadl", 100, 66);
    expect(t.info).toEqual({ cx: 138.8, cy: 62, r: 7 });
    expect(t.hit).toEqual({ x: 94, y: 53, w: 54.8, h: 18 });
  });
  it("can run the hit area from x0 to x1", () => expect(rowTrigger("ʿadl", 100, 66, { x0: 80, x1: 420 }).hit).toMatchObject({ x: 80, w: 340 }));
});
