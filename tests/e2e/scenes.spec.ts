import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

// scene pages (phase 2): term landings, views, the portrait carousel, Key/Labels mode, scene navigation
// the snapshot of dist this run serves (playwright.config.ts)
const index = JSON.parse(readFileSync(`${process.env.E2E_DIST ?? "dist"}/terms-index.json`, "utf8")) as Record<string, string>;
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

// /?slug redirects once slugquery.ts has fetched the terms index. It swallows a failed fetch and stays on the map, so
// check the fetch here: a failure then names the index instead of timing out on the URL
async function gotoQuery(page: Page, slug: string) {
  const index = page.waitForResponse((r) => new URL(r.url()).pathname.endsWith("/terms-index.json"));
  await page.goto(`/?${slug}`);
  expect((await index).status(), "terms-index.json").toBe(200);
}

test("every scene term is counted", () => {
  expect(built.length).toBeGreaterThanOrEqual(30);
  expect(panelScenes.size).toBe(14);
});

test.describe("landing, desktop", () => {
  test.use({ viewport: DESKTOP });
  for (const { slug, scene } of built) {
    test(`/t/${slug}/ lands on ${scene}`, async ({ page }) => {
      await page.goto(`/t/${slug}/`);
      await expectLanded(page, slug, scene);
    });
    test(`/?${slug} lands on ${scene}`, async ({ page }) => {
      await gotoQuery(page, slug);
      await expectLanded(page, slug, scene);
    });
  }
});

