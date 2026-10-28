# Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the site skeleton to GitHub Pages: map of all eight divisions, division pages, full term inventory (all `pending`), glossary, figure key, share links, CI, Cloudflare previews.

**Architecture:** Astro static site, TypeScript. Content in YAML collections validated by zod; pure logic in `src/lib/` (unit-tested with Vitest); SVG drawn by Astro components; behaviour in small plain-TS islands. Playwright covers routes, a11y, links, motion and README screenshots.

**Tech Stack:** Bun 1.4 (package manager and runtime; scripts use `bun --bun`), prek pre-commit hooks, Astro 7, TypeScript 5, Vitest 5, Playwright 1.64 + @axe-core/playwright, @fontsource, GitHub Actions + Pages, Cloudflare Workers Builds (wrangler.toml).

**Spec:** `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Read it first. Section numbers below (§n) refer to it.

**Visual reference:** `docs/concept/nuzhah-concept.html` (copied in Task 1). It is the approved mockup: port drawing code and CSS from it, don't redesign. Function names below (`moon`, `fig`, `ACC`, `CASES`, starfield `tick`, `placePlanets`) refer to it.

**Conventions for every task:**
- Prefix shell commands with `rtk` (owner's tooling; passes through when it has no filter).
- Use **bun**, never npm/npx/node: `bun add`, `bun run <script>`, `bunx <bin>`, `bun <file>.mjs`.
- prek runs `.pre-commit-config.yaml` on every commit (whitespace, yaml, codespell, Arabic presentation forms, source guard, unit tests). If codespell flags a transliteration, add it to `.codespell-ignore` rather than changing the word.
- One commit per task, short one-line subject, repo style `area: what` (e.g. `lib: add base-aware url helper`). No model/session attribution trailers in commits (owner rule: attribution goes in the PR description).
- Fix mistakes in earlier commits with `git history` (fixup), not "fix previous" commits.
- Never `git add` anything under `source/` or any PDF.
- Arabic is always fully voweled. All text is paraphrase with a § reference; never paste translation sentences.
- **Islands** are included with a processed Astro script tag, e.g. `<script>import "../islands/prefs.ts";</script>`: site-wide ones (`prefs`, `stars`, `slugquery`, `popover`) go in `Page.astro`; page-specific ones (`orbit`, `glossary`) go in their page. Never put `is:inline` or `define:vars` on these, because both stop the bundler resolving imports. The only inline scripts are the theme pre-paint script (Task 7) and the 404 redirect (Task 10).
- SVGs that contain interactive elements (planets, term triggers) must not have `role="img"`; give them `role="group"` with an `aria-label`. Purely decorative SVGs keep `role="img"` or `aria-hidden`.
- When copying CSS from the mockup, copy by selector, not by line number (line numbers below are approximate).

---

## File map

```
.gitignore                      ignore source/, *.pdf, dist*, node_modules, test output
package.json                    scripts + deps
astro.config.mjs                SITE/BASE from env, sitemap
tsconfig.json                   astro strict
vitest.config.ts                unit tests in tests/unit
playwright.config.ts            e2e + screenshots projects
wrangler.toml                   Cloudflare assets-only worker
.github/workflows/ci.yml        PR + main: check, test, build, e2e, deploy
scripts/guard-source.mjs        fail if copyrighted source is tracked
scripts/check-base.mjs          crawl a BASE build for unprefixed links
docs/concept/nuzhah-concept.html  approved mockup (reference)
notes/translation-queries.md    slips for owner to rule on
notes/annotation-usage.md       which PDF annotations are used where
src/content.config.ts           collections: divisions, terms
src/content/divisions.yaml      8 divisions
src/content/terms.yaml          term inventory
src/lib/url.ts                  base-aware links
src/lib/terms.ts                slug → target, query parsing, reserved words
src/lib/inventory.ts            build-time checks over terms + divisions
src/lib/content.ts              loads collections and runs the checks
scripts/annotations.py          runs locally to recover highlight text; output stays in source/ (script is committed)
src/lib/orbit.ts                orbit geometry (pure)
src/styles/tokens.css, base.css, motion.css
src/layouts/Page.astro          html shell, header, footer, islands
src/components/layout/          Header, Footer, Breadcrumb, Starfield, ThemeToggle, KeyToggle, TermPopover
src/components/svg/             Moon, Narrator, InfoIcon
src/islands/                    stars.ts, orbit.ts, prefs.ts, popover.ts, slugquery.ts, glossary.ts
src/pages/index.astro           map
src/pages/[division]/index.astro
src/pages/narrators.astro
src/pages/terms.astro
src/pages/t/[slug].astro
src/pages/terms-index.json.ts
src/pages/404.astro
tests/unit/*.test.ts
tests/e2e/*.spec.ts
tests/screenshots/readme.spec.ts
README.md
```

---

### Task 1: Repository, ignore rules, source files, spec commit

**Files:**
- Create: `.gitignore`, `docs/concept/nuzhah-concept.html`, `notes/translation-queries.md`, `source/` (local only)

- [ ] **Step 1: Init git and write `.gitignore`**

```bash
cd /c/dev/hadith-science && rtk git init -b main
```

`.gitignore`:
```
# copyrighted source material: never commit (spec §2)
source/
*.pdf
nuzhah*.txt
annotations*.txt

node_modules/
dist/
dist-*/
.astro/
test-results/
playwright-report/
```

- [ ] **Step 2: Put source material in `source/` (local only)**

```bash
mkdir -p source
cp "Nuzhat al-Nazar - Ibn Hajar.pdf" source/
S="/c/Users/adeha/AppData/Local/Temp/claude/C--dev-hadith-science/a507fe9b-90f5-4594-a3aa-d599b4594b2c/scratchpad"
cp "$S/nuzhah.txt" "$S/annotations.txt" source/
mkdir -p docs/concept && cp "$S/nuzhah-concept.html" docs/concept/
```
Keep the root PDF where it is (owner's file; ignored anyway).

- [ ] **Step 3: Write `notes/translation-queries.md`**

```markdown
# Translation queries

Places where the translation looks off. The site follows the Arabic term until the owner rules.
No matching PDF annotation was found for these (checked 2026-10-28).

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.20 | muʿḍil | Term is muʿḍal (passive) | |
| p.159 | "specified" | Check against Arabic | |
| §5.51 | Sarrāj | Check name spelling | |
```

- [ ] **Step 4: Verify nothing copyrighted is staged**

```bash
rtk git add -A && rtk git status
```
Expected: `.gitignore`, `docs/`, `notes/` only. No `source/`, no `.pdf`.

- [ ] **Step 5: Commit**

```bash
rtk git commit -m "docs: add design spec, phase 1 plan and concept mockup"
```

- [ ] **Step 6: Create public repo and push (confirm with the owner first)**

Ask the owner one question before running this: it creates a public repo and publishes the spec and plan. Continue only on a yes.

```bash
rtk gh repo create adehad/hadith-science --public --source . --remote origin --push \
  --description "Ibn Ḥajar's Nuzhat al-Naẓar, visualised"
