import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// how a scene lays out: the portrait carousel (carousel.ts), the cell grid (base.css .cells) and the Key/Labels mode
// (prefs.ts)
const DESKTOP = { width: 1280, height: 800 };
const PORTRAIT = { width: 390, height: 844 };
const LANDSCAPE = { width: 844, height: 390 };

test.use({ contextOptions: { reducedMotion: "reduce" } });

// routes.spec.ts scans every page in its first state; these scans cover states it doesn't reach
async function expectNoAxeViolations(page: Page) {
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

test.describe("carousel", () => {
  test("portrait: the diagram scrolls by panel and the dots follow", async ({ page }) => {
    await page.setViewportSize(PORTRAIT);
    await page.goto("/adad-al-turuq/routes/");
    const scroller = page.locator(".carousel .scroller");
    const dots = page.locator(".cnav .cdot");
    const [sw, cw] = await scroller.evaluate((s) => [s.scrollWidth, s.clientWidth]);
    expect(sw).toBeGreaterThan(cw);
    await expect(page.locator(".cnav")).toBeVisible();
    await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");
    const left = await scroller.evaluate((s) => s.scrollLeft);
    await page.locator(".cnext").click();
    await expect.poll(() => scroller.evaluate((s) => s.scrollLeft)).toBeGreaterThan(left);
    await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
    await expect(dots.nth(0)).not.toHaveAttribute("aria-current");
    await expectNoAxeViolations(page);
  });

  test("landscape: the whole diagram, no nav", async ({ page }) => {
    await page.setViewportSize(LANDSCAPE);
    await page.goto("/adad-al-turuq/routes/");
    const [sw, cw] = await page.locator(".carousel .scroller").evaluate((s) => [s.scrollWidth, s.clientWidth]);
    expect(sw).toBeLessThanOrEqual(cw + 1);
    await expect(page.locator(".cnav")).toBeHidden();
  });
});

test("the cell grid stacks its cells in one column in portrait and sets two on a desktop", async ({ page }) => {
  const lefts = () => page.locator(".cells > svg").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
  await page.setViewportSize(PORTRAIT);
  await page.goto("/al-asma/names/");
  const l = await lefts();
  expect(l.length).toBeGreaterThan(1);
  expect(new Set(l).size).toBe(1);
  await page.setViewportSize(DESKTOP);
  await expect.poll(async () => new Set(await lefts()).size).toBe(2);
});

test("Key and Labels modes swap the legend for labels, and the choice survives a reload", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/al-mardud/breaks/");
  const legend = page.locator(".legend"), label = page.locator(".mode-label").first();
  expect(await page.locator(".mode-label").count()).toBeGreaterThan(0);
  await expect(legend).toBeVisible();
  await expect(label).toBeHidden();
  await page.locator('.viewtoggle button[data-mode="labels"]').click();
  await expect(legend).toBeHidden();
  await expect(label).toBeVisible();
  await page.reload();
  await expect(page.locator('.viewtoggle button[data-mode="labels"]')).toHaveAttribute("aria-pressed", "true");
  await expect(legend).toBeHidden();
  await expect(label).toBeVisible();
  await expectNoAxeViolations(page);
});
