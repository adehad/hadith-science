import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, readdirSync } from "node:fs";

// routes come from the built sitemap, so new pages are covered automatically; /t/ pages are redirects
const sitemaps = readdirSync("dist").filter((f) => f.startsWith("sitemap-") && f !== "sitemap-index.xml");
const routes = sitemaps
  .flatMap((f) => [...readFileSync(`dist/${f}`, "utf8").matchAll(/<loc>[^<]*?\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]))
  .filter((r) => !r.startsWith("/t/") && r.endsWith("/"));

test("sitemap lists the map, divisions, narrators and glossary", () => {
  expect(routes).toEqual(expect.arrayContaining(["/", "/narrators/", "/terms/"]));
  expect(routes.length).toBeGreaterThanOrEqual(11);
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
