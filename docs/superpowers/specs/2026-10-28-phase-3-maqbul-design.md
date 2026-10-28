# Phase 3, division 2 (al-Maqbūl): scene design

Date: 2026-10-28
Status: design for owner review. No site code yet. The next step is a mockup in the concept artifact (spec §4.3), then a plan.
Spec: `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Section numbers like spec §3.2 refer to it; bare § numbers (§5.13) refer to the book.

## 0. Summary

Division 2 has four moons and gets **four scenes**, one per moon. All 28 terms land on a scene, and none stay pending.

| # | Scene | Path | Moon | Form | Terms | Views | Mobile |
|---|---|---|---|---|---|---|---|
| 1 | How sound is it? | `/al-maqbul/grades/` | 0 | Grid of four cells: a checklist chain, a ladder of the book's chains, two "lifts", and a rank bar | 11 | `ibn-hajar`, `tirmidhi` | grid |
| 2 | Who outweighs whom? | `/al-maqbul/opposition/` | 1 | Two texts side by side, then two balance scales over the book's branching chains | 5 | `ibn-hajar`, `accept-all` | 3 panels |
| 3 | Does anyone else carry it? | `/al-maqbul/support/` | 2 | Branching tree of the book's crescent-moon chains, with an iʿtibār lens sweeping it | 5 | `ibn-hajar`, `by-wording` | 3 panels |
| 4 | Can both be acted on? | `/al-maqbul/acted-on/` | 3 | Left-to-right decision path in Ibn Ḥajar's order, each exit dropping to a worked example | 7 | none | 4 panels |

Every scene uses a real worked example from the book. The examples are:

- the soundest-chain ranks (§5.9);
- Ibn ʿUyayna against Ḥammād ibn Zayd (§5.11);
- Ḥubayyib ibn Ḥabīb against the reliable narrators (§5.12);
- the crescent-moon report (§5.13);
- the contagion and leper reports (§5.15);
- Burayda's report on visiting graves, and Jābir's on ablution (§5.16).

The only abstract panel is the ziyādat al-thiqa panel in scene 2, because the translation gives no example for it (see open question 8).

### Content rules followed

These are the rules from the phase 2 plan.

- Every note below paraphrases the *translation* paragraphs of §5.9–5.16 only. In this part of the PDF, translation and commentary are interleaved: the translation is the text with the garbled transliteration, and the commentary is the clean prose after each `Commentary` line.
- No footnote and no commentary was used. The commentary's extra examples (Mālik–Nāfiʿ–Ibn ʿUmar as al-Bukhārī's choice, the "day of ʿArafa" addition, the lying-down-after-fajr shādhdh al-matn) are deliberately left out.
- Arabic is fully voweled. Every quoted matn line must be checked against a printed edition before the build (open question 12).
- Notes are written to fit `note: z.string().max(420)`. Lengths are checked in §6.

## 1. Shared decisions

- **Division id:** `al-maqbul`. The scene ids are `grades`, `opposition`, `support` and `acted-on`, with `order` 1–4 and `moons` `[0]`, `[1]`, `[2]` and `[3]`.
- **New `diagram` enum values:** `Grades`, `Opposition`, `Support` and `ActedOn`.
- **Figures:** the figure language of spec §3.1–3.2, unchanged.
  - Narrators who are only *named* in the book are drawn with scroll and seal (reliable) unless the book says otherwise.
  - Ḥubayyib ibn Ḥabīb is drawn weak, with a cracked seal (§5.12: "the weak").
  - The mastūr in scene 1 uses the existing `majhul` figure: scroll, and an empty seal slot that blinks.
- **Generation colours:** Companions are gold. A narrator is green (Successor) only where that is certain from the chain itself (anyone narrating from a Companion) or is standard knowledge. These are ʿAwsaja, ʿAmr ibn Dīnār, al-ʿAyzār ibn Ḥurayth, Abū Isḥāq, ʿAbd Allāh ibn Dīnār, Nāfiʿ, Muḥammad ibn Zayd, Muḥammad ibn Jubayr, Muḥammad ibn Ziyād, Sālim and al-Zuhrī. Everyone else is black (later). The ladder in scene 1 uses name chips rather than figures, so it makes no claim about generation beyond gold for Companions. This is open question 11.
- **Legend and modes:**
  - The scene page's `LEGEND` map gains entries for Grades (`sahabi`, `tabii`, `later`, `majhul`), Opposition (`sahabi`, `tabii`, `later`, `weak`, `ghost`) and Support (`sahabi`, `tabii`, `later`).
  - ActedOn draws no narrator figures, so it has no legend and no Key/Labels switch.
  - `figures.ts` gains `weak: { kind: "later", seal: "crack" }`, with `KIND_NAME.weak = "Weak"`.
- **Terms file:** each of the 28 terms gets `scene:` set to its scene. No term is view-only: every trigger renders in the default view, so no `view:` field is needed.

## 2. Scene 1: How sound is it? (`grades`)

### 2.1 Header

```yaml
- id: grades
  division: al-maqbul
  moons: [0]
  order: 1
  title: How sound is it?
  eyebrow: Accepted reports, the four grades · §5.9–5.10
  lede: Ibn Ḥajar sorts accepted reports into four grades by asking two questions. Are the qualities that make a report acceptable all present at their fullest? If not, does something outside the report make up the gap?
  source: §5.9 Ṣaḥīḥ, §5.10 Ḥasan
  diagram: Grades
  width: 860
```

### 2.2 Form, and why it suits the idea

The four grades are really four small ideas:

1. what "sound in itself" requires;
2. that sound has ranks, shading down into fair;
3. that support can raise a grade;
4. al-Tirmidhī's double grade.

Forcing them into one chain would bury all four. The scene follows the Names precedent instead: a **2×2 grid of cells**. Each cell is its own `<svg viewBox="0 0 430 300">` in an HTML grid, which becomes one column in portrait (spec §5, "grid scenes"). Cell A holds `<Defs/>`.

- **Cell A: checklist on a chain.** This is the seal-and-scroll checklist idea. A short chain stands on the left, and on the right the five conditions are ticked off, each with a leader line to the part of the chain it tests. The seal tests uprightness, the arrows test connection, and two new glyphs test accuracy (memory and book).
- **Cell B: ladder.** Ibn Ḥajar's own graded chains (§5.9), rung by rung, with an accuracy gauge on each rung. The bottom rung is "fair only" (ḥasan li-dhātihi). This is the clearest worked example the book gives for "ranks within sound".
- **Cell C: two lifts.** Gold lift arrows raise a fair chain to sound when more routes join it (§5.10), and raise a held-back mastūr report to fair (§5.9, §5.10).
- **Cell D: rank bar.** "Ḥasan ṣaḥīḥ" is placed against a reference line for plain ṣaḥīḥ: below it when there is one route (doubt), above it when there are two routes (strength).

### 2.3 Sketches (each cell 430 × 300)

Cell A, "Sound in itself" (origin 0,0):

```
x→ 0    60        140                                              430
 18 │            THE FIVE CONDITIONS                       (eyebrow .colhead)
 40 │  ( ﷺ )
    │    ↓        ☑ ʿAdl (i)          upright ··········→ seal      y=72
100 │  [Comp]⊙▭   ☑ Ḍabṭ (i)          fully accurate                y=108
    │    ↓          ├ ◔ Ḍabṭ al-ṣadr (i)   memory  (glyph memory)   y=134
160 │  [Succ]⊙▭     └ ▤ Ḍabṭ al-kitāb (i)  book    (glyph book)     y=158
    │    ↓        ☑ Ittiṣāl al-sanad (i)  connected ·····→ arrow    y=190
220 │  [Later]⊙▭  ☑ not anomalous (shādhdh)     → scene 2           y=218
    │             ☑ no hidden defect (muʿallal)                     y=244
