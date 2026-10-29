# Phase 3, division 3 (al-Mardūd): scene design

Date: 2026-10-29
Status: design for owner review. No site code yet. The next step is a plan, then the build on `phase-3-mardud`, reviewed through the PR preview (spec §4.3).
Spec: `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Section numbers like spec §3.2 refer to it; bare § numbers (§5.23) refer to the book. "The al-Maqbūl design" is `docs/superpowers/specs/2026-10-28-phase-3-maqbul-design.md` and "the ʿAdad al-ṭuruq design" is `docs/superpowers/specs/2026-10-28-phase-3-turuq-design.md`. This doc follows their structure and their interim rules (al-Maqbūl §13, ʿAdad al-ṭuruq §14).

## 0. Summary

Division 3 already has two scenes: *Where does the chain break?* (`breaks`: muʿallaq, mursal, muʿḍal, munqaṭiʿ) and *Who is this narrator?* (`unknown`: mubham, majhūl, majhūl al-ʿayn, mastūr). The other **31 terms** get **eight new scenes**. Neither existing scene is redesigned; they only change `order`, so the division opens with an overview and then follows the book. All 31 terms land on a scene, and none stay pending.

The brief asked for roughly five to seven scenes. Eight is one more, because the deliberate changes of §5.33–5.34 (shortening, telling by meaning, rare words) are split from the seven forms of mukhālafa. Folded together they would make one scene of 12 terms and eight grid cells. Open question 1 offers the fold.

| # | Scene | Path | Moons | Form | Terms | Views | Mobile |
|---|---|---|---|---|---|---|---|
| 1 | Why is a report rejected? | `/al-mardud/causes/` | 0, 1 | Two cells: three mini chains for where a drop sits and whether it shows, and a ladder of the ten causes from the gravest down, each rung linking to its scene | 2 | none | grid |
| 2 | Where does the chain break? | `/al-mardud/breaks/` | 0 | (existing, unchanged) | 4 | (existing) | 4 panels |
| 3 | Did he hear it from him? | `/al-mardud/hidden/` | 0 | Three panels, each a pair of lifespan bars over a chain fragment with a hidden ghost: met (tadlīs), never known to meet (mursal khafī), and the mukhaḍramūn test case | 3 | `ibn-hajar`, `contemporary` | 3 panels |
| 4 | Did he lie? | `/al-mardud/lying/` | 1 | Three panels: the liar and the suspect side by side, three clue cards for spotting a forgery, and where forged words come from | 4 | none | 3 panels |
| 5 | Did he keep it right? | `/al-mardud/slips/` | 1 | Three panels: two narrators' records of errors, a chain whose hidden flaw shows when the routes are gathered, and a memory timeline | 6 | none | 3 panels |
| 6 | What changed in the telling? | `/al-mardud/changes/` | 1 | Six cells: a "what changed?" sorter, then one cell per form: inserted chunks, swapped names and hands, an added link, a wobbling link, and letter-dot glyphs | 9 | none | grid |
| 7 | May the words be changed? | `/al-mardud/wording/` | 1 | Three panels: a text card cut by an expert and by the ignorant, a text told in other words through a gate, and a shelf of books on rare words | 3 | `most`, `single-words`, `knows-wording`, `forgot` | 3 panels |
| 8 | Why is he unknown? | `/al-mardud/identity/` | 1 | Two cells: one man taken for six by his many names, and a narrator with a single student | 2 | none | grid |
| 9 | Who is this narrator? | `/al-mardud/unknown/` | 1 | (existing, unchanged) | 4 | none | 2 panels |
| 10 | Does his belief count against him? | `/al-mardud/innovation/` | 1 | Three panels: open sin in deed and in belief, then a decision path for each kind of innovation | 2 | `ibn-hajar`, `unless-lying`, `reject` | 3 panels |

Every scene uses a real worked example from the book wherever the translation gives one. The examples are:

- the mukhaḍramūn Abū ʿUthmān al-Nahdī and Qays ibn Abī Ḥāzim, whose reports from the Prophet ﷺ are irsāl and not tadlīs (§5.22);
- Ghiyāth ibn Ibrāhīm before al-Mahdī and his pigeons, and Maʾmūn ibn Aḥmad (§5.24);
- Murra ibn Kaʿb and Kaʿb ibn Murra, and the right and left hands in Abū Hurayra's report of the seven whom Allah shades (§5.29);
- Muḥammad ibn al-Sāʾib ibn Bishr al-Kalbī and his six names (§5.35);
- the books on rare words, from Abū ʿUbayd to Ibn al-Athīr's al-Nihāya (§5.34).

The translation gives no example for mudraj, al-mazīd, muḍṭarib, muṣaḥḥaf, muḥarraf, muʿallal or wuḥdān. The examples for these are in the thesis footnotes (Ibn al-Ṣalāḥ's Wāʾil ibn Ḥujr and Ibn al-Mubārak chains, Abū Zukayr's dates report), which are not used. Their cells are labelled diagrams that say "the book names no example" (open question 9).

### Content rules followed

These are the rules from the phase 2 plan, the al-Maqbūl design's §13 and the ʿAdad al-ṭuruq design's §14.

- Every note below paraphrases the *translation* paragraphs of §5.17–5.39 only: the headings `5. 17.` to `5. 39.` in `source/nuzhah.txt` (several have a space after "5."), each read up to its `Commentary` line.
- No footnote and no commentary was used. In particular:
  - footnote 120's Ibn Mājah chain for mursal khafī;
  - footnote 136's Abū Zukayr report for munkar;
  - footnote 139's Wāʾil ibn Ḥujr chain for mudraj;
  - footnote 145's Ibn al-Mubārak chain for al-mazīd;
  - footnote 159's narrators with a single student, for wuḥdān;
  - the commentary sections on forgery (§5.24.1–5.24.7) and on bidʿa (§5.37.1–5.37.3).
- **No Arabic report wording anywhere.** The translation gives the reports in English only. Term names keep their Arabic from `terms.yaml`. The delivery words ʿan and qāla appear in transliteration only (open question 6). The muṣaḥḥaf cell draws single Arabic letters, as the Names scene does; they are letter shapes, not words.
- English words of a report are at most a few, as the translation has them: "and pigeon racing", and the right and left hands.
- **Gauges and meters show order only.** No numbers, percentages or counts appear on them. The ladder's ordinals are the book's own count ("the sixth", "the eighth"). The error records in scene 5 are marks, not digits, and are labelled as illustrations.
- **No Other views that aren't in the translation.** The three scenes with views use rival opinions that the translation itself reports.
- Notes are written to fit `note: z.string().max(420)`, with a working cap of 400 characters. Lengths are checked in §10.

## 1. Shared decisions

- **Division id:** `al-mardud`. The new scene ids are `causes`, `hidden`, `lying`, `slips`, `changes`, `wording`, `identity` and `innovation`.
- **Order:** `causes` 1, `breaks` 2 (was 1), `hidden` 3, `lying` 4, `slips` 5, `changes` 6, `wording` 7, `identity` 8, `unknown` 9 (was 2), `innovation` 10. This is the book's order of omission and then of the ten causes, with the overview first. `slips` sits at the sixth cause, wahm, which leads its group.
- **Moons:** `causes` `[0, 1]`, `hidden` `[0]`, all the others `[1]`. The moon labels in `divisions.yaml` are unchanged.
- **New `diagram` enum values:** `Causes`, `Hidden`, `Lying`, `Slips`, `Changes`, `Wording`, `Identity` and `Innovation`.
- **Figures:** the figure language of spec §3.1–3.2, and the cases already drawn on `/narrators/`. Four become `figures.ts` kinds, so the scene legends can show them:

| Kind | Figure | `KIND_NAME` | Used in |
|---|---|---|---|
| `liar` | mask, scroll, voided seal | Liar | 4 |
| `accused` | dashed mask outline with no fill, scroll, cracked seal (new face value `mask-dashed`) | Suspected | 4 |
| `mudallis` | hand over mouth, scroll, seal | Conceals | 3 |
| `mukhtalit` | faded head, scroll, seal | Memory failed | 5 |

  The suspect has no figure in spec §3.2. The dashed mask says "suspected, not proven", and the cracked seal says "criticised" (open question 5).
- **Generation colours:** named narrators are black (later) unless the chain or general knowledge makes them a Companion or Successor. The two mukhaḍramūn are green (Successors), from general knowledge (open question 11).
- **Legend and modes:** the scene page's `LEGEND` map gains:
  - `Causes: ["moon", "sahabi", "tabii", "later", "ghost"]`;
  - `Hidden: ["moon", "tabii", "later", "mudallis", "ghost"]`;
  - `Lying: ["later", "liar", "accused", "weak"]`;
  - `Slips: ["moon", "sahabi", "tabii", "later", "weak", "mukhtalit", "ghost"]`;
  - `Changes: ["moon", "later", "ghost"]`;
  - `Identity: ["later", "majhul"]`;
  - `Innovation: ["later", "weak"]`.

  `Wording` draws no narrator figures, so it has no legend and no Key/Labels switch.
- **Terms file:** each of the 31 terms gets `scene:` set to its scene. No term is view-only: every trigger renders in every view, so no `view:` field is needed.
- **Term names used as plain labels.** Several scenes show the names of terms that live on another scene: munkar and shādhdh (`opposition`), mursal and the other breaks (`breaks`), mubham, majhūl al-ʿayn and mastūr (`unknown`), ḥasan li-ghayrihi (`grades`), and in scene 1 the cause names that live on scenes 3–10. They are plain text or links, never triggers. As before, a small in-SVG `<a>` goes to the scene that owns the term.

## 2. Scene 1: Why is a report rejected? (`causes`)

### 2.1 Header

```yaml
- id: causes
  division: al-mardud
  moons: [0, 1]
  order: 1
  title: Why is a report rejected?
  eyebrow: Rejected reports, the two grounds · §5.17, §5.21, §5.23
  lede: A report is rejected for one of two things. A narrator has dropped out of its chain, or a narrator in it is open to a charge. Ibn Ḥajar names ten charges, and lists them from the gravest down rather than sorting them by kind.
  source: §5.17 Saqṭ and ṭaʿn, §5.21 Plain and hidden drops, §5.23 The ten causes, §5.26 Munkar
  diagram: Causes
  width: 860
```

### 2.2 Form, and why it suits the idea

§5.17 splits rejection into two grounds, and they need two different pictures:

1. **Omission** is about *where* a link is missing and *whether anyone can see it*. Three mini chains, each with one ghost at a different height, show the three places §5.17 names. Two boxes under them show the plain drop and the hidden drop of §5.21.
2. **Criticism** is a list that Ibn Ḥajar deliberately orders by gravity (§5.23). The form is a **severity ladder** of ten rungs, the gravest at the top, with a narrowing wedge beside it that shows order only. Each rung names the cause and the report it yields, and the whole rung is a link to the scene that draws it.

So this scene is the division's hub. Its two triggers are the two grounds; every cause on the ladder is captioned on its own scene.

The two ideas don't share a layout, so the scene follows the Report and Names precedent: a **grid of two cells**, each its own `<svg viewBox="0 0 430 600">`, side by side on desktop and one column in portrait. Cell A holds `<Defs/>`.

### 2.3 Sketches (each cell 430 × 600)

Cell A, "Omission" (origin 0,0):

```
x→ 0    80             215             350     430
 18 │ OMISSION                                         (eyebrow .colhead)
 50 │                Saqṭ (i)  سَقْطٌ                    (title, cx 215)
 70 │          a narrator missing from the chain       (.lbl)
 96 │   (ﷺ)            (ﷺ)             (ﷺ)              moons k=0.45
146 │   [C]            ┆ghost┆          [C]             row 1, Companion
196 │   [S]            [S]             [S]             row 2, Successor
246 │   [N]            [N]             ┆ghost┆         row 3
296 │   ┆ghost┆        [N]             [N]             row 4
336 │  [collector]    [collector]     [collector]      chips
364 │ at the collector's  after the       elsewhere      (.lbl)
380 │ end · Muʿallaq →  Successor ·     · Muʿḍal,       links to breaks
396 │                   Mursal →        munqaṭiʿ →
420 │ ┌ PLAIN TO SEE ─────────┐ ┌ HIDDEN ──────────────┐
440 │ │ ◷  ▬▬▬▬     ▬▬▬▬      │ │ ⌕  ▬▬▬▬▬▬▬            │  lifespan bars
460 │ │ the two never met:    │ │      ▬▬▬▬▬▬▬▬         │
480 │ │ birth, death, study,  │ │ only experts who know│
500 │ │ travel dates show it  │ │ the routes find it   │
540 │ │ → Where does the      │ │ → Did he hear it     │
560 │ │   chain break?        │ │   from him?          │
580 │ └───────────────────────┘ └──────────────────────┘
```

- **Mini chains:** at x = 80, 215 and 350, drawn with `Narrator` at k=0.5 (the `Chain` part has a fixed scale). Rows y = 146, 196, 246, 296; collector `Chip`s at y=336. Solid `flow` arrows join the figures; a `skip` arrow jumps each ghost, as in `breaks`.
- **Ghosts:** chain 1 at row 4 (the collector's end), chain 2 at row 1 (after the Successor), chain 3 at row 3 (elsewhere). They blink, as every missing thing does.
- **Links:** the three `.lbl` captions are one in-SVG `<a>` each, all to `breaks`.
- **Boxes:** two `Matn`-style plain cards, (16..205, 420..580) and (225..414, 420..580).
  - "Plain to see" has a `Glyph clock` and two lifespan bars that don't overlap. The bars are the scene-local `Lifespan` of scene 3 (§4.3), with no dates.
  - "Hidden" has a `Glyph lens` and two bars that overlap.
  - Each box ends in an in-SVG link: to `breaks`, and to `hidden`.

Cell B, "Criticism" (origin 430,0):

```
x→ 0  6  14  36                        250                     424 430
 18 │ CRITICISM                                               (eyebrow)
 50 │                 Ṭaʿn (i)  طَعْنٌ                           (title, cx 215)
 70 │            ten causes, from the gravest down            (.lbl)
 90 │ ▲ graver
 96 │ █ ┌① Kadhib · lying                                   ┐ rung, 96..136
    │ █ │   → Mawḍūʿ                          Did he lie? → │
