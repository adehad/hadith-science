# Phase 3, division 1 (ʿAdad al-ṭuruq): scene design

Date: 2026-10-28
Status: design for owner review. No site code yet. The next step is a plan, then the build on `phase-3-turuq`, reviewed through the PR preview (spec §4.3).
Spec: `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Section numbers like spec §3.2 refer to it; bare § numbers (§5.7) refer to the book. "The al-Maqbūl design" is `docs/superpowers/specs/2026-10-28-phase-3-maqbul-design.md`, whose structure and interim rules (its §13) this doc follows.

## 0. Summary

Division 1 already has one scene, *How many routes carry it?* (`routes`), which covers both moons and four terms (mutawātir, mashhūr, ʿazīz, gharīb). The other **14 terms** get **four new scenes**. `routes` is not redesigned; it only moves from `order: 1` to `order: 2`, so the division opens with the anatomy of a report. All 14 terms land on a scene, and none stay pending.

| # | Scene | Path | Moons | Form | Terms | Views | Mobile |
|---|---|---|---|---|---|---|---|
| 1 | What is a report? | `/adad-al-turuq/report/` | 0, 1 | Two cells: a real chain rising to its text card, and two circles that merge, separate or nest | 4 | `same`, `apart`, `nested` | grid |
| 2 | How many routes carry it? | `/adad-al-turuq/routes/` | 0, 1 | (existing, unchanged) | 4 | none | 4 panels |
| 3 | Which reports are acted on? | `/adad-al-turuq/sorting/` | 1 | Sorting gate, left to right: two streams in, one check, three outcomes | 4 | none | 3 panels |
| 4 | How sure can we be? | `/adad-al-turuq/knowledge/` | 0, 1 | Knowledge meter: a three-band column, with mutawātir on one side and the three signs lifting a report on the other | 3 | `ibn-hajar`, `nazari-only` | 3 panels |
| 5 | Where is the narrator alone? | `/adad-al-turuq/lone/` | 1 | Four chains side by side, the lone links lit, from one lone link at the root to a lone narrator further down | 3 | none | 4 panels |

Every scene uses a real worked example from the book. The examples are:

- the Intentions report, ʿUmar → ʿAlqama → Muḥammad ibn Ibrāhīm → Yaḥyā ibn Saʿīd, the first report in al-Bukhārī's Ṣaḥīḥ (§5.5), used for the anatomy in scene 1 and again in scene 5;
- the chain of imams, Aḥmad from al-Shāfiʿī from Mālik, each with a partner (§5.7);
- the walāʾ report, with ʿAbd Allāh ibn Dīnār alone from Ibn ʿUmar (§5.8);
- the Branches of Faith report, with Abū Ṣāliḥ alone from Abū Hurayra and ʿAbd Allāh ibn Dīnār alone after him (§5.8).

The only abstract parts are:

- the gharīb nisbī column in scene 5, because the translation names no example for it (open question 5);
- the mustafīḍ inset in scene 3, which shows the counting rule with dots, because no example is given;
- the sorting gate in scene 3, which is a procedure, not a report.

### Content rules followed

These are the rules from the phase 2 plan and the al-Maqbūl design's §13.

- Every note below paraphrases the *translation* paragraphs of §5.2–5.8 only: the headings `5.2.` to `5.8.` in `source/nuzhah.txt`, each read up to its `Commentary` line. The §5.5 and §5.3 translation paragraphs are used for the Intentions chain and for the two kinds of knowledge.
- No footnote and no commentary was used. In particular:
  - the wording of the walāʾ and Branches of Faith reports, which appears only in the thesis footnotes 71–72, is not used; the scenes name the reports only;
  - the commentary's reading of which khabar view Ibn Ḥajar prefers is not used (see §2.5);
  - the commentary's remark that no one has given an example of mustafīḍ is not used.
- **No Arabic report wording anywhere.** The translation gives the reports in English only. Term names keep their Arabic from `terms.yaml`. The few English report words shown ("actions are judged by intentions") are at most five words, as the translation has them.
- **Gauges and meters show order only.** No numbers, percentages or counts appear on them.
- Notes are written to fit `note: z.string().max(420)`, with a working cap of 400 characters. Lengths are checked in §7.

## 1. Shared decisions

- **Division id:** `adad-al-turuq`. The new scene ids are `report`, `sorting`, `knowledge` and `lone`, with `order` 1, 3, 4 and 5. `routes` becomes `order: 2`.
- **Moons:** `report` `[0, 1]`, `sorting` `[1]`, `knowledge` `[0, 1]`, `lone` `[1]`. The moon labels in `divisions.yaml` are unchanged. The division page already lists several scenes under one moon, and gives each scene's view-transition name to the dot under its first listed moon, so no page change is needed.
- **New `diagram` enum values:** `Report`, `Sorting`, `Knowledge` and `Lone`.
- **Figures:** the figure language of spec §3.1–3.2, unchanged. Named narrators are drawn reliable, with scroll and seal, as the al-Maqbūl design does.
- **Generation colours:** Companions are gold: ʿUmar, Ibn ʿUmar, Abū Hurayra. Successors are green where that is certain from the chain (anyone narrating from a Companion): ʿAlqama, ʿAbd Allāh ibn Dīnār (in the walāʾ chain), Abū Ṣāliḥ. Muḥammad ibn Ibrāhīm, Yaḥyā ibn Saʿīd, and ʿAbd Allāh ibn Dīnār in the Branches chain are also green, from general knowledge (the Intentions chain is known for its three Successors in a row). This is open question 2.
- **Legend and modes:**
  - The scene page's `LEGEND` map gains `Report: ["moon", "sahabi", "tabii"]`, `Knowledge: ["moon", "sahabi", "tabii", "later"]` and `Lone: ["moon", "sahabi", "tabii", "later"]`.
  - `Sorting` draws no narrator figures, so it has no legend and no Key/Labels switch (as `ActedOn`).
- **Terms file:** each of the 14 terms gets `scene:` set to its scene. No term is view-only: every trigger renders in every view, so no `view:` field is needed.
- **Term names used as plain labels.** Several scenes show the words mutawātir, mashhūr, ʿazīz or gharīb. They are plain text or chips, never triggers, because those terms belong to `routes` (the build enforces this). Where it helps, a small in-SVG link goes to `routes`, as Grades links to *Who outweighs whom?*.

## 2. Scene 1: What is a report? (`report`)

### 2.1 Header

```yaml
- id: report
  division: adad-al-turuq
  moons: [0, 1]
  order: 1
  title: What is a report?
  eyebrow: How a report reached us, its parts and names · §5.2
  lede: Every report has two parts, the chain of people who passed it on and the words they passed on. Before he counts chains, Ibn Ḥajar names these parts, and sets out three ways scholars relate the words khabar and ḥadīth.
  source: §5.2 Khabar, ḥadīth, isnād and matn
  diagram: Report
  width: 860