288 │        Ṣaḥīḥ li-dhātihi (i)   صَحِيحٌ لِذَاتِهِ                   y=288 (.title)
```

- **Chain:** at cx=60. Moon at y=40 (k=0.8). Narrators with `k=0.75`, each with scroll and seal, at y=100 (sahabi), 160 (tabii) and 220 (later). The arrows are solid `flow` arrows.
- **Leader lines:** dotted `--muted`. From ʿAdl to the seal of the Successor figure, about (78,172). From Ittiṣāl to the midpoint of the arrow between the Successor and the later narrator, about (60,190).
- **Last two rows:** "not shādhdh" and "no hidden defect" are plain text, not triggers. Shādhdh is a trigger in scene 2, and muʿallal belongs to division 3. The shādhdh row carries a small "→ scene 2" link (an HTML `<a>` under the cell, not inside the SVG text).

Cell B, "Ranks of sound" (origin 430,0):

```
x→ 0   12          132   (chips, narration flows →)            372  420
 18 │ RANKS OF SOUND                                      accuracy
 58 │ ① Aṣaḥḥ al-asānīd (i) [Ibn ʿUmar]→[Sālim]→[al-Zuhrī]       ▮▮▮▮▮
112 │ ②                     [Abū Mūsā]→[Abū Burda]→[Burayd]      ▮▮▮▮▯
166 │ ③                     [Abū Hurayra]→[Abū Ṣāliḥ]→[Suhayl]   ▮▮▮▯▯
196 │ ─ ─ ─ ─ ─ ─ sound above · fair below ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
226 │ ④ Ḥasan li-dhātihi (i) [Jābir]→[ʿĀṣim ibn ʿUmar]→[Ibn Isḥāq] ▮▮▯▯▯
272 │ all upright and accurate; the higher rungs have stronger qualities (lbl)
```

- **Ladder:** two rails at x=6 and x=424. Each rung is a rect at its y with height 44 and a fill that steps down in `--gold-b` mix, reusing `staircase.ts`'s `stepFill(lvl)`.
- **Chips:** a new `Chip` part. Companion chips (Ibn ʿUmar, Abū Mūsā, Abū Hurayra, Jābir) take a gold edge; the others are neutral. The arrows between chips are short `flow` arrows that run left to right, from the Companion towards the collector.
- **Gauge:** a new `Gauge` part at x=372, w=48, filled 5, 4, 3 and 2 fifths. The levels are illustrative, not a measure (open question 10).
- **Other book examples:** they are not drawn but are listed in the notes: Ibn Sīrīn–ʿUbayda–ʿAlī and al-Nakhaʿī–ʿAlqama–Ibn Masʿūd on rung 1; Ḥammād ibn Salama–Thābit–Anas on rung 2; al-ʿAlāʾ ibn ʿAbd al-Raḥmān–his father–Abū Hurayra on rung 3; ʿAmr ibn Shuʿayb–his father–his grandfather on rung 4.
- **`tirmidhi` view:** the rung ④ group is swapped. The `[data-view-show="ibn-hajar"]` group holds the trigger, the chips and the gauge. The `[data-view-show="tirmidhi"]` group (class `off` at build) holds:
  - the label "Ḥasan in al-Tirmidhī's book", which is not a trigger;
  - two parallel routes of unnamed chips;
  - the tags "none accused of lying", "more than one route" and "not shādhdh".

Cell C, "Raised by support" (origin 0,300):

```
x→ 0          110                    320                         430
 18 │ RAISED BY SUPPORT
 52 │   Ṣaḥīḥ li-ghayrihi (i)              Ḥasan li-ghayrihi (i)          y=52
 70 │        ⇧ lift (gold)                       ⇧ lift
 96 │       (ﷺ)                                 (ﷺ)            moon k=0.55
    │     ↙  ↓  ↘                             ↙  ↓  ↘
170 │  [·] [N]▮▮▮▯ [·]                     [·] [mastūr]⊙◌ [·]   main + 2 faint routes
    │  fair chain, accuracy lighter         scroll, seal slot (blinks)
236 │  + more routes make up for            + its routes multiply:
252 │    the lighter accuracy  §5.10          tipped to acceptance §5.9–5.10
```

- **Left lift:** centred at x=110. The main route is one `later` figure at k=0.7 with a small Gauge (3/5). The two side routes are `later` figures at k=0.55 with opacity .55.
- **Right lift:** centred at x=320. The main figure is `majhul` (scroll, empty seal slot), labelled "mastūr". The side routes are the same as on the left.
- **Lift arrows:** a new `Arrow variant="lift"`: thick, gold, pointing up and not animated. It is a different stroke from the narration arrows, so it can't be read as transmission.

Cell D, "Ḥasan ṣaḥīḥ" (origin 430,300):

```
x→ 0        90                  230                       360   420
 18 │ ḤASAN ṢAḤĪḤ · al-Tirmidhī's double grade
 50 │   One route                  Two routes                 ▲ stronger
 80 │     (ﷺ)                        (ﷺ)                       │
    │      ↓                        ↙    ↘                  ●── two routes   y=110
150 │     [N]                     [N]     [N]               ━━━ ṣaḥīḥ, one route (ref) y=150
    │  "ḥasan? ṣaḥīḥ?" (?)        ḥasan   ṣaḥīḥ             ●── one route    y=190
