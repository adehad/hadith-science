# Test-suite audit: hadith-science @ `phase-3-mardud`

Static read only. Nothing was run, built or changed. The standard applied is `~/.claude/skills/writing-tests/SKILL.md`.
Runtime counts come from the content files: 169 terms, of which 103 are built (on a scene) and 66 pending. There are 21 scenes, 15 of them with panels, holding 72 built terms between them, plus 9 view scenes, 8 divisions and 32 sitemap routes.

## 0. Verdict in one paragraph

The unit suite is mostly healthy. The e2e suite is about 80% waste. **549 e2e runtime tests** break down like this:

- **≈350** run one code path once per data item: term landings, glossary landings, the reduced-motion loop, and division captions.
- **≈27** pin animation names and millisecond delays per scene.
- **≈30** restate copy: legend strings, chip lists, view notes, element counts.

The real value sits in about 30 behaviour tests: popover, carousel, view switch, motion switch, prefs, PWA, landing, plus the routes smoke loop.

Three things drive the bloat:

1. **Design.** Per-scene keyframes, colour mixing, `.cells` grids, xlinks and panel guards.
2. **The plan template.** Every "Verify:" bullet became a committed test (`docs/superpowers/specs/2026-10-28-phase-3-mardud-design.md:1265-1270`).
3. **Missing static checks over `dist`.** These would make the per-item browser loops unnecessary.

**Target:** about 118 e2e runtime tests, 66 of which are the unchanged routes smoke loop. Unit tests go from 142 to about 140, plus 5 static `dist` checks. The 96 screenshot runs come out of CI.

---

## 1. Inventory

### 1.1 Unit (`tests/unit`, vitest): 142 tests

| File | Describe | Tests | What it asserts |
|---|---|---|---|
| geom.test.ts | panelTrigger :6-27, rowTrigger :29-36 | 7 + 2 | panel guard throws when the hit area leaves its panel; (i) and hit placement |
| inventory.test.ts | inventoryErrors :6-13 | 6 | reserved, duplicate, unknown scene and unknown division slugs |
| kit.test.ts | 16 describes :4-234 | 44 | chip, pill, gauge, scale, disc, sweep, diamond, bracket, dots, stack, lifespan, overlap, letter and vowel maths |
| motion.test.ts | motionState :4-13 | 2 | on / off / system state table |
| orbit.test.ts | :4-24 | 4 | radii, planet position, radius cap, start-angle spacing |
| panels.test.ts | :8-27 | 6 | track width, snap stops |
| scene-inventory.test.ts | sceneErrors :16-74, captionsFor/cap :78-89 | 18 + 3 | scene↔term↔division integrity, panels tile, popover payload |
| staircase.test.ts | :6-48 | 8 | step boxes per view, foot on floor, step fill strings |
| terms.test.ts | :8-31 | 21 | targetPath, parseSlugQuery (10-case table), resolveQuery, RESERVED |
| url.test.ts | :4-29 | 11 | normaliseBase, href, absolute |
| views.test.ts | :7-27 | 10 | readView / writeView |

### 1.2 E2E (`tests/e2e`, Playwright, one Chromium project): 549 runtime tests

| File:line | Test or family | Generates | Asserts |
|---|---|---|---|
| scenes.spec.ts:47 | every scene term is counted | 1 | `built ≥ 30`, `panelScenes == 15` |
| scenes.spec.ts:52-64 | landing, desktop (loop over 103 built terms × {/t/, /?slug}) | **206** | URL hash, aria-expanded, popover visible, trigger in viewport |
| scenes.spec.ts:66-79 | landing, portrait carousel (loop over 72 terms) | **72** | as above, plus the trigger inside the scroller box |
| scenes.spec.ts:81 | tap on a visible trigger opens the popover | 1 | real click not intercepted |
| scenes.spec.ts:110-378 | `views` describe | 17 | see §4 |
| scenes.spec.ts:381, :398 | carousel portrait / landscape | 2 | dots, next, aria-current; no nav in landscape |
| scenes.spec.ts:408-426 | names grid (6 paths × portrait/desktop) | 12 | one column / two columns |
| scenes.spec.ts:428 | Key and Labels modes | 1 | legend ↔ labels, persists on reload, axe |
| scenes.spec.ts:445, :453, :483, :509, :516, :524 | scene prev/next | 6 | exact neighbour hrefs |
| scenes.spec.ts:493-507 | division moon captions (loop over 8 divisions) | 8 | each moon lists its scenes, else "Coming soon" |
| scenes.spec.ts:532-719 | per-scene tests (lone, lying, slips×2, sorting, changes×2, hidden, identity×2, causes×3) | 13 | see §4 |
| motion.spec.ts:10 | reduced motion: map has no animations | 1 | getAnimations, SMIL paused, planets and stars still |
| motion.spec.ts:26-34 | reduced motion per scene (loop over 21) | **21** | getAnimations empty, SMIL paused |
| motion.spec.ts:36 | planets move | 1 | angle changes |
| motion.spec.ts:44, :57 | map layout portrait / landscape | 2 | list vs orbit, orbit still in portrait |
| motion.spec.ts:65-443 | per-scene reduced-motion and with-motion pairs | **27** | see §4 |
| motion.spec.ts:445-590 | motion switch (WCAG 2.2.2) | 9 | switch, starfield, persistence, view transition, system, no-JS CSS, other tab, axe on/off |
| motion.spec.ts:592 | motion switch without script | 1 | hidden |
| contrast.spec.ts:53-70 | state-coloured SVG text, light/dark | 2 | ≥4.5:1 over 6 pages and their views |
| contrast.spec.ts:116-129 | text on a gold fill, light/dark | 2 | ≥4.5:1 over 5 hand-listed selectors |
| links.spec.ts:8-14 | pending term lands on glossary (loop over 66) | **66** | URL and entry in viewport |
| links.spec.ts:16-71 | ?slug, ?t=, ?t=unknown, stray key, unknown /t/, popover keyboard, popover click | 7 | |
| prefs.spec.ts:3, :22 | theme toggle; blocked storage | 2 | |
| pwa.spec.ts:4, :20, :28 | manifest, head links, SW offline | 3 | |
| routes.spec.ts:13 | sitemap lists routes | 1 | contains 4 routes, `length ≥ 16` |
| routes.spec.ts:19-33 | render cleanly + axe (33 routes × 2 themes) | 66 | no console errors, axe clean |

