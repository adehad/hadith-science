# Phase 2: Mocked Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the five scenes proven in the mockup into the site. Each becomes a `/<division>/<scene>/` page with one diagram, term popovers and share links that land on the diagram. The page also gets the Key/Labels mode, "Other views" switches, a portrait carousel, "Read as text", and prev/next links.

**Architecture:**
- **Scenes collection:** a third content collection (`src/content/scenes.yaml`) holds each scene's words, views and panels. A build check ties it to the term inventory.
- **Page and diagrams:** one dynamic page, `[division]/[scene].astro`, renders the scene shell and picks the scene's diagram component from `src/components/scenes/`. The diagrams are built from shared SVG parts in `src/components/svg/`.
- **Logic and behaviour:** pure layout maths lives in `src/lib/` and is unit-tested. Behaviour lives in two new islands, `viewswitch.ts` and `carousel.ts`, plus a small hook in the existing `popover.ts`.

**Tech Stack:** as phase 1. Bun 1.4, Astro 7, TypeScript 5, Vitest 5, Playwright 1.64 with axe, prek.

**Spec:** `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Read §3–§7 and §9 first. Section numbers (§n) below refer to it.

**Visual reference:** `docs/concept/nuzhah-concept.html`, the approved mockup.
- Port its drawing code and CSS (by selector), don't redesign.
- Function names below refer to it: `person`, `arrow`, `term`, `chain`, `pill`, `speech`, `layerGuides`, `stairs`, `modeIcon`, `namesSvg`, `nameTag`, `slideStairs`, and the `SCENES` entries `counts`, `breaks`, `unknown`, `delivery`, `names`.

**Conventions for every task** (same as phase 1):
- **Shell and tooling:**
  - Prefix shell commands with `rtk`.
  - Use bun only: `bun add`, `bun run <script>`, `bunx`, `bun <file>.mjs`. Never npm, npx or node.
  - prek runs on every commit. If codespell flags a transliteration, add it to `.codespell-ignore`.
- **Commits:**
  - One commit per task, with a short subject in the form `area: what`. No attribution trailers.
  - Fix earlier commits with `git history` (fixup).
  - Never `git add` anything under `source/`, or any PDF.
- **Islands:**
  - Include them through a processed `<script>import "…";</script>`, never `is:inline`.
  - Site-wide islands go in `Page.astro`; page-specific ones go in the page.
- **SVG accessibility:** an SVG holding term triggers is `role="group"` with an `aria-label`, never `role="img"`.
- **Line endings:** working copies must stay LF. If a tool writes CRLF, convert it back before committing.
- **Windows shell:** in Git Bash, don't pass `/paths` through MSYS. Use `MSYS_NO_PATHCONV=1` if you must.

**Content rules (copyright, accuracy):**
- **Source material:** verify every caption, note and label against the *translation* paragraphs in `source/nuzhah.txt`. This file is git-ignored and local only.
  - Find the § heading, for example `5.19. Mursal`, and read up to the next `Commentary` line.
  - Never use text from the `Commentary` sections or from footnotes, because that is the thesis author's analysis.
- **Writing:** paraphrase in plain English and cite the §. Arabic is fully voweled.
- **Mockup captions:** where a mockup caption says something the translation doesn't, rewrite or drop it, and mention it in your report.
- **Known corrections:**
  - **Mursal:** Ibn Ḥajar defines mursal as a drop *after the Successor*, and says the missing narrator may be a Companion or another Successor (§5.19). So the ghost is labelled "missing", not "missing Companion".
  - **Mursal rulings (§5.19):**
    - the majority of hadith scholars pause (tawaqquf), when the Successor is known to drop only reliable narrators;
    - one of Aḥmad's two opinions, the Mālikīs and the Kūfīs accept it outright;
    - al-Shāfiʿī accepts it when another report supports it, whether connected or mursal.
    - The mockup's "Companion's fatwa / scholars acting on it" is not in the translation here, so it is dropped.
  - **Muʿḍal and munqaṭiʿ (§5.20):** muʿḍal is two or more drops in a row; munqaṭiʿ is drops that are not in a row, or a single drop. The translation's slip at §5.20 is in `notes/translation-queries.md`; follow the Arabic.
  - **Delivery views (§5.55):** checked. Mālik and other scholars of Madīna rejected the Iraqi denial of reading to the teacher, and some ranked reading above hearing. A large group, including al-Bukhārī, hold that the two are equal.
  - **Spec correction:** the spec's §4.3 "wider use of mursal" view comes from the thesis commentary, so it is not used. The breaks scene's views are the three rulings above. Task 12 updates the spec.

---

## File map

```
src/content.config.ts                 + scenes collection
src/content/scenes.yaml               5 scenes (added one per scene task)
src/content/terms.yaml                built terms get scene: (and view: if view-only)
src/lib/inventory.ts                  + sceneErrors()
src/lib/content.ts                    loads scenes, runs sceneErrors
src/lib/scene.ts                      caption lookup + popover JSON for diagrams
src/lib/views.ts                      ?view= read/write
src/lib/panels.ts                     carousel track width + snap stops
src/lib/staircase.ts                  delivery step boxes per view
src/components/svg/Term.astro         SVG term trigger (hit area + slot + InfoIcon)
src/components/svg/Arrow.astro        flow / skip arrow (mockup arrow())
src/components/svg/Chain.astro        vertical chain from the moon (mockup chain())
src/components/svg/LayerGuides.astro  generation rows (mockup layerGuides())
src/components/svg/Pill.astro         verdict pill (mockup pill())
src/components/svg/SpeechBubble.astro (mockup speech())
src/components/svg/Defs.astro         gold gradient + arrow markers, once per page
src/components/svg/Narrator.astro     + k (scale) prop, + label prop (mode label)
src/components/layout/Legend.astro    Key overlay (mockup LEGEND)
src/components/layout/ViewSwitch.astro "Other views" segmented control + notes
src/components/layout/Carousel.astro  portrait scroll-snap wrapper, dots, prev/next
src/components/layout/ReadAsText.astro
src/components/scenes/Routes.astro    counts
src/components/scenes/Breaks.astro    breaks
src/components/scenes/Unknown.astro   unknown
src/components/scenes/Delivery.astro  delivery
src/components/scenes/Names.astro     names
src/pages/[division]/[scene].astro    scene page
src/pages/[division]/index.astro      moons link to their scenes
src/pages/index.astro                 portrait tree: moons link to scenes
src/pages/narrators.astro             uses Term.astro
src/islands/viewswitch.ts
src/islands/carousel.ts
src/islands/popover.ts                beforeLand scrolls a carousel to the term
tests/unit/{scene-inventory,views,panels,staircase}.test.ts
tests/e2e/scenes.spec.ts              landing, views, carousel, modes
tests/screenshots/readme.spec.ts      + each scene
```

Scene URLs:

| Scene | Path | Views | Panels |
|---|---|---|---|
| How many routes carry it? | `/adad-al-turuq/routes/` | none | 4 |
| Where does the chain break? | `/al-mardud/breaks/` | `hadith-scholars` (default), `malikis`, `shafii` | 4 |
| Who is this narrator? | `/al-mardud/unknown/` | none | 2 |
| How was it received? | `/siyagh-al-ada/delivery/` | `ibn-hajar` (default), `madinah`, `bukhari` | 4 |
| Who is who? | `/al-asma/names/` | none | none (CSS grid) |

Check the division ids against `src/content/divisions.yaml` before using them.

---

### Task 1: SVG kit

Shared parts every scene uses, ported from the mockup's helpers.

**Files:**
- Create: `src/components/svg/{Term,Arrow,Chain,LayerGuides,Pill,SpeechBubble,Defs}.astro`
- Modify: `src/components/svg/Narrator.astro`, `src/pages/narrators.astro`

- [ ] **Step 1: `Defs.astro`.** Emits a `<defs>` holding three things:
  - the `#gold` linearGradient with its SMIL shimmer (move it out of `narrators.astro`);
  - the `#ah` marker (class `arrowhead`);
  - the `#ahg` marker (class `arrowhead gap`).

  These come from the mockup's hidden `<svg>` block. IDs must be unique per page, and every scene page has exactly one diagram SVG with `<Defs />` inside it. The Names grid has four SVGs: only the first includes `<Defs />`, and the others reference those IDs, which works within one document. Copy the `.arrowhead` CSS.