200 │   doubt: 'or' left out      one each: 'and'            │
230 │                                                        ▼ weaker
288 │                 Ḥasan ṣaḥīḥ (i)  حَسَنٌ صَحِيحٌ                 y=288
```

- **The "?":** it blinks, as missing things do (spec §3.4), because the doubt is the missing certainty.
- **The rank bar:** at x=380. The markers are joined by thin leader lines to their cases.

### 2.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `sahih-li-dhatihi` | Cell A title, (215,288) | A report carried by upright narrators of complete accuracy, through a connected chain, with no anomaly (shādhdh) and no hidden defect (muʿallal). It is the first of the four accepted grades: all the qualities of acceptance are present at their highest. "In itself" sets it apart from a report graded sound because of something outside it (§5.9). |
| `adl` | Cell A row 1, (150..300, y 58–82) | Upright: a settled quality that keeps the narrator to piety (taqwā) and decent conduct (murūʾa). Piety here means keeping away from evil deeds: associating partners with Allah, open sin and innovation. The word "upright" in the definition shuts out reports from narrators who are not (§5.9). |
| `dabt` | Cell A row 2, (150..330, y 94–118) | Accuracy, of two kinds: of memory and of the book. The definition asks for *complete* accuracy, to mark the higher rank. When accuracy is a little lighter but every other condition holds, the report is fair in itself (ḥasan li-dhātihi) instead (§5.9, §5.10). |
| `dabt-sadr` | Cell A sub-row, (165..330, y 122–144) | Accuracy of memory: he keeps what he heard so firmly that he can bring it out whenever he wishes (§5.9). |
| `dabt-kitab` | Cell A sub-row, (165..330, y 146–168) | Accuracy of the book: he guards his written copy, keeping it safe where no one can alter it, from the time he heard and checked it until he narrates from it (§5.9). |
| `ittisal` | Cell A row 3, (150..330, y 176–200) | A connected chain is free of any drop: every man in it heard the report from the shaykh he names. A gap anywhere takes the report out of the sound; the kinds of gap are set out under rejected reports (§5.9, §5.17). |
| `asahh-al-asanid` | Cell B rung 1 label, (12..130, y 44–72) | Sound reports differ in rank with the strength of their narrators. At the top are chains some imams named the soundest: al-Zuhrī from Sālim from his father Ibn ʿUmar; Ibn Sīrīn from ʿUbayda from ʿAlī; al-Nakhaʿī from ʿAlqama from Ibn Masʿūd. Ibn Ḥajar's settled view is to crown no single chain, though those they named rank above the rest (§5.9). |
| `hasan-li-dhatihi` | Cell B rung 4 label, (12..130, y 212–240); default view only | Every condition of the sound holds, but the narrator's accuracy is lighter. It is used as proof like the sound, though ranked below it, and it has ranks of its own. Ibn Ḥajar's examples of chains that are fair only: Muḥammad ibn Isḥāq from ʿĀṣim ibn ʿUmar from Jābir, and ʿAmr ibn Shuʿayb from his father from his grandfather (§5.9, §5.10). |
| `sahih-li-ghayrihi` | Cell C left title, (30..200, y 38–62) | Sound, but not in itself. The report's qualities fall short of the highest, and something makes up the shortfall, such as many routes. Ibn Ḥajar's case: a chain that is fair in itself is called sound when its routes multiply, because together they have a strength that makes up for its narrator's lighter accuracy (§5.9, §5.10). |
| `hasan-li-ghayrihi` | Cell C right title, (235..415, y 38–62) | Fair, but not in itself. A report that had been held back is raised to fair when an indication tips it towards acceptance. Ibn Ḥajar's example is the report of a mastūr, a narrator whose state is not known, once its routes multiply (§5.9, §5.10). |
| `hasan-sahih` | Cell D title, (215,288) | al-Tirmidhī and others sometimes call one report "ḥasan ṣaḥīḥ". With one route it records doubt: ḥasan to some, ṣaḥīḥ to others, as if "or" had been dropped, so it ranks below plain ṣaḥīḥ. With two routes it means one is ṣaḥīḥ and the other ḥasan, so it ranks above a ṣaḥīḥ with only one route, since more routes strengthen (§5.10). |

**Extra** (Read as text only):

1. **Ḥasan in al-Tirmidhī's book** (§5.10). al-Tirmidhī defined ḥasan for his own book, and only for the plain grade: no narrator accused of lying, more than one such route, and not anomalous. He said "according to us", so his "ḥasan gharīb" ("we know it only by this route") does not contradict that definition: the definition never covered the compound grades.
2. **Ranks by the two Ṣaḥīḥs** (§5.9). These are ranks in soundness, with a seventh below them:
   1. what al-Bukhārī and Muslim both record;
   2. what al-Bukhārī alone records;
   3. what Muslim alone records;
   4. what meets both their conditions;
   5. what meets al-Bukhārī's condition;
   6. what meets Muslim's;
   7. what meets neither.

   A stronger factor can override this order. For example, a mashhūr report in Muslim that yields knowledge outranks a report in al-Bukhārī alone, and a soundest chain such as Mālik–Nāfiʿ–Ibn ʿUmar outranks a report in only one of the two books. This extra is optional (open question 13).

### 2.5 Views

The translation itself gives two definitions of ḥasan (§5.10): Ibn Ḥajar's own, and al-Tirmidhī's for his book.

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar | §5.10 | Fair in itself: every condition of the sound, with the narrator's accuracy a little lighter. It ranks below sound, and many routes raise it to sound. |
| `tirmidhi` | al-Tirmidhī, in his book | §5.10 | al-Tirmidhī calls a report ḥasan when no narrator in it is accused of lying, it comes by more than one such route, and it is not anomalous. Ibn Ḥajar points out that he gave this definition for his own book ("according to us"), and only for the plain grade. |

Only cell B rung ④ changes. Under reduced motion the swap is instant, and otherwise the two groups crossfade (opacity .3s).

### 2.6 Grid cells

The cells are 1 Sound in itself (A), 2 Ranks of sound (B), 3 Raised by support (C) and 4 Ḥasan ṣaḥīḥ (D). Desktop shows them 2×2 and portrait shows one column. There are no panels.

### 2.7 Motion

- **Cell A:** the ticks draw in one after another (a stroke-dash, once, 0.25s apart). The chain arrows use the standard `flow`.
- **Cell C:** the faint side routes fade in, then the lift arrow brightens and the grade label appears (once, about 2s).
- **Cell D:** the "?" blinks (`blink`).
- **Reduced motion:** the end state shows statically: all ticks drawn, routes at full opacity, and the label visible. The base styles are the end state and the animations run *from* the start state, so when `motion.css` kills the animations the end state remains.

### 2.8 New kit parts

`Chip`, `Gauge`, `Glyph` (`memory`, `book`, `check`), `Arrow variant="lift"`. See §7.

## 3. Scene 2: Who outweighs whom? (`opposition`)

### 3.1 Header

```yaml
- id: opposition
  division: al-maqbul
  moons: [1]
  order: 2
  title: Who outweighs whom?
  eyebrow: Accepted reports, when narrators disagree · §5.10–5.12
  lede: A reliable narrator may add words, or tell a report differently from others. If nothing clashes, his version stands; if it clashes with a weightier one, the weightier is kept. The names for the winner and the loser depend on whether the narrator who lost was reliable or weak.
  source: §5.10 Ziyādat al-thiqa, §5.11 Shādhdh and maḥfūẓ, §5.12 Maʿrūf and munkar
  diagram: Opposition
  width: 780
```

### 3.2 Form, and why it suits the idea

The idea is weighing, so the central form is a **balance scale**, used twice, over the book's own **branching chains**:

- Panel 1 shows **two texts side by side**, one longer, from two reliable students of one teacher. A fork then asks whether the addition clashes. If it doesn't, it is accepted; if it does, the two versions go to the scale.
- Panel 2 shows Ibn ʿUyayna's version against Ḥammād ibn Zayd's. Both narrators are reliable, and numbers tip the scale (§5.11).
- Panel 3 shows Ḥubayyib ibn Ḥabīb, who is weak, against the reliable narrators (§5.12).

Panels 2 and 3 share the same layout, so the reader sees what Ibn Ḥajar stresses: shādhdh and munkar share the opposition and differ in the narrator (§5.12). Each panel is a column of one chain fanning out to the competing students, so the diagram is a single row and carousels cleanly.

### 3.3 Sketch (780 × 600)

```
x→ 0          130        260 │      390               520 │      650             780
 30 │ ADDED WORDS             │ (ﷺ) 390,45                 │ (ﷺ) 650,45
 60 │      [Teacher] 130,60   │  ↓   ╲ skip (red, dashed,  │  ↓        ┊ track B starts
    │      ↙        ↘         │  ↓    ╲  bend +60)         │  ↓        ┊ here (stop bar)
115 │                         │ [Ibn ʿAbbās] 390,115   ╲    │ [Ibn ʿAbbās] 650,115 ┤ "stops at
140 │ [A] 70,140   [B] 190,140│  ↓   "Ḥammād: no          │  ↓          Ibn ʿAbbās"
185 │ ┌text A┐   ┌text B ++┐  │ [ʿAwsaja] 390,185 ←╯ Ibn ʿAbbās"│ [al-ʿAyzār] 650,185
210 │ │… … … │   │… … … ▒▒▒│  │  ↓                         │  ↓
255 │ └──────┘   └─────────┘  │ [ʿAmr ibn Dīnār] 390,255   │ [Abū Isḥāq] 650,255
270 │ Ziyādat al-thiqa (i)    │ ↙   ↓    ↓        ↘        │ ↙             ↓     ↘
300 │  clashes with nothing?  │                            │
330 │  yes → [Accepted]       │[Ibn ʿUyayna][Ibn Jurayj][others] [Ḥammād] │[Ḥubayyib]⊙╳  [reliable][reliable]
    │                         │ 290,335   335,335  380,335  465,335 │ 570,335       690,335  740,335
390 │  clashes: keeping it    │                            │
    │  drops the other        │      ▲ pivot 390,470       │      ▲ pivot 650,470
430 │  → [Weigh them] ───────→│ ╲═════════════╱ beam tilts │ ╱═════════════╲ (right down)
    │                         │  ⛀⛀⛀  (left down)    ⛀    │  ⛀ (cracked)      ⛀⛀
