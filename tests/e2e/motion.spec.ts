import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
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

test("reduced motion: the changes scene shows every insert, the names and words as the book gives them, and still arrows", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/changes/");
  const css = (sel: string, prop: string) => page.locator(sel).evaluateAll((els, p) => els.map((e) => getComputedStyle(e).getPropertyValue(p)), prop);
  expect(await css("svg .ins", "opacity")).toEqual(Array(5).fill("1"));
  expect(await css("svg .swap-a, svg .swap-b, svg .swap-up, svg .swap-down", "transform")).toEqual(Array(4).fill("none"));
  expect(await css("svg .sway", "transform")).toEqual(["none"]);
  expect(await page.locator(".changes").evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
});

test("with motion, the changes scene's inserts fade in one after another, the names and words swap once, the wavering link sways and the letters blink", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/changes/");
  const timing = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay, a.effect?.getTiming().iterations])));
  expect(await timing("svg .ins")).toEqual([300, 600, 900, 1200, 1500].map((d) => [["changes-in", d, 1]]));
  expect(await timing("svg .swap-a")).toEqual([[["changes-swap-a", 600, 1]]]);
  expect(await timing("svg .swap-b")).toEqual([[["changes-swap-b", 600, 1]]]);
  expect(await timing("svg .swap-down")).toEqual([[["changes-swap-down", 600, 1]]]);
  expect(await timing("svg .swap-up")).toEqual([[["changes-swap-up", 600, 1]]]);
  expect(await timing("svg .sway")).toEqual([[["changes-sway", 0, Infinity]]]);
  // cell F's changing dots and vowels blink (the kit's shared blink loop)
  expect(await timing("#cell-letters .ldot, #cell-letters .vmark")).toEqual(Array(6).fill([["blink", 0, Infinity]]));
  // the swaps end where the reduced-motion page rests: no offset (both fill holds an identity matrix)
  await expect.poll(() => page.locator("svg .swap-up").evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).isIdentity), { timeout: 5000 }).toBe(true);
  await expect.poll(() => page.locator("svg .ins").last().evaluate((e) => getComputedStyle(e).opacity), { timeout: 5000 }).toBe("1");
});

test("reduced motion: the wording scene rests with the cuts made, the pieces apart, the output card in place and the star bright", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/wording/");
  const css = (sel: string, prop: string) => page.locator(sel).evaluateAll((els, p) => els.map((e) => getComputedStyle(e).getPropertyValue(p)), prop);
  expect(await css("svg .sblade, svg .apart, svg .through, svg .star", "transform")).toEqual(Array(4 + 4 + 1 + 1).fill("none"));
  expect(await css("svg .through, svg .star", "opacity")).toEqual(["1", "1"]);
  // the old words show only while the card passes the gate; at rest they are gone and the new ones shown
  expect(await css("svg .oldw", "opacity")).toEqual(["0"]);
  expect(await css("svg .neww, svg .nw:not(.off)", "opacity")).toEqual(["1", "1"]);
  expect(await page.locator(".wording").evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => !(a as CSSAnimation).animationName?.startsWith("flow")).length)).toBe(0);
});

test("with motion, the wording scene's scissors close once at each cut, the pieces part, the card passes the gate once and the star brightens once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/wording/");
  const timing = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay, a.effect?.getTiming().iterations, a.effect?.getTiming().fill])));
  expect(await timing("svg .sblade.a")).toEqual([600, 1400].map((d) => [["wording-close-a", d, 1, "both"]]));
  expect(await timing("svg .sblade.b")).toEqual([600, 1400].map((d) => [["wording-close-b", d, 1, "both"]]));
  expect(await timing("svg .apart")).toEqual([1000, 1000, 1800, 1800].map((d) => [["wording-apart", d, 1, "both"]]));
  expect(await timing("svg .through")).toEqual([[["wording-through", 400, 1, "both"]]]);
  expect(await timing("svg .oldw")).toEqual([[["wording-old", 400, 1, "both"]]]);
  expect(await timing("svg .neww")).toEqual([[["wording-new", 400, 1, "both"]]]);
  // the view groups inside it carry no animation of their own, so showing one never replays the fade
  expect(await timing("svg .nw")).toEqual([[], []]);
  expect(await timing("svg .star")).toEqual([[["wording-star", 2000, 1, "both"]]]);
  // they end where the reduced-motion page rests: the blades closed, the pieces apart, the card in place, the old
  // words gone and the star bright (both fill holds the end state)
  const settled = () => page.locator(".wording").evaluate((el) => {
    const id = (sel: string) => [...el.querySelectorAll(sel)].every((e) => new DOMMatrix(getComputedStyle(e).transform).isIdentity);
    const op = (sel: string) => getComputedStyle(el.querySelector(sel)!).opacity;
    return id(".sblade") && id(".apart") && id(".through") && id(".star") && op(".oldw") === "0" && op(".neww") === "1" && op(".star") === "1";
  });
  await expect.poll(settled, { timeout: 6000 }).toBe(true);
});

