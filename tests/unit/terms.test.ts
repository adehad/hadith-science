import { describe, expect, it } from "vitest";
import { targetPath, parseSlugQuery, resolveQuery } from "../../src/lib/terms";

const built = { slug: "mursal", division: "al-mardud", scene: "breaks" };
const viewOnly = { slug: "mursal-wide", division: "al-mardud", scene: "breaks", view: "wider" };
const pending = { slug: "mutawatir", division: "adad-al-turuq" };

describe("targetPath", () => {
  it("built term → scene with hash", () => expect(targetPath(built)).toBe("al-mardud/breaks/#mursal"));
  it("view-only term carries view", () =>
    expect(targetPath(viewOnly)).toBe("al-mardud/breaks/?view=wider#mursal-wide"));
  it("pending term → glossary entry", () => expect(targetPath(pending)).toBe("terms/#mutawatir"));
});

describe("parseSlugQuery", () => {
  it("?t=slug", () => expect(parseSlugQuery("?t=mursal")).toEqual({ kind: "t", slug: "mursal" }));
  it("bare ?slug", () => expect(parseSlugQuery("?mursal")).toEqual({ kind: "bare", slug: "mursal" }));
  it.each(["", "?", "?mursal=", "?mursal=1", "?a&b", "?view", "?q", "?t", "?t=", "?view=madinah"])(
    "ignores %s", (q) => expect(parseSlugQuery(q)).toBeNull());
  it("lowercases", () => expect(parseSlugQuery("?Mursal")).toEqual({ kind: "bare", slug: "mursal" }));
});

describe("resolveQuery", () => {
  const index = { mursal: "al-mardud/breaks/#mursal" };
  it("known bare", () => expect(resolveQuery("?mursal", index)).toBe("al-mardud/breaks/#mursal"));
  it("known t", () => expect(resolveQuery("?t=mursal", index)).toBe("al-mardud/breaks/#mursal"));
  it("unknown t → glossary search", () => expect(resolveQuery("?t=xyz", index)).toBe("terms/?q=xyz"));
  it("unknown bare → stay", () => expect(resolveQuery("?utm_x", index)).toBeNull());
});