```

### 2.2 Form, and why it suits the idea

§5.2 holds two separate ideas:

1. what a report is made of: an isnād leading to a matn;
2. how two names relate: khabar and ḥadīth, on three views.

The first is a **report anatomy**: a real chain drawn as usual, with the narration flowing down from the Prophet ﷺ, and its text card hung at the top where the words were spoken. A bracket beside the chain marks the isnād, with an arrowhead pointing *up* to the text, because Ibn Ḥajar defines the isnād as the path that leads to the matn.

The second is a **set diagram**: two circles that are one circle, two separate circles, or one inside the other. This is the clearest way to show synonymy, difference and general-and-particular, and it is the scene's Other views switch (§2.5).

The two ideas don't share a layout, so the scene follows the Names and Grades precedent: a **grid of two cells**, each its own `<svg viewBox="0 0 430 360">` in an HTML grid, side by side on desktop and one column in portrait. Cell A holds `<Defs/>`.

### 2.3 Sketches (each cell 430 × 360)

Cell A, "Anatomy" (origin 0,0):

```
x→ 0   40   80       150        200                          410  430
 18 │ ANATOMY OF A REPORT                                   (eyebrow .colhead)
 30 │                       ┌──────────────────────────────┐
 52 │       ( ﷺ ) 80,52 ────┤ "actions are judged          │ Matn card 175..405, 30..80
 70 │         ↓             │  by intentions"              │
 80 │         ↓             └──────────────────────────────┘
104 │         ↓                      Matn (i)  290,104                    (.subt)
118 │      [ʿUmar] 80,118 ── ʿUmar                 ▲ bracket x=200, y 106..334
172 │      [ʿAlqama] 80,172 ── ʿAlqama             │
226 │      [M. ibn Ibrāhīm] 80,226                  │  Isnād (i)  215,212        (.subt, left-aligned)
280 │      [Yaḥyā ibn Saʿīd] 80,280                 │  the path that leads      (.lbl) 215,232
    │         ┊ elided                              │  to the text              (.lbl) 215,248
330 │      [al-Bukhārī] chip 40..120, 320..340      ┘
352 │  many isnāds are its ṭuruq, its routes → How many routes carry it?   (in-SVG link, .lbl)
```

- **Moon:** at (80,52), k=0.7. A short tail line joins it to the Matn card's left edge at (175,55).
- **Matn card:** the existing `Matn` part at (175,30), w=230, h=50, `lines=["“actions are judged", "by intentions”"]`, no `ar`. English only (§2.4, `matn`).
- **Chain:** figures at cx=80, k=0.75, rows y=118, 172, 226, 280. ʿUmar is `sahabi`; the other three are `tabii` (§1). Names sit to the right of each figure at x=105, `.lbl`, left-aligned. Solid `flow` arrows between them.
- **Collector:** a `Chip` "al-Bukhārī" at (40,330), reached from Yaḥyā by an `Arrow variant="elided"`, because the book does not give the links between Yaḥyā and al-Bukhārī. A `.lbl` "first report in his Ṣaḥīḥ" sits to the right of the chip at (130,334).
- **Bracket:** a vertical bracket at x=200 from y=106 to y=334, ticks pointing left, with a small open arrowhead at the top end pointing up towards the Matn card. This uses the new kit `Bracket` (§8).
- **Link row:** the ṭuruq line at y=352 is an in-SVG `<a>` to `routes`, not a trigger.

Cell B, "Khabar and ḥadīth" (origin 430,0):

```
x→ 0    30                 215                    400   430
 18 │ KHABAR AND ḤADĪTH · two names                     (eyebrow)
 50 │  ── Khabar (i)        solid line swatch            row y=50, swatch 30..60
 74 │  ┄┄ Ḥadīth (i)        dashed gold swatch           row y=74
    │
    │   view `same`          view `apart`              view `nested`
    │      ╭────╮          ╭───╮      ╭───╮           ╭──────────╮
200 │     │ ⟨both⟩ │       │(ﷺ)│      │ ⊙ ⊙ │          │ ╭──╮      │
    │      ╰────╯          ╰───╯      ╰───╯           │ │ḥ.│  more │
    │  one circle, two      ḥadīth     khabar          │ ╰──╯      │
    │  outlines             from the   from            ╰──────────╯
    │                       Prophet ﷺ  others
300 │ "two names, one meaning"  "muḥaddith"  "akhbārī"   "every ḥadīth is a khabar,
320 │                                                     not every khabar a ḥadīth"
```

- **Triggers:** the two legend rows at the top are the term triggers, so they stay put in every view. Each row has a short swatch: khabar is a solid `--fg` line, ḥadīth a dashed `--gold-b` line. Colour is never the only cue (WCAG 1.4.1): the strokes differ in dash too.
- **Circles:** two circle groups, `khabar` (solid `--fg` stroke) and `hadith` (dashed `--gold-b` stroke). Each view sets their centre and radius:

| View | ḥadīth circle | khabar circle | Contents | Caption (y=300–320, `.lbl`) |
|---|---|---|---|---|
| `same` | (215,195) r=90 | (215,195) r=90, dash offset so both strokes show | none (see below) | "two names, one meaning" |
| `apart` | (120,195) r=70 | (310,195) r=70 | a mini moon (k=0.45) in ḥadīth; a mini gold and a mini black figure (k=0.45) in khabar | "from the Prophet ﷺ · ḥadīth, studied by a muḥaddith" / "from others · khabar, studied by an akhbārī" |
| `nested` | (170,200) r=50 | (215,195) r=105 | the word "ḥadīth" in the small circle, "khabar" in the outer ring | "every ḥadīth is a khabar, not every khabar a ḥadīth" |

- **Contents only where the translation says so.** Only the `apart` view is defined by *where* reports come from (the Prophet ﷺ, or others), so only it shows the moon and figures. The `same` and `nested` views are defined only by how the two names relate, so they show the names alone. This avoids claiming, for instance, that under the first view a Companion's saying is a ḥadīth.
- **Implementation:** each circle is a `<g>` with a `transform` (translate and scale of a unit circle), set per view through `[data-view-show]` siblings or a `data-view` attribute on the cell, so the change can be a CSS transform transition.

### 2.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `isnad` | Cell A, bracket label, (209..300, y 197–221) | The isnād is the account of the path that leads to the matn: the line of narrators, each passing the report on. A report's ṭuruq, its paths, are its chains, and having many of them is one of the conditions of mutawātir. The chain drawn here is the Intentions report, which Ibn Rushayd notes is the first report in al-Bukhārī's Ṣaḥīḥ (§5.2, §5.5). |
| `matn` | Cell A, under the text card, (260..345, y 87–111) | The matn is the text in which the chain ends: the words themselves, which the chain leads to. Here it is the saying "actions are judged by intentions", which ʿUmar told and ʿAlqama, Muḥammad ibn Ibrāhīm and Yaḥyā ibn Saʿīd passed on in turn (§5.2, §5.5). |
| `khabar` | Cell B, legend row 1, (24..135, y 37–55) | For the scholars of this field, khabar means the same as ḥadīth. Some say ḥadīth is what comes from the Prophet ﷺ and khabar what comes from others, so one who studies history is an akhbārī and one who studies ḥadīth a muḥaddith. Others say every ḥadīth is a khabar, but not every khabar a ḥadīth. Ibn Ḥajar's text speaks of khabar because it covers more (§5.2). |
| `hadith` | Cell B, legend row 2, (24..135, y 61–79) | The other of the two names. Taken as a synonym, it means just what khabar means. On the view that sets them apart, ḥadīth is what comes from the Prophet ﷺ, and khabar what comes from anyone else. On the view that nests them, ḥadīth is the narrower name: every ḥadīth is a khabar, but not every khabar is a ḥadīth (§5.2). |

### 2.5 Views

The translation gives three definitions (§5.2). The first is attributed to "the scholars of this field"; the other two are introduced with "it is said". The first is the default. The translation itself doesn't say which Ibn Ḥajar prefers (the thesis commentary does, and is not used), so the default follows the attribution (open question 3).

| id | Label | Scholars | Note |
|---|---|---|---|
| `same` | One meaning | The scholars of this field, §5.2 | Khabar and ḥadīth are two names for one thing. |
| `apart` | Two kinds | "It is said", §5.2 | Ḥadīth is what comes from the Prophet ﷺ and khabar what comes from others. So one who studies history and the like is called an akhbārī, and one who studies ḥadīth a muḥaddith. |
| `nested` | General and particular | "It is said", §5.2 | The two relate as general and particular: every ḥadīth is a khabar, but not every khabar is a ḥadīth. Ibn Ḥajar's text speaks of khabar because it covers more. |

Only cell B changes. Cell A is the same in every view.

### 2.6 Grid cells

The cells are 1 Anatomy (A) and 2 Khabar and ḥadīth (B). Desktop shows them side by side; portrait shows one column. There are no panels.

### 2.7 Motion

- **Cell A:** the chain arrows `flow` down. The bracket's up-arrowhead is static.
- **Cell B:** on a view change the circle groups move and resize with a CSS `transform` transition (0.5s, ease-in-out), the "elements animate to their new position" rule of spec §3.4. The contents and captions crossfade (opacity .3s).
- **Reduced motion:** the transition is removed by `motion.css`, so the swap is instant. Nothing loops in this scene apart from the standard arrow flow, which `motion.css` already stops.

### 2.8 Kit parts

Reuses `Moon`, `Narrator`, `Arrow` (`flow`, `elided`), `Matn`, `Chip`, `TermTitle`, `Term`/`InfoIcon` and `rowTrigger`. New: the kit `Bracket` (§8), with a `vertical` orientation and an optional end arrowhead. The circles are scene-local.

### 2.9 Translation slips

None that change meaning in §5.2. The translation renders the third view's relation with the uṣūl phrase "ʿumūm wa-khuṣūṣ muṭlaq"; the site says "general and particular".

## 3. Scene 3: Which reports are acted on? (`sorting`)

### 3.1 Header

```yaml
- id: sorting
  division: adad-al-turuq
  moons: [1]
  order: 3
  title: Which reports are acted on?
  eyebrow: How a report reached us, accepted or rejected · §5.4, §5.6–5.7
  lede: Mutawātir is acted on without checking its narrators, because its truth is certain. Every other report, the āḥād, is checked first. If its narrator is proven truthful it is accepted, if proven untruthful it is rejected, and if neither is proven it is held back.
  source: §5.4 Mustafīḍ, §5.6–5.7 Āḥād, maqbūl and mardūd
  diagram: Sorting
  width: 780