510 │                         │ Maḥfūẓ (i) 310   Shādhdh (i) 465 │ Munkar (i) 575   Maʿrūf (i) 715
545 │                         │ both reliable · numbers decide │ like shādhdh, but the loser is weak
575 │                         │ "a man died leaving no heir but a slave he had freed" │ "whoever prays, gives zakāt…"
```

- **Panel 1:**
  - The teacher is a `later` figure with scroll and seal at (130,60). The students A and B are reliable `later` figures at (70,140) and (190,140), with solid `flow` arrows from the teacher.
  - Text cards use the new `Matn` part at (20..120, 170..250) and (140..250, 170..250). Card B ends in a highlighted `<tspan class="added">` that pulses.
  - The fork's two branches end in Pills at y=345 (`accept`, "Accepted") and y=435 (`pause`, "Weigh them"). A thin arrow carries on from "Weigh them" to the scale in panel 2.
- **Panel 2:**
  - The figures are a moon, Ibn ʿAbbās (sahabi), ʿAwsaja (tabii) and ʿAmr ibn Dīnār (tabii), with solid arrows between them. That is the maḥfūẓ version.
  - A `skip` arrow runs from the moon to ʿAwsaja, bent +60 to the right. It is labelled "Ḥammād: no Ibn ʿAbbās" at (452,150).
  - The four students are at y=335 with k=0.7 and two-line names: "Ibn ʿUyayna", "Ibn Jurayj", "and others" (a `later` figure at opacity .6) and "Ḥammād / ibn Zayd". All have scroll and seal: Ḥammād is reliable, which is the point.
  - A new `Scale` part sits at pivot (390,470) with a beam 180 wide, tilted −8°. Weights are one disc per narrator: three on the left pan and one on the right.
- **Panel 3:**
  - The chain is a moon, Ibn ʿAbbās, al-ʿAyzār ibn Ḥurayth (tabii) and Abū Isḥāq (tabii).
  - **Two tracks.** Track A, Ḥubayyib's version, is the solid chain from the moon. Track B, the reliable narrators' version, is drawn as a second thin arrow line offset +14 in x. It starts at Ibn ʿAbbās under a flat "stop" bar, tagged "stops short of the Prophet ﷺ". The exact start point depends on open question 1, and the default draws it from Ibn ʿAbbās.
  - The students are Ḥubayyib ibn Ḥabīb, a `weak` figure with a cracked seal at (570,335), and two reliable `later` figures labelled "reliable narrators" at (690,335) and (740,335).
  - The Scale sits at pivot (650,470), tilted +8°. Ḥubayyib's single weight carries a crack and sits on the raised pan; two weights sit on the lowered pan.
- **Matn lines:** at y=575, in English only (11px `.lbl`). The Arabic is in Read as text, inside the notes or as an `extra`.

### 3.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `ziyadat-al-thiqa` | Panel 1 title, (10..250, y 256–282) | Extra words that a narrator of a sound or fair report gives and others leave out. If they clash with nothing, they are accepted, like a report a reliable narrator gives alone. If accepting them would mean rejecting the other version, the two are weighed: the weightier is accepted and the other rejected. None of the early masters is known to have accepted additions outright (§5.10). |
| `mahfuz` | Under the left pan, panel 2, (262..360, y 496–520) | The weightier version, which wins. Ibn ʿUyayna gave the report of a man who died leaving no heir but a slave he had freed from ʿAmr ibn Dīnār, from ʿAwsaja, from Ibn ʿAbbās. Ibn Jurayj and others gave it the same way. Ibn Abī Ḥātim judged Ibn ʿUyayna's version maḥfūẓ (§5.11). |
| `shadhdh` | Under the right pan, panel 2, (420..515, y 496–520) | An acceptable narrator goes against one who is weightier: by firmer accuracy, by numbers, or on some other ground. Ḥammād ibn Zayd, accurate and trustworthy, gave the same report without Ibn ʿAbbās. His version lost because the other side had more narrators. Ibn Ḥajar calls this the settled sense of the term (§5.11). |
| `munkar` | Under the raised pan, panel 3, (522..625, y 496–520) | A weak narrator goes against a stronger one. Ḥubayyib ibn Ḥabīb, brother of Ḥamza al-Zayyāt, gave from Abū Isḥāq, from al-ʿAyzār ibn Ḥurayth, from Ibn ʿAbbās, as the Prophet's ﷺ words: "whoever prays, gives zakāt, makes the ḥajj, fasts and honours his guest enters Paradise". Ibn Abī Ḥātim called it munkar (§5.12). |
| `maruf` | Under the lowered pan, panel 3, (665..775, y 496–520) | The stronger version, which wins against a weak narrator. Reliable narrators gave the same report from Abū Isḥāq without carrying it up to the Prophet ﷺ, and Ibn Abī Ḥātim called theirs maʿrūf. Shādhdh and munkar share the opposition but differ in the narrator, reliable in one and weak in the other; Ibn Ḥajar calls treating them as one ignorance (§5.12). |

The `maruf` note is worded so that it holds under either reading of open question 1.

### 3.5 Views

The disagreement on additions is in the translation (§5.10). Ibn Ḥajar's view is the default.

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar and the early masters | §5.10 | Weigh an addition when it clashes. This was the practice of ʿAbd al-Raḥmān ibn Mahdī, Yaḥyā al-Qaṭṭān, Aḥmad, Ibn Maʿīn, ʿAlī ibn al-Madīnī, al-Bukhārī, al-Nasāʾī, al-Dāraquṭnī and others; none of them is known to have accepted it outright. al-Shāfiʿī's own words point the same way. |
| `accept-all` | Accept every addition | §5.10 | A well-known opinion accepts a reliable narrator's addition outright, without weighing, and some Shāfiʿīs held it. Ibn Ḥajar finds it strange from scholars who make "not anomalous" a condition of the sound, and stranger from Shāfiʿīs, since al-Shāfiʿī said a longer version that goes against the memorisers can harm a report. |

Under `accept-all`, the panel 1 "Weigh them" Pill and its connector carry `data-view-show="ibn-hajar"`. An "Accepted" Pill on the clash branch carries `data-view-show="accept-all"` and class `off` at build. Panels 2 and 3 don't change: they illustrate opposition in general, which both views recognise (§5.11–5.12).

The scholar list in the `ibn-hajar` note leaves out the translation's "Ibn Abī Ḥātim (d. 327)" until translation query 4 is ruled on.

### 3.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `added-words` | Added words | 0 | 260 |
| `shadhdh` | Shādhdh · maḥfūẓ | 260 | 520 |
| `munkar` | Munkar · maʿrūf | 520 | 780 |

### 3.7 Motion

- **Scales:** the two beams tip on load: `transform: rotate(0)` to the final angle over 1.2s, ease-out, once, with a 0.4s delay. The pans and weights move with them.
- **Other motion:** the `added` tspan pulses (`blink`), the skip arrow uses the standard `skip` dash, and the chain arrows `flow`.
- **Reduced motion:** the beams' resting style is the final tilt, so with animations off they show tilted and still.

### 3.8 New kit parts

`Scale`, `Matn`, and `FIG.weak` in `figures.ts`. Panel 3's second track and stop bar are drawn with `Arrow` plus a scene-local `<line>`; this is not a kit part.

## 4. Scene 3: Does anyone else carry it? (`support`)

### 4.1 Header

```yaml
- id: support
  division: al-maqbul
  moons: [2]
  order: 3
  title: Does anyone else carry it?
  eyebrow: Accepted reports, corroboration · §5.13
  lede: A report that seemed to rest on one narrator may turn out to have company. Searching the collections finds other routes to the same Companion, or the same text from a different Companion. Either one strengthens it.
  source: §5.13 Mutābiʿ, shāhid and iʿtibār
  diagram: Support
  width: 780
```

### 4.2 Form, and why it suits the idea

The idea is a lone route gaining company, and the book's crescent-moon report (§5.13) gives it with full chains. The form is a **branching tree of chains** under one moon:

1. al-Shāfiʿī's route, thought to be alone, is drawn first and highlighted.
2. An **iʿtibār lens** sweeps across the collections.
3. As the lens passes, each other route lights up.

Brackets group the routes by Ibn Ḥajar's definitions:

- full follow-up: the agreement is with al-Shāfiʿī himself, from Mālik;
- partial follow-up: the agreement joins higher, at Ibn ʿUmar;
- witness: a different Companion.

The tree shows exactly what each term measures, which is *where* the new route joins the old one.

### 4.3 Sketch (780 × 600)

```
x→ 0    50    90   140  215  260│  300       420     520│  590        710      780
 40 │                              │                       │   ⌕ Iʿtibār (i)  searching the collections
 50 │          ( ﷺ ) 170,50  ─────┼── long arcs (flow) ───┼──→  to Ibn ʿAbbās, Abū Hurayra
    │            ↓    ╲___________│__________             │
