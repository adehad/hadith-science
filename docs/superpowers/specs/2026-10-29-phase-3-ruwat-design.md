# Phase 3, division 8 (Maʿrifat al-ruwāt): scene design

Date: 2026-10-29
Status: design for owner review. The scenes no open question blocks are built on `design-ruwat` with the interim options (§16), and the owner's choices are collected in `docs/superpowers/specs/2026-10-29-phase-3-ruwat-review.json`.
Spec: `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Section numbers like spec §3.2 refer to it; bare § numbers (§5.63) refer to the book. "The al-Mardūd design" is `docs/superpowers/specs/2026-10-28-phase-3-mardud-design.md`, whose structure and interim rules this doc follows (with al-Maqbūl §13).

## 0. Summary

Division 8 has **33 terms** and no scenes yet. They get **six scenes**, one or two per moon, in the book's order. All 33 terms land on a scene; none stay pending.

| # | Scene | Path | Moons | Form | Terms | Views | Mobile |
|---|---|---|---|---|---|---|---|
| 1 | When and where did he live? | `/marifat-al-ruwat/generations/` | 0 | Three panels: the Companions grouped as one generation and as several, with Anas ibn Mālik in two; two lifespan bars that never meet under a claim to have met; one name in two towns | 3 | none | 3 panels |
| 2 | What did the critics call him? | `/marifat-al-ruwat/ranks/` | 1 | Two cells that read as one scale: the ranks of praise from the highest down, then the ranks of criticism from the mildest down to the worst | 10 | none | grid |
| 3 | Whose verdict counts? | `/marifat-al-ruwat/verdicts/` | 1 | Three panels: one critic adds a seal, one critic cracks a seal, and two balance scales for praise against criticism | 3 | `ibn-hajar`, `two`, `criticism-first` | 3 panels |
| 4 | What is he called? | `/marifat-al-ruwat/aliases/` | 2 | Eight cells, one per way a narrator is named: kunya, by-name, nisba, client, unique names, siblings, whose son, and one name up a chain | 6 | none | grid |
| 5 | How is it learned and taught? | `/marifat-al-ruwat/study/` | 3 | Four cells: teacher and student, the age to receive and to pass on, writing and checking a copy, and travel | 6 | none | grid |
| 6 | What kind of book is it? | `/marifat-al-ruwat/books/` | 4 | Six cells: a sorter by how a book is arranged, then musnad, chapters, hidden flaws, indexes, and the reasons behind a ḥadīth | 5 | none | grid |

§5.63 and §5.64 share a moon but ask two questions: *which word* a critic used, and *whose word* counts. Folded together they would make one scene of 13 terms with two unrelated forms (a scale of words and a set of rulings), so they are two scenes.

Three groups of parallel cases are `.cells` grids, as `Names.astro` and `Changes.astro` are: the ranks of words (scene 2), the ways of naming (scene 4) and the kinds of book (scene 6). Scene 5 is a grid too, because its four topics share no layout.

Every scene uses the book's own examples where the translation gives them:

- Anas ibn Mālik in two generations, and Ibn Ḥibbān's and Ibn Saʿd's ways of grouping (§5.62);
- Ibn Jurayj's two kunyas, Abū Isḥāq Ibrāhīm ibn Isḥāq al-Madanī and the mistake "Ibn Isḥāq informed me", Abū Ayyūb and Umm Ayyūb (§5.65);
- al-Aʿmash, Khālid ibn Makhlad al-Qaṭawānī, Khālid al-Ḥadhdhāʾ and Sulaymān al-Taymī (§5.65);
- al-Miqdād ibn al-Aswad, Ibn ʿUlayya, Rabīʿ ibn Anas from Anas, and ʿĀmir ibn Saʿd from Saʿd (§5.65);
- ʿImrān from ʿImrān from ʿImrān, and al-Bukhārī between two men called Muslim (§5.65);
- Sandar and the three Ṣughdīs (§5.65);
- Ibn Khallād's ages and Mālik (§5.67);
- Abū Ḥafṣ al-ʿUkbarī's book on the reasons behind ḥadīth (§5.71).

The translation gives no example for homelands, siblings, the mawlā, or any of the four kinds of book. Those cells are labelled illustrations that say "the book names no example", as in al-Mardūd.

### Content rules followed

These are the rules from the phase 2 plan, al-Maqbūl §13 and al-Mardūd §0.

- Every note paraphrases the *translation* paragraphs of §5.62–5.71 and the closing paragraph after §5.71 only: the headings `5.62.` to `5.71.` in `source/nuzhah.txt`, each read up to its `Commentary` line. Footnotes 245–270 are not used, and neither is any commentary (for example the commentary's tables of ranks in §5.63.1–5.63.2, its claim about Anas and the Ten, al-ʿUthaymīn's example in §5.64.3, or the ages of al-Iṣbahānī and Maḥmūd ibn al-Rabīʿ in §5.67.1).
- **No Arabic report wording anywhere.** Arabic appears only for term names, exactly as in `terms.yaml`. The critics' other words (athbat al-nās, dajjāl, matrūk, yurwā ḥadīthuhu and so on) are in transliteration with an English gloss, as the translation gives them.
- **Names only from the translation.** Every narrator and scholar named below appears in the cited paragraph. Where the translation misspells a name, the owner's p.398 highlights or a translation query (§13) give the spelling the site uses.
- **No numbers on the scales.** The rungs of scene 2 carry no ordinals, because the book does not count the ranks ("between them are further stages"). The ages in scene 5 (forty, fifty) are Ibn Khallād's, quoted as text, not a measure.
- **No Other views that aren't in the translation.** Scene 3's views are rival opinions §5.64 itself reports.
- Notes are written to fit `note: z.string().max(420)`, with a working cap of 400 characters (§10).

## 1. Shared decisions

- **Division id:** `marifat-al-ruwat`. The scene ids are `generations`, `ranks`, `verdicts`, `aliases`, `study` and `books`. Scene ids are unique across the site (`inventory.ts`), so the naming scene is `aliases`, not `names`, which division 7 holds.
- **Order and moons:** `generations` 1 `[0]`, `ranks` 2 `[1]`, `verdicts` 3 `[1]`, `aliases` 4 `[2]`, `study` 5 `[3]`, `books` 6 `[4]`. The moon labels in `divisions.yaml` are unchanged.
- **New `diagram` enum values:** `Generations`, `Ranks`, `Verdicts`, `Aliases`, `Study` and `Books`.
- **Figures:** the figure language of spec §3.1–3.2, with no new kinds. Spec §3.2 already ties three of the critics' words to figures (ثِقَةٌ reliable, ضَعِيفٌ weak, كَذَّابٌ liar), so scene 2 stands those figures beside those rungs. In scene 3 the seal is the act itself: accrediting fills an empty seal slot, discrediting cracks a seal (spec §3.2: "a seal, meaning someone vouches for him").
- **Generation colours:** gold only for those the translation calls Companions (Anas ibn Mālik, Abū Ayyūb and Umm Ayyūb, ʿImrān ibn Ḥuṣayn); everyone else is black (later). No Successor is drawn green, since the translation names none as such in these paragraphs.
- **Legend:** the scene page's `LEGEND` map gains `Generations: ["sahabi", "later"]`, `Ranks: ["later", "weak", "liar"]`, `Verdicts: ["later", "majhul", "weak"]` and `Study: ["later"]`. `Aliases` and `Books` draw names as chips, not figures, so they have no legend and no Key/Labels switch.
- **Terms file:** each of the 33 terms gets `scene:` set to its scene. No term is view-only.
- **Cross-scene links** go through `XLink`, which fails the build if the target is missing. Targets in divisions 4–6 that are not yet built (muʿanʿan, muhmal, musalsal) are plain text, never links, until their scenes exist.
- **Shared mechanisms reused** (test audit §3): the `Term` panel guard (with `dx` for a trigger in a translated group), `XLink`, the `.cells` grid in `base.css`, the state ink, tint and wash tokens with `ViewTag`, the `m-draw` and `m-enter` motion classes with `stagger` (rest = end state), `viewAttrs`, and the scene-nav helpers in `lib/scene.ts`.

## 2. What other scenes already draw

None of the 33 terms is a trigger on another scene. But several ideas are drawn elsewhere, so these scenes link rather than draw them twice:

| Idea | Drawn on | Here |
|---|---|---|
| Same name, different men (muttafiq), names read by their dots (muʾtalif), look-alike names with a differing nisba (mutashābih) | *Who is who?* (`names`, division 7) | Scene 1 panel 3 and scene 4 link to it. Scene 4 draws no fork of one name into two men, and no letter-dot glyphs. |
| One man with many names, taken for a group (al-Kalbī) | *Why is he unknown?* (`identity`, division 3) | Scene 4's kunya and by-name cells link to it; the al-Kalbī example is not repeated. |
| Lifespan bars that show two men never met | *Did he hear it from him?* (`hidden`) and *Why is a report rejected?* (`causes`) | Scene 1 panel 2 reuses `Lifespan` for the tool itself (the dates), and links to `hidden` for the concealed drop. |
| The causes behind a critic's word: lying, suspicion, gross error, poor memory, innovation | *Why is a report rejected?* and the al-Mardūd scenes | Scene 2's words matrūk, fāḥish al-ghalaṭ, sayyiʾ al-ḥifẓ and kadhdhāb are plain labels; one footer link goes to `causes`. Scene 3's "a difference in creed" links to `innovation`. |
| The ways of receiving and their words | *How was it received?* (`delivery`, division 6) | Scene 5 covers only the age and fitness to receive and pass on, and links to `delivery`. |

## 3. Scene 1: When and where did he live? (`generations`)

### 3.1 Header

```yaml
- id: generations
  division: marifat-al-ruwat
  moons: [0]
  order: 1
  title: When and where did he live?
  eyebrow: Knowing the narrators, generations, dates and homelands · §5.62
  lede: A ḥadīth master needs to know which generation each narrator belongs to, when he was born and died, and where he lived. These keep two men from being confused, expose a false claim to have met someone, and help uncover a concealed drop.
  source: §5.62 Ṭabaqa, al-mawālīd wa-l-wafayāt, al-buldān wa-l-awṭān
  diagram: Generations
  width: 780
