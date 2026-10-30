# Phase 3, division 4 (Muntahā al-isnād): scene design

Date: 2026-10-29
Status: design for owner review. The scenes are built on `design-muntaha` with the interim decisions of §13, as the owner asked; each interim can be swapped once the owner rules (`docs/superpowers/specs/2026-10-29-phase-3-muntaha-review.json`).
Spec: `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Section numbers like spec §3.2 refer to it; bare § numbers (§5.41) refer to the book. "The al-Mardūd design" is `docs/superpowers/specs/2026-10-28-phase-3-mardud-design.md`, "the al-Maqbūl design" `docs/superpowers/specs/2026-10-28-phase-3-maqbul-design.md`. This doc follows their structure and their interim rules (al-Maqbūl §13, al-Mardūd §18).

## 0. Summary

Division 4 has no scenes yet. Its **9 terms** get **four scenes**. All 9 terms land on a scene, and none stay pending.

| # | Scene | Path | Moons | Form | Terms | Views | Mobile |
|---|---|---|---|---|---|---|---|
| 1 | Where does the chain end? | `/muntaha-al-isnad/ends/` | 0, 1, 2 | Three chains side by side, each ending at a different person (the Prophet ﷺ, a Companion, a Successor), its text card hanging from that person; a bracket joins the last two as athar | 4 | none | 2 panels |
| 2 | Is it from the Prophet ﷺ? | `/muntaha-al-isnad/raised/` | 0 | Two cells: a table of sayings, acts and approvals, said outright or implied, and a column of set phrases that point to him | 1 | `most`, `not-raised` | grid |
| 3 | Who met whom? | `/muntaha-al-isnad/companions/` | 1, 2 | Four panels: the Companion's definition as a path of gates, how Companionship is known, the Successor's gates, and the mukhaḍram between two eras | 3 | `ibn-hajar`, `among-companions` | 4 panels |
| 4 | Does it look connected? | `/muntaha-al-isnad/connected/` | 3 | Five chains, each with a verdict: connected; a hidden gap; a Successor raising it; a lower narrator raising it; connected but stopping at a Companion | 1 | `ibn-hajar`, `khatib`, `ibn-abd-al-barr` | 3 panels |

Every scene uses the book's own examples where the translation gives one:

- Ibn Umm Maktūm, the blind Companion, and al-Ashʿath ibn Qays, who left Islam and returned (§5.41);
- al-Najāshī, a mukhaḍram who became Muslim in the Prophet's ﷺ lifetime (§5.42);
- al-Shāfiʿī on ʿAlī's eclipse prayer, Jābir and Abū Saʿīd on a practice of the time of revelation, ʿAmmār on the day of doubt, and Abū Qilāba from Anas (§5.40);
- Sālim ibn ʿAbd Allāh's answer to Ibn Shihāb on what "sunna" means (§5.40).

### Content rules followed

These are the rules of the phase 2 plan, the al-Maqbūl design's §13 and the al-Mardūd design's §0 and §18.

- Every note paraphrases the *translation* paragraphs of §5.40–5.44 only: the headings `5. 40.` to `5.44.` in `source/nuzhah.txt`, each read up to its `Commentary` line.
- No footnote and no commentary was used. In particular: footnotes 170 (the two ʿUmars), 178–186 (Abū Jahl, the named apostates, Baḥīrā, the Qurʾan verses for Abū Bakr and Zayd), 195–196 (al-Najāshī's funeral prayer) and 199; and the commentary sections §5.40.1, §5.41.1, §5.42.1–5.42.2 and §5.44.1.
- **No Arabic report wording anywhere.** Term names keep their Arabic from `terms.yaml`. The indirect words of §5.40 (yarfaʿuhu and the rest) appear in transliteration only, as ʿan and qāla did in `hidden`.
- English words of a report appear only as short phrase forms the translation names as forms ("from the sunna is…", "we were ordered…", "we used to…"). Every worked example is paraphrased, with no quotation marks (open question 6).
- **No numbers on gauges.** The ranks of Companions (§5.41) are shown by bar length only, labelled as an illustration.
- **No Other views that aren't in the translation.** The three scenes with views use rival opinions the translation reports.
- Notes fit `note: z.string().max(420)`, with a working cap of 400 characters (§6).

## 1. Shared decisions

- **Division id:** `muntaha-al-isnad`. Scene ids `ends`, `raised`, `companions`, `connected`. None equals a term slug, so a bare `?musnad` still means the term.
- **Order:** `ends` 1 (the overview of §5.40–5.43), `raised` 2 (§5.40), `companions` 3 (§5.41–5.42), `connected` 4 (§5.44). After the overview this is the book's order.
- **Moons:** `ends` `[0, 1, 2]`, `raised` `[0]`, `companions` `[1, 2]` (the Companion defines mawqūf, the Successor maqṭūʿ), `connected` `[3]`. The moon labels in `divisions.yaml` are unchanged.
- **New `diagram` enum values:** `Ends`, `Raised`, `Companions`, `Connected`.
- **Figures:** the existing kinds only. No new `figures.ts` kind.
- **Generation colours:** Ibn Umm Maktūm and al-Ashʿath are gold (the translation calls them Companions); al-Najāshī is green (Ibn Ḥajar counts the mukhaḍramūn as senior Successors).
- **Legend:** the scene page's `LEGEND` map gains `Ends: ["moon", "sahabi", "tabii", "later", "ghost"]`, `Raised: ["moon", "sahabi"]`, `Companions: ["moon", "sahabi", "tabii"]`, `Connected: ["moon", "sahabi", "tabii", "later", "mudallis", "ghost"]`.
- **Terms file:** each of the 9 terms gets `scene:`. No term is view-only.
- **Term names used as plain labels.** isnād and matn (`report`), munqaṭiʿ, mursal, muʿḍal and muʿallaq (`breaks`), mudallas and mursal khafī (`hidden`) appear as plain text or `XLink`s, never triggers.
- **Where a chain ends** is drawn the way `report` draws it: the text card hangs from the person whose words they are, and the chain flows down from him. The person at the end carries a soft gold halo (the `lone` halo style) so the eye finds the end at once.

## 2. Scene 1: Where does the chain end? (`ends`)

### 2.1 Header

```yaml
- id: ends
  division: muntaha-al-isnad
  moons: [0, 1, 2]
  order: 1
  title: Where does the chain end?
  eyebrow: Where the chain ends, and the names it gives · §5.40–5.43
  lede: A chain leads to the words of a report, and the report is named by whose words they are. If they are the Prophet's ﷺ, it is raised; if a Companion's, stopped; if a Successor's or someone later's, cut off. The names say where the words stop, not whether the chain is whole.
  source: §5.40 Marfūʿ, §5.41 Mawqūf, §5.42 Maqṭūʿ, §5.43 The names, and athar
  diagram: Ends
  width: 780