140 │        [Ibn ʿUmar] 170,140   │                       │ [Ibn ʿAbbās] 590   [Abū Hurayra] 710
    │        ↙         ╲__________│___↘______↘            │      ↓                 ↓
230 │ [Ibn Dīnār] 90               │[M. ibn Zayd] 300 [Nāfiʿ] 420│ [M. ibn Jubayr] 590 [M. ibn Ziyād] 710
    │     ↓                        │    ↓            ↓     │      ┊                 ┊ (elided)
320 │  [Mālik] 90                  │[ʿĀṣim] 300  [ʿUbayd Allāh] 420│  ┊                 ┊
    │  ↙   ↓   ↘(faded)            │    ┊            ┊     │      ┊                 ┊
410 │[Shāfiʿī][Qaʿnabī][others]    │    ┊            ┊     │      ┊                 ┊
    │  50 "alone?"̶ 140   215 "reckon it"                   │
455 │ complete 30 | complete 30 |  │ complete 30 | reckon 30│ complete 30 | complete Shaʿbān 30   (wording chips)
490 │ [al-Umm]  [al-Bukhārī]       │[Ibn Khuzayma] [Muslim] │ [al-Nasāʾī]  [al-Bukhārī]          (book chips)
520 │          └ Mutābaʿa tāmma (i)│└──── Mutābaʿa qāṣira (i) ───┘│
555 │          └──────────── Mutābiʿ (i) (380) ──────────┘   │ └──── Shāhid (i) (650) ────┘
```

- **Placement:** the rows are at y = 50, 140, 230, 320, 410, 455 (wording) and 490 (books). The figures are drawn at k=0.75 with names in `.lbl` under them.
- **Arrows:**
  - Solid `flow` arrows join every known link.
  - Where the book gives no lower chain (below ʿĀṣim, ʿUbayd Allāh, Muḥammad ibn Jubayr and Muḥammad ibn Ziyād, down to the collector), a new `Arrow variant="elided"` is used: grey and dotted. It means "chain continues, not shown in the book", not "missing".
- **Mālik's other students:** a faded `later` figure at (215,410) labelled "Mālik's other students", with the wording chip "reckon it". This is why al-Shāfiʿī seemed to be alone.
- **The "alone?" tag:** sits on al-Shāfiʿī. When the full follow-up appears, a strike-through line draws across it.
- **Arcs from the moon:** to Ibn ʿAbbās (590,118) and Abū Hurayra (710,118), drawn as `Arrow` with bend −60 so that they stay above y≈110, clear of the Successor row.

### 4.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `itibar` | Lens heading, top right, (560..775, y 26–54) | Searching the collections, the jāmiʿs, musnads and juzʾs, through their chains, to learn whether a report thought to be solitary has a follow-up or a witness. It is the way to find them, not a third kind beside them, as some took Ibn al-Ṣalāḥ's heading to mean. Knowing all these kinds pays off when reports conflict and one must be preferred (§5.13). |
| `mutabi` | Wide bracket label, (330..450, y 543–567); default view | A report first thought to rest on one narrator, a relative gharīb, turns out to be shared: others agree with him. That agreeing route is a mutābiʿ, and its benefit is strength. It must come from the same Companion, but it need not use the same words; the same meaning is enough (§5.13). |
| `mutabaa-tamma` | Bracket under al-Qaʿnabī, (95..230, y 508–532); default view | Full follow-up: the agreement is with the narrator himself. A group thought al-Shāfiʿī alone gave Mālik's report with "complete the count, thirty", since Mālik's other students said "reckon it". But al-Qaʿnabī gave it from Mālik in al-Shāfiʿī's words, as al-Bukhārī records (§5.13). |
| `mutabaa-qasira` | Bracket under ʿĀṣim and ʿUbayd Allāh, (270..450, y 508–532); default view | Partial follow-up: the agreement joins higher up, at his teacher or above. For the same report, Ibn Khuzayma has ʿĀṣim ibn Muḥammad from his father Muḥammad ibn Zayd from Ibn ʿUmar, "complete thirty"; Muslim has ʿUbayd Allāh ibn ʿUmar from Nāfiʿ from Ibn ʿUmar, "reckon thirty" (§5.13). |
| `shahid` | Bracket over the two witnesses, (590..715, y 543–567); default view | A text from a different Companion that matches in wording and meaning, or in meaning alone. In wording: al-Nasāʾī's version through Muḥammad ibn Jubayr from Ibn ʿAbbās. In meaning: al-Bukhārī's through Muḥammad ibn Ziyād from Abū Hurayra, "complete the count of Shaʿbān, thirty". Some swap the two names; Ibn Ḥajar says the matter is easy (§5.13). |

**Extra** (Read as text): "The wordings, in Arabic", giving each route's wording, fully voweled, to be checked against an edition:

| Route | Wording | Arabic |
|---|---|---|
| al-Shāfiʿī and al-Qaʿnabī | "complete the count, thirty" | [Arabic to be supplied from a checked edition] |
| Mālik's other students | "reckon it" | [Arabic to be supplied from a checked edition] |
| ʿĀṣim | "complete thirty" | [Arabic to be supplied from a checked edition] |
| ʿUbayd Allāh | "reckon thirty" | [Arabic to be supplied from a checked edition] |
| Abū Hurayra | "complete the count of Shaʿbān, thirty" | [Arabic to be supplied from a checked edition] |

### 4.5 Views

The translation reports a group's other definition (§5.13).

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: by Companion | §5.13 | A follow-up comes through the same Companion, in any wording: full when it agrees with the narrator himself, partial when it joins at his teacher or above. A witness comes from a different Companion. |
| `by-wording` | A group: by wording | §5.13 | A group call any route that matches in wording a mutābiʿ, whether or not the Companion is the same, and one that matches only in meaning a shāhid. The two names are also used for each other. Ibn Ḥajar says the matter is easy. |

Under `by-wording` the four brackets (and their triggers) hide, and per-route tags at y=520 show instead, coloured gold for mutābiʿ and blue for shāhid, with a two-item key:

| Route | Tag under `by-wording` |
|---|---|
| al-Qaʿnabī | mutābiʿ |
| ʿĀṣim | mutābiʿ? (open question 5) |
| ʿUbayd Allāh | shāhid |
| Ibn ʿAbbās | mutābiʿ |
| Abū Hurayra | shāhid |

The routes themselves don't move, so the switch is a crossfade. Landing on `?mutabi` and the other bracket terms switches back to the default view (spec §6), which is already how `beforeLand` works.

### 4.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `lone` | The lone route and a full follow-up | 0 | 260 |
| `partial` | Partial follow-ups | 260 | 520 |
| `witness` | Witnesses | 520 | 780 |

The moon sits in panel 1. In panels 2 and 3 the arrows enter from the left edge, which reads as continuation (open question 14 offers the alternative).

### 4.7 Motion: the iʿtibār sweep

This runs once on load and takes about 6s.

1. At 0s, the lone route (moon → Ibn ʿUmar → Ibn Dīnār → Mālik → al-Shāfiʿī) is at full opacity. Every other route, wording chip and book chip is at .15, and the "alone?" tag is shown.
2. From 0.8s to 4.8s, the lens glyph moves along the book-chip row from x=40 to x=740.
3. As it passes each book, that route's group animates to opacity 1, in the order Qaʿnabī, ʿĀṣim, ʿUbayd Allāh, Ibn ʿAbbās, Abū Hurayra. This is done with an `animation-delay` per group, set from its x.
4. At about 1.4s, when the Qaʿnabī route lights, the strike draws across "alone?".
5. At 5s the brackets fade in.

**Reduced motion:** every group's base style is opacity 1, the strike is drawn, the lens rests at the top-right heading, and the brackets show. The sweep is animation-only, so `motion.css` removes it and leaves the end state, and `document.getAnimations()` is empty.

Tapping the lens heading opens the iʿtibār popover as usual. It does not replay the sweep; replay is out of scope.

### 4.8 New kit parts

`Arrow variant="elided"`, `Chip` (reused for the book and wording chips), `Glyph lens`, and a scene-local `Bracket` (a path with end ticks and a centred label slot), which could be promoted to the kit if scene 4 needs it.

## 5. Scene 4: Can both be acted on? (`acted-on`)

### 5.1 Header

```yaml
- id: acted-on
  division: al-maqbul
  moons: [3]
  order: 4
  title: Can both be acted on?
  eyebrow: Accepted reports, acted on or not · §5.14–5.16
  lede: Most accepted reports stand unopposed. When two accepted reports seem to clash, Ibn Ḥajar works through a fixed order. First he tries to harmonise them, then he looks for abrogation, then he prefers one, and only then does he pause.
  source: §5.14 Muḥkam, §5.15 Mukhtalif al-ḥadīth, §5.16 Nāsikh and mansūkh
  diagram: ActedOn
  width: 1040
