import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

// scene pages (phase 2): term landings, views, the portrait carousel, Key/Labels mode, scene navigation
const index = JSON.parse(readFileSync("dist/terms-index.json", "utf8")) as Record<string, string>;
// built terms point at a scene; pending ones at their glossary entry
const built = Object.entries(index)
  .filter(([, path]) => !path.startsWith("terms/"))
  .map(([slug, path]) => ({ slug, scene: path.split("#")[0] }));
type Scene = { id: string; division: string; moons: number[]; panels?: unknown[] };
const scenes = parse(readFileSync("src/content/scenes.yaml", "utf8")) as Scene[];
const panelScenes = new Set(scenes.filter((s) => s.panels).map((s) => `${s.division}/${s.id}/`));

const DESKTOP = { width: 1280, height: 800 };
const PORTRAIT = { width: 390, height: 844 };
const LANDSCAPE = { width: 844, height: 390 };

// motion only gets in the way of these checks; the view-switch transition test below opts back in
test.use({ contextOptions: { reducedMotion: "reduce" } });

// routes.spec.ts scans every page in its first state; these scans cover states it doesn't reach
async function expectNoAxeViolations(page: Page) {
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

const trigger = (page: Page, slug: string) => page.locator(`[data-term="${slug}"][data-term-json]`);

async function expectLanded(page: Page, slug: string, scene: string) {
  await expect(page).toHaveURL(new RegExp(`/${scene}#${slug}$`));
  await expect(trigger(page, slug)).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#term-pop")).toBeVisible();
  await expect(trigger(page, slug)).toBeInViewport();
}

test("every scene term is counted", () => {
  expect(built.length).toBeGreaterThanOrEqual(30);
  expect(panelScenes.size).toBe(6);
});

test.describe("landing, desktop", () => {
  test.use({ viewport: DESKTOP });
  for (const { slug, scene } of built) {
    test(`/t/${slug}/ lands on ${scene}`, async ({ page }) => {
      await page.goto(`/t/${slug}/`);
      await expectLanded(page, slug, scene);
    });
    test(`/?${slug} lands on ${scene}`, async ({ page }) => {
      await page.goto(`/?${slug}`);
      await expectLanded(page, slug, scene);
    });
  }
});

test.describe("landing, portrait carousel", () => {
  test.use({ viewport: PORTRAIT });
  for (const { slug, scene } of built.filter((b) => panelScenes.has(b.scene))) {
    test(`/?${slug} lands inside the carousel on ${scene}`, async ({ page }) => {
      await page.goto(`/?${slug}`);
      await expectLanded(page, slug, scene);
      // the carousel has been scrolled so the whole trigger sits inside the visible part of the scroller
      const scroller = page.locator(".carousel .scroller");
      await expect.poll(async () => {
        const [t, s] = [await trigger(page, slug).boundingBox(), await scroller.boundingBox()];
        return !!t && !!s && t.x >= s.x - 1 && t.x + t.width <= s.x + s.width + 1;
      }).toBe(true);
    });
  }

  test("a tap on a visible trigger opens the popover", async ({ page }) => {
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

// tx/ty of every step group in the page against its target in view id; computed transforms are matrix(a,b,c,d,tx,ty)
const stepOffsets = (page: Page, id: string) =>
  page.locator(`.stepg[data-v-${id}]`).evaluateAll((els, id) => els.map((el) => {
    const m = getComputedStyle(el).transform;
    const got = m === "none" ? [0, 0] : m.slice(m.indexOf("(") + 1, -1).split(",").slice(4).map(Number);
    const want = [...el.getAttribute(`data-v-${id}`)!.matchAll(/-?[\d.]+(?=px)/g)].map((x) => Number(x[0]));
    return Math.max(Math.abs(got[0] - want[0]), Math.abs(got[1] - want[1]));
  }), id);
const offBy = async (page: Page, id: string) => Math.max(...(await stepOffsets(page, id)));

test.describe("views", () => {
  test.use({ viewport: DESKTOP });

  test("?view=madinah opens the delivery scene on that view", async ({ page }) => {
    await page.goto("/siyagh-al-ada/delivery/?view=madinah");
    await expect(page.locator('.views button[data-v="madinah"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.views button[data-v="ibn-hajar"]')).toHaveAttribute("aria-pressed", "false");
    const step1 = page.locator(".stepg[data-v-madinah]").first();
    // step 1 sits elsewhere in the default view, so a ?view= that wasn't applied would fail here
    expect(await step1.getAttribute("data-v-madinah")).not.toBe(await step1.getAttribute("data-v-ibn-hajar"));
    expect((await stepOffsets(page, "madinah"))[0]).toBeLessThan(0.5);
    expect(await offBy(page, "madinah")).toBeLessThan(0.5);
  });

  test("?view=tirmidhi swaps rung 4 of the grades ladder for al-Tirmidhī's conditions", async ({ page }) => {
    await page.goto("/al-maqbul/grades/?view=tirmidhi");
    await expect(page.locator('.views button[data-v="tirmidhi"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('svg [data-view-show="tirmidhi"]')).toBeVisible();
    await expect(page.locator('svg [data-view-show="ibn-hajar"]')).toBeHidden();
    await expectNoAxeViolations(page);
  });

  test("a term landing from ?view=tirmidhi ends on the default view with the term open", async ({ page }) => {
    await page.goto("/al-maqbul/grades/?view=tirmidhi");
    await expect(trigger(page, "hasan-li-dhatihi")).toBeHidden();
    await page.goto("/?hasan-li-dhatihi");
    await expectLanded(page, "hasan-li-dhatihi", "al-maqbul/grades/");
    await expect(page.locator('.views button[data-v="ibn-hajar"]')).toHaveAttribute("aria-pressed", "true");
    await expect(trigger(page, "hasan-li-dhatihi")).toBeVisible();
  });

  test.describe("with motion", () => {
    test.use({ contextOptions: { reducedMotion: "no-preference" } });

    test("switching views updates the URL and the steps end at their targets", async ({ page }) => {
      await page.goto("/siyagh-al-ada/delivery/");
      // the default and al-Bukhārī's view place the steps differently, so the transition really moves them
      expect(await offBy(page, "bukhari")).toBeGreaterThan(1);
      await page.locator('.views button[data-v="bukhari"]').click();
      await expect(page).toHaveURL(/[?&]view=bukhari\b/);
      await expect.poll(() => offBy(page, "bukhari"), { timeout: 5000 }).toBeLessThan(0.5);
      await page.locator('.views button[data-v="ibn-hajar"]').click();
      await expect(page).toHaveURL(/\/siyagh-al-ada\/delivery\/$/);
      await expect.poll(() => offBy(page, "ibn-hajar"), { timeout: 5000 }).toBeLessThan(0.5);
    });
  });

  test("?view=shafii shows al-Shāfiʿī's mursal ruling only", async ({ page }) => {
    await page.goto("/al-mardud/breaks/?view=shafii");
    const pill = (id: string) => page.locator(`svg [data-view-show="${id}"]`);
    await expect(pill("shafii")).toBeVisible();
    await expect(pill("shafii")).toHaveText("Accepted if supported");
    await expect(pill("hadith-scholars")).toBeHidden();
    await expect(pill("malikis")).toBeHidden();
    await expectNoAxeViolations(page);
  });

  test("accept-all swaps the clash branch's Weigh them for Accepted; the scales stay", async ({ page }) => {
    await page.goto("/al-maqbul/opposition/");
    const branch = (id: string) => page.locator(`svg [data-view-show="${id}"]`);
    await expect(branch("ibn-hajar")).toContainText("Weigh them");
    await expect(branch("accept-all")).toBeHidden();
    await page.locator('.views button[data-v="accept-all"]').click();
    await expect(page).toHaveURL(/[?&]view=accept-all\b/);
    await expect(branch("accept-all")).toBeVisible();
    await expect(branch("accept-all")).toContainText("Accepted");
    await expect(branch("ibn-hajar")).toBeHidden();
    // panels 2 and 3 show opposition in general, which both views recognise
    await expect(page.locator("svg .scale")).toHaveCount(2);
    for (const slug of ["shadhdh", "mahfuz", "munkar", "maruf"]) await expect(trigger(page, slug)).toBeVisible();
    await expectNoAxeViolations(page);
  });
});

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

// the Names pattern: the names scene and the grades scene are both grids of cells
test.describe("names grid", () => {
  const lefts = (page: Page) => page.locator(".cells > svg").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

  for (const path of ["/al-asma/names/", "/al-maqbul/grades/"]) {
    test(`portrait: ${path} stacks its cells in one column`, async ({ page }) => {
      await page.setViewportSize(PORTRAIT);
      await page.goto(path);
      const l = await lefts(page);
      expect(l.length).toBeGreaterThan(1);
      expect(new Set(l).size).toBe(1);
    });

    test(`desktop: ${path} has two columns`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(path);
      expect(new Set(await lefts(page)).size).toBe(2);
    });
  }
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

test("scene prev/next: breaks leads on to unknown", async ({ page }) => {
  await page.goto("/al-mardud/breaks/");
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/al-mardud\/unknown\/$/);
});

// al-mardud has a scene on both moons; the other divisions also have moons still to come
const divisions = parse(readFileSync("src/content/divisions.yaml", "utf8")) as { id: string; moons: string[] }[];
for (const d of divisions) {
  test(`/${d.id}/ links its scenes; only moons without one say Coming soon`, async ({ page }) => {
    await page.goto(`/${d.id}/`);
    const mine = scenes.filter((s) => s.division === d.id);
    const caps = page.locator(".captions > .cap");
    await expect(caps).toHaveCount(d.moons.length);
    // a scene can cover several moons, so each moon lists every scene that covers it
    for (let k = 0; k < d.moons.length; k++) {
      const here = mine.filter((s) => s.moons.includes(k));
      for (const s of here) await expect(caps.nth(k).locator(`a[href$="/${d.id}/${s.id}/"]`)).toBeVisible();
      if (here.length) await expect(caps.nth(k)).not.toContainText("Coming soon");
      else await expect(caps.nth(k)).toContainText("Coming soon");
    }
  });
}
