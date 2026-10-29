import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

// each test loads its own page in its own context, so they run in parallel across workers
test.describe.configure({ mode: "parallel" });

// routes come from the built sitemap (in the snapshot of dist this run serves, playwright.config.ts), so new pages are
// covered automatically; /t/ pages are redirects
const dist = process.env.E2E_DIST ?? "dist";
const sitemaps = readdirSync(dist).filter((f) => f.startsWith("sitemap-") && f !== "sitemap-index.xml");
const routes = sitemaps
  .flatMap((f) => [...readFileSync(`${dist}/${f}`, "utf8").matchAll(/<loc>[^<]*?\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]))
  .filter((r) => !r.startsWith("/t/") && r.endsWith("/"));

// every view a scene offers besides its default (the first), which the build doesn't show
const scenes = parse(readFileSync("src/content/scenes.yaml", "utf8")) as { id: string; division: string; views?: { id: string }[] }[];
const sceneRoutes = new Set(scenes.map((s) => `/${s.division}/${s.id}/`));
const otherViews = scenes.flatMap((s) => (s.views ?? []).slice(1).map((v) => ({ route: `/${s.division}/${s.id}/`, view: v.id })));

// What a page shows, checked in the page, so it covers every route without a list to keep:
// - every term trigger has a size, so a reader can find and press it;
// - every shown SVG text, and every tspan inked differently from its text, reaches 4.5:1 (3:1 when large) against
//   what is painted under its centre: the fills before it in the same svg that hold that point, over the background
//   behind the svg, or its halo where it has one (WCAG 1.4.3). Text this can't measure (a gradient or pattern fill,
//   on it or under it) is listed as unmeasured, so it fails rather than passes unseen;
// - no shown Labels-mode label overlaps another text.
// The backdrop is a model, not a render. It misses: opacity on HTML ancestors of the svg; shapes painted after the
// text that cover it; lines, polylines, <use> and <image> under the text; clip paths that cut a backdrop shape; and a
// halo under a faded ancestor (the halo is composited at its own opacity, not the ancestor's).
const audit = (page: Page) => page.evaluate(() => {
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  type RGB = [number, number, number];
  const rgba = (c: string): [number, number, number, number] | null => {
    if (!c || c === "none" || c.startsWith("url(")) return null;
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = "#000";
    cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = [...cv.getImageData(0, 0, 1, 1).data].map((x) => x / 255);
    return [r, g, b, a];
  };
  const over = (top: [number, number, number, number], alpha: number, under: RGB): RGB =>
    under.map((u, i) => top[i] * top[3] * alpha + u * (1 - top[3] * alpha)) as RGB;
  const lum = (c: RGB) => {
    const [r, g, b] = c.map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: RGB, b: RGB) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  // the element's opacity times its ancestors' up to its svg (0 for anything not rendered)
  const opacity = (e: Element) => {
    let o = 1;
    for (let n: Element | null = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden") return 0;
      o *= +cs.opacity;
      if (n instanceof SVGSVGElement && !(n.parentElement instanceof SVGElement)) break;
    }
    return o;
  };
  const shown = (e: Element) => !e.closest("defs, marker, symbol, pattern, clipPath, mask, .off") && opacity(e) > 0;
  const rect = (e: Element) => e.getBoundingClientRect();
  const sized = (e: Element) => { const r = rect(e); return r.width > 0 && r.height > 0; };
  const name = (e: Element) => (e.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
  const where = (e: Element) => e.closest("svg[aria-label]")?.getAttribute("aria-label")?.slice(0, 30) ?? "svg";

  const unsized = [...document.querySelectorAll("[data-term-json]")]
    .filter((t) => !t.closest(".off") && !sized(t)).map((t) => t.getAttribute("data-term"));

  // the colour behind an svg: its own background or its nearest ancestor's, composited down to an opaque one
  const backdrop = (svg: Element): RGB => {
    const layers: [number, number, number, number][] = [];
    for (let n: Element | null = svg; n; n = n.parentElement) {
      const c = rgba(getComputedStyle(n).backgroundColor);
      if (c && c[3] > 0) { layers.unshift(c); if (c[3] === 1) break; }
    }
    return layers.reduce<RGB>((under, c) => over(c, 1, under), [1, 1, 1]);
  };

  const lowContrast: string[] = [];
  const unmeasured: string[] = [];
  let measured = 0;
  const texts = [...document.querySelectorAll("main svg text")].filter((t) => shown(t) && sized(t));
  const fill = (e: Element) => getComputedStyle(e).fill;
  const inked = [...texts, ...texts.flatMap((t) => [...t.querySelectorAll("tspan")].filter((s) => sized(s) && fill(s) !== fill(s.closest("text")!)))];
  // text a scene fades on purpose so it isn't read (rows a search has ruled out) is incidental, which WCAG 1.4.3
  // exempts; only where it is faint enough to read as faded
  const read = inked.filter((t) => !(t.closest("[data-incidental]") && opacity(t) < 0.5));
  const shapes = new Map<Element, Element[]>();
  for (const t of read) {
    const svg = t.closest("main svg:not(svg svg)") ?? t.closest("svg")!;
    if (!shapes.has(svg)) {
      shapes.set(svg, [...svg.querySelectorAll("rect, circle, ellipse, path, polygon")]
        .filter((s) => shown(s) && sized(s) && (fill(s).startsWith("url(") || rgba(fill(s))?.[3])));
    }
    const cs = getComputedStyle(t);
    const ink = rgba(cs.fill);
    if (!ink) { if (cs.fill.startsWith("url(")) unmeasured.push(`${where(t)} › "${name(t)}" has a ${cs.fill} fill`); continue; }
    const r = rect(t);
    const [x, y] = [r.left + r.width / 2, r.top + r.height / 2];
    let bg = backdrop(svg);
    let under = "";
    for (const s of shapes.get(svg)!) {
      if (!(s.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
      const b = rect(s);
      if (x < b.left || x > b.right || y < b.top || y > b.bottom) continue;
      const g = s as SVGGeometryElement;
      if (!g.isPointInFill(new DOMPoint(x, y).matrixTransform(g.getScreenCTM()!.inverse()))) continue;
      const c = rgba(fill(s));
      if (!c) { under = fill(s); break; }
      bg = over(c, +getComputedStyle(s).fillOpacity * opacity(s), bg);
    }
    if (under) { unmeasured.push(`${where(t)} › "${name(t)}" sits on a ${under} fill`); continue; }
    measured++;
    // a tspan has no transform of its own: its text's sets its size
    const scale = (t.closest("text") as SVGGraphicsElement).getScreenCTM()!.a;
    const halo = rgba(cs.stroke);
    if (halo && cs.paintOrder.startsWith("stroke") && parseFloat(cs.strokeWidth) * scale >= 2) bg = over(halo, +cs.strokeOpacity, bg);
    const px = parseFloat(cs.fontSize) * scale;
    const large = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700);
    const c = ratio(over(ink, +cs.fillOpacity * opacity(t), bg), bg);
    if (c < (large ? 3 : 4.5)) lowContrast.push(`${where(t)} › "${name(t)}" ${c.toFixed(2)}:1`);
  }

  const overlaps: string[] = [];
  // a text box spans the font's ascent and descent, so lines set close touch at their edges; an eighth off the top
  // and bottom leaves the letters
  const ink = (e: Element) => { const r = rect(e); return { left: r.left, right: r.right, top: r.top + r.height / 8, bottom: r.bottom - r.height / 8 }; };
  for (const l of texts.filter((t) => t.classList.contains("mode-label"))) {
    const a = ink(l);
    for (const t of texts) {
      if (t === l || t.contains(l) || l.contains(t)) continue;
      const b = ink(t);
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (w > 1 && h > 1) overlaps.push(`"${name(l)}" over "${name(t)}"`);
    }
  }
  return { unsized, lowContrast, overlaps, unmeasured, measured };
});

async function expectNoAxeViolations(page: Page) {
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

async function expectClean(page: Page, url: string) {
  const { measured, ...found } = await audit(page);
  expect(found).toEqual({ unsized: [], lowContrast: [], overlaps: [], unmeasured: [] });
  // a scene's figure is measured, so a markup change can't leave the contrast pass finding nothing
  if (sceneRoutes.has(new URL(url, "http://x").pathname)) expect(measured).toBeGreaterThan(0);
}

async function smoke(page: Page, url: string, theme: "light" | "dark", view?: string) {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
  await page.goto(url);
  await expect(page.locator("main")).toBeVisible();
  // the scan is of the view asked for
  if (view) await expect(page.locator(`.views button[data-v="${view}"]`)).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => document.fonts.ready);
  expect(errors).toEqual([]);
  await expectNoAxeViolations(page);
  await expectClean(page, url);
  // a figure scene's Labels mode puts a label by each figure instead of the legend
  const labels = page.locator('.viewtoggle button[data-mode="labels"]');
  if (await labels.count()) {
    await labels.click();
    await expect(page.locator(".mode-label").first()).toBeVisible();
    await expectNoAxeViolations(page);
    await expectClean(page, url);
  }
}

test("sitemap lists the map, divisions, scenes, narrators and glossary", () => {
  expect(routes).toEqual(expect.arrayContaining(["/", "/narrators/", "/terms/", "/al-mardud/breaks/"]));
  // map, 8 divisions, narrators and glossary, plus the 5 phase 2 scenes
  expect(routes.length).toBeGreaterThanOrEqual(16);
});

for (const theme of ["light", "dark"] as const) {
  for (const route of [...routes, "/404.html"]) {
    test(`${route} renders cleanly (${theme})`, ({ page }) => smoke(page, route, theme));
  }
}

for (const theme of ["light", "dark"] as const) {
  for (const { route, view } of otherViews) {
    test(`${route}?view=${view} renders cleanly (${theme})`, ({ page }) => smoke(page, `${route}?view=${view}`, theme, view));
  }
}