```

### 3.2 Form, and why it suits the idea

Three tools, three pictures, one row of panels:

1. **Generations** are groups by age and by the shaykhs met. The panel shows the Companions grouped two ways side by side, as §5.62 describes: as one generation by companionship alone (Ibn Ḥibbān), and as several by when they accepted Islam and the events they saw (Ibn Saʿd). Anas ibn Mālik straddles two bands of the second column, which is the book's own point that one man can belong to two.
2. **Dates** are about overlap: two `Lifespan` bars that never meet, under a claim to have met, crossed out.
3. **Homelands** keep similar names apart: one name chip, two place pins, two men.

### 3.3 Sketch (780 × 500)

```
x→ 0  20   70   130  190  240 260│ 280  340        460      520│ 540   600   660   720  780
 30 │        Ṭabaqa (i) طَبَقَةٌ      │ al-Mawālīd wa-l-wafayāt (i)  │ al-Buldān wa-l-awṭān (i)
 52 │ alike in age and the shaykhs  │ births and deaths             │ towns and lands
 80 │ BY COMPANIONSHIP  BY OTHER     │                               │  [ same name ] chip 660,110
    │ Ibn Ḥibbān        FACTORS     │ ▬▬▬▬▬▬▬▬ the shaykh (bar)     │      ╱      ╲
    │                   Ibn Saʿd    │            ▬▬▬▬▬▬▬ he (bar)   │   ⊙ 600,190   ⊙ 720,190
110 │ ┌──────────┐     ┌─early─────┐│      ┊ gap ┊                  │   ◉ one town  ◉ another
    │ │ ★ ★ ★ ★  │     │ ★  ★  ╮   ││ [⊙] 330,230  ╭"we met" ╮ ✕   │
    │ │ ★ ★ ★ ★  │     ├─events──┤Anas│                             │ an illustration: the book
    │ │ ★ ★ ★ ★  │     │ ★  ★  ╯   ││ the dates show they never met│ names no example
    │ │ one band │     ├─later─────┤│                               │
    │ └──────────┘     │ ★  ★      ││ → Did he hear it from him?    │ → Who is who? (mutashābih)
360 │ the same for the Successors   │                               │
380 │ helps expose tadlīs · what an │                               │
    │ ʿanʿana really means          │                               │
```

- **Panel 1:** two columns at x 20..120 and 140..240. Left: one rounded band (y 110..290) holding twelve small gold figures (k=0.35) and the `.lbl` "one generation". Right: three bands (y 110..170, 175..235, 240..300), labelled in `.lbl sm` "by when they accepted Islam", "by the great events", "by the Migration" (§5.62's three factors), each with a few gold figures. One gold figure, named "Anas ibn Mālik" in Labels mode and with a small name `Chip` beside it, sits on the line between the first two bands, with a dashed `Bracket` spanning both: "by companionship · by his youth". Under the columns, three `.lbl sm` lines: the Successors are grouped the same two ways; then the benefits ("no confusion · helps expose tadlīs (link to `hidden`) · shows what an ʿanʿana really means", the last plain text since muʿanʿan's scene is not built).
- **Panel 2:** two `Lifespan` bars, "the shaykh" (290..420, 120) and "he" (440..510, 140), with a dashed gap between their ends and a blinking "?" over it. A plain `later` figure at (330,230) with a `SpeechBubble` (en only, "I met him") and a `Glyph cross` drawn over the bubble's corner once the bars are in. `.lbl` "the dates show he never met him". The words in the bubble are an illustration, labelled so; the translation quotes no claim (open question 1). XLink to `hidden`.
- **Panel 3:** a name `Chip` "the same name" at (600..720, 110); two thin arrows to two `later` figures at (600,190) and (720,190), each over a new `Glyph pin` and a `.lbl sm` "one town" / "another". `.lbl` "an illustration: the book names no example". XLink "a differing nisba: Who is who?" to `names#mutashabih`.

### 3.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `tabaqa` | Panel 1 title | A group of narrators alike in age and in the shaykhs they met. Knowing it guards against confusion, helps expose tadlīs, and shows what an ʿanʿana really means. One man may belong to two: Anas ibn Mālik is counted by his companionship in the generation of the Ten, and by his youth in the one after. Ibn Saʿd's book is the most comprehensive (§5.62). |
| `mawalid-wa-wafayat` | Panel 2 title | Narrators' dates of birth and death. With them the truth comes out when someone claims to have met a man he never met (§5.62). |
| `awtan` | Panel 3 title | Narrators' towns and lands. Knowing them keeps apart two similar names whose bearers differ in where they belong (§5.62). |

**Extra** (Read as text only):

1. **Grouping the Companions and the Successors** (§5.62). Whoever looks only at companionship makes all the Companions one generation, as Ibn Ḥibbān and others did. Whoever adds other factors, such as when they accepted Islam, or their part in the great events or the Migration, makes them many generations, as Muḥammad ibn Saʿd al-Baghdādī did. The Successors are the same: by taking from some Companions they are one generation, for Ibn Ḥibbān; by whom they met, several, for Ibn Saʿd. Each way has its reason. In the diagram, panel 1 sets the two ways side by side, and the speech bubble in panel 2 is an illustration, not a quoted claim.

### 3.5 Views

None. §5.62 reports the two ways of grouping without preferring one ("for each one of them is a reason"), so they stand side by side rather than as a default and an alternative (open question 2).

### 3.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `generation` | Generations | 0 | 260 |
| `dates` | Births and deaths | 260 | 520 |
| `homelands` | Homelands | 520 | 780 |

### 3.7 Motion

- **Panel 1:** the right column's bands enter one after another (`m-enter`, `stagger` 0.25s); Anas's bracket draws in after (`m-draw`).
- **Panel 2:** the bars enter from the left; the "?" blinks; the cross draws in after (`m-draw`, delay 1s).
- **Reduced motion:** all shown, cross drawn, nothing blinking. Base styles are the end state.

### 3.8 Kit parts

Reuses `Narrator`, `Lifespan`, `SpeechBubble` (en only), `Chip`, `Bracket`, `Glyph` (`cross`), `Arrow`, `TermTitle`, `XLink`. New: `Glyph pin`, a map pin (a teardrop with a hole), for a place.

### 3.9 Translation slips

None that change meaning. "The generation of Ten" is the translation's wording and is kept as "the generation of the Ten".

## 4. Scene 2: What did the critics call him? (`ranks`)

### 4.1 Header

```yaml
- id: ranks
  division: marifat-al-ruwat
  moons: [1]
  order: 2
  title: What did the critics call him?
  eyebrow: Knowing the narrators, the ranks of praise and criticism · §5.63
  lede: A narrator is known to be upright, known for open sin, or not known at all. The critics' words for him come in ranks, and the rank matters, because some criticism does not mean rejecting all his reports. At both ends the words are superlatives.
  source: §5.63 Marātib al-taʿdīl and marātib al-jarḥ
  diagram: Ranks
  width: 860
```

### 4.2 Form, and why it suits the idea

§5.63 gives two lists of words, each in order: praise from the highest down, criticism from the worst up. Laid end to end, they make one scale, from the best thing a critic can say to the worst. The scene is a **grid of two cells** (each `<svg viewBox="0 0 430 560">`), arranged so that the scale reads in one direction both ways:

- Cell A, praise, runs from the highest rank at the top down to the mildest.
- Cell B, criticism, runs from the mildest at the top down to the worst.

On desktop they sit side by side and read left then right; in portrait they stack into one column, best at the top and worst at the bottom. The extreme rungs at both ends carry the same small tag, "afʿal: a superlative", because §5.63 builds both from the same form.

Each named rank is a rung. The book says further ranks lie between those it names, so a thin dashed rung marks "further ranks between" where it says so, with no count.

### 4.3 Sketches (each cell 430 × 560)

Cell A, "Praise" (origin 0,0):

```
x→ 0  24   70                                   400 430
 30 │           Marātib al-taʿdīl (i)  مَرَاتِبُ التَّعْدِيلِ     (title)
 52 │              words of praise, from the highest       (.lbl)
 90 │ ┌ Awthaq al-nās (i) أَوْثَقُ النَّاسِ  [afʿal: a superlative] ┐ rung, gold wash
    │ │  athbat al-nās · "the last word in reliability"    │
170 │ ┌ Thiqa (i) ثِقَةٌ                         [⊙ reliable] ┐ rung
    │ │  thiqa thiqa · thabt thabt · ʿadl ḍābiṭ             │
    │ │  a word repeated, or two joined                     │
260 │ ┆ further ranks between ┆                              dashed rung
320 │ ┌ Shaykh (i) شَيْخٌ                                    ┐ rung, lightest wash
    │ │  yurwā ḥadīthuhu · yuʿtabaru bihi                   │
    │ │  lenient: the lowest praise                         │
430 │ ▼ milder praise                                        (wedge)
500 │ known to be upright · known for open sin · not known (.lbl, §5.63's three states)
```

Cell B, "Criticism" (origin 430,0):