Totals: scenes 339, motion 62, contrast 4, links 73, prefs 2, pwa 3, routes 67. That is 550 (549 for e2e in the task's count, which is near enough).

### 1.3 Screenshots

`tests/screenshots/readme.spec.ts:38` produces 24 shots × 2 sizes × 2 themes = **96 runs**, with no assertions. **It runs in CI on every PR** (`.github/workflows/ci.yml`, `bun run screenshots` after `test:e2e`), and the PNGs it writes are thrown away with the runner.

---

## 2. Verdicts by family

### Unit

| Test | Verdict | Reason |
|---|---|---|
| geom panelTrigger/rowTrigger (geom.test.ts:6-36) | **KEEP** | Build-time guard against triggers cut by the carousel. A real bug class. |
| inventory, scene-inventory (all) | **KEEP** | Content integrity. This is the most fundamental test in the repo. |
| terms, url, views, panels, motion | **KEEP** | Core parsing and URL logic, including the base-path and `?slug` bugs. Exception: `reserved words` (terms.test.ts:31) restates a constant, so **DROP** it. inventory.test.ts:8 already proves that reserved slugs are rejected. |
| kit: chipRow, gaugeCells, scaleEnds, discRow, sweepAt, diamondPath clamp, bracketPath (throws and orientation), dotCluster, stackY, lifespanBar, spanOverlap | **KEEP** | Real branching, clamping and rounding. |
| kit: pillWidth "6.6 per char + 24" (kit.test.ts:15-18) | **DROP** | Restates the formula. The rounding case at :19 is enough. |
| kit: letterShape exact path (kit.test.ts:200-207) | **DROP** | A fixed shape with no branching. It is a pin. |
| kit: LETTER_DOTS (kit.test.ts:215-220) | **DROP** | Restates a data table. |
| kit: vowelMark exact strings (kit.test.ts:230-233) | **DROP** | Pin. The above/below property test at :224-229 is the real one. |
| orbit radii exact numbers (orbit.test.ts:5-8) | **DROP** | Restates constants. Keep the cap (:13-16) and the spacing invariant (:19-24). |
| staircase "places X's first and last steps" (staircase.test.ts:7-18) | **DROP** | Formula restatement. The floor invariant (:19-24) and the view relations (:27-40) are the behaviour. |
| staircase stepFill exact strings (staircase.test.ts:43-47) | **REPLACE** with "percentage strictly falls with depth" | The current test pins CSS text. |

### E2E

| Family | Verdict | With / why |
|---|---|---|
| scenes.spec.ts:47 term counted | **DROP** | Content count restatement. A static check that iterates the index fails loudly if it is empty. |
| scenes.spec.ts:52-64 desktop landings (206) | **REPLACE** | Use static check **S1** over `dist`, plus 2 browser tests (one `/t/`, one `/?slug`). All 206 run the same `popover.ts land()` path. |
| scenes.spec.ts:66-79 portrait landings (72) | **REPLACE** | Move the panel guard into `Term.astro` (smell D3), plus 1 browser test on a term in a non-first panel. |
| links.spec.ts:8-14 pending landings (66) | **REPLACE** | S1 (each `/t/<slug>/` refresh target exists, and `#slug` exists on `/terms/`), plus 1 browser test. |
| motion.spec.ts:26-34 reduced motion ×21 | **REPLACE** | One representative scene. Otherwise it tests `motion.css:7-9` (`* {animation:none!important}`) 21 times, which is testing a CSS feature. |
| motion.spec.ts per-scene "with motion" ×12 | **DROP** | Pins keyframe names and millisecond delays (e.g. :141-143, :164-165, :185, :223-227, :256-261, :282-289, :311-319, :373-375, :429-430) and one coordinate (:172 `toBe(154)`). |
| motion.spec.ts per-scene "reduced motion" ×13 | **REPLACE** | Static keyframe rule **S6** (smell D1). They currently check that each scene's base style equals the end state, a convention that should hold by construction. |
| motion.spec.ts:330 wording switch | **REPLACE** | Generic regression **V4** ("a view switch never restarts a finite animation"). The bug, a card blanking for 1s, is real; the per-scene form is not the right shape. |
| contrast.spec.ts (4) | **REPLACE** | Token contrast unit test (smell D2), plus a generic in-page SVG text check folded into routes smoke. The current lists (PAGES :5-12, ON_GOLD :75-81) only protect places someone remembered to list. |
| routes.spec.ts:19-33 smoke | **KEEP** | Per-page render and axe. Extend it with `?view=` states and a Labels-mode pass (see §5). |
| routes.spec.ts:13 | **KEEP** without the `≥16` count | The count restates content (:16). |
| views, carousel, Key/Labels, prev/next, division, per-scene | see §4 | |
| motion switch (motion.spec.ts:445-590) | **KEEP** 7, **DROP** 1 | `axe with motion on` (:581-589, state "on") repeats routes.spec in the default state. Keep "off", since only the switch's look changes. |
| prefs, pwa | **KEEP** | Own logic: storage fallback, SW query-ignoring precache (regression 9d82dc4). |
| links.spec.ts:16-43 | **KEEP** `?t=unknown` (:26) and unknown `/t/` (:40, the 404.astro:18-26 inline script) | **DROP** `bare ?slug` (:16, duplicated by the landing test), `?t=slug` (:21, same wiring, branch unit-tested at terms.test.ts:26) and `stray bare key` (:32, unit-tested at terms.test.ts:28; it also uses a `setTimeout(100)` wait). |
| links.spec.ts:45, :62 popover | **KEEP** | Popover is a core island. |
| screenshots in CI | **REMOVE FROM CI** | Not a test. Run on `workflow_dispatch` or locally. |

---

## 3. Design smells and the mechanism that removes each one

### D1. Per-scene keyframes and the reduced-motion "rest = end state" convention

**Evidence.** There are about 56 `@keyframes` in 15 scene files.

- 7 near-identical dash-draw keyframes: ActedOn.astro:216, Grades.astro:290, Hidden.astro:208, Lying.astro:222, Slips.astro:281, Support.astro:223, plus the opacity variants Knowledge.astro:250 and Sorting.astro:225.
- 9 `from{opacity:x}` fade-ins: Causes:256, Changes:414, Identity:193, Knowledge:251, Lone:210, Lying:221, Slips:282, Support:221-222, Sorting:227.
- Some declare a `to`/`100%` frame that has to match the base style by hand: Identity:191 (`to{opacity:0;transform:none}`), Grades:291-294, Wording:281/283.
- Names.astro:171-172 hand-copies both motion-off selectors from motion.css:7-11, because its base style isn't its rest state.

This is why the suite has 13 reduced-motion end-state tests plus 21 "no animations" tests.

**Mechanism.**

- In `src/styles/motion.css`, add `@keyframes draw{from{stroke-dashoffset:1}}` and `@keyframes enter{from{opacity:var(--from-o,0);transform:var(--from-t,none)}}`.
- Add the classes `.m-draw{stroke-dasharray:1;animation:draw var(--dur,.4s) ease-out both;animation-delay:var(--d,0s)}` and `.m-enter{animation:enter var(--dur,.4s) ease-out both;animation-delay:var(--d,0s)}`.
- With `from`-only keyframes, the end state *is* the element's own style by CSS definition, so reduced motion rests correctly with no per-scene CSS.
- Add `stagger(i, {start, step})` to `lib/kit.ts` for the `--d` values that scenes now compute ad hoc (e.g. `INS_D` in Changes, `delay()` in Support).
- Fix Names by making `.e1-.e4` rest at `.12` and animating up from there, then delete Names.astro:171-172.

**Single test.** `tests/unit/motion-css.test.ts` scans `src/**/*.{astro,css}` `<style>` blocks. It fails when a scene declares a finite keyframe with a `to`/`100%` frame. Loops (`infinite`) go on a short allowlist: flow, blink, pulse, changes-sway, names-*, sorting-flow, slips-pulse.

Keep **one** browser test: a scene with CSS animations, a transition and SMIL (e.g. `/al-mardud/causes/`) shows nothing running under `reduce`. The motion switch test (:453) already covers `data-motion=off`.

**Collapses.** motion.spec.ts:26-34 (21 tests), 13 reduced-motion scene tests and 12 with-motion scene tests: 46 browser tests become 1 unit test plus 1 browser test.

### D2. Per-scene contrast colour mixing

**Evidence.**

- The "state ink" `color-mix(state 65%, fg)` is retyped in Pill.astro:19-24, Hidden.astro:211, Innovation.astro:228, Wording.astro:263, ActedOn.astro:213 (`.unk`), Changes.astro:404 and Wording.astro:266.
- The "text on gold" `color-mix(fg 85%, surface)` is retyped in Causes.astro:252, Delivery.astro:172 and Grades.astro:267.
- `.vtag`/`.vtag-t` is copied verbatim in three scenes (Hidden:210-211, Innovation:226-228, Wording:261-263).
- `.card.ok/.pause/.reject/.gold` is copied in ActedOn:206-208 and Sorting:217-219.

contrast.spec.ts exists to police these copies (its header, :3-4, says as much).

**Mechanism.**

- In `src/styles/tokens.css :root`, add `--ok-ink`, `--pause-ink`, `--gap-ink`, `--gold-ink`, `--ok-tint`, `--pause-tint`, `--gap-tint`, `--gold-tint` and `--on-gold`, as `color-mix()` of existing tokens. They resolve per theme automatically, so each is defined once.
- Add a shared `src/components/svg/ViewTag.astro` (`{x, y, w, text, dashed?}`) and move `.card.<state>` into `svg.css`.
- Export the legal pairs from `src/lib/palette.ts`, e.g. `PAIRS = [["--pause-ink","--pause-tint"], ["--fg","--on-gold-fill"], …]`.

**Single test.** `tests/unit/contrast.test.ts` parses the light and dark blocks of tokens.css. It resolves `color-mix(in srgb …)` as a linear mix of gamma-encoded sRGB components (the CSS Color 5 definition) and asserts WCAG ≥ 4.5 for every pair in both themes. No browser needed, and it runs in milliseconds before the build.

**Compensating check.** Fold contrast.spec.ts's `measureOn` (:83-114), generalised to "every shown `main svg text` against the topmost filled shape under its centre", into the routes smoke loop. That covers both themes at no extra runtime tests, and catches text placed on a fill that isn't a declared pair.

**Collapses.** contrast.spec.ts (4 tests, 22 page loads).

### D3. Per-scene trigger, panel and guard maths

**Evidence.** `panelTrigger` (geom.ts:75-81) is used in only 10 of 15 panel scenes. Routes, Breaks, Unknown, Innovation and Delivery hand-place triggers with no guard. The 72-test portrait landing loop (scenes.spec.ts:66-79) is the only thing protecting their triggers from being cut off by the carousel.

**Mechanism.**

- Move the check into `src/components/svg/Term.astro`. `[scene].astro` sets `Astro.locals.panels = scene.panels`.
- `Term.astro` throws `"<slug> trigger leaves its panel"` if `{x, w}` isn't inside one panel.
- Add an escape prop `inTransformedGroup` for the rare trigger inside a translated group.
- `panelTrigger` then becomes plain `titleTrigger`, and every scene gets the guard for free.

**Single test.** Keep geom.test.ts's existing guard tests, re-pointed at the extracted pure function `assertInPanel(hit, panels, name)`. Add one portrait browser landing on a term in a non-first panel.

**Collapses.** 72 portrait landings become 1.

### D4. Hand-written cross-scene links and aria-labels

**Evidence.** `<a class="xlink" aria-label="…">` is written with its label typed separately from its visible text: Slips.astro:148, :155, :215; Identity.astro:139, :172; Causes.astro:170, :184, :209, :221. Label-in-name (WCAG 2.5.3) and href validity are therefore tested per scene: scenes.spec.ts:636, :646, :669-699, :701, :610, :604-607, :344, :521.

**Mechanism.** `src/components/svg/XLink.astro` with props `{ to: { division, id, hash? }, lines: string[], x, y, arrow?: boolean }`.

- It renders the tspans and the aria-hidden "→", and builds `aria-label = lines.join(" ") + " (scene: " + title + ")"`.
- It looks up the target scene via `loadContent()` and throws at build time when the scene, or a hash term, is missing.
- This matches the existing "link renders only when its target exists" rule in the design doc (Task 1, :1214).

**Single test.** Static check **S3** over `dist`: every internal `href` resolves to a file in `dist`, and every `#hash` resolves to an `id` or `data-term` on that page. It could live in `scripts/check-base.mjs`, which already walks every href (:52-72), as a second pass. Static check **S4**: every `a[aria-label]` / `[data-term-json][aria-label]` label starts with its visible text, after removing `aria-hidden` children. This keeps protecting authors who bypass `XLink`.

**Collapses.** 9 browser tests, plus several assertions inside view tests.

### D5. `.cells` grid copied six times

**Evidence.** Causes.astro:239-241, Changes:370-372, Grades:261-263, Identity:179-181, Names:141-143, Report:188-190 are byte-identical. That is why the names-grid loop runs over 6 paths (scenes.spec.ts:411).

**Mechanism.** `src/components/layout/CellGrid.astro`, or `.cells` in `base.css`.

**Single test.** One page in portrait and desktop. Arguably zero, since it is a media query.

**Collapses.** 12 tests become 1.

### D6. prev/next and moon captions computed inline in pages

**Evidence.**

- `[scene].astro:41-43` computes neighbours inline, and the result is tested by 6 e2e tests that restate the scene order (scenes.spec.ts:445-530).
- `[division]/index.astro:17` builds `moonScenes` inline, and it is tested by an 8-test loop (scenes.spec.ts:493-507).

**Mechanism.** `lib/scene.ts`: `neighbours(scenes, scene) → {prev?, next?}` (same division only) and `scenesByMoon(division, scenes) → Scene[][]`.

**Single test.** Unit tests: first has no prev, last has no next, a division boundary is never crossed, and a scene covering two moons appears under both. About 4 `it()`s.

**Collapses.** 14 e2e tests become about 4 unit tests.

### D7. View integrity checked per scene

**Evidence.** `viewswitch.ts` is already generic (good, :1-7). But each view scene re-tests the mechanism with its own content: scenes.spec.ts:124, :141, :193, :217, :227, :249, :275, :317, :363. Each also re-asserts "every term stays visible" (:157, :243, :262, :301, :343, :375) and repeats axe.

The real hazard is authoring: an element with `data-v-a` but no `data-v-b` keeps a stale transform when the reader switches to b.

**Mechanism.** In `lib/views.ts`, add `viewAttrs(byView: Record<string,string>, ids, prop="v")`. It returns `{ style, "data-v-<id>": … }` and throws if any id is missing. Scenes use it instead of writing attributes by hand.

**Single tests.**

- Static **S2** over `dist`, for each view scene: the buttons equal the yaml view ids; every `data-view-show` token is a known id; any element with one `data-v-*`/`data-h-*`/`data-fill-*` has it for every id; and the inline style equals the default-view value.
- Static **S1**: no trigger inside a `[data-view-show]` that excludes the default view, unless its term has `view:` (none do today).
- Browser: **V1** (`?view=` applied on load), **V2** (generic click-through), **V3** (animated transition ends at targets) and **V4** (no finite animation restarts on a switch).
- Routes smoke: each non-default `?view=` URL from scenes.yaml, 15 URLs.

**Collapses.** 17 view tests become 4.

### D8. Root cause in process: the plan template

`docs/superpowers/specs/2026-10-28-phase-3-mardud-design.md:1265-1270` (Task 9) mandates the following:

- "landing for all 31 terms, desktop and portrait";
- "views on hidden, wording and innovation";
- "grid stacking on causes, changes and identity";
- "the legend kinds per scene";
- "prev/next order through all ten scenes";
- "Add the eight scenes to motion.spec.ts".

Each task's "Verify:" bullets (:1218, :1224, :1230, …) were then committed as tests instead of being deleted, as the skill requires. Change the phase-4 template to copy the writing-tests rules and to name the static checks instead.

---

## 4. The hand-written scene and behaviour tests, one by one

Legend: **B** = protects real behaviour, **C** = restates content or copy, **T** = timing pin, **D** = duplicate.

### scenes.spec.ts

| Line | Test | Class | Verdict |
|---|---|---|---|
| 47 | every scene term is counted | C | DROP |
| 81 | tap on a visible trigger opens popover (portrait) | B | **KEEP**: overlay or scroll-snap intercepting taps |
| 113 | `?view=madinah` opens delivery on that view | B | **KEEP as V1**: data-v applied on load via the `no-anim` path (viewswitch.ts:42-49). Drop the redundant :120. |
| 124 | `?view=tirmidhi` grades | D + C | DROP: same path as 113. Axe moves to routes `?view=` smoke. |
| 132 | landing from `?view=tirmidhi` ends on default | D | DROP: fresh navigation with no `?view`. targetPath is unit-tested at terms.test.ts:9-12. |
| 141 | report: each view moves rings, names, triggers, moon counts | B + C | **REPLACE with V2**: a generic click-through on one scene, assertions derived from `data-views` and `data-view-show` rather than copy. The moon-g counts (:161-163) are C. |
| 166 | `?view=nested` + click khabar keeps view | D | DROP: popover clicks never touch the URL |
| 175 | `?view=nested&khabar` and `?view=nested#khabar` | B | **KEEP the second half as L5**, "a hash landing keeps `?view`" (popover.ts:124-129). The first half is unit-tested (`?a&b` ignored, terms.test.ts:18). |
| 193 | with motion, report rings slide to nested | D | DROP: V3 covers transitions |
| 204 | with motion, view switch updates URL, steps end at targets | B | **KEEP as V3**: double-rAF and seq logic (viewswitch.ts:35-39) |
| 217 | `?view=shafii` pill text | C | DROP |
| 227 | knowledge marker, note text, triggers, axe | C + D | DROP: S2, S1, routes `?view=` |
| 249 | hidden contemporary view text, legend text | C | DROP |
| 268 | hidden `?view=contemporary#mursal-khafi` keeps view | D | DROP: same path as L5 |
| 275 | wording 4 views: tags, changed-word counts, ret path, "unnamed" note once | C | DROP. If the "named once" editorial rule matters, make it a content lint on scenes.yaml `views[].note` (unit). |
| 310 | wording `?view=forgot#…` keeps view | D | DROP |
| 317 | innovation 3 views: question text, decision/pill counts, xlink | C | DROP: S2, S3 |
| 356 | innovation `?view=reject#bida` keeps view | D | DROP |
| 363 | opposition accept-all text | C | DROP |
| 381 | carousel portrait: scroll by panel, dots follow | B | **KEEP**: carousel.ts core |
| 398 | carousel landscape: no nav | B | **KEEP** (cheap; the a11y attributes come off outside portrait, carousel.ts:24-32) |
| 412/420 ×6 | names grid portrait/desktop | D | **REPLACE** with 1 after D5 |
| 428 | Key/Labels swap and persist | B | **KEEP**: prefs.ts:34-46 |
| 445, 453, 483, 509, 524 | prev/next order | C | DROP after D6 unit test |
| 516 | knowledge follows sorting; sorting pill links to it | C | DROP: D6 plus S3 |
| 493-507 ×8 | division moon captions | B (generic, but per-item browser) | **REPLACE** with the D6 unit test |
| 532 | lone: legend, viewtoggle, triggers, axe | C + D | DROP: the legend is decided by `LEGEND` in `[scene].astro:57-90`, triggers by S1, axe by routes (the comment at :24 is wrong for the default state) |
| 540 | lying: legend strings, no views, triggers, matn text | C | DROP |
| 552 | slips: legend string, triggers, munkar/shādhdh are links not triggers, illustration text, chip count | C | DROP. "Never a trigger" is structurally guaranteed: `cap()` (scene.ts:22-26) only builds caps for the scene's own captions. |
| 568 | sorting: no legend | C | DROP |
| 576 | changes: legend, 9 triggers, illustration count, card text | C | DROP |
| 592 | changes: sorter jumps scroll to cells, no popover; xlinks | mostly platform + C | DROP. Anchor scrolling is the browser; xlinks go to S3. Optional: fold "a non-term hash opens no popover" into L1 as one assertion. |
| 610 | hidden link lands on al-mazīd in changes | B (cross-scene hash landing) | DROP after S3: the hash target exists statically, and landing is covered by L1 |
| 620 | identity: legend, triggers, illustration text, name list | C | DROP |
| 636 | slips → innovation link, aria-label prefix, h1 text | B (label in name) + C | **REPLACE** with D4 plus S4 |
| 646 | identity → unknown links, labels, arrow aria-hidden | B + C | **REPLACE** with D4 plus S4 |
| 669 | causes ladder: order, label prefix, 200s | C + B | **REPLACE** with S3 and S4. The CAUSES order (:664-667) is C. |
| 701 | causes: click each of 10 rungs | D | DROP |
| 711 | causes: legend, triggers, "doesn't sort them", ghost count | C | DROP |

### motion.spec.ts

| Line | Test | Class | Verdict |
|---|---|---|---|
| 10 | reduced motion on map: nothing animates, stars and planets still | B | **KEEP**: JS rAF motion (orbit.ts:42, stars.ts:53). The `waitForTimeout(1000)` at :19 is acceptable for a "doesn't move" check. |
| 36 | planets move with motion | B | **KEEP** |
| 44 / 57 | map portrait list (orbit stopped) / landscape | B | **KEEP** :44 (orbit.ts:22, :54 tree-query stop). Merge :57 into it. |
| 65 | opposition scales rest tipped | B (Scale.astro tip: rest is end) | DROP after S6. The `tip` keyframe (motion.css:6) is already `from`-only. |
| 79 / 91 | support rest / with-motion sweep | B / T | DROP both: S6; :91 pins opacity ranges and the poll |
| 103 / 114 | acted-on rest / draw delay 1000 | B / T | DROP / DROP |
| 128 / 138 | sorting rest / delays 600, 2200… | B / T | DROP / DROP |
| 149 / 160 | knowledge rest + instant switch / delays + y=154 | B / T | DROP / DROP. The "switch is instant under reduce" part is motion.css; V3 covers the transition path. |
| 175 / 181 | lone rest / delays | B / T | DROP / DROP |
| 189 / 195 | hidden knot rest / delay 400 | B / T | DROP / DROP |
| 208 / 219 | lying rest / delays | B / T | DROP / DROP |
| 231 / 246 | slips rest / delays. Carries the CI-flake workaround (:250-255), which reads computed style because `getAnimations()` drops finished non-filling animations. | B / T | DROP / DROP. The flake goes away with the test. The sweepAt timing it re-asserts (:258) is unit-tested at kit.test.ts:90-104. |
| 268 / 278 | changes rest / delays | B / T | DROP / DROP |
| 295 / 307 | wording rest / delays | B / T | DROP / DROP |
| 330 | wording: switching view shows new words at once (the 1s blank bug) | **B, regression** | **REPLACE with generic V4**: on every view scene, let finite animations finish, click each view button, and assert no finite animation is running and no shown element's effective opacity is below 1 in the next frames. This guards the bug class (an animated element inside a `display:none` view group, Wording.astro:186) for every scene. |
| 358 / 369 | identity rest / delays and paused-first-frame | B / T | DROP / DROP |
| 396 | innovation arrows flow in every view, nothing else moves | C + T | DROP |
| 417 / 425 | causes rest / 10 delays | B / T | DROP / DROP |
| 453 | switch stops CSS and SMIL, name stays, aria-pressed | B | **KEEP** |
| 474 | switch stops starfield and orbits | B | **KEEP** |
| 488 | choice persists, set before first paint | B | **KEEP** (head script, Page.astro) |
| 506 | motion off skips view transition | B | **KEEP**: own code at Page.astro:58-60. Note the 20s `toPass` retry for a known browser flake (:516-523). Watch it. |
| 533 | system reduced: aria-disabled, says why, ignores clicks, recovers | B | **KEEP** |
| 557 | before prefs.ts runs, CSS shows off | B | **KEEP** (no-JS first paint) |
| 568 | another tab's choice applies | B | **KEEP** (prefs.ts:70-72) |
| 581 ×2 | axe with motion on / off | D / B | DROP "on", KEEP "off" |
| 594 | no-script: switch hidden | B | **KEEP** |

### contrast, links, prefs, pwa

| Line | Verdict |
|---|---|
| contrast.spec.ts:53, :116 (×2 themes) | REPLACE (D2) |
| links.spec.ts:16 / :21 / :32 | DROP (duplicate or unit-covered) |
| links.spec.ts:26, :40, :45, :62 | KEEP |
| prefs.spec.ts:3, :22 | KEEP |
| pwa.spec.ts:4, :20, :28 | KEEP. :28 is the regression for the `?view=` precache bug (9d82dc4) and the offline `?slug` path. |

**Answer to the owner's hunch.** Of the roughly 110 hand-written tests, about **30 protect real behaviour**: landing, the view mechanism, carousel, Key/Labels, the motion switch, popover, prefs, PWA, link labels and the 1s-blank regression. The rest restate content, pin timings, or repeat one mechanism once per scene. The value is concentrated in about 15 tests.

---

## 5. Target suite

### New static and unit checks

| Id | Where | What |
|---|---|---|
| S1 | `tests/dist/terms.test.ts` (vitest, reads `dist`) | For every term: `t/<slug>/index.html` meta-refresh equals `href(targetPath)`. A built term's target page has exactly one `[data-term=slug][data-term-json]`, not inside a non-default view part. A pending term has `#slug[data-entry]` on `/terms/`. |
| S2 | `tests/dist/views.test.ts` | View integrity (D7) |
| S3 | `scripts/check-base.mjs` second pass, or `tests/dist/links.test.ts` | Every internal href and hash resolves |
| S4 | `tests/dist/labels.test.ts` | Label-in-name for links and triggers |
| S6 | `tests/unit/motion-css.test.ts` | Finite keyframes are `from`-only (D1) |
| — | `tests/unit/contrast.test.ts` | Token pairs ≥ 4.5 in both themes (D2) |
| — | `tests/unit/scene-nav.test.ts` | `neighbours`, `scenesByMoon` (D6) |

The `dist` checks need a parser. `linkedom` is the smallest dev dependency; Bun's built-in `HTMLRewriter` avoids a dependency altogether. Add `"test:dist": "bun --bun vitest run --project dist"` and run it in CI right after `bun run build`.

### Browser suite after the changes

| File | Tests |
|---|---|
| routes.spec.ts | 1 sitemap + 66 smoke (unchanged loop), plus in-page SVG text contrast and, on figure scenes, a Labels-mode pass (toggle, axe, no `.mode-label` bbox overlapping other `svg text`) folded into the same tests (+0 tests), plus 15 non-default `?view=` URLs (light only) = **82** |
| landing.spec.ts (was scenes.spec.ts) | L1 `/t/` desktop, L2 `/?slug` desktop, L3 portrait non-first panel, L4 tap in carousel, L5 `?view=x#term` keeps view, pending `/t/` → glossary = **6** |
| views.spec.ts | V1–V4 = **4** |
| layout.spec.ts | carousel portrait, carousel landscape, cell grid, Key/Labels = **4** |
| motion.spec.ts | map reduced, one scene reduced (CSS + SMIL), planets move, map portrait/landscape (merged), switch ×7, axe off, no-script = **13** |
| links.spec.ts | `?t=unknown`, unknown `/t/`, popover keyboard/copy, popover click = **4** |
| prefs.spec.ts, pwa.spec.ts | **2 + 3** |
| contrast.spec.ts | deleted |
| **Total** | **118** (from 549) |

Unit: 142 − 10 drops + about 8 new ≈ **140**, plus **5** `dist` checks. Screenshots: **0 in CI** (from 96).

### CI time (estimate only; nothing was run)

Rough per-test costs:

- landing and link loops: about 1.5–2 s each (goto, fetch, redirect);
- smoke with axe: about 3 s;
- with-motion polls: up to 5–10 s.

| Step | Now | Target |
|---|---|---|
| e2e | ≈ 1,250 test-seconds ÷ 4 workers ≈ **5 min** | ≈ 400 ÷ 4 ≈ **1.7 min** |
| screenshots | ≈ **0.8–1 min** | 0 |

**Saving: about 4–4.5 minutes per CI run, roughly 70% of the browser time.** The main flake sources go too: the slips `getAnimations` workaround, the delay pins, and the `waitForTimeout`s at motion.spec.ts:335 and links.spec.ts:36. To get real numbers before and after, run `playwright test --reporter=json` and sum `duration`.

### Migration plan (small atomic commits, refactors before removal)

1. `ci: run screenshots only on demand`. Move `bun run screenshots` out of the `pull_request` path in ci.yml.
2. `test: check built terms, views, links and labels in dist`. Add S1–S4 plus `test:dist` and the CI step. Run them alongside the existing tests and fix anything they find.
3. `lib: extract scene neighbours and moon lists`. Add `neighbours` and `scenesByMoon` with unit tests; `[scene].astro` and `[division]/index.astro` use them.
4. `svg: check every trigger against its panel in Term`. D3. The build should still pass, which proves the five unguarded scenes are fine.
5. `svg: add XLink and use it for cross-scene links`. D4.
6. `scenes: share the cell grid`. D5.
7. `styles: add state ink and tint tokens; share ViewTag and card states`. D2, plus `tests/unit/contrast.test.ts`.
8. `motion: share draw and enter keyframes; rest is the end state`. D1 and Names.astro, plus `tests/unit/motion-css.test.ts`. Do this one scene at a time if diffs get large; screenshots before and after are the visual check.
9. `views: add viewAttrs and use it in view scenes`. D7.
10. `test: fold contrast and Labels-mode checks into the route smoke; scan ?view= states`.
11. `test: add generic view-switch animation regression (V4)`. Prove it fails on the pre-fix Wording markup (check out the parent of the fix locally), then keep it.
12. `test: replace per-term landing loops with representative landings`. Delete scenes.spec.ts:52-79 and links.spec.ts:8-14, and add L1–L5 plus pending.
13. `test: drop per-scene motion pins and the per-scene reduced-motion loop`. Delete motion.spec.ts:26-34 and :65-443, and add the single-scene reduced test.
14. `test: drop per-scene content and order tests`. The rest of scenes.spec.ts §4 DROPs, `contrast.spec.ts`, and links :16/:21/:32.
15. `test: drop formula-restating unit tests`. The kit, orbit, staircase and terms DROPs.
16. `docs: apply writing-tests rules to the phase plan template`. Covers D8.

Per the owner's commit rule, fix up earlier commits with `git history` rather than adding "fix previous" commits.

---

## 6. Risks: what is lost and how to compensate

| Lost coverage | Risk | Compensation |
|---|---|---|
| Per-term browser landing (278 tests) | A trigger that exists in HTML but is zero-size, covered, or off-screen at runtime | S1 (existence and default view), the Term panel guard (fit), L1–L3 (runtime path), and routes axe (`nested-interactive` and similar). Possible extra: in the routes smoke, assert every `[data-term-json]` has a non-zero bounding box. That is one evaluate call per page, adding no tests. |
| Per-scene reduced-motion end state | A scene animates something whose base style isn't its rest (e.g. `animation-fill-mode:backwards` with a 100% frame, or JS-set styles) | S6 forbids `to` frames. Optional single generic browser test M5: on each scene, finish all finite animations, snapshot computed opacity/transform/dashoffset of the animated elements, reload under `reduce`, and compare. That is one test looping in-page, not 21. |
| Per-scene axe in non-default views | Accessibility regressions in a view | Routes smoke scans every `?view=` URL |
| Hand-listed contrast pages | Text on a fill not declared as a pair | Generic in-page measurement in the routes smoke (both themes), plus the token unit test |
| Exact timings | Choreography order regressions (e.g. lens before routes) | Accept the loss. Those are design reviews, caught by eye and screenshots. If one ordering truly matters, unit-test the TS that computes it (`sweepAt`, `stagger`), as kit.test.ts:90-104 already does. |
| Content strings (legend kinds, illustration notes, chip names) | Wrong text ships | That is content review, not tests. If a rule matters ("each illustrated cell says so", "named once"), lint scenes.yaml in `sceneErrors` at build time. |
| Labels-mode overlaps (a past bug) | **Currently uncovered**; scenes.spec.ts:428 only checks the toggle | Add the bbox-overlap pass to the routes smoke on figure scenes (§5) |
| Screenshots no longer regenerated on each PR | README images go stale | `workflow_dispatch` job, or regenerate in the docs commit as the plans already do |
| Static checks depend on markup conventions (`data-term-json`, `data-view-show`) | A refactor renames an attribute and the check silently matches nothing | Each static check asserts a non-zero count of what it inspects (e.g. "found ≥1 trigger per built term"), which it does by construction for S1 |