140 │ █ ┌② Tuhma bi-l-kadhib · suspected of lying           ┐
    │ █ │   → Matrūk                                        │
184 │ ▓ ┌③ Fuḥsh al-ghalaṭ · gross errors       ┐
228 │ ▓ ┌④ Ghafla · negligence                  ├ munkar, for those who
272 │ ▓ ┌⑤ Fisq · open sin                      ┘ don't require opposition →
316 │ ▒ ┌⑥ Wahm · mistaken impression    → Muʿallal
360 │ ▒ ┌⑦ Mukhālafa · against the reliable  → mudraj, maqlūb, mazīd,
    │ ▒ │                                       muḍṭarib, muṣaḥḥaf
404 │ ░ ┌⑧ Jahāla · being unknown        → mubham, majhūl
448 │ ░ ┌⑨ Bidʿa · innovation            → accepted or not, by its kind
492 │ ░ ┌⑩ Sūʾ al-ḥifẓ · poor memory     → shādhdh, for some; mukhtaliṭ
536 │ ▼ lighter
560 │ five touch integrity and five accuracy; Ibn Ḥajar does not
576 │ keep them apart, but orders all ten by gravity        (.lbl)
```

- **Rungs:** ten rects, x 36..424, 40 tall, 4 apart, from y=96. Fill steps down with `staircase.ts`'s `stepFill(lvl)`, as Grades' ladder does. Line 1 is the cause, a 13px bold transliteration plus its English in `.lbl`; line 2 is the report name in `.lbl`, after a small arrow.
- **Links:** each rung is one `<a>` to its scene: rungs 1–2 to `lying`; 3, 4 and 6 to `slips`; 5 and 9 to `innovation`; 7 to `changes`; 8 to `identity` (its line 2 names mubham and majhūl, which live on `unknown`; `identity` links on); 10 to `slips`. A link's accessible name is the rung's visible text plus "(scene: <title>)".
- **Munkar bracket:** a vertical `Bracket` at x=300, y 184..308, ticks left, with the two-line label "munkar, for those who / don't require opposition" as an in-SVG link to `opposition`, where munkar is a term. It sits in front of rungs 3–5, whose own links stop at x=290.
- **Severity wedge:** a filled triangle at x 6..22, wide at y=96 and narrowing to a point at y=530, with "graver" and "lighter" in `.lbl` at its ends. No ticks and no numbers.
- **Ordinals:** small circled numerals in `.lbl`, because the book itself counts the causes (§5.23–5.38: "the sixth", "the eighth reason", "the ninth", "the tenth"). Open question 4.
- **No integrity and accuracy tags.** §5.23 says five causes touch integrity and five accuracy, but chooses not to mark which; the scene says so in the footer line and doesn't tag them (open question 3).

### 2.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `saqt` | Cell A title, (≈180..262, y 28–58) | A narrator missing from the chain: one of the two grounds for rejecting a report. The drop may be at the start of the chain, by the compiler's own act, at its end after the Successor, or elsewhere. It may be plain to all, when the two never met, as records of birth, death, study and travel show; or hidden, found only by experts who know a ḥadīth's routes (§5.17, §5.21). |
| `tan` | Cell B title, (≈180..262, y 28–58) | The other ground: a charge against a narrator, whether it touches his religion or his accuracy. Ibn Ḥajar counts ten causes, five of integrity and five of accuracy, but does not keep the kinds apart; he lists all ten from the gravest down. They run from lying about the Prophet ﷺ and suspicion of lying, through errors, negligence, open sin and mistaken impressions, to poor memory (§5.17, §5.23). |

### 2.5 Views

None. §5.26 reports that some call the reports of causes 3–5 munkar, and §5.38 that some call a lifelong poor memory shādhdh. These are naming habits, not rival rulings, so they are plain labels on the rungs ("for those who…", "for some") rather than a view.

### 2.6 Grid cells

The cells are 1 Omission (A) and 2 Criticism (B). Desktop shows them side by side; portrait shows one column. There are no panels.

### 2.7 Motion

- **Cell A:** the chain arrows `flow` down; the ghosts blink.
- **Cell B:** the rungs fade in from the top, one after another (each 0.2s, 0.08s apart, once), so the eye reads the order of gravity.
- **Reduced motion:** all rungs shown, ghosts still. Base styles are the end state.

### 2.8 Kit parts

Reuses `Narrator`, `Moon`, `Arrow` (`flow`, `skip`), `Chip`, `Glyph` (`clock`, `lens`), `Bracket`, `TermTitle` and `titleTrigger`. The rung rects, the wedge and the `Lifespan` bars are scene-local; `Lifespan` is shared with scene 3 and is promoted to the kit there (§4.8).

### 2.9 Translation slips

- **§5.17 (p.164) "more general than for a matter pertaining to the narrator's piety and his accuracy".** The sense is "whether it concerns his religion or his accuracy". The site says that.
- **§5.23 (p.193) "his ignorance".** The eighth cause is jahāla, being unknown, not ignorance. The site says "being unknown", as `terms.yaml` does.
- **§5.23 "lewdness".** For fisq the site says "open sin", as `terms.yaml` does.

## 3. The existing scenes (`breaks`, `unknown`)

Neither is redesigned. The only changes are `breaks` `order: 1` → `2`, and `unknown` `order: 2` → `9`.

`unknown`'s source line already cites §5.35, and its `majhul` note already gives jahāla's two causes. Jahāla and wuḥdān could be added to it, but there is no room for the al-Kalbī example in its two-chain layout, and adding a third panel would be a redesign. So they get their own scene, `identity` (§9), which links to `unknown` for what follows (open question 16).

## 4. Scene 3: Did he hear it from him? (`hidden`)

### 4.1 Header

```yaml
- id: hidden
  division: al-mardud
  moons: [0]
  order: 3
  title: Did he hear it from him?
  eyebrow: Rejected for a hidden drop · §5.21–5.22
  lede: Some drops are hidden. The narrator names someone he could have heard from, in words that neither claim nor deny hearing. Whether the two are known to have met decides the name. It is tadlīs if they met, and a hidden mursal if they only lived at the same time.
  source: §5.21 Mudallas, §5.22 Mursal khafī
  diagram: Hidden
  width: 780
```

### 4.2 Form, and why it suits the idea

The whole difference between the two terms is one fact: whether the narrator *met* the one he cites (§5.22). So each panel pairs two pictures:

1. **lifespan bars** on a bare timeline, with a gold knot where the two met, or a blinking "?" where they only overlap;
2. a **chain fragment**: the cited shaykh, a hidden ghost, and the narrator, who says "ʿan…" in a speech bubble.

The chain fragments look the same in every panel, which is the point: from the chain alone you can't tell. Only the bars differ.

The third panel is Ibn Ḥajar's own test case (§5.22). The mukhaḍramūn lived in the Prophet's ﷺ time without being known to have met him, and everyone calls their reports irsāl, not tadlīs. So living at the same time is not enough for tadlīs. This panel also carries the scene's Other view (§4.5).

Being a single row of three, it carousels cleanly.

### 4.3 Sketch (780 × 520)

```
x→ 0   30   70        200 260│ 290  330          460 520│ 550  600   650   700  760 780
 30 │      Mudallas (i)       │    Mursal khafī (i)       │  LIVED IN HIS TIME
 50 │  a hidden drop          │ never known to have met   │  Ibn Ḥajar's test case
 78 │  ▬▬▬▬▬▬▬▬▬●▬▬ shaykh    │ ▬▬▬▬▬▬▬▬▬▬▬▬ shaykh       │ ○▬▬▬▬▬▬▬▬ the Prophet ﷺ
 94 │       ▬▬▬▬●▬▬▬▬▬ him    │      ▬▬▬?▬▬▬▬▬▬ him       │     ▬▬?▬▬▬▬▬▬ Abū ʿUthmān
    │         met (gold knot) │  (?) blinks in the overlap│       ▬?▬▬▬▬▬▬▬ Qays
150 │   [shaykh] 70,150       │  [shaykh] 330,150         │        ( ﷺ ) 650,150
    │      ↓                  │      ↓                    │      ╱ skip  ╲ skip
230 │   ┆ghost┆ 70,230        │  ┆ghost┆ 330,230          │
    │      ↓                  │      ↓                    │
310 │   [✋] 70,310 ╭ʿan… ╮   │  [N] 330,310 ╭ʿan… ╮      │  [Abū ʿUthmān  [Qays ibn
    │              ╰qāla…╯   │              ╰─────╯      │   al-Nahdī]     Abī Ḥāzim]
360 │   Mudallis (i)          │                           │   600,310       700,310
392 │  “I heard him”, when he │ shown by: his own word,   │ ┌ irsāl, not tadlīs ┐ (pill)
408 │  did not: a liar (mask) │ or a versed imam's        │ │ all agree         │
424 │                         │ statement                 │ └───────────────────┘
448 │ (Held until he says     │ an extra narrator in some │ so meeting, not living at
466 │  he heard)  pill        │ versions is no proof →    │ the same time, makes tadlīs
484 │                         │ What changed? (al-mazīd)  │
```

- **Lifespan bars:** a new scene-local `Lifespan` (§4.8): a rounded bar 8 tall between x0 and x1 at y, with its owner's name in `.lbl` at the right end. There are no dates, no axis and no ticks: the bars show overlap only.
  - Panel 1: the shaykh at (30..200, 78) and the narrator at (80..240, 94). A gold "met" knot, two dots joined, at x=150 across both bars, with the `.lbl` "met" under it.
  - Panel 2: the same bars shifted to x 290..460 and 340..500. In the overlap at x=410, y=86, a blinking "?".
  - Panel 3: the Prophet ﷺ at (560..700, 78) in `--moon`, a small moon glyph at its left end; Abū ʿUthmān al-Nahdī at (600..770, 94) and Qays ibn Abī Ḥāzim at (590..760, 110), with a "?" in their overlap.
- **Chain fragments:** k=0.75. The shaykh is a reliable `later` figure; the ghost is the standard blinking ghost, labelled "the one he heard it from" in Labels mode; the arrows are solid `flow` arrows, with a `skip` arrow jumping the ghost.
  - Panel 1's narrator is the `mudallis` figure (hand over mouth).
  - Panel 2's narrator is a reliable `later` figure. The book doesn't say a narrator who does this is a concealer, so he is not drawn as one.
- **Speech bubbles:** `SpeechBubble` from the narrator, with transliteration only (the part's `ar` prop becomes optional, §4.8). Panel 1 has "ʿan…" over "qāla…"; panel 2 has "ʿan…". Each bubble is 142 wide, so the narrators sit at x=70 and x=330 to keep the bubble inside the panel.
- **Panel 1 aside:** at y 392–408, a small mask glyph (the `liar` face at k=0.4) and the `.lbl` "“I heard him”, when he did not: a liar". Then a `Pill state="pause"` at (130,456): "Held until he says he heard".
- **Panel 2 footer:** at y 392–424, "shown by: his own word, or a versed imam's statement", with a `Glyph text`. At y 448–484, an in-SVG link to `changes` (the al-mazīd cell): "an extra narrator in some versions is no proof".
- **Panel 3:**
  - A moon at (650,150), k=0.6. Two `tabii` figures at (600,310) and (700,310), k=0.7, with two-line names.
  - `skip` arrows from the moon to each, because the mukhaḍramūn report straight from the Prophet ﷺ without naming a source.
  - The default view shows a `Pill state="accept"` "irsāl, not tadlīs" at (650,400), with the `.lbl` "all agree" under it, and the two-line `.lbl` conclusion at y 448–466.

### 4.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `mudallas` | Panel 1 title, (≈75..195, y 8–38) | A hidden drop. The narrator does not name the one he heard from, and cites the one above in words that allow a meeting, such as ʿan (from) or qāla (he said). The name comes from dalas, the dark of nightfall: both involve concealment. Only expert imams who know a ḥadīth's routes can find it. In Ibn Ḥajar's usage he is known to have met the one he cites (§5.21–5.22). |
| `mudallis` | Panel 1, row label under the figure, (≈20..120, y 347–365) | The narrator who conceals in this way. Had he used words of certainty, saying he heard what he did not, he would be a liar. When a reliable narrator is shown to do this, his report is not accepted until he makes clear that he heard it, on the most correct opinion (§5.21). |
| `mursal-khafi` | Panel 2 title, (≈315..465, y 8–38) | The narrator reports from a contemporary he is not known to have met, with someone hidden between them. That they never met is known from the narrator's own word or a versed imam's firm statement. An extra narrator in some versions does not prove it, since that may be an addition inside a connected chain; al-Khaṭīb wrote on both (§5.22). |

**Extra** (Read as text only):

1. **The mukhaḍramūn** (§5.22). This is Ibn Ḥajar's evidence that tadlīs needs a known meeting, not just a shared lifetime. The ḥadīth scholars agree that the reports of mukhaḍramūn such as Abū ʿUthmān al-Nahdī and Qays ibn Abī Ḥāzim from the Prophet ﷺ are irsāl, not tadlīs. They certainly lived in his time, but it is not known whether they met him. If living at the same time were enough for tadlīs, they would be mudallis. al-Shāfiʿī and Abū Bakr al-Bazzār also require a meeting, and al-Khaṭīb's al-Kifāya implies it. Ibn Ḥajar calls this the trusted opinion.

### 4.5 Views

The translation reports a rival definition of tadlīs (§5.22). Ibn Ḥajar's is the default.

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: they met | §5.22; with al-Shāfiʿī, Abū Bakr al-Bazzār and al-Khaṭīb | Tadlīs is only from someone the narrator is known to have met. If they only lived at the same time and no meeting is known, it is a hidden mursal. The difference is fine but real; Ibn Ḥajar calls this the trusted opinion. |
| `contemporary` | Some: living at the same time | "Whoever has added…", §5.22 | Some add to the definition of tadlīs "being a contemporary, even if they never met". That brings the hidden mursal inside tadlīs. Ibn Ḥajar answers that the mukhaḍramūn would then be mudallis, yet all agree their reports are irsāl. |

Under `contemporary`:

- a dashed tag "counted as tadlīs" appears over panel 2, at (390,62), joined to panel 1 by a dashed bracket (`data-view-show="contemporary"`). The `mursal-khafi` trigger stays where it is;
- in panel 3 the "irsāl, not tadlīs" pill is replaced by a dashed `Pill state="pause"` "then mudallis?" with a blinking "?", and the `.lbl` "yet all call it irsāl". This shows Ibn Ḥajar's objection in the picture, as the `nazari-only` view does in *How sure can we be?*.

### 4.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `met` | They met | 0 | 260 |
| `never-met` | Never known to meet | 260 | 520 |
| `test` | The test case | 520 | 780 |

### 4.7 Motion

- **Chains:** the arrows `flow` down; the ghosts and the "?"s blink.
- **The knot:** the panel 1 "met" knot draws in (stroke-dash, once, 0.6s, delay 0.4s).
- **View change:** the panel 3 pill swaps; instant is acceptable.
- **Reduced motion:** the knot drawn, nothing blinking. Base styles are the end state.

### 4.8 Kit parts

Reuses `Narrator` (with the new `mudallis` kind), `Moon`, `Arrow` (`flow`, `skip`), `Pill`, `SpeechBubble`, `Glyph text`, `Bracket`, `TermTitle`, `panelTrigger` and `rowTrigger`. New:

- `Lifespan.astro` (promoted to the kit here, since scenes 1 and 3 both use it): `x0, x1, y, name?, tone?: "moon"`. A bar with an optional end label. It has no axis and no dates, and is `aria-hidden`; the notes carry the meaning.
- `SpeechBubble`'s `ar` becomes optional. Without it, the `en` line sits in the middle of the bubble.
- `FIG.mudallis` in `figures.ts`.

### 4.9 Translation slips

- **§5.22 (p.189) "The difference between mudallas and mursal khafī is intrinsic".** The Arabic is likely daqīq, "subtle" or "fine". The site says "fine but real".
- **§5.21 heading "the Misrepresented".** The site uses `terms.yaml`'s "Concealed". Not a meaning slip.

## 5. Scene 4: Did he lie? (`lying`)

### 5.1 Header

```yaml
- id: lying
  division: al-mardud
  moons: [1]
  order: 4
  title: Did he lie?
  eyebrow: Rejected for lying · §5.23–5.25
  lede: The gravest charge is lying about the Prophet ﷺ, and a report from such a narrator is called fabricated. The next is being suspected of lying, which makes a report abandoned. A forgery is judged on overwhelming evidence, not certainty, because even a liar sometimes tells the truth.
  source: §5.23 Kadhib and tuhma bi-l-kadhib, §5.24 Mawḍūʿ, §5.25 Matrūk
  diagram: Lying
  width: 780
