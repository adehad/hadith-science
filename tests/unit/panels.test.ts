import { describe, expect, it } from "vitest";
import { stops, trackWidthPct } from "../../src/lib/panels";

const equal = [{ x0: 0, x1: 100 }, { x0: 100, x1: 200 }, { x0: 200, x1: 300 }, { x0: 300, x1: 400 }];
// the routes scene's x-ranges
const uneven = [{ x0: 0, x1: 255 }, { x0: 255, x1: 425 }, { x0: 425, x1: 605 }, { x0: 605, x1: 820 }];

describe("trackWidthPct", () => {
  it("is n × 100% for equal panels", () => expect(trackWidthPct(400, equal)).toBeCloseTo(400));
  it("fits the widest panel to the viewport for uneven panels", () =>
    expect(trackWidthPct(820, uneven)).toBeCloseTo((820 / 255) * 100));
});

describe("stops", () => {
  it("gives equal panels equal slices", () =>
    expect(stops(400, equal)).toEqual([{ left: 0, w: 25 }, { left: 25, w: 25 }, { left: 50, w: 25 }, { left: 75, w: 25 }]));
  it("makes the widest panel exactly one viewport wide", () => {
    const s = stops(820, uneven), t = trackWidthPct(820, uneven);
    expect((s[0].w * t) / 100).toBeCloseTo(100);
    for (const p of s) expect((p.w * t) / 100).toBeLessThanOrEqual(100 + 1e-9);
  });
  it("sums to 100% of the track", () => {
    for (const [w, p] of [[400, equal], [820, uneven]] as const)
      expect(stops(w, p).reduce((a, s) => a + s.w, 0)).toBeCloseTo(100);
  });
  it("places each stop at its x0", () => expect(stops(820, uneven)[2].left).toBeCloseTo((425 / 820) * 100));
});