rtk gh api -X POST repos/adehad/hadith-science/pages -f build_type=workflow
```
Expected: repo URL printed; Pages API returns JSON with `"build_type": "workflow"`.

---

### Task 2: Astro scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder), `src/env.d.ts` if Astro needs it

- [ ] **Step 1: `package.json`**

```json
{
  "name": "hadith-science",
  "private": true,
  "type": "module",
  "packageManager": "bun@1.4.4",
  "scripts": {
    "dev": "bun --bun astro dev",
    "build": "bun --bun astro build",
    "preview": "bun --bun astro preview",
    "check": "bun --bun astro check",
    "test": "bun --bun vitest run",
    "test:e2e": "bun --bun playwright test --project=e2e",
    "screenshots": "bun --bun playwright test --project=screenshots",
    "test:base": "BASE=/hadith-science/ SITE=https://adehad.github.io bun --bun astro build --outDir dist-base && bun scripts/check-base.mjs dist-base /hadith-science/",
    "guard": "bun scripts/guard-source.mjs"
  }
}
```

- [ ] **Step 2: Install deps**

```bash
bun add astro@^7.4 @astrojs/sitemap @fontsource-variable/fraunces @fontsource-variable/source-sans-3 @fontsource/amiri yaml
bun add -d typescript@^5 @astrojs/check vitest @playwright/test @axe-core/playwright
```
(Done.) bun's script shell is cross-platform, so `test:base` sets env inline without cross-env.

- [ ] **Step 3: `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// GitHub Pages serves under /hadith-science/; Cloudflare previews and local builds serve at / (spec §8)
const site = process.env.SITE || "http://localhost:4321";
const base = process.env.BASE || "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [sitemap()],
});
```

- [ ] **Step 4: `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "dist-*", "source"]
}
```

- [ ] **Step 5: Placeholder `src/pages/index.astro`**

```astro
---
---
<html lang="en"><head><meta charset="utf-8" /><title>Nuzhat al-Naẓar</title></head><body><h1>Nuzhat al-Naẓar</h1></body></html>
```

- [ ] **Step 6: Verify**

Run: `rtk bun run build && rtk bun run check`
Expected: build writes `dist/index.html`; check reports 0 errors.

- [ ] **Step 7: Commit** — `build: scaffold astro site`

---

### Task 3: Base-aware URL helper

**Files:**
- Create: `src/lib/url.ts`, `tests/unit/url.test.ts`, `vitest.config.ts`

- [ ] **Step 1: `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/unit/**/*.test.ts"] } });
```

- [ ] **Step 2: Failing test `tests/unit/url.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { normaliseBase, href, absolute } from "../../src/lib/url";

describe("normaliseBase", () => {
  it.each([
    ["/", "/"], ["", "/"], ["hadith-science", "/hadith-science/"],
    ["/hadith-science", "/hadith-science/"], ["/hadith-science/", "/hadith-science/"],
    ["//hadith-science//", "/hadith-science/"],
  ])("%s → %s", (input, out) => expect(normaliseBase(input)).toBe(out));
});

describe("href", () => {
  it("joins base and path with one slash", () => {
    expect(href("terms/", "/hadith-science/")).toBe("/hadith-science/terms/");
    expect(href("/terms/", "/")).toBe("/terms/");
  });
  it("keeps query and hash", () => {
    expect(href("terms/?q=x#y", "/b/")).toBe("/b/terms/?q=x#y");
  });
  it("root is base", () => expect(href("", "/b/")).toBe("/b/"));
});

describe("absolute", () => {
  it("prefixes site", () =>
    expect(absolute("t/mursal/", "https://adehad.github.io", "/hadith-science/"))
      .toBe("https://adehad.github.io/hadith-science/t/mursal/"));
  it("tolerates trailing slash on site", () =>
    expect(absolute("", "https://x.dev/", "/")).toBe("https://x.dev/"));
});
```

- [ ] **Step 3: Run, expect FAIL** — `rtk vitest run tests/unit/url.test.ts` → cannot find module.

- [ ] **Step 4: Implement `src/lib/url.ts`**

```ts
// every internal link goes through here so the GitHub Pages base path is never missed (spec §8)
export function normaliseBase(base: string): string {
  const core = base.split("/").filter(Boolean).join("/");
  return core ? `/${core}/` : "/";
}

const envBase = () => normaliseBase(import.meta.env?.BASE_URL ?? "/");

export function href(path: string, base: string = envBase()): string {
  return normaliseBase(base) + path.replace(/^\/+/, "");
}

export function absolute(path: string, site: string, base: string = envBase()): string {
  return site.replace(/\/+$/, "") + href(path, base);
}
```

- [ ] **Step 5: Run, expect PASS.**
- [ ] **Step 6: Commit** — `lib: add base-aware url helper`

---

### Task 4: Term logic (slugs, query parsing, targets)

**Files:**
- Create: `src/lib/terms.ts`, `tests/unit/terms.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { RESERVED, targetPath, parseSlugQuery, resolveQuery } from "../../src/lib/terms";

const built = { slug: "mursal", division: "al-mardud", scene: "breaks" };
const viewOnly = { slug: "mursal-wide", division: "al-mardud", scene: "breaks", view: "wider" };
const pending = { slug: "mutawatir", division: "adad-al-turuq" };

describe("targetPath", () => {
  it("built term → scene with hash", () => expect(targetPath(built)).toBe("al-mardud/breaks/#mursal"));
  it("view-only term carries view", () =>
    expect(targetPath(viewOnly)).toBe("al-mardud/breaks/?view=wider#mursal-wide"));
  it("pending term → glossary entry", () => expect(targetPath(pending)).toBe("terms/#mutawatir"));
});

describe("parseSlugQuery", () => {
  it("?t=slug", () => expect(parseSlugQuery("?t=mursal")).toEqual({ kind: "t", slug: "mursal" }));
  it("bare ?slug", () => expect(parseSlugQuery("?mursal")).toEqual({ kind: "bare", slug: "mursal" }));
  it.each(["", "?", "?mursal=", "?mursal=1", "?a&b", "?view", "?q", "?t", "?t=", "?view=madinah"])(
    "ignores %s", (q) => expect(parseSlugQuery(q)).toBeNull());
  it("lowercases", () => expect(parseSlugQuery("?Mursal")).toEqual({ kind: "bare", slug: "mursal" }));
});

describe("resolveQuery", () => {
  const index = { mursal: "al-mardud/breaks/#mursal" };
  it("known bare", () => expect(resolveQuery("?mursal", index)).toBe("al-mardud/breaks/#mursal"));
  it("known t", () => expect(resolveQuery("?t=mursal", index)).toBe("al-mardud/breaks/#mursal"));
  it("unknown t → glossary search", () => expect(resolveQuery("?t=xyz", index)).toBe("terms/?q=xyz"));
  it("unknown bare → stay", () => expect(resolveQuery("?utm_x", index)).toBeNull());
});