```

### 2.2 Form, and why it suits the idea

§5.40–5.43 ask one question, *whose words are these?*, with three answers. Three chains side by side, rows lined up by generation, show the answers at a glance: the chain's top sits on the moon row, the Companion row or the Successor row. Each top figure holds the text card.

Two points sit under the chains:

- **Connected or not** (§5.43): the marfūʿ chain has a ghost in it, and is still marfūʿ. The ending names the matn, not the chain.
- **Maqṭūʿ is not munqaṭiʿ** (§5.43): one names where the words stop, the other a break, with a link to *Where does the chain break?*.

A bracket under the last two chains names them both athar.

### 2.3 Sketch (780 × 540)

```
x→ 0       130      260│ 300     390      520      650     780
 30 │   Marfūʿ (i)        │     Mawqūf (i)       Maqṭūʿ (i)
 48 │     raised          │      stopped          cut off
 64 │ ┌ his words, acts ┐ │  ┌ the Companion's ┐ ┌ the Successor's ┐   Matn cards
 96 │ └ or approval     ┘ │  └ own            ┘ └ or a later one's┘
150 │      (ﷺ)○halo       │   · not raised ·     · not raised ·
210 │      [C]            │      [C]○halo        · no Companion ·
270 │     ┆ghost┆         │      [S]              [S]○halo
330 │      [N]            │      [N]              [N]
390 │    [collector]      │   [collector]       [collector]
430 │ raised, whether its │   └──────── Athar (i) ────────┘   bracket, ticks up
446 │ chain is connected  │         both are called athar
462 │ or not              │
496 │                     │  maqṭūʿ: where the words stop (the matn)
512 │                     │  munqaṭiʿ: a break in the chain → Where does the chain break?
```

- **Columns** at x = 130, 390 and 650. Rows: moon 150, Companion 210, Successor 270, later 330, collector chip 390. Figures k=0.75 (`Narrator`), arrows `flow` down, the ghost jumped by a `skip` arrow, as in `breaks`.
- **Text cards:** `Matn` 200 wide, 64..112, joined to the top figure by a short gold line.
- **Halo:** a soft gold disc behind the top figure (moon, Companion, Successor), the `lone` halo.
- **Empty rows:** above the top figure of columns 2 and 3, the moon row (and the Companion row in column 3) hold a small `.lbl` "not raised" / "no Companion above", so rows stay comparable.
- **Athar:** a horizontal `Bracket` from x 330 to 710 at y 422, ticks up; its trigger at (520, 450), centred in panel 2.
- **Footer:** at y 496–512 in panel 2, the maqṭūʿ/munqaṭiʿ contrast, the second line an `XLink` to `al-mardud/breaks#munqati`.

### 2.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `marfu` | Column 1 title, (≈95..185, y 12–40) | A report whose chain ends at the Prophet ﷺ: his sayings, his acts or his silent approval, whether the wording says so outright or only implies it. It is marfūʿ whether its chain is connected or not, and whether the Companion heard it from him or through someone. The isnād is the path to the matn, and the matn the words where it ends (§5.40, §5.43). |
| `mawquf` | Column 2 title, (≈350..440, y 12–40) | A report whose chain ends at a Companion: his own sayings, acts or silent approval, known from the wording much as for the Prophet ﷺ, though not every form carries over. Said bare, mawqūf means stopped at a Companion; for someone later one may say it is mawqūf on him, naming him (§5.41, §5.43). |
| `maqtu` | Column 3 title, (≈610..700, y 12–40) | A report whose chain ends at a Successor, or at someone after him, such as the Followers of the Successors and those later still; the name is the same for all of them. It describes the matn, where the words stop. Munqaṭiʿ describes the isnād, a break in it; some scholars used one for the other, against correct usage (§5.43). |
| `athar` | Under the bracket, (≈480..565, y 434–458) | The last two kinds, the mawqūf and the maqṭūʿ, share a further name: athar. A report stopped at a Companion and one cut off at a Successor or later are both called athar (§5.43). |

### 2.5 Views

None. §5.43's "some used one for the other" is a naming habit Ibn Ḥajar calls wrong, not a rival ruling; it is a phrase in the `maqtu` note.

### 2.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `raised` | Raised | 0 | 260 |
| `stopped` | Stopped and cut off | 260 | 780 |

Panel 2 is wider so the athar bracket and its trigger sit in one panel; the carousel sizes its track to the widest panel (spec §5).

### 2.7 Motion

