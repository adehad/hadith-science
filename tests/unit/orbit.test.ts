import { describe, expect, it } from "vitest";
import { planetAt, planetRadius, startAngle } from "../../src/lib/orbit";

describe("orbit geometry", () => {
  it("planet position on ellipse", () => {
    const [x, y] = planetAt(0, 0, [410, 270]);
    expect(x).toBeCloseTo(506); expect(y).toBeCloseTo(270);
  });
  it("planet radius scales with moons, capped", () => {
    expect(planetRadius(2)).toBeCloseTo(9.2);
    expect(planetRadius(100)).toBe(20);
  });
});

it("start angles keep adjacent rings well apart", () => {
  for (let i = 0; i < 7; i++) {
    const d = Math.abs(startAngle(i + 1) - startAngle(i)) % (2 * Math.PI);
    expect(Math.min(d, 2 * Math.PI - d)).toBeGreaterThan(1.5);
  }
});