- [ ] **Step 2: `Narrator.astro`.**
  - **New props:**
    - `k` (scale, default `1.5`), so the transform becomes `translate(${x - 20*k} ${y - 22*k}) scale(${k})`. Check that `k = 1.5` still gives `translate(x-30 y-33)` so the figure key doesn't move.
    - `label` (string). When set, it is drawn as `<text class="lbl mode-label" x y={y + 22*k + 14}>` in page coordinates, outside the scaled group.
  - **Mode labels:** `src/styles/svg.css` (Step 5) holds
    ```css
    :root:not([data-mode="labels"]) .mode-label{display:none}
    ```
    so the labels only show in Labels mode (§3.5).
  - **No-JS default:** without JS, `data-mode` is unset, so the labels are hidden and the legend shows. That is the default "Key" mode.

- [ ] **Step 3: `Term.astro`.** A trigger is the element popover.ts listens to.

  Props are `slug`, `json`, `label`, `x`, `y`, `w` and `h`; the last four give the hit rectangle in SVG units. The markup is:
  ```astro
  <g class="term" data-term={slug} data-term-json={json} aria-label={label}>
    <rect class="hit" x={x} y={y} width={w} height={h} rx="8" />
    <slot />
  </g>
  ```
  The caller puts the visible text and an `<InfoIcon>` in the slot. Move these styles out of `narrators.astro` into Term:
  - `.term{cursor:pointer;outline:none}`
  - `.term .hit{fill:transparent}`
  - `.term:focus-visible .hit{stroke:var(--gold-b);stroke-width:2}`

  Then make `narrators.astro` use `<Term>` and `<Defs>`. Its page must look identical: compare a screenshot taken before and after.

- [ ] **Step 4: `Arrow.astro`.** Port the mockup's `arrow(x1,y1,x2,y2,skip,bend)`.
  - Props: `x1 y1 x2 y2 skip? bend?`.
  - The path class is `flow` or `skip`, with `marker-end` set to `url(#ah)` or `url(#ahg)`.
  - Copy the `.flow` and `.skip` CSS. They use the `flow` keyframe already in `motion.css`.
  - Arrows run in the direction of narration (§3.4).

- [ ] **Step 5: `LayerGuides.astro`, `Pill.astro`, `SpeechBubble.astro`, and a global `src/styles/svg.css`.**
  - Port `layerGuides(w)`. Its props are `w` and `layers`, an array of `[name, y]` pairs.
  - Port `pill(x,y,t,state)` with its four state CSS rules.
  - Port `speech(x,y,ar,en)`. The Arabic `<text>` gets `lang="ar"`.
  - **Shared SVG text and line classes go in one global sheet,** `src/styles/svg.css`, imported in `Page.astro` after `base.css`. This covers `.lbl`, `.lbl.ar`, `.lbl.gap`, `.title`, `.title-ar`, `.tr`, `.colhead`, `.layer`, `.rule`, `.divider`, `.rowhead`, `.rowsub`, `.flow`, `.skip`, `.arrowhead`, `.mode-label` and `.off`.
    - These classes can't be copied into each component's scoped style, because Astro scoped styles only match elements that component renders itself. Many `.lbl` texts come from Narrator, Chain or the scene components.
    - Drop the matching scoped rules from `narrators.astro`.
  - Component-only rules (`.pill*`, `.bubble path`) stay scoped in their own component.

- [ ] **Step 6: `Chain.astro`.** Port `chain(cx, kinds, labels)` with two changes:
  - **Layers:** the chain's rows come from a `layers` prop of `[name, y]` pairs. Row 0 is always the moon (`<Moon>`).
  - **Figures:** each figure is a `<Narrator k={0.9}>` instead of the mockup's `<use>` symbols, so chains use the figure language of §3.2. Map the kinds like this:

    | Kind | Narrator props |
    |---|---|
    | `sahabi`, `tabii`, `later` | `kind=` the same |
    | `majhul` | `kind="later" scroll="yes" seal="slot"` |
    | `mubham` | `kind="later" face="blank" scroll="slot" seal="slot"` |
    | `ghost` | `ghost` |

  Props:
  - `cx`;
  - `layers`;
  - `kinds` (one per row after the moon);
  - `labels?`: content labels that always show, such as "dropped";
  - `modeLabels?`: kind names for Labels mode, defaulting to the mockup's `KIND_NAME`, with the last figure named "Collector".

  Arrows follow the mockup's logic exactly:
  - Skip ghosts.
  - Join each figure to the previous figure that isn't a ghost.
  - When one or more rows are skipped, use a `skip` arrow bent by −70.