test.describe("landing, portrait carousel", () => {
  test.use({ viewport: PORTRAIT });
  for (const { slug, scene } of built.filter((b) => panelScenes.has(b.scene))) {
    test(`/?${slug} lands inside the carousel on ${scene}`, async ({ page }) => {
      await gotoQuery(page, slug);
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

  test("report: each view moves the two rings and shows its own names; the four triggers stay", async ({ page }) => {
    await page.goto("/adad-al-turuq/report/");
    const ids = ["same", "apart", "nested"];
    const part = (id: string) => page.locator(`svg [data-view-show="${id}"]`);
    const rings = page.locator("svg .vring");
    await expect(rings).toHaveCount(2);
    for (const id of ids) {
      if (id !== "same") {
        await page.locator(`.views button[data-v="${id}"]`).click();
        await expect(page).toHaveURL(new RegExp(`[?&]view=${id}\\b`));
      }
      await expect(page.locator(`.views button[data-v="${id}"]`)).toHaveAttribute("aria-pressed", "true");
      await expect(part(id)).toBeVisible();
      for (const other of ids.filter((x) => x !== id)) await expect(part(other)).toBeHidden();
      // reduced motion: each ring sits at once where this view puts it
      for (const r of await rings.all()) expect(await r.evaluate((e, v) => (e as SVGElement).style.transform.replace(/\s/g, "") === e.getAttribute(`data-v-${v}`)!.replace(/\s/g, ""), id)).toBe(true);
      for (const slug of ["khabar", "hadith", "isnad", "matn"]) await expect(trigger(page, slug)).toBeVisible();
      await expectNoAxeViolations(page);
    }
    // only the "two kinds" view says where reports come from, so only it draws the moon and figures in cell B
    await expect(part("apart").locator(".moon-g")).toHaveCount(1);
    await expect(part("same").locator(".moon-g")).toHaveCount(0);
    await expect(part("nested").locator(".moon-g")).toHaveCount(0);
  });

  test("?view=nested opens the report scene on that view, and opening khabar there keeps it", async ({ page }) => {
    await page.goto("/adad-al-turuq/report/?view=nested");
    await expect(page.locator('.views button[data-v="nested"]')).toHaveAttribute("aria-pressed", "true");
    await trigger(page, "khabar").click();
    await expect(page.locator("#term-pop")).toBeVisible();
    await expect(page).toHaveURL(/[?&]view=nested\b/);
    await expect(page.locator('svg [data-view-show="nested"]')).toBeVisible();
  });

  test("a report URL carrying ?view=nested and a term stays on nested", async ({ page }) => {
    // two params, so the bare-term redirect leaves it alone: the page opens on the nested view
    await page.goto("/adad-al-turuq/report/?view=nested&khabar");
    await expect(page).toHaveURL(/\/adad-al-turuq\/report\/\?view=nested&khabar$/);
    await expect(page.locator('.views button[data-v="nested"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('svg [data-view-show="nested"]')).toBeVisible();
    // the landing form, ?view=nested#khabar: the term opens, and the view stays on nested, since khabar shows in it
    await page.goto("/adad-al-turuq/report/?view=nested#khabar");
    await expect(trigger(page, "khabar")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#term-pop")).toBeVisible();
    await expect(page).toHaveURL(/[?&]view=nested\b/);
    await expect(page.locator('.views button[data-v="nested"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('svg [data-view-show="nested"]')).toBeVisible();
  });

  test.describe("with motion", () => {
    test.use({ contextOptions: { reducedMotion: "no-preference" } });

    test("report: the rings slide to the nested view and end inside one another", async ({ page }) => {
      await page.goto("/adad-al-turuq/report/");
      await page.locator('.views button[data-v="nested"]').click();
      // the ḥadīth ring ends inside the khabar ring once the transition finishes
      const inside = () => page.locator("svg .vring circle").evaluateAll((els) => {
        const [k, h] = els.map((e) => e.getBoundingClientRect());
        return h.width < k.width * 0.6 && h.left > k.left && h.right < k.right && h.top > k.top && h.bottom < k.bottom;
      });
      await expect.poll(inside, { timeout: 5000 }).toBe(true);
    });

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

  test("knowledge: the other view moves the mutawātir marker into the reasoned band and asks how the layperson knows", async ({ page }) => {
    await page.goto("/adad-al-turuq/knowledge/");
    const part = (id: string) => page.locator(`svg [data-view-show="${id}"]`);
    const marker = page.locator("svg .mut");
    const at = (v: string) => marker.evaluate((e, v) => (e as SVGElement).style.transform.replace(/\s/g, "") === e.getAttribute(`data-v-${v}`)!.replace(/\s/g, ""), v);
    expect(await at("ibn-hajar")).toBe(true);
    await expect(part("nazari-only").first()).toBeHidden();
    await page.locator('.views button[data-v="nazari-only"]').click();
    await expect(page).toHaveURL(/[?&]view=nazari-only\b/);
    await expect(page.locator('.views button[data-v="nazari-only"]')).toHaveAttribute("aria-pressed", "true");
    // reduced motion: the marker sits at once where this view puts it, lower down the meter
    expect(await at("nazari-only")).toBe(true);
    await expect(part("nazari-only").filter({ hasText: "yet he still gains it from mutawātir" })).toBeVisible();
    for (const g of await part("ibn-hajar").all()) await expect(g).toBeHidden();
    // the view note says who holds it and that Ibn Ḥajar rejects it
    await expect(page.locator('.views [data-view-show="nazari-only"]')).toContainText("Ibn Ḥajar rejects it");
    for (const slug of ["ilm-yaqini", "ilm-nazari", "muhtaff-bil-qarain"]) await expect(trigger(page, slug)).toBeVisible();
    await expectNoAxeViolations(page);
    await page.goto("/adad-al-turuq/knowledge/?view=nazari-only");
    expect(await at("nazari-only")).toBe(true);
  });

  test("hidden: the contemporary view counts the hidden mursal as tadlīs and swaps panel 3's verdict", async ({ page }) => {
    await page.goto("/al-mardud/hidden/");
    const part = (id: string) => page.locator(`svg [data-view-show="${id}"]`);
    await expect(part("ibn-hajar")).toContainText("irsāl, not tadlīs");
    for (const g of await part("contemporary").all()) await expect(g).toBeHidden();
    await page.locator('.views button[data-v="contemporary"]').click();
    await expect(page).toHaveURL(/[?&]view=contemporary\b/);
    await expect(page.locator('.views button[data-v="contemporary"]')).toHaveAttribute("aria-pressed", "true");
    await expect(part("contemporary").filter({ hasText: "counted as tadlīs too" })).toBeVisible();
    await expect(part("contemporary").filter({ hasText: "then mudallis" })).toBeVisible();
    await expect(part("ibn-hajar")).toBeHidden();
    await expect(page.locator('.views [data-view-show="contemporary"]')).toContainText("being a contemporary even if they have not met");
    // every term renders in both views
    for (const slug of ["mudallas", "mudallis", "mursal-khafi"]) await expect(trigger(page, slug)).toBeVisible();
    // the legend names the concealer's figure
    await expect(page.locator(".legend")).toContainText("Conceals (mudallis)");
    await expectNoAxeViolations(page);
  });

  test("hidden: opening mursal khafī from ?view=contemporary keeps that view", async ({ page }) => {
    await page.goto("/al-mardud/hidden/?view=contemporary#mursal-khafi");
    await expect(trigger(page, "mursal-khafi")).toHaveAttribute("aria-expanded", "true");
    await expect(page).toHaveURL(/[?&]view=contemporary\b/);
    await expect(page.locator('.views button[data-v="contemporary"]')).toHaveAttribute("aria-pressed", "true");
  });

  test("wording: each of the four views swaps panel 2's tag and output card, and every term stays", async ({ page }) => {
    await page.goto("/al-mardud/wording/");
    // no narrator figures: no legend and no Key/Labels switch
    await expect(page.locator(".legend")).toHaveCount(0);
    await expect(page.locator(".viewtoggle")).toHaveCount(0);
    const part = (id: string) => page.locator(`svg [data-view-show~="${id}"]`);
    const TAGS: Record<string, string> = {
      most: "most scholars allow it",
      "single-words": "single words, not sentences",
      "knows-wording": "he can go back to the words",
      forgot: "the words forgotten, the meaning kept",
    };
    const ids = Object.keys(TAGS);
    for (const id of ids) {
      if (id !== "most") {
        await page.locator(`.views button[data-v="${id}"]`).click();
        await expect(page).toHaveURL(new RegExp(`[?&]view=${id}\\b`));
      }
      await expect(page.locator(`.views button[data-v="${id}"]`)).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(`svg [data-view-show="${id}"]`, { hasText: TAGS[id] })).toBeVisible();
      for (const other of ids.filter((x) => x !== id)) await expect(page.locator(`svg [data-view-show="${other}"]`, { hasText: TAGS[other] })).toBeHidden();
      // single words changes one word of the output card; the other views change them all
      await expect(page.locator("svg .nw:visible .word.changed")).toHaveCount(id === "single-words" ? 1 : 5);
      // knows the words draws the way back to them; forgotten fades the original words
      await expect(page.locator("svg path.ret")).toBeVisible({ visible: id === "knows-wording" });
      await expect(part("forgot").locator(".word.lost").first()).toBeVisible({ visible: id === "forgot" });
      for (const slug of ["ikhtisar-al-hadith", "riwaya-bil-mana", "gharib-al-hadith"]) await expect(trigger(page, slug)).toBeVisible();
      await expectNoAxeViolations(page);
    }
    // each "it is said" view note says the book doesn't name who holds it, once: in the note, not again in the
    // scholars field
    for (const id of ["single-words", "knows-wording", "forgot"]) expect((await page.locator(`.views [data-view-show="${id}"]`).textContent())!.match(/unnamed|doesn't name/gi)).toHaveLength(1);
    await expect(page.locator('.views [data-view-show="most"]')).toContainText("on the correct opinion, Ibn Ḥajar says");
  });

  test("wording: opening al-riwāya bi-l-maʿnā from ?view=forgot keeps that view", async ({ page }) => {
    await page.goto("/al-mardud/wording/?view=forgot#riwaya-bil-mana");
    await expect(trigger(page, "riwaya-bil-mana")).toHaveAttribute("aria-expanded", "true");
    await expect(page).toHaveURL(/[?&]view=forgot\b/);
    await expect(page.locator('.views button[data-v="forgot"]')).toHaveAttribute("aria-pressed", "true");
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

// the Names pattern: the names, grades, report and changes scenes are all grids of cells
test.describe("names grid", () => {
  const lefts = (page: Page) => page.locator(".cells > svg").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

  for (const path of ["/al-asma/names/", "/al-maqbul/grades/", "/adad-al-turuq/report/", "/al-mardud/changes/"]) {
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

test("scene prev/next: breaks leads on to hidden, hidden to lying, lying to slips, slips to changes, changes to wording, and wording to unknown", async ({ page }) => {
  await page.goto("/al-mardud/breaks/");
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/al-mardud\/hidden\/$/);
  await page.goto("/al-mardud/hidden/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/al-mardud\/breaks\/$/);
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/al-mardud\/lying\/$/);
  await page.goto("/al-mardud/lying/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/al-mardud\/hidden\/$/);
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/al-mardud\/slips\/$/);
  await page.goto("/al-mardud/slips/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/al-mardud\/lying\/$/);
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/al-mardud\/changes\/$/);
  await page.goto("/al-mardud/changes/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/al-mardud\/slips\/$/);
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/al-mardud\/wording\/$/);
  await page.goto("/al-mardud/wording/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/al-mardud\/changes\/$/);
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/al-mardud\/unknown\/$/);
  await page.goto("/al-mardud/unknown/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/al-mardud\/wording\/$/);
});

test("scene prev/next: the report scene opens its division and leads on to routes", async ({ page }) => {
  await page.goto("/adad-al-turuq/report/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveCount(0);
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/adad-al-turuq\/routes\/$/);
  await page.goto("/adad-al-turuq/routes/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/adad-al-turuq\/report\/$/);
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

test("scene prev/next: sorting follows routes in its division", async ({ page }) => {
  await page.goto("/adad-al-turuq/sorting/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/adad-al-turuq\/routes\/$/);
  await page.goto("/adad-al-turuq/routes/");
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/adad-al-turuq\/sorting\/$/);
});

test("scene prev/next: knowledge follows sorting, and the sorting pill links to it", async ({ page }) => {
  await page.goto("/adad-al-turuq/knowledge/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/adad-al-turuq\/sorting\/$/);
  await page.goto("/adad-al-turuq/sorting/");
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/adad-al-turuq\/knowledge\/$/);
  await expect(page.locator("svg a.pill-link")).toHaveAttribute("href", /\/adad-al-turuq\/knowledge\/$/);
});

test("scene prev/next: lone follows knowledge and ends the division", async ({ page }) => {
  await page.goto("/adad-al-turuq/lone/");
  await expect(page.locator('.pn a[rel="prev"]')).toHaveAttribute("href", /\/adad-al-turuq\/knowledge\/$/);
  await expect(page.locator(".pn a").last()).toHaveAttribute("href", /\/adad-al-turuq\/$/);
  await page.goto("/adad-al-turuq/knowledge/");
  await expect(page.locator('.pn a[rel="next"]')).toHaveAttribute("href", /\/adad-al-turuq\/lone\/$/);
});

test("lone: a legend and the Key/Labels switch, and every term visible", async ({ page }) => {
  await page.goto("/adad-al-turuq/lone/");
  await expect(page.locator(".legend")).toHaveCount(1);
  await expect(page.locator(".viewtoggle")).toHaveCount(1);
  for (const slug of ["gharib-mutlaq", "fard", "gharib-nisbi"]) await expect(trigger(page, slug)).toBeVisible();
  await expectNoAxeViolations(page);
});

test("lying: the legend names the liar and the suspect, and every term is visible", async ({ page }) => {
  await page.goto("/al-mardud/lying/");
  await expect(page.locator(".legend")).toContainText("Liar (kadhdhāb)");
  await expect(page.locator(".legend")).toContainText("Suspected of lying");
  await expect(page.locator(".viewtoggle")).toHaveCount(1);
  await expect(page.locator(".views")).toHaveCount(0);
  for (const slug of ["kadhib", "tuhma-bil-kadhib", "matruk", "mawdu"]) await expect(trigger(page, slug)).toBeVisible();
  // the only report words are the translation's English fragments, the added words marked
  await expect(page.locator("svg .matn .added")).toHaveText("“and pigeon racing”");
  await expectNoAxeViolations(page);
});

test("slips: the legend names the faded head, every term is visible, and munkar and shādhdh link to their scene", async ({ page }) => {
  await page.goto("/al-mardud/slips/");
  await expect(page.locator(".legend")).toContainText("Memory failed (mukhtaliṭ)");
  await expect(page.locator(".viewtoggle")).toHaveCount(1);
  await expect(page.locator(".views")).toHaveCount(0);
  for (const slug of ["fuhsh-al-ghalat", "ghafla", "wahm", "muallal", "su-al-hifz", "mukhtalit"]) await expect(trigger(page, slug)).toBeVisible();
  // munkar and shādhdh are plain links to Who outweighs whom?, never triggers (design §18)
  const links = page.locator("svg.slips a.xlink");
  await expect(links.filter({ hasText: "munkar" })).toHaveAttribute("href", /\/al-maqbul\/opposition\/$/);
  await expect(links.filter({ hasText: "shādhdh" })).toHaveAttribute("href", /\/al-maqbul\/opposition\/$/);
  // the muʿallal chain is an illustration, and the two names under a translation query are left out
  await expect(page.locator("svg.slips")).toContainText("an illustration: the book names no example");
  await expect(page.locator("svg.slips .chip")).toHaveCount(5);
  await expectNoAxeViolations(page);
});

test("sorting: no legend or Key/Labels switch, since it draws no narrators", async ({ page }) => {
  await page.goto("/adad-al-turuq/sorting/");
  await expect(page.locator(".legend")).toHaveCount(0);
  await expect(page.locator(".viewtoggle")).toHaveCount(0);
  for (const slug of ["ahad", "mustafid", "maqbul", "mardud"]) await expect(trigger(page, slug)).toBeVisible();
  await expectNoAxeViolations(page);
});

test("changes: the legend, every term visible, the illustrations labelled and the hands quoted as the translation has them", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/al-mardud/changes/");
  await expect(page.locator(".legend")).toHaveCount(1);
  await expect(page.locator(".viewtoggle")).toHaveCount(1);
  await expect(page.locator(".views")).toHaveCount(0);
  for (const slug of ["mukhalafa", "mudraj", "mudraj-al-isnad", "mudraj-al-matn", "maqlub", "mazid", "mudtarib", "musahhaf", "muharraf"]) await expect(trigger(page, slug)).toBeVisible();
  // only maqlūb has an example in the book; the other four form cells say they are illustrations (design §18)
  await expect(page.locator(".changes svg", { hasText: "an illustration: the book names no example" })).toHaveCount(4);
  // the two text cards read, in source order (WCAG 1.3.2), as short fragments of the translation's English (design
  // §7.3): the slip, then the version of both Ṣaḥīḥs
  const cards = await page.locator("#cell-maqlub text.mw").allTextContents();
  expect(cards.join(" ")).toBe("“…the right hand … what the left …” “…the left hand … what the right …”");
  await expectNoAxeViolations(page);
});

test("changes: each answer in the sorter jumps to its cell, and the cross-links reach their scenes", async ({ page }) => {
  await page.setViewportSize(PORTRAIT);
  await page.goto("/al-mardud/changes/");
  const jumps = page.locator("#cell-sorter a.jump");
  await expect(jumps).toHaveCount(5);
  for (const id of ["cell-mudraj", "cell-maqlub", "cell-mazid", "cell-mudtarib", "cell-letters"]) {
    await page.locator(`#cell-sorter a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
    // a jump is not a term landing: no popover opens
    await expect(page.locator("#term-pop")).toBeHidden();
  }
  await expect(page.locator("#cell-mazid a.xlink")).toHaveAttribute("href", /\/al-mardud\/hidden\/$/);
  await expect(page.locator("#cell-mudtarib a.xlink", { hasText: "Did he lie?" })).toHaveAttribute("href", /\/al-mardud\/lying\/$/);
  await expect(page.locator("#cell-mudtarib a.xlink", { hasText: "muʿallal" })).toHaveAttribute("href", /\/al-mardud\/slips\/$/);
  await expect(page.locator("#cell-mudtarib a.jump")).toHaveAttribute("href", "#cell-maqlub");
});

test("hidden: the extra-narrator link lands on al-mazīd in What changed in the telling?", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/al-mardud/hidden/");
  const link = page.locator('svg.hidden-scene a.xlink[href*="/changes/"]');
  await expect(link).toHaveAttribute("href", /\/al-mardud\/changes\/#mazid$/);
  await expect(link).toContainText("What changed in the telling?");
  await link.click();
  await expectLanded(page, "mazid", "al-mardud/changes/");
});