```

### 5.2 Form, and why it suits the idea

Ibn Ḥajar states the order outright (§5.16): harmonise if possible, then abrogation, then preference, then pause. So the form is a **decision path**: a horizontal spine of five questions read left to right, with the "no" answer carrying on along the spine. Each "yes" drops to an outcome card, and four of those cards hold the book's worked example:

- two texts side by side with a bridge, for mukhtalif;
- a **timeline**, for naskh;
- a small tipping scale, for tarjīḥ;
- a paused pair, for tawaqquf.

Being a single row, it carousels well, one or two questions per panel. Colour encodes the outcome: both reports acted on is `--ok`, one acted on is gold, and neither for now is `--pause`.

### 5.3 Sketch (1040 × 560)

```
x→ 0  20   75   135  195    260│ 330                    520│ 590                    780│ 850       915     1040
 90 │ ▭─→◇Q1──yes──→◇Q2──yes──→─┼─→◇Q3 ── no ─────────────→─┼─→◇Q4 ── no ───────────→─┼─→◇Q5 ── no ──┐
    │ accepted  "opposed?"  "opposer accepted   │ "harmonise without  │ "date known?"          │ "a ground to   │
    │ report    │no            too?" │no         │  forcing?" │yes      │   │yes                 │  prefer?" │yes │
150 │           ↓              ↓    │           ↓            │           ↓                    │   ↓       ↓
170 │ ┌Muḥkam (i)┐ ┌No effect──┐   │ ┌Mukhtalif al-ḥadīth (i)─────┐  │ ┌Naskh (i)───────────────┐ │┌Tarjīḥ (i)┐┌Tawaqquf (i)┐
    │ │ ✓ acted   │ │ the weak   │  │ │▭ [Arabic: checked edition] │  │ │ time ─────────────────→ │ ││ mini     ││ ▭ ▭  ⏸     │
    │ │  on       │ │ does not   │  │ │  "no contagion, no omen"  │  │ │  ●earlier      ●later   │ ││ scale    ││ (?) blinks │
    │ │ "examples │ │ move the   │  │ │      ⟷ bridge             │  │ │ ▭forbidden  ▭"visit them"│ ││ tips     ││ "paused,   │
    │ │  are many"│ │ strong     │  │ │▭ [Arabic: checked edition] │  │ │ Mansūkh (i)  Nāsikh (i)  │ ││ "text or ││  not       │
    │ └──────────┘ └───────────┘  │ │  "flee the leper…lion"    │  │ │ known by: ① the text     │ ││  chain"  ││  dropped"  │
    │                              │ │ "Who infected the first?" │  │ │ ② a Companion ③ dates    │ │└──────────┘└────────────┘
520 │                              │ │ ✓✓ both acted on          │  │ │ ✓ later acted on         │ │ ✓ one       ⏸ neither, for now
    │                              │ └───────────────────────────┘  │ └─────────────────────────┘ │
```

- **Spine:** at y=90. The questions sit in a new `Decision` part, a rounded diamond about 110 × 60, at x = 75, 195, 330, 590 and 850. The start chip "accepted report" is at x=20. "No" arrows run along the spine and "yes" arrows drop to the cards, with small edge labels.
  - At Q1 the sense is reversed: "not opposed" drops to muḥkam.
  - At Q2, "opposer weak" drops to "no effect".
- **Muḥkam card:** (15..130, 170..300), with a check glyph.
- **No-effect card:** (140..255, 170..300). It is plain text and not a term: the translation names no term for it.
- **Mukhtalif card:** (270..510, 170..520).
  - Two `Matn` cards: [Arabic to be supplied from a checked edition] ("There is no contagion or evil fortune") and [Arabic to be supplied from a checked edition] ("Flee from a leper as you would from a lion").
  - A two-headed bridge arrow between them, labelled with the reconciliation: "the denial stays general; fleeing guards against a wrong belief".
  - The line [Arabic to be supplied from a checked edition] ("Then who infected the first?") as the hinge.
  - The badge "both acted on".
- **Naskh card:** (530..770, 170..520).
  - A time arrow at y=230, with pins at x=580 (earlier) and x=720 (later).
  - The earlier `Matn` holds [Arabic to be supplied from a checked edition] ("I had forbidden you to visit graves"). It is faded, and a "lifted" strike draws across it.
  - The later `Matn` holds [Arabic to be supplied from a checked edition] ("Visit them"), from Burayda's report in Muslim.
  - Below them is a row of three small glyph-plus-label items for "How it is known": the text itself, a Companion's statement (with Jābir's line in Read as text), and the dates.
- **Tarjīḥ card:** (790..905, 170..440). A small `Scale` (beam 80, tilt −8°) with two `Matn` stubs, and the label "grounds in the text or the chain".
- **Tawaqquf card:** (915..1035, 170..440). Two `Matn` stubs side by side, a `Glyph pause`, a blinking "?", and the line "paused, not dropped".

### 5.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `muhkam` | Muḥkam card title, (20..125, y 176–200) | Accepted reports also divide into those acted on and those not. An accepted report that no other report contradicts is muḥkam, and its examples are many. If the report opposing it is weak, the opposition has no effect, since the weak does not affect the strong (§5.14). |
| `mukhtalif-al-hadith` | Mukhtalif card title, (280..500, y 176–200) | Two accepted reports seem to clash but can be harmonised without forcing either meaning. Ibn al-Ṣalāḥ's example: "no contagion and no evil omen" beside "flee from the leper as from a lion". Ibn Ḥajar's preferred harmony: the denial stays general, since the Prophet ﷺ asked who infected the first camel; the order to flee keeps a person from thinking contact made him ill (§5.15). |
| `naskh` | Naskh card title, (540..640, y 176–200) | When harmony fails and the dates are known, the later report abrogates the earlier. Naskh is the lifting of a ruling of the Law by a later proof of the Law. A report from a Companion who became Muslim late does not abrogate an earlier Companion's on that ground alone, unless he says he heard it from the Prophet ﷺ himself. Consensus does not abrogate; it only shows that abrogation happened (§5.16). |
| `nasikh` | Under the later pin, (670..770, y 300–324) | The abrogating report, the one that shows the earlier ruling was lifted. Strictly, the one who abrogates is Allah. It is known most clearly from the text itself, as in Burayda's report in Muslim: "I had forbidden you to visit graves; visit them, for they remind of the hereafter". It is also known from a Companion saying which came last, or from the dates (§5.16). |
| `mansukh` | Under the earlier pin, (535..635, y 300–324) | The abrogated report, the earlier one whose ruling was lifted. For example, Jābir said that the last of the Messenger's ﷺ two commands was to leave off ablution for what fire has touched, as the compilers of the Sunan record. That makes the command to make ablution for it the abrogated one (§5.16). |
| `tarjih` | Tarjīḥ card title, (795..900, y 176–200) | When harmony fails and the dates are unknown, one report may be preferred over the other on one of the many grounds found in its text or its chain, and the preferred one is acted on. This is what the kinds of accepted report are for: they decide which wins when reports conflict (§5.13, §5.16). |
| `tawaqquf` | Tawaqquf card title, (920..1030, y 176–200) | If no ground for preference is found, neither report is acted on for now. Calling it "paused" is better than calling it "dropped". The failure to prefer belongs only to the researcher at that moment, and what is hidden from him may become clear to someone else (§5.16). |

**Extra** (Read as text): Jābir's line, [Arabic to be supplied from a checked edition] (§5.16), to be checked against an edition.

### 5.5 Views

None. The translation gives only Ibn Ḥajar's order (§5.16).

The owner's note on p.142 says the jurists of uṣūl would put abrogation last. That would be a natural "Other view", but it isn't in the translation, and the layout would have to change to five equal 260-unit slots so that the steps can swap places the way the staircase does. This is open question 6.

### 5.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `steps-1-2` | Steps 1–2 | 0 | 260 |
| `step-3` | Step 3 | 260 | 520 |
| `step-4` | Step 4 | 520 | 780 |
| `step-5` | Step 5 | 780 | 1040 |

The labels are by step number, which stays neutral if a view ever reorders the steps.

### 5.7 Motion

- **Spine:** the arrows `flow` left to right. This is the direction of the reasoning, which is the analogue here of the direction of narration.
- **Naskh card:** the "lifted" strike draws across the earlier ruling (once, 0.8s, delay 1s).
- **Tarjīḥ card:** the mini scale tips, using the same `Scale` animation as scene 2.
- **Tawaqquf card:** the "?" blinks.
- **Reduced motion:** the strike is drawn, the scale is tilted, and nothing moves.

### 5.8 New kit parts

`Decision`, plus `Glyph` (`pause`, `check`, `text`, `companion`, `clock`). It reuses `Matn` and `Scale`.

## 6. Note lengths

Each note was measured after writing, in Unicode code points. All 28 caption notes and the six view notes fit the 420-character limit. The longest is `naskh` at 400, then `ziyadat-al-thiqa` at 384 and `mukhtalif-al-hadith` at 379. The zod `max(420)` re-checks this at build time.

## 7. New SVG kit parts (all scenes)

| Part | Props | Used in | Notes |
|---|---|---|---|
| `Chip.astro` | `cx, y, text, w?, companion?` | 1, 3 | Small rounded name or label chip, 22 tall; gold edge when `companion`. Text is `.lbl`. |
| `Gauge.astro` | `x, y, w, of=5, fill` | 1 | A row of `of` cells, `fill` of them solid. `aria-hidden`; the meaning is carried by the note. |
| `Glyph.astro` | `kind: memory, book, lens, pause, check, text, companion, clock`, `cx, cy, r` | 1, 3, 4 | Drawn icons, no text glyphs (same reasoning as InfoIcon, WCAG 2.5.3). |
| `Matn.astro` | `x, y, w, h, ar?, en, added?` | 2, 4 | A text card (a scroll-edged rect) for a quoted report. The Arabic `<text>` has `lang="ar"`, and the optional `added` tail is a `<tspan class="added">` that pulses. |
| `Scale.astro` | `x, y, w, tilt, left: number, right: number, crackLeft?, crackRight?` | 2, 4 | Pivot, beam and two pans with `left`/`right` weight discs. The beam group has `style="transform: rotate(tilt)"` as its resting state, and the `tip` keyframes animate *from* 0. The pans counter-translate in y, so they hang level. |
| `Decision.astro` | `cx, cy, text, w?` | 4 | Rounded diamond with a one- or two-line question. |
| `Arrow` + `variant` | `"flow"` (default), `"skip"`, `"lift"`, `"elided"` | 1, 3 | `lift` is a thick gold stroke, not animated, with a new `#ahl` marker in `Defs`. `elided` is a grey dotted stroke, not animated, with no arrowhead or a small open one. The existing `skip` boolean stays as an alias. |
| `figures.ts` | `weak`, plus optionally `mastur` (= majhul) | 2, 1 | Legend entries follow automatically. |