```

### 5.2 Form, and why it suits the idea

The scene has three questions, one per panel:

1. **Who is charged?** The liar and the suspect stand side by side, each above the report name his charge yields. Their figures differ only in the mask and the seal (solid mask and voided seal; dashed mask and cracked seal), so the eye sees one charge proven and one only suspected.
2. **How is a forgery known?** Three clue cards, in the order §5.24 gives them: the forger's confession; the narrator's state at the moment, with the book's own Ghiyāth story, whose added words pulse on a `Matn` card; and the text's state, set against the four things it may not contradict.
3. **Where do the words come from, and why?** Three sources feed one `Matn` card, and five motives sit under it.

### 5.3 Sketch (780 × 560)

```
x→ 0   20  60        130       260│ 280       390        520│ 540        650        780
 24 │ TWO CHARGES                  │       Mawḍūʿ (i)          │ WHERE IT COMES FROM
 48 │                              │ on overwhelming evidence,  │
 70 │ Kadhib (i) كَذِبٌ  row title │ not certainty              │ ▤ his own invention ──┐
 96 │                              │ ┌ HIS OWN ADMISSION ─────┐ │ ⊙ others' words:       │
140 │  [mask,✕seal] 60,140  ▲      │ │ [mask] k.5  "taken as   │ │  [early pious]         ├→ ┌────────┐
    │  lies, on purpose, in │      │ │  evidence, not certain"│ │  [ancient sages]       │  │  Matn   │
    │  a report from the    │ graver│ └────────────────────────┘ │  [biblical sources]    │  │ ⊙→⊙→⊙  │
190 │  Prophet ﷺ            │      │ ┌ HIS STATE AT THE TIME ─┐ │ ⛓ a weak report given  ┘  └────────┘
210 │      → Mawḍūʿ (link →)│      │ │ ┌“no contest except…” ┐│ │   a sound chain
250 │ Tuhma bi-l-kadhib (i)  │      │ │ │ + “and pigeon racing”││ │   [✕N]→[⊙N][⊙N]
290 │  [dashed mask,crack]   │      │ │ └─────────────────────┘│ │
    │   60,300               │      │ │ Ghiyāth, before al-Mahdī│ │ WHY
330 │  ▫ only he has it, and │      │ └────────────────────────┘ │ [no religion] [ignorance]
    │    it goes against     │      │ ┌ THE TEXT ITSELF ───────┐ │ [partisanship]
    │    known principles    │      │ │ [Qurʾan]✕ [mutawātir]✕ │ │ [pleasing rulers]
370 │  ▫ lies in everyday    │      │ │ [consensus]✕ [reason]✕ │ │ [fame through rarity]
    │    talk                ▼      │ │ no way to reconcile    │ │
430 │        Matrūk (i) مَتْرُوكٌ   │ └────────────────────────┘ │ forbidden by consensus;
460 │                              │                            │ told only to expose it
```

- **Panel 1:**
  - `Kadhib` is a row title at (20,70) with its Arabic after it. The `liar` figure is at (60,140), k=0.8, with three `.lbl` lines to its right at x=100. A small arrow and the plain label "Mawḍūʿ" at (130,210) form an in-SVG link to panel 2 (its trigger is there).
  - `Tuhma bi-l-kadhib` is a row title at (20,250). The `accused` figure is at (60,300). Its two grounds are tags with a small square bullet at x=100, y=330 and y=370 (§5.23).
  - `Matrūk` is the 15px sub-title trigger at (130,430), with its Arabic under it.
  - A thin two-headed wedge at x=245, y 120..400, with "graver" at the top, shows that the first charge is graver than the second (order only).
- **Panel 2:**
  - The `mawdu` title at (390,24) and its sub-line at y=48.
  - Three clue cards (plain rects, as Sorting's outcome cards) at x 280..510: "His own admission" (y 96..176), "His state at the time" (y 186..300), "The text itself" (y 310..440).
  - Card 1: a `liar` figure at k=0.5 and the `.lbl` "taken as evidence, not as certain".
  - Card 2: a `Matn` at (296..494, 206..262) with `lines=["“no contest except…”"]` and `added="“and pigeon racing”"`. The added tail pulses. The `.lbl` "Ghiyāth, before al-Mahdī" is under it. These are the only report words shown, both fragments, in the translation's English.
  - Card 3: four `Chip`s, "the Qurʾan", "mutawātir sunna", "firm consensus" and "plain reason", each with a small `Glyph cross` beside it, and the `.lbl` "no way to reconcile them".
- **Panel 3:**
  - Three source rows at x 540..700: `Glyph text` "his own invention"; "others' words" with three `Chip`s; and "a weak report given a sound chain", drawn as a mini chain where a `weak` figure (k=0.45) is crossed out and two reliable figures stand beside it.
  - The three rows join with a `Bracket` into one `Matn` stub with a tiny chain on it at (705..770, 140..210).
  - Under "WHY", five `Chip`s for the five motives (§5.24), and the two-line `.lbl` ruling at y 430–446.

### 5.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `kadhib` | Panel 1, row title, (14..≈110, y 57–75) | The gravest of the ten charges: the narrator lies in a report from the Prophet ﷺ, deliberately narrating from him what he did not say. Lying is a kind of open sin, but it is listed on its own because in this field it does the most harm. A report from such a narrator is called mawḍūʿ, fabricated (§5.23–5.24). |
| `tuhma-bil-kadhib` | Panel 1, row title, (14..≈200, y 237–255) | Suspicion of lying, one step less grave than lying. It arises in two ways: the report comes only through him and goes against known principles; or he is known to lie in his everyday speech, though no lie of his in ḥadīth is proven. A report from such a narrator is called matrūk, abandoned (§5.23, §5.25). |
| `matruk` | Panel 1, sub-title, (≈85..190, y 413–437) | The second kind of rejected report, following the order of the ten charges: a report whose narrator is accused of lying. Ibn Ḥajar names it in one line; the grounds of the suspicion are those set out among the ten causes (§5.23, §5.25). |
| `mawdu` | Panel 2 title, (≈330..455, y 2–32) | A report from a narrator who lied about the Prophet ﷺ. It is judged forged on overwhelming evidence, not certainty, since even a liar may tell the truth; only scholars of wide knowledge and insight can judge it. Its signs are the forger's confession, the narrator's state at the time, or a text that clashes past reconciling with the Qurʾan, mutawātir sunna, firm consensus or plain reason (§5.24). |

**Extra** (Read as text only):

1. **Two forgers caught in the act** (§5.24). Maʾmūn ibn Aḥmad, hearing a debate over whether al-Ḥasan heard from Abū Hurayra, at once recited a chain to the Prophet ﷺ saying that he had. Ghiyāth ibn Ibrāhīm came upon al-Mahdī playing with his pigeons, and at once recited a chain for "no contest except in archery, camel racing and horse racing", adding "and pigeon racing" himself. al-Mahdī knew he had lied for his sake, and had the pigeons killed.
2. **A confession** (§5.24). Ibn Daqīq al-ʿĪd said a forger's confession is not taken as certain, since he may be lying in it. Some took this to mean it is not acted on at all. Ibn Ḥajar says he only denied certainty: a ruling can rest on overwhelming evidence. Otherwise no one could be punished on a confession to murder or adultery, since they too might be lying.
3. **Where forged words come from, and why** (§5.24). A forger may invent the words, or take the words of others, such as some of the early pious, the ancient sages or biblical sources, or give a weak report a sound chain so that it spreads. Forgers act from lack of religion, like the zindīqs; from ignorance, like some worshippers; from partisanship; to please rulers; or to win fame with something rare. All of it is forbidden by consensus. Some of the Karrāmiyya and some Ṣūfīs allowed lying to encourage good and warn against evil; Ibn Ḥajar calls this a mistake born of ignorance, since that too is part of the Law. al-Juwaynī went so far as to call the deliberate forger a disbeliever. Narrating a forged report is forbidden unless one says it is forged, as Muslim's report from the Prophet ﷺ warns.

### 5.5 Views

None. The Karrāmiyya's allowance of lying for encouragement, and al-Juwaynī's ruling, are about the sin, not about how a report is classed, and the translation rejects the first outright. They are told in extra 3.

### 5.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `charges` | Two charges | 0 | 260 |
| `signs` | How a forgery is known | 260 | 520 |
| `sources` | Where it comes from | 520 | 780 |

### 5.7 Motion

- **Panel 2:** the clue cards fade in one after another (0.3s each, 0.3s apart, once); the added tail pulses (`blink`); the four crosses draw in after the third card.
- **Panel 3:** the three source rows' connector draws in (stroke-dash, once).
- **Reduced motion:** cards shown, crosses and connector drawn, tail still. Base styles are the end state.

### 5.8 Kit parts

Reuses `Narrator`, `Matn` (with `added`), `Chip`, `Glyph` (`text`, `cross`), `Bracket`, `TermTitle`, `rowTrigger` and `panelTrigger`. New: `FIG.liar`, `FIG.accused`, and the `Narrator` face value `mask-dashed` (the existing mask path with a dashed stroke and no fill, and the eyes left out).

### 5.9 Translation slips

- **§5.24 "Ibn Daqīq al-ʿYd".** Spelling: al-ʿĪd. The site writes Ibn Daqīq al-ʿĪd.
- **§5.24 "biblical sources".** This likely renders isrāʾīliyyāt. The site keeps "biblical sources", since it is the translation's word and not a meaning slip.

## 6. Scene 5: Did he keep it right? (`slips`)

### 6.1 Header

```yaml
- id: slips
  division: al-mardud
  moons: [1]
  order: 5
  title: Did he keep it right?
  eyebrow: Rejected for errors of accuracy · §5.23, §5.26–5.27, §5.38
  lede: Some charges are about accuracy, not honesty. A narrator may make many glaring mistakes, be careless, or report on a mistaken impression that only gathering every route will show. His memory may be poor all his life, or fail late, so that only what he told before can be trusted.
  source: §5.23 Fuḥsh al-ghalaṭ, ghafla and wahm, §5.26 Munkar, §5.27 Muʿallal, §5.38 Sūʾ al-ḥifẓ and mukhtaliṭ
  diagram: Slips
  width: 780