```

### 3.2 Form, and why it suits the idea

Ibn Ḥajar's point in §5.7 is a procedure: āḥād reports must be investigated before they are used as proof, and mutawātir is not. So the form is a **sorting gate** read left to right:

1. two streams come in: a broad mutawātir stream and a narrower āḥād stream gathered from its three kinds;
2. the mutawātir stream passes over the gate on a bypass, "not investigated";
3. the āḥād stream goes through one check, a `Decision` on the narrator's truthfulness;
4. three exits lead to three outcomes: accepted, held back, rejected; a dashed arrow from "held back" to "rejected" shows that it is treated like the rejected without being proven false.

Being a single row, it carousels cleanly in three 260-wide panels. Colour encodes the outcome as in *Can both be acted on?*: `--ok` for accepted, `--pause` for held back, and the reject colour for rejected, each with a glyph, so colour is not the only cue.

Mustafīḍ, the jurists' name for mashhūr, sits on the intake as an alias tag on the Mashhūr chip, with a small inset showing the stricter use some make of it.

### 3.3 Sketch (780 × 480)

```
x→ 0    30        120       260│ 300        390         480  520│ 540        650        760 780
 24 │ TWO KINDS                  │ THE CHECK                      │ THREE OUTCOMES
 60 │                            │   Mutawātir: not investigated  │
 80 │ [Mutawātir] ═════════════════╪═══════════ bypass ═════════════╪══→ (Accepted · certain) pill 650,80
    │  chip 30,80  5 thin flow lines                               │
130 │                            │                                │ ┌ ✓ Maqbūl (i) ───────────┐ 540..760
170 │ also: Mustafīḍ (i) 30,170  │       ⌕ lens 390,175           │ │ acted on, by the majority │ 130..210
200 │ [Mashhūr]  ┐               │           ╱╲   ↗ proven truthful│ │ truth overwhelmingly likely│
250 │ [ʿAzīz]    │ Āḥād (i) 135,250 ───→ ◇ narrator's  ──→ neither ─┼→│ ⏸ Held back              │ 225..285
    │            │ each one a   │      truthfulness                 │ │ no proof either way       │
300 │ [Gharīb]   ┘ khabar al-wāḥid      proven? 390,255  ↘ proven    │ ┌ ✕ Mardūd (i) ───────────┐ 300..380
    │                            │           ╲╱        untruthful   │ │ repelled                  │