The scene-local `Bracket` (scene 3) and the two-track stop bar (scene 2) stay in their scenes unless a later division needs them.

## 8. Owner's annotations

These are the owner's PDF annotations used, or proposed for use, in this division. They are to be added to `notes/annotation-usage.md` for approval. Rows marked "proposed" are not yet written into any note above; rows marked "used" are reflected in the wording above.

| Page | Annotation (short) | Use | Status |
|---|---|---|---|
| p.99 | "Sound in itself" | `sahih-li-dhatihi` en (already) | used |
| p.100 | Piety: avoid shirk, major sins, persisting in minor sins; murūʾa depends on time and place | `adl` note could add "decent conduct, judged by the customs of his time and place" | proposed |
| p.100 | Book accuracy: keep it safe, don't let others change it | `dabt-kitab` note, "where no one can alter it" (same as the existing approved-pending row) | used |
| p.100 | Many weak routes with the same content are unlikely to share one mistake, so they support each other | Cell C sub-label "many routes are unlikely to share one slip" | proposed |
| p.101 | Connected chain: everyone named, by a valid way of receiving | `ittisal` note, "every man in it heard the report from the shaykh he names" | used |
| p.124 | Ḥasan: an accepted narrator with less accuracy; the usual conditions still apply | `hasan-li-dhatihi` note wording | used |
| p.126–127 | al-Tirmidhī's "ḥasan ṣaḥīḥ" in his time is effectively ṣaḥīḥ | Not used: it is a teacher's reading, not in the translation (open question 9) | not used |
| p.132 | Additions that don't change the meaning vs ones that do (zakāt al-fiṭr "of the Muslims") | Could replace the abstract text cards in scene 2, panel 1 (open question 8) | proposed |
| p.135 | Prefer the explicit definition of shādhdh: an *acceptable* narrator (sound or fair grade) | `shadhdh` note: "an acceptable narrator" | used |
| p.138 | Munkar: Ibn Ḥajar reportedly meant weak against less weak, despite the example | Not used: it conflicts with the translation's example (open question 7) | not used |
| p.140 | Full: same chain but the first person differs; partial: two chains to the same Companion | Matches the tree's layout in scene 3; no wording taken | used (layout) |
| p.141 | Comparing Mālik's students: al-Shāfiʿī differing from the others suggests his slip, unless others agree with him | Could add a line to the `mutabaa-tamma` note | proposed |
| p.142 | The order: both, then abrogation, then preference, then neither; the jurists put abrogation last | The order matches §5.16. The jurists' order would be an optional view (open question 6) | used (order); view proposed |

## 9. Translation slips

These are to be added to `notes/translation-queries.md`.

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.16.2 (p.159) | "If harmonisation is possible, the preferred is specified. And if not, then it is not." | The context is preference, not harmonisation: it should read "if *preference* is possible, the preferred one is acted on". This sharpens the existing "p.159 specified" row, which this replaces. The site follows the sense (tarjīḥ). | |
| §5.13 | Partial follow-up when the agreement is "for his shaykh or whoever is *below* him" | The Arabic is likely فَمَنْ فَوْقَهُ, "whoever is *above* him", towards the Companion. The book's own example joins at Ibn ʿUmar, above al-Shāfiʿī's shaykh. The site says "at his teacher or above". | |
| §5.12 | Others recorded it "as being from Abū Isḥāq only [and not up to the Prophet]" | The Arabic is likely مَوْقُوفًا: the reliable narrators' version stops at the Companion, Ibn ʿAbbās, not at Abū Isḥāq. The diagram draws their track from Ibn ʿAbbās, and the note says only "without carrying it up to the Prophet ﷺ". Confirm. | |
| §5.10.2 | The list of masters includes "Ibn Abī Ḥātim (d. 327/938)" | Paired with Abū Zurʿa, the Arabic likely names Abū Ḥātim al-Rāzī (d. 277), his father. The site leaves the name out until a ruling. | |
| §5.10 | "Hasan is a report whose [grade of] fairness is because of compensating factors…" | This sentence defines the ḥasan *li-ghayrihi* that "and not by other" excludes, not ḥasan in general. The site treats it so. | |

## 10. Term map (all 28)

