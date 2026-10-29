// shared reader for the dist checks: the built pages (parsed once per test file) and the content they come from.
// Run after `bun run build`; DIST and BASE pick another build (e.g. DIST=dist-base BASE=/hadith-science).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parseHTML } from "linkedom";
import { parse } from "yaml";
import { normaliseBase } from "../../src/lib/url";

export const DIST = process.env.DIST ?? "dist";
export const BASE = normaliseBase(process.env.BASE ?? "/");

if (!existsSync(join(DIST, "index.html"))) throw new Error(`no build in ${DIST}; run \`bun run build\` first`);

export interface Term { id: string; division: string; scene?: string; view?: string }
export interface Scene { id: string; division: string; views?: { id: string }[] }
const yaml = <T>(f: string) => parse(readFileSync(`src/content/${f}`, "utf8")) as T;
export const terms = yaml<Term[]>("terms.yaml");
export const scenes = yaml<Scene[]>("scenes.yaml");

/** every built .html file, as a site path without the base: "", "terms/", "404.html", … */
export const pagePaths: string[] = [];
(function walk(d: string) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) pagePaths.push(relative(DIST, p).split("\\").join("/").replace(/(^|\/)index\.html$/, "$1"));
  }
})(DIST);

const cache = new Map<string, Document>();
/** the parsed page at a site path ("al-mardud/causes/"), or null when the build has no such file */
export function page(path: string): Document | null {
  const file = join(DIST, path === "" || path.endsWith("/") ? `${path}index.html` : path);
  if (!existsSync(file) || !statSync(file).isFile()) return null;
  if (!cache.has(path)) cache.set(path, parseHTML(readFileSync(file, "utf8")).document);
  return cache.get(path)!;
}

/** a site-relative path (no base) and hash for an href found on the page at `from`, or null when it leaves the site */
export function resolve(raw: string, from: string): { path: string; hash: string } | null {
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(raw)) return null; // absolute URL or another scheme
  const u = new URL(raw, `http://site${BASE}${from}`);
  if (!u.pathname.startsWith(BASE)) return { path: u.pathname, hash: "" }; // outside the base: callers report it
  return { path: decodeURIComponent(u.pathname.slice(BASE.length)), hash: decodeURIComponent(u.hash.slice(1)) };
}

/** the text a sighted reader sees in `el`: text nodes outside aria-hidden subtrees, whitespace collapsed */
export function visibleText(el: Element): string {
  const parts: string[] = [];
  (function walk(n: Node) {
    if (n.nodeType === 3) parts.push(n.textContent ?? "");
    else if (n.nodeType === 1 && (n as Element).getAttribute("aria-hidden") !== "true") n.childNodes.forEach(walk);
  })(el);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/** the value of one property in an element's inline style attribute */
export function inlineStyle(el: Element, prop: string): string | undefined {
  for (const decl of (el.getAttribute("style") ?? "").split(";")) {
    const i = decl.indexOf(":");
    if (i > 0 && decl.slice(0, i).trim() === prop) return decl.slice(i + 1).trim();
  }
  return undefined;
}
