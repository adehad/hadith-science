// S3: every internal link in the build reaches a built file, and its #hash an id or a term trigger on that page
import { describe, expect, it } from "vitest";
import { BASE, page, pagePaths, resolve } from "./site";

describe("built links", () => {
  it("every internal href and hash resolves", () => {
    const bad: string[] = [];
    let links = 0, hashes = 0;
    for (const from of pagePaths) {
      for (const a of page(from)!.querySelectorAll("a[href], area[href], link[href]")) {
        const raw = a.getAttribute("href")!;
        const to = resolve(raw, from);
        if (!to) continue;
        links++;
        const where = `/${from}: ${raw}`;
        if (to.path.startsWith("/")) { bad.push(`${where}: outside ${BASE}`); continue; }
        const doc = page(to.path);
        if (!doc) { bad.push(`${where}: no file`); continue; }
        if (!to.hash) continue;
        hashes++;
        const target = doc.getElementById(to.hash)
          ?? [...doc.querySelectorAll("[data-term]")].find((el) => el.getAttribute("data-term") === to.hash);
        if (!target) bad.push(`${where}: no #${to.hash} on /${to.path}`);
      }
    }
    expect(links).toBeGreaterThan(0);
    expect(hashes).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });
});
