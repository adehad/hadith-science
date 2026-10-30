import { test, expect, type Page } from "@playwright/test";

// SVG text in a state colour on its own tinted fill: every verdict pill state, the view tags and acted-on's "?",
// measured in the page in both themes, so a token or mix change can't drop one under 4.5:1 (WCAG 1.4.3)
const PAGES: [string, string[]][] = [
  ["/al-mardud/breaks/", ["hadith-scholars", "malikis", "shafii"]],
  ["/al-maqbul/acted-on/", []],
  ["/al-mardud/innovation/", ["ibn-hajar", "unless-lying", "reject"]],
  ["/al-mardud/hidden/", ["ibn-hajar", "contemporary"]],
  ["/al-mardud/wording/", []],
  ["/adad-al-turuq/sorting/", []],
];

// each shown text element and the fill of the shape it sits on, as contrast ratios keyed by what it is
const measure = (page: Page) => page.evaluate(() => {
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  const rgb = (c: string) => {
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3).map((x) => x / 255);
  };
  const lum = (c: number[]) => {
    const [r, g, b] = c.map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(rgb(a)), lum(rgb(b))].sort((x, y) => y - x);
    return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
  };
  const shown = (e: Element) => !e.closest(".off") && e.getBoundingClientRect().width > 0;
  const out: [string, number][] = [];
  for (const g of document.querySelectorAll("main svg .pill")) {
    if (!shown(g)) continue;
    const state = [...g.classList].find((c) => c !== "pill")!;
    out.push([`pill ${state}`, ratio(getComputedStyle(g.querySelector("text")!).fill, getComputedStyle(g.querySelector("rect")!).fill)]);
  }
  for (const t of document.querySelectorAll("main svg .vtag-t")) {
    const tag = t.previousElementSibling;
    if (!shown(t) || !tag?.classList.contains("vtag")) continue;
    out.push(["view tag", ratio(getComputedStyle(t).fill, getComputedStyle(tag).fill)]);
  }
  for (const t of document.querySelectorAll("main svg .unk")) {
    const card = [...t.closest("svg")!.querySelectorAll(".card.pause")].find((c) => {
      const [a, b] = [c.getBoundingClientRect(), t.getBoundingClientRect()];
      return b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom;
    });
    if (card) out.push(["unknown mark", ratio(getComputedStyle(t).fill, getComputedStyle(card).fill)]);
  }
  return out;
});

for (const theme of ["light", "dark"] as const) {
  test(`state-coloured SVG text reaches 4.5:1 on its tinted fill (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    const seen = new Map<string, number>();
    for (const [route, views] of PAGES) {
      await page.goto(route);
      for (const v of views.length ? views : [null]) {
        if (v) await page.locator(`.views button[data-v="${v}"]`).click();
        for (const [what, r] of await measure(page)) {
          expect.soft(r, `${what} on ${route}${v ? ` (${v})` : ""}`).toBeGreaterThanOrEqual(4.5);
          seen.set(what, Math.min(r, seen.get(what) ?? Infinity));
        }
      }
    }
    // every pill state was measured, and the tags
    expect([...seen.keys()].sort()).toEqual(["pill accept", "pill gold", "pill pause", "pill reject", "pill support", "unknown mark", "view tag"]);
  });
}

// SVG text on a gold-tinted fill, where --muted falls under 4.5:1 in dark mode: [what, route, views, text selector,
// the fills it may sit on]. A text is measured against the last of those fills (the topmost) that holds its centre,
// composited over the surface where the fill is translucent.
const ON_GOLD: [string, string, string[], string, string][] = [
  ["delivery step words", "/siyagh-al-ada/delivery/", ["ibn-hajar", "madinah", "bukhari"], ".stepg :is(.stepen,.title-ar,.tr)", ".stepg rect.step"],
  ["names answer tag", "/al-asma/names/", [], ".rowtag", ".win"],
  ["grades rung text", "/al-maqbul/grades/", ["ibn-hajar", "tirmidhi"], ".rg.on-gold", "rect.rung"],
  ["causes rung text", "/al-mardud/causes/", [], ".rung-g .lbl, .munkar-lbl", "rect.rung"],
  ["moon ﷺ", "/al-mardud/slips/", [], ".pbuh", ".moon"],
];

const measureOn = (page: Page, textSel: string, fillSel: string) => page.evaluate(([textSel, fillSel]) => {
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  const rgba = (c: string) => {
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    return [...cv.getImageData(0, 0, 1, 1).data].map((x) => x / 255);
  };
  const surface = rgba(getComputedStyle(document.documentElement).getPropertyValue("--surface"));
  const solid = (c: string) => { const [r, g, b, a] = rgba(c); return [r, g, b].map((x, i) => x * a + surface[i] * (1 - a)); };
  const lum = (c: number[]) => {
    const [r, g, b] = c.map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: number[], b: number[]) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
  };
  const fills = [...document.querySelectorAll(`main svg ${fillSel}`)];
  const out: number[] = [];
  for (const t of document.querySelectorAll(`main svg :is(${textSel})`)) {
    const b = t.getBoundingClientRect();
    if (t.closest(".off") || b.width === 0) continue;
    const [x, y] = [b.left + b.width / 2, b.top + b.height / 2];
    const under = fills.filter((f) => {
      const r = f.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }).pop();
    if (under) out.push(ratio(solid(getComputedStyle(t).fill), solid(getComputedStyle(under).fill)));
  }
  return out;
}, [textSel, fillSel]);

for (const theme of ["light", "dark"] as const) {
  test(`SVG text on a gold fill reaches 4.5:1 (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    for (const [what, route, views, textSel, fillSel] of ON_GOLD) {
      await page.goto(route);
      for (const v of views.length ? views : [null]) {
        if (v) await page.locator(`.views button[data-v="${v}"]`).click();
        const rs = await measureOn(page, textSel, fillSel);
        // each one was found on its fill
        expect(rs.length, `${what} on ${route}${v ? ` (${v})` : ""} measured`).toBeGreaterThan(0);
        for (const r of rs) expect.soft(r, `${what} on ${route}${v ? ` (${v})` : ""}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
}