```

### 6.2 Form, and why it suits the idea

These are the accuracy charges that §5.23 lists and §5.26–5.38 name. Each has its own picture:

1. **Gross errors and negligence** are kinds of a narrator's *record*. Each is a figure beside a strip of report marks: many bold crosses for gross errors, and for negligence a text passed on with the check box he never ticks (an empty slot that blinks, the sign for anything missing).
2. **A mistaken impression, found as a hidden defect**, is about *gathering routes*. One chain looks connected; an iʿtibār-style lens sweeps three other routes beside it, and they show that the link it gives is not there. The money-changer (§5.27) sits under it, as three coins, one false.
3. **Poor memory** is about *time*. A timeline shows the lifelong kind as one hatched bar, and the late kind as a sound bar broken by an event, with the narrator's reports sorted before, unknown and after.

Being a single row, it carousels cleanly in three 260-wide panels.

### 6.3 Sketch (780 × 560)

```
x→ 0   20  60   100        240 260│ 290 330  370 420 470 520│ 540  580    650    720  760 780
 30 │ MANY ERRORS, CARELESS        │      Muʿallal (i)        │      Sūʾ al-ḥifẓ (i)
 52 │                              │ a hidden flaw, found by  │ his mistakes outweigh
 66 │                              │ gathering the routes     │ what he gets right
 76 │ Fuḥsh al-ghalaṭ (i) row      │ (ﷺ)  (ﷺ)  (ﷺ)  (ﷺ)       │ ALL HIS LIFE
100 │                              │  ↓    ╲    ╲    ╲ skip   │ ▨▨▨▨▨▨▨▨▨▨▨▨▨ bar, y 100
130 │  [⊙✕] 60,140  ✓✕✓✕✕✓✕✓✕✕     │ [C]←red  ┆    ┆    ┆     │ [crack] 580,130 → shādhdh,
    │               record strip   │  ↓    ↓    ↓    ↓        │                 for some →
170 │  many and glaring            │ [S]  [S]  [S]  [S]       │ LATER IN LIFE
200 │                              │  ↓    ↓    ↓    ↓        │ ▬▬▬▬▬▬▬▬▬✶░░░░░░░ y 210
230 │ Ghafla (i) row               │ [N]  [·]  [·]  [·]       │ [⊙] 580,250  [faded] 720,250
    │                              │ Wahm (i)                 │     ◷ old age · sight lost ·
290 │  [⊙] 60,300  ┌ Matn ┐ ┆☐┆    │ ⌕ ───────────→ sweep     │     ▤✕ books burned or lost
    │              └──────┘ blinks │ "the other routes have   │          Mukhtaliṭ (i)
330 │  careless of accuracy        │  no Companion here"      │ ┌before┐ ┌ ? ┐  ┌after┐
360 │                              │ ◎ ◎ ◌  like a money-     │ │ ✓    │ │ ⏸ │  │faded│
    │                              │  changer with false coins│ accepted  held   his memory
400 │ ┊ munkar, for those who      │ [ʿAlī ibn al-Madīnī]     │ if told   back   has failed
    │ ┊ don't require opposition → │ [Aḥmad] [al-Bukhārī]     │ apart
430 │ ┊ (and open sin →)           │ [Abū Zurʿa][al-Dāraquṭnī]│ ⌕ only a study of those who
460 │                              │                          │   took from him tells them apart
```

- **Panel 1:**
  - `Fuḥsh al-ghalaṭ` row title at (20,76). A `weak` figure at (60,140), k=0.8. The record strip is ten small marks at x 100..240, y=140: a tick or a bold cross each, six of them crosses, drawn in a mix so that the crosses stand out. The `.lbl` "many and glaring" under it.
  - `Ghafla` row title at (20,230). A plain `later` figure at (60,300) passes a small `Matn` stub (100..200, 285..315) on; after it, a check box drawn as an empty blinking slot (`Glyph check` with the tick hidden and a `.slot` box). The `.lbl` "careless of accuracy" under it.
  - A dashed vertical rule at x=14, y 395..440, with the in-SVG link "munkar, for those who don't require opposition" to `opposition`, and "(and open sin →)" to `innovation`.
- **Panel 2:**
  - Four routes at x = 300, 370, 430 and 490, with moons at y=76 (k=0.4).
  - Route A at x=300 is the one under study: moon → Companion (gold) → Successor → narrator, all solid `flow`. The narrator is a reliable `later` figure. The `wahm` row label sits under it at (290,262).
  - Routes B–D are reliable chains at opacity .5: moon → Successor directly by a `skip` arrow (the Successor reports from the Prophet ﷺ), then a plain figure. Their figures are k=0.6, unnamed.
  - A `Glyph lens` sweeps from x=330 to x=510 at y=290. When it has passed, a red dashed ring (the ghost stroke) draws round route A's Companion, with the `.lbl` "the other routes have no Companion here".
  - The money-changer: three coin glyphs at y=360 (two solid, one with a dashed edge), with the two-line `.lbl` "like a money-changer with false coins".
  - The experts: five `Chip`s at y 400–440. The two names that are open translation queries (§6.9) are left out until a ruling.
- **Panel 3:**
  - `Sūʾ al-ḥifẓ` title at (650,30).
  - "All his life": a hatched bar (540..760, 100); a `weak` figure at (580,130), k=0.6; the link "shādhdh, for some →" to `opposition`.
  - "Later in life": a bar at y=210, solid from 540 to 650, then lighter and dashed to 760. At x=650, an event mark (a small star); three short `.lbl` causes under it with a `Glyph clock` and a `Glyph book` crossed by a `Glyph cross` at k=0.5.
  - A reliable figure at (580,250) and the `mukhtalit` figure (faded head) at (720,250). The `mukhtalit` row label is at (660,318).
  - Three report cards at y 330–380: "before", with a `Glyph check` and "accepted if told apart"; "?", with `Glyph pause` and "held back"; "after", faded, with "his memory has failed" and no verdict (open question 7).
  - A `Glyph lens` and the two-line `.lbl` at y 430–446.

### 6.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `fuhsh-al-ghalat` | Panel 1, row title, (14..≈160, y 63–81) | The third of the ten charges: the narrator's mistakes are gross, which means many. For those who do not make going against others a condition of munkar, his report is munkar, and so are the reports of the fourth and fifth: the very careless and the openly sinful (§5.23, §5.26). |
| `ghafla` | Panel 1, row title, (14..≈75, y 217–235) | The fourth charge: a naive carelessness about accuracy in what he passes on. When it is excessive, his report is munkar for those who do not require opposition in munkar (§5.23, §5.26). |
| `wahm` | Panel 2, row label under route A, (284..≈350, y 249–267) | The sixth charge: the narrator reports on a mistaken impression. When indications reveal it, such as joining up a mursal or broken chain, or slipping one ḥadīth into another, found by close study and gathering the routes, the report is muʿallal. Ibn Ḥajar names this one because it needs the longest explanation (§5.23, §5.27). |
| `muallal` | Panel 2 title, (≈330..450, y 8–38) | A report whose hidden mistake shows only through close search and gathering its routes, among the subtlest kinds in the field. Only a few with keen understanding, vast memory and full knowledge of narrators, chains and texts have spoken on it, such as ʿAlī ibn al-Madīnī, Aḥmad, al-Bukhārī and al-Dāraquṭnī. Like a money-changer with false coins, the expert may not always state his proof (§5.27). |
| `su-al-hifz` | Panel 3 title, (≈575..725, y 8–38) | The tenth charge: the narrator's mistakes outweigh what he gets right. It is of two kinds. If it stays with him in every state, some ḥadīth scholars call his report shādhdh. If it comes on him later, he is mukhtaliṭ (§5.23, §5.38). |
| `mukhtalit` | Panel 3, row label, (≈620..725, y 305–323) | Poor memory that came on later: through old age, the loss of his sight, or the burning or loss of the books he relied on, so that he fell back on a memory that had weakened. What he narrated before is accepted when it can be told apart; what cannot is held back, as is any case that can't be settled. Only a study of those who took from him shows which is which (§5.38). |

### 6.5 Views

None. The only disagreement here is over names (munkar in §5.26, shādhdh in §5.38), shown as plain labels, as in scene 1.

### 6.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `errors` | Errors and carelessness | 0 | 260 |
| `defect` | A hidden defect | 260 | 520 |
| `memory` | Poor memory | 520 | 780 |

### 6.7 Motion

- **Panel 1:** the record crosses draw in one after another (0.15s apart, once); the check slot blinks.
- **Panel 2:** routes B–D fade in from .15 to .5 as the lens passes (as in *Does anyone else carry it?*, about 3s, once); then the red ring draws round route A's Companion. The coin with the dashed edge blinks.
- **Panel 3:** the event star pulses once; the "?" blinks.
- **Reduced motion:** all marks and routes shown, ring drawn, lens at rest at the end of its sweep, nothing blinking. Base styles are the end state.

### 6.8 Kit parts

Reuses `Narrator` (`weak`, new `mukhtalit`), `Moon`, `Arrow` (`flow`, `skip`), `Matn`, `Chip`, `Glyph` (`lens`, `check`, `cross`, `pause`, `clock`, `book`), `TermTitle`, `rowTrigger` and `panelTrigger`. New: `Glyph coin` (a disc with an inner ring; `dashed` for the false one). The record strip and the timeline bars are scene-local.

### 6.9 Translation slips

- **§5.23 (p.193) "his doubts, in that he reports ambiguously".** The sixth cause is wahm: he reports on a mistaken impression. The site says "mistaken impression", as `terms.yaml` does.
- **§5.27 (p.221) "Yaʿqūb ibn Abī Shayba".** Likely Yaʿqūb ibn Shayba. Left out of the expert chips until a ruling.
- **§5.27 "Ibn Abī Ḥātim".** As in the §5.10.2 row, the Arabic likely names Abū Ḥātim. Left out until a ruling. Abū Zurʿa, whom the translation names here, is kept.
- **§5.38 heading "Mukhtalaṭ – the Merged".** The site uses `terms.yaml`'s Mukhtaliṭ, "memory failed".

## 7. Scene 6: What changed in the telling? (`changes`)

### 7.1 Header

```yaml
- id: changes
  division: al-mardud
  moons: [1]
  order: 6
  title: What changed in the telling?
  eyebrow: Rejected for going against the reliable · §5.28–5.32
  lede: The seventh charge is going against reliable narrators, and what the narrator changed gives the report its name. He may run chains or words together, swap names or words round, add a narrator, change a narrator with no way to choose, or misread the letters.
  source: §5.23 Mukhālafa, §5.28 Mudraj, §5.29 Maqlūb, §5.30 al-Mazīd fī muttaṣil al-asānīd, §5.31 Muḍṭarib, §5.32 Muṣaḥḥaf and muḥarraf
  diagram: Changes
  width: 860
```

### 7.2 Form, and why it suits the idea

Ibn Ḥajar opens each section from §5.28 to §5.32 with "if the opposition is by…". So the scene opens with a **sorter** that asks what changed, with five answers. Each answer is then its own cell, in the form that fits it:

- inserted chunks on chains and text cards, for mudraj;
- names and hands that swap places, for maqlūb;
- two versions of a chain, one with a link added, for al-mazīd;
- a wobbling link over a level scale, for muḍṭarib;
- letter-dot glyphs, for muṣaḥḥaf and muḥarraf, as in *Who is who?*.

Six cells don't sit in one row, so the scene is a **grid of six cells**, each its own `<svg viewBox="0 0 430 300">`, two columns on desktop and one in portrait (as Grades). Cell A holds `<Defs/>`. Each cell carries an `id`, so the sorter's answers can be in-page links.

### 7.3 Sketches (each cell 430 × 300)

Cell A, "What changed?" (origin 0,0):

```
x→ 0  20                  190                                    410 430
 30 │              Mukhālafa (i)  مُخَالَفَةٌ                         (title)
 52 │        going against the reliable: what changed?          (.lbl)
 80 │ ┌reliable┐ ⊙→⊙→⊙ ▭      the chain's arrangement, or words
    │ │version │               slipped into the text  ───→ Mudraj ↓
118 │ └────────┘               one thing put before another ─→ Maqlūb ↓
150 │     ≠                     a narrator added ─────────────→ al-Mazīd ↓
182 │ ┌his     ┐ ⊙→⊙→⊙ ▭      a narrator changed, no way to
    │ │version │               prefer ─────────────────────→ Muḍṭarib ↓
220 │ └────────┘               letters: dots or vowels ─────→ Muṣaḥḥaf, muḥarraf ↓
270 │ each a form of the seventh charge                       (.lbl)
```

- Two mini versions at the left (x 20..170): a reliable one (solid) and his (one link tinted), with a "≠" between.
- Five answer rows at x=190, y = 92, 118, 150, 188 and 220. Each row is one in-page `<a href="#cell-b">` (and so on), with the plain name and a "↓".
- The footer line reads "each a form of the seventh charge". It doesn't say whether mukhālafa is a charge of integrity or of accuracy, since §5.23 doesn't mark it (open question 3).

Cell B, "Mudraj" (origin 430,0):

```
x→ 0  20      110      200      290      380  430
 26 │                Mudraj (i)  مُدْرَجٌ
 50 │ Mudraj al-isnād (i)                          row title, y 50
 64 │   ①          ②          ③          ④
 80 │ ⊙ ⊙ ⊙      ⊙   ⊙      ▭A  ▭B     ⊙ ▭?
    │  ╲│╱       │   ┆      │   │      │  "…" ← his own words
110 │   ⊙       ⊙   ⊙      ⊙   ⊙      ⊙
    │   │        ╲ ╱        ╲ ╱       │
140 │  ▭        ▭▒▒        ▭+▭       ▭ taken as the text
150 │ merged    part by    two texts  distracted;
164 │ into one  another    one chain  heard as text
190 │ Mudraj al-matn (i)                           row title, y 190
210 │ ┌▒▒▒── ── ──┐ ┌── ▒▒▒ ──┐ ┌── ── ──▒▒▒┐
    │ └───────────┘ └─────────┘ └───────────┘