- The chain arrows `flow` down; the ghost blinks.
- The halos fade in (`m-enter`) one after another, left to right (`stagger`, 0.3s apart, once).
- Reduced motion: halos shown, ghost still. Base styles are the end state.

### 2.8 Kit parts

Reuses `Moon`, `Narrator`, `Arrow` (`flow`, `skip`), `Chip`, `Matn`, `Bracket`, `TermTitle`, `XLink`, `titleTrigger`, `SUBT_TRIGGER`. The halo is scene-local, as in `lone`.

### 2.9 Translation slips

- **§5.40 "the matn is the dialogue at which the isnād terminates".** "Dialogue" likely renders kalām, the words or speech. The site says "the words".

## 3. Scene 2: Is it from the Prophet ﷺ? (`raised`)

### 3.1 Header

```yaml
- id: raised
  division: muntaha-al-isnad
  moons: [0]
  order: 2
  title: Is it from the Prophet ﷺ?
  eyebrow: Raised to the Prophet ﷺ, outright or by implication · §5.40
  lede: A report is raised when its words are from the Prophet ﷺ, his sayings, acts or approval. The Companion may say so outright, or say something that can only have come from him. Ibn Ḥajar gives the forms that count, and answers those who doubt some of them.
  source: §5.40 Marfūʿ, outright and implied
  diagram: Raised
  width: 860
```

### 3.2 Form, and why it suits the idea

§5.40 is built as a table: three things that can be raised (his sayings, acts, silent approval), each in two ways (outright, *taṣrīḥ*, or implied, *ḥukm*). So cell A is a **2 × 3 table**. Each row has the moon at its left; an outright cell joins the Companion to the moon with a solid gold arrow, an implied cell with a dashed gold one (the new `implied` arrow, §7). Each cell has one line of the book's example.

Cell B is a **column of phrase cards**, the set forms of §5.40 that count as raised: "from the sunna is…", "we were ordered…", "we used to…", calling an act obedience or disobedience, the indirect words, and the speaker left out. Each card has a dashed gold arrow up to a moon at the top. The two disputed forms carry the scene's view.

The two ideas don't share a layout, so this is a **grid of two cells** (the `report` pattern), each `<svg viewBox="0 0 430 560">`. Cell A holds `<Defs/>`.

### 3.3 Sketches (each cell 430 × 560)

Cell A, "Sayings, acts, approval":

```
x→ 0  40    110          250          390 430
 30 │      Marfūʿ ḥukman (i)  مَرْفُوعٌ حُكْمًا
 52 │   said outright, or counted as his
 82 │              SAID OUTRIGHT    IMPLIED
110 │ (ﷺ) HIS     [C]─solid→ "I heard  [C]┄dashed┄ news of the unseen,
    │     SAYINGS  him say…"            of a set reward or punishment
200 │ (ﷺ) HIS     [C] "I saw him do…"  [C]┄ ʿAlī's eclipse prayer:
    │     ACTS                            more than one bowing (al-Shāfiʿī)
290 │ (ﷺ) HIS     [C] "I did it in his [C]┄ "we used to…", in his time:
    │     APPROVAL presence"               Jābir and Abū Saʿīd
380 │ ONLY IF IMPLIED:
400 │ [not from biblical reports] [not open to reasoning] [not a word's meaning]
440 │ someone told him, and only the Prophet ﷺ could have
470 │ heard from him, or through someone: raised either way
```

