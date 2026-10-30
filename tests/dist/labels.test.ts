// S4: label in name (WCAG 2.5.3). A link or term trigger with an aria-label must start with the text it shows,
// so a speech user can say what they see. aria-hidden parts (the (i), a "→") are not visible label text.
import { describe, expect, it } from "vitest";
import { page, pagePaths, visibleText } from "./site";

// compared on letters and digits only: SVG lines split into tspans carry no spaces, and punctuation and symbols
// (a colon, an arrow) are not part of what a speech user says
const squash = (s: string) => s.normalize("NFC").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();

describe("built labels", () => {
  it("every aria-label on a link or trigger starts with its visible text", () => {
    const bad: string[] = [];
    let links = 0, triggers = 0;
    for (const from of pagePaths) {
      for (const el of page(from)!.querySelectorAll("a[aria-label], [data-term-json][aria-label]")) {
        if (el.hasAttribute("data-term-json")) triggers++; else links++;
        const label = el.getAttribute("aria-label")!, shown = visibleText(el);
        if (!squash(label).startsWith(squash(shown))) bad.push(`/${from}: "${label}" does not start with "${shown}"`);
      }
    }
    expect(links).toBeGreaterThan(0);
    expect(triggers).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });
});
