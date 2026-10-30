import { test, type Page } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// README screenshots (docs/screenshots/), regenerated with `bun run screenshots` after a build. Not a test: it writes
// one picture per concept, light theme only. Stills rest in their reduced-motion end state; map.png, routes.png and
// opposition.png are animated PNGs, built from frames shot at fixed times and assembled by ffmpeg.
const OUT = "docs/screenshots";
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const FRAME_MS = 100; // 10 fps
const APNG_WIDTH = 800;

type Win = { __frame: typeof requestAnimationFrame; __advance: (ms: number) => void };

// so that an unchanged build gives byte-identical files:
// - the starfield (islands/stars.ts) places its stars with Math.random, which is seeded here
// - CSS animations are held paused from the first paint and only ever moved by seek()
// - the browser's own requestAnimationFrame is kept as __frame, for shoot() to wait on even where stepFrames replaces it
function steady() {
  (window as unknown as Win).__frame = requestAnimationFrame.bind(window);
  let s = 0x9e3779b9;
  Math.random = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const hold = document.createElement("style");
  hold.textContent = "*,*::before,*::after{animation-play-state:paused!important}";
  // the script runs before the document has an element to hold the style
  new MutationObserver((_, watch) => {
    if (!document.documentElement) return;
    document.documentElement.append(hold);
    watch.disconnect();
  }).observe(document, { childList: true });
}
test.beforeEach(async ({ context }) => { await context.addInitScript(steady); });
// the animated PNGs shoot a frame at a time
test.describe.configure({ timeout: 180_000 });

// requestAnimationFrame on a clock the spec steps with __advance(ms), so script-driven motion (the map's orbits) moves
// by exactly the same amount in every run
function stepFrames() {
  const w = window as unknown as Win;
  w.__frame ??= requestAnimationFrame.bind(window);
  let now = 0, id = 0, queue: [number, FrameRequestCallback][] = [];
  window.requestAnimationFrame = (cb) => { queue.push([++id, cb]); return id; };
  window.cancelAnimationFrame = (h) => { queue = queue.filter(([i]) => i !== h); };
  w.__advance = (ms) => {
    const end = now + ms;
    while (now < end) {
      now = Math.min(end, now + 16);
      const q = queue;
      queue = [];
      q.forEach(([, cb]) => cb(now));
    }
  };
}

function ffmpeg(args: string[]) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { encoding: "utf8" });
  if (r.error) throw new Error("screenshots: ffmpeg is needed to assemble the animated PNGs and was not found on PATH");
  if (r.status !== 0) throw new Error(`screenshots: ffmpeg failed\n${r.stderr}`);
}
// fail before shooting any frames if ffmpeg is missing
const needFfmpeg = () => ffmpeg(["-version"]);

// frames f000.png… in each directory into an animated PNG that loops forever: scaled to APNG_WIDTH and reduced to one
// shared 256-colour palette without dithering, which keeps the files small; `combine` joins the scaled inputs [s0], [s1]…
function assemble(dirs: string[], out: string, combine = "[s0]null") {
  const inputs = dirs.flatMap((d) => ["-framerate", String(1000 / FRAME_MS), "-i", join(d, "f%03d.png")]);
  const scaled = dirs.map((_, k) => `[${k}]scale=${APNG_WIDTH}:-2:flags=lanczos[s${k}]`).join(";");
  const graph = `${scaled};${combine},split[a][b];[a]palettegen=stats_mode=full[p];[b][p]paletteuse=dither=none`;
  ffmpeg([...inputs, "-filter_complex", graph, "-plays", "0", "-f", "apng", out]);
}
const frame = (dir: string, i: number) => join(dir, `f${String(i).padStart(3, "0")}.png`);

type Box = { x: number; y: number; width: number; height: number };
// the union of the elements' boxes in page coordinates, padded
async function boxOf(page: Page, selectors: string[], pad = 16): Promise<Box> {
  return page.evaluate(({ selectors, pad }) => {
    const rs = selectors.flatMap((s) => [...document.querySelectorAll(s)].map((e) => e.getBoundingClientRect()));
    const x0 = Math.min(...rs.map((r) => r.left)) - pad, y0 = Math.min(...rs.map((r) => r.top)) - pad;
    const x1 = Math.max(...rs.map((r) => r.right)) + pad, y1 = Math.max(...rs.map((r) => r.bottom)) + pad;
    const x = Math.max(0, Math.floor(x0 + scrollX)), y = Math.max(0, Math.floor(y0 + scrollY));
    return { x, y, width: Math.ceil(x1 + scrollX) - x, height: Math.ceil(y1 + scrollY) - y };
  }, { selectors, pad });
}
// a scene's title block (eyebrow, title, lede, view switch) and its diagram with the legend under it
const SCENE = ["main div:has(> h1)", ".stage-wrap"];

// `tall` grows the viewport to the whole page, so a crop below the first screen is shot without fullPage, which
// resizes the viewport for every capture
async function open(page: Page, path: string, { viewport = DESKTOP, motion = false, theme = "light" as "light" | "dark", tall = false } = {}) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ colorScheme: theme, reducedMotion: motion ? "no-preference" : "reduce" });
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  if (tall) await page.setViewportSize({ ...viewport, height: await page.evaluate(() => document.documentElement.scrollHeight) });
}

// pin every CSS animation and SMIL timeline to t ms after load
async function seek(page: Page, t: number) {
  await page.evaluate((t) => {
    document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; });
    document.querySelectorAll("svg").forEach((s) => { s.pauseAnimations(); s.setCurrentTime(t / 1000); });
  }, t);
}
// the end of the last finite CSS animation, in ms
const settleTime = (page: Page) => page.evaluate(() => Math.max(0, ...document.getAnimations()
  .map((a) => a.effect?.getComputedTiming().endTime).filter((e): e is number => typeof e === "number" && isFinite(e))));