350 │ SOME TELL THEM APART       │ checked before use as proof    │ │ falsehood overwhelmingly  │
380 │ ●●● ●●● ●●● ●●●  mustafīḍ  │  (.lbl 390,350)                │ └──────────────────────────┘
410 │ ●●● ●●●●● ●●●● ●●●●●● mashhūr                               │  ┆ dashed, from Held back
440 │ (dots per stage; illustration)                              │ treated like it, not proven false (.lbl 650,410)
```

- **Panel 1, intake:**
  - A `Chip` "Mutawātir" at (30,80), and a bundle of five thin `flow` lines from x=95 to the right edge, y=72–88, standing for many routes. The bundle runs on through panel 2 as the bypass.
  - Three chips stacked: "Mashhūr" (30,200), "ʿAzīz" (30,250), "Gharīb" (30,300). A vertical `Bracket` at x=112, y=190–310, ticks pointing left, gathers them. Its label is the `ahad` trigger at (125,250), with the two-line `.lbl` "each one a / khabar al-wāḥid" under it.
  - The `mustafid` trigger is a row label "also: Mustafīḍ (i)" at (30,170), with a dotted leader down to the Mashhūr chip.
  - **Inset** (x 20..240, y 350..440): eyebrow "SOME TELL THEM APART". Two rows of dot clusters, one cluster per stage of a chain: the first row has equal clusters from first to last (labelled "mustafīḍ"), the second has clusters that vary but never fall below three (labelled "mashhūr"). A `.lbl` "dots per stage; an illustration" under them. Dots, not digits, so it makes no numeric claim.
  - A single `flow` arrow leaves the bracket at (160,250) for the gate.
- **Panel 2, the check:**
  - The bypass continues at y=72–88 with the label "Mutawātir: not investigated" above it at (390,60).
  - A `Decision` at (390,255), w=150, h=90, lines "narrator's / truthfulness / proven?". A `Glyph lens` at (390,175) above it.
  - Three exits from the diamond's right half: "proven truthful" up to (520,170), "neither" straight to (520,255), "proven untruthful" down to (520,340), each with a small `.lbl` edge label.
  - A `.lbl` under the diamond at (390,350): "narrators are checked before the report is used as proof".
- **Panel 3, outcomes:**
  - A `Pill state="accept"` "Accepted · certain" at (650,80), where the bypass ends. It is not a term (mutawātir is `routes`' term) and carries a small in-SVG link to *How sure can we be?*.
  - **Maqbūl card** (540..760, 130..210): `Glyph check`, the `maqbul` trigger as a 15px sub-title, and two `.lbl` lines: "acted on, by the majority" and "truth overwhelmingly likely".
  - **Held back card** (540..760, 225..285): `Glyph pause`, the plain sub-title "Held back" (not a term; see §3.4), and "no proof either way".
  - **Mardūd card** (540..760, 300..380): a cross glyph, the `mardud` trigger, and "repelled" / "falsehood overwhelmingly likely".
  - A dashed `--pause` arrow runs from the Held back card's right edge (760,255) round to the Mardūd card's right edge (760,340), bend +20, with the `.lbl` "treated like it, not proven false" at (650,405).

### 3.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `ahad` | Panel 1, bracket label, (119..190, y 237–261) | Every report that falls short of the conditions of mutawātir: the mashhūr, ʿazīz and gharīb. Each one is also called khabar al-wāḥid, literally a report that one person narrates. Unlike mutawātir, its narrators' states must be investigated before it is used as proof, so it can be accepted or rejected (§5.6–5.7). |
| `mustafid` | Panel 1, alias row, (24..150, y 157–175) | A group of the jurists call the mashhūr mustafīḍ, from a verb used of water spreading out. Some tell the two apart: mustafīḍ is when the numbers at the start of the chain and at its end are equal, and mashhūr is the more general name. Others separate them on another basis, which Ibn Ḥajar says is not a question for this field (§5.4). |
| `maqbul` | Panel 3, Maqbūl card title, (575..725, y 138–162) | An āḥād report that must be acted on, in the view of the majority. It has what makes for acceptance, its narrator's truthfulness being proven, so the report's truth is overwhelmingly likely. Mutawātir needs no such test: all of it is accepted, because the truth of the report is certain (§5.7). |
| `mardud` | Panel 3, Mardūd card title, (575..725, y 308–332) | A report whose narrator's truthfulness is not established. When his untruthfulness is proven, the report's falsehood is overwhelmingly likely and it is repelled. A report held back, with no proof either way, is treated like the rejected: not because a cause for rejection was found, but because a cause for acceptance was not (§5.7). |

**Why "Held back" is not a term.** The translation's heading names a third class, the "paused upon", and §5.7 says it is treated like the rejected. `terms.yaml` has no separate slug for it, and *tawaqquf* is already the term for pausing between two conflicting accepted reports (§5.16, *Can both be acted on?*). Calling this card "Held back" keeps the two apart. Its meaning is carried by the `mardud` note, as the existing `mardud` def already does.

### 3.5 Views

None. The translation says acting on accepted āḥād is the view "of the majority" (§5.7), but it gives no other view to show.

### 3.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `kinds` | Two kinds | 0 | 260 |
| `check` | The check | 260 | 520 |
| `outcomes` | Three outcomes | 520 | 780 |

### 3.7 Motion

- **Streams:** the bypass bundle and the āḥād arrow `flow` left to right, the direction of the sorting.
- **The check:** the lens glyph makes one slow pass over the diamond (translate x −20 → +20 and back, 1.6s, once, delay 0.6s).
- **Outcomes:** the three exit arrows draw in one after another (stroke-dash, once, 0.3s apart, after the lens), then the cards fade in.
- **Reduced motion:** the base styles are the end state: lens at rest above the diamond, exits drawn, cards shown. The animations run *from* the start state, so `motion.css` leaves the end state.

### 3.8 Kit parts

Reuses `Chip`, `Decision`, `Glyph` (`lens`, `check`, `pause`), `Pill`, `Arrow`, `TermTitle` and the `Matn`-style card look for the outcome cards (plain `rect`s with the same classes as `Matn`'s `inactive`). New: `Glyph cross` (a drawn ✕ for rejected, same stroke as `check`), and the kit `Bracket` (§8). The dot-cluster inset is scene-local.

### 3.9 Translation slips

None that change meaning. The heading "5.6/5.7" runs two of the book's sections together; the site cites §5.6–5.7.

## 4. Scene 4: How sure can we be? (`knowledge`)

### 4.1 Header

```yaml
- id: knowledge
  division: adad-al-turuq
  moons: [0, 1]
  order: 4
  title: How sure can we be?
  eyebrow: How a report reached us, the knowledge it gives · §5.3, §5.7
  lede: Mutawātir gives certain knowledge, which anyone gains without reasoning. An āḥād report can give reasoned knowledge when signs back it, and that only to a scholar who can weigh them. With all three signs together it comes close to certainty.
  source: §5.3 Certain and reasoned knowledge, §5.7 Reports with supporting signs
  diagram: Knowledge
  width: 780
```

### 4.2 Form, and why it suits the idea

The idea is degrees of sureness, so the central form is a **knowledge meter**: one vertical column in three bands, top to bottom:

1. **ʿilm yaqīnī**, certain knowledge;
2. **ʿilm naẓarī**, reasoned knowledge;
3. the plain accepted report: its truth is overwhelmingly likely and it is acted on (§5.7). This band is a plain label, not a term.

Markers on the column place the kinds of report: mutawātir in the top band; "all three signs" at the top of the reasoned band, just under the certain line ("close to certain", §5.7); "āḥād with a sign" in the reasoned band; "āḥād, accepted" in the bottom band. The meter shows order only: it has no scale, ticks or numbers.

On the left, a small mutawātir fan feeds the top band. On the right, the three signs Ibn Ḥajar names are three cards, each sending a gold `lift` arrow into the reasoned band. This makes al-muḥtaff bi-l-qarāʾin a picture of what the signs *do*: lift an āḥād report up the meter.

A **"Who gains it?"** strip under panel 1 shows Ibn Ḥajar's own test for telling the two kinds of knowledge apart: a layperson reaches the certain band but not the reasoned one, while a ḥadīth scholar reaches both.

### 4.3 Sketch (780 × 520)

```
x→ 0          130          260│ 290  320(meter)350  362          520│ 540        650        780
 24 │ CERTAIN                   │ HOW SURE                           │ THE SIGNS
 60 │        ( ﷺ ) 130,60       │   ┌──────┐                         │ ┌ In both Ṣaḥīḥs ─────────┐ 540..770
    │      ↙  ↙  ↓  ↘  ↘         │   │▮▮▮▮▮▮│ al-ʿIlm al-yaqīnī (i)   │ │ ▤ al-Bukhārī  ▤ Muslim  │ 60..150
120 │   ○  ○  ○  ○  ○ (comp)    │   │ ●────┼── Mutawātir  y=105     │ │ uncriticised, no clash   │
170 │   ○  ○  ○  ○  ○ (succ)    │   ├──────┤ y=170 certain line     │ └──────────────┬──────────┘
    │                            │   │ ●────┼── all three signs y=182│ ⇦ lift ────────┘
220 │   ○  ○  ○  ○  ○ (later)   │   │▮▮▮▮▯▯│ al-ʿIlm al-naẓarī (i)   │ ┌ Mashhūr, clean routes ──┐ 170..260
    │                            │   │ ●────┼── āḥād with a sign     │ │ ⊙ ⊙ ⊙ three sealed routes│