it("reserved words", () => expect([...RESERVED]).toEqual(["t", "view", "q"]));
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement `src/lib/terms.ts`**

```ts
// share-link rules (spec §6); paths are base-relative, callers wrap them with href()
export const RESERVED = ["t", "view", "q"] as const;

export interface TermTarget { slug: string; division: string; scene?: string; view?: string }

export function targetPath(t: TermTarget): string {
  if (!t.scene) return `terms/#${t.slug}`;
  const view = t.view ? `?view=${encodeURIComponent(t.view)}` : "";
  return `${t.division}/${t.scene}/${view}#${t.slug}`;
}

export type SlugQuery = { kind: "t" | "bare"; slug: string };

export function parseSlugQuery(search: string): SlugQuery | null {
  const raw = search.replace(/^\?/, "");
  if (!raw) return null;
  const params = [...new URLSearchParams(raw)];
  const t = params.find(([k]) => k === "t");
  if (t) return t[1] ? { kind: "t", slug: t[1].toLowerCase() } : null;
  // bare form: exactly one key, no "=" at all, not a reserved word
  if (params.length !== 1 || raw.includes("=")) return null;
  const key = params[0][0].toLowerCase();
  return key && !(RESERVED as readonly string[]).includes(key) ? { kind: "bare", slug: key } : null;
}

export function resolveQuery(search: string, index: Record<string, string>): string | null {
  const q = parseSlugQuery(search);
  if (!q) return null;
  if (index[q.slug]) return index[q.slug];
  return q.kind === "t" ? `terms/?q=${encodeURIComponent(q.slug)}` : null;
}
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `lib: add term share-link resolution`

---

### Task 5: Content collections and inventory checks

**Files:**
- Create: `src/content.config.ts`, `src/content/divisions.yaml`, `src/content/terms.yaml` (seed of 3 entries; filled in Task 6), `src/lib/inventory.ts`, `src/lib/content.ts`, `tests/unit/inventory.test.ts`

- [ ] **Step 1: `src/content/divisions.yaml`** — all 8, from spec §4.1 and the mockup's `GROUPS`/`PLANET`/`ORBIT`:

```yaml
- id: adad-al-turuq
  order: 1
  term: ʿAdad al-ṭuruq
  ar: عَدَدُ الطُّرُقِ
  en: How it reached us
  sections: "§5.2–5.8"
  moons:
    - Mutawātir
    - "Āḥād: mashhūr, ʿazīz, gharīb (muṭlaq or nisbī)"
- id: al-maqbul
  order: 2
  term: al-Maqbūl
  ar: الْمَقْبُولُ
  en: Accepted reports
  sections: "§5.9–5.16"
  moons:
    - "Four grades: ṣaḥīḥ and ḥasan, each li-dhātihi or li-ghayrihi"
    - "Opposition: shādhdh and maḥfūẓ, munkar and maʿrūf"
    - "Corroboration: mutābiʿ, shāhid, iʿtibār"
    - "Acted on or not: muḥkam, mukhtalif, nāsikh and mansūkh, tarjīḥ, tawaqquf"
```
Continue identically for `al-mardud` (3, الْمَرْدُودُ, "Breaks in the chain · criticism of narrators", §5.17–5.39), `muntaha-al-isnad` (4, مُنْتَهَى الْإِسْنَادِ), `lataif-al-isnad` (5, لَطَائِفُ الْإِسْنَادِ), `siyagh-al-ada` (6, صِيَغُ الْأَدَاءِ, "How it was passed on"), `al-asma` (7, الْأَسْمَاءُ, "Names that look alike"), `marifat-al-ruwat` (8, مَعْرِفَةُ الرُّوَاةِ, "Knowing the narrators", §5.62–5.71). Copy moon strings from the mockup's `GROUPS` in `docs/concept/nuzhah-concept.html`. Where the plan's `ar` differs from the mockup (division 8: the plan's مَعْرِفَةُ الرُّوَاةِ replaces the mockup's مَا يَنْبَغِي مَعْرِفَتُهُ), the plan wins.

- [ ] **Step 2: `src/content/terms.yaml` seed**

```yaml
- id: mutawatir
  translit: Mutawātir
  ar: مُتَوَاتِرٌ
  en: Mass-transmitted
  def: Carried by so many at every level that agreement on a lie is impossible.
  section: "§5.3"
  division: adad-al-turuq
- id: mursal
  translit: Mursal
  ar: مُرْسَلٌ
  en: Hurried
  def: A Successor reports from the Prophet ﷺ without naming the Companion.
  section: "§5.18"
  division: al-mardud
- id: majhul
  translit: Majhūl
  ar: مَجْهُولٌ
  en: Unknown narrator
  def: Named, but no one has vouched for him.
  section: "§5.35"
  division: al-mardud
```

- [ ] **Step 3: `src/content.config.ts`**

```ts
import { defineCollection, reference } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const divisions = defineCollection({
  loader: file("src/content/divisions.yaml"),
  schema: z.object({
    id: slug,
    order: z.number().int().min(1).max(8),
    term: z.string(),
    ar: z.string(),
    en: z.string(),
    sections: z.string(),
    moons: z.array(z.string()).min(1),
  }),
});

const terms = defineCollection({
  loader: file("src/content/terms.yaml"),
  schema: z.object({
    id: slug,
    translit: z.string(),
    ar: z.string(),
    en: z.string(),
    def: z.string().max(200),
    section: z.string().regex(/^§\d+\.\d+/),
    division: reference("divisions"),
    // absent = pending (division not yet built, spec §9)
    scene: z.string().optional(),
    view: z.string().optional(),
  }),
});

export const collections = { divisions, terms };
```

- [ ] **Step 4: Failing test `tests/unit/inventory.test.ts`** for the cross-checks zod can't express:

```ts
import { describe, expect, it } from "vitest";
import { inventoryErrors } from "../../src/lib/inventory";

const term = (o: object) => ({ id: "x", division: "d", ...o });

describe("inventoryErrors", () => {
  it("clean inventory", () => expect(inventoryErrors([term({})], [], ["d"])).toEqual([]));
  it("reserved slug", () => expect(inventoryErrors([term({ id: "view" })], [], ["d"])).toContain("term view: slug is a reserved word"));
  it("duplicate slug", () => expect(inventoryErrors([term({}), term({})], [], ["d"])).toContain("term x: duplicate slug"));
  it("unknown scene", () => expect(inventoryErrors([term({ scene: "s" })], [], ["d"])).toContain("term x: unknown scene d/s"));
  it("view without scene", () => expect(inventoryErrors([term({ view: "v" })], [], ["d"])).toContain("term x: view set but no scene"));
  it("unknown division", () => expect(inventoryErrors([term({ division: "zz" })], [], ["d"])).toContain("term x: unknown division zz"));
});
```

- [ ] **Step 5: Implement `src/lib/inventory.ts`**

