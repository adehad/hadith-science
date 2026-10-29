import { describe, expect, it } from "vitest";
import { readView, viewAttrs, writeView } from "../../src/lib/views";

const ids = ["ibn-hajar", "madinah", "bukhari"];
const page = "https://example.org/siyagh-al-ada/delivery/";

describe("readView", () => {
  it("defaults to the first id when ?view= is missing", () => expect(readView("", ids)).toBe("ibn-hajar"));
  it("defaults when the value is unknown", () => expect(readView("?view=nope", ids)).toBe("ibn-hajar"));
  it("defaults when the value is empty", () => expect(readView("?view=", ids)).toBe("ibn-hajar"));
  it("reads a valid value", () => expect(readView("?view=madinah", ids)).toBe("madinah"));
  it("reads it among other params", () => expect(readView("?x=1&view=bukhari", ids)).toBe("bukhari"));
});

describe("writeView", () => {
  it("adds the param", () => expect(writeView(page, "madinah", ids)).toBe(`${page}?view=madinah`));
  it("replaces an existing value", () =>
    expect(writeView(`${page}?view=madinah`, "bukhari", ids)).toBe(`${page}?view=bukhari`));
  it("removes the param when writing the default", () =>
    expect(writeView(`${page}?view=madinah`, "ibn-hajar", ids)).toBe(page));
  it("keeps other params and the hash", () => {
    expect(writeView(`${page}?x=1#samitu`, "madinah", ids)).toBe(`${page}?x=1&view=madinah#samitu`);
    expect(writeView(`${page}?x=1&view=madinah#samitu`, "ibn-hajar", ids)).toBe(`${page}?x=1#samitu`);
  });
  it("removes the param for an unknown id", () =>
    expect(writeView(`${page}?view=madinah`, "nope", ids)).toBe(page));
});

describe("viewAttrs", () => {
  // an element without a value for a view keeps the last view's when the reader switches to it
  it("throws when a view has no value", () =>
    expect(() => viewAttrs({ v: { "ibn-hajar": "none", madinah: "none" } }, ids)).toThrow(/bukhari/));
  it("throws when a value names no view", () =>
    expect(() => viewAttrs({ h: { "ibn-hajar": "1px", madinah: "1px", bukhari: "1px", nope: "1px" } }, ids)).toThrow(/nope/));
});
