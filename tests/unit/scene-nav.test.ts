import { describe, expect, it } from "vitest";
import { neighbours, scenesByMoon } from "../../src/lib/scene";

// as loadContent returns them: sorted by division, then order
const scenes = [
  { id: "a1", division: "a", moons: [0] },
  { id: "a2", division: "a", moons: [0, 2] },
  { id: "a3", division: "a", moons: [2] },
  { id: "b1", division: "b", moons: [0] },
];

describe("neighbours", () => {
  it("gives the scenes either side within the division", () => {
    expect(neighbours(scenes, scenes[1])).toEqual({ prev: scenes[0], next: scenes[2] });
  });

  it("has no prev for the first scene and no next for the last, never crossing into another division", () => {
    expect(neighbours(scenes, scenes[0]).prev).toBeUndefined();
    expect(neighbours(scenes, scenes[2]).next).toBeUndefined();
    expect(neighbours(scenes, scenes[3]).prev).toBeUndefined();
  });

  it("throws for a scene that is not in the list (e.g. a copy)", () => {
    expect(() => neighbours(scenes, { ...scenes[0] })).toThrow("a/a1");
  });
});

describe("scenesByMoon", () => {
  it("lists a division's scenes under each moon they cover, in order, and an empty list for a moon with none", () => {
    expect(scenesByMoon({ id: "a", moons: ["m0", "m1", "m2"] }, scenes).map((l) => l.map((s) => s.id)))
      .toEqual([["a1", "a2"], [], ["a2", "a3"]]);
  });

  it("leaves out other divisions' scenes on the same moon", () => {
    expect(scenesByMoon({ id: "b", moons: ["m0"] }, scenes)).toEqual([[scenes[3]]]);
  });
});