```ts
import { RESERVED } from "./terms";

export interface InvTerm { id: string; division: string; scene?: string; view?: string }

// scenes are "division/scene" ids; empty until phase 2
export function inventoryErrors(terms: InvTerm[], scenes: string[], divisions: string[]): string[] {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const t of terms) {
    if ((RESERVED as readonly string[]).includes(t.id)) errs.push(`term ${t.id}: slug is a reserved word`);
    if (seen.has(t.id)) errs.push(`term ${t.id}: duplicate slug`);
    seen.add(t.id);
    if (!divisions.includes(t.division)) errs.push(`term ${t.id}: unknown division ${t.division}`);
    if (t.view && !t.scene) errs.push(`term ${t.id}: view set but no scene`);
    if (t.scene && !scenes.includes(`${t.division}/${t.scene}`)) errs.push(`term ${t.id}: unknown scene ${t.division}/${t.scene}`);
  }
  return errs;
}
```
Note: `file()` dedupes by id silently, so the duplicate check runs on the raw YAML too (Step 6).

- [ ] **Step 6: Wire checks into the build** — `src/lib/content.ts`:

```ts
import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { inventoryErrors } from "./inventory";

let checked = false;
// throws during build so a broken reference fails CI (spec §9)
export async function loadContent() {
  const divisions = (await getCollection("divisions")).map((d) => d.data).sort((a, b) => a.order - b.order);
  const terms = (await getCollection("terms")).map((t) => ({ ...t.data, division: t.data.division.id }));
  if (!checked) {
    const raw = parse(readFileSync("src/content/terms.yaml", "utf8")) as { id: string; division: string }[];
    const errs = inventoryErrors(raw, [], divisions.map((d) => d.id));
    if (errs.length) throw new Error("Content errors:\n" + errs.join("\n"));
    checked = true;
  }
  return { divisions, terms };
}
```
Every page gets content via `loadContent()`.

- [ ] **Step 7: Run** `rtk vitest run` → PASS; `rtk bun run build` → PASS. Temporarily set a term's `id: view`, rebuild, expect failure listing `slug is a reserved word`; revert.
- [ ] **Step 8: Commit** — `content: add division and term collections with checks`

---

### Task 6: Term inventory for the whole book

**Files:**
- Modify: `src/content/terms.yaml`
- Create: `notes/annotation-usage.md`

This is content work. Source: `source/nuzhah.txt` (`=====PAGE n` markers) and `source/annotations.txt` (owner's notes, keyed by page).

- [ ] **Step 1: Walk §5.2 to §5.71 in order.** For every term Ibn Ḥajar names and defines, add one entry with the Task 5 schema. Rules:
  - `id`: ASCII transliteration, lowercase, hyphens (`ijaza-amma`, `mursal-khafi`, `li-dhatihi`). Never `t`, `view`, `q`.
  - `ar`: fully voweled, nominative indefinite where it's an adjective (مُرْسَلٌ), definite where it's a named science (الْمُتَّفِقُ وَالْمُفْتَرِقُ).
  - `def`: one sentence, our own words, ≤200 chars. Do not copy translation sentences.
  - `section`: the § where it's defined.
  - `division`: per the § ranges in `divisions.yaml`.
  - No `scene` (everything is pending in phase 1).
  - The mockup's `CASES` and delivery/names captions already contain checked paraphrases for many terms; reuse them.
  - Expect roughly 100–140 terms. The mockup's moon list (`GROUPS`) is a checklist of what must be present.

- [ ] **Step 1b: Recover highlight and ink text (spec §11).** Most `/Highlight` entries in `annotations.txt` have no text. Write `scripts/annotations.py` (run with `uv run scripts/annotations.py`). For each `/Highlight` annotation it should:
  1. read the annotation's `/QuadPoints`;
  2. extract the page's text with positions using pypdf's `extract_text(visitor_text=...)`;
  3. keep the text whose baseline point falls inside any quad (with a 2pt tolerance);
  4. write `source/highlights.txt` in the format `--- PAGE n /Highlight` followed by the recovered text.

  For `/Ink`, record the page and the bounding `/Rect`, plus the text that falls inside it. The output stays in `source/` (git-ignored). The script itself contains no source text, so commit it.

- [ ] **Step 2: Note annotations used.** Wherever an owner annotation changed a `def`, add a row to `notes/annotation-usage.md`:

```markdown
# Annotation usage

Owner's PDF annotations used in site text. The owner approves each row.

| Page | Annotation (short) | Used in | Approved |
|---|---|---|---|
```

- [ ] **Step 3: Verify** — `rtk bun run build` passes (schema + checks). Spot-check: `grep -c "^- id:" src/content/terms.yaml` ≥ 100; every moon string in `divisions.yaml` has its terms present.
- [ ] **Step 4: Commit** — `content: add full term inventory` (includes `scripts/annotations.py` and `notes/annotation-usage.md`)

---

### Task 7: Tokens, fonts, base styles, page layout

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/motion.css`, `src/layouts/Page.astro`, `src/components/layout/{Header,Footer,Breadcrumb,ThemeToggle,KeyToggle,Starfield}.astro`, `src/islands/prefs.ts`, `src/islands/stars.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Tokens.** Copy the `:root`, dark `@media`, and `[data-theme="dark"]` blocks from `docs/concept/nuzhah-concept.html` (lines 7–25) into `tokens.css` unchanged (copy by selector; they sit near the top of the `<style>`). Then put each component's CSS next to the component that uses it (Astro scoped `<style>`) as you port it in later tasks. `base.css` holds body, typography and focus-ring rules from the mockup; `motion.css` holds keyframes plus:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
}
```

- [ ] **Step 2: Fonts** — in `Page.astro` frontmatter:

```ts
import "@fontsource-variable/fraunces";
import "@fontsource-variable/source-sans-3";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/motion.css";
```
Font-family names: `"Fraunces Variable"`, `"Source Sans 3 Variable"`, `"Amiri"`. Update the token values copied from the mockup accordingly.

- [ ] **Step 3: `Page.astro`** props: `title`, `description`, `crumbs: {label, path}[]`, optional `ogUrl`. Renders `<html lang="en">`, meta description, canonical `new URL(Astro.url.pathname, Astro.site).href` (`Astro.url.pathname` already includes the base, so don't pass it through `absolute()`/`href()`, which would double it), `og:url` the same unless `ogUrl` is given, Open Graph title/description, a pre-paint inline script that applies stored theme/mode (`is:inline`, try/catch around `localStorage`), `<Header>`, `<main id="main"><slot/></main>`, `<Footer>`. Include a skip link to `#main`.

- [ ] **Step 4: Header** — starfield `<canvas aria-hidden="true">`, site title linking `href("")`, `<Breadcrumb crumbs>`, `<KeyToggle>`, `<ThemeToggle>`. Port markup and CSS from the mockup's `<header>`.

- [ ] **Step 5: `src/islands/prefs.ts`** — theme (`light|dark|system`) sets `data-theme` on `<html>` (removed for system); mode (`key|labels`) sets `data-mode`. Persist under `nuzhah-theme` / `nuzhah-mode`; every storage access in try/catch. Buttons are `aria-pressed` toggles.