- [ ] **Step 7: Verify.**
  1. `rtk bun run check` reports 0 errors.
  2. `rtk bun run build` passes.
  3. Load `/narrators/` in Edge with `bun run preview` and compare it with a screenshot from before.
  4. `rtk bun run test:e2e` stays green (210 tests).

- [ ] **Step 8: Commit** `svg: add term, arrow, chain and pill parts`

---

### Task 2: Scenes collection and build checks

**Files:**
- Modify: `src/content.config.ts`, `src/lib/inventory.ts`, `src/lib/content.ts`
- Create: `src/content/scenes.yaml` (an empty list, `[]`, for now), `src/lib/scene.ts`, `tests/unit/scene-inventory.test.ts`

- [ ] **Step 1: Schema** in `content.config.ts`:
  ```ts
  const scenes = defineCollection({
    loader: file("src/content/scenes.yaml"),
    schema: z.object({
      id: slug,
      division: reference("divisions"),
      moons: z.array(z.number().int().min(0)).min(1), // indices into the division's moons this scene covers
      order: z.number().int().min(1),         // order within the division
      title: z.string(),
      eyebrow: z.string(),
      lede: z.string(),
      source: z.string(),                     // "§5.3 Mutawātir, §5.4 Mashhūr"; page adds the book and translator
      diagram: z.enum(["Routes", "Breaks", "Unknown", "Delivery", "Names"]),
      width: z.number().positive(),           // diagram viewBox width, for panels
      captions: z.array(z.object({ term: slug, note: z.string().max(420) })).min(1),
      views: z.array(z.object({ id: slug, label: z.string(), scholars: z.string(), note: z.string() })).optional(),
      panels: z.array(z.object({ id: slug, label: z.string(), x0: z.number(), x1: z.number() })).optional(),
    }),
  });
  ```
  - `note` is the longer paraphrase shown in the popover on this scene and in "Read as text".
  - `def` in terms.yaml stays the short glossary line.
  - The first view is the default (Ibn Ḥajar's view, §5).
  - Note that `file()` with an empty array must still load. If it doesn't, start the file with the routes scene in Task 4 instead, and keep this task's tests on pure functions.

- [ ] **Step 2: Failing tests** in `tests/unit/scene-inventory.test.ts` for a new export, `sceneErrors(scenes, terms, divisions)`. The arguments have these shapes:
  - `scenes: {id, division, moons, captions: {term}[], views?: {id}[], panels?: {x0,x1}[], width}[]`
  - `terms: InvTerm[]`
  - `divisions: {id, moons: string[]}[]`

  Write one test for each error below. The message strings must be exactly as shown.
  - `scene X: unknown division D`
  - `scene X: moon N out of range` (check every index in `moons`)
  - `scene X: duplicate id` (scene ids must be unique across divisions, so share links stay unambiguous)
  - `scene X: caption term T not in inventory`
  - `scene X: caption term T has scene S` (when the term's `scene`/`division` doesn't point back to this scene)
  - `term T: scene S does not caption it` (when a term has `scene: S` but S's captions lack T)
  - `term T: view V not in scene S`
  - `scene X: duplicate view id V`
  - `scene X: panels must tile 0..width` (sort by `x0`; the first `x0` must be 0, each `x0` must equal the previous `x1`, and the last `x1` must equal `width`)

  Also add one passing case with a valid scene.

- [ ] **Step 3: Implement** `sceneErrors` in `src/lib/inventory.ts`. Run `rtk bun run test` and expect PASS.

- [ ] **Step 4: Wire into `loadContent`.**
  - Load `scenes`, sorted by division order, then by `order`.
  - Map each scene's `division` to its id.
  - Call `inventoryErrors(raw, scenes.map(s => `${s.division}/${s.id}`), …)` (it already checks `division/scene`).
  - Then call `sceneErrors`, and throw on any errors from either.
  - Return `{ divisions, terms, scenes }`.

- [ ] **Step 5: `src/lib/scene.ts`.**
  ```ts
  // what a diagram needs to draw a term trigger: names for the label, and the popover payload
  export interface Cap { slug: string; translit: string; ar: string; en: string; section: string; note: string; json: string }
  export function captionsFor(scene, terms): Record<string, Cap>   // keyed by slug, json = {translit, ar, def: note, section}
  export function cap(caps: Record<string, Cap>, slug: string): Cap  // throws `scene caption ${slug} missing` so a typo fails the build
  ```
  Add a unit test for `cap`, covering the throw.

- [ ] **Step 6: Verify and commit.**
  1. `rtk bun run check`, `rtk bun run test` and `rtk bun run build` all pass.
  2. Commit `content: add scenes collection with inventory checks`.

---

### Task 3: Scene page shell

**Files:**
- Create: `src/pages/[division]/[scene].astro`, `src/components/layout/{Legend,ReadAsText}.astro`
- Modify: `src/pages/[division]/index.astro` (moon links), `src/pages/index.astro` (tree moon links)

- [ ] **Step 1: `[scene].astro`.** `getStaticPaths` comes from `loadContent().scenes`.

  Props: the scene, its division, `prev` and `next` (the scenes before and after it in the same division), and `caps = captionsFor(scene, terms)`.

  It renders, in this order:
  1. `<Page title="{title} · Nuzhat al-Naẓar, visualised" description={lede} crumbs={[Map, division, scene]} modes={hasFigures}>`. `hasFigures` is true for the Routes, Breaks and Unknown diagrams.
  2. A header: eyebrow, `<h1>{title}</h1>`, and the lede.
  3. `<ViewSwitch>` if the scene has views (Task 5). For now, leave a stub comment.
  4. A stage: `<div class="stage-wrap">`, holding the diagram inside `<Carousel>` when the scene has panels (Task 6), plus `<Legend>` when `hasFigures`.
  5. Diagram dispatch: a map typed `Partial<Record<Diagram, AstroComponentFactory>>`, rendered as `<D caps={caps} scene={scene} />`. Throw `no diagram component for ${scene.diagram}` when an entry is missing. Import only the components that exist; each scene task adds its own to the map.
  6. Source: `<p class="src">Ibn Ḥajar, <em>Nuzhat al-Naẓar</em> {source} (trans. A. S. Hussain, 2012).</p>`
  7. `<ReadAsText>`.
  8. Prev/next `<nav class="pn">`, the same style as the division page. With no prev, link "← {division term}" to the division page; with no next, link "{division term} →" to it as well.

  Also put a small `view-transition-name: scene-{id}` element in the header (a coloured planet-colour dot, `var(--p{order})`). The division page's moon dot for this scene carries the same name, so the moon morphs into the scene (§5). Wrap that name in the same reduced-motion handling as phase 1: it is only a name, and the `@view-transition` rule already sits under `no-preference`.

- [ ] **Step 2: `Legend.astro`.** An HTML overlay, `.legend`, ported from the mockup's `LEGEND` markup and its `.legend` CSS (including the ≤640px static rule).
  - Each entry is a tiny SVG holding `<Narrator k={0.6}>` or `<Moon k={0.6}>`, followed by the label.
  - Props: `kinds` (which entries to show).
  - The SVGs need the `#gold` gradient. Give the legend's first SVG its own `<Defs />` only if the page has no diagram SVG before it. Simpler: the legend comes after the diagram in the DOM and relies on the diagram's Defs. Note this in a comment.
  - `role="note" aria-label="Key"`.
  - Hide the legend in Labels mode: `:global(:root[data-mode="labels"]) .legend{display:none}`.

- [ ] **Step 3: `ReadAsText.astro`.** A `<details class="as-text"><summary>Read as text</summary>` block, with the same styles as narrators.astro (move them into this component and use it on narrators too).
  - An `<ol>` of captions: `<b>{translit}</b> <span lang=ar dir=rtl class=ar>{ar}</span> ({section}). {note}`.
  - When the scene has views, a "Views" `<ul>`: `<b>{label}</b> ({scholars}): {note}`.
  - A `<slot />` for extra paragraphs.
  - Make `captions` and `views` optional. narrators.astro passes neither and puts its own list in the slot, reusing only the wrapper and styles.

- [ ] **Step 4: Division page.** For each moon index `k`, list the scenes whose `moons` include `k` as links: `<a href={href(`${d.id}/${s.id}/`)}>` holding the moon dot and `s.title`.
  - The dot carries `view-transition-name: scene-{id}` only under the scene's *first* listed moon, so names stay unique on the page.
  - Show "Coming soon" only for moons with no scene.
  - Pass `scenes` in from `loadContent`.

- [ ] **Step 5: Map tree (portrait list).** A moon `<li>` with scenes gets links to them after the moon text. A moon without scenes stays plain text.

- [ ] **Step 6: Verify and commit.**
  1. `check` and `build` pass, with no scene pages yet.
  2. `test:e2e` stays green.
  3. Commit `scenes: add scene page shell, legend and read-as-text`.

---

### Task 4: Scene "How many routes carry it?"

**Files:**
- Create: `src/components/scenes/Routes.astro`
- Modify: `src/content/scenes.yaml`, `src/content/terms.yaml` (mutawatir, mashhur, aziz, gharib get `scene: routes`), `[scene].astro` dispatch map

- [ ] **Step 1: YAML entry.**
  - `id: routes`, `division: adad-al-turuq`, `moons: [0, 1]` (mutawātir and āḥād).
  - `order: 1`, `diagram: Routes`, `width: 820`.
  - `title`, `eyebrow` and `lede` come from mockup `counts`, re-checked against §5.3–5.6.
  - Captions: gharib, aziz, mashhur and mutawatir, with notes paraphrasing §5.3–5.6. Check each claim in the translation, for example that mutawātir gives certain knowledge (§5.3).
  - Panels: four, one per column, tiling 0..820. Use midpoints between the column centres (170, 340, 510, 700): `[0,255],[255,425],[425,605],[605,820]`.

- [ ] **Step 2: `Routes.astro`.** Port `SCENES.counts.svg()`:
  - `<svg viewBox="0 0 820 520" role="group" aria-label=…>` with `<Defs/>`.
  - The four LayerGuides rows.
  - Per column:
    - a `<Moon>`;
    - n figures per generation, with arrows exactly as in the mockup (scale 0.75 when n > 3);
    - `<Term>` around the column title (class `title`, 20px Fraunces), with an `<InfoIcon>` after it, at y=440;
    - the sub-line `.lbl`.
  - Figures use `<Narrator k={0.9}>`, with a `label` only on the first figure of each row (the mockup's `bare` logic).
  - Hit rect: about `x - textWidth/2 - 6`, `y - 22`, width `textWidth + 34`, height `30`. Estimate `textWidth = t.length * 11`.

- [ ] **Step 3: Verify.**
  1. `build` passes.
  2. Open `/adad-al-turuq/routes/` in Edge, in both themes. It matches the mockup.
  3. Clicking ʿAzīz opens the popover with the note.
  4. `?aziz` lands on it.
  5. `/t/aziz/` redirects to `/adad-al-turuq/routes/#aziz`.

- [ ] **Step 4: Commit** `scenes: add how-many-routes scene`

---

### Task 5: Views (`?view=`) and the "Other views" switch

**Files:**
- Create: `src/lib/views.ts`, `tests/unit/views.test.ts`, `src/components/layout/ViewSwitch.astro`, `src/islands/viewswitch.ts`

- [ ] **Step 1: Failing tests, then implement `src/lib/views.ts`.**
  ```ts
  // the chosen view lives in ?view= so a link opens on it (spec §5); the first id is the default
  export function readView(search: string, ids: string[]): string   // unknown or missing → ids[0]
  export function writeView(url: string, id: string, ids: string[]): string
  // returns the URL with ?view=id, or with view removed when id is the default; keeps other params and the hash
  ```
  Tests:
  - default when missing;
  - unknown value → default;
  - a valid value;
  - write adds the param;
  - writing the default removes it;
  - other params and the `#hash` are preserved.

- [ ] **Step 2: `ViewSwitch.astro`.** Props: `views`.

  Markup:
  ```html
  <div class="views" data-views="id1 id2 id3"><span class="eyebrow">Other views</span><div class="seg" role="group" aria-label="Whose view">buttons</div><p class="note">…</p></div>
  ```
  - Each button is `<button type="button" data-v={id} aria-pressed>`, with the label.
  - There is one note `<p>` per view, carrying `data-view-show={id}`. Only the default's is shown at build.
  - Copy the mockup's `.views`, `.seg` and `.note` CSS.
  - Hide the switch without JS (`:global(html:not(.js)) .views{display:none}`). The default view still renders, and "Read as text" lists every view.

- [ ] **Step 3: The view contract.** Diagram elements opt in through attributes, so the island stays generic:
  - `data-view-show="a b"`: shown only when the active view is in the list. This is set by toggling the class `off` (`.off{display:none}`, in `svg.css`).
  - `data-v-<id>="<css transform>"`: the element's `style.transform` for that view.
  - `data-h-<id>="<px>"` and `data-fill-<id>="<css colour>"`: `style.height` and `style.fill` for that view. These are for the staircase's `rect.step`.

  Diagrams render the default view's values inline, and carry these attributes for every view.
  - **Build output:** every `data-view-show` element whose list lacks the default view must already carry `class="off"`. This applies to notes, non-default pills and any view-only diagram parts. Without it, they overlap when JS is off and flash before the island runs.

- [ ] **Step 4: `src/islands/viewswitch.ts`** (included by `[scene].astro` only when the scene has views).
  - On load, `readView(location.search, ids)`, then `apply(id, false)`. Applying on load is instant, with no transition.
  - On a button click, `apply(id, true)` and `history.replaceState(null, "", writeView(location.href, id, ids))`.
  - `apply(id, animate)`:
    1. Set `aria-pressed`.
    2. Toggle `.off` on `[data-view-show]` across the whole page, so the notes and diagram parts switch together.
    3. For the transform, height and fill attributes: when `animate` and motion is allowed, set the values inside a double `requestAnimationFrame` (the mockup's `slideStairs`). Otherwise set them directly.
  - **Instant apply (`animate = false`):** CSS transitions on `.stepg` and `rect.step` would still animate the change on load.
    1. Add the class `no-anim` to `<html>`; `svg.css` holds `.no-anim *{transition:none!important}`.
    2. Set the values.
    3. Force a reflow (`document.body.offsetWidth`).
    4. Remove the class.
  - Under `prefers-reduced-motion` the CSS transitions are already disabled by `motion.css`, so the switch is immediate (§7.4).
  - Expose `window.nuzhah.setView(id)` (merged with the existing object) for the term landing in Task 6.
  - **Shared `window.nuzhah` type:** move the `declare global` out of popover.ts into `src/env.d.ts` (or a shared `src/lib/api.ts`). Declare one interface:
    ```ts
    interface NuzhahApi { openTerm?(slug: string): boolean; setView?(id: string): void; reveal?(el: Element): void }
    ```
    and `Window.nuzhah?: NuzhahApi`. If each island redeclares the property with a different type, `astro check` fails.

- [ ] **Step 5: Wire into `[scene].astro`.** Add the ViewSwitch above the stage and the island script. Run the unit tests and commit `views: add other-views switch with ?view= links`.

---

### Task 6: Portrait carousel

**Files:**
- Create: `src/lib/panels.ts`, `tests/unit/panels.test.ts`, `src/components/layout/Carousel.astro`, `src/islands/carousel.ts`
- Modify: `src/islands/popover.ts` (`beforeLand`), `[scene].astro`

- [ ] **Step 1: Failing tests, then implement `src/lib/panels.ts`.**
  ```ts
  // spec §5 carousel: one SVG, wider than the screen in portrait; panels are x-slices of the diagram.
  // The track is sized so the widest panel fits the viewport (spec says n × viewport; uneven panels make that
  // overflow, so we size by the widest panel instead).
  export function trackWidthPct(width: number, panels: {x0:number;x1:number}[]): number  // = width / max(x1-x0) * 100
  export function stops(width: number, panels): { left: number; w: number }[]            // percentages of the track
  ```
  Tests:
  - equal panels;
  - uneven panels: the widest panel's `w` × track% / 100 equals 100;
  - stops sum to 100%.

- [ ] **Step 2: `Carousel.astro`.** Props: `panels`, `width`.
  ```html
  <div class="carousel" style="--track: {pct}%">
    <div class="scroller" tabindex="0" role="region" aria-label="Diagram, swipe for more">
      <div class="track"><slot /> {stops.map(s => <span class="snap" style="left:{s.left}%;width:{s.w}%" data-label={label}></span>)}</div>
    </div>
    <div class="cnav"><button class="cprev" aria-label="Previous panel">‹</button>{dots: <button class="dot" aria-label="Panel n: label">}<button class="cnext" aria-label="Next panel">›</button></div>
  </div>
  ```
  CSS:
  - `.cnav{display:none}` by default.
  - Under `@media (max-width:640px) and (orientation:portrait)`:
    - `.scroller{overflow-x:auto;scroll-snap-type:x mandatory}`
    - `.track{position:relative;width:var(--track)}`
    - `.snap{position:absolute;top:0;bottom:0;scroll-snap-align:center;pointer-events:none}`. The spans sit on top of the SVG, so without `pointer-events:none` they would swallow taps on term triggers. Snapping still works, because snap areas come from layout.
    - `.cnav{display:flex}`
  - Outside that query, `.track` is 100% wide and the snaps are hidden, so landscape shows the whole diagram (§5).
  - `.stage` already has `overflow-x:auto`. In portrait, `.stage` must not scroll as well. Add `.stage:has(.carousel){overflow:hidden}` to `base.css`; scoped CSS in Carousel can't reach its parent.
  - Without JS the dots do nothing, but swiping still works. Hide `.cnav` buttons under `html:not(.js)`.

- [ ] **Step 3: `src/islands/carousel.ts`.**
  - **Dots:** each `.carousel`'s dots scroll the scroller so the matching `.snap` is centred, with `behavior: "smooth"` unless reduced motion.
  - **Prev/next:** move by one panel.
  - **Active dot:** on scroll (passive, rAF-throttled), the nearest snap's dot gets `aria-current="true"`.
  - **Keyboard:** ←/→ on the focused scroller move by a panel.
  - **API:** expose `window.nuzhah.reveal(el)`. It finds the element's `.carousel` ancestor and centres its scroller on the element without animation:
    `scroller.scrollLeft += r.left + r.width / 2 - (sr.left + sr.width / 2)`, where `r` and `sr` are the element's and the scroller's rects. Snapping then settles it on the nearest panel.

- [ ] **Step 4: `popover.ts` `beforeLand(el)`.** Replace the no-op with:
  1. `const v = el.closest("[data-view-show]")`. If the term is only in a non-default view, call `window.nuzhah?.setView?.(firstIdOf(v.dataset.viewShow))`.
  2. Then call `window.nuzhah?.reveal?.(el)`.

  Island order matters: popover runs `land()` on load, so it must run after the carousel and viewswitch islands have registered. Include `carousel.ts` and `viewswitch.ts` *before* `popover.ts`, or defer `land()` with `queueMicrotask`/`requestAnimationFrame`. Choose the deferral (it's robust to include order) and comment why.

  In `land()`, change the scroll to `el.scrollIntoView({ block: "center", inline: "nearest" })`, so it doesn't fight `reveal`'s horizontal positioning.

- [ ] **Step 5: Wire up and verify.**
  1. In `[scene].astro`, wrap the diagram in `<Carousel>` when `scene.panels` is set.
  2. Check at 390×844 in Edge: routes swipes between four panels, the dots update, `?mutawatir` lands with the Mutawātir column in view and the popover open as a bottom sheet.
  3. Check at 844×390: the full diagram, with no dots.
  4. Commit `scenes: add portrait carousel for wide diagrams`.

---

### Task 7: Scene "Where does the chain break?"

**Files:**
- Create: `src/components/scenes/Breaks.astro`
- Modify: scenes.yaml, terms.yaml (muallaq, mursal, mudal, munqati get `scene: breaks`), the dispatch map

The spec (§4.3) asks for all four omission types, so this extends the mockup's two chains to four.

- [ ] **Step 1: YAML.**
  - `id: breaks`, `division: al-mardud`, `moons: [0]`, `order: 1`, `width: 820`.
  - Eyebrow: `Rejected for a break in the chain · §5.18–5.20`.
  - Lede (paraphrase): all four lose narrators; what separates them is where the gap sits and how many links are missing in a row.
  - Captions:
    - **mursal:** drop after the Successor; the missing narrator could be a Companion or another Successor, §5.19.
    - **muallaq:** the collector drops one or more at his own end; the whole chain may go, §5.18.
    - **mudal:** two or more in a row, anywhere, §5.20; it can overlap with muʿallaq.
    - **munqati:** drops not in a row, or a single one, §5.20; follow the Arabic.
  - Views, the mursal ruling (§5.19), with ids and labels:

    | id | Label | Pill state | Pill text |
    |---|---|---|---|
    | `hadith-scholars` | "Most hadith scholars" | `pause` | "Paused (tawaqquf)" |
    | `malikis` | "Mālikīs, Kūfīs, Aḥmad (other opinion)" | `accept` | "Accepted" |
    | `shafii` | "al-Shāfiʿī" | `support` | "Accepted if supported" |

    Notes paraphrase §5.19, scholars `§5.19`. The `hadith-scholars` view is Ibn Ḥajar's framing (he reports the majority first), so it's the default.
  - Panels: four chains at cx = 115, 315, 515, 715 → `[0,215],[215,415],[415,615],[615,820]`.

- [ ] **Step 2: `Breaks.astro`.**
  - **Layers:** six rows, so that muʿḍal and munqaṭiʿ don't overlap muʿallaq: Prophet ﷺ 60, Ṣaḥābī 140, Tābiʿī 215, Later 290, Later 365, Collector 440. LayerGuides use these; the `Later` label shows on both rows.
  - **Chain columns:** dividers between the columns as in the mockup.

    | Chain | Kinds | Labels |
    |---|---|---|
    | Mursal | `ghost, tabii, later, later, later` | "missing" on the ghost |
    | Muʿallaq | `sahabi, tabii, later, ghost, later` | "dropped" (next to the collector) |
    | Muʿḍal | `sahabi, ghost, ghost, later, later` | "two in a row" |
    | Munqaṭiʿ | `sahabi, tabii, ghost, later, later` | "one, mid-chain" |

  - **Pills, y=22:** the mursal column has three pills, each `data-view-show` for its view. The other columns get `Pill state="reject"`: "Rejected unless named elsewhere" (muʿallaq, §5.18) and "Rejected" for the other two. Check the pill text fits a 200-unit column; shorten it if not.
  - **Term titles:** `<Term>` titles at y=500.
  - Make the left layer-label column fit. The mockup's `x1=90` guide start may need to shrink to about 70 for four columns.

- [ ] **Step 3: Verify.**
  1. Desktop in both themes: the four chains are readable.
  2. The view switch changes the pill and note; `?view=shafii` opens on al-Shāfiʿī.
  3. The portrait carousel works, and `?mudal` lands.

- [ ] **Step 4: Commit** `scenes: add where-the-chain-breaks scene`

---

### Task 8: Scene "Who is this narrator?"

**Files:**
- Create: `src/components/scenes/Unknown.astro`
- Modify: scenes.yaml, terms.yaml (mubham and majhul get `scene: unknown`), the dispatch map

- [ ] **Step 1: YAML.**
  - `id: unknown`, `division: al-mardud`, `moons: [1]` (criticism: jahāla), `order: 2`, `width: 820`.
  - Eyebrow: `Rejected for doubt about a narrator · §5.35–5.36`.
  - Captions:
    - **mubham:** unnamed, e.g. "a man" or "an elder"; nothing to check, §5.36. Verify what §5.36 says about acceptance.
    - **majhul:** named, but too little known; one student, or no one vouching, §5.35.
  - Panels: `[0,480],[480,820]`.

- [ ] **Step 2: `Unknown.astro`.** Port `SCENES.unknown.svg()`.
  - Two `<Chain>`s using the standard five rows (the mockup's `LAYERS`):
    - mubham at cx=300 with kinds `sahabi, tabii, mubham, later`;
    - majhul at cx=660 with kinds `sahabi, tabii, majhul, later`.
  - `<SpeechBubble>` "حَدَّثَنِي رَجُلٌ" / "“a man told me”" coming from the narrator *below* the mubham. That is the collector-side figure who says it (§3.3). Place it beside the figure at row 4 (y=440), as in the mockup.
  - The figures now show scroll/seal slots through Chain's kind mapping, matching the figure key.
  - Term titles at y=500.

- [ ] **Step 3: Verify and commit** `scenes: add who-is-this-narrator scene`

---

### Task 9: Scene "How was it received?"

**Files:**
- Create: `src/lib/staircase.ts`, `tests/unit/staircase.test.ts`, `src/components/scenes/Delivery.astro`
- Modify: scenes.yaml, terms.yaml, the dispatch map

- [ ] **Step 1: Failing tests, then implement `src/lib/staircase.ts`.**
  ```ts
  // the delivery staircase (mockup stairs()): a view places step i in column col[i] at height lvl[i]
  export const STEP_W = 105, TOP0 = 60, RISE = 32, FLOOR = 470;
  export interface StairView { col: number[]; lvl: number[] }
  export function stepBox(v: StairView, i: number): { x: number; top: number; h: number }
  // x = 10 + col*STEP_W, top = TOP0 + lvl*RISE, h = FLOOR - top
  export function stepFill(lvl: number): string  // color-mix(in srgb,var(--gold-b) ${30-lvl*3.5}%,var(--surface))
  export const STAIR_VIEWS: Record<"ibn-hajar"|"madinah"|"bukhari", StairView>  // mockup values: I8; [1,0,2,…]; lvl [0,0,2,…]
  ```
  Tests: `stepBox` for i = 0 and 7 in each view; Madīna swaps the columns of steps 0 and 1; Bukhārī puts steps 0 and 1 at the same height.

- [ ] **Step 2: YAML.**
  - `id: delivery`, `division: siyagh-al-ada`, `moons: [0, 1, 2]` (eight ranks; muʿanʿan, through `an`; ways of receiving), `order: 1`, `width: 860`.
  - Views:
    - `ibn-hajar`: "Ibn Ḥajar's ranking";
    - `madinah`: "Some scholars of Madīna";
    - `bukhari`: "al-Bukhārī and many others".
    - Scholars `§5.55`; the notes are from Phase 2's content rules.
  - Captions, one per trigger, with notes from mockup `delivery.caps`, each checked against §5.55–5.58 (watch the claims about al-Nasāʾī, Ibn al-Ṣalāḥ and "still better than a muʿḍal"; keep only what the translation says):
    - samitu, haddathana, akhbarana, qaratu-alayhi, quria-alayhi, anbaana, nawalana, shafahani, kataba-ilayya, an, imla;
    - below the stairs: wijada, wasiyya, ilam, ijaza-amma.

    The terms ijaza-majhul, ijaza-madum and ijaza-muallaqa stay pending unless they get their own trigger. Mention the choice in your report.
  - Panels: four, two steps each, `[0,220],[220,430],[430,640],[640,860]`. The basement boxes at `10 + k*212` fall one per panel.
  - Set `scene: delivery` on each captioned term.

- [ ] **Step 3: `Delivery.astro`.** Port `stairs(v)` and `modeIcon`.
  - **Steps:** each step is a `<g class="stepg">` with `style="transform:translate(x px, top px)"` for the default view, plus `data-v-<id>` for each view. The `rect.step` carries `style="height;fill"` plus `data-h-<id>` and `data-fill-<id>`. The rank-arrow `<g>` gets the x-only transforms the same way. Copy the `.stepg` / `rect.step` transitions from the mockup CSS.
  - **Triggers:** each Arabic line (and its transliteration) is wrapped in `<Term>` for its slug. Lines in a step map to slugs like this:

    | Step | Line 1 | Line 2 |
    |---|---|---|
    | 1 | samitu | haddathana |
    | 2 | akhbarana | qaratu-alayhi |
    | 3 | quria-alayhi (both lines together form one trigger) | |
    | 4 | anbaana | |
    | 5 | nawalana | |
    | 6 | shafahani | |
    | 7 | kataba-ilayya | |
    | 8 | an (both lines) | |

    Each trigger holds a small `<InfoIcon r={6}>` at the right of its line. The mockup's step-header info icon is dropped. The "best of all: dictated (imlāʾ)" label above step 1 is the `imla` trigger. Each basement box is a trigger for its term, with the InfoIcon at its top-right.
  - The Arabic `<text>` gets `lang="ar"`.
  - The SVG is `role="group"`, `aria-label` as in the mockup.

- [ ] **Step 4: Verify.**
  1. The view switch animates the steps into their new places, with the arrows following.
  2. With reduced motion the switch is instant.
  3. `?view=madinah` opens with steps 1 and 2 swapped.
  4. `?wijada` lands in the portrait carousel.
  5. Commit `scenes: add how-was-it-received staircase`.

---

### Task 10: Scene "Who is who?"

**Files:**
- Create: `src/components/scenes/Names.astro`
- Modify: scenes.yaml, terms.yaml (muttafiq-wa-muftariq, mutalif-wa-mukhtalif and mutashabih get `scene: names`), the dispatch map

- [ ] **Step 1: YAML.**
  - `id: names`, `division: al-asma`, `moons: [0, 1, 2]`, `order: 1`, `width: 860`, no panels.
  - Three captions, with notes from mockup `names.caps` checked against §5.59–5.61. The ʿAlī ibn al-Madīnī remark and the Shurayḥ/Surayj example must be in the translation, or they are dropped.
  - The worked example (ʿAbd Allāh ibn Zayd, §5.61) is not a term. It is a visible heading in its cell, with its explanation in "Read as text" through the slot.

- [ ] **Step 2: `Names.astro`.** Port `namesSvg()`, but as four cells in an HTML CSS grid (§5: one copy of each cell).
  - Layout: `<div class="cells">` with `grid-template-columns: 1fr 1fr`, one column under `(max-width:640px) and (orientation:portrait)`.
  - Each cell is its own `<svg viewBox="0 0 430 280" role="group|img">`, with the mockup's coordinates shifted by the cell origin (subtract 430 from x for the right column, 280 from y for the bottom row).
  - Cell 1 holds `<Defs/>`.
  - The term titles are `<Term>`s.
  - Keep the filter-box keyframes (`c1–c4`, `e1–e4`, `win`) and the blinking `.diff` and `.dot`.
  - Cells sit inside the `.stage` background. Drop the divider lines and use grid gaps with a `var(--rule)` border between cells.
  - `nameTag`'s Arabic gets `lang="ar"`. `<tspan class="diff">` stays.

- [ ] **Step 3: Verify and commit.**
  1. Desktop shows a 2×2 grid; portrait shows one column.
  2. `?mutashabih` lands.
  3. Reduced motion stops the filter animation and leaves the final state visible. Check that `.win` and the dropped rows still read sensibly with animation off; if not, add a reduced-motion rule showing the end state.
  4. Commit `scenes: add who-is-who names grid`.

---

### Task 11: End-to-end tests and screenshots

(Superseded: the test audit, `docs/superpowers/plans/2026-10-29-test-audit.md`, replaced these per-term and per-scene tests with generic checks; later phases follow the tests paragraph of the al-mardud design §16.)

**Files:**
- Create: `tests/e2e/scenes.spec.ts`
- Modify: `tests/e2e/links.spec.ts` (if it lists pending terms only), `tests/e2e/motion.spec.ts`, `tests/screenshots/readme.spec.ts`, `README.md`, `docs/screenshots/*`

`routes.spec.ts` already reads the sitemap, so the five scene pages get the axe and console checks in both themes automatically. Confirm the route count rises by 5.

- [ ] **Step 1: `scenes.spec.ts`.** Read `dist/terms-index.json`. The built terms are the entries whose target isn't `terms/#…`.
  - **Every built term, desktop (1280×800):**
    - `/t/<slug>/` lands on a URL ending `#<slug>`;
    - `[data-term="<slug>"]` has `aria-expanded="true"`;
    - `#term-pop` is visible;
    - the trigger is in the viewport.
  - **Same with `/?<slug>`.**
  - **Portrait (390×844), every built term in a panels scene:** `/?<slug>` lands, and the trigger's bounding box lies inside the scroller's box horizontally.
  - **Portrait tap:** on `/adad-al-turuq/routes/` at 390×844, *clicking* the first visible trigger opens the popover. This catches overlays that swallow taps.
  - **Views:**
    - `/siyagh-al-ada/delivery/?view=madinah`: the madinah button has `aria-pressed=true`, and step 1's `getComputedStyle(...).transform` matches its madinah target.
    - Clicking "al-Bukhārī": the URL has `view=bukhari`, and after the transition (poll with `expect.poll`) the transforms match the targets.
    - `getComputedStyle().transform` returns `matrix(a,b,c,d,tx,ty)`, so compare the parsed tx/ty with the px values in `data-v-*`.
    - Clicking the default removes `view` from the URL.
    - `/al-mardud/breaks/?view=shafii` shows the "Accepted if supported" pill and hides the others.
  - **Carousel:**
    - At 390×844, `.scroller` has `scrollWidth > clientWidth`, and the next button moves `scrollLeft` and the active dot.
    - At 844×390 on the same page, `scrollWidth <= clientWidth + 1` and `.cnav` is hidden.
  - **Names grid:** at 390×844, the cells stack (each cell's left edge is the same).
  - **Modes:** on `/al-mardud/breaks/`:
    - in Key mode, `.legend` is visible and `.mode-label` is hidden;
    - after clicking Labels, the legend is hidden and the labels are visible;
    - after a reload, it is still Labels (localStorage).
  - **Prev/next:** `/al-mardud/breaks/` has a next link to `/al-mardud/unknown/`.
  - **Division page:** `/al-mardud/` links to both scenes and still shows "Coming soon" only for moons without scenes.

- [ ] **Step 2: `motion.spec.ts`.** Add the scene routes to the reduced-motion check, `document.getAnimations()` empty. The SMIL shimmer is paused by prefs.ts, and `getAnimations` ignores SMIL.

- [ ] **Step 3: Screenshots.** Add each scene: desktop light, desktop dark, mobile (390×844) light, and mobile dark. Run `rtk bun run screenshots` and look at every new PNG. Add a "Scenes" section to the README with a few of the images, plus one line on Key/Labels and Other views.

- [ ] **Step 4: Full verify.**
  1. `rtk bun run guard`
  2. `rtk bun run check`
  3. `rtk bun run test`
  4. `rtk bun run build`
  5. `rtk bun run test:base`
  6. `E2E_PORT=<free> rtk bun run test:e2e` (run it twice if anything is flaky, and report it)
  7. `rtk bun run screenshots`

- [ ] **Step 5: Commit** `test: add scene landing, views, carousel and mode tests`, and separately `docs: add scene screenshots` if the README and images are a separate logical change.

---

### Task 12: Spec and notes

- [ ] **Step 1: Spec, §4.3 breaks row.** Replace "Other view: some scholars' wider use of *mursal*" with "Other views: the rulings on mursal (§5.19): the majority pause, the Mālikīs and Kūfīs accept, al-Shāfiʿī accepts with support". Add a short note that the wider definition is from the thesis commentary, so it is out of scope.
- [ ] **Step 2: Spec, §5 carousel.** Note that the track is sized by the widest panel.
- [ ] **Step 3: Spec, §4.3 breaks scene.** Note that it uses six rows so the four omission types don't overlap.
- [ ] **Step 4: Notes.** Add to `notes/annotation-usage.md` any owner annotation used in scene notes (check `source/highlights.txt` and `source/annotations.txt` for §5.2–5.6, 5.18–5.20, 5.35–5.36, 5.55–5.61). Add any new translation slips to `notes/translation-queries.md`.
- [ ] **Step 5: Commit** `docs: update spec for phase 2 scenes`

---

## Ship

Work on branch `phase-2-scenes`. After the final review:
1. Push the branch and open a PR to `main`. The description summarises the scenes and the content corrections, and ends with the attribution lines.
2. CI runs on the PR, and the Cloudflare preview builds the branch.
3. The owner merges, which deploys to Pages.