// a screenshot of what was last pinned: a capture can now and then still show the frame before a seek, so wait two real
// frames and shoot until two captures in a row agree
async function shoot(page: Page, path: string, opts: { clip?: Box } = {}) {
  await page.evaluate(async () => { for (let i = 0; i < 2; i++) await new Promise((r) => (window as unknown as Win).__frame(r)); });
  let last = await page.screenshot(opts), next = await page.screenshot(opts);
  while (!last.equals(next)) [last, next] = [next, await page.screenshot(opts)];
  writeFileSync(path, next);
}

async function still(page: Page, name: string, path: string, crop?: string[]) {
  await open(page, path, { tall: true });
  await seek(page, 0);
  await shoot(page, `${OUT}/${name}.png`, { clip: crop && await boxOf(page, crop) });
}

// a scene's diagram and legend as an animated PNG: `count` frames from `from` ms, or by default its load-in and then
// a second of its looping motion
async function animated(page: Page, name: string, path: string, { from = 0, count = 0 } = {}) {
  needFfmpeg();
  await open(page, path, { motion: true, tall: true });
  await seek(page, 0);
  const clip = await boxOf(page, [".stage-wrap"]);
  const n = count || Math.floor(((await settleTime(page)) + 1000) / FRAME_MS) + 1;
  const dir = mkdtempSync(join(tmpdir(), `shot-${name}-`));
  try {
    for (let i = 0; i < n; i++) {
      await seek(page, from + i * FRAME_MS);
      await shoot(page, frame(dir, i), { clip });
    }
    assemble([dir], `${OUT}/${name}.png`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("map", async ({ page }) => {
  // the orbits are moved by requestAnimationFrame (islands/orbit.ts) on the stepped clock; the same four seconds are
  // shot in light and in dark and joined on the diagonal from top-right to bottom-left, light above it. The orbits
  // take 40 s and more to go round, so the loop restarts rather than closing up
  needFfmpeg();
  await page.addInitScript(stepFrames);
  const dir = mkdtempSync(join(tmpdir(), "shot-map-"));
  const dirs = ["light", "dark"].map((theme) => join(dir, theme));
  try {
    for (const [k, theme] of (["light", "dark"] as const).entries()) {
      mkdirSync(dirs[k]);
      await open(page, "/", { motion: true, theme, tall: true });
      const clip = await boxOf(page, [".stage"]);
      for (let i = 0; i * FRAME_MS < 4000; i++) {
        if (i) await page.evaluate((ms) => (window as unknown as Win).__advance(ms), FRAME_MS);
        await seek(page, i * FRAME_MS);
        await shoot(page, frame(dirs[k], i), { clip });
      }
    }
    // a pixel's share of light falls from 1 to 0 across one pixel at the diagonal, so the edge is antialiased
    const k = "clip(0.5-(X*H+Y*W-W*H)/hypot(W\\,H)\\,0\\,1)";
    assemble(dirs, `${OUT}/map.png`, `[s0]format=gbrp[a];[s1]format=gbrp[b];[a][b]blend=all_expr=A*${k}+B*(1-${k}),format=rgb24`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("narrators", async ({ page }) => { await still(page, "narrators", "/narrators/", [...SCENE, ".stage"]); });
test("report", async ({ page }) => { await still(page, "report", "/adad-al-turuq/report/", SCENE); });
// routes has no load-in, only the flowing arrows (1.1 s a cycle) and the Companions' shimmer (3.2 s, still after 1.92 s):
// three flow cycles from 2 s start and end inside the shimmer's still stretch, so the loop has no seam
test("routes", async ({ page }) => { await animated(page, "routes", "/adad-al-turuq/routes/", { from: 2000, count: 33 }); });
test("grades", async ({ page }) => { await still(page, "grades", "/al-maqbul/grades/", SCENE); });
test("opposition", async ({ page }) => { await animated(page, "opposition", "/al-maqbul/opposition/"); });
test("causes", async ({ page }) => { await still(page, "causes", "/al-mardud/causes/", SCENE); });
test("breaks", async ({ page }) => { await still(page, "breaks", "/al-mardud/breaks/", SCENE); });
test("delivery", async ({ page }) => { await still(page, "delivery", "/siyagh-al-ada/delivery/", SCENE); });
test("names", async ({ page }) => { await still(page, "names", "/al-asma/names/", SCENE); });

test("popover", async ({ page }) => {
  // the popover is placed inside the viewport, which holds the whole page
  await open(page, "/al-maqbul/grades/", { tall: true });
  await seek(page, 0);
  await page.locator('[data-term="sahih-li-dhatihi"]').first().click();
  await page.locator("#term-pop").waitFor({ state: "visible" });
  await shoot(page, `${OUT}/popover.png`, { clip: await boxOf(page, [".stage", "#term-pop"], 8) });
});

test("phone", async ({ page }) => {
  // scrolled to the diagram, so the first carousel panel and its dots are in the picture, and cut off below it, before
  // the legend that the screen would otherwise show half of
  await open(page, "/adad-al-turuq/routes/", { viewport: PHONE });
  await seek(page, 0);
  const bottom = await page.locator(".stage").evaluate((e) => {
    scrollTo({ top: e.getBoundingClientRect().top + scrollY - 16, behavior: "instant" });
    return Math.ceil(e.getBoundingClientRect().bottom) + 8;
  });
  await shoot(page, `${OUT}/phone.png`, { clip: { x: 0, y: 0, width: PHONE.width, height: Math.min(bottom, PHONE.height) } });
});