260 │ Mutawātir → routes (link)  │   │      │      y=250            │ └──────────────┬──────────┘
280 │ not investigated (.lbl)    │   │      │                        │ ⇦ lift ────────┘
330 │ ─────────────────────────  │   ├──────┤ y=330                  │ ┌ A chain of imams ───────┐ 290..390
350 │ WHO GAINS IT?              │   │▮▮▯▯▯▯│ accepted: truth        │ │ [Mālik]→[al-Shāfiʿī]→[Aḥmad]│
380 │ [a layperson]  ▮✓ ▯✕       │   │ ●────┼── āḥād, accepted y=380 │ │          +1          +1 │
420 │ [a ḥadīth scholar] ▮✓ ▮✓   │   └──────┘ y=440                  │ └──────────────┬──────────┘
460 │ certain needs no reasoning │                                    │ ⇦ lift ────────┘
500 │                            │                                    │ al-Khabar al-muḥtaff bi-l-qarāʾin (i)  y=490
```

- **Panel 1, "Certain":**
  - A moon at (130,60), k=0.7, fanning to three rows of five figures at y=120 (sahabi), 170 (tabii) and 220 (later), k=0.5, as in `routes`' mutawātir column. The number of figures is illustrative.
  - The plain label "Mutawātir" at (130,260) is an in-SVG link to `routes` (its term lives there), with the `.lbl` "not investigated" under it.
  - A thin `flow` arrow from the fan's bottom row to the meter's mutawātir marker crosses into panel 2 at y=105. In portrait it reads as entering from the left edge, as in *Does anyone else carry it?*.
  - **Who gains it?** (y 350–470): two `Chip`s, "a layperson" at (20,380) and "a ḥadīth scholar" at (20,420). Beside each, a two-cell mini meter (8 × 14 cells, the top cell for certain, the bottom for reasoned) at x=190: the layperson has the certain cell filled with a `Glyph check` and the reasoned cell empty with a `Glyph cross`; the scholar has both filled and checked. The `.lbl` "certain needs no reasoning; reasoned needs evidence" closes the strip.
- **Panel 2, "How sure":**
  - The meter column at x=290..350, y=60..440, in three bands: y=60–170 (certain, darkest `--gold-b` mix), 170–330 (reasoned, middle), 330–440 (accepted, lightest), using `staircase.ts`'s `stepFill(lvl)` as Grades' ladder does.
  - The two term triggers are band labels to the right of the column, at x=362: `ilm-yaqini` at y=90 and `ilm-nazari` at y=210, with `rowTrigger`. The bottom band's label is plain `.lbl` text over two lines at y=360: "accepted: truth / overwhelmingly likely".
  - Markers are 5-unit dots on the column's centre line at x=320, each with a leader line to a `.lbl` at x=362: "Mutawātir" (y=105), "all three signs: close to certain" (y=182), "āḥād with a sign" (y=250), "āḥād, accepted" (y=380).
- **Panel 3, "The signs":**
  - Three sign cards, x 540..770: "In both Ṣaḥīḥs" (y 60–150), "Mashhūr, clean routes" (y 170–260), "A chain of imams" (y 290–390). Each card's title is a plain 13px heading, not a trigger.
    - Card 1: two `Glyph book`s with `Chip`s "al-Bukhārī" and "Muslim"; `.lbl` "not criticised; no unresolved clash".
    - Card 2: three short parallel routes of mini `later` figures (k=0.45) with scroll and seal, and the `.lbl` "no weak narrators, no hidden defects".
    - Card 3: `Chip`s "Mālik" → "al-Shāfiʿī" → "Aḥmad", left to right in the direction of narration, with a dashed `Chip` "+ a partner" under al-Shāfiʿī and under Aḥmad; `.lbl` "not gharīb".
  - From each card's bottom-left, a gold `Arrow variant="lift"` runs left to the meter's reasoned band, ending at x=355. The three arrows converge on the "āḥād with a sign" marker; a fourth thin gold leader joins all three to the "all three signs" marker.
  - The `muhtaff-bil-qarain` trigger is a 13px row title at (530,490): its estimated width is 33 × 6.7 + 24 ≈ 245, so the hit area ends at about 773, inside the panel. `panelTrigger` checks this at build time.

### 4.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `ilm-yaqini` | Panel 2, top band label, (356..488, y 77–95) | Mutawātir gives certain knowledge: a firm belief that matches the truth and forces a person to accept it, leaving no room to refute it. It comes without building evidence, so even a layperson, who cannot reason it out, gains it. That is why the narrators of mutawātir are not investigated: it must be acted on without that search (§5.3). |
| `ilm-nazari` | Panel 2, middle band label, (356..488, y 197–215) | Reasoned knowledge comes only by building evidence, ordering known or presumed facts to reach further ones, so only someone able to reason gains it. An āḥād report backed by signs gives it, by the chosen opinion, but only to a ḥadīth scholar versed in the narrators and hidden defects. Those who deny this keep the word knowledge for mutawātir: a dispute over words, Ibn Ḥajar says (§5.3, §5.7). |
| `muhtaff-bil-qarain` | Panel 3, bottom title, (524..773, y 477–495) | An āḥād report with signs that give reasoned knowledge. Ibn Ḥajar names three: being in both Ṣaḥīḥs, unless an expert criticised it or it clashes with no preference; a mashhūr with clean routes, free of weak narrators and hidden defects; and a chain of great imams that is not gharīb, such as Aḥmad from al-Shāfiʿī from Mālik, each with a partner. All three together come close to certainty (§5.7). |

**Extra** (Read as text only):

1. **Why the two Ṣaḥīḥs count as a sign** (§5.7). The standing of al-Bukhārī and Muslim in this field, their lead in telling the sound from the rest, and the scholars' acceptance of their books. That acceptance alone gives knowledge more strongly than many routes that fall short of mutawātir. It excludes reports an expert criticised, and two of their reports that clash with no way to prefer one. If it is said that scholars agreed only to act on these reports, Ibn Ḥajar answers that acting on every sound report is agreed anyway, so the two books would then have nothing special. Abū Isḥāq al-Isfarāʾīnī, and among the ḥadīth imams al-Ḥumaydī and Abū al-Faḍl ibn Ṭāhir, said these reports give reasoned knowledge. Abū Manṣūr al-Baghdādī and Abū Bakr ibn Fūrak said the same of the clean mashhūr.
2. **Why Mālik's presence counts** (§5.7). Anyone who knows this field knows that when a narrator like Mālik takes part in a report he is truthful in it; when another of his rank joins him, the fear of a mistake recedes further. This is what makes such a chain equal to one carried by a large number of others.

### 4.5 Views

The translation reports a rival view on mutawātir and rejects it (§5.3). Ibn Ḥajar's view is the default.

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: certain | §5.3 | Mutawātir gives certain knowledge, which needs no building of evidence, so a layperson gains it too. Ibn Ḥajar calls this the trusted opinion. |
| `nazari-only` | Some: reasoned only | "It has also been said", §5.3 | Some said mutawātir gives only reasoned knowledge. Ibn Ḥajar rejects this: a layperson, who cannot order facts into an argument, still gains knowledge from mutawātir, which could not happen if that knowledge were reasoned. |

Under `nazari-only`:

- the "Mutawātir" marker and its leader move from y=105 down into the reasoned band, at y=215 (`[data-view-show]` pair, so the trigger labels don't move);
- in the Who gains it? strip, the layperson's certain cell empties and a blinking "?" appears beside it, with the `.lbl` "yet he knows it" (`data-view-show="nazari-only"`). This shows Ibn Ḥajar's objection in the picture itself.

The other dispute in this part, over whether a report with signs gives "knowledge" at all (§5.7), is not a view: Ibn Ḥajar says it is a dispute over words, and both sides agree such reports are preferred. It is told in the `ilm-nazari` note instead (open question 7).

### 4.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `certain` | Certain | 0 | 260 |
| `meter` | How sure | 260 | 520 |
| `signs` | The signs | 520 | 780 |

### 4.7 Motion

- **Fan:** the mutawātir arrows `flow` down; the arrow into the meter `flow`s right.
- **Lifts:** the three lift arrows draw in one after another (stroke-dash, once, 0.4s apart, delay 0.8s). As the third lands, the "all three signs" marker brightens (opacity .4 → 1, once).
- **View change:** the mutawātir marker moves with a `transform` transition (0.5s). The "?" blinks (`blink`).
- **Reduced motion:** lifts drawn, marker bright, the marker swap instant, the "?" still. Base styles are the end state.

### 4.8 Kit parts

Reuses `Moon`, `Narrator`, `Arrow` (`flow`, `lift`), `Chip`, `Glyph` (`book`, `check`), `rowTrigger` and `panelTrigger`. New: `Glyph cross` (shared with scene 3). The meter column and its markers are scene-local; they follow Grades cell D's rank bar.

### 4.9 Translation slips

- **§5.3 "controvertible knowledge (ʿilm al-naẓar)".** "Controvertible" suggests knowledge open to refutation, which is not the sense; naẓarī is knowledge reached by reasoning. The site says "reasoned knowledge", as `terms.yaml` already does.
- **§5.7 "The dispute in reality is literal".** The sense is a dispute over words (lafẓī), not over substance. The site says "a dispute over words".
- **§5.7 "al-Isfarāʾinī".** The name is usually written al-Isfarāyīnī (or al-Isfarāʾīnī). Spelling query only; the extra uses al-Isfarāʾīnī until a ruling.

## 5. Scene 5: Where is the narrator alone? (`lone`)

### 5.1 Header

```yaml
- id: lone
  division: adad-al-turuq
  moons: [1]
  order: 5
  title: Where is the narrator alone?
  eyebrow: How a report reached us, absolute and relative gharīb · §5.8
  lede: A gharīb report has one narrator alone at some point in its chain. Where that happens decides its kind. If he is alone at the root, the Companion's end, it is absolute; if several narrate from the Companion and someone is alone further down, it is relative.
  source: §5.8 Gharīb and fard, absolute and relative; §5.5 the Intentions report
  diagram: Lone
  width: 1040