test("with motion, switching the wording scene's view shows the output card's new words at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/wording/");
  // let the first pass finish, then switch: the shown group's words must not fade in again
  await expect.poll(() => page.locator("svg .neww").evaluate((e) => getComputedStyle(e).opacity), { timeout: 6000 }).toBe("1");
  await page.waitForTimeout(300);
  // in the page, so a slow test runner's round trips don't count: click the view's button, then read the shown
  // words' effective opacity (the product of their own and every ancestor's, up to the svg) on each frame. Return
  // the lowest seen in the first 100ms, and the lowest from then until 900ms, when the old fade would be over
  const lows = (v: string) => page.evaluate((v) => new Promise<[number, number]>((done) => {
    const shown = () => {
      let o = 1;
      for (let n: Element | null = document.querySelector("svg .nw:not(.off)"); n && n.tagName !== "svg"; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
      return o;
    };
    document.querySelector<HTMLButtonElement>(`.views button[data-v="${v}"]`)!.click();
    const t0 = performance.now();
    let early = 1, late = 1;
    const tick = () => {
      const t = performance.now() - t0;
      if (t < 100) early = Math.min(early, shown()); else late = Math.min(late, shown());
      if (t < 900) requestAnimationFrame(tick); else done([early, late]);
    };
    tick();
  }), v);
  for (const v of ["single-words", "most"]) expect(await lows(v)).toEqual([1, 1]);
});

test("reduced motion: the identity scene rests with one man among his names, the six faint figures not shown", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/identity/");
  const css = (sel: string, prop: string) => page.locator(sel).evaluateAll((els, p) => els.map((e) => getComputedStyle(e).getPropertyValue(p)), prop);
  expect(await css("svg .merge", "opacity")).toEqual(Array(6).fill("0"));
  expect(await css("svg .merge", "transform")).toEqual(Array(6).fill("none"));
  expect(await css("svg .one", "opacity")).toEqual(["1"]);
  expect(await css("svg .tie", "opacity")).toEqual(Array(6).fill("1"));
  expect(await page.locator(".identity").evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
});

test("with motion, the identity scene's six figures slide together once and fade as the one man and his ties appear", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/identity/");
  const timing = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay, a.effect?.getTiming().iterations, a.effect?.getTiming().fill])));
  expect(await timing("svg .merge")).toEqual(Array(6).fill([["identity-merge", 800, 1, "both"]]));
  expect(await timing("svg .one")).toEqual([[["identity-one", 2000, 1, "both"]]]);
  expect(await timing("svg .tie")).toEqual(Array(6).fill([["identity-one", 2300, 1, "both"]]));
  // each faint figure starts away from the one man: paused at its first frame, its transform is an offset
  const start = await page.locator("svg .merge").first().evaluate((e) => {
    const a = e.getAnimations()[0];
    a.pause();
    a.currentTime = 0;
    const id = new DOMMatrix(getComputedStyle(e).transform).isIdentity;
    a.finish(); // let it end, for the settled check below
    return id;
  });
  expect(start).toBe(false);
  // cell B's arrows flow down
  expect(await timing("#cell-one-student path.flow")).toEqual(Array(5).fill([["flow", 0, Infinity, "none"]]));
  // they end where the reduced-motion page rests: the faint figures gone and in place, the man and his ties shown
  const settled = () => page.locator(".identity").evaluate((el) => {
    const all = (sel: string, ok: (s: CSSStyleDeclaration) => boolean) => [...el.querySelectorAll(sel)].every((e) => ok(getComputedStyle(e)));
    return all(".merge", (s) => s.opacity === "0" && new DOMMatrix(s.transform).isIdentity) && all(".one, .tie", (s) => s.opacity === "1");
  });
  await expect.poll(settled, { timeout: 6000 }).toBe(true);
});