236 │  at the start   in the middle   at the end, most often
256 │ or a Companion's words run into the Prophet's ﷺ
276 │ known by: a version that sets it apart · a statement · it can't be his ﷺ
```

- **Mudraj al-isnād:** four pictograms, 90 wide each, at x 20, 110, 200 and 290 (§5.28's four kinds). Plain lines and small dots, not figures, at this scale:
  1. three routes converging into one with no mark;
  2. a text card whose last part is shaded, reached by one chain, with a faint second chain to the shaded part;
  3. two text cards with two chains, told with one chain;
  4. a chain ending at a speech mark "…" that a listener takes as the text.
- **Mudraj al-matn:** three `Matn`-style cards (no text, rule lines only) with a shaded insert at the start, middle and end; the end card is drawn slightly bolder, with "most often".
- The two row titles are triggers; the 20px "Mudraj" title is a trigger.

Cell C, "Maqlūb" (origin 0,300):

```
x→ 0   30            215             400 430
 26 │              Maqlūb (i)  مَقْلُوبٌ
 60 │ IN NAMES
 86 │   [Murra ibn Kaʿb]   ⇄   [Kaʿb ibn Murra]
110 │   one's name is the other's father's name
140 │ IN A TEXT · Abū Hurayra's report of the seven, in Muslim
170 │  ┌“…the right ~ what the left spent”┐  one narrator's slip
    │       ↖────────swap──────↗
220 │  ┌“…the left ~ what the right spent”┐  as in both Ṣaḥīḥs
270 │ al-Khaṭīb's Rāfiʿ al-irtiyāb                    (.lbl)
```

- Name chips at (30..190, 86) and (240..400, 86), with two curved arrows between them that cross: "Murra" and "Kaʿb" trade places.
- Two `Matn` cards (30..360, 155..190) and (30..360, 205..240), English fragments only. The words "right" and "left" are `<tspan class="diff">`s (the Names pattern), joined by a crossing pair of thin arrows. The first card is `inactive`.

Cell D, "al-Mazīd" (origin 430,300):

```
x→ 0   40     110        215    280     350  430
 26 │       al-Mazīd fī muttaṣil al-asānīd (i)         (.subt, 15px)
 60 │  THE MORE RELIABLE        ANOTHER VERSION
 86 │   [A] 80,86                [A] 280,86
    │    │ "I heard"               ↓
140 │    │                       [+X] 280,140  added
    │    ↓                         ↓
194 │   [B] 80,194               [B] 280,194
230 │ the hearing is stated     → the addition is rejected  (reject pill 340,230)
256 │ if it said only ʿan…      → the addition is preferred (accept pill 340,256)
280 │ → Did he hear it from him? (mursal khafī)          (link)
```

- Two short chains of reliable `later` figures at k=0.7. On the left, the arrow from A to B carries a small `Chip` "I heard" (the hearing stated at the place of the addition). On the right, A → X → B, with X outlined in gold dashes and tagged "added".
- Two rows of outcome at y 230 and 256, each with a `Pill`: `reject` "addition rejected"; `accept` "addition preferred", for when the shorter version says only "ʿan…" (the condition in §5.30).
- A link to `hidden`, which notes that an extra narrator is not proof of a hidden mursal (§5.22).

Cell E, "Muḍṭarib" (origin 0,600):

```
x→ 0   60       160          280         400 430
 26 │             Muḍṭarib (i)  مُضْطَرِبٌ
 56 │      (ﷺ) 100,56
 96 │      [C] 100,96
136 │   [P] ⟷ [Q]  80/120,136   one link, two versions
176 │      [N] 100,176
230 │   ⚖ level  100,240        no way to prefer one
 60 │ mostly in the chain,     WHEN IT IS DONE ON PURPOSE        (right column x 200..420)
 84 │ rarely in the text       [to test a scholar] allowed, if not left standing
110 │                          (al-Bukhārī, al-ʿUqaylī)
150 │                          [for rarity] → forgery → Did he lie?
190 │                          [by mistake] → maqlūb or muʿallal
```

- The chain at x=100, k=0.65: moon, a Companion, then the changing link, then a narrator.
- At the changing link, two reliable `later` figures, P at (80,136) and Q at (120,136), each at opacity .55, with "or" between them. Both have arrows from the Companion and to the narrator; the two arrows wobble (§7.7).
- A `Scale` at (100,240), beam 90 wide, tilt 0, one disc on each pan: the versions weigh the same.
- On the right (x 200..420): the `.lbl` "mostly in the chain, rarely in the text"; then "When it is done on purpose", three rows with `Chip`s: allowed to test a scholar if it is not left standing; for rarity, a form of forgery (link to `lying`); by mistake, maqlūb or muʿallal (links to cell C and to `slips`).

Cell F, "Muṣaḥḥaf and muḥarraf" (origin 430,600):

```
x→ 0  30     120     215     310     400 430
 26 │ Muṣaḥḥaf (i) مُصَحَّفٌ        Muḥarraf (i) مُحَرَّفٌ
 50 │   by its dots                  by its vowels
 90 │   ٮ        ٮ        ٮ           ٮ       ٮ       ٮ
    │   ·        ··                   َ       ُ       ِ     (marks pulse)
150 │ the outline stays; only the dots, or only the vowels, change
200 │ most often in the text; sometimes in names in the chains
240 │ al-ʿAskarī, al-Dāraquṭnī and others wrote books on it
```

- Two halves, each with its own title trigger (`ROW_TITLE_TRIGGER` size, 13px, centred at x=110 and x=320).
- Left: one undotted outline (a dotless bāʾ, as in *Who is who?*) drawn three times, the dots changing between them (none, one below, two above). Right: the same outline three times with a fatḥa, ḍamma and kasra. Single letters only, never words. The changing marks pulse.

### 7.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `mukhalafa` | Cell A title, (≈125..305, y 8–38) | The seventh charge: the narrator goes against reliable narrators. Ibn Ḥajar names the result by what changed: the arrangement of a chain, or words slipped into a text (mudraj); one thing put before another (maqlūb); an added narrator (al-mazīd); a narrator changed with no way to prefer one version (muḍṭarib); or letters changed while the outline stays (muṣaḥḥaf, muḥarraf) (§5.23, §5.28–5.32). |
| `mudraj` | Cell B title, (≈145..285, y 4–34) | Going against the reliable by altering how a chain is put together, or by slipping into a text what does not belong to it, without marking it. An insertion is known from a version that sets it apart, from the narrator's or a versed imam's statement, or because the Prophet ﷺ could not have said it. al-Khaṭīb wrote a book on it, which Ibn Ḥajar summarised and more than doubled (§5.28). |
| `mudraj-al-isnad` | Cell B, row title, (14..≈150, y 37–55) | Four kinds. Several chains are merged into one, without saying so. Part of a text held by another chain is told with the first; or part heard only through someone is told without him. Two texts with two chains are told with one chain, or one is given words from the other. Or a narrator reads a chain, is distracted, says something himself, and a listener takes that as its text (§5.28). |
| `mudraj-al-matn` | Cell B, row title, (14..≈145, y 177–195) | Words that do not belong to a text come into it: at its start, in its middle, or, most often, at its end, joined to what comes before. Or the words of a Companion or of someone after him are run into the words of the Prophet ﷺ without saying so (§5.28). |
| `maqlub` | Cell C title, (≈150..280, y 4–34) | Going against the reliable by putting first what comes later. In names: Murra ibn Kaʿb given as Kaʿb ibn Murra, since one's name is the other's father's. In a text: in Abū Hurayra's report of the seven whom Allah shades, as Muslim has it, one narrator made the right hand not know what the left spent; as in both Ṣaḥīḥs, it is the left that does not know what the right spent (§5.29). |
| `mazid` | Cell D title, (≈60..390, y 9–33) | Going against the reliable by adding a narrator inside a chain, when the version without him is more reliable. Its condition is that the version without him states the hearing at the place of the addition. If it does not, if it says only ʿan, for example, the version with the addition is preferred (§5.30). |
| `mudtarib` | Cell E title, (≈140..290, y 4–34) | Versions change a narrator, with no way to prefer one. It is usually in the chain and sometimes in the text, but a ḥadīth master rarely calls a report muḍṭarib for its text alone. A change made on purpose to test a scholar, as with al-Bukhārī and al-ʿUqaylī, is allowed if it is not left standing; made for rarity, it is forgery; made by mistake, it is maqlūb or muʿallal (§5.31). |
| `musahhaf` | Cell F, left title, (≈50..175, y 13–31) | Going against the reliable by changing a letter or letters while the outline of the word stays the same: if the change is in the dots, it is muṣaḥḥaf. It is most often in the text, and sometimes in the names in the chains. Knowing it matters; al-ʿAskarī, al-Dāraquṭnī and others wrote books on it (§5.32). |
| `muharraf` | Cell F, right title, (≈260..385, y 13–31) | The same kind of change, the outline of the word staying the same, but in its vowelling rather than its dots. Like muṣaḥḥaf, it is most often in the text and sometimes in the names in the chains (§5.32). |

### 7.5 Views

None. The translation gives one account of each form.

### 7.6 Grid cells

The cells are 1 What changed? (A), 2 Mudraj (B), 3 Maqlūb (C), 4 al-Mazīd (D), 5 Muḍṭarib (E) and 6 Muṣaḥḥaf and muḥarraf (F). Desktop shows them 2 × 3; portrait shows one column. There are no panels.

### 7.7 Motion

- **Cell B:** each shaded insert fades in once, 0.3s apart.
- **Cell C:** the name chips and the two `diff` words swap places once on load (a transform transition of 0.8s, delay 0.6s), then rest swapped back to how the book gives them: the slipped version on top, the right one under it. The resting state is the end state.
- **Cell E:** the two arrows through the changing link sway (rotate ±3° about the Companion, 3s, alternate, infinite), the one place in the division where motion loops, since the idea is that the link won't settle.
- **Cell F:** the changing dots and vowel marks pulse (`blink`).
- **Reduced motion:** chips and words at rest, inserts shown, arrows still, marks still.

### 7.8 Kit parts

Reuses `Narrator`, `Moon`, `Arrow` (`flow`), `Matn` (with `inactive`), `Chip`, `Pill`, `Scale`, `TermTitle`, `titleTrigger` with `SUBT_TRIGGER` and `ROW_TITLE_TRIGGER`, and `rowTrigger`. The letter glyphs follow `Names.astro`'s dot-offset pattern, which moves to a small shared helper (`lib/kit.ts` `letterDots`) so the two scenes draw them the same way. The mudraj pictograms are scene-local.

### 7.9 Translation slips

- **§5.28 (p.224) "the changing of the text or the changing of the isnād".** The Arabic likely has a change in the siyāq, the arrangement, "that is, the arrangement of the isnād". The site says "how a chain is put together".
- **§5.32 "If the changing is because of the form [of the word], then muḥarraf".** As in the §5.60 row, "the form" renders shakl, which here means vowelling. The site says "vowelling", as `terms.yaml` does.

## 8. Scene 7: May the words be changed? (`wording`)

### 8.1 Header

```yaml
- id: wording
  division: al-mardud
  moons: [1]
  order: 7
  title: May the words be changed?
  eyebrow: Rejected reports, changing the words on purpose · §5.33–5.34
  lede: Changing a report's words on purpose, by cutting it short or putting it in other words, is allowed only to a scholar who knows how words carry meaning. Even then the exact words are better. Where a word is rare, the books on rare words explain it.
  source: §5.33 Ikhtiṣār al-ḥadīth and al-riwāya bi-l-maʿnā, §5.34 Gharīb al-ḥadīth
  diagram: Wording
  width: 780
```

### 8.2 Form, and why it suits the idea

After the mistakes of §5.28–5.32 come the changes made on purpose. All three ideas are about one text card:

1. **Cutting it short:** a text card in segments, cut twice. The expert's cut falls at a seam and leaves two whole reports (check); the ignorant's cut drops the exception the rest depends on (cross).
2. **In other words:** a card passes through a gate, "a scholar who knows how words carry meaning", and comes out with different word shapes over the same meaning band. The four opinions of §5.33 change what may pass the gate, so this is the scene's Other views switch.
3. **Rare words:** a card with one highlighted word box (no word written) and a shelf of the books §5.34 names, in its order, with al-Nihāya marked as the easiest to use.

Being a single row of three, it carousels cleanly.

### 8.3 Sketch (780 × 520)

```
x→ 0  20      130       240 260│ 280       390       500 520│ 540      650       760 780
 30 │ Ikhtiṣār al-ḥadīth (i)     │  al-Riwāya bi-l-maʿnā (i)  │   Gharīb al-ḥadīth (i)
 52 │ cutting part of it         │  telling it in other words │   rare words
 90 │ ┌──┬──┬──┬──┬──┐ text     │ ┌ ▭▭▭ ▭▭ ▭▭▭▭ ┐ the words │ ┌── ── [▓▓] ── ┐ a rare word
    │ └──┴──┴──┴──┴──┘          │ └══ meaning ══┘            │ └──────────────┘
140 │ AN EXPERT ✂ at a seam      │        ↓                   │          ↓
170 │ ┌──┬──┐  ┌──┬──┬──┐ ✓      │  ╔ a scholar who knows ╗   │ ▤ Abū ʿUbayd ibn Sallām
    │ two whole reports          │  ║ how words carry     ║   │   (unarranged) → Ibn Qudāma
230 │ ONE WHO DOES NOT KNOW ✂    │  ╚ meaning ════════════╝   │   put it in letter order
260 │ ┌──┬──┬──┬─┆─┐ ✕          │        ↓                   │ ▤ Abū ʿUbayd al-Harawī
    │ drops the exception        │ ┌ ▭▭ ▭▭▭▭ ▭▭ ▭ ┐            │   the most complete
300 │                            │ └══ meaning ══┘ ✓          │ ▤ al-Zamakhsharī, al-Fāʾiq
340 │ most allow it only to an   │ the exact words are        │ ▤★ Ibn al-Athīr, al-Nihāya
    │ expert                     │ always better              │    the easiest to consult
