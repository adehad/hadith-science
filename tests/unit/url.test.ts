import { describe, expect, it } from "vitest";
import { normaliseBase, href, absolute } from "../../src/lib/url";

describe("normaliseBase", () => {
  it.each([
    ["/", "/"], ["", "/"], ["hadith-science", "/hadith-science/"],
    ["/hadith-science", "/hadith-science/"], ["/hadith-science/", "/hadith-science/"],
    ["//hadith-science//", "/hadith-science/"],
  ])("%s → %s", (input, out) => expect(normaliseBase(input)).toBe(out));
});

describe("href", () => {
  it("joins base and path with one slash", () => {
    expect(href("terms/", "/hadith-science/")).toBe("/hadith-science/terms/");
    expect(href("/terms/", "/")).toBe("/terms/");
  });
  it("keeps query and hash", () => {
    expect(href("terms/?q=x#y", "/b/")).toBe("/b/terms/?q=x#y");
  });
  it("root is base", () => expect(href("", "/b/")).toBe("/b/"));
});

describe("absolute", () => {
  it("prefixes site", () =>
    expect(absolute("t/mursal/", "https://adehad.github.io", "/hadith-science/"))
      .toBe("https://adehad.github.io/hadith-science/t/mursal/"));
  it("tolerates trailing slash on site", () =>
    expect(absolute("", "https://x.dev/", "/")).toBe("https://x.dev/"));
});