```

### 5.2 Form, and why it suits the idea

The difference between the two kinds is *where in the chain* the narrator is alone, and, for the absolute kind, *how far down* it lasts. So the form is **four chains side by side**, one per panel, with every lone link lit by a soft halo:

1. **walāʾ** (§5.8): one lone link, ʿAbd Allāh ibn Dīnār alone from Ibn ʿUmar;
2. **Branches of Faith** (§5.8): two lone links, Abū Ṣāliḥ alone from Abū Hurayra, then ʿAbd Allāh ibn Dīnār alone after him;
3. **Intentions** (§5.5): three lone links, ʿAlqama, Muḥammad ibn Ibrāhīm and Yaḥyā ibn Saʿīd, alone link after link: alone at the root, then twice more. The book doesn't name this report as a case where the singularity "continues throughout the transmission, or most of it" (§5.8), so the panel doesn't claim that either;
4. **gharīb nisbī**: several narrate from the Companion, then one narrator is alone from one of them, while the report reaches others by other routes. The translation gives no named example, so this column is an unnamed illustration, labelled as such.

Read left to right, the halo grows down the chain in panels 1–3, then jumps away from the root in panel 4. That is the whole lesson in one glance. The fard naming rule sits in panel 1 as a row under the muṭlaq title, because Ibn Ḥajar says fard is used mostly for this kind.

Rows are aligned across all four columns (moon y=60, then 135, 205, 275, 345), so the eye can compare depth. Generation rows are not labelled (no `LayerGuides`), because three Successors stack in panel 3.

### 5.3 Sketch (1040 × 520)

```
x→ 0       130       260│ 300      390      520│ 560      650      780│ 820   870  910  960   1040
 30 │ Gharīb muṭlaq (i)  │ Branches of Faith    │ Intentions           │ Gharīb nisbī (i)
 52 │ Fard (i) mostly…   │ also absolute        │ also absolute · §5.5 │ rarely called fard (.lbl)
 60 │     ( ﷺ ) 130,75   │     ( ﷺ ) 390,75     │     ( ﷺ ) 650,75     │      ( ﷺ ) 910,75
    │       ↓            │       ↓              │       ↓   told from  │    ↙     ↓      ↘
135 │  [Ibn ʿUmar]       │  [Abū Hurayra]       │  [ʿUmar]  the pulpit │ [Comp.] 870  (other Companion 990, faint)
    │       ↓            │       ↓              │       ↓              │  ↙  ↓  ↘          ↓
205 │ ░[ʿA. ibn Dīnār]░  │ ░[Abū Ṣāliḥ]░        │ ░[ʿAlqama]░          │ [·] [·] [·]       [·]  (k .7)
    │ alone from Ibn ʿUmar│      ↓              │       ↓              │  ↓   ↓   ↓
275 │       ┊ elided     │ ░[ʿA. ibn Dīnār]░    │ ░[M. ibn Ibrāhīm]░   │  ┊  ░[·]░  ┊       ┊
    │                    │       ┊              │       ↓              │     alone from
345 │                    │                      │ ░[Yaḥyā ibn Saʿīd]░  │     his shaykh
    │                    │                      │       ┊              │      ┊
420 │ The walāʾ report   │ The Branches of      │ al-Bukhārī's first   │ an illustration: the book
    │                    │ Faith report         │ report               │ names no example
