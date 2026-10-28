import { test } from "@playwright/test";

// README screenshots (docs/screenshots/), regenerated with `bun run screenshots` after a build
// whole page on desktop for the drawings, so the map and figure key are not cut off; the glossary is too long.
// On mobile a scene is shot scrolled to its diagram, so the first carousel panel and its dots are in the picture
// (a whole-page shot would leave the sticky dots where the first screen ended, over the drawing).
const shots: { name: string; path: string; full: boolean; diagram?: boolean }[] = [
  { name: "map", path: "/", full: true },
  { name: "narrators", path: "/narrators/", full: true },
  { name: "terms", path: "/terms/", full: false },
  { name: "routes", path: "/adad-al-turuq/routes/", full: true, diagram: true },
  { name: "breaks", path: "/al-mardud/breaks/", full: true, diagram: true },
  { name: "unknown", path: "/al-mardud/unknown/", full: true, diagram: true },
  { name: "delivery", path: "/siyagh-al-ada/delivery/", full: true, diagram: true },
  { name: "names", path: "/al-asma/names/", full: true, diagram: true },
];
const sizes = [
  { tag: "desktop", viewport: { width: 1280, height: 800 } },
  { tag: "mobile", viewport: { width: 390, height: 844 } },
];

for (const s of shots) for (const z of sizes) for (const theme of ["light", "dark"] as const) {
  test(`${s.name} ${z.tag} ${theme}`, async ({ page }) => {
    await page.setViewportSize(z.viewport);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto(s.path);
    await page.evaluate(() => document.fonts.ready);
    if (s.diagram && z.tag === "mobile") {
      await page.locator(".stage").evaluate((e) => scrollTo({ top: e.getBoundingClientRect().top + scrollY - 16, behavior: "instant" }));
    }
    await page.screenshot({ path: `docs/screenshots/${s.name}-${z.tag}-${theme}.png`, fullPage: s.full && z.tag === "desktop" });
  });
}
