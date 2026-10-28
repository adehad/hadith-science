import { test, expect, type Page } from "@playwright/test";

const angles = (page: Page) => page.locator(".planet").evaluateAll((els) => els.map((e) => e.getAttribute("data-angle")));

test("reduced motion: nothing animates", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length)).toBe(0);
  // SMIL (the Companion's shimmer) is paused by prefs.ts
  expect(await page.evaluate(() => [...document.querySelectorAll("svg")].every((s) => s.animationsPaused()))).toBe(true);
  const stars = () => page.locator("canvas").first().evaluate((c: HTMLCanvasElement) => c.toDataURL());
  const [a1, s1] = [await angles(page), await stars()];
  await page.waitForTimeout(1000);
  expect(await angles(page)).toEqual(a1);
  expect(await stars()).toBe(s1);
});

test("planets move with motion allowed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const a1 = await page.locator(".planet").first().getAttribute("data-angle");
  await expect.poll(() => page.locator(".planet").first().getAttribute("data-angle")).not.toBe(a1);
});

test.describe("map layout", () => {
  test("portrait phone: nested list instead of the orbit map, which stays still", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const tree = page.locator(".tree");
    await expect(tree).toBeVisible();
    await expect(tree.locator("a.div")).toHaveCount(8);
    await expect(page.locator(".stage")).toBeHidden();
    const a1 = await angles(page);
    await page.waitForTimeout(800);
    expect(await angles(page)).toEqual(a1);
  });

  test("landscape phone: orbit map, no list", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/");
    await expect(page.locator(".stage svg.map")).toBeVisible();
    await expect(page.locator(".tree")).toBeHidden();
  });
});
