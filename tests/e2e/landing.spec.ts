import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

// term landings: /t/<slug>/ and /?slug reach the term's scene with its popover open, inside the carousel in portrait,
// and keep a ?view= the URL carries. Every term's target is checked statically (tests/dist/terms.test.ts, S1); these
// run the landing code (popover.ts land) once per way in
// the snapshot of dist this run serves (playwright.config.ts)
const index = JSON.parse(readFileSync(`${process.env.E2E_DIST ?? "dist"}/terms-index.json`, "utf8")) as Record<string, string>;
// built terms point at a scene; pending ones at their glossary entry
const built = Object.entries(index)
  .filter(([, path]) => !path.startsWith("terms/"))
  .map(([slug, path]) => ({ slug, scene: path.split("#")[0] }));
const pending = Object.entries(index).filter(([, path]) => path.startsWith("terms/")).map(([slug]) => slug);
const scenes = parse(readFileSync("src/content/scenes.yaml", "utf8")) as { id: string; division: string; panels?: unknown[] }[];

const DESKTOP = { width: 1280, height: 800 };
const PORTRAIT = { width: 390, height: 844 };

// motion only gets in the way of these checks
test.use({ contextOptions: { reducedMotion: "reduce" } });

const trigger = (page: Page, slug: string) => page.locator(`[data-term="${slug}"][data-term-json]`);

async function expectLanded(page: Page, slug: string, scene: string) {
  await expect(page).toHaveURL(new RegExp(`/${scene}#${slug}$`));
  await expect(trigger(page, slug)).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#term-pop")).toBeVisible();
  await expect(trigger(page, slug)).toBeInViewport();
}

// /?slug redirects once slugquery.ts has fetched the terms index. It swallows a failed fetch and stays on the map, so
// check the fetch here: a failure then names the index instead of timing out on the URL
async function gotoQuery(page: Page, slug: string) {
  const index = page.waitForResponse((r) => new URL(r.url()).pathname.endsWith("/terms-index.json"));
  await page.goto(`/?${slug}`);
  expect((await index).status(), "terms-index.json").toBe(200);
}

test.describe("landing, desktop", () => {
  test.use({ viewport: DESKTOP });

  test("L1: /t/<slug>/ lands on the term's scene with its popover open", async ({ page }) => {
    const { slug, scene } = built[0];
    await page.goto(`/t/${slug}/`);
    await expectLanded(page, slug, scene);
  });

  test("L2: /?slug lands on the term's scene with its popover open", async ({ page }) => {
    const { slug, scene } = built[built.length - 1];
    await gotoQuery(page, slug);
    await expectLanded(page, slug, scene);
  });

  // L5 (popover.ts): a term landing on a scene keeps the view the URL asks for, where the term shows in it
  test("L5: ?view=x#term opens the term and keeps the view", async ({ page }) => {
    await page.goto("/adad-al-turuq/report/?view=nested#khabar");
    await expect(trigger(page, "khabar")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#term-pop")).toBeVisible();
    await expect(page).toHaveURL(/[?&]view=nested\b/);
    await expect(page.locator('.views button[data-v="nested"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('svg [data-view-show="nested"]')).toBeVisible();
  });

  test("a pending term's /t/ lands on its glossary entry", async ({ page }) => {
    expect(pending.length).toBeGreaterThan(0);
    await page.goto(`/t/${pending[0]}/`);
    await expect(page).toHaveURL(new RegExp(`/terms/#${pending[0]}$`));
    await expect(page.locator(`#${pending[0]}`)).toBeInViewport();
  });
});

test.describe("landing, portrait carousel", () => {
  test.use({ viewport: PORTRAIT });

  test("L3: a term in a later panel lands scrolled into the carousel", async ({ page }) => {
    // a term whose trigger starts out of the scroller's view, past the first panel
    const scene = scenes.find((s) => s.panels)!;
    await page.goto(`/${scene.division}/${scene.id}/`);
    const slug = await page.evaluate(() => {
      const s = document.querySelector(".carousel .scroller")!.getBoundingClientRect();
      return [...document.querySelectorAll("[data-term][data-term-json]")]
        .find((el) => el.getBoundingClientRect().left >= s.right)?.getAttribute("data-term");
    });
    expect(slug).toBeTruthy();
    await gotoQuery(page, slug!);
    await expectLanded(page, slug!, `${scene.division}/${scene.id}/`);
    // the carousel has been scrolled so the whole trigger sits inside the visible part of the scroller
    const scroller = page.locator(".carousel .scroller");
    await expect.poll(async () => {
      const [t, s] = [await trigger(page, slug!).boundingBox(), await scroller.boundingBox()];
      return !!t && !!s && t.x >= s.x - 1 && t.x + t.width <= s.x + s.width + 1;
    }).toBe(true);
  });

  test("L4: a tap on a visible trigger opens the popover", async ({ page }) => {
    await page.goto("/adad-al-turuq/routes/");
    const i = await page.evaluate(() => {
      const s = document.querySelector(".carousel .scroller")!.getBoundingClientRect();
      return [...document.querySelectorAll("[data-term][data-term-json]")].findIndex((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.left >= s.left && r.right <= s.right;
      });
    });
    expect(i).toBeGreaterThanOrEqual(0);
    const t = page.locator("[data-term][data-term-json]").nth(i);
    await t.scrollIntoViewIfNeeded();
    // a real click: Playwright fails it if anything laid over the trigger would take the tap
    await t.click();
    await expect(t).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#term-pop")).toBeVisible();
  });
});
