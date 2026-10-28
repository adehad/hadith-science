import { describe, expect, it } from "vitest";
import { FLOOR, RISE, STAIR_VIEWS, STEP_W, TOP0, stepBox, stepFill } from "../../src/lib/staircase";

const { "ibn-hajar": ibnHajar, madinah, bukhari } = STAIR_VIEWS;

describe("stepBox", () => {
  it("places Ibn Ḥajar's first and last steps", () => {
    expect(stepBox(ibnHajar, 0)).toEqual({ x: 10, top: TOP0, h: FLOOR - TOP0 });
    expect(stepBox(ibnHajar, 7)).toEqual({ x: 10 + 7 * STEP_W, top: TOP0 + 7 * RISE, h: FLOOR - TOP0 - 7 * RISE });
  });
  it("places Madīna's first and last steps", () => {
    expect(stepBox(madinah, 0)).toEqual({ x: 10 + STEP_W, top: TOP0 + RISE, h: FLOOR - TOP0 - RISE });
    expect(stepBox(madinah, 7)).toEqual(stepBox(ibnHajar, 7));
  });
  it("places al-Bukhārī's first and last steps", () => {
    expect(stepBox(bukhari, 0)).toEqual(stepBox(ibnHajar, 0));
    expect(stepBox(bukhari, 7)).toEqual(stepBox(ibnHajar, 7));
  });
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
  it("fades the gold with each level down", () => {
    expect(stepFill(0)).toBe("color-mix(in srgb,var(--gold-b) 30%,var(--surface))");
    expect(stepFill(2)).toBe("color-mix(in srgb,var(--gold-b) 23%,var(--surface))");
    expect(stepFill(7)).toBe("color-mix(in srgb,var(--gold-b) 5.5%,var(--surface))");
  });
});
