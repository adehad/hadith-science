import { describe, expect, it } from "vitest";
import { FLOOR, STAIR_VIEWS, stepBox, stepFill } from "../../src/lib/staircase";

const { "ibn-hajar": ibnHajar, madinah, bukhari } = STAIR_VIEWS;

describe("stepBox", () => {
  it("keeps every step's foot on the floor", () => {
    for (const v of Object.values(STAIR_VIEWS)) for (let i = 0; i < 8; i++) {
      const b = stepBox(v, i);
      expect(b.top + b.h).toBe(FLOOR);
    }
  });
});

describe("views", () => {
  it("Madīna swaps the columns and heights of steps 1 and 2", () => {
    expect(stepBox(madinah, 0).x).toBe(stepBox(ibnHajar, 1).x);
    expect(stepBox(madinah, 1).x).toBe(stepBox(ibnHajar, 0).x);
    expect(stepBox(madinah, 1).top).toBeLessThan(stepBox(madinah, 0).top);
  });
  it("al-Bukhārī puts steps 1 and 2 at the same height, in Ibn Ḥajar's columns", () => {
    expect(stepBox(bukhari, 0).top).toBe(stepBox(bukhari, 1).top);
    expect(stepBox(bukhari, 1).x).toBe(stepBox(ibnHajar, 1).x);
  });
  it("leaves steps 3 to 8 where Ibn Ḥajar has them in every view", () => {
    for (const v of [madinah, bukhari]) for (let i = 2; i < 8; i++) expect(stepBox(v, i)).toEqual(stepBox(ibnHajar, i));
  });
});

describe("stepFill", () => {
  it("fades the gold with each level down: its share of the mix falls at every step", () => {
    const pct = (i: number) => Number(stepFill(i).match(/([\d.]+)%/)![1]);
    for (let i = 1; i < 8; i++) expect(pct(i)).toBeLessThan(pct(i - 1));
  });
});
