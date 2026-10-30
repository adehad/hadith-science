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

// one scene stands for all: under reduce motion.css stops its CSS animations and transitions, and prefs.ts pauses its
// SMIL (the Companion's shimmer), which getAnimations() doesn't see
test("reduced motion: a scene runs no animations, CSS or SMIL", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/al-mardud/causes/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.getAnimations().map((a) => (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty))).toEqual([]);
  expect(await page.locator("svg animateTransform").count()).toBeGreaterThan(0);
  expect(await page.evaluate(() => [...document.querySelectorAll("svg")].every((s) => s.animationsPaused()))).toBe(true);
});

test("planets move with motion allowed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const a1 = await page.locator(".planet").first().getAttribute("data-angle");
  await expect.poll(() => page.locator(".planet").first().getAttribute("data-angle")).not.toBe(a1);
});

test("map layout: a portrait phone gets the nested list, its orbit map still; a landscape phone the orbit map", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const tree = page.locator(".tree");
  await expect(tree).toBeVisible();
  await expect(page.locator(".stage")).toBeHidden();
  const a1 = await angles(page);
  await page.waitForTimeout(800);
  expect(await angles(page)).toEqual(a1);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  await expect(page.locator(".stage svg.map")).toBeVisible();
  await expect(tree).toBeHidden();
});

// M5: with animations stopped (reduced motion, or the switch off) a scene must rest where its motion ends. Each scene is
// loaded with motion and each animated element's look read through its animations (at their start and a quarter,
// half and three quarters in, since a there-and-back pulse starts and ends alike) and again once every finite
// animation is finished; then the scene is loaded again under reduce and read again. The rest must equal the end, and
// some read on the way must differ from it, so an animation that has stopped moving shows up too. Loops never end, so
// they are left out.
test("every scene moves with motion, and rests under reduced motion where its motion ends", async ({ page }) => {
  test.setTimeout(60_000);
  const PROPS = ["opacity", "transform", "translate", "rotate", "scale", "stroke-dashoffset"];
  type Look = Record<string, Record<string, string>>;
  // each animated element, by its path from <main>, with the properties as read: at the given paths, or at the
  // finite animations' targets, on the way and at their end
  const look = (paths: string[] | null) => page.evaluate(([props, paths]) => {
    const main = document.querySelector("main")!;
    const path = (e: Element) => {
      const at: number[] = [];
      for (let n = e; n !== main; n = n.parentElement!) at.unshift([...n.parentElement!.children].indexOf(n));
      return at.join(".");
    };
    const byPath = (p: string) => p.split(".").reduce<Element | undefined>((n, i) => n?.children[+i], main);
    // one value per property, with every way of writing "no change" as none and numbers to 2 places
    const identity: Record<string, RegExp> = {
      transform: /^matrix\(1, 0, 0, 1, 0, 0\)$/, translate: /^0(px)?( 0(px)?){0,2}$/, rotate: /^0(deg)?$/, scale: /^1( 1){0,2}$/,
    };
    const norm = (prop: string, v: string) => {
      const r = v.replace(/-?\d*\.?\d+(e-?\d+)?/g, (n) => String(+(+n).toFixed(2)));
      return identity[prop]?.test(r) ? "none" : r;
    };
    const read = (els: Element[]) => Object.fromEntries(els.map((e) => {
      const cs = getComputedStyle(e);
      return [path(e), Object.fromEntries(props.map((p) => [p, norm(p, cs.getPropertyValue(p))]))];
    }));
    if (paths) return { rest: read(paths.map(byPath).filter((e): e is Element => !!e)) };
    const finite = document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
    const els = [...new Set(finite.map((a) => (a.effect as KeyframeEffect).target)
      .filter((t): t is Element => t instanceof Element && main.contains(t)))];
    const way = [0, 0.25, 0.5, 0.75].map((k) => {
      finite.forEach((a) => {
        a.pause();
        a.currentTime = (a.effect!.getTiming().delay ?? 0) + k * +(a.effect!.getComputedTiming().activeDuration ?? 0);
      });
      return read(els);
    });
    finite.forEach((a) => a.finish());
    return { way, end: read(els) };
  }, [PROPS, paths] as const) as Promise<{ way?: Look[]; end?: Look; rest?: Look }>;

  let compared = 0;
  for (const s of scenes) {
    const route = `/${s.division}/${s.id}/`;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const { way, end } = await look(null);
    const still = Object.keys(end!).filter((p) => way!.every((w) => JSON.stringify(w[p]) === JSON.stringify(end![p])));
    expect.soft(still, `${route}: animated but never moves`).toEqual([]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect.soft((await look(Object.keys(end!))).rest, route).toEqual(end);
    compared += Object.keys(end!).length;
  }
  expect(compared).toBeGreaterThan(0);
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

  // with motion on, the page is the one routes.spec.ts scans; off changes the switch's look
  test("axe finds nothing with motion off", async ({ page }) => {
    await page.goto("/al-mardud/innovation/");
    await page.locator("#motion-toggle").click();
    await expect(page.locator("#motion-toggle")).toHaveText("Motion: off", { useInnerText: true });
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
});

test.describe("motion switch without script", () => {
  test.use({ javaScriptEnabled: false });
  test("is hidden, like the other header controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#motion-toggle")).toBeHidden();
  });
});