```
x→ 0  24   70                                   400 430
 30 │           Marātib al-jarḥ (i)  مَرَاتِبُ الْجَرْحِ
 52 │          words of criticism, from the mildest
 82 │ ┌ Layyin (i) لَيِّنٌ                                   ┐ lightest
    │ │  sayyiʾ al-ḥifẓ · fīhi maqāl                        │
152 │ ┌ Ḍaʿīf (i) ضَعِيفٌ                         [⊙ weak]   ┐
    │ │  laysa bi-l-qawī                                    │
222 │ ┌ Munkar al-ḥadīth (i) مُنْكَرُ الْحَدِيثِ               ┐
    │ │  matrūk · sāqiṭ · fāḥish al-ghalaṭ  · harsher than ḍaʿīf
292 │ ┆ further ranks between ┆
340 │ ┌ Kadhdhāb (i) كَذَّابٌ                       [mask liar] ┐
    │ │  dajjāl · waḍḍāʿ: intensive, short of the superlative│
410 │ ┌ Akdhab al-nās (i) أَكْذَبُ النَّاسِ  [afʿal: a superlative]┐ darkest
    │ │  "the last word in fabrication" · "the pillar of lying"
490 │ ▼ graver
520 │ some criticism does not reject all his reports
540 │ → the ten causes behind them: Why is a report rejected?
```

- **Rungs:** rects x 24..406, 60–80 tall, rx 8. Fill steps with `stepFill(lvl)` from `staircase.ts`, as Grades and Causes do: gold for praise, deepening from the top of A down to the mildest; for criticism, the gap tint deepening from the top of B down to the worst. Text on the fills uses the `--on-gold` / state ink tokens.
- **Rung text:** line 1 is the row-title trigger (13px bold transliteration, then its Arabic in `.ar`); lines 2–3 are the translation's other words in that rank, transliterated, with a short English gloss, in `.lbl sm`.
- **Figures:** at the right end of three rungs, at k=0.55: a reliable `later` figure at *thiqa*, `FIG.weak` at *ḍaʿīf*, `FIG.liar` at *kadhdhāb*: the three words spec §3.2 names. Labels-mode names under them.
- **Wedges:** a thin wedge at x 8..18 down each cell, "milder praise" and "graver" at their ends. No ticks, no numbers.
- **Footer:** cell B ends with the `.lbl` "some criticism does not reject all his reports" and an XLink to `causes` ("the ten causes behind them").

### 4.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `maratib-al-tadil` | Cell A title | Words of praise come in ranks. The highest is a superlative: awthaq al-nās, athbat al-nās, or calling him the last word in reliability. Next comes a word repeated, or two joined: thiqa thiqa, thabt thabt, ʿadl ḍābiṭ. The lowest are lenient words such as shaykh. Between the highest and the lowest lie further ranks (§5.63). |
| `awthaq-al-nas` | Cell A, rung 1 | The highest rank of praise, a superlative (afʿal) that exaggerates: the most reliable of people, or athbat al-nās, the most firmly established, or saying he is the last word in reliability (§5.63). |
| `thiqa` | Cell A, rung 2 | Reliable. Stressed by repeating it, as thiqa thiqa or thabt thabt, or joined to a second word of praise, as ʿadl ḍābiṭ (upright, accurate), it marks the rank just below the superlatives (§5.63). |
| `shaykh` | Cell A, rung 3 | Among the lowest words of praise, which show leniency in accrediting him, with yurwā ḥadīthuhu (his ḥadīth is narrated) and yuʿtabaru bihi (he is taken into account) (§5.63). |
| `maratib-al-jarh` | Cell B title | Words of criticism come in ranks too, and the rank matters: critics may fault a man with something that does not mean rejecting all his reports. The worst is a superlative such as akdhab al-nās; next, intensive forms such as kadhdhāb; the mildest, words such as layyin. Between lie further ranks, such as munkar al-ḥadīth, harsher than ḍaʿīf (§5.63). |
| `layyin` | Cell B, rung 1 | Soft: among the mildest words of criticism, with sayyiʾ al-ḥifẓ (poor memory) and fīhi maqāl (there is talk about him) (§5.63). |
| `daif` | Cell B, rung 2 | Weak. With laysa bi-l-qawī (not strong), one of the ranks between the mildest and the worst, and milder than munkar al-ḥadīth (§5.63). |
| `munkar-al-hadith` | Cell B, rung 3 | One of the ranks between the mildest and the worst, with matrūk (abandoned), sāqiṭ (fallen) and fāḥish al-ghalaṭ (gross in error). It is harsher than ḍaʿīf and laysa bi-l-qawī (§5.63). |
| `kadhdhab` | Cell B, rung 4 | The rank after the worst: dajjāl, waḍḍāʿ (a great forger) and kadhdhāb (a great liar). These forms exaggerate too, but they rank below the superlatives (§5.63). |
| `akdhab-al-nas` | Cell B, rung 5 | The worst rank of criticism, a superlative (afʿal) that exaggerates: the greatest of people in lying, or calling him the last word in fabrication, or the pillar of lying (§5.63). |

### 4.5 Views

None. The translation gives one scheme.

### 4.6 Grid cells

The cells are 1 Praise (A) and 2 Criticism (B), with ids `cell-praise` and `cell-criticism`. Desktop side by side; portrait one column.

### 4.7 Motion

- The rungs of each cell enter from the top, one after another (`m-enter`, `stagger` start 0.2s, step 0.12s), so the eye reads the order. The figures enter with their rungs.
- **Reduced motion:** all rungs shown. Base styles are the end state.

### 4.8 Kit parts

Reuses `Narrator` (`later` reliable, `weak`, `liar`), `TermTitle`, `titleTrigger` with `ROW_TITLE_TRIGGER`, `stepFill`, `XLink`. The rungs and wedges are scene-local. No new parts.

### 4.9 Translation slips

- **§5.63 (p.377) "ilayhi al-muntahā fī al-tathabbut (he is the last word in dependency)".** Tathabbut is being firmly established or precise; "dependency" seems a slip. The site keeps `terms.yaml`'s "the last word in reliability".
- **§5.63 (p.377–378) "fīhi maqāl" in two places.** It is listed with the mildest words and again with ḍaʿīf. One is likely misplaced; the owner's p.377 highlight reads it as the mildest level. The site shows it at the mildest rank only (open question 3).
- **§5.63 "known … for his lewdness".** The site says "known for open sin", as al-Mardūd does for fisq.

## 5. Scene 3: Whose verdict counts? (`verdicts`)

### 5.1 Header

```yaml
- id: verdicts
  division: marifat-al-ruwat
  moons: [1]
  order: 3
  title: Whose verdict counts?
  eyebrow: Knowing the narrators, the rules of praise and criticism · §5.63–5.64
  lede: Praise and criticism are taken only from a critic who is reliable and knows their grounds. One such critic is enough, because his word is a ruling, not testimony. When they disagree, criticism wins only if it is explained, unless he was never accredited.
  source: §5.63 The narrator's three states, §5.64 Taʿdīl, jarḥ and jarḥ mufassar
  diagram: Verdicts
  width: 780
```

### 5.2 Form, and why it suits the idea

The figure language already has a sign for being vouched for: the seal. So the two acts are drawn as what they do to the seal:

1. **Accrediting** fills an empty seal slot. One critic does it, with a lens (he knows the grounds), and the panel sets beside him the two witnesses that testimony would need before a judge, faint, to show what accrediting is *not*. Under them, one who goes by appearances, crossed out.
2. **Discrediting** cracks a seal. Beside it, who may not do it: the prejudiced critic, crossed out, with the two sources of prejudice §5.64 names.
3. **When they disagree** is a weighing, so the third panel has two `Scale`s, praise against criticism: explained criticism outweighs; unexplained criticism does not unseat proven integrity. A third row covers the narrator no one ever accredited.

The rival opinions of §5.64 each change one panel, so they are the scene's Other views.

### 5.3 Sketch (780 × 520)

```
x→ 0  30   80   130     230 260│ 280   330    400   470 520│ 540     650           780
 30 │        Taʿdīl (i)         │        Jarḥ (i)            │     Jarḥ mufassar (i)
 52 │ adding the seal           │ cracking the seal          │ when they disagree
 90 │ [⊙⌕] 70,120 ──→ [⊙◌→●]    │ [⊙⌕] 330,120 ──→ [⊙✶]      │  praise ◯        ● criticism
    │ critic        190,120     │ critic          450,120    │      ╲___ ⚖ ___╱ tips right
    │ "knows the grounds"       │                            │  explained, by one who knows
200 │ ONE IS ENOUGH (accept)    │ NOT FROM                    │      the grounds: it outweighs
    │ a ruling, not testimony   │ [⊙✕] prejudiced             │  ⚖ tips left
    │ ┆⊙ ⊙┆ testimony: two,     │  · bad character, corrupt  │  unexplained: proven integrity
    │ before a judge (faint)    │    motives (rare early)    │  stands
320 │ NOT FROM [⊙✕] one who goes│  · a difference in creed:  │ NEVER ACCREDITED
    │ by appearances            │    not alone → innovation  │ [⊙◌] + brief criticism from
    │                           │ al-Dhahabī · al-Nasāʾī     │ an expert → (accepted)
430 │ passing on another's      │ (Read as text)             │ [Ibn al-Ṣalāḥ: pause] tag
    │ verdict: no number either │                            │
```

