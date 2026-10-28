import { describe, expect, it } from "vitest";
import { inventoryErrors } from "../../src/lib/inventory";

const term = (o: object) => ({ id: "x", division: "d", ...o });

describe("inventoryErrors", () => {
  it("clean inventory", () => expect(inventoryErrors([term({})], [], ["d"])).toEqual([]));
  it("reserved slug", () => expect(inventoryErrors([term({ id: "view" })], [], ["d"])).toContain("term view: slug is a reserved word"));
  it("duplicate slug", () => expect(inventoryErrors([term({}), term({})], [], ["d"])).toContain("term x: duplicate slug"));
  it("unknown scene", () => expect(inventoryErrors([term({ scene: "s" })], [], ["d"])).toContain("term x: unknown scene d/s"));
  it("view without scene", () => expect(inventoryErrors([term({ view: "v" })], [], ["d"])).toContain("term x: view set but no scene"));
  it("unknown division", () => expect(inventoryErrors([term({ division: "zz" })], [], ["d"])).toContain("term x: unknown division zz"));
});