- Rows at y 110, 200, 290; the moon at x=40, k=0.4; Companion figures k=0.55 at x 120 and 260.
- Cell text is `.lbl`, two lines at most, the quoted forms only as short fragments.
- The three condition `Chip`s at y=400 (the owner's p.280 note agrees, §8).

Cell B, "Words that point to him":

```
x→ 0       215                       430
 30 │        SET PHRASES                     (.colhead)
 60 │           ( ﷺ )                        moon, k .5
    │   ┆   ┆   ┆   ┆   ┆   ┆                dashed gold arrows up
120 │ ┌ "from the sunna is…" ┐  [view tag]
170 │ ┌ "we were ordered…" / "forbidden…" ┐  [view tag]
220 │ ┌ "we used to…" ┐
270 │ ┌ obedience or disobedience of Allah and His Messenger ┐  ʿAmmār, the day of doubt
320 │ ┌ yarfaʿuhu · yarwīhi · yanmīhi · yablughu bihi · riwāyatan ┐
370 │ ┌ the speaker left out ┐ Ibn Sīrīn from Abū Hurayra: Baṣra usage
430 │ why not say "the Prophet ﷺ said"? piety and caution:
446 │ Abū Qilāba could have said Anas raised it
```

- Six cards, `Matn`-style plain rects, x 24..406.
- Under `most` the first two cards carry `ViewTag` "raised" (solid); under `not-raised` the tag reads "could be someone else's" (dashed) and their arrows turn to `Arrow elided`.

### 3.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `marfu-hukmi` | Cell A title, (≈95..300, y 8–38) | A Companion who does not take from the biblical reports says what reasoning can't reach and no word's meaning explains: past events like creation and the prophets, future ones like the trials and the Day of Judgement, or a deed's set reward or punishment. Someone must have told him, and only the Prophet ﷺ could have, so it counts as if he said "the Messenger of Allah ﷺ said" (§5.40). |

**Extra** (Read as text only):

1. **The book's examples** (§5.40). Outright: the Companion says he heard the Messenger of Allah ﷺ say something, saw him do it, or did it in his presence without objection. Implied, of an act: al-Shāfiʿī on ʿAlī's eclipse prayer with more than one bowing in each unit, which he could not have reached by his own thinking. Implied, of approval: the Companions say they used to do something in his time; Jābir and Abū Saʿīd argued that a practice was allowed because they did it while the Qurʾan was being revealed, and it would have forbidden it. Of a ruling: ʿAmmār called fasting the day of doubt disobedience to Abū al-Qāsim ﷺ.
2. **Words that point to him** (§5.40). A Successor may say of a Companion that he raises the ḥadīth, narrates it, ascribes it or makes it reach the Prophet ﷺ (yarfaʿuhu, yarwīhi, yanmīhi, yablughu bihi, riwāyatan). Sometimes the speaker is left out altogether, as in Ibn Sīrīn's reports from Abū Hurayra; al-Khaṭīb suggests this was the usage of Baṣra. Why not name him? From piety and caution: Abū Qilāba said he could have said that Anas raised his report, but it is better to keep the Companion's own words.

### 3.5 Views

| id | Label | Scholars | Note |
|---|---|---|---|
| `most` | Ibn Ḥajar and most: raised | §5.40; Ibn ʿAbd al-Barr reports a consensus | When a Companion says "from the sunna is…", or "we were ordered" or "forbidden", it counts as raised. The sunna meant is the Prophet's ﷺ, as Sālim told Ibn Shihāb; one under a leader who says "I was ordered" means by the leader. Ibn Ḥajar calls the claim of consensus contentious, since al-Shāfiʿī has two opinions. |
| `not-raised` | Some: not raised | Abū Bakr al-Ṣayrafī, Abū Bakr al-Rāzī, Ibn Ḥazm; a group, on "we were ordered", §5.40 | Sunna is said of others besides the Prophet ﷺ, so "from the sunna" need not mean his; an order could be the Qurʾan's, the consensus's, a caliph's or a derived ruling's. Ibn Ḥajar answers that these readings are far-fetched, or only possibilities, and the Companions were sure before they spoke. |

### 3.6 Grid cells

1 Sayings, acts, approval (A); 2 Set phrases (B).

### 3.7 Motion

- The implied arrows' dashes `flow` up slowly (the existing `flow` keyframe, which loops); the solid ones are still.
- Cell B's cards come in one after another (`m-enter`, `stagger` 0.15s, once).
- Reduced motion: everything shown, nothing flowing.

### 3.8 Kit parts

Reuses `Moon`, `Narrator`, `Chip`, `ViewTag`, `TermTitle`, `titleTrigger`, `viewAttrs`, `.cells`. New: `Arrow variant="implied"` (§7).

### 3.9 Translation slips

- **§5.40 "has no reference to an ambiguous word or commentary of a rare word".** Likely "has no bearing on explaining a word or a rare term". The site says "not explaining a word's meaning".
- **§5.40 "Amongst the possible words [of delivery]".** Likely "among the forms that may carry it". The site says "set phrases".

## 4. Scene 3: Who met whom? (`companions`)

### 4.1 Header

```yaml
- id: companions
  division: muntaha-al-isnad
  moons: [1, 2]
  order: 3
  title: Who met whom?
  eyebrow: The Companion, the Successor and those between · §5.41–5.42
  lede: A chain may stop at a Companion or a Successor, so Ibn Ḥajar defines both. A Companion met the Prophet ﷺ believing in him and died a Muslim; a Successor met a Companion in the same way. Those who lived before Islam and into it without seeing him are counted with the senior Successors.
  source: §5.41 The Companions, §5.42 The Successors and the mukhaḍramūn
  diagram: Companions
  width: 1040
```

### 4.2 Form, and why it suits the idea

Ibn Ḥajar builds the Companion's definition as a genus and three differentiae (§5.41), so it is drawn as a **path of gates**: four `Decision` diamonds down the panel, each "no" turning aside to a crossed card. Panel 3 runs the same gates for the Successor, with the "in him" gate struck out, so the two are compared by eye.

Panel 2 answers *how is it known*, and holds the two notes of §5.41. Panel 4 places the mukhaḍram between two eras: lifespan bars over a "before Islam | Islam" band, and his figure standing at the top of the Successors' row. The Other view moves the figure up into the Companions' row.

### 4.3 Sketch (1040 × 560)

```
x→ 0      130     260│ 390            520│ 650           780│ 910          1040
 30 │  Ṣaḥābī (i)       │ HOW IT IS KNOWN  │  Tābiʿī (i)       │ Mukhaḍram (i)
 52 │                   │                  │                   │ ▒before Islam▒│ Islam
 70 │    (ﷺ)            │ [mutawātir]      │    [C]            │      ═══(ﷺ)═══ moon bar
100 │  ◇ met him? ──no→✕│ [widely known]   │  ◇ met him? ─no→✕ │ ════════════ his bar
    │  (met, not saw:   │ [a Companion     │                   │   ? never saw him
    │   Ibn Umm Maktūm) │  says so]        │                   │
170 │  ◇ believing? ─no→✕ [a reliable     │  ◇ believing in   │ COMPANIONS ┄┄┄┄┄┄┄
    │                   │  Successor]      │    the Prophet?   │
240 │  ◇ in him? ──no→✕ │ [his own claim, │  ◇ in him? struck │ SUCCESSORS ┄┄┄┄┄┄┄
    │  ? before his     │  if plausible]   │   (only for him ﷺ)│    [S] senior
    │   mission: disputed  some: study it  │                   │ e.g. al-Najāshī
310 │  ◇ died a Muslim? ─no→✕             │  ◇ died a Muslim? │
380 │      [C] Ṣaḥābī   │ NOT ALL EQUAL    │      [S] Tābiʿī   │ Abū ʿUthmān, Qays:
    │  even if he left  │ ▬▬▬▬▬▬▬ long     │ not required:     │ irsāl from him →
    │  Islam between:   │ ▬▬ brief         │ ✕[long company]   │ Did he hear it…?
    │  al-Ashʿath       │ all share honour │ ✕[a sound hearing]│
470 │                   │ (ﷺ)┄skip┄[C]     │                   │
    │                   │ mursal in narration →                │
```

- **Panel 1:** moon at (130,70), k=0.45. Diamonds 110×40 at (110, 110 / 175 / 240 / 305); "no" arrows right to small crossed cards at x 190..252 ("never met", "a disbeliever", "another prophet's follower", "died out of Islam"). Under gate 1, `.lbl` "met, not saw: the blind, like Ibn Umm Maktūm". By gate 3, a `?` and "met before his mission: disputed". The Companion figure at (110,380), k=0.8, and "even if he left Islam in between: al-Ashʿath ibn Qays".
- **Panel 2:** five `Chip`s in a column (the fifth dashed, with "some scholars ask for study"); two `Lifespan` bars (an illustration of long and brief company, no axis); a mini chain moon → Companion by `skip` arrow, with the `XLink` "mursal in narration" to `al-mardud/breaks#mursal`.
- **Panel 3:** a Companion figure at the top instead of the moon; the same diamonds, the third drawn dashed with a strike and "faith in the Companion is not asked"; two dashed `Chip`s with `Glyph cross` for the conditions others add.
- **Panel 4:** two era bands (rects, `--rule` tint) with labels; a moon-tone `Lifespan` for the Prophet ﷺ starting at the boundary, and the mukhaḍram's bar spanning both bands, with a blinking "?". Two row bands labelled COMPANIONS and SUCCESSORS. The mukhaḍram figure (green, k=0.8) sits at the head of the Successors' row; under `among-companions` it moves into the Companions' row (`viewAttrs` transform). A `Chip` "al-Najāshī: Muslim in his time". An `XLink` to `al-mardud/hidden` ("Abū ʿUthmān and Qays: irsāl from him").

### 4.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `sahabi` | Panel 1 title, (≈85..190, y 12–40) | One who met the Prophet ﷺ believing in him and died a Muslim, even if he left Islam in between, on the most correct opinion. Meeting is wider than sitting or walking with him, even without words; Ibn Ḥajar says met, not saw, so blind Companions like Ibn Umm Maktūm count. Rank differs with length of company, but all share the honour (§5.41). |
| `tabii` | Panel 3 title, (≈605..700, y 12–40) | One who met a Companion on the same terms: believing in the Prophet ﷺ and dying a Muslim. Only faith in the Companion is not asked, since that belongs to the Prophet ﷺ alone. This is the chosen opinion, against those who add long company with the Companion, a sound hearing from him, or a further condition (§5.42). |
| `mukhadram` | Panel 4 title, (≈855..985, y 12–40) | Those who lived before Islam and into it but never saw the Prophet ﷺ. Whether they are Companions or Successors is disputed. Ibn ʿAbd al-Barr seemed to count them as Companions, but said he listed them to cover the whole first generation. The correct opinion makes them the senior Successors, whether or not one became Muslim in his lifetime, like al-Najāshī (§5.42). |

**Extra** (Read as text only):

1. **The definition, part by part** (§5.41). Meeting is the genus. "Believing" leaves out those who met him as disbelievers; "in him" those who believed only in an earlier prophet; "died a Muslim" those who left Islam after meeting him and died so, like Ibn Khaṭal. Whether one who met him believing before his mission, knowing he would be sent, and died before it, counts is disputed. al-Ashʿath ibn Qays left Islam, was brought to Abū Bakr a prisoner, returned to Islam and married his sister; no one denied him Companionship or left his ḥadīth out of the musnads.
2. **How Companionship is known** (§5.41). By mutawātir report, by its being widely known, by another Companion or a reliable Successor saying so, or by his own claim when it is plausible; a group of ḥadīth scholars hesitate over the last, since it is like a man saying "I am reliable".
3. **Two notes** (§5.41). One who kept long company with him, fought beside him or died under his command ranks above one who met him briefly or saw him as a child, though all share the honour. A Companion who did not hear from him narrates mursal, though he is a Companion.
4. **The Night of Ascension** (§5.42). If it were proven that all the people of the earth were shown to him on that night, the mukhaḍramūn would count among those who believed in him in his lifetime, since he saw them.

### 4.5 Views

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: senior Successors | §5.42, the correct opinion | The mukhaḍramūn are the senior Successors, whether or not one of them is known to have become Muslim in the Prophet's ﷺ lifetime, like al-Najāshī. |
| `among-companions` | Some: among the Companions | ʿIyāḍ and others, of Ibn ʿAbd al-Barr, §5.42 | Ibn ʿAbd al-Barr seemed to place them among the Companions, and ʿIyāḍ and others said he did so outright. Ibn Ḥajar doubts it: Ibn ʿAbd al-Barr said in his introduction that he named them to cover all who lived in the first generation. |

### 4.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `companion` | The Companion | 0 | 260 |
| `known` | How it is known | 260 | 520 |
| `successor` | The Successor | 520 | 780 |
| `mukhadram` | Between two eras | 780 | 1040 |

### 4.7 Motion

- The gates' "no" arrows draw in (`m-draw`), gate by gate (`stagger`, 0.25s, once); the "?"s blink.
- The view switch slides the mukhaḍram figure between rows (a `transform` transition through `viewAttrs`).
- Reduced motion: everything drawn, nothing blinking, the switch instant.

### 4.8 Kit parts

Reuses `Moon`, `Narrator`, `Decision`, `Arrow`, `Chip`, `Glyph cross`, `Lifespan` (with `tone="moon"`), `ViewTag`, `TermTitle`, `XLink`, `viewAttrs`. No new parts.

### 4.9 Translation slips

- **§5.41 "ʿAbd Allāh ibn Jaḥsh"** as one who left Islam and died out of it. The one usually named is ʿUbayd Allāh ibn Jaḥsh, his brother. The site names only Ibn Khaṭal until a ruling (open question 2).
- **§5.42 "the condition of acknowledgement".** Possibly tamyīz, discernment. The site says "a further condition" until a ruling (open question 4).
- **§5.41 "the dispersed and famous nature of this fact".** Likely istifāḍa and shuhra. The site says "widely known".

## 5. Scene 4: Does it look connected? (`connected`)

### 5.1 Header

```yaml
- id: connected
  division: muntaha-al-isnad
  moons: [3]
  order: 4
  title: Does it look connected?
  eyebrow: The musnad report · §5.44
  lede: When a ḥadīth master calls a report musnad, he means a Companion raised it to the Prophet ﷺ through a chain that looks connected. A hidden gap doesn't stop it being musnad; a gap that shows, or a chain that stops short of him, does. Two other scholars used the word differently.
  source: §5.44 Musnad
  diagram: Connected
  width: 860
```

### 5.2 Form, and why it suits the idea

Ibn Ḥajar defines musnad as a genus (marfūʿ) and two differentiae (through a Companion; visibly connected) and then tests each against a case (§5.44). So the scene is **five chains with verdict pills**, grouped in three panels the way the owner's p.314 note groups them: chains that look connected, chains whose gap shows, and a chain that stops at a Companion. The views change only the pills.

### 5.3 Sketch (860 × 520)

```
x→ 0    86        258   │344  430        602  │688   774      860
 30 │ Musnad (i) مُسْنَدٌ   │ A GAP SHOWS        │ STOPS AT A
 50 │ LOOKS CONNECTED       │                    │ COMPANION
 90 │  (ﷺ)      (ﷺ)         │  (ﷺ)       (ﷺ)     │  · not raised ·
150 │  [C]      [C]         │ ┆ghost┆    ┆ghost┆  │   [C]
210 │  [S]      [S]         │  [S]       ┆ghost┆  │   [S]
270 │  [N]     [✋]ʿan…     │  [N]        [N]    │   [N]
    │          ┆faint ghost┆│                    │
330 │ [coll.]  [coll.]      │ [coll.]    [coll.] │  [coll.]
380 │ (musnad)  (musnad)    │ (mursal)   (muʿḍal or (mawqūf)
    │                       │            muʿallaq)│
410 │ connected  a hidden   │ a Successor  raised │ connected, but
    │            gap: still │ raises it    from    │ not raised
    │            musnad →   │ → breaks     below → │
470 │ al-Ḥākim agrees       │                    │
```

- Columns at 86, 258, 430, 602 and 774; rows moon 90, Companion 150, Successor 210, later 270, collector chip 330. Figures k=0.7.
- Column 2's later narrator is the `mudallis` figure with a speech bubble "ʿan…" (transliteration), and a faint dashed ghost (opacity .35, no blink) beside the arrow above him: hidden, not shown. Its `.lbl` links to `al-mardud/hidden`.
- Columns 3 and 4 have visible ghosts and `skip` arrows; their `.lbl`s link to `al-mardud/breaks#mursal` and `al-mardud/breaks#mudal`.
- Column 5 has no moon; the top Companion carries the `ends` halo.
- Pills at y 380: `accept` "musnad", `reject` "mursal" / "muʿḍal or muʿallaq" / "mawqūf, not musnad".

### 5.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `musnad` | Panel 1 title, (≈130..215, y 12–40) | As a ḥadīth master says "a musnad ḥadīth": a report a Companion raises to the Prophet ﷺ by a chain that looks connected. One a Successor raises is mursal; one raised from below him, muʿḍal or muʿallaq. A hidden break, like a mudallis's ʿan or a contemporary not known to have met, doesn't undo it: the imams compiled musnads of such chains. al-Ḥākim agrees (§5.44). |

### 5.5 Views

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: raised, and looks connected | §5.44; with al-Ḥākim | A musnad is raised by a Companion to the Prophet ﷺ through a chain that looks connected. A report connected only as far as a Companion is not musnad, and nor is a raised report whose gap shows. |
| `khatib` | al-Khaṭīb: connected | al-Khaṭīb al-Baghdādī, §5.44 | Musnad means connected. So a mawqūf with a connected chain is musnad too, though al-Khaṭīb says the usage is rare. |
| `ibn-abd-al-barr` | Ibn ʿAbd al-Barr: raised | Ibn ʿAbd al-Barr, §5.44 | Musnad means marfūʿ, whether or not the chain is connected, so the mursal, the muʿḍal and the munqaṭiʿ would be musnad when their text is raised. Ibn Ḥajar calls this far-fetched, and says no one else holds it. |

Under `khatib`, column 5's pill becomes `accept` "musnad" with a dashed `ViewTag` "rarely used". Under `ibn-abd-al-barr`, columns 3 and 4 become `accept` "musnad" with a dashed tag "far-fetched: no one else", and column 5 keeps "mawqūf, not musnad".

### 5.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `looks-connected` | Looks connected | 0 | 344 |
| `gap-shows` | A gap shows | 344 | 688 |
| `stops` | Stops at a Companion | 688 | 860 |

### 5.7 Motion

- The arrows `flow` down; the visible ghosts blink; the faint hidden ghost does not.
- The pills come in one after another (`m-enter`, `stagger` 0.2s, once) after the chains.
- Reduced motion: everything shown, nothing moving.

### 5.8 Kit parts

Reuses `Moon`, `Narrator` (`mudallis`), `Arrow`, `Chip`, `Pill`, `SpeechBubble`, `ViewTag`, `TermTitle`, `XLink`. No new parts.

### 5.9 Translation slips

- **§5.44 "Clearly, that which is in reality continuous [though looks otherwise] will also be included in musnad".** The bracket contradicts the line before ("excludes that which apparently looks discontinuous"). The sense is likely "all the more so what is truly connected". The site says only that a chain that looks connected is musnad, whatever is hidden.

## 6. Note lengths

Measured after writing, in Unicode code points. All 9 caption notes and the 7 view notes fit the 400-character working cap.

- **Caption notes:** longest `marfu-hukmi` 386, `mukhadram` 367, `musnad` 365; shortest `athar` 178.
- **View notes:** longest `raised`'s `most` 315; shortest `khatib` 114.
- **Extras:** all six fit the 900 limit; the longest is `raised`'s "The book's examples" at 594.

## 7. New SVG kit parts (all scenes)

| Part | Props | Used in | Notes |
|---|---|---|---|
| `Arrow variant="implied"` | as the other variants | 2 | A gold dashed arrow with the gold head: counted as from the Prophet ﷺ by implication. Not narration, so it must not look like a `flow` arrow; not a gap, so not red. Its dashes reuse the `flow` keyframe. |

Everything else is reused: `Moon`, `Narrator`, `Arrow` (`flow`, `skip`, `elided`), `Bracket`, `Chip`, `Pill`, `Matn`, `Decision`, `Glyph cross`, `Lifespan`, `SpeechBubble`, `ViewTag`, `XLink`, `TermTitle`, the `geom.ts` triggers, `viewAttrs`, `stagger`, `.cells`, and the `m-draw`/`m-enter` classes.

## 8. Owner's annotations

The owner's PDF annotations on these pages (PDF pp.279–316). To be added to `notes/annotation-usage.md` for approval.

| Page | Annotation (short) | Use | Status |
|---|---|---|---|
| p.280 | Conditions for implied marfūʿ: not from the people of the book; not reachable by reasoning | Agrees with §5.40; `raised` cell A's condition chips. No wording taken | used (structure) |
| p.312 | Maqṭūʿ: "cut" | `maqtu` en "Cut off" (already in the table) | used |
| p.312 | Mawqūf: bare means a Companion; "mawqūf on Mālik" names who | Agrees with §5.43; the `mawquf` note's "mawqūf on him, naming him" | used |
| p.314 | Musnad, "visibly" or "apparently": looks fine; looks fine with a hidden gap; clear gap (not musnad) | `connected`'s three panels | used (structure) |
| p.312 | Examples: the Companions' fatwās; a saying of Mālik | Could label the mawqūf and maqṭūʿ cards; the translation gives no example | proposed |
| p.313 | Athar: recall the majority say it is the same as ḥadīth | Could add a line to the `athar` note. The translation says only that mawqūf and maqṭūʿ are called athar | proposed |
| p.314 | Musnad also names a collection ordered by Companion | Could be a Read as text extra on `connected`; the translation mentions musnads as books only in passing | proposed |
| p.281 | Due to love and respect they might leave out his name, as he is the default | The translation gives Baṣra usage, not a reason | not used |
| p.283 | They avoid ascribing outright since a lone report may hold a mistake | The translation says "piety and caution" only | not used |
| p.280 | Three kinds of people-of-the-book reports | Beyond the translation | not used |
| p.281 | Eclipse prayer: three bowings, most schools two | Beyond the translation | not used |
| p.281 | Some exclude private matters from silent approval | Beyond the translation | not used |
| p.282 | The Ẓuhr prayer (on the Sālim story) | Beyond the translation | not used |
| p.312 | Munqaṭiʿ: a missing link in the middle, not in sequence | Belongs to `breaks` | not used |

## 9. Translation slips

To be added to `notes/translation-queries.md`. Pages are the PDF's.

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.40 (p.279) | "the matn is the dialogue at which the isnād terminates" | Likely kalām, "the words". The site says "the words". | |
| §5.40 (p.280) | "has no reference to an ambiguous word or commentary of a rare word" | Likely "no bearing on explaining a word or a rare term". The site says "not explaining a word's meaning". | |
| §5.40 (p.282) | "Amongst the possible words [of delivery]" | Likely "among the forms that may carry it". The site says "set phrases". | |
| §5.41 (p.297) | "ʿAbd Allāh ibn Jaḥsh" among those who died out of Islam | Usually ʿUbayd Allāh ibn Jaḥsh. The site names only Ibn Khaṭal until a ruling. | |
| §5.41 (p.299) | "the dispersed and famous nature of this fact" | Likely istifāḍa and shuhra. The site says "widely known". | |
| §5.42 (p.308) | "the condition of acknowledgement" | Possibly tamyīz, discernment. The site says "a further condition". | |
| §5.44 (p.314) | "that which is in reality continuous [though looks otherwise] will also be included" | The bracket contradicts the line before. Likely "all the more so what is truly connected". The site leaves the bracket's sense out. | |

## 10. Term map (all 9)

| # | Term | Scene | Where |
|---|---|---|---|
| 1 | marfu | ends | Column 1 title |
| 2 | mawquf | ends | Column 2 title |
| 3 | maqtu | ends | Column 3 title |
| 4 | athar | ends | Under the bracket |
| 5 | marfu-hukmi | raised | Cell A title |
| 6 | sahabi | companions | Panel 1 title |
| 7 | tabii | companions | Panel 3 title |
| 8 | mukhadram | companions | Panel 4 title |
| 9 | musnad | connected | Panel 1 title |

Counts: ends 4, raised 1, companions 3, connected 1. Pending: 0. View-only: 0.

## 11. Implementation outline

Conventions as the earlier phase 3 builds: `rtk`, bun only, one commit per scene, one-line subjects, no trailers, LF, never staging `source/`. Kit and schema changes go into the commit of the scene that first needs them.

Tests follow the writing-tests rules (`~/.claude/skills/writing-tests/SKILL.md`) and the al-Mardūd design §16. Commit only tests of core logic, each behaviour once, through the mechanism that owns it. Don't commit tests that restate content or copy (labels, legend kinds, counts, scene order), exact timings, coordinates or animation delays, tests of a library or the platform, or one browser test per data item on the same code path. "Verify:" bullets are checks to run while building, by eye or with a throwaway spec deleted before the commit.

A new scene is covered with no new tests by:

- the build-time guards: `sceneErrors`, the panel guard in `Term.astro`, `XLink` and `viewAttrs`;
- `bun run test`: the motion CSS rule (finite keyframes are `from`-only) and the contrast pairs in `src/lib/palette.ts`;
- `bun run test:dist`: S1 term targets, S2 view integrity, S3 links and hashes, S4 label in name;
- `bun run test:e2e`: the routes smoke (render, axe, text contrast and Labels-mode overlap, on every route and `?view=`, both themes), V4 (no replayed load-in on a switch) and M5 (each scene moves, and rests under reduced motion where its motion ends).

**No new test is named.** The only kit change, `Arrow variant="implied"`, is one more entry in a lookup with no new branching; the routes smoke renders it.

**Task 1: scene `ends`.** Add `Ends` to the enum and `LEGEND`; YAML (§2) with `scene: ends` on 4 terms; `Ends.astro`, two panels. Verify: `?athar` lands in panel 2 in portrait; reduced motion shows the halos. Commit `scenes: add where-does-the-chain-end scene`.

**Task 2: scene `raised`.** Add `Raised`; `Arrow variant="implied"`; YAML (§3), 1 term, two extras, two views; `Raised.astro`, two cells. Verify: `?view=not-raised` swaps the two tags and arrows. Commit `scenes: add is-it-from-the-prophet scene`.

**Task 3: scene `companions`.** Add `Companions`; YAML (§4), 3 terms, four extras, two views; `Companions.astro`, four panels. Verify: the view slides the mukhaḍram figure; `?mukhadram` from `?view=among-companions` stays on it. Commit `scenes: add who-met-whom scene`.

**Task 4: scene `connected`.** Add `Connected`; YAML (§5), 1 term, three views; `Connected.astro`, three panels. Verify: each view swaps the pills. Commit `scenes: add does-it-look-connected scene`.

**Task 5: checks.** `bun run build`, `bun run test`, `bun run test:dist`, `bun run check`, and the e2e routes, views and motion specs for the new scenes. Fix what they find in the scene or the shared mechanism, not with a per-scene test. A coloured text on a new coloured fill gets its pair in `palette.ts`.

**Task 6: spec and notes.** Spec §4.3: a phase 3 division 4 table. `notes/translation-queries.md`: §9. `notes/annotation-usage.md`: the "used" rows of §8, and the "proposed" rows under Proposals. Commit `docs: update spec and notes for muntaha-al-isnad`.

Screenshots are left for the owner's local `bun run screenshots`, as the machine is shared.

## 12. Open questions for the owner

Each has options and a recommendation in the review file. In short:

1. **Four scenes.** `raised` holds a single term. Keep it, or fold its table into `ends`? Interim: keep.
2. **ʿAbd Allāh ibn Jaḥsh.** Name only Ibn Khaṭal until a ruling, or follow the translation? Interim: Ibn Khaṭal only.
3. **The mukhaḍram view.** Is "Some: among the Companions" fair, given Ibn Ḥajar doubts Ibn ʿAbd al-Barr meant it? Interim: keep the view.
4. **The Successor's third condition.** Show "a further condition", or name it as discernment? Interim: "a further condition".
5. **The `not-raised` view.** One view for both disputes ("from the sunna", "we were ordered"), or only the first? Interim: one view for both.
6. **Quoted phrase forms.** May the phrase forms of §5.40 ("from the sunna is…", "I heard him say…") be quoted, or should every card paraphrase? Interim: the phrase forms quoted, the examples paraphrased.
7. **The ghost in the marfūʿ chain.** Show a gap in column 1 of `ends`, to say "connected or not"? Interim: show it.
8. **A link from `hidden` to the mukhaḍram.** Add an XLink on `hidden` panel 3 to `companions#mukhadram`? Interim: not added in this branch (it touches al-Mardūd); proposed.
9. **The `implied` arrow.** A dashed gold arrow for "counted as his". Approve? Interim: yes.
10. **Proposed annotations** p.312 (examples), p.313 (athar), p.314 (musnad as a book).
11. **Translation slips:** the seven rows of §9.

## 13. Interim decisions for the build

- **Scenes:** four, as designed.
- **Names:** only Ibn Khaṭal among the apostates; ʿUbayd/ʿAbd Allāh ibn Jaḥsh waits for a ruling.
- **Views:** `raised` (two), `companions` (two), `connected` (three), all from the translation. Swaps may be instant except the mukhaḍram's slide.
- **Successor conditions:** "long company" and "a sound hearing from him", then "or a further condition".
- **Quotation:** only phrase forms the translation names as forms; examples paraphrased.
- **Ghost in the marfūʿ chain:** shown.
- **`hidden` link to `companions`:** not added here.
- **`implied` arrow:** added to the kit.
- **Gauges:** none with numbers; the company bars are labelled an illustration.
- **Owner's annotations:** only the "used" rows of §8.
- **Translation slips:** all seven rows go to `notes/translation-queries.md`.