- [ ] **Step 6: `src/islands/stars.ts`** — port the mockup's starfield (lines ~555–575: `star`, `sizeField`, `draw`, `tick`). Keep: when `matchMedia("(prefers-reduced-motion: reduce)").matches`, call `draw()` once and never start `requestAnimationFrame`. Also pause when `document.hidden`.

- [ ] **Step 7: Footer** — credit line: "Ibn Ḥajar al-ʿAsqalānī, *Nuzhat al-Naẓar*. Text on this site is paraphrased from the English translation (A. S. Hussain, 2012); § numbers refer to it." Links: glossary, figure key, GitHub repo.

- [ ] **Step 8: Use `Page` in `index.astro`** with a placeholder body. Run `rtk bun run build && rtk bun run check` → 0 errors. Run `rtk bun run dev`, open the page, toggle theme and mode, reload; preferences persist.
- [ ] **Step 9: Commit** — `layout: add page shell, header, footer and themes`

---

### Task 8: Map and division pages

**Files:**
- Create: `src/lib/orbit.ts`, `tests/unit/orbit.test.ts`, `src/components/svg/Moon.astro`, `src/islands/orbit.ts`, `src/pages/[division]/index.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Failing test `tests/unit/orbit.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { orbitRadii, planetAt, planetRadius } from "../../src/lib/orbit";