460 │ alone at the root  │ alone at the root,   │ alone at the root,   │ alone further down;
480 │                    │ then again           │ then twice more      │ the report may be mashhūr
```

- **Figures:** k=0.75, names in `.lbl` to the right of each figure. Moons k=0.7 at y=75. Companions are `sahabi`; the rest `tabii` as in §1. In panel 4 the Companion is an unnamed `sahabi` figure (no name label) and the students are unnamed `tabii` figures at k=0.7; the lone narrator is a `later` figure.
- **Halo:** each lone figure sits on a rounded `rect` (44 × 46, from 27 above the figure's centre to 19 below, so the Labels-mode name under the figure stays clear of it) in a pale `--gold-a` mix, class `.alone`. The halo is decoration; the caption and the `.lbl` "alone…" carry the meaning.
- **Elided arrows:** below the last named narrator in each column, an `Arrow variant="elided"` runs to y≈400, because the book doesn't give the rest of the chain. Nothing is drawn as "many after him", since the translation doesn't say so.
- **Panel 3 extras:** a `.lbl` tag "told from the pulpit" beside ʿUmar (§5.5). The rest of the §5.5 argument is in Read as text (extra 1).
- **Panel 4:** the Companion at (870,135) has three students at x=830, 870, 910 (y=205). Under the middle one, a single lone narrator at (870,275) with its halo and the `.lbl` "alone from his shaykh". The side students carry on with elided arrows. A faint second Companion at (990,135), opacity .5, with one student below it, stands for "the report may reach us by other routes too", tagged "the report may be mashhūr".
- **Bottom labels:** each panel names its report at y=420 and states where the singularity is at y=460–480 (`.lbl`).

### 5.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `gharib-mutlaq` | Panel 1 title, (14..180, y 13–37) | The narrator is alone at the root of the chain, the Companion's end, where all its routes meet. In the report forbidding the sale or gift of walāʾ, ʿAbd Allāh ibn Dīnār alone narrates it from Ibn ʿUmar. In the Branches of Faith report, Abū Ṣāliḥ alone has it from Abū Hurayra, and ʿAbd Allāh ibn Dīnār alone after him. Sometimes it stays solitary through most of the chain (§5.8). |
| `fard` | Panel 1, row under the title, (14..70, y 39–57) | Fard and gharīb mean the same, in the language and as terms. In practice, as nouns, fard is used mostly for the absolute kind and gharīb mostly for the relative. As verbs they make no difference: either kind is said to be one that so-and-so was alone with (tafarrada bihi, aghraba bihi). Ibn Ḥajar compares this with how mursal and munqaṭiʿ are used (§5.8). |
| `gharib-nisbi` | Panel 4 title, (820..980, y 13–37) | More than one narrator has it from the Companion, then one narrator is alone with it further down. It is called relative because the singularity is relative to one particular person, even if the ḥadīth itself is mashhūr. The name fard is rarely used for this kind (§5.8). |

**Extra** (Read as text only):

1. **The Intentions report** (§5.5). Some who held that a sound report must be at least ʿazīz argued that the Intentions report is not really solitary: ʿUmar told it from the pulpit before the Companions, who would have objected had they not known it. Ibn Ḥajar answers that their silence proves nothing, and that even granting this for ʿUmar, it does not help with what follows: ʿAlqama alone narrates it from ʿUmar, Muḥammad ibn Ibrāhīm alone from ʿAlqama, and Yaḥyā ibn Saʿīd alone from Muḥammad. Other supporting routes appeared, but they do not count. Ibn Rushayd adds that its place as the first report in al-Bukhārī's Ṣaḥīḥ refutes the claim that being ʿazīz was al-Bukhārī's condition.

### 5.5 Views

None. The translation gives one account of the two kinds and of their names (§5.8).

### 5.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `wala` | Alone at the root | 0 | 260 |
| `branches` | Alone, then alone again | 260 | 520 |
| `intentions` | Alone link after link | 520 | 780 |
| `nisbi` | Alone further down | 780 | 1040 |

### 5.7 Motion

- **Chains:** the arrows `flow` down.
- **Halos:** the halos fade in one after another, top to bottom and left to right, once (each fades over 0.3s, starting 0.2s after the one before, from 0.6s), so the lone stretch is seen to grow down the chain from panel 1 to panel 3 and then appear lower in panel 4.
- **Reduced motion:** all halos shown. Base styles are the end state.

### 5.8 Kit parts

Reuses `Moon`, `Narrator`, `Arrow` (`flow`, `elided`), `TermTitle`, `rowTrigger` and `panelTrigger` with `SUBT_TRIGGER`. The halo `rect` is scene-local (one class in the scene's `<style>`).

### 5.9 Translation slips

None that change meaning. The translation's examples are only named; the report wording in footnotes 71–72 is the thesis author's and is not used.

## 6. The existing scene (`routes`)

`routes` is not redesigned. The only change is `order: 1` → `order: 2`, so that *What is a report?* opens the division.

The §5.5 translation has a real worked example of ʿazīz (the "no one truly believes until I am dearer to him than his father, his son…" report: from Anas, Qatāda and ʿAbd al-ʿAzīz ibn Ṣuhayb; from Qatāda, Shuʿba and Saʿīd; from ʿAbd al-ʿAzīz, Ismāʿīl ibn ʿUlayya and ʿAbd al-Wārith). It could later be added to `routes` as a Read as text `extra`, with the debate over whether ʿazīz is a condition of the sound. This is open question 8; it is not part of this division's build.

## 7. Note lengths

Each note was measured after writing, in Unicode code points. All 14 caption notes and the five view notes fit under the 400-character working cap, and so under the zod `max(420)`. The longest are `muhtaff-bil-qarain` at 398, `ilm-nazari` at 395 and `gharib-mutlaq` at 380; the longest view note is `nazari-only` at 254. All three extras fit the 900 limit (the longest is the Ṣaḥīḥs extra at 749).

## 8. New SVG kit parts (all scenes)

| Part | Props | Used in | Notes |
|---|---|---|---|
| `Bracket.astro` | `x0, x1, y` (horizontal) or `y0, y1, x` with `vertical`; `ticks: "up" \| "down" \| "left" \| "right"`; `arrow?: "start" \| "end"` | 1, 3 | Promotes the inline bracket path from `Support.astro` (its class `.bracket` moves to `svg.css`). The optional open arrowhead marks the isnād's direction "towards the matn". `Support.astro` switches to it in the same commit. |
| `Glyph` + `cross` | as `check` | 3, 4 | A drawn ✕, the stroke of `check`'s tick, for rejected and "not reached". |

Everything else is reused: `Chip`, `Gauge` (not needed; the meter is scene-local), `Matn`, `Decision`, `Pill`, `Arrow` (`flow`, `lift`, `elided`), `TermTitle`, `Narrator`, `Moon`, and the `geom.ts` triggers (`titleTrigger`, `rowTrigger`, `panelTrigger`, `SUBT_TRIGGER`). No new `figures.ts` kinds.

## 9. Owner's annotations

These are the owner's PDF annotations on these pages (PDF pp.52–91), used or proposed for use. They are to be added to `notes/annotation-usage.md` for approval. Rows marked "used" are reflected in the design above; rows marked "proposed" are not written into any note above.

| Page | Annotation (short) | Use | Status |
|---|---|---|---|
| p.52 | Three positions: the same; different; khabar is a superset of ḥadīth | Agrees with the three views of scene 1; no wording taken | used (structure) |
| p.81 | Treated like a rejected report, but not itself rejected | `mardud` note, as in the existing approved-pending row | used |
| p.90 | Sketch of fard muṭlaq (all through one narrator) against nisbī (gharīb only through one route, other Companions' routes not gharīb) | Scene 5 panel 4's layout: several students and a second, faint Companion. Its names (Nāfiʿ, Hishām, Mālik) are not used | used (layout) |
| p.53 | ṭuruq for ten or more, aṭruq for three to nine | Could add a line to the `isnad` note on the plural | proposed |
| p.80 | Raw materials checked for defects before they go into the factory | Could become scene 3's lede image ("checked before use") | proposed |
| p.80 | Relative gharīb: alone from a given shaykh, area or period | Only "a given person" is in the translation; the rest goes beyond it | not used |
| p.82 | The nobleman analogy: one witness plus known context gives near-certainty | Could illustrate the signs in scene 4; it is the owner's teacher's example | proposed |
| p.82 | Certainty is about whether he said it, not about how to act on it | Could add a sub-label to the meter ("sure he said it") | proposed |
| p.82 | The teacher's view that Ibn Ḥajar's "dispute over words" should be judged case by case | A teacher's reading, not in the translation | not used |
| p.69 | Mustafīḍ as mass-transmitted at every layer | Differs from the translation's "equal at start and end" | not used |
| p.58, p.61, p.74, p.83, p.90 | Notes on mutawātir's senses, ʿazīz's doubling tree, certainty being personal, Ibn al-Ṣalāḥ's usage | Belong to `routes` or go beyond the translation | not used |

## 10. Translation slips

These are to be added to `notes/translation-queries.md`.

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.3 (p.58–59) | "controvertible knowledge (ʿilm al-naẓar)" | Naẓarī means reached by reasoning, not open to refutation. The site says "reasoned knowledge". | |
| §5.7 (p.82) | "The dispute in reality is literal" | Likely lafẓī: a dispute over words, not substance. The site says "a dispute over words". | |
| §5.7 (p.83) | "al-Isfarāʾinī" | Usually al-Isfarāyīnī / al-Isfarāʾīnī. Spelling only. | |
| §5.5 (p.74) | "they offer a contentious answer" | Possibly "an answer open to question" (fīhi naẓar). The site's extra avoids characterising the answer. | |

## 11. Term map (all 14)

| # | Term | Scene | Where |
|---|---|---|---|
| 1 | khabar | report | Cell B, legend row 1 |
| 2 | hadith | report | Cell B, legend row 2 |
| 3 | isnad | report | Cell A, bracket label |
| 4 | matn | report | Cell A, under the text card |
| 5 | ahad | sorting | Panel 1, bracket label |
| 6 | mustafid | sorting | Panel 1, alias row on Mashhūr |
| 7 | maqbul | sorting | Panel 3, Maqbūl card |
| 8 | mardud | sorting | Panel 3, Mardūd card |
| 9 | ilm-yaqini | knowledge | Panel 2, top band |
| 10 | ilm-nazari | knowledge | Panel 2, middle band |
| 11 | muhtaff-bil-qarain | knowledge | Panel 3, bottom title |
| 12 | gharib-mutlaq | lone | Panel 1 title |
| 13 | fard | lone | Panel 1, row under the title |
| 14 | gharib-nisbi | lone | Panel 4 title |

The counts are report 4, sorting 4, knowledge 3 and lone 3, for 14; with `routes`' 4, the division's 18 terms are all on a scene. Pending: 0. View-only: 0.

## 12. Implementation outline

This follows the conventions of the phase 2 plan and the al-Maqbūl build: `rtk`, bun only, one commit per task, no trailers, LF, never staging `source/`. As in the al-Maqbūl build, kit, schema and test changes go into the commit of the scene that first needs them.

**Task 1: scene `report`.**
- Add `Report` to the `diagram` enum and `LEGEND`.
- Promote `Bracket` to the kit (with `vertical` and `arrow`), and switch `Support.astro` to it.
- YAML entry (§2), with `scene: report` on its 4 terms; `routes` to `order: 2`.
- `Report.astro` as a two-cell grid; cell A has `<Defs/>`. The three views move cell B's circles.
- Verify: `?view=apart` and `?view=nested`; `?khabar` from `?view=nested` stays on that view (the trigger is in every view); reduced motion swaps instantly.
- Commit `scenes: add what-is-a-report anatomy and names`.

**Task 2: scene `sorting`.**
- Add `Sorting` to the enum (no legend). Add `Glyph cross`.
- YAML (§3) and 4 terms.
- `Sorting.astro`, with three panels.
- Verify: `?mardud` lands in panel 3 in portrait; reduced motion shows the drawn exits and the cards.
- Commit `scenes: add which-reports-are-acted-on sorting gate`.

**Task 3: scene `knowledge`.**
- Add `Knowledge` to the enum and `LEGEND`.
- YAML (§4), 3 terms, two extras.
- `Knowledge.astro`, with three panels. The `nazari-only` view moves the mutawātir marker and shows the layperson's "?".
- Verify: `panelTrigger` accepts the long muḥtaff title; `?view=nazari-only`; `?muhtaff-bil-qarain` portrait landing; reduced motion shows the lifts drawn.
- Commit `scenes: add how-sure-can-we-be knowledge meter`.

**Task 4: scene `lone`.**
- Add `Lone` to the enum and `LEGEND`.
- YAML (§5), 3 terms, one extra.
- `Lone.astro`, with four panels.
- Verify: `?gharib-nisbi` lands in panel 4 in portrait; all halos show under reduced motion.
- Commit `scenes: add where-is-the-narrator-alone chains`.

**Task 5: tests and screenshots.**
- `routes.spec.ts` picks up four more routes from the sitemap.
- `scenes.spec.ts` gains: landing for all 14 terms, desktop and portrait; views on `report` (three) and `knowledge` (two); carousels on `sorting`, `knowledge` and `lone`; grid stacking on `report`; the legend kinds per scene; prev/next order in the division (report → routes → sorting → knowledge → lone).
- Add the four scenes to `motion.spec.ts`: with reduced motion, `getAnimations()` is empty.
- Screenshots: desktop and mobile, light and dark.
- Commits: `test: add adad-al-turuq scene tests` and `docs: add adad-al-turuq screenshots`.

**Task 6: spec and notes.**
- Spec §4.3: add a phase 3 division 1 table, one row per scene.
- `notes/translation-queries.md`: add §10.
- `notes/annotation-usage.md`: add the "used" rows of §9, and the "proposed" rows under Proposals.
- `divisions.yaml`: the moon labels are unchanged.
- Commit `docs: update spec and notes for adad-al-turuq`.

## 13. Open questions for the owner

1. **Order.** Should *What is a report?* open the division, moving `routes` to second? The alternative keeps `routes` first and puts the anatomy second.
2. **Generation colours.** Muḥammad ibn Ibrāhīm, Yaḥyā ibn Saʿīd, and ʿAbd Allāh ibn Dīnār in the Branches chain are drawn green (Successors) from general knowledge, not from the translation. Approve, or draw them black?
3. **Default khabar view.** The default is "one meaning", because the translation attributes it to "the scholars of this field" and introduces the others with "it is said". Is that the right default, or should the default be "general and particular", which fits Ibn Ḥajar's own reason for using khabar ("it covers more")?
4. **Empty circles.** In the `same` and `nested` views the circles hold only their names, because the translation defines those views only by how the names relate. Acceptable, or should the moon and figures appear in every view?
5. **The nisbī column.** Keep it as an unnamed illustration, or use the owner's p.90 sketch with names (Nāfiʿ, Mālik), labelled as a teacher's illustration rather than the book's?
6. **The `nazari-only` view.** Keep it as an Other view, since Ibn Ḥajar reports and refutes it, or keep it only in the `ilm-yaqini` note?
7. **The "dispute over words"** (§5.7). It is told in the `ilm-nazari` note, not as a view, because Ibn Ḥajar says both sides agree in substance. Agree?
8. **The ʿazīz example for `routes`.** Add the Anas report (§5.5) and the debate over ʿazīz as a condition of the sound to `routes` as Read as text extras, in a later task?
9. **"Held back".** The book's third class ("paused upon") is drawn as a plain card named "Held back", to keep it apart from tawaqquf (§5.16). Agree with the name, or prefer "Paused"?
10. **The Intentions chain twice.** It is the anatomy in scene 1 and the third column in scene 5. Is the repetition helpful (the same chain seen two ways), or should scene 1 use another report?
11. **Proposed annotations.** p.53 (ṭuruq and aṭruq), p.80 (the factory), p.82 (the nobleman; certainty is about attribution). Any to approve?

## 14. Interim decisions for the build

As for al-Maqbūl, the owner asked for development to continue while they review, so these defaults let the build go ahead. Each can be reversed once the owner rules; the PR description lists them.

- **Order:** *What is a report?* first; `routes` moves to `order: 2`. Nothing else in `routes` changes.
- **Generation colours from general knowledge:** acceptable. Each scene's Read as text names who is a Companion or a Successor only where the translation says so.
- **Default khabar view:** "one meaning" (`same`), following the translation's attribution.
- **Circle contents:** only in the `apart` view, as designed.
- **Nisbī column:** an unnamed illustration, labelled "the book names no example". The p.90 layout is used; its names are not.
- **`nazari-only` view:** kept, because it is in the translation with Ibn Ḥajar's refutation.
- **"Dispute over words":** a sentence in the `ilm-nazari` note, not a view.
- **ʿAzīz example for `routes`:** not added in this build.
- **"Held back":** the card's name, as designed.
- **Intentions chain:** used in both scenes 1 and 5.
- **Owner's annotations:** only the rows marked "used" in §9 go in. The "proposed" ones wait for approval in `notes/annotation-usage.md`.
- **Gauges and meters:** they show relative order only. No numbers, percentages or counts appear, so they can't be read as measured data. The mustafīḍ inset uses dots, not digits.
- **Arabic quoted from the reports: not shown anywhere.** Only English words of the reports appear, and at most a few. Term names keep their Arabic.
- **Translation slips:** all four are added to `notes/translation-queries.md` for a ruling. The site uses the wording given in §10 until then.
- **View swaps:** designed as transform transitions (spec §3.4). If that proves fiddly in the build, an instant swap is acceptable, as in the al-Maqbūl deviations.
