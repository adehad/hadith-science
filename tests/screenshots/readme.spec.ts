import { test } from "@playwright/test";

// README screenshots (docs/screenshots/), regenerated with `bun run screenshots` after a build
// whole page on desktop for the drawings, so the map and figure key are not cut off; the glossary is too long
const shots = [
  { name: "map", path: "/", full: true },
  { name: "narrators", path: "/narrators/", full: true },
  { name: "terms", path: "/terms/", full: false },
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
    await page.screenshot({ path: `docs/screenshots/${s.name}-${z.tag}-${theme}.png`, fullPage: s.full && z.tag === "desktop" });
  });
}
