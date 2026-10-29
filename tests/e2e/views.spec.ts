import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

// the view switch (viewswitch.ts), once each way in: a ?view= on load (V1), the buttons (V2), the animated transition
// (V3) and no replayed load-in (V4). Each view's markup is checked statically (tests/dist/views.test.ts, S2) and each
// ?view= URL scanned by routes.spec.ts.
const scenes = parse(readFileSync("src/content/scenes.yaml", "utf8")) as { id: string; division: string; views?: { id: string }[] }[];
const routes = scenes.map((s) => `/${s.division}/${s.id}/`);

// tx/ty of every step group in the page against its target in view id; computed transforms are matrix(a,b,c,d,tx,ty)
const offBy = async (page: Page, id: string) => Math.max(...await page.locator(`.stepg[data-v-${id}]`).evaluateAll((els, id) => els.map((el) => {
  const m = getComputedStyle(el).transform;
  const got = m === "none" ? [0, 0] : m.slice(m.indexOf("(") + 1, -1).split(",").slice(4).map(Number);
  const want = [...el.getAttribute(`data-v-${id}`)!.matchAll(/-?[\d.]+(?=px)/g)].map((x) => Number(x[0]));
  return Math.max(Math.abs(got[0] - want[0]), Math.abs(got[1] - want[1]));
}), id));

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("V1: ?view= opens a scene on that view", async ({ page }) => {
    await page.goto("/siyagh-al-ada/delivery/?view=madinah");
    await expect(page.locator('.views button[data-v="madinah"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.views button[data-v="ibn-hajar"]')).toHaveAttribute("aria-pressed", "false");
    const step1 = page.locator(".stepg[data-v-madinah]").first();
    // step 1 sits elsewhere in the default view, so a ?view= that wasn't applied would fail here
    expect(await step1.getAttribute("data-v-madinah")).not.toBe(await step1.getAttribute("data-v-ibn-hajar"));
    expect(await offBy(page, "madinah")).toBeLessThan(0.5);
  });

  test("V2: each view button shows its parts, hides the rest, sets its values and keeps the URL in step", async ({ page }) => {
    await page.goto("/adad-al-turuq/report/");
    const ids = (await page.locator(".views[data-views]").getAttribute("data-views"))!.split(/\s+/);
    expect(ids.length).toBeGreaterThan(1);
    // every view in turn, then back to the default, which the URL leaves out
    for (const id of [...ids.slice(1), ids[0]]) {
      await page.locator(`.views button[data-v="${id}"]`).click();
      if (id === ids[0]) await expect(page).not.toHaveURL(/[?&]view=/);
      else await expect(page).toHaveURL(new RegExp(`[?&]view=${id}\\b`));
      const wrong = await page.evaluate(({ id, ids }) => {
        const out: string[] = [];
        for (const b of document.querySelectorAll<HTMLButtonElement>(".views button[data-v]")) {
          if ((b.getAttribute("aria-pressed") === "true") !== (b.dataset.v === id)) out.push(`button ${b.dataset.v} pressed wrongly`);
        }
        const parts = [...document.querySelectorAll("[data-view-show]")];
        for (const p of parts) {
          const mine = p.getAttribute("data-view-show")!.split(/\s+/).includes(id);
          if (mine === p.classList.contains("off")) out.push(`part for "${p.getAttribute("data-view-show")}" ${mine ? "hidden" : "shown"}`);
        }
        // reduced motion: each value is in place at once
        const norm = (s: string) => s.replace(/\s/g, "");
        const set = [["v", "transform"], ["h", "height"], ["fill", "fill"]] as const;
        let values = 0;
        for (const [attr, prop] of set) {
          for (const el of document.querySelectorAll<SVGElement>(`[data-${attr}-${id}]`)) {
            values++;
            if (norm(el.style[prop]) !== norm(el.getAttribute(`data-${attr}-${id}`)!)) out.push(`${prop} of .${el.getAttribute("class")} not set`);
          }
        }
        if (!parts.length || !values || ids.some((v) => !document.querySelector(`[data-view-show~="${v}"]`))) out.push("nothing to switch");
        return out;
      }, { id, ids });
      expect(wrong, id).toEqual([]);
    }
  });
});

test("V3: with motion, a view switch animates the values to their targets", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
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

// V4, the regression for the wording scene's output card blanking for a second on a view switch: its new words faded
// in on each view group, and a group hidden by .off (display:none) starts its animation over when shown. The Key and
// Labels toggle shows and hides the figures' labels the same way. So once a scene's load-in has finished, switching
// views or modes must start no finite animation; the switch's own transitions and the loops are not that.
test("a view switch or Labels toggle never replays a scene's load-in animation", async ({ page }) => {
  // each scene starts in Key mode, as a first visit does: the toggle's choice is stored
  await page.addInitScript(() => localStorage.clear());
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let switched = 0;
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const { replayed, clicks } = await page.evaluate(async () => {
      const finite = () => document.getAnimations()
        .filter((a) => a instanceof CSSAnimation && a.effect?.getComputedTiming().iterations !== Infinity);
      const views = [...document.querySelectorAll<HTMLButtonElement>(".views button[data-v]")];
      const modes = ["labels", "key"].flatMap((m) => [...document.querySelectorAll<HTMLButtonElement>(`.viewtoggle button[data-mode="${m}"]`)]);
      const frame = () => new Promise(requestAnimationFrame);
      const out: string[] = [];
      // every view in turn, then back to the first, then Labels and back to Key, a frame apart as a reader's clicks are
      const clicks = [...views.slice(1), ...views.slice(0, 1), ...modes];
      for (const b of clicks) {
        finite().forEach((a) => a.finish());
        b.click();
        await frame();
        out.push(...finite().filter((a) => a.playState === "running")
          .map((a) => `${b.dataset.v ?? b.dataset.mode}: ${(a as CSSAnimation).animationName} on .${[...((a.effect as KeyframeEffect).target?.classList ?? [])].join(".")}`));
      }
      return { replayed: out, clicks: clicks.length };
    });
    switched += clicks;
    expect(replayed, route).toEqual([]);
  }
  expect(switched).toBeGreaterThan(0);
});