400 │                            │ (view tag, y 400–440)      │ A COMMON WORD, A SPECIAL SENSE
430 │                            │                            │ ▤ meanings of reports ·
    │                            │                            │   difficult reports
460 │                            │                            │ al-Ṭaḥāwī, al-Khaṭṭābī,
    │                            │                            │ Ibn ʿAbd al-Barr
```

- **Panel 1:**
  - A text card at (20..240, 80..110) in five rule-line segments. Under "An expert", a new `Glyph scissors` at a seam, and the card split into two complete cards with a `Glyph check`. Under "One who does not know", the scissors cut through the last segment, which is tagged "except…" (the only words shown), with a `Glyph cross`.
  - The `.lbl` "most allow it only to an expert" closes the panel.
- **Panel 2:**
  - A card at (290..510, 80..120): a top row of word blocks of mixed widths, over a gold "meaning" band.
  - A gate (a rounded double-edged rect) at (300..500, 160..215) with the two-line label.
  - The output card at (290..510, 255..295): the word blocks are different widths and order; the meaning band is identical. A `Glyph check` beside it.
  - The `.lbl` "the exact words are always better" at y=340.
  - A view tag group at y 400–440 that changes with the view (§8.5).
- **Panel 3:**
  - A card with one shaded word box at (550..770, 80..110).
  - A shelf of five `Glyph book`s with `.lbl`s, in §5.34's order. Ibn al-Athīr's al-Nihāya gets a small gold star and "the easiest to consult".
  - Under "A common word, a special sense", one more book row for the works on the meanings of reports and on difficult reports, and their three authors.

### 8.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `ikhtisar-al-hadith` | Panel 1 title, (≈25..235, y 13–37) | Cutting part of a report. Changing a text on purpose is allowed only to a scholar who knows what words signify, and the majority allow shortening on that condition. The expert drops only what has no tie to the rest, so the meaning holds and the two parts stand like two reports, or the kept part points to the dropped one. One who does not know may drop what matters, such as an exception (§5.33). |
| `riwaya-bil-mana` | Panel 2 title, (≈285..515, y 13–37) | Telling a report in other words of the same meaning. The dispute is well known; most allow it to a scholar who knows how words carry meaning. Their strongest proof: all agree an expert may explain the Law to non-Arabs in their own language, so other Arabic words are allowed all the more. Still, the exact words are without doubt better, and al-Qāḍī ʿIyāḍ wished the practice would stop (§5.33). |
| `gharib-al-hadith` | Panel 3 title, (≈560..760, y 13–37) | When a word is unclear because it is rare, the books on rare words explain it: Abū ʿUbayd al-Qāsim ibn Sallām's, unarranged until Ibn Qudāma put it in letter order; Abū ʿUbayd al-Harawī's, the most complete; al-Zamakhsharī's al-Fāʾiq; and Ibn al-Athīr's al-Nihāya, the easiest to consult. A common word in a special sense needs the books on the meanings of reports and on difficult reports (§5.34). |

### 8.5 Views

The translation reports four positions on telling by meaning (§5.33). The majority's is the default; Ibn Ḥajar sides with it ("the correct opinion in both issues").

| id | Label | Scholars | Note |
|---|---|---|---|
| `most` | Most scholars | §5.33 | Allowed to a scholar who knows how words carry meaning, on the correct opinion. Their strongest proof is that all agree an expert may explain the Law to non-Arabs in their own language. |
| `single-words` | Single words only | "It is said", §5.33 | Allowed for single words, not for whole sentences. |
| `knows-wording` | If he knows the words | "It is said", §5.33 | Allowed only to one who knows the original words, so that he can go back to them. |
| `forgot` | If he has forgotten the words | "It is said", §5.33 | Allowed only to one who memorised the report and then forgot its words, while its meaning stays firm in his mind. He may then tell it by meaning to state a ruling, unlike one who still knows its wording. |

Only panel 2 changes. Each view shows its own tag group at y 400–440 (`data-view-show`), and adjusts the output card:

| View | Output card | Tag |
|---|---|---|
| `most` | all word blocks differ | "a scholar who knows how words carry meaning" |
| `single-words` | one word block differs, the rest unchanged | "single words, not sentences" |
| `knows-wording` | as `most`, with a thin dashed return arrow from the output card back to the input | "he can go back to the words" |
| `forgot` | as `most`; the input card's word blocks are faded (forgotten), its meaning band solid | "the words forgotten, the meaning kept" |

### 8.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `shortening` | Cutting it short | 0 | 260 |
| `by-meaning` | In other words | 260 | 520 |
| `rare` | Rare words | 520 | 780 |

### 8.7 Motion

- **Panel 1:** the scissors close once at each cut (0.4s, delay 0.6s and 1.4s); the cut pieces then move apart by 6 units.
- **Panel 2:** the card slides through the gate once (translate y, 1.2s), its word blocks reshuffling as it passes. A view change crossfades the tag and output (or swaps instantly).
- **Panel 3:** the star on al-Nihāya brightens once.
- **Reduced motion:** cuts made, pieces apart, output card in place. Base styles are the end state.

### 8.8 Kit parts

Reuses `Matn`-style cards, `Glyph` (`check`, `cross`, `book`), `TermTitle` and `panelTrigger`. New: `Glyph scissors`. The gate, the word blocks and the meaning band are scene-local.

### 8.9 Translation slips

- **§5.33 (p.238) "the consensus on the permissibility of commentaries on sharʿa [sources] done by non-Arabs undertaken by their experts".** The sense is likely "explaining the Law to non-Arabs in their own language, by one who knows it". The site says that.
- **§5.33 "or by changing it to divert the meaning, except by a scholar aware of the indications of the words".** The Arabic likely pairs "what words signify" with "what changes meanings". The notes say "how words carry meaning", which covers both.

## 9. Scene 8: Why is he unknown? (`identity`)

### 9.1 Header

```yaml
- id: identity
  division: al-mardud
  moons: [1]
  order: 8
  title: Why is he unknown?
  eyebrow: Rejected for a narrator who is unknown, the causes · §5.35
  lede: The eighth charge is that a narrator is unknown, so no one can say whether he is trustworthy. Ibn Ḥajar gives two causes. A man known by many names is taken for several men, and a man who narrates little has hardly anyone to take from him.
  source: §5.35 Jahāla and al-wuḥdān
  diagram: Identity
  width: 860
```

### 9.2 Form, and why it suits the idea

The two causes are two different pictures:

1. **Many names, one man.** Six faint figures, each wearing one of al-Kalbī's six names, slide together into one figure who carries all six tags. A reader who doesn't know they are one man sees a group, which is exactly the mistake §5.35 describes.
2. **Few take from him.** A narrator with one arrow down to one student, against a reliable narrator with many, and the two book chips of §5.35.

Each ends in a link to *Who is this narrator?*, where the kinds that follow (majhūl al-ʿayn, mastūr, mubham) are drawn. The two ideas don't share a layout, so the scene is a **grid of two cells**, each `<svg viewBox="0 0 430 380">`. Cell A holds `<Defs/>`.

### 9.3 Sketches (each cell 430 × 380)

Cell A, "Many names" (origin 0,0):

```
x→ 0   40   110   180   250   320   390 430
 30 │                 Jahāla (i)  جَهَالَةٌ
 52 │          many names, taken for many men      (.lbl)
 80 │  [M. ibn al-Sāʾib ibn Bishr al-Kalbī]          his name (chip, 215,80)
120 │   ⊙◌     ⊙◌     ⊙◌     ⊙◌     ⊙◌     ⊙◌      six faint majhūl figures, start state
    │ M. ibn  Ḥammād  Abū    Abū    Abū    (his
    │ Bishr   ibn al- al-Naḍr Saʿīd Hishām  name)
    │         Sāʾib
200 │                     ⊙ 215,230                   end state: one figure
    │      [M. ibn Bishr] [Ḥammād ibn al-Sāʾib]       tags round him
270 │      [Abū al-Naḍr] [Abū Saʿīd] [Abū Hishām]
310 │ by his grandfather · another name · by his son  (.lbl, under the tag groups)
340 │ name, lineage, title, trade, description, ancestry: any can mislead
364 │ → what follows: Who is this narrator?          (link to unknown)
```

- **Start state** (the animation's `from`): six `majhul` figures (scroll, blinking empty seal slot) at x = 40, 110, 180, 250, 320 and 390, y=130, k=0.6, opacity .6, each with one name under it.
- **End state** (the resting style): one `majhul` figure at (215,230), k=0.9, with five name `Chip`s arranged round it (two rows at y 270 and 300), and his full name in a chip above at (215,80). The figures are majhūl because §5.35 says his state becomes unknown; the scroll stays because he *is* named.
- The `.lbl` groupings say how each name came about: "after his grandfather" (Muḥammad ibn Bishr), "another name" (Ḥammād ibn al-Sāʾib), "after his son" (the three kunyas).

Cell B, "Few take from him" (origin 430,0):

```
x→ 0   60        160           300          400 430
 30 │                al-Wuḥdān (i)  الْوُحْدَانُ
 52 │          he narrates little, and few take from him
100 │   [⊙◌] 110,110                   [⊙⊙] 320,110
    │     ↓                            ↙ ↓ ↓ ↘
190 │   [·] 110,190                  [·][·][·][·]
230 │ only one narrates from him     many narrate from him
260 │ BOOKS OF AL-WUḤDĀN   [Muslim]  [al-Ḥasan ibn Sufyān]
300 │ even when he is named
330 │ one narrator: majhūl al-ʿayn · two or more, no one vouches: mastūr
364 │ → Who is this narrator?                        (link to unknown)
```

- Left: a `majhul` figure at (110,110), k=0.8, with one `flow` arrow to one plain figure at (110,190), k=0.6.
- Right, for contrast, at opacity .5: a reliable figure at (320,110) with four arrows to four figures. No label claims anything about the reliable one beyond "many narrate from him".
- Two `Chip`s for the compilers, with `Glyph book`s.
- The two kinds at y=330 are plain text, with the link to `unknown` under them.

### 9.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `jahala` | Cell A title, (≈150..280, y 8–38) | The eighth charge: the narrator is unknown, so his trustworthiness can't be judged. One cause: he has many names, lineages, titles, trades or descriptions, is known by one and cited by another, and is taken for someone else. Muḥammad ibn al-Sāʾib ibn Bishr al-Kalbī was also called Muḥammad ibn Bishr, Ḥammād ibn al-Sāʾib, Abū al-Naḍr, Abū Saʿīd and Abū Hishām, until he seemed a group (§5.35). |
| `wuhdan` | Cell B title, (≈130..300, y 8–38) | The other cause of being unknown: the narrator narrates little, so few take from him. Scholars listed such men in books of al-wuḥdān: narrators from whom only one person narrates, even when he is named. Muslim and al-Ḥasan ibn Sufyān were among those who compiled them. Who narrates from him then decides which kind of unknown he is (§5.35–5.36). |

**Extra** (Read as text only):

1. **Books on men with many names** (§5.35). Scholars wrote on this; al-Khaṭīb's al-Mūḍiḥ is the best, preceded by ʿAbd al-Ghanī and then al-Ṣūrī. One who does not know that the names belong to one man will miss it.

### 9.5 Views

None.

### 9.6 Grid cells

The cells are 1 Many names (A) and 2 Few take from him (B). Desktop shows them side by side; portrait shows one column.

### 9.7 Motion

- **Cell A:** the six figures slide together and merge into one over 1.6s, once, after a 0.8s delay; the tags fly to their places round him. The seal slots blink throughout.
- **Cell B:** the arrows `flow` down.
- **Reduced motion:** the end state: one figure with his tags, slots still. The six figures are not shown, so the base style is the end state, as always. A `.lbl` "taken for six men" under the title keeps the idea in the static picture.

### 9.8 Kit parts

Reuses `Narrator` (`majhul`), `Arrow`, `Chip`, `Glyph book`, `TermTitle` and `titleTrigger`. No new parts.

### 9.9 Translation slips

- **§5.35 (p.251) "al-Muwaḍḍiḥ li-awhām wa-al-tafrīq".** The title is usually given as al-Mūḍiḥ li-awhām al-jamʿ wa-l-tafrīq. Spelling only; the extra says "al-Mūḍiḥ".

## 10. Scene 9: Does his belief count against him? (`innovation`)

### 10.1 Header

```yaml
- id: innovation
  division: al-mardud
  moons: [1]
  order: 10
  title: Does his belief count against him?
  eyebrow: Rejected for open sin or innovation · §5.23, §5.37
  lede: Open sin in deeds or words is the fifth charge. Innovation is the ninth, a belief against what is established from the Prophet ﷺ, held through a misreading rather than out of defiance. Whether an innovator's report is accepted depends on how far his belief goes, and on whether he calls others to it.
  source: §5.23 Fisq, §5.37 Bidʿa
  diagram: Innovation
  width: 780
```

### 10.2 Form, and why it suits the idea

§5.23 says open sin in *belief* will be explained later, and §5.37 explains it as innovation of two kinds. So:

1. **Panel 1** sets open sin in deeds or words beside sin in belief, with an arrow from one to the other: two figures, one with a cracked seal, one holding a belief tag.
2. **Panels 2 and 3** are **decision paths**, one for each kind of innovation: belief that amounts to disbelief, and belief short of it. Each question drops to a verdict `Pill`, as in *Can both be acted on?*.

The rival opinions of §5.37 change the paths, so they are the scene's Other views. Each view redraws the decision paths with `data-view-show` groups.

### 10.3 Sketch (780 × 560)

```
x→ 0   30  70       190 260│ 280   330       450  520│ 540  600         720  780
 30 │ Fisq (i)  فِسْقٌ       │ AMOUNTS TO DISBELIEF     │ SHORT OF DISBELIEF
 52 │ in deeds or words      │                          │
 80 │ [crack] 70,100         │ ▭ innovator              │ ▭ innovator
    │ open sin, short of     │      ↓                   │      ↓
    │ disbelief              │ ◇ denies a mutawātir     │ ◇ calls others to it?
