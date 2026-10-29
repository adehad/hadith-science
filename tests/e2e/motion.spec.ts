import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const scenes = parse(readFileSync("src/content/scenes.yaml", "utf8")) as { id: string; division: string }[];

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

// scenes: CSS transitions (the staircase) and the landing ring are animations; the shimmer is SMIL, which
// getAnimations() doesn't see, so it is checked as paused
for (const s of scenes) {
  test(`reduced motion: /${s.division}/${s.id}/ has no animations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${s.division}/${s.id}/`);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.getAnimations().map((a) => (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty))).toEqual([]);
    expect(await page.evaluate(() => [...document.querySelectorAll("svg")].every((s) => s.animationsPaused()))).toBe(true);
  });
}

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

test("reduced motion: the opposition scales rest tipped, not level", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-maqbul/opposition/");
  const beams = await page.locator("svg .scale .beam").evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));
  expect(beams).toHaveLength(2);
  for (const t of beams) expect(t).not.toBe("none");
  // the heavier pan has sunk: panel 2 tips left (maḥfūẓ), panel 3 right (maʿrūf)
  const pans = await page.locator("svg .scale .pan").evaluateAll((els) => els.map((e) => new DOMMatrix(getComputedStyle(e).transform).f));
  expect(pans[0]).toBeGreaterThan(0);
  expect(pans[1]).toBeLessThan(0);
  expect(pans[2]).toBeLessThan(0);
  expect(pans[3]).toBeGreaterThan(0);
});

test("reduced motion: the support scene shows the iʿtibār sweep's end state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-maqbul/support/");
  // the lens rests at its heading, not on the book row where the sweep starts
  expect(await page.locator("svg .lens").evaluate((e) => getComputedStyle(e).transform)).toBe("none");
  // every found route is lit, the brackets are in, and "alone?" is struck through
  const ops = await page.locator("svg .route, svg .brk").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(ops).toHaveLength(6);
  for (const o of ops) expect(o).toBe("1");
  expect(await page.locator("svg .strike").evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", "")))).toBe(0);
});

test("with motion, the support scene's routes start faint and the lens sweeps the book row", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-maqbul/support/");
  const last = page.locator("svg .route").last();
  expect(Number(await last.evaluate((e) => getComputedStyle(e).opacity))).toBeLessThan(0.5);
  // the brackets wait for the sweep, but start half in, so a visitor landing on ?mutabi can see the bracket
  expect(Number(await page.locator("svg .brk").evaluate((e) => getComputedStyle(e).opacity))).toBeGreaterThanOrEqual(0.5);
  expect(await page.locator("svg .lens").evaluate((e) => getComputedStyle(e).transform)).not.toBe("none");
  await expect.poll(() => last.evaluate((e) => getComputedStyle(e).opacity), { timeout: 10000 }).toBe("1");
  await expect.poll(() => page.locator("svg .lens").evaluate((e) => getComputedStyle(e).transform), { timeout: 10000 }).toBe("none");
});

test("reduced motion: the acted-on scene shows the abrogated ruling struck and the preference scale tipped", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-maqbul/acted-on/");
  expect(await page.locator("svg .strike").evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", "")))).toBe(0);
  // the preferred report's pan has sunk: the beam tips left
  const pans = await page.locator("svg .scale .pan").evaluateAll((els) => els.map((e) => new DOMMatrix(getComputedStyle(e).transform).f));
  expect(pans).toHaveLength(2);
  expect(pans[0]).toBeGreaterThan(0);
  expect(pans[1]).toBeLessThan(0);
});

test("with motion, the acted-on scene's strike draws across the abrogated ruling after a delay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-maqbul/acted-on/");
  const strike = page.locator("svg .strike");
  // the draw is set up with its 1s delay; its current offset isn't checked, since a loaded runner may be past it
  const anims = await strike.evaluate((e) => e.getAnimations().map((a) => ({
    name: (a as CSSAnimation).animationName,
    delay: a.effect?.getTiming().delay,
  })));
  expect(anims).toContainEqual({ name: "acted-draw", delay: 1000 });
  const offset = () => strike.evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", "")));
  await expect.poll(offset, { timeout: 5000 }).toBe(0);
});

