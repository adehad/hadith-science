import { test, expect } from "@playwright/test";

test("theme toggle sets data-theme and survives reload", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const toggle = page.locator("#theme-toggle");
  await expect(html).not.toHaveAttribute("data-theme");
  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toContainText("dark");
  await toggle.click();
  await expect(html).not.toHaveAttribute("data-theme");
  await page.reload();
  await expect(html).not.toHaveAttribute("data-theme");
});

test("blocked storage: pages still render and toggles still work", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }));
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of ["/", "/narrators/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
  }
  await page.locator("#theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});