describe("orbit geometry", () => {
  it("radii grow per ring with 0.4 aspect", () => {
    expect(orbitRadii(0)).toEqual([96, 38.4]);
    expect(orbitRadii(7)).toEqual([369, 147.6]);
  });
  it("planet position on ellipse", () => {
    const [x, y] = planetAt(0, 0, [410, 270]);
    expect(x).toBeCloseTo(506); expect(y).toBeCloseTo(270);
  });
  it("planet radius scales with moons, capped", () => {
    expect(planetRadius(2)).toBeCloseTo(9.2);
    expect(planetRadius(100)).toBe(20);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement `src/lib/orbit.ts`** (from mockup `orbitR`, `placePlanets`)

```ts
// orbit ellipses for the map (ported from the concept mockup)
export const MAP_CENTRE: [number, number] = [410, 270];
export const orbitRadii = (i: number): [number, number] => [96 + i * 39, +((96 + i * 39) * 0.4).toFixed(4)];
export function planetAt(i: number, angle: number, [cx, cy] = MAP_CENTRE): [number, number] {
  const [rx, ry] = orbitRadii(i);
  return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)];
}
export const planetRadius = (moonCount: number) => Math.min(20, 8 + moonCount * 0.6);
```
Planet size uses moon count (phase 1 has no per-moon term counts).

- [ ] **Step 4: Run, expect PASS.**

- [ ] **Step 5: `Moon.astro`** — port the mockup's `moon(cx,cy,k)` as props `cx, cy, k`. Pulsing glow keyframes live in `motion.css`.

- [ ] **Step 6: Map page `index.astro`** — server-render the SVG (viewBox `0 0 820 540`): orbits, `<Moon>`, and per division a `<a href={href(`${d.id}/`)} class="planet" aria-label={`${d.term}: ${d.en}`} data-i={i}>` holding the body circle (`fill: var(--p{order})`), moon dots, `.ptitle` (term) and `.psub` (English) text. Initial positions computed with `planetAt(i, i * 0.8)` so it renders without JS. Port planet CSS from the mockup. Title "Map of the book"; lede from the mockup's map scene, adjusted: planets now open a page.

- [ ] **Step 6b: The morph.** `view-transition-name` is only captured on elements with a CSS box, so `<a>` and `<g>` elements inside the SVG won't morph. Use an HTML stand-in:
  - On the map, `orbit.ts` handles a planet click (and the `pageswap` event, where supported). It positions a `<div class="vt-planet">` absolutely over the clicked planet's `getBoundingClientRect()`, gives it a circular background in the planet's colour, and sets `style.viewTransitionName = "planet"`. Navigation then proceeds normally.
  - On the division page, the outer wrapper `<div>` of the large planet SVG has `view-transition-name: planet`.
  - Do not set `view-transition-name` on anything inside an SVG.
  - Without JavaScript, or in Firefox, you get a plain navigation.

- [ ] **Step 7: `src/islands/orbit.ts`** — port `mapTick`/`placePlanets`: moves each `.planet` by setting `transform`; starts at the server-rendered angles; pauses on hover/focus inside the SVG and when `document.hidden`; slower when `matchMedia("(max-width: 640px)")`; never starts under reduced motion. Space on a focused planet calls its `.click()` (native SVG `<a>` only handles Enter), so keyboard users get the same stand-in morph. Expose `data-angle` on each planet so tests can read positions.

- [ ] **Step 8: Division page `[division]/index.astro`**

```astro
---
import Page from "../../layouts/Page.astro";
import { loadContent } from "../../lib/content";
import { href } from "../../lib/url";
export async function getStaticPaths() {
  const { divisions } = await loadContent();
  return divisions.map((d) => ({ params: { division: d.id }, props: { d } }));
}
const { d } = Astro.props;
const { terms } = await loadContent();
const mine = terms.filter((t) => t.division === d.id);
---
```
Body: large planet SVG inside a wrapper `<div style="view-transition-name: planet">` (so the map's stand-in morphs into it, Step 6b), the term, Arabic (`lang="ar" dir="rtl"`), English, § range; then each moon as a card listing "coming soon"; then the division's terms (linking to `href(`terms/#${t.id}`)`). Breadcrumb: Map › {d.term}. Previous/next division links.

- [ ] **Step 9: Verify** — build; open `/` and click a planet in Chromium: the planet morphs to the division page. Check `/al-mardud/` renders with JS disabled.
- [ ] **Step 10: Commit** — `map: add orbiting map and division pages`

---

### Task 9: Term popover and figure key

**Files:**
- Create: `src/components/layout/TermPopover.astro`, `src/islands/popover.ts`, `src/components/svg/{Narrator,InfoIcon}.astro`, `src/pages/narrators.astro`

- [ ] **Step 1: `TermPopover.astro`** — one per page, an HTML overlay (`role="dialog"`, `aria-modal="false"`, hidden by default) containing: term heading, Arabic, definition, § line, buttons **Copy link**, **Share** (hidden unless `navigator.share`), link **See in glossary**. Spec §3.5, §6.

- [ ] **Step 2: Term triggers** — any element with `data-term="<slug>"` plus `data-term-json` (escaped JSON of `{translit, ar, def, section, url}`; `url` is `absolute("t/<slug>/", site)`) is a trigger. Inside SVG use `<g role="button" tabindex="0" aria-haspopup="dialog">`.

- [ ] **Step 3: `src/islands/popover.ts`**
  - Open on click, Enter or Space; position near the trigger's `getBoundingClientRect()`, clamped to the viewport; on `max-width: 640px` show as a bottom sheet (CSS class).
  - Close on Escape, outside click, or opening another; return focus to the trigger.
  - Copy uses `navigator.clipboard.writeText(url)`; button text → "Copied" for 2s.
  - Share calls `navigator.share({ title, url })` and ignores `AbortError`.
  - Export `openTerm(slug)` on `window.nuzhah` for the landing code (Task 10) and tests.
  - `aria-expanded` on the trigger mirrors state.

- [ ] **Step 4: `Narrator.astro`** — port `fig(x,y,o)`, `BODY` and `ACC` from the mockup. Props mirror `o`: `kind` (sahabi|tabii|later), `face` (blank|faded|mask|hand), `scroll` (yes|slot), `seal` (yes|slot|crack|void), `ghost`. Keep the `.slot` blink and the gold `animateTransform` shimmer.

- [ ] **Step 5: `narrators.astro`** — port the mockup's "Reading a narrator" scene (`CASES`, viewBox `860×440`): the row of 8 cases plus the generation strip (Prophet moon, Companion, Successor, later). Each case's label is a term trigger for the matching inventory slug (`thiqa`, `majhul`, `mubham`, `daif`, `kadhdhab`, `mukhtalit`, `mudallis`, `saqt`; add any missing to `terms.yaml`). Under it, a "Read as text" `<details>` listing each case in words. In portrait under 640px the SVG row scales to fit the width (the spec's carousel arrives with scenes in phase 2).

- [ ] **Step 6: Verify** — build; open `/narrators/`; Tab to a case, press Enter: the popover opens with focus inside; Escape returns focus.
- [ ] **Step 7: Commit** — `narrators: add figure key and term popover`

---

### Task 10: Glossary, share pages, slug queries, 404

**Files:**
- Create: `src/pages/terms.astro`, `src/islands/glossary.ts`, `src/pages/t/[slug].astro`, `src/pages/terms-index.json.ts`, `src/islands/slugquery.ts`, `src/pages/404.astro`
- Modify: `src/layouts/Page.astro`

- [ ] **Step 1: `/terms/`** — filter `<input type="search" id="q">` and a list grouped by division. Each entry is `<article id={t.id} data-term={t.id}>`, with translit, Arabic, English, def, §, and either a link to its scene or "coming soon" plus a link to the division page. Glossary entries are HTML, so a native `id` is fine here.

- [ ] **Step 2: `src/islands/glossary.ts`** — filters entries by case- and diacritic-insensitive match (`normalize("NFD").replace(/\p{M}/gu,"")`) on translit, en and slug. Prefill from `?q=`, with a visible "No exact match for “x”" note when `q` doesn't equal a slug. On load with a hash, scroll to the entry and add a `.pulse` class.

- [ ] **Step 3: `/terms-index.json`** — `terms-index.json.ts`:

```ts
import type { APIRoute } from "astro";
import { loadContent } from "../lib/content";
import { targetPath } from "../lib/terms";

export const GET: APIRoute = async () => {
  const { terms } = await loadContent();
  const index = Object.fromEntries(terms.map((t) => [t.id, targetPath({ slug: t.id, ...t })]));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json" } });
};
```

- [ ] **Step 4: `/t/[slug]/`** — `getStaticPaths` over all terms. The page is a minimal HTML document (not `Page.astro`):

```astro
---
import { loadContent } from "../../lib/content";
import { targetPath } from "../../lib/terms";
import { absolute } from "../../lib/url";
export async function getStaticPaths() {
  const { terms } = await loadContent();
  return terms.map((t) => ({ params: { slug: t.id }, props: { t } }));
}
const { t } = Astro.props;
const site = Astro.site!.toString();
const target = absolute(targetPath({ slug: t.id, ...t }), site);
const self = absolute(`t/${t.id}/`, site);
const title = `${t.translit} (${t.ar}) · Nuzhat al-Naẓar`;
---
<html lang="en"><head>
<meta charset="utf-8" /><title>{title}</title>
<meta name="description" content={t.def} />
<link rel="canonical" href={target} />
<meta http-equiv="refresh" content={`0; url=${target}`} />
<meta property="og:title" content={title} />
<meta property="og:description" content={t.def} />
<meta property="og:url" content={self} />
<meta property="og:type" content="article" />
</head><body><p><a href={target}>{t.translit}</a></p></body></html>
```

- [ ] **Step 5: `src/islands/slugquery.ts`** — included on every page through `Page.astro`:

```ts
import { parseSlugQuery, resolveQuery } from "../lib/terms";
import { href } from "../lib/url";

// fetch the index only when the URL actually carries a term (spec §6)
if (parseSlugQuery(location.search)) {
  fetch(href("terms-index.json"))
    .then((r) => r.json())
    .then((index: Record<string, string>) => {
      const to = resolveQuery(location.search, index);
      if (to) location.replace(href(to));
    })
    .catch(() => {});
}
```

- [ ] **Step 6: Landing on scene hashes** — in `popover.ts`: on load, if `location.hash` names a `[data-term][data-term-json]` element (glossary articles have no `data-term-json`, so `glossary.ts` alone handles `/terms/#slug`), scroll it into view (`block: "center"`), add the `.landing` pulse ring class, and `openTerm(slug)`. Phase 2's carousel snaps to the panel first; leave a clearly named hook `beforeLand(el)` that is a no-op for now.

- [ ] **Step 7: `404.astro`** — themed page using `Page` (links root-absolute through `href`) with a "Back to the map" link, plus an inline script:

```js
// unknown /t/<x>/ share links land here: send them to a glossary search (spec §6)
const m = location.pathname.match(/\/t\/([^/]+)\/?$/);
if (m) location.replace(BASE + "terms/?q=" + encodeURIComponent(decodeURIComponent(m[1])));
```
with `BASE` injected via `define:vars={{ BASE: href("") }}`.

- [ ] **Step 8: Verify manually** (`rtk bun run build && rtk bun run preview`):
  - `/?mutawatir` → `/terms/#mutawatir`, entry pulsing.
  - `/?t=nothing` → `/terms/?q=nothing` with the note.
  - `/?utm_source` stays on `/`.
  - `/t/mursal/` → `/terms/#mursal`.
  - `/t/nothing/` → 404 → `/terms/?q=nothing`. `astro preview` serves `404.html` for unknown paths; if not, verify this in Task 12's e2e against a static server.
- [ ] **Step 9: Commit** — `terms: add glossary, share links and slug queries`

---

### Task 11: Guards, Cloudflare config, CI and deploy

**Files:**
- Create: `scripts/guard-source.mjs`, `scripts/check-base.mjs`, `wrangler.toml`, `.github/workflows/ci.yml`

- [ ] **Step 1: `scripts/guard-source.mjs`** (already added with the prek setup, where it also runs as a hook; keep as is)

```js
// fail if copyrighted source material is ever tracked (spec §2, §9)
import { execSync } from "node:child_process";
const tracked = execSync("git ls-files", { encoding: "utf8" }).split("\n");
const bad = tracked.filter((f) => /(^|\/)source\/|\.pdf$|(^|\/)nuzhah[^/]*\.txt$|(^|\/)annotations[^/]*\.txt$/i.test(f));
if (bad.length) { console.error("Copyrighted source tracked:\n" + bad.join("\n")); process.exit(1); }
console.log("guard: ok");
```
Test it: `git add -f source/annotations.txt && rtk bun run guard` → exit 1; then `git rm --cached source/annotations.txt`.

- [ ] **Step 2: `scripts/check-base.mjs`**

```js
// crawl a BASE build: every internal href/src/refresh/canonical/fetch must start with the base (spec §8, §9)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const [dir, base] = process.argv.slice(2);
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); } })(dir);
const bad = [];
const attr = /(?:href|src|action|content)="([^"]+)"/g;
for (const f of files.filter((f) => /\.(html|js)$/.test(f))) {
  const s = readFileSync(f, "utf8");
  for (const [, v] of s.matchAll(attr)) {
    const url = v.replace(/^0; url=/, "");
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    if (path.startsWith("/") && !path.startsWith(base) && !path.startsWith("//")) bad.push(`${f}: ${v}`);
  }
  if (/\.js$/.test(f) && s.includes('"/terms-index.json"')) bad.push(`${f}: unprefixed terms-index fetch`);
}
if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
console.log(`check-base: ${files.length} files ok`);
```
Run: `rtk bun run test:base` → `check-base: … ok`. If it flags real links, fix them via `href()` rather than loosening the script.

- [ ] **Step 3: `wrangler.toml`**

```toml
# Cloudflare Workers & Pages config: branch previews (production is GitHub Pages)
name = "hadith-science"
compatibility_date = "2026-10-28"

[assets]
directory = "./dist/"
not_found_handling = "404-page"
```

- [ ] **Step 4: `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version-file: package.json
      - run: bun install --frozen-lockfile
      - uses: j178/prek-action@v1
      - run: bun run check
      - run: bun run test
      - run: bunx playwright install --with-deps chromium
      - run: bun run build
      - run: bun run test:e2e
      - run: bun run screenshots
      - run: bun run test:base
      - id: pages
        uses: actions/configure-pages@v5
      - name: Build for Pages
        env:
          SITE: ${{ steps.pages.outputs.origin }}
          BASE: ${{ steps.pages.outputs.base_path }}
        run: bun run build
      - uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    if: ${{ github.ref == 'refs/heads/main' && success() }}
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 5: Commit** — `ci: add source guard, base check, cloudflare config and pages deploy`

---

### Task 12: End-to-end tests

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/routes.spec.ts`, `tests/e2e/links.spec.ts`, `tests/e2e/motion.spec.ts`, `tests/e2e/prefs.spec.ts`

- [ ] **Step 1: `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  webServer: { command: "bun run preview --port 4321", port: 4321, reuseExistingServer: !process.env.CI },
  use: { baseURL: "http://localhost:4321" },
  projects: [
    { name: "e2e", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"] } },
    { name: "screenshots", testDir: "tests/screenshots", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

- [ ] **Step 2: `tests/e2e/routes.spec.ts`** — routes come from the built sitemap, so new pages are covered automatically:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, readdirSync } from "node:fs";

const sitemap = readdirSync("dist").filter((f) => f.startsWith("sitemap-") && f !== "sitemap-index.xml");
const routes = sitemap.flatMap((f) =>
  [...readFileSync(`dist/${f}`, "utf8").matchAll(/<loc>[^<]*?\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]))
  .filter((r) => !r.startsWith("/t/") && r.endsWith("/"));

for (const theme of ["light", "dark"] as const) {
  for (const route of routes) {
    test(`${route} renders cleanly (${theme})`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      expect(errors).toEqual([]);
      const axe = await new AxeBuilder({ page }).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }
}
```

- [ ] **Step 3: `tests/e2e/links.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const terms = parse(readFileSync("src/content/terms.yaml", "utf8")) as { id: string; scene?: string }[];
const pending = terms.filter((t) => !t.scene);

for (const t of pending) {
  test(`pending term ${t.id} lands on its glossary entry`, async ({ page }) => {
    await page.goto(`/t/${t.id}/`);
    await expect(page).toHaveURL(new RegExp(`/terms/#${t.id}$`));
    await expect(page.locator(`#${t.id}`)).toBeInViewport();
  });
}

test("bare ?slug resolves", async ({ page }) => {
  await page.goto(`/?${pending[0].id}`);
  await expect(page).toHaveURL(new RegExp(`/terms/#${pending[0].id}$`));
});

test("?t=unknown opens glossary search", async ({ page }) => {
  await page.goto("/?t=zzz");
  await expect(page).toHaveURL(/\/terms\/\?q=zzz$/);
  await expect(page.getByText(/No exact match/)).toBeVisible();
});

test("stray bare key is ignored", async ({ page }) => {
  await page.goto("/?utm_source");
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/\?utm_source$/);
});

test("unknown /t/ path goes to glossary search", async ({ page }) => {
  await page.goto("/t/zzz/");
  await expect(page).toHaveURL(/\/terms\/\?q=zzz$/);
});

test("popover copy and keyboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/narrators/");
  const trigger = page.locator("[data-term]").first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /copy link/i }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/t\/[a-z0-9-]+\/$/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
```
Phase 2 adds the built-term landing test (popover open on the scene). It is not written here because no term has a scene yet.

- [ ] **Step 4: `tests/e2e/motion.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("reduced motion: nothing animates", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length)).toBe(0);
  const angles = () => page.locator(".planet").evaluateAll((els) => els.map((e) => e.getAttribute("data-angle")));
  const stars = () => page.locator("canvas").first().evaluate((c: HTMLCanvasElement) => c.toDataURL());
  const [a1, s1] = [await angles(), await stars()];
  await page.waitForTimeout(1000);
  expect(await angles()).toEqual(a1);
  expect(await stars()).toBe(s1);
});