test("reduced motion: the sorting scene shows the lens at rest, the three exits drawn and the outcome cards", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/adad-al-turuq/sorting/");
  expect(await page.locator("svg .lens-pass").evaluate((e) => getComputedStyle(e).transform)).toBe("none");
  const exits = await page.locator("svg .exit").evaluateAll((els) => els.map((e) => [Number(getComputedStyle(e).strokeDashoffset.replace("px", "")), getComputedStyle(e).opacity]));
  expect(exits).toEqual([[0, "1"], [0, "1"], [0, "1"]]);
  const cards = await page.locator("svg .out").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(cards).toEqual(["1", "1", "1"]);
});

test("with motion, the sorting scene's exits draw in one after another, after the lens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/adad-al-turuq/sorting/");
  expect(await page.locator("svg .lens-pass").evaluate((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay]))).toEqual([["sorting-pass", 600]]);
  const delays = await page.locator("svg .exit").evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay])));
  expect(delays).toEqual([[["sorting-draw", 2200]], [["sorting-draw", 2500]], [["sorting-draw", 2800]]]);
  const last = () => page.locator("svg .exit").last().evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", "")));
  await expect.poll(last, { timeout: 6000 }).toBe(0);
  await expect.poll(() => page.locator("svg .out").last().evaluate((e) => getComputedStyle(e).opacity), { timeout: 6000 }).toBe("1");
});

test("reduced motion: the knowledge scene shows the lifts drawn and the all-three marker bright", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/adad-al-turuq/knowledge/");
  const lifts = await page.locator("svg .lift.draw").evaluateAll((els) => els.map((e) => [Number(getComputedStyle(e).strokeDashoffset.replace("px", "")), getComputedStyle(e).opacity]));
  expect(lifts).toEqual([[0, "1"], [0, "1"], [0, "1"]]);
  expect(await page.locator("svg .all-three").evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  // the other view's marker swap is instant: no transition runs
  await page.locator('.views button[data-v="nazari-only"]').click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test("with motion, the knowledge scene's lifts draw in one after another, then the all-three marker brightens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/adad-al-turuq/knowledge/");
  const delays = await page.locator("svg .lift.draw").evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay])));
  expect(delays).toEqual([[["knowledge-draw", 800]], [["knowledge-draw", 1200]], [["knowledge-draw", 1600]]]);
  expect(await page.locator("svg .all-three").evaluate((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay]))).toEqual([["knowledge-bright", 2100]]);
  const last = () => page.locator("svg .lift.draw").last().evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", "")));
  await expect.poll(last, { timeout: 6000 }).toBe(0);
  await expect.poll(() => page.locator("svg .all-three").evaluate((e) => getComputedStyle(e).opacity), { timeout: 6000 }).toBe("1");
  // the mutawātir marker slides down to the other view's place
  await page.locator('.views button[data-v="nazari-only"]').click();
  const y = () => page.locator("svg .mut").evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).f);
  await expect.poll(y, { timeout: 5000 }).toBe(154);
});

test("reduced motion: the lone scene shows every halo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/adad-al-turuq/lone/");
  expect(await page.locator("svg .alone").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity))).toEqual(Array(7).fill("1"));
});

test("with motion, the lone scene's halos fade in one after another, panel by panel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/adad-al-turuq/lone/");
  const delays = await page.locator("svg .alone").evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay])));
  expect(delays).toEqual([600, 800, 1000, 1200, 1400, 1600, 1800].map((d) => [["lone-halo", d]]));
  await expect.poll(() => page.locator("svg .alone").last().evaluate((e) => getComputedStyle(e).opacity), { timeout: 6000 }).toBe("1");
});

test("reduced motion: the hidden scene's met knot rests drawn", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/hidden/");
  expect(await page.locator("svg .knot").evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", "")))).toBe(0);
});

test("with motion, the hidden scene's met knot draws in once after a delay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/hidden/");
  const knot = page.locator("svg .knot");
  const anims = await knot.evaluate((e) => e.getAnimations().map((a) => ({
    name: (a as CSSAnimation).animationName,
    delay: a.effect?.getTiming().delay,
    iterations: a.effect?.getTiming().iterations,
  })));
  expect(anims).toContainEqual({ name: "hidden-knot", delay: 400, iterations: 1 });
  await expect.poll(() => knot.evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", ""))), { timeout: 5000 }).toBe(0);
});