test("with motion, the innovation scene's path arrows flow, in every view, and nothing else moves", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/innovation/");
  // each shown arrow flows without end, top to bottom; every animation in the scene is one of them
  const flows = () => page.locator("svg.innovation").evaluate((svg) => {
    const shown = [...svg.querySelectorAll("path.flow")].filter((p) => !p.closest(".off"));
    const anims = svg.getAnimations({ subtree: true }) as CSSAnimation[];
    return {
      shownFlow: shown.every((p) => p.getAnimations().some((a) => (a as CSSAnimation).animationName === "flow" && a.effect?.getTiming().iterations === Infinity)),
      count: shown.length,
      others: anims.filter((a) => a.animationName !== "flow").map((a) => a.animationName),
    };
  });
  // panel 1's arrow, then each view's paths: Ibn Ḥajar's 3 + 5, unless-lying's 3 + 3, reject's 1 + 1
  await expect.poll(flows).toEqual({ shownFlow: true, count: 1 + 3 + 5, others: [] });
  await page.locator('.views button[data-v="unless-lying"]').click();
  await expect.poll(flows).toEqual({ shownFlow: true, count: 1 + 3 + 3, others: [] });
  await page.locator('.views button[data-v="reject"]').click();
  await expect.poll(flows).toEqual({ shownFlow: true, count: 1 + 1 + 1, others: [] });
});

test("reduced motion: the causes scene rests with every rung shown", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/causes/");
  const op = await page.locator("svg .rung-g").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(op).toEqual(Array(10).fill("1"));
  expect(await page.locator(".causes").evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
});

test("with motion, the causes scene's rungs fade in from the top once, one after another, and its chain arrows flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/al-mardud/causes/");
  const timing = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getAnimations().map((a) => [(a as CSSAnimation).animationName, a.effect?.getTiming().delay, a.effect?.getTiming().iterations, a.effect?.getTiming().fill])));
  expect(await timing("svg .rung-g")).toEqual([0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map((d) => [["causes-in", d, 1, "both"]]));
  expect(await timing("#cell-omission path.flow, #cell-omission path.skip")).toEqual(Array(12).fill([["flow", 0, Infinity, "none"]]));
  // each rung starts hidden: the last, paused at its first frame, is transparent
  const start = await page.locator("svg .rung-g").last().evaluate((e) => {
    const a = e.getAnimations()[0];
    a.pause();
    a.currentTime = 0;
    const o = getComputedStyle(e).opacity;
    a.finish();
    return o;
  });
  expect(start).toBe("0");
  // and they end where the reduced-motion page rests
  await expect.poll(() => page.locator("svg .rung-g").evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === "1")), { timeout: 5000 }).toBe(true);
});

