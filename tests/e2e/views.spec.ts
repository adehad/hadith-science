import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const scenes = parse(readFileSync("src/content/scenes.yaml", "utf8")) as { id: string; division: string; views?: { id: string }[] }[];
const routes = scenes.map((s) => `/${s.division}/${s.id}/`);

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