test("planets move with motion allowed", async ({ page }) => {
  await page.goto("/");
  const a1 = await page.locator(".planet").first().getAttribute("data-angle");
  await page.waitForTimeout(800);
  expect(await page.locator(".planet").first().getAttribute("data-angle")).not.toBe(a1);
});
```

- [ ] **Step 4b: map layout test** — in `tests/e2e/motion.spec.ts` (or a new `map.spec.ts`): at 390×844 the `.tree` list is visible with 8 division links and `.stage` is hidden, and no `.planet` `data-angle` changes over 800ms; at 844×390 the orbit map is visible and the list hidden.

- [ ] **Step 5: `tests/e2e/prefs.spec.ts`** — theme toggle sets `data-theme` and survives reload. With `localStorage` throwing (`page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }))`), the page still renders with no page errors.

- [ ] **Step 6: Run** `rtk bun run build && rtk playwright test --project=e2e` → all pass. Fix real failures in the code, not by weakening tests. Axe colour-contrast failures mean adjusting tokens.
- [ ] **Step 7: Commit** — `test: add end-to-end route, link, motion and prefs tests`

---

### Task 13: README and screenshots

**Files:**
- Create: `tests/screenshots/readme.spec.ts`, `README.md`, `docs/screenshots/*.png`

- [ ] **Step 1: `tests/screenshots/readme.spec.ts`**

```ts
import { test } from "@playwright/test";

const shots = [
  { name: "map", path: "/" },
  { name: "narrators", path: "/narrators/" },
  { name: "terms", path: "/terms/" },
];
const sizes = [
  { tag: "desktop", viewport: { width: 1280, height: 800 } },
  { tag: "mobile", viewport: { width: 390, height: 844 } },
];

for (const s of shots) for (const z of sizes) for (const theme of ["light", "dark"] as const) {
  test(`${s.name} ${z.tag} ${theme}`, async ({ page }) => {
    await page.setViewportSize(z.viewport);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto(s.path);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `docs/screenshots/${s.name}-${z.tag}-${theme}.png` });
  });
}
```

- [ ] **Step 2: Generate** — `rtk bun run build && rtk bun run screenshots`. Open a few PNGs to check they look right.

- [ ] **Step 3: `README.md`** — title; one-paragraph purpose; map screenshot (light/dark via `<picture>` with `prefers-color-scheme` sources); what's covered so far; source and copyright note (paraphrase, § refs, source not in repo); dev commands (`bun run dev`, `test`, `test:e2e`, `screenshots`, `test:base`); Cloudflare preview setup notes from spec §8 (the dashboard Worker name must equal `hadith-science`; build command `bun install && bun run build`); licence: TBD by owner, so leave a "Licence" heading saying "To be decided".

- [ ] **Step 4: Commit** — `docs: add readme and screenshots`

---

### Task 13b: Installable PWA (manifest + service worker)

**Files:**
- Create: `public/manifest.webmanifest`, `public/icons/*` (generated), `pwa-assets.config.ts`, `scripts/sw.mjs`, `src/islands/sw.ts`, `tests/e2e/pwa.spec.ts`
- Modify: `package.json` (build script, deps), `src/layouts/Page.astro` (manifest link, theme-color, apple-touch-icon, sw island)

Spec §8a. `@vite-pwa/astro` only supports Astro ≤5, so use Workbox's `generateSW` as a post-build step over `dist/` (framework-independent).

- [ ] **Step 1: Icons** — `bun add -d @vite-pwa/assets-generator workbox-build`. `pwa-assets.config.ts` uses the `minimal2023Preset` with `public/favicon.svg` as source and a night-sky background (the header's `--sky` token value) for maskable/apple icons. Run `bunx pwa-assets-generator` and commit the output in `public/icons/` (64, 192, 512, maskable-512, apple-touch-180). Look at the 512 and maskable PNGs.

- [ ] **Step 2: `public/manifest.webmanifest`** — `name` "Nuzhat al-Naẓar, visualised", `short_name` "Nuzhah", `description`, `lang` "en", `dir` "ltr", `start_url` "./", `scope` "./" (relative, so it works under both `/hadith-science/` and `/`), `display` "standalone", `background_color` / `theme_color` the night-sky token, `icons` (relative paths `icons/…`, incl. one `purpose: "maskable"`). Link it from `Page.astro` with `href("manifest.webmanifest")`, plus `<meta name="theme-color">` and `<link rel="apple-touch-icon" href={href("icons/apple-touch-icon-180x180.png")}>`.

- [ ] **Step 3: `scripts/sw.mjs`** — after `astro build`:

```js
// precache the built site so it installs as a PWA and reads offline (spec §8a)
import { generateSW } from "workbox-build";
const dir = process.argv[2] ?? "dist";
const { count, size, warnings } = await generateSW({
  globDirectory: dir,
  globPatterns: ["**/*.{html,css,js,svg,png,woff2,json,webmanifest}"],
  // /t/ pages are instant redirects; the glossary they point to is precached
  globIgnores: ["t/**", "sitemap*.xml"],
  swDest: `${dir}/sw.js`,
  navigateFallback: null,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  runtimeCaching: [{
    urlPattern: ({ request }) => request.mode === "navigate",
    handler: "NetworkFirst",
    options: { cacheName: "pages", networkTimeoutSeconds: 3 },
  }],
});
warnings.forEach((w) => console.warn(w));
console.log(`sw: precached ${count} files, ${(size / 1024).toFixed(0)} KiB`);
```
Precache URLs are relative to `dist/`, and the SW is served from the base path, so it works on Pages and on Cloudflare previews. Update scripts: `"build": "bun --bun astro build && bun scripts/sw.mjs"`, and `test:base` runs `bun scripts/sw.mjs dist-base` before check-base. Make check-base skip `sw.js`/`workbox-*.js` only if they produce false positives (they shouldn't: URLs are relative).

- [ ] **Step 4: `src/islands/sw.ts`** — site-wide (processed script in `Page.astro`):

```ts
import { href } from "../lib/url";
// register only in production builds; dev has no sw.js
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  addEventListener("load", () => navigator.serviceWorker.register(href("sw.js"), { scope: href("") }).catch(() => {}));
}
```

- [ ] **Step 5: `tests/e2e/pwa.spec.ts`**
  - `/manifest.webmanifest` parses, has name, start_url, display "standalone", a 192 and a 512 icon, and a maskable icon; every icon URL returns 200.
  - On `/`, `navigator.serviceWorker.ready` resolves and the controller's scriptURL ends with `/sw.js`.
  - Offline: after the SW is ready, reload once (so it controls the page), then `context.setOffline(true)` and navigate to `/terms/` and `/al-mardud/`: both render `<main>`. Navigating to `/t/mursal/` offline isn't required.
  - Axe/route tests stay green (the manifest link and theme-color don't affect them).

- [ ] **Step 6: Verify** — `bun run build` prints the precache count; `bun run test:base` still passes; `E2E_PORT=… bun run test:e2e` green. In Edge, check DevTools-style via Playwright that `navigator.serviceWorker.controller` is set after reload.

- [ ] **Step 7: README** — one line under features: installable as an app, works offline after the first visit.

- [ ] **Step 8: Commit** — `pwa: add manifest, icons and offline service worker`

---

### Task 14: Ship

- [ ] **Step 1: Full local run** — `rtk bun run guard && rtk bun run check && rtk vitest run && rtk bun run build && rtk playwright test --project=e2e && rtk bun run test:base`. All must pass; paste the summary.
- [ ] **Step 2: Ask the owner before pushing** (CLAUDE.md: push only when asked). On approval: `rtk git push`.
- [ ] **Step 3: Watch CI** — `rtk gh run watch`; on success, open `https://adehad.github.io/hadith-science/` and check the map, a division page, `/terms/`, and `/?mutawatir`.
- [ ] **Step 4: Report** — Pages URL, CI run link, and the owner's remaining manual step: connect the repo in Cloudflare Workers Builds.