test.describe("motion switch (WCAG 2.2.2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  const running = (page: Page) => page.evaluate(() => document.getAnimations().length);
  const smilPaused = (page: Page) => page.evaluate(() => [...document.querySelectorAll("svg")].every((s) => s.animationsPaused()));

  test("turning motion off on a scene page stops every animation, CSS and SMIL", async ({ page }) => {
    await page.goto("/al-mardud/causes/");
    const toggle = page.locator("#motion-toggle");
    await expect(toggle).toHaveText("Motion: on", { useInnerText: true });
    // the name stays put; aria-pressed carries the state
    await expect(toggle).toHaveAccessibleName("Motion");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(await running(page)).toBeGreaterThan(0);
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
    await expect(toggle).toHaveText("Motion: off", { useInnerText: true });
    await expect(toggle).toHaveAccessibleName("Motion");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect.poll(() => running(page)).toBe(0);
    expect(await smilPaused(page)).toBe(true);
    // and on again
    await toggle.click();
    await expect.poll(() => running(page)).toBeGreaterThan(0);
    expect(await smilPaused(page)).toBe(false);
  });

  test("turning motion off stops the starfield and the orbits", async ({ page }) => {
    await page.goto("/");
    const a0 = await angles(page);
    await expect.poll(() => angles(page)).not.toEqual(a0);
    await page.locator("#motion-toggle").click();
    // the next frame may still be in flight
    await page.waitForTimeout(100);
    const stars = () => page.locator("canvas.stars").evaluate((c: HTMLCanvasElement) => c.toDataURL());
    const [a1, s1] = [await angles(page), await stars()];
    await page.waitForTimeout(1000);
    expect(await angles(page)).toEqual(a1);
    expect(await stars()).toBe(s1);
  });

  test("the choice survives a reload, and is set before paint", async ({ page }) => {
    await page.goto("/al-mardud/innovation/");
    await page.locator("#motion-toggle").click();
    expect(await page.evaluate(() => localStorage.getItem("nuzhah-motion"))).toBe("off");
    // what the attribute was at the first frame, before anything painted
    await page.addInitScript(() => requestAnimationFrame(() => ((window as unknown as { first?: string }).first = document.documentElement.dataset.motion)));
    await page.reload();
    await expect.poll(() => page.evaluate(() => (window as unknown as { first?: string }).first)).toBe("off");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
    await expect(page.locator("#motion-toggle")).toHaveText("Motion: off", { useInnerText: true });
    expect(await running(page)).toBe(0);
    expect(await smilPaused(page)).toBe(true);
    await page.locator("#motion-toggle").click();
    await page.reload();
    await expect(page.locator("html")).not.toHaveAttribute("data-motion");
    await expect(page.locator("#motion-toggle")).toHaveText("Motion: on", { useInnerText: true });
  });

  test("with motion off, a navigation skips its view transition", async ({ page }) => {
    // record each page's incoming view transition: a skipped one's ready promise rejects
    await page.addInitScript(() => {
      addEventListener("pagereveal", (e) => {
        const vt = (e as Event & { viewTransition?: ViewTransition }).viewTransition;
        (window as unknown as { vt: string }).vt = vt ? "pending" : "none";
        vt?.ready.then(() => ((window as unknown as { vt: string }).vt = "ran"), () => ((window as unknown as { vt: string }).vt = "skipped"));
      });
    });
    const vt = () => page.evaluate(() => (window as unknown as { vt: string }).vt);
    // with motion on, the transition runs. Under a loaded parallel run the browser now and then skips one with no
    // pagereveal transition at all, whatever the switch says, so this control gets a few tries
    await expect(async () => {
      await page.goto("/al-mardud/");
      await page.locator('a[href$="/al-mardud/causes/"]').first().click();
      await page.waitForURL(/\/al-mardud\/causes\/$/);
      await expect.poll(vt, { timeout: 2000 }).toBe("ran");
    }).toPass({ timeout: 20000 });
    await page.locator("#motion-toggle").click();
    await page.goBack();
    await page.waitForURL(/\/al-mardud\/$/);
    await page.locator('a[href$="/al-mardud/causes/"]').first().click();
    await page.waitForURL(/\/al-mardud\/causes\/$/);
    // skipped on the way out (pageswap), so none reaches the new page, or skipped on arrival (pagereveal)
    await expect.poll(vt).toMatch(/^(none|skipped)$/);
  });

  test("with the system asking for reduced motion, the switch reads off, says why and ignores clicks", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const toggle = page.locator("#motion-toggle");
    // aria-disabled rather than disabled, so it stays in the tab order and keyboard users hear why
    await expect(toggle).toHaveAttribute("aria-disabled", "true");
    await expect(toggle).not.toHaveAttribute("disabled");
    await expect(toggle).toHaveText("Motion: off (system setting)", { useInnerText: true });
    await expect(toggle).toHaveAccessibleName("Motion (system setting)");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await toggle.press("Enter");
    // Playwright treats aria-disabled as disabled, so the click is forced
    await toggle.click({ force: true });
    await expect(page.locator("html")).not.toHaveAttribute("data-motion");
    expect(await page.evaluate(() => localStorage.getItem("nuzhah-motion"))).toBeNull();
    // and it comes back when the system setting is turned off
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(toggle).not.toHaveAttribute("aria-disabled");
    await expect(toggle).toHaveText("Motion: on", { useInnerText: true });
    await expect(toggle).toHaveAccessibleName("Motion");
  });

  test("before prefs.ts runs, CSS already shows the switch off, unpressed", async ({ page }) => {
    // hold back every script file, so only the inline head script runs: it sets data-motion from storage
    await page.addInitScript(() => localStorage.setItem("nuzhah-motion", "off"));
    await page.route(/\.js$/, (r) => r.abort());
    await page.goto("/al-mardud/causes/");
    const toggle = page.locator("#motion-toggle");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
    await expect(toggle).toHaveText("Motion: off", { useInnerText: true });
    expect(await toggle.evaluate((b) => getComputedStyle(b).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
  });

  test("a choice made in another tab applies here", async ({ page, context }) => {
    await page.goto("/");
    const other = await context.newPage();
    await other.emulateMedia({ reducedMotion: "no-preference" });
    await other.goto("/terms/");
    await other.locator("#motion-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
    await expect(page.locator("#motion-toggle")).toHaveAttribute("aria-pressed", "false");
    await other.locator("#motion-toggle").click();
    await expect(page.locator("html")).not.toHaveAttribute("data-motion");
    await expect(page.locator("#motion-toggle")).toHaveAttribute("aria-pressed", "true");
  });

  for (const state of ["on", "off"]) {
    test(`axe finds nothing with motion ${state}`, async ({ page }) => {
      await page.goto("/al-mardud/innovation/");
      if (state === "off") await page.locator("#motion-toggle").click();
      await expect(page.locator("#motion-toggle")).toHaveText(`Motion: ${state}`, { useInnerText: true });
      const axe = await new AxeBuilder({ page }).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("motion switch without script", () => {
  test.use({ javaScriptEnabled: false });
  test("is hidden, like the other header controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#motion-toggle")).toBeHidden();
  });
});