| # | Term | Scene | Where |
|---|---|---|---|
| 1 | sahih-li-dhatihi | grades | Cell A title |
| 2 | adl | grades | Cell A, checklist row 1 |
| 3 | dabt | grades | Cell A, row 2 |
| 4 | dabt-sadr | grades | Cell A, row 2a |
| 5 | dabt-kitab | grades | Cell A, row 2b |
| 6 | ittisal | grades | Cell A, row 3 |
| 7 | sahih-li-ghayrihi | grades | Cell C, left lift |
| 8 | hasan-li-ghayrihi | grades | Cell C, right lift |
| 9 | asahh-al-asanid | grades | Cell B, rung 1 |
| 10 | hasan-li-dhatihi | grades | Cell B, rung 4 (default view) |
| 11 | hasan-sahih | grades | Cell D title |
| 12 | ziyadat-al-thiqa | opposition | Panel 1 title |
| 13 | shadhdh | opposition | Panel 2, light pan |
| 14 | mahfuz | opposition | Panel 2, heavy pan |
| 15 | munkar | opposition | Panel 3, light pan |
| 16 | maruf | opposition | Panel 3, heavy pan |
| 17 | mutabi | support | Wide bracket (default view) |
| 18 | mutabaa-tamma | support | Bracket under al-Qaʿnabī (default view) |
| 19 | mutabaa-qasira | support | Bracket under ʿĀṣim and ʿUbayd Allāh (default view) |
| 20 | shahid | support | Witness bracket (default view) |
| 21 | itibar | support | Lens heading |
| 22 | muhkam | acted-on | Step 1 card |
| 23 | mukhtalif-al-hadith | acted-on | Step 3 card |
| 24 | naskh | acted-on | Step 4 card title |
| 25 | nasikh | acted-on | Step 4, later pin |
| 26 | mansukh | acted-on | Step 4, earlier pin |
| 27 | tarjih | acted-on | Step 5 card |
| 28 | tawaqquf | acted-on | Step 5, paused card |

The counts are grades 11, opposition 5, support 5 and acted-on 7, for a total of 28. Pending: 0. View-only: 0. Every trigger renders in each scene's default view.

## 11. Implementation outline

This follows the conventions and content rules of the phase 2 plan: `rtk`, bun only, one commit per task, no trailers, LF, and never staging `source/`.

**Task 0: mockup.** Add the four scenes to `docs/concept/nuzhah-concept.html` for the owner's review (spec §4.3). Settle the open questions first.

**Task 1: kit.**
- Add `Chip`, `Gauge`, `Glyph`, `Matn`, `Scale` and `Decision`; the `Arrow` `variant` prop (`lift`, `elided`) with the `#ahl` marker in `Defs`; and `FIG.weak`/`KIND_NAME.weak`.
- Add `.added` and the `tip` keyframes to `svg.css`/`motion.css`, with the resting state equal to the end state.
- Unit-test any geometry helpers, such as the `Scale` pan offsets for a given tilt.
- Commit `svg: add scale, matn, chip, gauge and glyph parts`.

**Task 2: schema and page.**
- Add `Grades`, `Opposition`, `Support` and `ActedOn` to the `diagram` enum.
- Extend `LEGEND` and `hasFigures` in `[scene].astro`. ActedOn has no figures.
- Grid scenes with views: check that `viewswitch.ts` toggles `[data-view-show]` across several SVGs on one page. It works page-wide, so this should already hold.
- Commit `content: allow al-maqbul diagrams`.

**Task 3: scene `grades`.**
- YAML entry (§2), with `scene: grades` on its 11 terms.
- `Grades.astro` as a 2×2 grid of four SVGs; cell A has `<Defs/>`.
- The `tirmidhi` view swaps rung ④.
- Verify: `?view=tirmidhi`; `?hasan-li-dhatihi` lands back on the default view; reduced motion shows all ticks.
- Commit `scenes: add how-sound-is-it grades grid`.

**Task 4: scene `opposition`.**
- YAML (§3) and 5 terms.
- `Opposition.astro`, with three panels.
- The `accept-all` view swaps the panel 1 pill.
- Verify: the scales are tilted at rest under reduced motion; the `?munkar` portrait landing.
- Commit `scenes: add who-outweighs-whom scales`.

**Task 5: scene `support`.**
- YAML (§4) and 5 terms.
- `Support.astro`, with the tree, the elided arrows and the iʿtibār sweep.
- The `by-wording` view swaps the brackets for tags.
- Verify: the end state under reduced motion; `?shahid` from `?view=by-wording` lands on the default view.
- Commit `scenes: add corroboration tree with i'tibar sweep`.

**Task 6: scene `acted-on`.**
- YAML (§5) and 7 terms.
- `ActedOn.astro`, with four panels.
- Verify: `?tawaqquf` lands in panel 4 in portrait.
- Commit `scenes: add acted-on decision path`.

**Task 7: tests and screenshots.**
- `routes.spec.ts` picks up four more routes from the sitemap.
- `scenes.spec.ts` gains:
  - landing for all 28 terms, desktop and portrait;
  - views on `grades` (`tirmidhi`), `opposition` (`accept-all`, with the pill swap) and `support` (`by-wording`, with the brackets hidden);
  - carousels on `opposition`, `support` and `acted-on`;
  - grid stacking on `grades`;
  - the legend kinds per scene.
- Add the four scenes to `motion.spec.ts`. With reduced motion, `getAnimations()` must be empty, and the Scale beams must keep their resting transform.
- Screenshots: desktop and mobile, light and dark.
- Commits: `test: add al-maqbul scene tests` and `docs: add al-maqbul screenshots`.

**Task 8: spec and notes.**
- Spec §4.3: add a phase 3 table row per scene.
- `notes/translation-queries.md`: add §9 above, replacing the p.159 row.
- `notes/annotation-usage.md`: add §8 above.
- `divisions.yaml`: the moon labels are unchanged.
- Commit `docs: update spec and notes for al-maqbul`.

## 12. Open questions for the owner

1. **§5.12, the maʿrūf version.** Does it stop at Ibn ʿAbbās (mawqūf, as the Arabic seems to say) or at Abū Isḥāq (as the translation reads)? The diagram draws it from Ibn ʿAbbās.
2. **§5.13, partial follow-up "below" or "above".** Please confirm "above" (فَمَنْ فَوْقَهُ).
3. **§5.16.2, harmonisation or preference.** Please confirm that the slip should read "preference". This replaces the existing p.159 query.
4. **The ḥasan view.** Is showing al-Tirmidhī's definition as an "Other view" right, given that Ibn Ḥajar presents it as al-Tirmidhī's usage for his own book rather than as a rival definition? The alternative is to keep it only in Read as text (extra 1).
5. **The `by-wording` view.** Under the group's "same wording" test, should ʿĀṣim's فَكَمِّلُوا (against فَأَكْمِلُوا) count as the same wording (mutābiʿ) or not? The default view is unaffected. The alternative is to drop this view, since Ibn Ḥajar calls the matter easy.
6. **The jurists' order** (p.142 note: abrogation last). Should it become an "Other view" on scene 4? It isn't in the translation. It would need a 5 × 260 layout so that the steps can swap. Also, which order exactly: harmonise, prefer, abrogate, pause?
7. **The p.138 munkar note** (weak against less weak). Leave it out, as designed, since the translation's definition and example say weak against stronger?
8. **Scene 2, panel 1 example.** Keep the abstract "… + added words" cards, or use the owner's p.132 example (zakāt al-fiṭr, "of the Muslims")? It isn't from the book, so it would be labelled as an illustration.
9. **The p.126–127 reading** that al-Tirmidhī's "ḥasan ṣaḥīḥ" is effectively ṣaḥīḥ. Leave it out, as designed?
10. **Accuracy gauges.** Are illustrative levels (5, 4, 3 and 2 fifths) acceptable, with the note making clear they are not measured?
11. **Generation colours** for named narrators (§1), from standard knowledge rather than from the translation. Approve, or draw them all as black "later" figures?
12. **Matn Arabic.** The quoted lines (crescent wordings, contagion, leper, graves, Jābir, the munkar and shādhdh reports) need checking against an edition before the build. Should the owner or the implementer do this?
13. **Extra 2** (the seven ranks by the two Ṣaḥīḥs, §5.9). Include it in Read as text, or leave it out as not a term?
14. **Scene 3 in portrait.** The moon shows only in panel 1. Is that acceptable, or should panels 2 and 3 carry a small "from the Prophet ﷺ via Ibn ʿUmar" stub label at the top edge?