test("reduced motion: the lying scene shows its clue cards, with the crosses and source lines drawn", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/lying/");
  const offset = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", ""))));
  expect(await page.locator("svg .clue").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity))).toEqual(["1", "1", "1"]);
  expect(await offset("svg .xdraw .xmark")).toEqual([0, 0, 0, 0]);
  expect(await offset("svg .feed")).toEqual([0, 0, 0]);
  // Ghiyāth's added words rest still
  expect(await page.locator("svg.lying .added").evaluate((e) => e.getAnimations().length)).toBe(0);
});

test("with motion, the lying scene's clue cards fade in one after another, then the crosses draw in", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/lying/");
  const timing = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay, a.effect?.getTiming().iterations])));
  expect(await timing("svg .clue")).toEqual([300, 600, 900].map((d) => [["lying-in", d, 1]]));
  expect(await timing("svg .xdraw .xmark")).toEqual([1300, 1500, 1700, 1900].map((d) => [["lying-draw", d, 1]]));
  expect(await timing("svg .feed")).toEqual(Array(3).fill([["lying-draw", 400, 1]]));
  // Ghiyāth's added words blink, as Matn's .added does
  expect(await timing("svg.lying .added")).toEqual([[["blink", 0, Infinity]]]);
  await expect.poll(() => page.locator("svg .xdraw .xmark").last().evaluate((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", ""))), { timeout: 5000 }).toBe(0);
});

test("reduced motion: the slips scene shows the lens at the end of its sweep, the ring drawn and the timeline at rest", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/slips/");
  const css = (sel: string, prop: string) => page.locator(sel).evaluateAll((els, p) => els.map((e) => getComputedStyle(e).getPropertyValue(p)), prop);
  // the lens rests where the sweep ends, past the gathered routes, which all show
  expect(await css("svg .lens", "transform")).toEqual(["none"]);
  expect(await css("svg .route", "opacity")).toEqual(["0.5", "0.5", "0.5"]);
  expect(await css("svg .lost", "opacity")).toEqual(["1"]);
  expect(await css("svg .lost", "transform")).toEqual(["none"]);
  // every cross on the record is drawn; the timeline's event star is at rest and nothing blinks
  expect(await page.locator("svg .xdraw .xmark").evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).strokeDashoffset.replace("px", ""))))).toEqual(Array(6).fill(0));
  expect(await css("svg .event", "transform")).toEqual(["none"]);
  expect(await page.locator("svg.slips").evaluate((svg) => svg.getAnimations({ subtree: true }).length)).toBe(0);
});

test("with motion, the slips scene's lens sweeps the routes in, then the ring closes and the timeline star pulses once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/slips/");
  const timing = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay, a.effect?.getTiming().iterations])));
  // the lens, ring and star don't fill forwards, so once finished they leave getAnimations() (the star after about
  // 1.4s, which a loaded run can pass before this reads it): check their declared animations instead
  const declared = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => {
    const s = getComputedStyle(e);
    return [s.animationName, s.animationDelay, s.animationIterationCount];
  }));
  expect(await declared("svg .lens")).toEqual([["slips-sweep", "0.6s", "1"]]);
  // each route brightens as the lens reaches it (lib/kit.ts sweepAt), and the ring closes after the sweep
  expect(await timing("svg .route")).toEqual([1150, 1960, 2780].map((d) => [["slips-light", d, 1]]));
  expect(await declared("svg .lost")).toEqual([["slips-ring", "3.1s", "1"]]);
  expect(await timing("svg .xdraw .xmark")).toEqual([400, 550, 700, 850, 1000, 1150].map((d) => [["slips-draw", d, 1]]));
  expect(await declared("svg .event")).toEqual([["slips-pulse", "0.6s", "1"]]);
  // the end state: the lens at rest and the ring in place
  await expect.poll(() => page.locator("svg .lens").evaluate((e) => getComputedStyle(e).transform), { timeout: 8000 }).toBe("none");
  await expect.poll(() => page.locator("svg .lost").evaluate((e) => getComputedStyle(e).opacity), { timeout: 8000 }).toBe("1");
  await expect.poll(() => page.locator("svg .route").last().evaluate((e) => getComputedStyle(e).opacity), { timeout: 8000 }).toBe("0.5");
});
