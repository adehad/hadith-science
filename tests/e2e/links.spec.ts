import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const terms = parse(readFileSync("src/content/terms.yaml", "utf8")) as { id: string; scene?: string }[];
const pending = terms.filter((t) => !t.scene);

for (const t of pending) {
  test(`pending term ${t.id} lands on its glossary entry`, async ({ page }) => {
    await page.goto(`/t/${t.id}/`);
    await expect(page).toHaveURL(new RegExp(`/terms/#${t.id}$`));
    await expect(page.locator(`#${t.id}`)).toBeInViewport();
  });
}

test("bare ?slug resolves", async ({ page }) => {
  await page.goto(`/?${pending[0].id}`);
  await expect(page).toHaveURL(new RegExp(`/terms/#${pending[0].id}$`));
});

test("?t=slug resolves", async ({ page }) => {
  await page.goto(`/narrators/?t=${pending[1].id}`);
  await expect(page).toHaveURL(new RegExp(`/terms/#${pending[1].id}$`));
});

test("?t=unknown opens glossary search", async ({ page }) => {
  await page.goto("/?t=zzz");
  await expect(page).toHaveURL(/\/terms\/\?q=zzz$/);
  await expect(page.getByText(/No exact match/)).toBeVisible();
});

test("stray bare key is ignored", async ({ page }) => {
  const index = page.waitForResponse((r) => r.url().endsWith("/terms-index.json"));
  await page.goto("/?utm_source");
  await (await index).finished();
  await page.evaluate(() => new Promise((r) => setTimeout(r, 100)));
  await expect(page).toHaveURL(/\/\?utm_source$/);
});

test("unknown /t/ path goes to glossary search", async ({ page }) => {
  await page.goto("/t/zzz/");
  await expect(page).toHaveURL(/\/terms\/\?q=zzz$/);
});

test("popover copy and keyboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/narrators/");
  const trigger = page.locator("[data-term][data-term-json]").first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await dialog.getByRole("button", { name: /copy link/i }).click();
  await expect(dialog.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/t\/[a-z0-9-]+\/$/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("popover opens on click and closes on an outside click", async ({ page }) => {
  await page.goto("/narrators/");
  const trigger = page.locator("[data-term][data-term-json]").nth(1);
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /glossary/i })).toHaveAttribute("href", /\/terms\/#[a-z0-9-]+$/);
  await page.locator("h1").first().click();
  await expect(dialog).toBeHidden();
});
