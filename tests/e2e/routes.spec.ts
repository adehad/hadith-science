import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, readdirSync } from "node:fs";

// routes come from the built sitemap (in the snapshot of dist this run serves, playwright.config.ts), so new pages are
// covered automatically; /t/ pages are redirects
const dist = process.env.E2E_DIST ?? "dist";
const sitemaps = readdirSync(dist).filter((f) => f.startsWith("sitemap-") && f !== "sitemap-index.xml");
const routes = sitemaps
  .flatMap((f) => [...readFileSync(`${dist}/${f}`, "utf8").matchAll(/<loc>[^<]*?\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]))
  .filter((r) => !r.startsWith("/t/") && r.endsWith("/"));

test("sitemap lists the map, divisions, scenes, narrators and glossary", () => {
  expect(routes).toEqual(expect.arrayContaining(["/", "/narrators/", "/terms/", "/al-mardud/breaks/"]));
  // map, 8 divisions, narrators and glossary, plus the 5 phase 2 scenes
  expect(routes.length).toBeGreaterThanOrEqual(16);
});

for (const theme of ["light", "dark"] as const) {
  for (const route of [...routes, "/404.html"]) {
    test(`${route} renders cleanly (${theme})`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      expect(errors).toEqual([]);
      const axe = await new AxeBuilder({ page }).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
}