- **Panel 1:** a reliable critic at (70,120), k=0.8, with a `Glyph lens` at his hand; a `flow` arrow to a narrator at (190,120) drawn with `seal="slot"`, over which a filled seal enters (`m-enter`) so it rests vouched for. `Pill state="accept"` "one is enough" at (130,210) and `.lbl` "a ruling, not testimony". Two faint figures at opacity .5 (child by child, as Identity's contrast) with `.lbl sm` "testimony: two witnesses, before a judge". A crossed-out figure (`Glyph cross` at its shoulder) with "one who goes by appearances". `.lbl sm` at the foot: "passing on another's verdict: it seems no number is needed".
- **Panel 2:** the critic at (330,120) and a narrator at (450,120) whose seal rests cracked (`FIG.weak`); the crack draws in (`m-draw`). Under "Not from": a crossed figure "the prejudiced" and two bullets; the second ends in an XLink to `innovation` ("a difference in creed: not enough alone").
- **Panel 3:** two `Scale`s at (650,130) and (650,260), w=120: the first `left=1 right=2 tilt=8` (criticism, explained, heavier: a `Glyph text` on its pan's label), the second `left=2 right=1 tilt=-8` (proven integrity outweighs unexplained criticism). Pans labelled "praise" and "criticism" in `.lbl sm`. Under "Never accredited", a `majhul` figure at (580,380), a `+`, a chip "brief criticism, from an expert", an arrow and `Pill state="accept"` "accepted"; under it a `ViewTag` "Ibn al-Ṣalāḥ: pause" (dashed), always shown, since it is a named scholar's leaning on this one case.

### 5.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `tadil` | Panel 1 title | Accrediting is accepted from one who knows its grounds, not from one who goes by outward appearance without study. One such critic is enough, on the most authentic opinion: accrediting is a ruling, which needs no number, unlike testimony, given before a judge. Even when he passes on another's verdict, it seems no number is needed (§5.64). |
| `jarh` | Panel 2 title | Criticism, like praise, is taken only from one who is reliable and well informed, not from one who is prejudiced and faults a narrator's ḥadīth with what does not warrant rejection. Prejudice may come from bad character or corrupt motives, which the early critics were mostly free of, or from a difference in creed, which alone should not count against him (§5.64). |
| `jarh-mufassar` | Panel 3 title | Criticism comes before praise only when it is explained, by one who knows the grounds; unexplained criticism cannot unseat one whose integrity is proven. If no one ever accredited him, brief criticism from an expert is accepted, since his state is unknown and acting on it is better than ignoring it; Ibn al-Ṣalāḥ inclined to pause there (§5.64). |

**Extra** (Read as text only):

1. **The narrator's three states** (§5.63). A narrator is known for his integrity, known for open sin, or nothing is known of him. Knowing which, and then the ranks of praise and criticism, matters, because critics sometimes fault a man with something that does not mean rejecting all his reports.
2. **Two warnings** (§5.64). al-Dhahabī, a master of judging men, said that two scholars of this field never agreed to call a weak narrator reliable, or a reliable one weak; so al-Nasāʾī would not abandon a man's ḥadīth until all of them rejected him. The critic must beware of carelessness either way: accrediting without care affirms what is not so, and he risks being counted among those who pass on a ḥadīth they think false; discrediting without care brands an innocent Muslim with a mark that stays with him forever.

### 5.5 Views

The translation reports rival opinions in §5.64. Ibn Ḥajar's is the default.

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar | §5.64, "the most authentic opinion" | One informed critic is enough to accredit, since it is a ruling. Criticism comes before praise only when it is explained by one who knows the grounds. |
| `two` | Some: two critics | "Those who specify…", §5.64 | Accrediting is accepted only from two, as testimony requires. Ibn Ḥajar answers that accrediting is a ruling, which needs no number, while testimony is given before a judge. |
| `criticism-first` | A group: criticism always first | "A group [of scholars] have said…", §5.64 | Criticism comes before praise unconditionally, explained or not. Ibn Ḥajar answers that unexplained criticism cannot unseat one whose integrity is proven. |

Each view changes one panel (`data-view-show` groups and `ViewTag`s):

| View | Panel 1 | Panel 3 |
|---|---|---|
| `ibn-hajar` | as sketched | as sketched |
| `two` | a second, dashed critic joins; the pill becomes `pause` "two are needed"; tag "some: like testimony" | as sketched |
| `criticism-first` | as sketched | the second scale's group is replaced by one tipping to criticism (`tilt=8`), tag "a group: always first" |

### 5.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `accrediting` | Accrediting | 0 | 260 |
| `discrediting` | Discrediting | 260 | 520 |
| `disagree` | When they disagree | 520 | 780 |

### 5.7 Motion

- The seal enters in panel 1 (`m-enter`, delay 0.8s); the crack draws in panel 2 (`m-draw`, delay 0.8s); the arrows `flow`; the scales tip once (the `Scale` part's own motion).
- **View change:** groups swap; instant is acceptable.
- **Reduced motion:** seal shown, crack drawn, scales tipped. Base styles are the end state.

### 5.8 Kit parts

Reuses `Narrator` (`later`, `majhul`, `weak`), `Glyph` (`lens`, `cross`, `text`), `Pill`, `Scale`, `ViewTag`, `Arrow`, `Chip`, `TermTitle`, `XLink`, `viewAttrs`. No new parts.

### 5.9 Translation slips

- **§5.64 (p.386) "The agent in this field".** Likely just "the one who takes on this task"; the site avoids "agent", as al-Mardūd does in §5.37.

## 6. Scene 4: What is he called? (`aliases`)

### 6.1 Header

```yaml
- id: aliases
  division: marifat-al-ruwat
  moons: [2]
  order: 4
  title: What is he called?
  eyebrow: Knowing the narrators, kunyas, by-names and nisbas · §5.65
  lede: One narrator may be called by his name, his kunya, a by-name or a nisba, and one name may stand for him alone. Knowing each keeps one man from being taken for two, and two from being taken for one.
  source: §5.65 Kunya, laqab, nisba, mawlā, al-asmāʾ al-mufrada, al-ikhwa wa-l-akhawāt
  diagram: Aliases
  width: 860
```

### 6.2 Form, and why it suits the idea

§5.65 is a list of parallel cases, each introduced with "also important is knowing…". So the scene is a **grid of eight cells**, each `<svg viewBox="0 0 430 300">`, two columns on desktop and one in portrait, as *What changed in the telling?* Six cells hold the six terms; two more hold the book's two vivid non-term cases (whose son, and one name up a chain), whose examples a reader would otherwise only meet in prose (open question 7). The books listing narrators, which §5.65 also names, go in Read as text.

Each cell has the same grammar: names as `Chip`s, a dashed tie where two names are one man, a `Glyph cross` where a reading is wrong. No figures and no Arabic beyond the term names, so the cells stay readable at 430 wide.

### 6.3 Sketches (each cell 430 × 300)

```
A  Kunya (i) كُنْيَةٌ                         B  Laqab (i) لَقَبٌ
   [Abū Isḥāq Ibrāhīm ibn Isḥāq al-Madanī]       FROM A DEFECT   [al-Aʿmash] the bleary-eyed
        ╱                    ╲                    A NISBA USED    [Khālid ibn Makhlad]─[al-Qaṭawānī]
  "Abū Isḥāq informed me" ✓   "Ibn Isḥāq          AS ONE          a Kūfan; he disliked it
                               informed me" ✕     also: from a name, a kunya, a trade
   his kunya is his father's name                  some are unique
   [Ibn Jurayj]: [Abū al-Walīd] [Abū Khālid]       → many names, one man: Why is he unknown?
   [Abū Ayyūb] ♥ [Umm Ayyūb]  (gold)
C  Nisba (i) نِسْبَةٌ                          D  Mawlā (i) مَوْلًى
   ◉ tribe (older)  ◉ place (later)  ✂ trade       [mawlā] ─┬─ by reason of slavery
   [al-khayyāṭ] the tailor [al-bazzāz] cloth          ├─ alliance and protection
   NOT WHAT IT SEEMS                                  └─ by reason of accepting Islam
   [Khālid al-Ḥadhdhāʾ] shoemakers' company ✕trade   higher and lower   (?) only context tells
   [Sulaymān al-Taymī] lived among Banū Taym        an illustration: the book names no example
E  al-Asmāʾ al-mufrada (i)                    F  al-Ikhwa wa-l-akhawāt (i)
   [Sandar] ── one man only, as far as known       [⊙]──┬──[⊙]   brothers and sisters
   client of Zinbāʿ al-Judhāmī · Abū ʿAbd Allāh         └──[⊙]
   NOT UNIQUE: [Ṣughdī ibn Sinān] [Ṣughdī al-Kūfī]   ▤ ʿAlī ibn al-Madīnī wrote on it
   [Ṣughdī ibn ʿAbd Allāh]  (al-Bardījī was faulted)  an illustration: the book names no example
G  Whose son?                                 H  One name, up the chain
   [al-Miqdād ibn al-Aswad] = ibn ʿAmr (adoptive)  ʿImrān ← ʿImrān ← ʿImrān
   [Ibn ʿUlayya] = Ismāʿīl ibn Ibrāhīm, his mother  al-Qaṣīr  Abū Rajāʾ  ibn Ḥuṣayn ★
   [Rabīʿ ibn Anas] ← Anas: his shaykh, not father  [Muslim ibn Ibrāhīm] → al-Bukhārī → [Muslim ibn al-Ḥajjāj]
   [ʿĀmir ibn Saʿd] ← Saʿd: his father              no repetition, no swap
```

- **A, Kunya:** the worked example: one name chip at the top, two branches with English fragments in `.lbl` ("Abū Isḥāq informed me" with `Glyph check`; "Ibn Isḥāq informed me" with `Glyph cross`), and `.lbl sm` "his kunya matches his father's name". Then two rows: Ibn Jurayj tied to his two kunyas; Abū Ayyūb and Umm Ayyūb, gold-edged chips (`companion`), "a kunya shared with his wife". Footer `.lbl sm` "and the reverse: Isḥāq ibn Abī Isḥāq al-Sabīʿī".
- **B, Laqab:** two rows (from a defect; a nisba used as one) and a footer XLink to `identity` ("many names, one man").
- **C, Nisba:** three small kinds (tribe, place, trade: `Glyph pin` for place, a chip for the others), then "Not what it seems" with two rows, each with the misleading reading crossed and the real reason in `.lbl sm`.
- **D, Mawlā:** one chip with three branches (`Bracket`-style ties) and a blinking "?" with "only context tells".
- **E, Unique names:** Sandar alone in a chip with a solid underline; under "not unique", three Ṣughdī chips, with `.lbl sm` "al-Bardījī listed him as unique, and was faulted". Generation colour: none (chips), since who held companionship is a translation query (§13).
- **F, Siblings:** three small `later` figures (k=0.45) joined by a family bracket; a `Glyph book` with "ʿAlī ibn al-Madīnī".
- **G, Whose son?** four rows, each a chip and the true relation in `.lbl sm`.
- **H, One name up the chain:** three chips "ʿImrān" joined by `flow` arrows, their full names under them (ʿImrān al-Qaṣīr, Abū Rajāʾ al-ʿUṭāridī, Ibn Ḥuṣayn, the last gold-edged as a Companion); then al-Bukhārī between his shaykh Muslim ibn Ibrāhīm al-Farāhīdī al-Baṣrī and Muslim ibn al-Ḥajjāj al-Qushayrī, who narrates from him. `.lbl sm` "knowing it rules out a repetition or a swap in the chain".

### 6.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `kunya` | Cell A title | Know the kunyas of those known by name, so a man is not taken for another when a report gives his kunya, and the names of those known by kunya. Some have a kunya for a name (rare), some disputed kunyas (common), some several, like Ibn Jurayj: Abū al-Walīd and Abū Khālid. A kunya may match the father's name, or the wife's, like Abū Ayyūb and Umm Ayyūb (§5.65). |
| `laqab` | Cell B title | By-names, some of them unique. A laqab may come from a name or a kunya, from a defect, like al-Aʿmash, or from a trade. A nisba may serve as one: Khālid ibn Makhlad, a Kūfan, was nicknamed al-Qaṭawānī, which he disliked. Worth knowing too are the reasons behind by-names that do not mean what they seem (§5.65). |
| `nisba` | Cell C title | A name tying a narrator to a tribe, more common in early names, or to a place, more common later: a town, a district or where he stayed; or to a craft or trade, like the tailor or the cloth seller. Some mislead: Khālid al-Ḥadhdhāʾ only kept the shoemakers' company, and Sulaymān al-Taymī only lived among Banū Taym (§5.65). |
| `mawla` | Cell D title | Clients, higher and lower: tied to a people by reason of slavery, by alliance and protection, or by reason of accepting Islam. All are called mawlā, and only the context shows which is meant (§5.65). |
| `mufradat` | Cell E title | Names borne by one narrator only. al-Bardījī wrote on them, and some entries were faulted: Ṣughdī ibn Sinān is no unique name, since Ibn Abī Ḥātim also has a Ṣughdī al-Kūfī, and al-ʿUqaylī a Ṣughdī ibn ʿAbd Allāh. A true case is Sandar, client of Zinbāʿ al-Judhāmī, known as Abū ʿAbd Allāh. Kunyas and by-names can be unique too (§5.65). |
| `ikhwa` | Cell F title | Knowing which narrators are brothers and sisters. Early scholars wrote books on it, among them ʿAlī ibn al-Madīnī (§5.65). |

**Extra** (Read as text only):

1. **Whose son?** (§5.65). Some are known by someone other than their father: al-Miqdād ibn al-Aswad was named after al-Aswad al-Zuhrī, who had adopted him, though he was al-Miqdād ibn ʿAmr. Some by their mother: Ibn ʿUlayya is Ismāʿīl ibn Ibrāhīm ibn Miqsam, a reliable narrator; ʿUlayya was his mother, and he disliked the name, so al-Shāfiʿī would name him as Ismāʿīl, known as Ibn ʿUlayya. Some by their grandfather. And a shaykh may share the father's name: in "Rabīʿ ibn Anas, from Anas", Anas is his shaykh, not his father, whereas in "ʿĀmir ibn Saʿd, from Saʿd", in al-Bukhārī's Ṣaḥīḥ, Saʿd is his father.
2. **One name, again and again** (§5.65). A man, his father and grandfather may share a name, like Ḥasan ibn al-Ḥasan ibn al-Ḥasan ibn ʿAlī ibn Abī Ṭālib, or Abū al-Yumn al-Kindī, Zayd ibn al-Ḥasan ibn Zayd ibn al-Ḥasan… A narrator may share his name with his shaykh and his shaykh's shaykh: ʿImrān from ʿImrān from ʿImrān are ʿImrān al-Qaṣīr, Abū Rajāʾ al-ʿUṭāridī and Ibn Ḥuṣayn, the Companion. And a shaykh and a student may share a name, a form Ibn al-Ṣalāḥ did not come across: al-Bukhārī narrated from Muslim ibn Ibrāhīm al-Farāhīdī al-Baṣrī, and Muslim ibn al-Ḥajjāj al-Qushayrī narrated from him. Knowing it rules out a supposed repetition or swap in the chain.
3. **Books on the narrators** (§5.65). Some list them all, like Ibn Saʿd's Ṭabaqāt, the Tārīkhs of Abū Khaythama and al-Bukhārī, and Ibn Abī Ḥātim's al-Jarḥ wa-l-taʿdīl; some only the reliable (al-ʿIjlī, Ibn Ḥibbān, Ibn Shāhīn) or only the criticised (Ibn ʿAdī, Ibn Ḥibbān); some the men of one book, from al-Kalābādhī on al-Bukhārī's to scholars of the Maghrib on al-Tirmidhī's and al-Nasāʾī's. ʿAbd al-Ghanī al-Maqdisī's al-Kamāl covered the six books; al-Mizzī refined it, and Ibn Ḥajar summarised that as Tahdhīb al-tahdhīb, adding a third.

### 6.5 Views

None.

### 6.6 Grid cells

A Kunya, B Laqab, C Nisba, D Mawlā, E Unique names, F Siblings, G Whose son?, H One name up the chain. Desktop 2 × 4; portrait one column. Cell ids `cell-kunya` … `cell-chain`; A holds `<Defs/>`.

### 6.7 Motion

- **A:** the cross and the check draw in (`m-draw`, `stagger`).
- **E:** the three Ṣughdī chips enter one after another (`m-enter`).
- **H:** the arrows `flow`.
- **D:** the "?" blinks.
- **Reduced motion:** all shown and drawn. Base styles are the end state.

### 6.8 Kit parts

Reuses `Chip` (with `companion`), `Glyph` (`check`, `cross`, `book`, `pin`), `Arrow`, `Bracket`, `Narrator` (cell F), `TermTitle`, `XLink`. No new parts beyond scene 1's `Glyph pin`.

### 6.9 Translation slips

The owner's p.398 highlights mark four spellings; the site uses the corrected ones where it names these men (only al-Farāhīdī and al-Ḥajjāj appear in the scene):

- "Ibn Aḥmad ibn Abī Ṭabarānī" → ibn Ayyūb al-Ṭabarānī;
- "al-Farādīsī" → al-Farāhīdī;
- "al-Ḥujjāj" → al-Ḥajjāj;
- "Yaḥyā ibn Abī Ibn Kathīr" → Yaḥyā ibn Abī Kathīr.

Others:

- **§5.65 (p.398) "the solitary names".** The list that follows is of books on the narrators, so this likely renders al-asmāʾ al-mujarrada, the plain lists of narrators. The site calls them "books on the narrators".
- **§5.65 (p.400) Sandar.** "the mawlā of Zinbāʿ al-Judhāmī, who has companionship and narrations": whose companionship? The Arabic likely gives it to Sandar. The site leaves it out until a ruling (open question 8).
- **§5.65 (p.396) "his father is Bakar".** Likely "he is Bakrī, and his shaykh Anṣārī". Not used.
- **§5.65 "the nasab".** Here it means the nisba; the site says nisba, as `terms.yaml` does.

## 7. Scene 5: How is it learned and taught? (`study`)

### 7.1 Header

```yaml
- id: study
  division: marifat-al-ruwat
  moons: [3]
  order: 5
  title: How is it learned and taught?
  eyebrow: Knowing the narrators, teacher and student · §5.66–5.69
  lede: Teacher and student both need a sound intention and good character. A child may receive ḥadīth once he understands; there is no set age to pass it on. The student writes it clearly, checks his copy, and travels only once he has everything his own town holds.
  source: §5.66 Ādāb, §5.67 Taḥammul and adāʾ, §5.68 Kitāba and ʿarḍ, §5.69 Riḥla
  diagram: Study
  width: 860
```

### 7.2 Form, and why it suits the idea

Four topics, each its own small picture, in the book's order. The two pairs that §5.67 and §5.68 join (receiving and delivering; writing and checking) share a cell with two title triggers, as muṣaḥḥaf and muḥarraf do in *What changed in the telling?*. So the scene is a **grid of four cells**, each `<svg viewBox="0 0 430 340">`.

### 7.3 Sketches (each cell 430 × 340)

```
A  Ādāb al-shaykh wa-l-ṭālib (i)               B  Taḥammul (i)            Adāʾ (i)
   BOTH: a sound intention · free of the world     [child]→ gathering      no set age:
         · good character                          ▤✓ attendance recorded   need and ability
   [⊙ teacher]            [⊙ student]              from understanding       Ibn Khallād: fifty,
   narrates when needed   honours him, no trouble  ───┊───────────          forty no blame ✕
   sends to the senior    passes on what he learns before│after            Mālik narrated
   withholds from none*   no shame, no pride       [non-Muslim]→Islam→      younger
   pure, seated, dignified writes, vowels it,      delivers ✓
   stops when he may      revises                  [sinner]→repents→ ✓
   forget                                          → the ways of receiving: How was it received?
C  Kitābat al-ḥadīth (i)     ʿArḍ (i)            D  Riḥla (i)
   ┌page────────┐ ◌ vowels, dots on hard words    (his town ●●●●●) first, all of it
   │ ── ─^─ ──  │→ right margin, if room          then ──→ ◉ ──→ ◉  for what he lacks
   └────────────┘   else the left                  ⚖ more reports ● ● ●  outweighs  more shaykhs ⊙
   [copy] ⇄ [source]  with the shaykh · a reliable
   person · alone, piece by piece
   listening: no copying, talking, tiredness
```

- **A:** the shared requirements as three chips across the top; two figures (k=0.7) heading two columns of four short `.lbl sm` lines each. (*the teacher withholds from no one over his intention, §5.66.)
- **B:** two halves. Left: a small `later` figure (k=0.5) with an arrow to a gathering (three figures) and a `Glyph text` with a `Glyph check`: "attendance recorded"; a vertical "before | after" line with two rows (non-Muslim → Islam → delivers; sinner → repents, integrity proven → delivers). Right: "no set age" over "need and ability"; Ibn Khallād's ages as text with a `Glyph cross` and "Mālik narrated younger". Footer XLink to `delivery`.
- **C:** a page rect with rule lines; a `vowelMark` and two `letterDots` over one word box (lib/kit.ts helpers); a caret line from a gap to the right margin, where a short line is written; `.lbl sm` "right margin if there is room, else the left". Right half: two page rects with a two-headed arrow, three chips for the three ways, and a crossed row of distractions.
- **D:** a filled circle "his town" holding many report dots, then dashed routes to two pins; a `Scale` (w=110) with three discs labelled "reports" outweighing one labelled "shaykhs".

### 7.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `adab-al-shaykh-wa-al-talib` | Cell A title | Both need a sound intention, freedom from worldly distraction and good character. The teacher narrates when needed, sends students to a more senior master in town, withholds from no one over his intention, narrates pure, seated and with dignity, and stops when illness or age may make him forget. The student honours him, passes on what he learns, writes it with care and revises (§5.66). |
| `tahammul` | Cell B, left title | Receiving ḥadīth is soundest from the age of understanding. The masters brought their children to ḥadīth gatherings and recorded that they attended. What a non-Muslim received counts if he passes it on after becoming Muslim; so does an open sinner's, passed on after he repents and his integrity is proven again (§5.67). |
| `ada` | Cell B, right title | Passing ḥadīth on has no set age; what counts is the need for it and the ability, which differ from one person to another. Ibn Khallād put it at fifty, with no blame at forty; this was criticised, since Mālik narrated before that age (§5.67). |
| `kitabat-al-hadith` | Cell C, left title | Write the ḥadīth clearly, adding the vowels and dots to the difficult words. Anything missed goes in the right-hand margin if there is room, otherwise in the left (§5.68). |
| `ard` | Cell C, right title | Checking a copy: reading it against the shaykh, with a reliable person, or alone, piece by piece. Listening has its manners too: nothing that distracts, such as copying, talking or tiredness (§5.68). |
| `rihla` | Cell D title | Travel for ḥadīth begins only once the student has gathered all the reports of his own town; then he travels for what he does not have. His wish for more reports should outweigh his wish for more shaykhs (§5.69). |

### 7.5 Views

None.

### 7.6 Grid cells

A Teacher and student, B Receiving and delivering, C Writing and checking, D Travel. Desktop 2 × 2; portrait one column.

### 7.7 Motion

- **B:** the arrows `flow`; the cross draws in.
- **C:** the caret line draws to the margin (`m-draw`).
- **D:** the routes draw out from the town after its dots enter; the scale tips once.
- **Reduced motion:** all drawn. Base styles are the end state.

### 7.8 Kit parts

Reuses `Narrator`, `Chip`, `Glyph` (`text`, `check`, `cross`, `pin`), `Scale`, `Arrow`, `TermTitle`, `XLink`, and `lib/kit.ts` `vowelMark` and `letterDots`. No new parts.

### 7.9 Translation slips

- **§5.67 (p.406) "It is necessary to seek permission from the shaykh".** Likely "an ijāza from the one who makes them hear is needed" for children brought to gatherings. The site leaves it out until a ruling (open question 10).
- **§5.67 "age of maturity" and "differentiation", "requirement".** The owner's approved-pending p.406 and p.407 rows apply ("understanding", "need").

## 8. Scene 6: What kind of book is it? (`books`)

### 8.1 Header

```yaml
- id: books
  division: marifat-al-ruwat
  moons: [4]
  order: 6
  title: What kind of book is it?
  eyebrow: Knowing the narrators, kinds of books and the reasons behind a ḥadīth · §5.70–5.71
  lede: Ḥadīth books are arranged in four ways: by Companion, by topic, by a text and the ways its chains differ, or by a part of each text that recalls the rest. Some scholars also wrote on what prompted a ḥadīth. Ibn Ḥajar ends by sending the reader to the fuller books.
  source: §5.70 al-Masānīd, al-abwāb, al-ʿilal, al-aṭrāf, §5.71 Asbāb al-ḥadīth
  diagram: Books
  width: 860
```

### 8.2 Form, and why it suits the idea

The four kinds of book differ in one thing: what the compiler arranges by. So, as in *What changed in the telling?*, a **sorter** cell asks "how are its reports arranged?" and each answer links in-page to a cell that draws one book open. A sixth cell holds the reasons behind a ḥadīth and the closing remark. A **grid of six cells**, each `<svg viewBox="0 0 430 280">`.

### 8.3 Sketches (each cell 430 × 280)

```
A  How are its reports arranged?          B  al-Masānīd (i)
   by Companion ──────────→ al-Masānīd ↓     ┌▮★ ▮★ ▮★ ▮★┐ a chapter per Companion
   by topic ──────────────→ al-Abwāb ↓       by precedence in Islam  ·  or by letter (easier)
   a text and its routes ─→ al-ʿIlal ↓       an illustration: the book names no example
   a part, to recall it ──→ al-Aṭrāf ↓
C  al-Abwāb (i)                           D  al-ʿIlal (i)
   ┌chapter: a ruling ┐                       ┌Matn┐ ← ⊙→⊙→⊙ / ⊙→⊙ ⊙ / ⊙→⊙→⊙  its routes, and how they differ
   [affirms] [denies]                        arranged by chapter, for reference
   keep to sound and fair; a weak one ┆dashed┆ → Did he keep it right? (muʿallal)
   only with its reason
E  al-Aṭrāf (i)                           F  Asbāb al-ḥadīth (i)
   ┌Matn: ▬▬▬ ┄┄┄┄┄┄┐ enough to recall       ◷ an occasion ──→ ┌Matn┐
   ⊙→⊙→⊙  ⊙→⊙→⊙  ⊙→⊙  its chains gathered    ▤ Abū Ḥafṣ al-ʿUkbarī
   all of them · or those in certain books   later writers, unaware of it (Ibn Daqīq al-ʿĪd)
                                             THE END OF THE BOOK: the rest is in the fuller works
```

- **A:** four rows, each an in-page `<a href="#cell-…">` with the plain name and "↓", as Changes' sorter.
- **B:** a book shape with Companion tabs (`Glyph companion`), and two small orderings below it.
- **C:** a chapter card with two report chips, "affirms" and "denies", and a dashed weak chip tagged "with its reason".
- **D:** a `Matn` card with three short chains below it that differ at one link (one dashed), and a `Glyph lens`. XLink to `slips#muallal`.
- **E:** a `Matn` card whose first segment is solid and the rest dashed; three chains gathered under it by a `Bracket`.
- **F:** a `Glyph clock` "an occasion" with an arrow to a `Matn` card; a `Glyph book` chip for al-ʿUkbarī; a footer rule and two `.lbl sm` lines for the closing remark.

Every cell except F says "an illustration: the book names no example".

### 8.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `masanid` | Cell B title | Musnads gather the reports of each Companion on their own. The compiler may order the Companions by their precedence in Islam, or alphabetically, which is easier to look things up in (§5.70). |
| `abwab` | Cell C title | Books in chapters of law or the like: under each, the reports that affirm or deny a ruling. It is better to keep to the sound and the fair; a compiler who includes everything should explain why each weak report is there (§5.70). |
| `ilal` | Cell D title | Books of hidden flaws give each text with its route and the ways its chains differ. They are best arranged by chapter, to make them easier to consult (§5.70). |
| `atraf` | Cell E title | Indexes give just enough of each ḥadīth to call the rest to mind, then gather its chains: all of them, or only those in certain books (§5.70). |
| `asbab-al-hadith` | Cell F title | Knowing what prompted a ḥadīth. Abū Ḥafṣ al-ʿUkbarī, the shaykh of al-Qāḍī Abū Yaʿlā ibn al-Farrāʾ al-Ḥanbalī, wrote a book on it. Ibn Daqīq al-ʿĪd said some scholars of his time began writing on it, perhaps not knowing of that book (§5.71). |

**Extra** (Read as text only):

1. **The rest is in the fuller books** (after §5.71). Scholars have written books on most of the kinds touched on in this closing part. Ibn Ḥajar only introduced them by defining them, without their examples, since including them all would be hard; for their full reality, the reader should turn to the longer works.

### 8.5 Views

None.

### 8.6 Grid cells

A Sorter, B Musnad, C Chapters, D Hidden flaws, E Indexes, F Reasons. Desktop 2 × 3; portrait one column. Ids `cell-sorter` … `cell-asbab`.

### 8.7 Motion

- **D:** the chains draw up to the text (`m-draw`, `stagger`); the differing link blinks.
- **E:** the gathered chains enter one after another.
- **Reduced motion:** all shown. Base styles are the end state.

### 8.8 Kit parts

Reuses `Matn`, `Chip`, `Glyph` (`companion`, `lens`, `clock`, `book`), `Bracket`, `Arrow`, `TermTitle`, `XLink`. No new parts.

### 8.9 Translation slips

- **§5.71 "Ibn Daqīq al-ʿYd".** Spelling: al-ʿĪd, as in al-Mardūd's §5.24 row.

## 9. Division page

`divisions.yaml` is unchanged. The division page lists the six scenes under their moons through `scenesByMoon`.

## 10. Note lengths

Measured in Unicode code points after writing (`[...note].length`). All 33 caption notes and the three view notes are under the 400 working cap, so under the zod `max(420)`. The longest are `adab-al-shaykh-wa-al-talib` at 369 and `kunya` at 361, then `tabaqa` and `maratib-al-jarh` at 350; the shortest are `awtan` at 121 and `ikhwa` at 122. All six extras are under the 900 limit. The build's zod check is the final word.

## 11. New SVG kit parts

| Part | Props | Used in | Notes |
|---|---|---|---|
| `Glyph` + `pin` | as the other kinds | 1, 4, 5 | A map pin: a teardrop with a hole, for a place. Drawn, no text glyph (WCAG 2.5.3). |

Everything else is reused: `Narrator`, `Lifespan`, `SpeechBubble`, `Chip`, `Pill`, `Scale`, `Matn`, `Bracket`, `Arrow`, `ViewTag`, `XLink`, `TermTitle`, `Glyph` (`cross`, `check`, `lens`, `text`, `book`, `clock`, `companion`), `stepFill`, `vowelMark`, `letterDots`, `stagger`, `viewAttrs`.

## 12. Owner's annotations

The owner's PDF annotations on PDF pp.372–425. To be added to `notes/annotation-usage.md` for approval.

| Page | Annotation (short) | Use | Status |
|---|---|---|---|
| p.377 | Highlight on "dispute" (fīhi maqāl): the minimum level of criticism | Scene 2 puts fīhi maqāl at the mildest rank only | used (placement) |
| p.385 | The critic must be trustworthy, know ḥadīth and its hidden flaws, and know the rules of praise and criticism | Agrees with §5.64; scene 3's "knows the grounds" lens and the crossed-out critics | used (structure) |
| p.385 | One qualified critic is enough; a witness needs a judge, but here the critic is the judge | Agrees with §5.64; scene 3 panel 1's one critic beside the faint two witnesses. "The majority" is not taken; the site says "the most authentic opinion" | used (layout) |
| p.385 | "We are transmitting someone else's opinion on a person" | Agrees with §5.64; the last sentence of the `tadil` note | used (structure) |
| p.386 | Criticisms that might come from the ego | Agrees with §5.64's "corrupt motives"; scene 3 panel 2's first bullet | used (structure) |
| p.396 | Ibn Isḥāq is correct, but the kunya he is known by is Abū Isḥāq | Agrees with §5.65; scene 4 cell A's tick and cross | used (structure) |
| p.398 | Typos: Ayyūb, al-Farāhīdī, al-Ḥajjāj, no "ibn" in Yaḥyā ibn Abī Kathīr | Spellings in scene 4 and its extra; slips table §13 | used |
| p.398 | A shaykh has a student and a shaykh that share a name | Agrees with §5.65; scene 4 cell H | used (structure) |
| p.399 | "Western" means Maghribī | Scene 4's extra 3: "scholars of the Maghrib" | used |
| p.401–402 | A tribal nisba may come from alliance, freeing or accepting Islam through the tribe | Agrees with §5.65; scene 4 cell D's three ties | used (structure) |
| p.406, p.407 | "Understanding", "need" | Already approved-pending; the `tahammul` and `ada` notes | used |
| p.378 | The ranks run from the worst, about trustworthiness, to "weak", usually about accuracy or memory | A side label on scene 2's criticism wedge, "honesty → accuracy". The translation doesn't say it | proposed |
| p.378 | Highlight on "shaykh": means the ḥadīth is ḥasan | A sub-label on the shaykh rung. Beyond the translation | proposed |
| p.403 | Referring to the senior master is a sign of sincerity | A sub-label in scene 5 cell A | proposed |
| p.413 | Insertions go on the right so they aren't confused with the original | A reason line in scene 5 cell C. The translation gives no reason | proposed |
| p.414 | It used to be fashionable to have many shaykhs | A sub-label in scene 5 cell D | proposed |
| p.418 | Aṭrāf give the beginning and end of a ḥadīth, then the chains from the major books | "The beginning and end" goes beyond §5.70's "part of the ḥadīth"; a sub-label in scene 6 cell E | proposed |
| p.378 | The highest praise isn't mentioned here (amīr al-muʾminīn fī l-ḥadīth, "ask him about me") | Beyond the translation | not used |
| p.386 | The gharīb analogy for one critic | A teacher's reasoning | not used |
| p.386 | Mālik "deceived by his piety"; Ibn Ḥajar's standing, Zamzam | Beyond the translation | not used |
| p.397 | Not calling someone by a name he dislikes; the Arab custom of the grandfather's name | A teacher's reasoning | not used |
| p.399 | Books of the trustworthy and the untrustworthy; a shelf of rijāl volumes; the orientalist anecdote; "over-cooked" | The first agrees with §5.65 and needs no annotation; the rest are beyond it | not used |
| p.403 | Mālik's bath and perfume; ʿAmr ibn Dīnār; modern etiquette; three hundred repeaters | Beyond the translation | not used |
| p.406 | Most scholars say not under five; to transmit, trustworthy (after puberty) and Muslim | Beyond the translation | not used |
| p.418 | Comprehensive and fiqh-only books; al-Dāraquṭnī's twenty volumes from memory | Beyond the translation | not used |

## 13. Translation slips

To be added to `notes/translation-queries.md`. Pages are the PDF's (`=====PAGE` markers); the printed page is one less.

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.63 (p.377) | "ilayhi al-muntahā fī al-tathabbut (he is the last word in dependency)" | Tathabbut is firmness or precision. The site keeps `terms.yaml`'s "the last word in reliability". | |
| §5.63 (p.377–378) | "fīhi maqāl" among the mildest words and again with ḍaʿīf | One is likely misplaced; the owner's p.377 highlight reads it as the mildest. The site shows it there only. | |
| §5.63 (p.377) | "known … for his lewdness" | Fisq: the site says "open sin", as al-Mardūd does. | |
| §5.64 (p.386) | "The agent in this field" | Likely "the one who takes on this task". The site avoids "agent". | |
| §5.65 (p.396) | "his father is Bakar; and his shaykh is Anṣārī" | Likely "he is Bakrī, and his shaykh Anṣārī". Not used. | |
| §5.65 (p.398) | "Ibn Aḥmad ibn Abī Ṭabarānī" | The owner's highlight: ibn Ayyūb al-Ṭabarānī. | |
| §5.65 (p.398) | "Muslim ibn Ibrāhīm al-Farādīsī" | The owner's highlight: al-Farāhīdī. | |
| §5.65 (p.398) | "Muslim ibn al-Ḥujjāj" | The owner's highlight: al-Ḥajjāj. | |
| §5.65 (p.398) | "Yaḥyā ibn Abī Ibn Kathīr" | The owner's highlight: Yaḥyā ibn Abī Kathīr. | |
| §5.65 (p.398) | "the solitary names" | The books listed are lists of narrators, so likely al-asmāʾ al-mujarrada. The site says "books on the narrators". | |
| §5.65 (p.400) | Sandar, "the mawlā of Zinbāʿ al-Judhāmī, who has companionship and narrations" | Whose companionship? The Arabic likely gives it to Sandar. The site leaves it out until a ruling. | |
| §5.65 | "the nasab" | Here the nisba. The site says nisba. | |
| §5.67 (p.406) | "It is necessary to seek permission from the shaykh" | Likely "an ijāza from the one who makes them hear is needed". The site leaves it out until a ruling. | |
| §5.71 (p.422) | "Ibn Daqīq al-ʿYd" | Spelling: al-ʿĪd. | |

## 14. Term map (all 33)

| # | Term | Scene | Where |
|---|---|---|---|
| 1 | tabaqa | generations | Panel 1 title |
| 2 | mawalid-wa-wafayat | generations | Panel 2 title |
| 3 | awtan | generations | Panel 3 title |
| 4 | maratib-al-tadil | ranks | Cell A title |
| 5 | awthaq-al-nas | ranks | Cell A, rung 1 |
| 6 | thiqa | ranks | Cell A, rung 2 |
| 7 | shaykh | ranks | Cell A, rung 3 |
| 8 | maratib-al-jarh | ranks | Cell B title |
| 9 | layyin | ranks | Cell B, rung 1 |
| 10 | daif | ranks | Cell B, rung 2 |
| 11 | munkar-al-hadith | ranks | Cell B, rung 3 |
| 12 | kadhdhab | ranks | Cell B, rung 4 |
| 13 | akdhab-al-nas | ranks | Cell B, rung 5 |
| 14 | tadil | verdicts | Panel 1 title |
| 15 | jarh | verdicts | Panel 2 title |
| 16 | jarh-mufassar | verdicts | Panel 3 title |
| 17 | kunya | aliases | Cell A title |
| 18 | laqab | aliases | Cell B title |
| 19 | nisba | aliases | Cell C title |
| 20 | mawla | aliases | Cell D title |
| 21 | mufradat | aliases | Cell E title |
| 22 | ikhwa | aliases | Cell F title |
| 23 | adab-al-shaykh-wa-al-talib | study | Cell A title |
| 24 | tahammul | study | Cell B, left title |
| 25 | ada | study | Cell B, right title |
| 26 | kitabat-al-hadith | study | Cell C, left title |
| 27 | ard | study | Cell C, right title |
| 28 | rihla | study | Cell D title |
| 29 | masanid | books | Cell B title |
| 30 | abwab | books | Cell C title |
| 31 | ilal | books | Cell D title |
| 32 | atraf | books | Cell E title |
| 33 | asbab-al-hadith | books | Cell F title |

Counts: generations 3, ranks 10, verdicts 3, aliases 6, study 6, books 5: 33. Pending: 0. View-only: 0. No term is left unplaced.

## 15. Implementation outline

Conventions as the earlier phase 3 builds: `rtk`, bun only, one commit per scene (kit and schema changes go into the commit of the scene that first needs them), one-line subjects, no trailers, LF, never staging `source/`.

Tests follow the writing-tests rules (`~/.claude/skills/writing-tests/SKILL.md`) and al-Mardūd §16. Commit only tests of core logic, each behaviour once, through the mechanism that owns it. Don't commit tests that restate content or copy (labels, legend kinds, counts, scene order), exact timings, coordinates or delays, tests of a library or the platform, or one browser test per data item on the same code path. Each task's "Verify:" bullets are checks to run while building, by eye or with a throwaway spec deleted before the commit. The new scenes need no new tests to be covered:

- the build-time guards: `sceneErrors`, the panel guard in `Term.astro`, `XLink` and `viewAttrs`;
- `bun run test`: the motion CSS rule (finite keyframes are `from`-only) and the token contrast pairs in `src/lib/palette.ts`;
- `bun run test:dist`: S1 term targets, S2 view integrity, S3 links and hashes, S4 label in name;
- `bun run test:e2e`: the routes smoke (render, axe, text contrast, Labels-mode overlap, on every route and every `?view=`, both themes), V4 (no replayed load-in on a view or mode switch) and M5 (each scene moves, and rests under reduced motion where its motion ends).

No new logic is planned (the one kit addition, `Glyph pin`, is a drawing with no branches), so no new test is named. Add one only as the regression for a real bug found in the build, named in the test.

1. **`generations`:** `Generations` in the enum and `LEGEND`; `Glyph pin`; YAML (§3), 3 terms, one extra; `Generations.astro`, three panels. Verify: `?awtan` lands on panel 3 in portrait; reduced motion shows the cross drawn. Commit `scenes: add when-and-where generations scene`.
2. **`ranks`:** YAML (§4), 10 terms; `Ranks.astro`, two cells. Verify: portrait stacks praise over criticism; contrast on the darkest rung. Commit `scenes: add what-did-the-critics-call-him ranks`.
3. **`verdicts`:** YAML (§5), 3 terms, two extras, three views; `Verdicts.astro`, three panels. Verify: each view swaps its one panel; `?jarh-mufassar` from `?view=criticism-first` stays on it. Commit `scenes: add whose-verdict-counts scene`.
4. **`aliases`:** YAML (§6), 6 terms, three extras; `Aliases.astro`, eight cells. Verify: grid stacks in portrait; no Labels-mode overlaps. Commit `scenes: add what-is-he-called names grid`.
5. **`study`:** YAML (§7), 6 terms; `Study.astro`, four cells. Commit `scenes: add how-is-it-learned study scene`.
6. **`books`:** YAML (§8), 5 terms, one extra; `Books.astro`, six cells with in-page anchors. Commit `scenes: add what-kind-of-book scene`.
7. **Checks:** `bun run build`, `bun run test`, `bun run test:dist`, `bun run check`, and the e2e routes, views and motion specs with `--workers=1`, narrowed to these scenes. Fix what they find in the scene or the shared mechanism, not with a per-scene test. A new coloured-text pair goes into `src/lib/palette.ts`.
8. **Spec and notes:** spec §4.3 gains a division 8 table; `notes/translation-queries.md` gains §13; `notes/annotation-usage.md` gains §12's "used" rows and its "proposed" rows under Proposals. Commit `docs: update spec and notes for marifat-al-ruwat`.

## 16. Open questions for the owner

Each has options, a recommendation and the interim choice the build uses. The same questions, with small sketches, are in `2026-10-29-phase-3-ruwat-review.json`.

1. **The claim in panel 2 of *When and where did he live?*.** (a) A speech bubble "I met him", labelled as an illustration (recommended); (b) no bubble, just the label "claims to have met him". Interim: a.
2. **Ibn Ḥibbān and Ibn Saʿd.** (a) Side by side in panel 1, since Ibn Ḥajar prefers neither (recommended); (b) an Other views switch between the two groupings. Interim: a.
3. **fīhi maqāl.** (a) At the mildest rank only, as the owner's p.377 note reads it (recommended); (b) at both places the translation lists it, with a "?". Interim: a.
4. **Figures on the rungs.** (a) The reliable, weak and liar figures beside thiqa, ḍaʿīf and kadhdhāb, the three words spec §3.2 names (recommended); (b) words only. Interim: a.
5. **Honesty to accuracy (p.378).** (a) No side label until approved (recommended); (b) a label down the criticism wedge, "honesty → accuracy". Interim: a.
6. **Views on *Whose verdict counts?*.** (a) Three views: Ibn Ḥajar, two critics, criticism always first, with Ibn al-Ṣalāḥ's pause as a tag (recommended); (b) no views, the rivals told in Read as text. Interim: a.
7. **Eight cells on *What is he called?*.** (a) Six term cells plus "Whose son?" and "One name up the chain" (recommended); (b) six term cells, the other cases in Read as text. Interim: a.
8. **Sandar's companionship.** (a) Leave it out until a ruling (recommended); (b) say Sandar was a Companion, as the Arabic likely has it, and draw his chip gold-edged. Interim: a.
9. **Paired cells on *How is it learned and taught?*.** (a) Four cells, receiving with delivering and writing with checking (recommended); (b) six cells, one per term. Interim: a.
10. **The children's ijāza (§5.67).** (a) Leave it out until a ruling (recommended); (b) say an ijāza from the shaykh is needed, linking to *How was it received?*. Interim: a.
11. **The sorter on *What kind of book is it?*.** (a) A sorter cell first (recommended); (b) no sorter: five cells and a closing-note cell. Interim: a.
12. **Overview scene.** (a) No overview; the six scenes in the book's order (recommended); (b) an overview hub first, like *Why is a report rejected?*. Interim: a.
13. **Proposed annotations.** p.378 (twice), p.403, p.413, p.414, p.418. (a) Keep them out until approved (recommended); (b) approve some, named. Interim: a.
14. **Translation slips.** Please rule on the fourteen rows of §13; (a) the site follows the wording given there meanwhile (recommended). Interim: a.
15. **The faded rows of *Who is who?* (division 7).** The ruled-out rows in "Which one is he?" rest at 12% opacity, about 1.3:1 contrast. (a) Keep them faint as decoration, since the names are in the caption; (b) raise them to about 4.5:1, so they read as clearly muted. Interim: a (no change to Names now).

## 17. Interim decisions for the build

The owner asked for development to continue during review, so the interim options above apply. Each can be reversed after a ruling; the review JSON marks the scenes built with one.

- **Scenes:** six, as designed; no overview.
- **Order:** the book's.
- **Views:** only `verdicts` (three). Swaps may be instant.
- **Ranks:** no ordinals, no counts; dashed "further ranks between" rungs where the book says so; fīhi maqāl at the mildest only.
- **Arabic:** term names only. The critics' other words are transliterated.
- **Illustrations:** cells and panels without a book example say "an illustration: the book names no example".
- **Generation colours:** gold only where the translation says Companion; no green.
- **Links to unbuilt divisions:** plain text.
- **Owner's annotations:** only "used" rows. **Translation slips:** all go to `notes/translation-queries.md`.
- **Names (division 7):** unchanged.

### Deviations in the build

All six scenes are built on `design-ruwat` with the interim options above. They follow this design except as below; none changes a ruling or adds content beyond the translation.

- **`generations`:** the three titles are 15px sub-titles with the Arabic centred under them, and the scene is 460 tall. Panel 1's columns are 14..104 and 118..250, with each band's label at its top left and Anas ibn Mālik on the right edge of the first two bands, tied to his name chip. Panel 1 ends in plain text; only panel 2 links to *Did he hear it from him?*. Panel 2's bubble is labelled "an illustration: the book quotes no claim".
- **`ranks`:** the rung fills step from 26% to 6% of gold (praise) or the gap colour (criticism), so `--fg` text keeps its contrast; the Arabic names sit after each rung's (i). The superlative tags are dashed chips at the rung's top right. Cell A ends with the three states and "at both ends of the scale the words are superlatives".
- **`verdicts`:** each panel title has its Arabic under it, and the scene is 490 tall. The seal is drawn by laying a reliable (panel 1) or weak (panel 2) figure over the first one as it enters. Panel 1's pill and tag, and panel 3's second scale, are view groups; the groups the `two` and `criticism-first` views leave alone are shared with the default (`data-view-show="ibn-hajar criticism-first"` and `"ibn-hajar two"`). The scales inside view groups have no tip animation, so a switch replays nothing.
- **`aliases`:** cells are 430 × 320, with each term's Arabic under its title. Cell B shows al-Aʿmash without a gloss (the translation gives none). Cell C links to *Who is who?*; cell B to *Why is he unknown?*. Cells G and H have plain titles and are `role="img"`, as the Names worked example is.
- **`study`:** cells are 430 × 340, with all six titles at 20px and their Arabic under them. Cell B's child, register and tick stand for "attendance recorded".
- **`books`:** the sorter is titled "How is it arranged?". Cell F carries no "illustration" line, since its scholars are the book's own.
