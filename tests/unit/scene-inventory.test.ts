import { describe, expect, it } from "vitest";
import { sceneErrors, type InvScene } from "../../src/lib/inventory";
import { cap, captionsFor } from "../../src/lib/scene";

const divisions = [{ id: "d", moons: ["m0", "m1"] }, { id: "e", moons: ["m0"] }];
const scene = (o: Partial<InvScene> = {}): InvScene => ({
  id: "s",
  division: "d",
  moons: [0, 1],
  captions: [{ term: "a" }],
  width: 100,
  ...o,
});
const term = (o: object = {}) => ({ id: "a", division: "d", scene: "s", ...o });

describe("sceneErrors", () => {
  it("valid scene", () =>
    expect(
      sceneErrors(
        [scene({ views: [{ id: "v" }, { id: "w" }], panels: [{ x0: 40, x1: 100 }, { x0: 0, x1: 40 }] })],
        [term({ view: "w" }), { id: "b", division: "d" }],
        divisions,
      ),
    ).toEqual([]));
  it("valid scene with fractional panels", () =>
    expect(
      sceneErrors([scene({ panels: [{ x0: 33.5, x1: 100 }, { x0: 0, x1: 33.5 }] })], [term()], divisions),
    ).toEqual([]));
  it("unknown division", () =>
    expect(sceneErrors([scene({ division: "zz" })], [], divisions)).toContain("scene s: unknown division zz"));
  it("moon out of range", () => {
    const errs = sceneErrors([scene({ moons: [0, 2, 5] })], [term()], divisions);
    expect(errs).toContain("scene s: moon 2 out of range");
    expect(errs).toContain("scene s: moon 5 out of range");
    expect(errs).not.toContain("scene s: moon 0 out of range");
  });
  it("duplicate id across divisions", () =>
    expect(
      sceneErrors([scene(), scene({ division: "e", moons: [0], captions: [{ term: "b" }] })], [term(), term({ id: "b", division: "e" })], divisions),
    ).toContain("scene s: duplicate id"));
  it("caption term not in inventory", () =>
    expect(sceneErrors([scene({ captions: [{ term: "a" }, { term: "zz" }] })], [term()], divisions)).toContain(
      "scene s: caption term zz not in inventory",
    ));
  it("caption term pointing elsewhere", () =>
    expect(
      sceneErrors([scene({ captions: [{ term: "a" }, { term: "b" }] })], [term(), term({ id: "b", scene: "other" })], divisions),
    ).toContain("scene s: caption term b has scene other"));
  it("caption term from another division", () =>
    expect(
      sceneErrors([scene({ captions: [{ term: "a" }, { term: "b" }] })], [term(), term({ id: "b", division: "e" })], divisions),
    ).toContain("scene s: caption term b has scene e/s"));
  it("caption term with no scene", () =>
    expect(sceneErrors([scene()], [{ id: "a", division: "d" }], divisions)).toContain("scene s: caption term a has scene none"));
  it("term scene does not caption it", () =>
    expect(sceneErrors([scene()], [term(), term({ id: "b" })], divisions)).toContain("term b: scene s does not caption it"));
  it("term view not in scene", () =>
    expect(sceneErrors([scene({ views: [{ id: "v" }] })], [term({ view: "zz" })], divisions)).toContain(
      "term a: view zz not in scene s",
    ));
  it("duplicate view id", () =>
    expect(sceneErrors([scene({ views: [{ id: "v" }, { id: "v" }] })], [term()], divisions)).toContain(
      "scene s: duplicate view id v",
    ));
  it.each([
    ["gap", [{ x0: 0, x1: 40 }, { x0: 50, x1: 100 }]],
    ["late start", [{ x0: 10, x1: 100 }]],
    ["short end", [{ x0: 0, x1: 40 }, { x0: 40, x1: 90 }]],
    ["overlap", [{ x0: 0, x1: 60 }, { x0: 40, x1: 100 }]],
    ["zero width", [{ x0: 0, x1: 0 }, { x0: 0, x1: 100 }]],
    ["empty", []],
  ])("panels must tile (%s)", (_, panels) =>
    expect(sceneErrors([scene({ panels })], [term()], divisions)).toContain("scene s: panels must tile 0..width"));
});

const terms = [{ id: "a", translit: "Āy", ar: "أ", en: "A", section: "§5.1" }];

describe("captionsFor / cap", () => {
  const caps = captionsFor({ id: "s", captions: [{ term: "a", note: "Longer note." }] }, terms);
  it("builds popover payload from the scene note", () => {
    expect(cap(caps, "a")).toMatchObject({ slug: "a", translit: "Āy", ar: "أ", en: "A", section: "§5.1", note: "Longer note." });
    expect(JSON.parse(cap(caps, "a").json)).toEqual({ translit: "Āy", ar: "أ", def: "Longer note.", section: "§5.1" });
  });
  it("captionsFor throws on an unknown term", () =>
    expect(() => captionsFor({ id: "s", captions: [{ term: "zz", note: "" }] }, terms)).toThrow(
      "scene s: caption term zz not in inventory",
    ));
  it("cap throws on a missing caption", () => expect(() => cap(caps, "zz")).toThrow("scene caption zz missing"));
});
