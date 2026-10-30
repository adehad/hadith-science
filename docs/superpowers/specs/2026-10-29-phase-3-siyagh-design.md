# Phase 3, division 6 (Ṣiyagh al-adāʾ): scene design

Date: 2026-10-30
Status: design for owner review. The owner asked for the build to go ahead on the interim decisions (§13) while they review; it is built on `design-siyagh` and reviewed through the PR preview (spec §4.3). The questions, their options and sketches are also in `docs/superpowers/specs/2026-10-29-phase-3-siyagh-review.json`.
Spec: `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Section numbers like spec §3.2 refer to it; bare § numbers (§5.56) refer to the book. "The al-Mardūd design" is `docs/superpowers/specs/2026-10-28-phase-3-mardud-design.md`, whose structure this doc follows, with the interim rules of the al-Maqbūl design §13 and the ʿAdad al-ṭuruq design §14.

## 0. Summary

Division 6 already has one scene, *How was it received?* (`delivery`, phase 2): the eight ranks of delivery words as a staircase, with wijāda, waṣiyya, iʿlām and general ijāza below the stairs. It holds 15 of the division's 23 terms. The other **8 terms** get **three new scenes**. `delivery` is not redesigned and keeps `order: 1`. All 8 terms land on a scene, and none stay pending.

The eight are muʿanʿan (§5.56), the four of §5.55's closing paragraphs on permission (ijāza, munāwala, ijāza muʿayyana, mukātaba), and the three loose forms of permission in §5.58 (to the unidentified, to the unborn, and hung on another's wish). They fall into three ideas, and the division's own moon labels already split them that way: moon 1 is muʿanʿan, moon 2 the ways of receiving.

| # | Scene | Path | Moons | Form | Terms | Views | Mobile |
|---|---|---|---|---|---|---|---|
| 1 | How was it received? | `/siyagh-al-ada/delivery/` | 0, 1, 2 | (existing, unchanged) | 15 | (existing) | 4 panels |
| 2 | Did ʿan mean he heard it? | `/siyagh-al-ada/heard/` | 1 | A chain linked by ʿan, then a decision path of three questions in the acted-on pattern: lived at the same time, a concealer, met at least once | 1 | `ibn-hajar`, `contemporary` | 4 panels |
| 3 | Did he give permission? | `/siyagh-al-ada/permission/` | 2 | Four panels: permission and the ways it is given; munāwala and a short ladder down to ijāza muʿayyana; handing over against sending, with no permission; the two meanings of mukātaba | 4 | `majority`, `sending` | 4 panels |
| 4 | Whom may a permission name? | `/siyagh-al-ada/licence/` | 2 | Four cells: a strip from the narrowest permission to the loosest with a "counts" bracket and the ranking of §5.58, then a licence card for each loose form | 3 | `ibn-hajar`, `khatib` | grid |

The translation names no narrator for any of these forms, so every figure is unnamed and every scene carries "an illustration: the book names no example" where it draws one. The book's own wording is used where it gives some: the teacher's "narrate them from me" (§5.55), and the permission formulas of §5.58, shown as short field values on licence cards, not as quotations.

### Content rules followed

These are the rules of the phase 2 plan, the al-Maqbūl design's §13 and the al-Mardūd design's §0.

- Every note paraphrases the *translation* paragraphs of §5.55–5.58 only: the headings `5.55.` to `5.58.` in `source/nuzhah.txt`, each read up to its `Commentary` line. The `5.55.1`, `5.56.1` and `5.58.1` "Conclusion" sections are the thesis author's and are not used.
- No footnote and no commentary was used. In particular: footnote 233 (Abū Ḥanīfa and Layth on reading), footnote 235 (where §5.56 sits in the Nuzhah), and the commentary's examples of loose permission (an unnamed ʿAbd Allāh, and so on).
- **No Arabic report wording anywhere.** Term names keep their Arabic from `terms.yaml`. The delivery word ʿan appears in transliteration, as in `hidden`. The §5.58 formulas are English field values on a card ("to: all Muslims"), never Arabic.
- Quotation marks only round exact translation words, and only short fragments: "narrate them from me" and "whom shall soon be born".
- **No numbers on ranks.** The ladder in scene 3 and the ranking strip in scene 4 show order only.
- **No Other views that aren't in the translation.** All three scenes' second views are positions the translation itself reports.
- Notes fit `note: z.string().max(420)`, with a working cap of 400 characters (§6).

## 1. Shared decisions

- **Division id:** `siyagh-al-ada`. New scene ids `heard`, `permission` and `licence` (none equals a term slug, so a bare `?slug` never meets a scene id).
- **Order:** `delivery` 1 (unchanged), `heard` 2, `permission` 3, `licence` 4. This is the moon order: moon 1 (muʿanʿan) then moon 2 (ways of receiving). The book's order would put `permission` (§5.55) before `heard` (§5.56); open question q7.
- **Moons:** `heard` `[1]`, `permission` and `licence` `[2]`. `delivery` keeps `[0, 1, 2]` (it draws ʿan and the weaker ways too); open question q8. Moon labels in `divisions.yaml` are unchanged.
- **New `diagram` enum values:** `Heard`, `Permission`, `Licence`.
- **Figures:** the spec §3.1–3.2 language. Teachers and students are unnamed reliable `later` figures. Scene 2 draws one `mudallis`. Scene 4 needs a narrator who does not exist yet; it gets a new `Narrator` `outline` look and `figures.ts` kind `unborn` ("Not yet born"): a dashed `--line` outline with no fill, no scroll and no seal (open question q5). It is not the ghost, which is red and means a dropped link.
- **Legend:** `Heard: ["moon", "sahabi", "tabii", "later", "mudallis"]`, `Permission: ["later"]`, `Licence: ["later", "unborn"]`.
- **Terms file:** each of the 8 terms gets `scene:`. No term is view-only, so no `view:` field. `ijaza-madum`'s `def` changes its example to the unattached one (open question q12).
- **Term names as plain labels.** Each scene names terms that live elsewhere: ʿan, shāfahanī, kataba ilayya, wijāda, waṣiyya, iʿlām and ijāza ʿāmma (`delivery`); mursal, munqaṭiʿ and muʿḍal (`breaks`); mudallas and mursal khafī (`hidden`). They are plain text or `XLink`s to the owning scene's `#term`, never triggers.
- **Shared mechanisms (test audit §3), reused, not reinvented:** `TermTitle` and the `Term` panel guard (with `dx` only where a trigger sits in a translated group; none of these scenes needs one); `XLink` for every cross-scene link; the `.cells` grid for scene 4; the state ink, tint and wash tokens (`Pill`, `.card.ok/.pause/.reject/.gold`) and `ViewTag` for attributions; `m-draw`/`m-enter` with `stagger()` for every once-only motion, resting at the end state; `viewAttrs` for the one element that moves between views (scene 4's bracket); `data-view-show` for view-only groups, built with `class="off"` outside the default view.

## 2. The existing scene (`delivery`)

Not redesigned, not reordered. Its `an` note already summarises §5.56 and its `nawalana` and `kataba-ilayya` notes touch munāwala and mukātaba; the new scenes draw these fully and `delivery`'s notes stay as they are.

Each new scene links back to its step: scene 2 to `delivery#an` (step 8), scene 3 to `#nawalana`, `#shafahani`, `#kataba-ilayya`, `#wijada`, `#wasiyya` and `#ilam`, scene 4 to `#ijaza-amma`. Those links land in the default view, so the spec §11 madinah-view overflow of the imlāʾ trigger does not affect them. That overflow is open question q9, with options; nothing in `Delivery.astro` changes in this phase.

## 3. Scene 2: Did ʿan mean he heard it? (`heard`)

### 3.1 Header

```yaml
- id: heard
  division: siyagh-al-ada
  moons: [1]
  order: 2
  title: Did ʿan mean he heard it?
  eyebrow: A chain joined by ʿan · §5.55–5.56
  lede: The word ʿan says neither that a narrator heard the report nor that he did not. A chain joined by it counts as heard when the two in each link lived at the same time and the narrator is no concealer. Ibn Ḥajar's chosen view asks one thing more, that the two are known to have met, even once.
  source: §5.55 ʿAn and its likes, §5.56 Muʿanʿan
  diagram: Heard
  width: 1040
```

### 3.2 Form, and why it suits the idea

§5.56 is a test applied to each link of a chain, with three conditions in a fixed order and a different name for each failure. That is a decision path, and *Can both be acted on?* already has the form: a spine of questions read left to right, the answer that goes on running along the spine, the other dropping to an outcome card. Panel 1 shows what is being tested, a chain whose every arrow says ʿan, with one link bracketed.

### 3.3 Sketch (1040 × 500)

```
x→ 0         130        260│      390        520│      650        780│      910       1040
 30 │   Muʿanʿan (i) مُعَنْعَنٌ  │  LIVED AT THE SAME TIME?│  A CONCEALER?        │  MET, EVEN ONCE?
 50 │ a chain linked by ʿan   │                          │                      │
100 │      (ﷺ)               │       ◇ Q1  ──yes──────→ │      ◇ Q2  ──no─────→│      ◇ Q3 ──yes──→ [counted as
    │       │ʿan              │       │no                │      │yes            │      │no             heard (samāʿ)]
150 │      [C]               │  ▬▬▬▬▬▬      ▬▬▬▬▬▬     │   [✋ k.6]            │   ▬▬▬●▬▬▬   (met)    pill 960,100
    │       │ʿan        ┐     │  (bars that don't meet)  │                      │     ▬▬●▬▬▬▬
200 │      [S]          │test │ ┌ not heard ──────────┐  │ ┌ not counted ────┐ │ ┌ could be a hidden ┐
    │       │ʿan        ┘each │ │ mursal or munqaṭiʿ  │  │ │ as heard        │ │ │ mursal            │
250 │      [N]           link │ │ → Where does the    │  │ │ → Did he hear   │ │ │ → Did he hear     │
    │       │ʿan              │ │   chain break?      │  │ │   it from him?  │ │ │   it from him?    │
300 │      [N]               │ └──────────────────────┘ │ └─────────────────┘ │ └───────────────────┘
360 │ ʿan · qāla · dhakara ·  │                          │                      │ [chosen: ʿAlī ibn al-Madīnī,
380 │ rawā: heard? permission?│                          │                      │  al-Bukhārī and others] tag
400 │ or not heard at all     │                          │                      │
430 │ → the eighth step       │                          │                      │ (contemporary view: Q3 not
    │   (How was it received?)│                          │                      │  asked; spine runs straight on)
```

- **Panel 1:** `TermTitle` "Muʿanʿan" (subt, cx 130) with its Arabic; a vertical chain at x=90, k=0.6: moon, Companion, Successor, two later narrators, joined by `flow` arrows, each with a small `ʿan` label beside it. A `Bracket` (vertical, x=150) round the Successor → narrator link, labelled "test each link". Under it the step-8 words as plain `.lbl` lines, and an `XLink` to `delivery#an` ("the eighth step").
- **Spine:** three `Decision`s at cx 390, 650, 910, cy 110, w 120, h 60, two-line questions ("Lived at the same / time?", "Is he a / concealer?", "Known to have / met, even once?"). Spine arrows between them as in ActedOn, labelled "yes", "no", "yes"; drop arrows "no", "yes", "no".
- **Q1 aside:** two `Lifespan` bars that don't overlap, under the drop.
- **Q2 aside:** a `mudallis` figure at k=0.6 beside the drop.
- **Q3 aside:** two overlapping `Lifespan` bars with the gold "met" knot of `hidden` (`spanOverlap`), drawn in once.
- **Cards:** three `.card` rects, x 280..500, 540..760, 800..1020, y 190..310: `reject` "not heard: mursal or munqaṭiʿ" with an `XLink` to `breaks`; `reject` "not counted as heard" with an `XLink` to `hidden#mudallas`; `pause` "could be a hidden mursal" with an `XLink` to `hidden#mursal-khafi`.
- **Outcome:** `Pill state="accept"` "counted as heard" at the spine's end (≈960, 170), with "(samāʿ)" under it.
- **Default view tag:** `ViewTag` "the chosen view: ʿAlī ibn al-Madīnī, al-Bukhārī" under Q3's card.

### 3.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `muanan` | Panel 1 title, (≈70..190, y 8–38) | A chain joined throughout by ʿan, a word that could mean he heard, had permission, or did not hear at all. Between two who lived at the same time it counts as heard; between two who did not, the report is mursal or munqaṭiʿ; from a concealer it does not count. Ibn Ḥajar's chosen view, with ʿAlī ibn al-Madīnī and al-Bukhārī, also asks for proof that they met, even once (§5.55–5.56). |

**Extra** (Read as text only):

1. **The illustration** (§5.56). The book names no chain for this; the chain and the bars are an illustration of its three conditions.

### 3.5 Views

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: they met at least once | §5.56; with ʿAlī ibn al-Madīnī, al-Bukhārī and others | Living at the same time is not enough: there must be evidence that the two met, even once, so that the chain is kept clear of a hidden mursal. Ibn Ḥajar calls this the chosen opinion. |
| `contemporary` | Living at the same time is enough | §5.56 | The first condition alone: ʿan between two who lived at the same time counts as heard, unless the narrator is a concealer. No meeting has to be shown, so nothing rules out a hidden mursal. |

Under `contemporary` (`data-view-show`): Q3, its drop arrow, its card, its bars and the chosen-view tag are hidden; a straight spine arrow runs from Q2's "no" to the outcome pill; a dashed `ViewTag` "living at the same time is enough" sits where Q3 was; and a dashed `pause` card "no guard against a hidden mursal" replaces Q3's card. View swaps may be instant.

### 3.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `chain` | A chain of ʿan | 0 | 260 |
| `same-time` | Lived at the same time? | 260 | 520 |
| `concealer` | A concealer? | 520 | 780 |
| `met` | Met, even once? | 780 | 1040 |

### 3.7 Motion

- The chain's arrows `flow`; the spine arrows are static.
- The Q3 knot draws in once (`m-draw`, 0.6s, delay 0.4s).
- Reduced motion or Motion off: knot drawn, nothing flowing. Base styles are the end state.

### 3.8 Kit parts

Reuses `Moon`, `Narrator` (`mudallis`), `Arrow`, `Decision`, `Lifespan` with `spanOverlap`, `Pill`, `Bracket`, `ViewTag`, `TermTitle`, `XLink`. Nothing new.

### 3.9 Translation slips

None that change meaning. §5.56's "It is said that the condition … is evidence of the meeting" introduces the view Ibn Ḥajar then calls the chosen one; the site attributes it as the chosen opinion, not as "it is said".

## 4. Scene 3: Did he give permission? (`permission`)

### 4.1 Header

```yaml
- id: permission
  division: siyagh-al-ada
  moons: [2]
  order: 3
  title: Did he give permission?
  eyebrow: Permission, handing over and letters · §5.55
  lede: Most of the weaker ways of receiving count only if the teacher gives permission to narrate. Handing the student his book with that permission is its highest form. Without permission, most scholars do not count a book handed over, and Ibn Ḥajar sees little difference between that and a book sent. A letter is mukātaba, though earlier and later scholars use the word differently.
  source: §5.55 Mukātaba and munāwala, §5.57 Wijāda and waṣiyya, §5.58 Iʿlām and ijāza
  diagram: Permission
  width: 1040
```

### 4.2 Form, and why it suits the idea

The closing paragraphs of §5.55 make one point four ways: permission is what counts.

1. **Permission itself** is a sealed licence card passing from teacher to student, given by word of mouth or in writing (the owner's p.343 notes make the same split), with the ways that need it listed under it.
2. **Munāwala** is a hand-over: the teacher hands his book on a `flow` arrow and says "narrate them from me". Below, a three-rung ladder shows the book's order: kept with permission, taken back with permission, then ijāza muʿayyana.
3. **No permission** is two pictures side by side, a book handed over and a book sent from land to land, with "=" between, since Ibn Ḥajar sees no strong difference. The verdict under them is the view.
4. **Mukātaba** is two letters, one carrying ḥadīth written out and one carrying only a seal, under two columns, earlier and later scholars, ticked or crossed.

### 4.3 Sketch (1040 × 500)

```
x→ 0         130        260│      390        520│      650        780│      910       1040
 30 │     Ijāza (i) إِجَازَةٌ   │  Munāwala (i) مُنَاوَلَةٌ   │ WITHOUT PERMISSION   │ Mukātaba (i) مُكَاتَبَةٌ
 50 │ permission to narrate   │ handing over the book    │                      │ by letter
 90 │  [T]  ┌licence┐  [S]    │  [T] ─📖─→ [S]            │ [T]─📖─→[S]   =  📖 ⇢ │   EARLIER    LATER
    │       │ ▬▬ ◉  │         │  ╭"narrate them from me"╮│  handed     sent from │   SCHOLARS   SCHOLARS
140 │       └───────┘         │  ╰─────────────────────╯ │  over       land to   │ ✉▤ ḥadīth    ✓        ✓
    │                         │ his copy or a checked one│             land      │   written out
170 │ given:                  │ ┌▓ with permission, his ┐│ "no strong difference"│ ✉◉ permission ✕        ✓
    │  ◯◯ by word of mouth →  │ │  to keep: highest ijāza││   (Ibn Ḥajar)         │   alone
    │     the sixth step      │ ├▒ with permission, taken││                       │
220 │  ✉ in writing → the     │ │  back at once          ││ ┌[not counted]┐ pill  │ earlier: the teacher
    │     seventh step        │ ├░ Ijāza muʿayyana (i)   ││ most scholars          │ writes the ḥadīth out,
260 │                         │ │  a named book, the way ││ (sending view: dashed  │ permission or not
    │ counts only with it:    │ │  named                 ││  [counted] + tag "a    │
300 │  wijāda → waṣiyya →     │ └────────────────────────┘│  group of the ḥadīth   │ → the seventh step:
    │  iʿlām →                │ an illustration           │  imams")               │   kataba ilayya
340 │ below hearing, all agree│                           │                        │
```

- **Panel 1:** `TermTitle` "Ijāza" (subt, cx 130). Teacher (`later`, reliable) at (40,100) and student at (220,100), k=0.6, with a new kit `LicenceCard` (§7) between them (x 80..180, y 76..124): two rule lines and a seal. Then "given:" with two rows: a small two-heads glyph group and an `XLink` to `delivery#shafahani` ("by word of mouth: the sixth step"); `Glyph letter` and an `XLink` to `delivery#kataba-ilayya` ("in writing: the seventh step"). Then "counts only with it:" and two short `XLink`s, to `delivery#wijada` and `#ilam`; then "and, for most:" with an `XLink` to `#wasiyya` and "a book handed over: munāwala" (§5.57: a group of earlier imams allowed waṣiyya on the bequest alone). Footer `.lbl` "all agree: specified permission is below hearing" (§5.58).
- **Panel 2:** `TermTitle` "Munāwala" (subt, cx 390). Teacher at (300,100), student at (480,100); a `flow` arrow between them carrying a `Glyph book`; a `SpeechBubble` (en only) "narrate them from me" from the teacher, placed so it stays inside the panel; the `.lbl` "his own copy, or a checked one". Then a ladder of three rungs (x 276..504, y 168..300, fills `stepFill(0..2)` from `staircase.ts`, order only): "with permission, his to keep: the highest ijāza"; "with permission, taken back at once"; "Ijāza muʿayyana" as a row trigger, with "a named book, the way named" under it. The `.lbl` "an illustration" at the foot.
- **Panel 3:** heading "Without permission" (plain `subt`). Left: teacher → student with a book on the arrow, "handed over"; right: a `Glyph book` on a long dashed arrow between two small place marks, "sent from land to land"; a large "=" between, with "no strong difference (Ibn Ḥajar)". The comparison is Ibn Ḥajar's own remark; the majority of §5.55 speaks only of munāwala. So in the default view (`majority`) the `Pill state="reject"` "not counted" sits under the handed-over picture only, labelled "most scholars: a book handed over". In the `sending` view both pictures get a dashed "counted", with `ViewTag` "a group of the ḥadīth imams" (dashed) and a note that a book sent counts without permission, the sending itself being a sign of it, and that handing over is compared to it.
- **Panel 4:** `TermTitle` "Mukātaba" (subt, cx 910), "by letter" under it. Two column heads, "earlier scholars", "later scholars". Two rows: `Glyph letter` + rule lines, "ḥadīth written out" (✓ ✓); `Glyph letter` + seal, "permission alone" (✕ ✓), using `Glyph check` and `Glyph cross`. Under them "earlier: the teacher writes the ḥadīth out, with permission or without", and an `XLink` to `delivery#kataba-ilayya`.

### 4.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `ijaza` | Panel 1 title, (≈95..165, y 8–38) | A teacher's permission to narrate his reports. Given by word of mouth it is called mushāfaha, and in writing, in the later scholars' usage, mukātaba. Wijāda and iʿlām count only with it, and for most scholars waṣiyya and munāwala too. Even the specified kind is strongly disputed, though the later scholars accept it, and all agree it is below hearing (§5.55, §5.57–5.58). |
| `munawala` | Panel 2 title, (≈325..455, y 8–38) | The teacher gives the student his original manuscript or one checked against it, or the student is shown the teacher's original, and the teacher tells him these are his narrations, to narrate from him. With that permission, and the copy left in the student's hands to work from, it is the highest ijāza, since it is specific and in person (§5.55). |
| `ijaza-muayyana` | Panel 2, third rung, (≈284..420, y 247–265) | Specified permission: the teacher permits a particular book of his and says how it is to be narrated. A munāwala whose copy is taken straight back is no longer the highest ijāza, but still ranks above this. Its acceptance is strongly disputed, though the later scholars accept it, and all agree it is below hearing (§5.55, §5.58). |
| `mukataba` | Panel 4 title, (≈850..970, y 8–38) | Correspondence. The later scholars use it for permission given in writing. The earlier scholars kept the word for a teacher writing out ḥadīth for his student, whether or not he also gave permission, and did not call a letter that carries permission alone mukātaba (§5.55). |

**Extra** (Read as text only):

1. **The illustration** (§5.55). The book names no teacher or student for these forms; the figures are an illustration.

### 4.5 Views

| id | Label | Scholars | Note |
|---|---|---|---|
| `majority` | Most scholars: not without permission | §5.55 | Most scholars do not count a munāwala that comes with no permission. Ibn Ḥajar sees no strong difference between handing a book over and sending one from land to land when neither carries permission. |
| `sending` | Some imams: like a book sent | §5.55 | Those who allow it compare it to sending a book from one land to another, and a group of the ḥadīth imams count a book sent even without permission, as if the sending itself were a sign of permission. |

The default is the majority's view, since §5.55 gives no ruling of Ibn Ḥajar's own beyond equating the two (open question q3). Under `sending` only panel 3's verdict changes.

### 4.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `ijaza` | Permission | 0 | 260 |
| `handing` | Handing over | 260 | 520 |
| `no-permission` | Without permission | 520 | 780 |
| `letters` | By letter | 780 | 1040 |

### 4.7 Motion

- The hand-over arrows `flow`; the sent book's dashed arrow `flow`s.
- The ladder's rungs enter one after another (`m-enter`, `stagger(i, {start: .3, step: .15})`, once).
- Reduced motion or Motion off: all rungs shown, nothing flowing.

### 4.8 Kit parts

Reuses `Narrator`, `Arrow`, `Glyph` (`book`, `check`, `cross`), `SpeechBubble` (en only), `Pill`, `ViewTag`, `TermTitle`, `XLink`, `staircase.ts stepFill`. New: `LicenceCard.astro` and `Glyph letter` (§7).

### 4.9 Translation slips

- **§5.55 (p.345) "because it entails specification and [exact] personage".** Likely taʿyīn and tashkhīṣ: the book is specified and the handing is in person. The site says "it is specific and in person".
- **§5.55 (p.346) "control over the manuscript, either through ownership or lease so that he may transfer it and study it".** "Lease" may render a loan, and "transfer it and study it" copying from it and checking against it. The site says only "the copy left in the student's hands to work from".

## 5. Scene 4: Whom may a permission name? (`licence`)

### 5.1 Header

```yaml
- id: licence
  division: siyagh-al-ada
  moons: [2]
  order: 4
  title: Whom may a permission name?
  eyebrow: The loose forms of permission · §5.58
  lede: A permission names a student and a book. Some teachers gave it far more loosely, to everyone, to someone unidentified, to someone not yet born, or on someone else's wish. Ibn Ḥajar counts none of these; al-Khaṭīb allowed all but the unidentified. Even at best they are far weaker than hearing, though better than a muʿḍal report.
  source: §5.58 Ijāza ʿāmma, li-l-majhūl, li-l-maʿdūm and muʿallaqa
  diagram: Licence
  width: 860
```

### 5.2 Form, and why it suits the idea

Every form in §5.58 is the same act with one field loosened: who it is to, what book, or on what condition. So each is drawn as a **licence card** with "to", "book" and "if" fields, the loosened field showing the problem: a blinking empty slot for the unidentified (the sign for anything missing), an unborn outline for the unborn, another person's wish for the conditional.

Cell A puts them in order, from the narrowest permission to the loosest, as a strip of stops, with a "counts" bracket over the stops each view accepts; it is the one element that moves between views (`viewAttrs`). Under it, the ranking of §5.58 places all of them between specified permission and a muʿḍal report; only the "disliked leniency" is credited to Ibn al-Ṣalāḥ.

A grid of four cells, `<svg viewBox="0 0 430 320">` each, two columns on desktop, one in portrait. Cell A holds `<Defs/>`.

### 5.3 Sketches (each cell 430 × 320)

Cell A, "How far may it reach?":

```
x→ 0  20                                                   410 430
 30 │                 How far may it reach?                    (subt, plain)
 52 │          from the narrowest permission to the loosest   (.lbl)
 80 │ ┌──── counts ────┐                                     bracket (moves per view)
100 │ ●──────●──────●──────●──────○──────○──────○             stops on a line
    │ a named one     all      all     ┆unidentified┆ not yet  on another's
    │ man, a   land   alive in Muslims    ↓B          born ↓C   wish ↓D
    │ named    (nearest my time  (ijāza ʿāmma →)
    │ book →   of these)
190 │ RANKED (§5.58)
210 │ ▓ hearing
230 │ ▒ specified permission: disputed; the later scholars accept it
250 │ ░ these forms: a disliked leniency (Ibn al-Ṣalāḥ)
270 │ ░ a muʿḍal report → still weaker
300 │ ▲ stronger … weaker ▼                                    (order only)
```

- Seven stops at x = 30, 90, 150, 210, 270, 330, 390 on a line at y=100. Labels in two or three `.lbl.sm` lines under each. Stop 1 is an `XLink` to `permission#ijaza-muayyana`; stop 4 an `XLink` to `delivery#ijaza-amma`; stops 5–7 are in-page links to `#cell-unidentified`, `#cell-unborn`, `#cell-conditional`, with "↓".
- **The bracket** (`Bracket` with "counts" over it) spans stop 1 only in `ibn-hajar` (x 18..42) and stops 1–4 and 6–7 in `khatib`; since al-Khaṭīb excludes only stop 5, the `khatib` view draws two brackets, 18..222 and 318..402, the second `data-view-show="khatib"`. The first moves between views by `viewAttrs` (its scaleX and translate), so it eases rather than jumps. Stop 2 carries "nearest of these" in both views.
- **The ranking:** four rungs, `stepFill(0..3)`, x 20..410, 18 tall, from y=200; texts in `.lbl.start`. The muʿḍal rung's text is an `XLink` to `breaks#mudal`.

Cell B, "Ijāza li-l-majhūl" (`#cell-unidentified`):

```
 30 │       Ijāza li-l-majhūl (i)  إِجَازَةٌ لِلْمَجْهُولِ
 52 │       to someone, or for a book, not identified
 80 │ ┌ licence ────────┐      ┌ licence ────────┐
    │ │ to:   ┆ ? ┆     │      │ to:   a student │
    │ │ book: his book  │      │ book: ┆ ? ┆     │   slots blink
    │ └──────────── ◉ ──┘      └──────────── ◉ ──┘
200 │              [not valid]   reject pill, both views
230 │       even al-Khaṭīb did not allow it
260 │       an illustration
```

Cell C, "Ijāza li-l-maʿdūm" (`#cell-unborn`):

```
 30 │       Ijāza li-l-maʿdūm (i)  إِجَازَةٌ لِلْمَعْدُومِ
 52 │       to someone not yet born
 80 │ ┌ to: whoever shall be born ┐  ┆◌┆ (unborn outline, k .6)
120 │ └───────────────────── ◉ ───┘
150 │ ┌ to: you, and whoever is    ┐ [N] ┆◌┆
    │ │ born to you                │     joined to a living man
190 │ └───────────────────── ◉ ───┘ "it is said: valid" (dashed tag)
220 │    [not valid either]  (default)  /  [allowed] + "al-Khaṭīb" tag (khatib view)
250 │ used by: [Abū Bakr ibn Abī Dāwūd] [Abū ʿAbd Allāh ibn Manda]
```

Cell D, "Ijāza muʿallaqa" (`#cell-conditional`):

```
 30 │       Ijāza muʿallaqa (i)  إِجَازَةٌ مُعَلَّقَةٌ
 52 │       hung on someone else's wish
 80 │ ┌ to: you            ┐   ┌ to: you            ┐
    │ │ if: so-and-so      │   │ if: you wish       │
    │ │     wishes         │   │                    │
    │ └──────────── ◉ ─────┘   └──────────── ◉ ─────┘
    │ (or: to whomever so-and-so wishes)
200 │  [not valid] / khatib: [allowed]   [valid]  accept pill
240 │ used by: [Abū Bakr ibn Abī Khaythama]
```

- Cards are the kit `LicenceCard` part: a rounded card with a seal at its lower right and up to three `field: value` rows; a value can be a blinking `slot` instead of text.
- Verdicts: `Pill reject` "not valid" in `ibn-hajar` (`data-view-show`), swapped in `khatib` for a dashed `Pill accept` "allowed" with a dashed `ViewTag` "al-Khaṭīb and his shaykhs". Cell B's pill is the same in both views, with "even al-Khaṭīb did not allow it". Cell D's right card's `Pill accept` "valid" is in both views.
- Users: `Chip`s, as the translation names them.

### 5.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `ijaza-majhul` | Cell B title, (≈60..370, y 16–40) | Permission that names someone who is not identified, or a book that is not identified. It does not count. al-Khaṭīb, who allowed the other loose forms and cited a group of his shaykhs for them, made an exception of this one (§5.58). |
| `ijaza-madum` | Cell C title, (≈60..370, y 16–40) | Permission to someone not yet born, as in "whom shall soon be born". Some say it is valid when joined to someone living, as in permission to you and whoever is born to you. Ibn Ḥajar: nearer the truth, it is not valid either. Abū Bakr ibn Abī Dāwūd and Abū ʿAbd Allāh ibn Manda used it (§5.58). |
| `ijaza-muallaqa` | Cell D title, (≈80..350, y 16–40) | Permission that hangs on someone else's wish: to you if so-and-so wishes, or to whomever so-and-so wishes. It does not count, unlike permission to you if you wish. Abū Bakr ibn Abī Khaythama used it, and al-Khaṭīb allowed it, as he did the unborn and the general forms (§5.58). |

**Extra** (Read as text only):

1. **The ranking** (§5.58). As Ibn al-Ṣalāḥ says, all these forms are a disliked leniency. Even specified permission is strongly disputed, though the later scholars accept it, and all agree it is below hearing, so these forms are much weaker still. Yet they are better than narrating the report muʿḍal. Many scholars allowed the general permission, so many that some ḥāfiẓs gathered them in a book in alphabetical order.
2. **The illustrations** (§5.58). The book names no one who received these permissions; the cards and figures are illustrations of its formulas.

### 5.5 Views

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: none of them counts | §5.58 | The correct opinion is that none of these forms counts: not the general ones, the unidentified, the unborn or the conditional. Of the general forms, permission to the people of one land comes nearest, being the most restricted. |
| `khatib` | al-Khaṭīb: all but the unidentified | §5.58; with a group of his shaykhs | al-Khaṭīb allowed every one of these forms except permission to someone or something unidentified, citing a group of his shaykhs for it. Many others allowed the general permission. |

### 5.6 Grid cells

A How far may it reach? · B Ijāza li-l-majhūl · C Ijāza li-l-maʿdūm · D Ijāza muʿallaqa. Each `<svg>` has an `id` (`cell-reach`, `cell-unidentified`, `cell-unborn`, `cell-conditional`) for cell A's in-page links. No panels.

### 5.7 Motion

- The empty slots in cell B blink (the standard `blink`); the unborn outline does not move.
- The bracket eases between views (the view switch's transition; none under reduced motion).
- Cell A's stops enter left to right once (`m-enter`, `stagger(i, {start: .2, step: .1})`).

### 5.8 Kit parts

Reuses `Narrator`, `Bracket`, `Chip`, `Pill`, `ViewTag`, `TermTitle`, `XLink`, `stepFill`, `viewAttrs`. New: `LicenceCard.astro` (shared with scene 3), `Narrator` `outline` with `FIG.unborn` (§7).

### 5.9 Translation slips

- **§5.58 (p.358) "Likewise [permission is required] for the ijāza majhūl" (and the same bracket for maʿdūm and the conditional).** The sense is that these, like ijāza ʿāmma, are likewise *not counted*; the bracketed insertion misleads. The site says "not valid" / "does not count".
- **§5.58 (p.358) "I give permission to you and whoever you bore".** Likely "whoever is born to you". The site says "you, and whoever is born to you".
- **§5.58 (p.359) "The attached [form of permission] has been used too, by Abū Bakr ibn Abī Khaythama".** "Attached" seems to render muʿallaqa, the permission hung on a wish. The site reads it so.
- The existing §5.58 query (whose is the reasoning after "as Ibn al-Ṣalāḥ states") stands; the extra credits the ranking to Ibn al-Ṣalāḥ as the translation does, and the reasoning to no one.

## 6. Note lengths

Measured after writing, in Unicode code points, against the 400 working cap (zod `max(420)`).

- **Caption notes:** the longest are `muanan` at 384 and `ijaza` at 369, then `ijaza-muayyana` 330, `munawala` 327, `ijaza-madum` 307, `ijaza-muallaqa` 277 and `mukataba` 273. The shortest is `ijaza-majhul` at 232. All under 400.
- **View notes:** the longest is `licence`'s `ibn-hajar` at 227; all six are under 230.
- **Extras:** the longest is `licence`'s "The ranking" at 392, well under the 900 limit.

## 7. New SVG kit parts (all scenes)

| Part | Props | Used in | Notes |
|---|---|---|---|
| `LicenceCard.astro` | `x, y, w, fields: { label, value?, slot? }[], h?` | 3, 4 | A rounded card with a seal at its lower right and up to three `label: value` rows; `slot` draws a blinking empty box for a missing value (spec §3.2's sign for anything missing). Decorative frame; its text is real text. |
| `Glyph` + `letter` | as the other kinds | 3 | An envelope, drawn, no text glyph. `Delivery.astro`'s own `modeIcon` letter is left as it is (not redesigned). |
| `Narrator` `outline` | boolean | 4 | The body and head in a dashed `--line` stroke, no fill, no scroll, no seal: not yet born. Not the ghost (red, a dropped link). |
| `figures.ts` | `unborn`, `KIND_NAME` "Not yet born" | 4 | Legend entry follows automatically. Not added to `/narrators/`. |

Everything else is reused (§1).

## 8. Owner's annotations

PDF pp.343–361. To be added to `notes/annotation-usage.md` for approval: the "used" rows under the main table, the "proposed" rows under Proposals.

| Page | Annotation (short) | Use | Status |
|---|---|---|---|
| p.343 | Highlights on the two ijāzas of steps 6 and 7: "Spoke" and "written" | Agrees with §5.55; scene 3 panel 1's two rows, by word of mouth and in writing. No wording taken | used (structure) |
| p.345 | Highlight on mukātaba: literally "correspondence" | `mukataba` en (already in use) and its scene 3 note, "Correspondence" | used |
| p.345 | Highlight on "its equivalent": a verified copy | Scene 3's `munawala` note, "one checked against it", and the panel 2 label "his own copy, or a checked one" | used |
| p.354 | Highlight on ʿan: "from" or "through the authority of" | Agrees with the existing `an` en ("From"); no new wording | used (agrees) |
| p.354 | The mudallis skips an intermediate narrator; C says "A said" rather than "I heard from B from A" | Agrees with §5.21; scene 2's concealer drop, which links on to `hidden`. The motive ("to appear to have a better chain") is not used | used (layout) |
| p.343 | Shaykh Maʿan: to this day one writes a letter asking and gets a reply with the ijāza | Could illustrate scene 3 panel 4 (a letter asking, a letter granting). It is the owner's teacher's account, not the translation | proposed |
| p.354 | ʿAn is easier to write, so its use in al-Bukhārī's book does not mean he accepted tadlīs | Beyond the translation | not used |

## 9. Translation slips

To be added to `notes/translation-queries.md`.

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.55 (p.345) | "because it entails specification and [exact] personage" | Likely taʿyīn and tashkhīṣ: the book specified and the handing in person. The site says "it is specific and in person" | |
| §5.55 (p.346) | "control over the manuscript, either through ownership or lease so that he may transfer it and study it" | "Lease" may render a loan, and "transfer it and study it" copying from it and checking against it. The site says only "left in the student's hands to work from" | |
| §5.58 (p.358) | "Likewise [permission is required] for the ijāza majhūl" (and for maʿdūm and the conditional) | The sense is that these are likewise not counted, as ijāza ʿāmma is not. The site says "does not count" | |
| §5.58 (p.358) | "I give permission to you and whoever you bore" | Likely "whoever is born to you". The site says so | |
| §5.58 (p.359) | "The attached [form of permission] has been used too, by Abū Bakr ibn Abī Khaythama" | "Attached" likely renders muʿallaqa, the permission hung on a wish. The site reads it so | |

## 10. Term map (all 8)

| # | Term | Scene | Where |
|---|---|---|---|
| 1 | muanan | heard | Panel 1 title |
| 2 | ijaza | permission | Panel 1 title |
| 3 | munawala | permission | Panel 2 title |
| 4 | ijaza-muayyana | permission | Panel 2, third rung |
| 5 | mukataba | permission | Panel 4 title |
| 6 | ijaza-majhul | licence | Cell B title |
| 7 | ijaza-madum | licence | Cell C title |
| 8 | ijaza-muallaqa | licence | Cell D title |

With `delivery`'s 15, the division's 23 terms are all on a scene. Pending: 0. View-only: 0.

## 11. Implementation outline

Conventions as the earlier phase 3 builds: `rtk`, bun only, one commit per task, one-line subjects, no trailers, LF, never staging `source/`. Kit and schema changes go into the commit of the scene that first needs them. Dev servers on port 4433 only, stopped afterwards.

**Tests** follow the writing-tests rules (`~/.claude/skills/writing-tests/SKILL.md`) and the al-Mardūd design §16. Commit only tests of core logic, each behaviour once, through the mechanism that owns it. No per-scene timing, copy, coordinate or count tests, no test that restates `scenes.yaml`, and no one-browser-test-per-term loops. "Verify:" bullets are checks to run while building, by eye or with a throwaway spec deleted before the commit. The new scenes are covered with no new tests by:

- the build-time guards: `sceneErrors` (every term on a scene, every caption a known term), the panel guard in `Term.astro`, `XLink`'s target and hash lookup, and `viewAttrs`'s every-view check;
- `bun run test`: the motion CSS rule (finite keyframes are `from`-only) and the token contrast pairs;
- `bun run test:dist`: S1 term targets, S2 view integrity, S3 links and hashes, S4 label in name;
- `bun run test:e2e`: the generic routes smoke (render, axe, text contrast and Labels-mode overlap on every route and every `?view=`, both themes), V4 (no replayed load-in on a view or mode switch) and M5 (each scene moves, and rests under reduced motion).

New logic that would earn a test: none. `LicenceCard` and `Narrator outline` are markup; the bracket's per-view geometry goes through `viewAttrs`, which is already tested. If a layout helper with real branching is added to `lib/kit.ts` (for example the licence card's row placement), it gets a unit test in `kit.test.ts` for its branches only.

**Task 1: scene `heard`.**
- `Heard` in the `diagram` enum, the dispatch map and `LEGEND`.
- YAML (§3), `scene: heard` on `muanan`, one extra, two views, four panels.
- `Heard.astro`.
- Verify: `?view=contemporary` hides Q3 and runs the spine straight on; `?muanan` lands; reduced motion shows the knot drawn.
- Commit `scenes: add did-an-mean-he-heard-it scene`.

**Task 2: scene `permission`.**
- `Permission`; kit `LicenceCard.astro`, `Glyph letter`.
- YAML (§4), 4 terms, one extra, two views, four panels.
- `Permission.astro`.
- Verify: `?view=sending` swaps panel 3's verdict; `?mukataba` lands in the last portrait panel; every `XLink` to `delivery` resolves.
- Commit `scenes: add did-he-give-permission scene`.

**Task 3: scene `licence`.**
- `Licence` diagram (`scenes/Licence.astro`); `Narrator outline`, `FIG.unborn`; `ijaza-madum` def per q12.
- YAML (§5), 3 terms, two extras, two views.
- Four-cell grid on `.cells`.
- Verify: the bracket eases between views; the slots blink and stop under reduced motion; the in-page links reach their cells.
- Commit `scenes: add whom-may-a-permission-name scene`.

**Task 4: checks and screenshots.** `bun run build`, `bun run check`, `bun run test`, `bun run test:dist`, and e2e `routes.spec.ts`, `views.spec.ts`, `motion.spec.ts` with `--workers=1`, grepped to the new scenes. Fix findings in the scene or the shared mechanism, not with a per-scene test. A coloured text on a new coloured fill gets its pair in `src/lib/palette.ts`. Screenshots on demand.

**Task 5: spec and notes.** Spec §4.3: a division 6 table. `notes/translation-queries.md`: §9. `notes/annotation-usage.md`: §8.

## 12. Open questions for the owner

Each has options, sketches and a recommendation in the review JSON. In short:

- **q1** Three scenes, with muʿanʿan alone on one, or fold muʿanʿan into *Did he give permission?* as a fifth panel? Interim: three scenes.
- **q2** *Did ʿan mean he heard it?*: keep the "living at the same time is enough" view, or show it only as a label on Q3? Interim: the view.
- **q3** *Did he give permission?*: default to the majority on handing without permission, with "some imams" as the other view; or no views, both rulings as labelled rows? Interim: views, majority first.
- **q4** The `heard` scene id and title: keep "Did ʿan mean he heard it?" or "Is a chain of ʿan heard?". Interim: the first.
- **q5** The unborn figure: a new dashed outline figure, or the unknown figure with a "not yet born" label? Interim: the outline.
- **q6** *Whom may a permission name?*: does al-Khaṭīb's "all of these forms" include the general permission (bracket over stops 1–4 and 6–7), or only the unborn and conditional? Interim: includes it.
- **q7** Order: moon order (delivery, heard, permission, licence) or book order (delivery, permission, heard, licence)? Interim: moon order.
- **q8** `delivery`'s moons: keep `[0, 1, 2]` or narrow to `[0, 2]` now that moon 1 has its own scene? Interim: unchanged.
- **q9** `delivery`, madinah view: the imlāʾ trigger runs past panel 1 in portrait. Wrap it onto two lines, shorten it, or move it below step 1? Interim: none in this phase (recommendation: wrap).
- **q10** The p.343 letter-request annotation: leave as a proposal, or draw it on the mukātaba panel? Interim: proposal.
- **q11** Translation slips (§9): rule on the five rows. Interim: neutral wording as given.
- **q12** `ijaza-madum`'s glossary def uses "whoever will be born to you", the form joined to a living person. Change it to the unattached example? Interim: change.

## 13. Interim decisions for the build

- **Scenes:** three, as designed, in moon order. `delivery` unchanged.
- **Views:** `heard` (two), `permission` (two, majority first), `licence` (two). View swaps may be instant, except the licence bracket, which eases.
- **The unborn figure:** the dashed outline, as a `figures.ts` kind for the legend only.
- **al-Khaṭīb:** his view accepts the general forms too.
- **Arabic:** term names only. ʿAn in transliteration. Formulas in English as card fields.
- **Illustrations:** labelled "an illustration: the book names no example".
- **Owner's annotations:** only "used" rows. p.343's letter story stays a proposal.
- **Translation slips:** all five rows go to `notes/translation-queries.md`; the site uses the wording given.
- **Delivery's imlāʾ overflow:** unchanged in this phase.