150 │ lying is a kind of it, │   matter known by        │   │yes → (Rejected)
    │ listed first →         │   necessity, or holds    │   no
    │ Did he lie?            │   its opposite?          │   ↓
220 │      ↓ in belief       │   │yes → (Rejected)      │ ◇ narrates what
250 │ Bidʿa (i)  بِدْعَةٌ    │   no                     │   supports it?
    │ [⊙ + belief tag] 70,300│   ↓                      │   │yes → (Rejected)
330 │ against what is        │ careful and pious?       │   no
    │ established, through   │   → (Accepted)           │   ↓
    │ a misreading           │                          │ (Accepted)
400 │                        │ every sect calls others  │ "the most correct view"
    │                        │ heretics: not every such │
430 │                        │ belief rejects           │ Ibn Ḥibbān claimed all
460 │                        │                          │ agree, without detail: too far
```

- **Panel 1:**
  - The `fisq` row title at (20,30). A `weak` figure at (70,100), k=0.8, and three `.lbl` lines. A link "lying is a kind of it, listed first →" to `lying`.
  - An arrow down labelled "in belief" to the `bida` row title at (20,250). A reliable `later` figure at (70,300) with a small belief tag (a speech-bubble-shaped tag with no words, filled `--pause`). Three `.lbl` lines.
- **Panel 2:**
  - Start chip "innovator" at (300,80). `Decision` at (390,150), w=200, h=90, lines "denies a mutawātir / matter known by / necessity, or its opposite?".
  - "yes" runs right to a `Pill state="reject"` "Rejected" at (480,190). "no" drops to the `.lbl` "careful and pious?" at (390,300) and an "Accepted" pill at (390,340).
  - The two-line `.lbl` reason at y 400–430.
- **Panel 3:**
  - Start chip at (560,80). `Decision` at (650,140) "calls others to it?" with "yes" to a "Rejected" pill at (740,180). "no" drops to a second `Decision` at (650,260) "narrates what / supports it?", with "yes" to "Rejected" at (740,300) and "no" to "Accepted" at (650,370).
  - Tags at y 400 ("the most correct view") and y 430–460 (Ibn Ḥibbān).

### 10.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `fisq` | Panel 1, row title, (14..≈75, y 17–35) | The fifth charge: open sin, in deeds or words, that does not reach disbelief. Lying is a kind of it, but is listed on its own, and first, because it harms this field the most. When the sin is plain, his report is munkar for those who do not require opposition in munkar. Sin in belief is explained later, as innovation (§5.23, §5.26). |
| `bida` | Panel 1, row title, (14..≈80, y 237–255) | The ninth charge: a belief against what is established from the Prophet ﷺ, held through a misreading, not defiance. If it amounts to disbelief, Ibn Ḥajar rejects only one who denies a mutawātir matter known by necessity, or holds its opposite. If not, he is accepted unless he calls to it (the most correct view) or narrates what supports it (the preferred view) (§5.23, §5.37). |

**Extra** (Read as text only):

1. **The other opinions** (§5.37). On belief that amounts to disbelief: the majority do not accept such a narrator; it is also said he is accepted outright; and it is said he is accepted if he does not hold lying allowed in support of his view. Ibn Ḥajar answers that every sect calls its opponents heretics, and some call them disbelievers; taken generally, that would make every sect disbelievers. On belief short of disbelief: it is said he is rejected outright, which Ibn Ḥajar calls far-fetched, since narrating from him would then be rejected even when a non-innovator shares the report; it is said he is accepted unless he holds lying allowed; and it is said he is accepted if he does not call to it, the most correct view. Ibn Ḥibbān went too far in claiming everyone agrees to accept one who does not call to it, without further detail.
2. **al-Jūzajānī** (§5.37). The rejection of one who narrates what supports his innovation is the preferred view of the majority, as al-Jūzajānī made clear. Describing a narrator who turns away from the truth, he said that if such a man is truthful and his ḥadīth is not munkar, nothing stops us accepting it, so long as he does not openly call to his belief. Ibn Ḥajar calls this strong: the reason to reject an innovator's report is that its text appears to support his belief, even when he does not call to it openly.

### 10.5 Views

The translation reports rival opinions on both kinds (§5.37). Ibn Ḥajar's is the default. Only the two clean, symmetrical positions are views; the rest are told in extra 1.

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar | §5.37 | If the belief amounts to disbelief, reject only one who denies a mutawātir matter known by necessity, or holds its opposite; accept one who is careful and pious. If it is short of disbelief, accept him unless he calls to it or narrates what supports it. |
| `unless-lying` | Unless he allows lying | "It is said", §5.37, for both kinds | Accept the innovator's report, of either kind, unless he holds that lying is allowed in support of his view. |
| `reject` | Reject | The majority, for the first kind; "it is said", for the second | The majority do not accept one whose belief amounts to disbelief. Some reject the second kind outright too; Ibn Ḥajar calls that far-fetched. |

Under each view, panels 2 and 3 show that view's path group (`data-view-show`). Panel 1 and the two triggers are the same in every view.

| View | Panel 2 | Panel 3 |
|---|---|---|
| `ibn-hajar` | as sketched | as sketched |
| `unless-lying` | one `Decision` "holds lying allowed?" yes → Rejected, no → Accepted | the same |
| `reject` | the start chip runs straight to "Rejected" (tag "the majority") | straight to "Rejected" (tag "it is said: far-fetched") |

### 10.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `sin` | Open sin | 0 | 260 |
| `disbelief` | Amounts to disbelief | 260 | 520 |
| `short` | Short of disbelief | 520 | 780 |

### 10.7 Motion

- **Paths:** the arrows `flow` along the decision paths, top to bottom, the direction of the reasoning (as *Can both be acted on?*).
- **View change:** the path groups swap; instant is acceptable.
- **Reduced motion:** nothing moves.

### 10.8 Kit parts

Reuses `Narrator` (`weak`), `Decision`, `Pill`, `Chip`, `Arrow`, `TermTitle` and `rowTrigger`. The belief tag is scene-local.

### 10.9 Translation slips

- **§5.23 (p.194) "not out of conviction but with a shade of doubt".** The Arabic is likely "not out of defiance (muʿānada) but through some specious reasoning (shubha)". The site says "through a misreading, not out of defiance".
- **§5.37 (p.261) "al-Jūzajānī, the shaykh of Abū Dāwūd, has clarified, as well as al-Nasāʾī in his book Maʿrifat al-ʿilal".** The Arabic likely reads "the shaykh of Abū Dāwūd and al-Nasāʾī, in his book Maʿrifat al-rijāl": the book is al-Jūzajānī's, and al-Nasāʾī is his student, not a second authority. The site credits al-Jūzajānī only and names no book.
- **§5.37 "the report of the agent".** No such word seems to stand there in the Arabic; the opinion is simply "accepted outright unless he holds lying allowed". The site avoids "agent", and says "one who calls to it" for the dāʿiya.
- **§5.37 "Ibrāhīm Yaʿqūb al-Jurzjānī".** Likely Ibrāhīm ibn Yaʿqūb al-Jūzajānī. Spelling only.

## 11. Note lengths

Each note was measured after writing, in Unicode code points. All 31 caption notes and the nine view notes fit under the 400-character working cap, and so under the zod `max(420)`.

- **Caption notes:** the longest are `mawdu` and `gharib-al-hadith` at 398, then `tan`, `muallal` and `ikhtisar-al-hadith` at 397. The shortest is `ghafla` at 185.
- **View notes:** the longest is `hidden`'s `ibn-hajar` at 253, then `contemporary` at 231.
- **Extras:** all seven fit the 900 limit. The longest are `innovation`'s "The other opinions" at 810 and `lying`'s "Where forged words come from, and why" at 752.

## 12. New SVG kit parts (all scenes)

| Part | Props | Used in | Notes |
|---|---|---|---|
| `Lifespan.astro` | `x0, x1, y, name?, tone?: "moon"` | 1, 3 | A rounded bar 8 tall with an optional end label. No axis, dates or ticks; `aria-hidden`. |
| `Glyph` + `coin`, `scissors` | as the other kinds; `coin` takes `dashed?` | 5, 7 | Drawn icons, no text glyphs (WCAG 2.5.3). |
| `SpeechBubble` | `ar` optional | 3 | Without `ar`, the `en` line sits in the middle of the bubble. |
| `Narrator` face `mask-dashed` | | 4 | The mask path with a dashed stroke, no fill and no eyes: suspected, not proven. |
| `figures.ts` | `liar`, `accused`, `mudallis`, `mukhtalit`, with `KIND_NAME`s | 3, 4, 5 | Legend entries follow automatically. The first three and the last already appear on `/narrators/`. |
| `lib/kit.ts` `letterDots` | `(cx, cy, dots, r)` | 6 | Moves the dot-offset helper out of `Names.astro`, which switches to it in the same commit. |

Everything else is reused: `Moon`, `Narrator`, `Arrow` (`flow`, `skip`), `Bracket`, `Chip`, `Pill`, `Matn` (with `added` and `inactive`), `Scale`, `Decision`, `Glyph` (`lens`, `check`, `cross`, `pause`, `clock`, `book`, `text`), `TermTitle`, and the `geom.ts` triggers.

## 13. Owner's annotations

These are the owner's PDF annotations on these pages (PDF pp.164–279), used or proposed for use. They are to be added to `notes/annotation-usage.md` for approval. Rows marked "used" are reflected in the design above; rows marked "proposed" are not written into any note above.

| Page | Annotation (short) | Use | Status |
|---|---|---|---|
| p.193 | Two main categories: missing link (apparent, hidden) and issues with the narrator (integrity or accuracy) | Agrees with scene 1's two cells and cell A's plain and hidden boxes; no wording taken | used (structure) |
| p.193 | "Negligence" better translated "naive" | `ghafla` note, "a naive carelessness" (the existing approved-pending row) | used |
| p.182 | "Teacher told me" for what one did not hear is lying; qāla and ʿan are tadlīs | Agrees with §5.21; scene 3 panel 1's bubble and its "a liar" aside. The owner's classmate story is not used | used (layout) |
| p.221 | After looking at all the chains, they find a problem with the ḥadīth | Agrees with §5.27; scene 5 panel 2's gathered routes | used (layout) |
| p.224 | Something inserted without saying it was inserted, in the isnād or the content | Agrees with §5.28; scene 6 cell B's two rows | used (structure) |
| p.226 | Mawḍūʿ is intentional, unlike the mixed-up | Agrees with §5.31; scene 6 cell E's "on purpose" rows | used (structure) |
| p.231 | Muḍṭarib: two options of equal weight that can't be decided | Agrees with §5.31; scene 6 cell E's level scale. "Inconsistent" is already the `en` | used |
| p.237–238 | Moving to the intentional changes; da'wa in other languages as a proof | Agrees with §5.33; scene 7's framing and the `riwaya-bil-mana` proof | used (structure) |
| p.272 | Memory loss: narrated before (accept), after (don't accept), unknown (3a, 3b) | "After: don't accept" could become a verdict pill on scene 5's "after" card. The translation names only "before" and "can't tell" | proposed |
| p.230 | Al-mazīd: the opposite of tadlīs; conditions | Conditions 1–2 agree with §5.30 and are used; "the opposite of tadlīs" could become a sub-label linking the two scenes | proposed |
| p.182 | The classmate example (arriving late, asking a classmate) | Could illustrate scene 3 panel 1; it is the owner's teacher's example | proposed |
| p.183, p.272 | Tadlīs al-shuyūkh (calling a shaykh by an unfamiliar name) | Beyond the translation's §5.21 | not used |
| p.183 | Ibn Ḥajar's five ranks of mudallisīn, from his book on tadlīs | Beyond the translation | not used |
| p.189 | The majority include meeting-less contemporaries in tadlīs | The `contemporary` view exists because the translation reports it; "the majority" is not in the translation and conflicts with "the trusted opinion" | not used |
| p.194 | Why innovation ranks below open sin | A teacher's reasoning, not in the translation | not used |
| p.195–197 | Liar first "very weak", then mawḍūʿ; Nūḥ ibn Abī Maryam and the Baghdad forger; Ṣūfīs | Beyond the translation | not used |
| p.227 | Maqlūb's conditions (a mistake that changes the meaning); swaps between shaykh and student | Beyond the translation | not used |
| p.238 | Where telling by meaning is forbidden (adhān, adhkār, the unseen) | Beyond the translation | not used |
| p.251 | Why narrators used many names | Beyond the translation | not used |
| p.261 | The muḥaddithūn's practice with innovators | Beyond the translation | not used |

## 14. Translation slips

These are to be added to `notes/translation-queries.md`.

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.17 (p.164) | "more general than for a matter pertaining to the narrator's piety and his accuracy" | The sense is "whether it concerns his religion or his accuracy". The site says that. | |
| §5.22 (p.189) | "The difference between mudallas and mursal khafī is intrinsic" | Likely daqīq, "subtle". The site says "fine but real". | |
| §5.23 (p.193) | "his doubts, in that he reports ambiguously" | Wahm: he reports on a mistaken impression. The site says "mistaken impression". | |
| §5.23 (p.193) | "his ignorance, in that his credibility … is not identified" | The cause is jahāla, being unknown. The site says "being unknown". | |
| §5.23 (p.194) | "not out of conviction but with a shade of doubt" | Likely "not out of defiance (muʿānada) but through specious reasoning (shubha)". The site says "through a misreading, not out of defiance". | |
| §5.24 (p.195) | "Ibn Daqīq al-ʿYd" | Spelling: al-ʿĪd. | |
| §5.27 (p.221) | "Yaʿqūb ibn Abī Shayba" | Likely Yaʿqūb ibn Shayba. Left out of the expert chips until a ruling. | |
| §5.27 (p.221) | "Ibn Abī Ḥātim" | As the §5.10.2 row: likely Abū Ḥātim. Left out until a ruling. | |
| §5.28 (p.224) | "the changing of the text or the changing of the isnād" | Likely "a change in the arrangement (siyāq), that is, of the isnād". The site says "how a chain is put together". | |
| §5.32 (p.234) | "If the changing is because of the form [of the word], then muḥarraf" | As the §5.60 row: "form" renders shakl, vowelling. The site says "vowelling". | |
| §5.33 (p.238) | "commentaries on sharʿa [sources] done by non-Arabs undertaken by their experts" | Likely "explaining the Law to non-Arabs in their own language, by one who knows it". The site says that. | |
| §5.35 (p.251) | "al-Muwaḍḍiḥ li-awhām wa-al-tafrīq" | Usually al-Mūḍiḥ li-awhām al-jamʿ wa-l-tafrīq. Spelling only. | |
| §5.37 (p.261) | "al-Jūzajānī, the shaykh of Abū Dāwūd … as well as al-Nasāʾī in his book Maʿrifat al-ʿilal" | Likely "the shaykh of Abū Dāwūd and al-Nasāʾī, in his book Maʿrifat al-rijāl". The site credits al-Jūzajānī only, and names no book. | |
| §5.37 (p.260) | "the report of the agent is accepted in general, except…" | "Agent" seems not to stand in the Arabic here. The site avoids it. | |
| §5.37 (p.261) | "Ibrāhīm Yaʿqūb al-Jurzjānī" | Likely Ibrāhīm ibn Yaʿqūb al-Jūzajānī. Spelling only. | |

## 15. Term map (all 31)

| # | Term | Scene | Where |
|---|---|---|---|
| 1 | saqt | causes | Cell A title |
| 2 | tan | causes | Cell B title |
| 3 | mudallas | hidden | Panel 1 title |
| 4 | mudallis | hidden | Panel 1, under the figure |
| 5 | mursal-khafi | hidden | Panel 2 title |
| 6 | kadhib | lying | Panel 1, row 1 |
| 7 | tuhma-bil-kadhib | lying | Panel 1, row 2 |
| 8 | matruk | lying | Panel 1, sub-title |
| 9 | mawdu | lying | Panel 2 title |
| 10 | fuhsh-al-ghalat | slips | Panel 1, row 1 |
| 11 | ghafla | slips | Panel 1, row 2 |
| 12 | wahm | slips | Panel 2, under route A |
| 13 | muallal | slips | Panel 2 title |
| 14 | su-al-hifz | slips | Panel 3 title |
| 15 | mukhtalit | slips | Panel 3, under the faded figure |
| 16 | mukhalafa | changes | Cell A title |
| 17 | mudraj | changes | Cell B title |
| 18 | mudraj-al-isnad | changes | Cell B, row 1 |
| 19 | mudraj-al-matn | changes | Cell B, row 2 |
| 20 | maqlub | changes | Cell C title |
| 21 | mazid | changes | Cell D title |
| 22 | mudtarib | changes | Cell E title |
| 23 | musahhaf | changes | Cell F, left title |
| 24 | muharraf | changes | Cell F, right title |
| 25 | ikhtisar-al-hadith | wording | Panel 1 title |
| 26 | riwaya-bil-mana | wording | Panel 2 title |
| 27 | gharib-al-hadith | wording | Panel 3 title |
| 28 | jahala | identity | Cell A title |
| 29 | wuhdan | identity | Cell B title |
| 30 | fisq | innovation | Panel 1, row 1 |
| 31 | bida | innovation | Panel 1, row 2 |

The counts are causes 2, hidden 3, lying 4, slips 6, changes 9, wording 3, identity 2 and innovation 2, for 31. With `breaks`' 4 and `unknown`'s 4, the division's 39 terms are all on a scene. Pending: 0. View-only: 0.

## 16. Implementation outline

This follows the conventions of the phase 2 plan and the earlier phase 3 builds: `rtk`, bun only, one commit per task, no trailers, LF, never staging `source/`. Kit, schema and test changes go into the commit of the scene that first needs them.

**Task 1: scene `causes`.**
- Add `Causes` to the `diagram` enum and `LEGEND`.
- YAML entry (§2), with `scene: causes` on its 2 terms; `breaks` to `order: 2`, `unknown` to `order: 9`.
- `Causes.astro` as a two-cell grid; cell A has `<Defs/>`. The rung links point at scenes that don't exist yet; until each lands, its rung renders without a link (a build-time lookup in `scenes.yaml`), so no link is ever broken.
- Verify: `?saqt` and `?tan` landing in portrait; reduced motion shows all rungs.
- Commit `scenes: add why-is-a-report-rejected overview`.

**Task 2: scene `hidden`.**
- Add `Hidden`; `FIG.mudallis`; the kit `Lifespan` (and switch scene 1 to it); `SpeechBubble` with optional `ar`.
- YAML (§4), 3 terms, one extra, two views.
- `Hidden.astro`, three panels.
- Verify: `?view=contemporary` swaps panel 3's pill and shows the tag; `?mursal-khafi` from that view stays on it; `?mudallis` portrait landing.
- Commit `scenes: add did-he-hear-it hidden drops`.

**Task 3: scene `lying`.**
- Add `Lying`; `FIG.liar`, `FIG.accused`, the `mask-dashed` face.
- YAML (§5), 4 terms, three extras.
- `Lying.astro`, three panels.
- Verify: the added tail pulses; reduced motion shows cards and crosses; `?matruk` portrait landing.
- Commit `scenes: add did-he-lie forgery scene`.

**Task 4: scene `slips`.**
- Add `Slips`; `FIG.mukhtalit`; `Glyph coin`.
- YAML (§6), 6 terms.
- `Slips.astro`, three panels, with the lens sweep.
- Verify: reduced motion shows the ring drawn and all routes; `?wahm` lands in panel 2.
- Commit `scenes: add did-he-keep-it-right accuracy scene`.

**Task 5: scene `changes`.**
- Add `Changes`; move the letter-dot helper to `lib/kit.ts` and switch `Names.astro` to it.
- YAML (§7), 9 terms.
- `Changes.astro` as a six-cell grid, with in-page anchors from cell A.
- Verify: grid stacking in portrait; the anchors land on their cells; cell E's sway stops under reduced motion.
- Commit `scenes: add what-changed mukhalafa grid`.

**Task 6: scene `wording`.**
- Add `Wording` (no legend); `Glyph scissors`.
- YAML (§8), 3 terms, four views.
- `Wording.astro`, three panels.
- Verify: each of the four views swaps panel 2; `?riwaya-bil-mana` from `?view=forgot` stays on it.
- Commit `scenes: add may-the-words-be-changed scene`.

**Task 7: scene `identity`.**
- Add `Identity`.
- YAML (§9), 2 terms, one extra.
- `Identity.astro`, two cells.
- Verify: reduced motion shows the merged figure; the links to `unknown` resolve.
- Commit `scenes: add why-is-he-unknown scene`.

**Task 8: scene `innovation`.**
- Add `Innovation`.
- YAML (§10), 2 terms, two extras, three views.
- `Innovation.astro`, three panels.
- Verify: each view redraws both decision paths; `?bida` portrait landing.
- Commit `scenes: add does-his-belief-count scene`.

**Task 9: tests and screenshots.**
- `routes.spec.ts` picks up eight more routes from the sitemap.
- `scenes.spec.ts` gains: landing for all 31 terms, desktop and portrait; views on `hidden`, `wording` and `innovation`; carousels on the five panel scenes; grid stacking on `causes`, `changes` and `identity`; the legend kinds per scene; prev/next order through all ten scenes of the division; every rung link on `causes` resolves.
- Add the eight scenes to `motion.spec.ts`: with reduced motion, `getAnimations()` is empty.
- Screenshots: desktop and mobile, light and dark.
- Commits: `test: add al-mardud scene tests` (if anything is left over from the scene commits) and `docs: add al-mardud screenshots`.

**Task 10: spec and notes.**
- Spec §4.3: add a phase 3 division 3 table, one row per scene, and note the order change of `breaks` and `unknown`.
- `notes/translation-queries.md`: add §14.
- `notes/annotation-usage.md`: add the "used" rows of §13, and the "proposed" rows under Proposals.
- `divisions.yaml`: the moon labels are unchanged.
- Commit `docs: update spec and notes for al-mardud`.

## 17. Open questions for the owner

1. **Eight scenes.** §5.33–5.34 (shortening, telling by meaning, rare words) have their own scene. Should they instead be two more cells of *What changed in the telling?*, making seven scenes, one of them 12 terms and eight cells?
2. **Order.** The overview first, then the book's order, with `breaks` second and `unknown` ninth. Agree, or keep `breaks` and `unknown` at 1 and 2 and put the overview third?
3. **Integrity and accuracy tags.** §5.23 says five causes touch integrity and five accuracy, but doesn't mark which. Should the ladder tag them (a seal for integrity, a memory glyph for accuracy), following what each cause is about? Interim: no tags.
4. **Ordinals on the ladder.** The book counts the causes ("the sixth", "the eighth"…), so the rungs carry small ordinals. Acceptable under the "no numbers" rule, which is about gauges?
5. **The suspect's figure.** A dashed mask with no fill and a cracked seal. Approve, and should it join `/narrators/` as a ninth case (term `tuhma-bil-kadhib`)?
6. **Delivery words in Arabic.** `unknown` shows حَدَّثَنِي رَجُلٌ in its speech bubble. May scene 3's bubbles show عَنْ and قَالَ in Arabic too, or stay in transliteration? Interim: transliteration.
7. **After the memory failed.** The translation names only "before" (accepted if told apart) and "can't tell" (held back). Should the "after" card carry a "not accepted" pill, as the owner's p.272 note says? Interim: no verdict.
8. **The muʿallal picture.** The translation gives no example, so panel 2 draws an unnamed chain where a narrator joined up a mursal, which is one of the indications §5.27 names. Acceptable?
9. **Abstract cells.** Mudraj, al-mazīd, muḍṭarib, muṣaḥḥaf and muḥarraf have no example in the translation; the footnote examples are Ibn al-Ṣalāḥ's and the thesis author's. Keep the labelled diagrams, or supply checked examples to add later?
10. **The pigeon fragment.** Scene 4 shows "“no contest except…”" and "“and pigeon racing”" in English on a `Matn` card. Within the "a few words" rule?
11. **Generation colours.** The two mukhaḍramūn are green (Successors), from general knowledge. Approve, or draw them black?
12. **The innovation views.** Three views: Ibn Ḥajar, "unless he allows lying" (said of both kinds), and "reject" (the majority on the first kind, "it is said" on the second). The others are in Read as text. Is the "reject" view fair, given that it joins a majority view and a minority one?
13. **The four wording views.** Keep all four, or show only `most` and keep the three "it is said" positions in the note?
14. **Munkar labels.** Causes 3–5 carry "munkar, for those who don't require opposition", linking to *Who outweighs whom?*. Agree?
15. **Proposed annotations.** p.272 (after the loss: not accepted), p.230 (al-mazīd as the opposite of tadlīs), p.182 (the classmate example). Any to approve?
16. **Jahāla as its own scene.** It could instead be a small addition to `unknown`, whose source line already cites §5.35, but the al-Kalbī example would not fit. Agree with the separate scene?
17. **Translation slips.** Please rule on the fifteen rows of §14, especially §5.22 ("intrinsic"), §5.28 (siyāq) and §5.37 (al-Jūzajānī and al-Nasāʾī).

## 18. Interim decisions for the build

As for the earlier divisions, the owner asked for development to continue while they review, so these defaults let the build go ahead. Each can be reversed once the owner rules; the PR description lists them.

- **Scenes:** eight new scenes, as designed. `wording` stays separate from `changes`.
- **Order:** the overview first; `breaks` moves to 2 and `unknown` to 9. Nothing else in either changes.
- **Integrity and accuracy tags:** not shown. The ladder's footer says the book doesn't keep them apart.
- **Ordinals:** shown on the rungs, since they are the book's own count. The severity wedge has no numbers.
- **Gauges, meters and records:** they show relative order only. No numbers, percentages or counts appear. The error records use marks, labelled as an illustration.
- **Arabic quoted from the reports: not shown anywhere.** Only a few English words of the reports appear. Term names keep their Arabic. The delivery words ʿan and qāla are in transliteration. The muṣaḥḥaf cell's single letters are allowed, as in *Who is who?*.
- **The suspect's figure:** the dashed mask and cracked seal, as designed. `/narrators/` is not changed in this build.
- **After the memory failed:** no verdict pill. p.272 stays a proposal.
- **Abstract cells:** labelled diagrams with "the book names no example" in their Read as text, for muʿallal, mudraj, al-mazīd, muḍṭarib, muṣaḥḥaf, muḥarraf and wuḥdān's contrast figure.
- **Generation colours from general knowledge:** acceptable. Each scene's Read as text names who is a Companion or a Successor only where the translation says so.
- **Views:** `hidden` (two), `wording` (four) and `innovation` (three), all from the translation. View swaps may be instant.
- **Munkar and shādhdh:** plain labels and links, never triggers, since those terms belong to `opposition`.
- **Expert names under query:** Yaʿqūb ibn (Abī) Shayba and Ibn Abī Ḥātim are left out of the muʿallal chips until a ruling.
- **Owner's annotations:** only the rows marked "used" in §13 go in. The "proposed" ones wait for approval in `notes/annotation-usage.md`.
- **Translation slips:** all fifteen rows of §14 go to `notes/translation-queries.md`. The site uses the wording given there until a ruling.
- **Links to unbuilt scenes:** the overview's rung links render only once their target scene exists, so no build ever ships a broken link.
- **Motion that loops:** only cell E of `changes` (the swaying link) and the standard blinks; all stop under reduced motion.
