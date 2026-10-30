# Phase 3, division 5 (Laṭāʾif al-isnād): scene design

Date: 2026-10-29
Status: design for owner review. The owner's review sheet is `docs/superpowers/specs/2026-10-29-phase-3-lataif-review.json` (one entry per open question, with options and sketches). Scenes that no open question blocks are built on `design-lataif` while the owner reviews (§16, §18).
Spec: `docs/superpowers/specs/2026-10-28-nuzhah-visual-design.md`. Section numbers like spec §3.2 refer to it; bare § numbers (§5.45) refer to the book. "The al-Mardūd design" is `docs/superpowers/specs/2026-10-28-phase-3-mardud-design.md`; this doc follows its structure and the interim rules of the al-Maqbūl design (§13) and the al-Mardūd design (§18).

## 0. Summary

Division 5 has no scenes yet. Its **16 terms** get **six scenes**, one or two per moon, in the book's order. All 16 terms land on a scene; none stay pending.

| # | Scene | Path | Moons | Form | Terms | Views | Mobile |
|---|---|---|---|---|---|---|---|
| 1 | How near is the chain? | `/lataif-al-isnad/elevation/` | 0 | Three panels where **height is nearness**: two routes to the Prophet ﷺ, two routes to a great imam, then rows and a scale for when the shorter is not better | 4 | `ibn-hajar`, `reward` | 3 panels |
| 2 | Where does our route meet theirs? | `/lataif-al-isnad/meeting/` | 0 | Two cells of bead chains on level rows: the book's Qutayba example (muwāfaqa, badal) and its al-Nasāʾī example (musāwāh, muṣāfaḥa) | 4 | none | grid |
| 3 | Who narrates from whom? | `/lataif-al-isnad/peers/` | 1 | Four panels where **height is seniority**: peers side by side, peers both ways, the senior hearing from the junior (an arrow that climbs), and a family chain | 4 | none | 4 panels |
| 4 | How far apart did they die? | `/lataif-al-isnad/early-late/` | 1 | Three panels: the usual cause as life bars, then the book's two examples as a shaykh, two students and their deaths | 1 | none | 3 panels |
| 5 | Does the doubt harm it? | `/lataif-al-isnad/doubts/` | 2 | Three panels: one name that splits into two reliable men, a shaykh who denies outright, and a shaykh who does not recall, with the Suhayl loop | 2 | `most-correct`, `not-accepted` | 3 panels |
| 6 | What runs through every link? | `/lataif-al-isnad/chained/` | 2 | Three panels of chains where every link carries the same tag, and the Awwaliyya chain where the tags stop at Sufyān ibn ʿUyayna | 1 | none | 3 panels |

Scenes 4 and 6 have one term each. Open question q1 offers to fold them into scenes 3 and 5, giving four scenes.

Every scene uses the book's own worked example where the translation gives one:

- al-Bukhārī from Qutayba from Mālik, with routes through al-Bukhārī, through Abū al-ʿAbbās al-Sarrāj, and to al-Qaʿnabī (§5.46);
- al-Nasāʾī's chain with eleven between him and the Prophet ﷺ (§5.47);
- al-Silafī with Abū ʿAlī al-Burdānī and his grandson Abū al-Qāsim ibn Makkī, and al-Sarrāj with al-Bukhārī and Abū al-Ḥasan al-Khaffāf (§5.51);
- al-Bukhārī's unspecified "Aḥmad" from Ibn Wahb, and his unspecified "Muḥammad" (§5.52);
- Suhayl ibn Abī Ṣāliḥ, Rabīʿa and al-Darāwardī (§5.53);
- the Awwaliyya ḥadīth, enchained up to Sufyān ibn ʿUyayna (§5.54).

The translation gives no example for the two kinds of ʿuluww, for aqrān, mudabbaj, seniors from juniors or sons from fathers. Those panels are labelled illustrations ("the book names no example"), as in the al-Mardūd build. The thesis footnotes' examples (al-Zuhrī and Yaḥyā ibn Saʿīd with Mālik, footnote 210) are not used.

### Content rules followed

- Every note paraphrases the *translation* paragraphs of §5.45–5.54 only: the headings `5.45.` to `5.54.` in `source/nuzhah.txt`, each read up to its `Commentary` line, skipping the footnotes printed inside them (200–231). §5.51.1 "Conclusion" is the thesis author's and is not used.
- **No Arabic report wording anywhere.** The translation gives the reports and the delivery words in English. Term names keep their Arabic from `terms.yaml`. Speech bubbles and tags quote a few English words exactly as the translation has them: "I did not report this to him", "I do not remember this", "I heard", "I bear witness", "a date", "I believe in fate".
- **Counts are the book's own.** The bead chains of scene 2 draw exactly the numbers the book gives (eight, seven, eleven), and the family stack of scene 3 the book's fourteen; nothing is computed or measured. No gauges, percentages or axes with numbers. Elsewhere the bead counts are illustrations and say so.
- **Death years** in scene 4 are the translation's own, as labels. The gap between them is not stated as a number (§4.9, q3).
- **No Other views that aren't in the translation.** Both views (scenes 1 and 5) are opinions §5.45 and §5.53 report.
- Notes fit `note: z.string().max(420)`, working cap 400 (§10).

## 1. Shared decisions

- **Division id:** `lataif-al-isnad`. Scene ids `elevation`, `meeting`, `peers`, `early-late`, `doubts`, `chained`.
- **Order:** 1–6 as in §0, the book's order.
- **Moons:** `elevation` and `meeting` `[0]`; `peers` and `early-late` `[1]`; `doubts` and `chained` `[2]`. The moon labels in `divisions.yaml` are unchanged.
- **New `diagram` enum values:** `Elevation`, `Meeting`, `Peers`, `EarlyLate`, `Doubts`, `Chained`.
- **Two picture rules for the division.**
  - *Height is nearness* (scenes 1–2). ʿUluww means height. Each route ends in an "us" chip, and the fewer links a route has, the higher its "us" sits, on faint level rows. The eye reads elevation as elevation.
  - *Height is seniority* (scene 3). The senior stands higher. Arrows run from the one narrated from to the narrator, the way a report travels (as in every chain scene), so the usual arrow points down and the senior-from-junior arrow climbs.
- **Unnamed narrators as beads.** Long runs of unnamed links are small rings on a flowing line (new kit part `Beads`, §11), so a count can be seen without a crowd of figures.
- **Figures:** the figure language of spec §3.1–3.2, no new kinds. Named narrators are black (later) unless the chain itself makes them a Companion (he reports straight from the Prophet ﷺ) or a Successor (he reports from a Companion), or general knowledge does (Abū Hurayra, Abū Ṣāliḥ), as the al-Mardūd design allowed.
- **Legend and modes:** the scene page's `LEGEND` gains `Elevation: ["moon", "later", "weak", "liar"]`, `Meeting: ["moon", "later"]`, `Peers: ["moon", "sahabi", "tabii", "later"]`, `EarlyLate: ["later"]`, `Doubts: ["moon", "sahabi", "tabii", "later"]`, `Chained: ["moon", "later"]`. Beads are not a kind; scenes 1 and 2 say "each ring is a narrator" in a sub-label.
- **Terms file:** each of the 16 terms gets `scene:`. No term is view-only.
- **Cross-scene links** use `XLink`: muhmal to *Who is who?* (`al-asma/names#muttafiq-wa-muftariq`) and *Who is this narrator?* (`al-mardud/unknown#mubham`); musalsal to *How was it received?* (`siyagh-al-ada/delivery#samitu`); scene 4's al-Sarrāj back to scene 2 (`#muwafaqa`). All targets exist or are built in this division before the link.

## 2. Scene 1: How near is the chain? (`elevation`)

### 2.1 Header

```yaml
- id: elevation
  division: lataif-al-isnad
  moons: [0]
  order: 1
  title: How near is the chain?
  eyebrow: Features of the chain, elevation and descent · §5.45, §5.47
  lede: A chain with fewer narrators than another route of the same ḥadīth is elevated; one with more is descended. Every narrator might slip, so fewer links mean fewer chances of error, and scholars sought elevation keenly. It is counted either to the Prophet ﷺ or to a great imam.
  source: §5.45 ʿUluww, absolute and relative; §5.47 Nuzūl
  diagram: Elevation
  width: 780
```

### 2.2 Form, and why it suits the idea

The word is height, so the picture is height. Two routes of one ḥadīth run down from their source; each ends in an "us" chip; the shorter route leaves "us" higher. A thin wedge at the panel's left edge names the two ends: ʿuluww at the top, nuzūl at the bottom, order only.

1. **Absolute:** the source is the Prophet ﷺ.
2. **Relative:** the source is a great imam, with the same long chain above him for both routes; only the stretch below him differs.
3. **Is shorter always better?** Three short routes in rows (sound, with a weak link, with a liar) and a scale where a longer route with weightier men outweighs a shorter one. This panel carries the view.

### 2.3 Sketch (780 × 500)

```
x→ 0  14   60          130         200 260│ 290     390      490 520│ 540         650        760 780
 30 │       ʿUluww muṭlaq (i)              │   ʿUluww nisbī (i)        │  Is shorter always better?
 50 │    fewer narrators to the Prophet ﷺ  │ fewer narrators to an imam│
 82 │ ▲ʿUluww (i)  (ﷺ)                     │        (ﷺ)                │ (ﷺ)○─○─[us]  ✓ the most desired
    │ █        ╱      ╲                    │         ○                 │ (ﷺ)○─⊘─[us]  ⏸ still elevated in form
    │ █       ○        ○                   │         ○  ┊ however many │ (ﷺ)○─▣─[us]  ✕ counts as nothing
    │ █       ○        ○                   │         ○  ┊ above him    │
    │ █     [us] ←high ○                   │     [great imam]          │        ⚖  (tilts right)
    │ ▓     elevated   ○                   │      ╱        ╲           │  [shorter]        [longer]
    │ ▓                ○                   │     ○          ○          │               ▫ more authoritative men
    │ ▓                ○                   │   [us]          ○         │               ▫ sharper memory
    │ ▒              [us] ←low             │  elevated       ○         │               ▫ more learned in law
    │ ▼Nuzūl (i)     descended             │                 ○         │               ▫ a plainer connection
430 │ each ring is a narrator, and each    │               [us]        │ "no hesitation: the longer is better"
450 │ could slip: fewer links, fewer slips │ such as Shuʿba · Mālik ·  │
470 │ (an illustration)                    │ al-Thawrī · al-Shāfiʿī ·  │
    │                                      │ al-Bukhārī · Muslim       │
```

- **Wedge:** x 10..22, y 92..410, wide at the top, as `causes`' severity wedge. `uluww` is a row-title trigger at (26, 88) and `nuzul` at (26, 426), both inside panel 1.
- **Panel 1:** moon (130, 82, k .6). Left route x=80: 3 `Beads` (gap 34) then the "us" `Chip`; right route x=180: 7 beads then "us". Level rows (faint dashed lines across the panel, every 34) show that the left "us" sits four rows higher. Plain `.lbl` "elevated" / "descended" under the chips. The bead counts are illustrations.
- **Panel 2:** moon (390, 82); 3 beads down to the imam figure (`later`, reliable, k .8) with "a great imam"; a dashed vertical `Bracket` beside the upper beads, "however many above him". Under the imam, two routes: 1 bead → "us" (left), 5 beads → "us" (right). The chips row of imams (§5.45's list) at y 450–470.
- **Panel 3:** three rows of a mini chain drawn left to right (small moon k .35, two links, "us"): sound beads; a `weak` figure (k .4) in the middle; a `liar` figure (k .4). Each row ends in a `Pill`: "Most desired" (`accept`), "Elevated in form" (`pause`), "No elevation" (`reject`). Under them a `Scale` tilted towards the longer pan, labelled "shorter" and "longer". In Ibn Ḥajar's view the longer pan holds as many weights as the shorter, but larger and gold, so it shows weightier men, not more of them; the four reasons and the `.lbl` conclusion follow. The weights are drawn by the scene in the `Scale`'s right slot, so they change by view while the pan, and its tip, stay.

### 2.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `uluww` | Panel 1, top of the wedge, (≈20..80, y 75–93) | A chain is elevated when its narrators are fewer than in another chain of the same ḥadīth. The early scholars sought it so hard that it kept some from weightier matters. It is sought because it is nearer to soundness and to fewer mistakes: every narrator in a chain might err, so the longer the chain the more room for error, and the shorter the less (§5.45). |
| `uluww-mutlaq` | Panel 1 title, (≈55..205, y 8–38) | Absolute elevation: the shorter chain reaches the Prophet ﷺ himself with fewer narrators than another chain of the same ḥadīth. If that short chain is also sound, it is the most desired of all. If it is not, it still has the form of elevation, so long as it is not forged, since a forged chain is as if it did not exist (§5.45). |
| `uluww-nisbi` | Panel 2 title, (≈320..460, y 8–38) | Relative elevation: the narrators are fewer up to one of the great imams of ḥadīth, men known for memory, accuracy and writings, such as Shuʿba, Mālik, al-Thawrī, al-Shāfiʿī, al-Bukhārī and Muslim, even if the chain from that imam to its end is long. Muwāfaqa, badal, musāwāh and muṣāfaḥa are kinds of it (§5.45–5.47). |
| `nuzul` | Panel 1, foot of the wedge, (≈20..75, y 413–431) | Descent, the opposite of elevation: more narrators in the chain. Each kind of elevation has its own opposite kind of descent, against those who think it has none. A descended chain is the better one when it has what the elevated lacks: more authoritative men, sharper memory, more learning in law, or a plainer connection (§5.45, §5.47). |

### 2.5 Views

The translation reports one rival preference (§5.45). Ibn Ḥajar's is the default.

| id | Label | Scholars | Note |
|---|---|---|---|
| `ibn-hajar` | Ibn Ḥajar: the weightier chain | §5.45 | Elevation is sought because it is nearer to soundness. But when a longer chain has something the shorter lacks, such as more authoritative narrators, sharper memory, more learning in law or a plainer connection, there is no hesitation in calling the longer better. |
| `reward` | Some: always the longer | Those who prefer it, §5.45 | Some prefer the longer chain in general, since studying more narrators takes more toil and so earns more reward. Ibn Ḥajar answers that this prefers it for a reason foreign to the matter, with no bearing on whether the ḥadīth is sound or weak. |

Under `reward` (panel 3 only): the longer pan holds more plain weights, for more narrators; the four reasons give way to one line, "more toil, more reward"; a dashed `ViewTag` "Some: always the longer" sits over the scale; and the conclusion becomes "Ibn Ḥajar: a reason outside soundness and weakness". The scale's tilt doesn't change. Open question q4 offers to drop the view.

### 2.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `absolute` | Nearer the Prophet ﷺ | 0 | 260 |
| `relative` | Nearer a great imam | 260 | 520 |
| `better` | Is shorter always better? | 520 | 780 |

### 2.7 Motion

- The bead lines `flow` down; the "us" chips enter once, the shorter route's first (`m-enter`, `stagger`), so the eye sees which arrives higher.
- Panel 3: the scale's beam settles once (`m-enter` with `--from-t` a small rotation); the liar row's cross draws (`m-draw`).
- Reduced motion: everything at rest in its end state (base styles).

### 2.8 Kit parts

Reuses `Moon`, `Narrator` (`later`, `weak`, `liar`), `Arrow`, `Chip`, `Pill`, `Scale`, `Bracket`, `ViewTag`, `TermTitle`, `titleTrigger`, `rowTrigger`, `viewAttrs`/`data-view-show`. New: `Beads` (§11). The wedge and the level rows are scene-local.

### 2.9 Translation slips

- **§5.45 (p.316) "highly-attributed imām".** The sense is an imam of high standing. Not a meaning slip; the site says "a great imam".

## 3. Scene 2: Where does our route meet theirs? (`meeting`)

### 3.1 Header

```yaml
- id: meeting
  division: lataif-al-isnad
  moons: [0]
  order: 2
  title: Where does our route meet theirs?
  eyebrow: Features of the chain, kinds of relative elevation · §5.46–5.47
  lede: A later narrator compares his own route with a great compiler's. He may reach the compiler's shaykh, or that shaykh's shaykh, without passing through the compiler; or his count of narrators may equal the compiler's, or the compiler's student's.
  source: §5.46 Muwāfaqa and badal, §5.47 Musāwāh and muṣāfaḥa
  diagram: Meeting
  width: 860
```

### 3.2 Form, and why it suits the idea

Both pairs are about *where* our route joins a compiler's tree and *how many* links it takes. Both have a worked example with counts. So each cell is a small tree of named narrators with bead runs of exactly the book's counts, on level rows, keeping the "height is nearness" rule of scene 1. A grid of two cells (the Causes and Identity pattern), each its own `<svg viewBox="0 0 430 560">`; cell A holds `<Defs/>`.

### 3.3 Sketches (each cell 430 × 560)

Cell A, "Meeting a compiler's shaykh":

```
x→ 0    60   110   170  215        330      430
 26 │      Meeting a compiler's shaykh         (subt)
 46 │  al-Bukhārī, from Qutayba, from Mālik     (.lbl)
 70 │                 (ﷺ) ┊ elided              moon k .4
120 │               [Mālik]
170 │         [Qutayba]          [al-Qaʿnabī]   ← Badal (i): "in Qutayba's place"
202 │   [al-Bukhārī]  [al-Sarrāj]      ┊
    │      ○             ○             ┊ by another route
    │      ○             ○             ┊ (the book gives no count)
    │      …             …             ┊
426 │      ○           [us] ← Muwāfaqa (i): seven, one link fewer
458 │    [us]  eight between us and Qutayba     [us]
500 │  mostly said when the route is also shorter, but used without it too
```

- Rows every 32 from Qutayba (y=170). Through al-Bukhārī: al-Bukhārī + 7 beads, "us" on row 9 (y 458). Through al-Sarrāj: al-Sarrāj + 6 beads, "us" on row 8 (y 426), one row higher. The difference of one row is the book's: eight against seven.
- al-Qaʿnabī's route is an `elided` arrow that stops part-way with the note "to us by another route: no count given". It has no "us" chip, whose height would read as a count.
- Five named `later` figures, k .6, reliable, names to the right.

Cell B, "Matching a compiler's count":

```
x→ 0     90        215        340     430
 26 │      Matching a compiler's count
 46 │  al-Nasāʾī: eleven between him and the Prophet ﷺ
 64 │                 (ﷺ)
    │          ╱       │       ╲
    │         ○        ○        ○          eleven rings in each of the first two columns,
    │         ○        ○        ○          twelve in the third (level rows every 26)
    │         …        …        …
406 │    [al-Nasāʾī] ══ [us] ← Musāwāh (i): level with al-Nasāʾī
432 │    [his student] ═══════ [us] ← Muṣāfaḥa (i): level with his student
470 │                  🤝 as if we had met him and shaken his hand
510 │  our route does not pass through al-Nasāʾī
```

- Columns at x = 90 (al-Nasāʾī's chain), 215 (our route for musāwāh), 340 (our route for muṣāfaḥa). Rows every 26 from the moon at y=64; row 12 (y≈376+30) holds al-Nasāʾī and the musāwāh "us"; row 13 holds al-Nasāʾī's student (a plain `later` figure, unnamed) and the muṣāfaḥa "us".
- Dashed level lines join al-Nasāʾī to the first "us" and his student to the second. A handshake `Glyph` (new kind, §11) sits on a dashed tie from the second "us" up to al-Nasāʾī.
- Only "eleven" is written. The third column's extra ring is not counted in words: it is the student's row, shown by height.

### 3.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `muwafaqa` | Cell A, row label right of the al-Sarrāj "us", (≈240..330, y 417–435) | A kind of relative elevation: reaching a compiler's shaykh by a route that does not pass through the compiler. al-Bukhārī reports a ḥadīth from Qutayba from Mālik. Through al-Bukhārī there are eight between us and Qutayba; through Abū al-ʿAbbās al-Sarrāj from Qutayba, seven. So we meet al-Bukhārī at his own shaykh, by a shorter route (§5.46). |
| `badal` | Cell A, row label under al-Qaʿnabī, (≈300..345, y 187–205) | Also a kind of relative elevation: reaching the shaykh of the compiler's shaykh in the same way. In the book's example the same chain comes by another route to al-Qaʿnabī from Mālik, so al-Qaʿnabī stands in Qutayba's place. Both names are mostly used when the route is also shorter, but are used without that too (§5.46). |
| `musawah` | Cell B, row label right of the first "us", (≈245..320, y 397–415) | A kind of relative elevation: the count of narrators from us to the end of our chain equals that in a compiler's chain. al-Nasāʾī reports a ḥadīth with eleven people between him and the Prophet ﷺ; the same ḥadīth reaches us by another chain with eleven between us and him. So we equal al-Nasāʾī in number, by a chain that is not his (§5.47). |
| `musafaha` | Cell B, row label right of the second "us", (≈370..425, y 423–441) | A kind of relative elevation: our count equals that of the compiler's student. It is named after the handshake that two people usually exchange when they meet: in this form we have all but met al-Nasāʾī, so it is as if we had shaken his hand (§5.47). |

### 3.5 Views

None. "Mostly said with elevation, but also without it" (§5.46) is a usage note, shown as cell A's footer line.

### 3.6 Grid cells

Cell 1 Meeting a compiler's shaykh (A), cell 2 Matching a compiler's count (B). Side by side on desktop, one column in portrait.

### 3.7 Motion

- Bead lines `flow` down. The "us" chips enter once, top to bottom (`m-enter`, `stagger`), so the higher one lands first. The level ties draw in after them (`m-draw`).
- Reduced motion: chips shown, ties drawn.

### 3.8 Kit parts

Reuses `Moon`, `Narrator`, `Arrow` (`flow`, `elided`), `Chip`, `Glyph`, `TermTitle`, `rowTrigger`. New: `Beads`, `Glyph handshake` (§11).

### 3.9 Translation slips

- **§5.46 (p.321) "there will be eight [reporters] between him and Qutayba … seven [reporters] between him and Qutayba".** The count is between *us* and Qutayba. The site says "between us and Qutayba".
- **§5.47 (p.323) "Hence we have equalled al-Nasāʾī in terms of number, in exclusion to that specific isnād".** The sense is "without his particular chain". The site says "by a chain that is not his".

## 4. Scene 3: Who narrates from whom? (`peers`)

### 4.1 Header

```yaml
- id: peers
  division: lataif-al-isnad
  moons: [1]
  order: 3
  title: Who narrates from whom?
  eyebrow: Features of the chain, who narrates from whom · §5.48–5.50
  lede: Usually a younger man narrates from an older one. But peers narrate from each other, sometimes both ways; a senior may narrate from a junior; and a son may narrate from his father and grandfather, generation after generation.
  source: §5.48 Aqrān and mudabbaj, §5.49 Seniors from juniors, §5.50 Sons from fathers
  diagram: Peers
  width: 1040
```

### 4.2 Form, and why it suits the idea

The four terms differ only in *who stands where* and *which way the arrow runs*. So height is seniority, and the arrow follows the report:

1. **Peers** stand on one level under a shared shaykh; one arrow runs sideways.
2. **Mudabbaj**: the same pair with arrows both ways, and an inset of two nested rings (every mudabbaj is a peers' narration, not the reverse). Below, the debated case of a shaykh and his student who narrate from each other.
3. **Seniors from juniors**: three pairs (father and son, Companion and Successor, shaykh and student) whose arrow *climbs*, with the usual falling arrow faint beside each.
4. **Sons from fathers**: a family column falling from the Prophet ﷺ, the two readings of "his grandfather", and the book's fourteen fathers as a tall stack of rings.

The two long titles (panels 3 and 4) are set in the 13px bold face, so the panels can be equal (see Deviations in the build).

### 4.3 Sketch (1040 × 500)

```
x→ 0       120      240│ 300  360      480│ 540  600   690   760 780│ 820   880   960   1010 1040
 30 │ Riwāyat al-aqrān (i)│  Mudabbaj (i)    │ Riwāyat al-akābir ʿan al-aṣāghir (i)│ Riwāyat al-abnāʾ ʿan al-ābāʾ (i)
 50 │ alike in age or     │ each from the    │ the senior hears from the junior    │ from his father, from his
    │ in shaykhs          │ other            │                                     │ grandfather
110 │      [shaykh]       │    [shaykh]      │ [father]  [Companion]  [shaykh]     │   (ﷺ)        (ﷺ)        ○
    │      ╱     ╲        │    ╱     ╲       │    ▲ ┊       ▲ ┊          ▲ ┊      │    │          │          ○
230 │  [peer] ←── [peer]  │ [peer] ⇄ [peer]  │    │ ┊       │ ┊          │ ┊      │ [grandfather][his grand-  ○
    │  ▬▬▬▬▬▬             │  ◯⊃◎ every mud-  │ [son]   [Successor]   [student]   │    │        father] gold  ○ fourteen
    │   ▬▬▬▬▬▬            │  abbaj is aqrān  │  ┊ faint: the usual way, common    │ [father]    │            ○ fathers,
    │  alike in age       │                  │                                     │    │      [father]        ○ the most
360 │                     │ [shaykh]         │ younger · lower in rank · less in  │ [narrator] [narrator]     ○ found
    │                     │   ⇅  mudabbaj?   │ meeting the shaykhs                 │ "his" =     "his" =
    │                     │ [student] debated│                                     │ the narrator's  the father's
    │                     │ apparently not → │ tells the ranks apart and puts      │
440 │ a book: Abū al-Shaykh│ a book:         │ people in their place               │ al-ʿAlāʾī sorted them;
    │ al-Iṣbahānī          │ al-Dāraquṭnī    │ al-Khaṭīb wrote on both             │ Ibn Ḥajar added more
470 │ an illustration: the book names no example (panels 1–3)
```

- **Panel 1 (0..240):** shaykh at (120,110), peers at (70,230) and (170,230), all `later`, k .7. `flow` arrows from the shaykh to each; a sideways arrow from the right peer to the left. Two `Lifespan` bars (no dates), almost equal, at y 270 and 284: "alike in age". `.lbl` "or took from the same shaykhs".
- **Panel 2 (240..480):** the same trio at x 300, 360 (shaykh), 420; two bowed arrows between the peers, one each way. The inset: an outer ring "aqrān" holding an inner ring "mudabbaj" (scene-local circles, as in *What is a report?*). A `.lbl` "from dībāj, the two cheeks: alike on both sides". Lower: a shaykh (y 330) above his student (y 400) with arrows both ways and the label "mudabbaj? debated; apparently not: it is seniors from juniors →" (the arrow points at panel 3).
- **Panel 3 (480..780):** three pairs at x 560, 650, 740: father over son (`later`), Companion over Successor (`sahabi` over `tabii`), shaykh over student (`later`). Each pair has a solid climbing arrow (junior → senior) and a faint dashed falling arrow, "the usual way". Three tags under them for what "below" means, and the benefit line.
- **Panel 4 (780..1040):** column (a) at x 830: moon, grandfather (`sahabi`), father, narrator; a `Bracket` "his = the narrator's". Column (b) at x 920: moon, "his grandfather" (`sahabi`, gold), father, narrator, with the father's grandfather tied to the father by a dashed arrow, and a `Bracket` "his = the father's". At x 1010, `Beads` n=14 (gap 18), "fourteen fathers in a row, the most Ibn Ḥajar found".

### 4.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `aqran` | Panel 1 title, (≈40..200, y 8–38) | A narrator reports from someone like himself in a matter of narration, such as age, or taking from the same shaykhs. It is named after the aqrān, peers, because the narrator is his like. Abū al-Shaykh al-Iṣbahānī wrote a book on it (§5.48). |
| `mudabbaj` | Panel 2 title, (≈305..415, y 8–38) | Each of two peers reports from the other. Every mudabbaj is a peers' narration, but not the reverse. When a shaykh and his student report from each other, it is debated; apparently it is not mudabbaj but seniors from juniors, since the name comes from the two cheeks of the face, alike on both sides. al-Dāraquṭnī wrote a book on it (§5.48). |
| `akabir-an-asaghir` | Panel 3 title, (≈500..760, y 8–38) | A narrator reports from someone below him: younger, lower in rank, or one who met fewer shaykhs, or met them later. It includes fathers from sons, Companions from Successors and a shaykh from his student. The reverse is common, being the usual way. Knowing it tells the ranks apart and puts people in their place. al-Khaṭīb wrote on fathers from sons and on Companions from Successors (§5.49). |
| `abna-an-aba` | Panel 4 title, (≈795..1025, y 8–38) | The opposite case: a narrator reports from his father, from his grandfather. al-ʿAlāʾī compiled a large volume on those who did so up to the Prophet ﷺ, sorting them by whether "his" in "from his grandfather" is the narrator or his father. Ibn Ḥajar summarised it and added many more. The longest run from father to son he found was fourteen fathers (§5.50). |

### 4.5 Views

None. The mudabbaj debate (§5.48) is about a name, shown as a plain label, as the al-Mardūd design did for naming habits.

### 4.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `peers` | Peers | 0 | 260 |
| `mutual` | Each from the other | 260 | 520 |
| `seniors` | Senior from junior | 520 | 780 |
| `fathers` | Son from father | 780 | 1040 |

### 4.7 Motion

- Arrows `flow`. In panel 3 the climbing arrows draw in once, after the faint falling ones (`m-draw`, `stagger`), so the reversal is seen happening. Panel 4's fourteen rings enter top to bottom (`m-enter`, `stagger`).
- Reduced motion: all drawn and shown.

### 4.8 Kit parts

Reuses `Moon`, `Narrator`, `Arrow`, `Lifespan`, `Bracket`, `TermTitle`, `titleTrigger`. New: `Beads`. The nested rings are scene-local.

### 4.9 Translation slips

- **§5.49 (p.326) "less than him in age, or in terms of [frequency of] meeting or in terms of rank".** The bracket is the translator's. The sense is likely "in meeting [the shaykhs]", being later in the chain of teachers, which `terms.yaml` follows ("later to the teachers"). The site says "or met fewer shaykhs, or later", with no visible bracket.
- **§5.48 heading "the Contemporaries".** The site uses `terms.yaml`'s "Peers' narration". Not a meaning slip.

## 5. Scene 4: How far apart did they die? (`early-late`)

### 5.1 Header

```yaml
- id: early-late
  division: lataif-al-isnad
  moons: [1]
  order: 4
  title: How far apart did they die?
  eyebrow: Features of the chain, early and late · §5.51
  lede: Two narrators may share a shaykh and yet die far apart. Most often the younger heard the shaykh in his last days and lived long after, while the other had died long before.
  source: §5.51 al-Sābiq wa-l-lāḥiq
  diagram: EarlyLate
  width: 780
```

### 5.2 Form

1. **Why it happens:** three `Lifespan` bars with no dates: the shaykh; the early student, who hears him early and dies; the late student, who hears him in his last days and lives long after. Gold "heard" knots where each heard, a bracket between the two ends.
2. **The widest gap:** al-Silafī over his two students, Abū ʿAlī al-Burdānī and his grandson Abū al-Qāsim ʿAbd al-Raḥmān ibn Makkī; under them a death rule with two marks labelled with the translation's dates (d. 500/1106, d. 650/1252), not to scale.
3. **An older example:** al-Sarrāj over al-Bukhārī (d. 256/870), who heard from him though he was his student, and Abū al-Ḥasan al-Khaffāf (d. 393/1002), the last to hear from him. Two links: "a senior hearing from his student →" (`peers#akabir-an-asaghir`) and "al-Sarrāj's route to Qutayba →" (`meeting#muwafaqa`).

### 5.3 Term trigger

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `sabiq-wa-lahiq` | Panel 1 title, (≈40..220, y 8–38) | Two narrators share in reporting from one shaykh, and one dies long before the other. The widest gap Ibn Ḥajar found: Abū ʿAlī al-Burdānī, who narrated from al-Silafī, died in 500, and the last to hear from al-Silafī, his grandson Abū al-Qāsim ibn Makkī, died in 650. Most often the younger heard the shaykh in his last days and lived long after (§5.51). |

**Extra** (Read as text): **An older example** (§5.51). al-Bukhārī heard some reports on history and the like from his own student Abū al-ʿAbbās al-Sarrāj, and died in 256. The last to hear from al-Sarrāj was Abū al-Ḥasan al-Khaffāf, who died in 393.

### 5.4 Views, panels, motion, kit

- Views: none.
- Panels: `why` 0..260 "Why it happens", `widest` 260..520 "The widest gap", `older` 520..780 "An older example".
- Motion: the "heard" knots draw in once; the death marks enter, the early one first. Reduced motion: drawn.
- Kit: `Lifespan`, `Narrator`, `Arrow`, `Bracket`, `XLink`, `TermTitle`. The death rule is scene-local.

### 5.5 Translation slips

- **§5.51 (p.332) "one hundred and sixty years".** The translation's own dates, 500 and 650, are 150 years apart. The site states no number ("the widest gap Ibn Ḥajar found") until the Arabic is checked.
- **§5.51 "al-Silafī who was one of his shaykhs".** Whose shaykh is unclear: the parallel example has al-Bukhārī hearing from his own student, so the sense may be that al-Burdānī was al-Silafī's shaykh. The site says only that both heard from al-Silafī.
- **§5.51 "al-Salafī" / "al-Silafī", "al-Burdānī".** Spellings vary in the translation; the site writes al-Silafī and al-Burdānī (as the translation mostly does). With the existing "Sarrāj" row.

## 6. Scene 5: Does the doubt harm it? (`doubts`)

### 6.1 Header

```yaml
- id: doubts
  division: lataif-al-isnad
  moons: [2]
  order: 5
  title: Does the doubt harm it?
  eyebrow: Features of the chain, doubts about the shaykh · §5.52–5.53
  lede: Two doubts can touch the link between a narrator and his shaykh. The shaykh's name may fit two men; or the shaykh himself may deny the report. Whether the report survives depends on the men, and on what exactly the shaykh says.
  source: §5.52 Muhmal, §5.53 Man ḥaddatha wa-nasiya
  diagram: Doubts
  width: 780
```

### 6.2 Form

1. **Which Aḥmad?** al-Bukhārī under an "Aḥmad" who is under Ibn Wahb. The "Aḥmad" figure splits into two reliable men, Aḥmad ibn Ṣāliḥ and Aḥmad ibn ʿĪsā; an `accept` pill "no harm: both are reliable". Then the second example as two chips ("Muḥammad": ibn Salām, or ibn Yaḥyā al-Dhuhlī), the fallback line, and two links that tell muhmal from its neighbours.
2. **He denies it:** a shaykh over his student. The shaykh's bubble "I did not report this to him"; the student has no bubble, only the label "his student reports it from him". The report is an `inactive` `Matn` card with a `reject` pill "dropped"; both men keep their seals, "neither is discredited".
3. **He does not recall:** the shaykh's bubble "I do not remember this"; the report card stays with an `accept` pill "accepted, on the most correct opinion". Under it the Suhayl loop: Abū Hurayra → Abū Ṣāliḥ → Suhayl → Rabīʿa → al-Darāwardī, with a looping arrow back from Rabīʿa to Suhayl, "Rabīʿa told me that I told it to him".

### 6.3 Sketch (780 × 520)

```
x→ 0   60   130  200 260│ 290  350  420    520│ 540  590     680     760 780
 30 │    Muhmal (i)      │ Man ḥaddatha wa-nasiya (i) │   He does not recall
 50 │ one name, two men  │   he denies it outright    │
 92 │   [Ibn Wahb]       │  [shaykh] ╭"I did not      │ [shaykh] ╭"I do not remember this"╮
    │       ↓            │           │report this to  │     ↓
150 │ [Aḥmad?] → [A. ibn │           ╰him"            │ [student] reports it from him
    │  Ṣāliḥ] [A. ibn ʿĪsā]│    ↓                     │ ┌ report ┐ ✓ accepted, on the most
220 │       ↓            │  [student] reports it from him  │ └────────┘   correct opinion
    │  [al-Bukhārī]      │  ┌ report ┐ ✕ dropped      │ he may have forgotten; affirming
280 │ ✓ no harm: both    │  └ - - - -┘                │ comes before denying
    │   are reliable     │ one of them lied, we can't │ (ﷺ)
330 │ "Muḥammad": [ibn   │ say which; neither is      │ [Abū Hurayra] → [Abū Ṣāliḥ] → [Suhayl]
    │ Salām] [ibn Yaḥyā  │ discredited                │                         ↓   ↖ loop
    │ al-Dhuhlī]         │                            │                      [Rabīʿa] ─┘
420 │ can't tell? outside│                            │                         ↓
    │ signs, weight of   │                            │                   [al-Darāwardī]
460 │ evidence           │                            │ "Rabīʿa told me that I told it
480 │ not two men taken  │                            │  to him, from my father"
    │ as one → Who is who?│                           │
500 │ not unnamed → Who is this narrator?             │
```

- **Panel 1:** Ibn Wahb (130, 92), "Aḥmad" (130, 160), al-Bukhārī (130, 230), all `later`, k .7. The "Aḥmad" figure is drawn twice at x 95 and 165 (reliable, names under each) and once at x 130 with the scroll "Aḥmad" only; the single figure fades as the two step apart. Labels-mode name "Narrator". Two `XLink`s at the foot.
- **Panel 2:** shaykh (330, 100) and student (330, 220), `later`, k .7, reliable; `SpeechBubble`s with `en` only (the al-Mardūd design made `ar` optional). The report card is `Matn inactive` with a `Glyph cross`.
- **Panel 3:** the same pair at x 590; the report card plain, with `Glyph check`. The Suhayl loop is a horizontal-then-down chain at k .55: Abū Hurayra (`sahabi`), Abū Ṣāliḥ (`tabii`), Suhayl, Rabīʿa, al-Darāwardī (`later`). The loop is a bowed `Arrow` from Rabīʿa back up to Suhayl.

### 6.4 Term triggers

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `muhmal` | Panel 1 title, (≈80..180, y 8–38) | A narrator reports from two men who share a name, a father's or grandfather's name, or a nisba, and nothing tells them apart. If both are reliable, it does no harm. al-Bukhārī reports from an "Aḥmad", with no more said, from Ibn Wahb: Aḥmad ibn Ṣāliḥ or Aḥmad ibn ʿĪsā. When the two can't be told apart, scholars turn to outside signs and the weight of evidence (§5.52). |
| `man-haddatha-wa-nasiya` | Panel 2 title, (≈295..485, y 8–38) | A shaykh denies a report passed on from him. If he denies it outright, saying he lied or that he did not report it, one of the two has lied, though we can't say which; the report is rejected, but neither man is discredited by it. If he says only that he does not remember it, the report is accepted on the most correct opinion, since he may have forgotten (§5.53). |

**Extra** (Read as text): **The Suhayl case** (§5.53). al-Dāraquṭnī wrote a book on those who narrated and forgot, with many cases that support accepting the report: narrators who no longer recalled a ḥadīth, and came to narrate it from those they had told it to. So Suhayl ibn Abī Ṣāliḥ had a report from his father, from Abū Hurayra, in the story of the testimony and the oath. al-Darāwardī heard it from Rabīʿa, from Suhayl; when he asked Suhayl, Suhayl did not know it, and was told that Rabīʿa had it from him. Afterwards Suhayl would say that Rabīʿa told him that he had told it to him, from his father.

### 6.5 Views

The translation reports a rival ruling on "I do not remember" (§5.53). The most correct opinion is the default.

| id | Label | Scholars | Note |
|---|---|---|---|
| `most-correct` | Ibn Ḥajar: accepted | The most correct opinion, §5.53 | When the shaykh says only that he does not remember, the report is accepted, since he may have forgotten. The student's trustworthiness means he is truthful, and the shaykh's not knowing does not cancel that: affirming comes before denying. al-Dāraquṭnī's book on those who narrated and forgot supports this. |
| `not-accepted` | Some: not accepted | "It is also said", §5.53 | Some say it is not accepted: the student is the periphery and the shaykh the core, and as the periphery follows the core in affirming a report, so it should in denying it, as with a witness to a witness. Ibn Ḥajar answers that the cases differ: a witness's witness is not heard when the first witness can testify, while narration is. |

Under `not-accepted` (panel 3 only): the pill swaps to a dashed `reject` "not accepted"; a dashed `ViewTag` "it is also said"; the shaykh and student gain small tags "core" and "periphery", the translation's words; and the reason line becomes "Ibn Ḥajar: testimony is a different case". Panel 2 does not change: the outright denial's ruling is not disputed.

### 6.6 Panels

| id | Label | x0 | x1 |
|---|---|---|---|
| `muhmal` | One name, two men | 0 | 260 |
| `denied` | He denies it | 260 | 520 |
| `forgot` | He does not recall | 520 | 780 |

### 6.7 Motion

- Panel 1: the one "Aḥmad" gives way to two (`m-enter` with `--from-t` from the centre; the single figure rests hidden). The `?` between them blinks.
- Panel 2: the cross on the card draws in (`m-draw`). Panel 3: the loop arrow flows.
- Reduced motion: the two men shown, the cross drawn.

### 6.8 Kit parts

Reuses `Narrator`, `Moon`, `Arrow`, `SpeechBubble` (en only), `Matn` (`inactive`), `Pill`, `Chip`, `Glyph` (`check`, `cross`), `ViewTag`, `XLink`, `TermTitle`. Nothing new.

### 6.9 Translation slips

- **§5.52 (p.337) "Whosoever desires a comprehensive and accurate means … then muhmal [as a means] is required".** The sense seems to be that the muhmal is made clear when the narrator is known to keep company with one of the two. The site leaves this out until a ruling and uses only the fallback the translation states plainly (outside signs, weight of evidence).
- **§5.52 "‘Muḥammad’ … of the people of ʿIrāq".** Whether "of the people of ʿIrāq" describes Muḥammad or the ones he narrates from is unclear. The site names the two candidates only.

## 7. Scene 6: What runs through every link? (`chained`)

### 7.1 Header

```yaml
- id: chained
  division: lataif-al-isnad
  moons: [2]
  order: 6
  title: What runs through every link?
  eyebrow: Features of the chain, the enchained · §5.54
  lede: In some chains every narrator matches the one before in the same words of delivery, the same saying, the same act, or words and act together. It describes the chain, not the text, and it may run through only most of the chain.
  source: §5.54 Musalsal
  diagram: Chained
  width: 780
```

### 7.2 Form

Each panel is a short chain falling from the Prophet ﷺ where every link carries the **same tag**, a `Chip` beside each figure; the repetition is the point.

1. **The same words:** two chains, one tagged "I heard" at every link (the delivery words, linking to *How was it received?*), one tagged "I bear witness".
2. **The same act:** two chains, one tagged "a date" (he gave us a date to eat), one tagged "holds his beard · I believe in fate" (words and act together).
3. **Most of the chain:** the Awwaliyya chain. Tags run up the chain from the bottom to Sufyān ibn ʿUyayna (a named figure) and stop; above him the links have none. A dashed, crossed tag above him: "carried to the end: an error".

### 7.3 Term trigger

| Slug | Where | Note (paraphrase) |
|---|---|---|
| `musalsal` | Panel 1 title, (≈80..180, y 8–38) | Every narrator in a chain matches the others: in the words of delivery, such as "I heard x, who said I heard x"; in other words, such as bearing witness by Allāh; in an act, such as giving them a date to eat; or in words and act together, such as holding the beard and affirming fate. It describes the chain. It may run through most of it only, as in the Awwaliyya ḥadīth (§5.54). |

**Extra** (Read as text): **The Awwaliyya ḥadīth** (§5.54). Its enchaining runs through most of the chain and ends at Sufyān ibn ʿUyayna. Those who report it as enchained all the way to its end have erred.

### 7.4 Views, panels, motion, kit

- Views: none.
- Panels: `words` 0..260 "The same words", `acts` 260..520 "The same act", `most` 520..780 "Most of the chain".
- Motion: the arrows flow; the tags enter link by link down each chain (`m-enter`, `stagger`); in panel 3 they enter from the bottom up and stop at Sufyān. Reduced motion: all shown.
- Kit: `Moon`, `Narrator`, `Arrow`, `Chip` (with `dashed`), `Glyph cross`, `XLink`, `TermTitle`. Nothing new.

### 7.5 Translation slips

None found that change meaning.

## 8. (reserved)

The al-Mardūd design used §3 for unchanged scenes. This division has none.

## 9. Owner's annotations

The owner's PDF annotations on these pages (PDF pp.316–341). To be added to `notes/annotation-usage.md` for approval: "used" rows are reflected above; "proposed" rows are not written into any note.

| Page | Annotation (short) | Use | Status |
|---|---|---|---|
| p.321 | Muwāfaqa: going via the shaykh of one of the top muḥaddithūn | Agrees with §5.46; scene 2 cell A's tree (our routes join at Qutayba, al-Bukhārī's shaykh) | used (layout) |
| p.321 | Badal: "the grand shaykh" (the shaykh's shaykh) | Agrees with §5.46; cell A's al-Qaʿnabī joining at Mālik | used (layout) |
| p.322 | Even a longer chain can carry this term, though it isn't what people aim for | Agrees with §5.46; cell A's footer line | used (structure) |
| p.324 | Peers are those who narrate from the same or similar shaykh | Agrees with §5.48; scene 3 panel 1's shared shaykh | used (layout) |
| p.332 | A shaykh narrating from his student, then the student's student using that chain | Agrees with §5.51's al-Bukhārī and al-Sarrāj; scene 4 panel 3 | used (layout) |
| p.339 | Both are certain: the teacher that he didn't narrate it, the student that he did | Agrees with §5.53; scene 5 panel 2's two bubbles | used (layout) |
| p.339 | Forgetting is possible; saying you know something carries more than denying it | Agrees with §5.53 ("affirmation is preceded over negation"); scene 5 panel 3's reason line | used (structure) |
| p.341 | Musalsal by a phrase, by an action (dates, holding the beard) | Agrees with §5.54; scene 6 panels 1–2 | used (structure) |
| p.323 | A problematic example: musāwāh is under relative elevation but its example counts to the Prophet ﷺ | Open question q5 | proposed |
| p.325, p.327 | The term is kept so the report isn't taken for a mistake: one might think the names were swapped, unless one knows they narrated from each other | A sub-label in scene 3 panels 2–3, "otherwise the names might be taken as swapped", linking to maqlūb (`changes#maqlub`) | proposed |
| p.341 | Musalsal bi-l-awwaliyya: the first ḥadīth heard from the shaykh | Scene 6 panel 3 sub-label: "the first ḥadīth one hears from the shaykh" | proposed |
| p.340–341 | al-Darāwardī went straight to Suhayl to get a shorter chain; Suhayl's later chain keeps every link | A link from scene 5's loop to scene 1 ("seeking a shorter route"), and a sub-label "every link kept" | proposed |
| p.337 | One candidate from Iraq and one from the Ḥijāz: knowing where the ḥadīth was told narrows it down | Scene 5 panel 1: a clue under the fallback line | proposed |
| p.327 | The Prophet ﷺ reporting the story of the Dajjāl from a Companion | A real example for seniors from juniors. Needs a checked source and wording from the owner | proposed |
| p.316 | ʿUluww: the shortest *connected* chain | "Connected" is not in the translation, which keeps the form of ʿuluww for a short chain that is not sound | not used |
| p.323 | Dying or hearing earlier is also counted as elevation | Not in the translation's §5.45–5.47 | not used |
| p.325 | Benefits: shows the status of the one narrated from, and the narrator's humility | Not in the translation | not used |
| p.337 | Muhmal: the name known, nothing else about them | Reads like majhūl; conflicts with §5.52 | not used |
| p.340 | al-Dāraquṭnī's memory; his book lost, a summary preserved | Not in the translation | not used |
| p.341 | Musalsal by a day, a place, a type of narrator; most musalsal are weak | Not in the translation | not used |

## 10. Note lengths

Measured in Unicode code points after writing; all fit the 400 working cap and the zod 420.

- **Caption notes (16):** the longest are `musalsal` at 380, `akabir-an-asaghir` at 378 and `muhmal` at 370; the shortest is `aqran` at 240. They are re-measured on the YAML in the build.
- **View notes (4):** the longest is `not-accepted` at 354, then `most-correct` at 342.
- **Extras (3):** all under the 900 limit; the longest is "The Suhayl case".

## 11. New SVG kit parts (all scenes)

| Part | Props | Used in | Notes |
|---|---|---|---|
| `Beads.astro` | `x, y, n, gap, dir?` | 1, 2, 3 | `n` unnamed narrators as small rings on a flowing line (`flow` arrows between rings), down or to the right; `aria-hidden`, the labels carry the meaning. `lib/kit.ts` exports `BEAD_R` and `beadRun`, the ring centres and the edge points where a scene's arrows meet the run; a lone ring is a plain `<circle class="bead">` (`svg .bead` in `svg.css`). |
| `Scale` `left`/`right` slots | | 1 | A slot replaces that pan's discs with the scene's own, inside the pan, so they can change by view without replaying the tip. |
| `Glyph` + `handshake` | as the other kinds | 2 | A drawn icon, two hands clasped; no text glyph (WCAG 2.5.3). |

Everything else is reused: `Moon`, `Narrator`, `Arrow` (`flow`, `elided`), `Bracket`, `Chip`, `Pill`, `Matn` (`inactive`), `Scale`, `Lifespan`, `SpeechBubble` (en only), `Glyph` (`check`, `cross`), `ViewTag`, `XLink`, `TermTitle`, the `geom.ts` triggers, `viewAttrs`, the `.cells` grid, the state ink and tint tokens, the `m-draw`/`m-enter` classes with `stagger`, and the scene-nav helpers.

## 12. Translation slips

To be added to `notes/translation-queries.md`. Pages are the PDF's.

| § / page | Translation says | Query | Ruling |
|---|---|---|---|
| §5.46 (p.321) | "eight [reporters] between him and Qutayba … seven [reporters] between him and Qutayba" | The count is between us and Qutayba. The site says "between us and Qutayba" | |
| §5.47 (p.323) | "we have equalled al-Nasāʾī in terms of number, in exclusion to that specific isnād" | Sense: without his particular chain. The site says "by a chain that is not his" | |
| §5.49 (p.326) | "less than him in age, or in terms of [frequency of] meeting" | The bracket is the translator's; likely "in meeting [the shaykhs]", later in the chain of teachers. The site says "or met fewer shaykhs, or later", with no visible bracket | |
| §5.51 (p.332) | "one hundred and sixty years" | The translation's own dates (500, 650) are 150 apart. Check the Arabic. The site states no number | |
| §5.51 (p.332) | "al-Silafī who was one of his shaykhs" | Whose shaykh? Possibly al-Burdānī was al-Silafī's. The site says only that both heard from al-Silafī | |
| §5.51 (p.332) | "al-Salafī" / "al-Silafī"; "al-Burdānī" | Spelling varies. The site writes al-Silafī, al-Burdānī | |
| §5.52 (p.337) | "Whosoever desires a comprehensive and accurate means … then muhmal [as a means] is required" | Sense seems to be: the muhmal is made clear by the narrator's being known to keep company with one of the two. Left out until a ruling | |
| §5.52 (p.337) | "‘Muḥammad’ … of the people of ʿIrāq" | Does it describe Muḥammad or those he narrates from? The site names the two candidates only | |

## 13. Term map (all 16)

| # | Term | Scene | Where |
|---|---|---|---|
| 1 | uluww | elevation | Panel 1, top of the wedge |
| 2 | uluww-mutlaq | elevation | Panel 1 title |
| 3 | uluww-nisbi | elevation | Panel 2 title |
| 4 | nuzul | elevation | Panel 1, foot of the wedge |
| 5 | muwafaqa | meeting | Cell A, by the al-Sarrāj "us" |
| 6 | badal | meeting | Cell A, under al-Qaʿnabī |
| 7 | musawah | meeting | Cell B, by the first "us" |
| 8 | musafaha | meeting | Cell B, by the second "us" |
| 9 | aqran | peers | Panel 1 title |
| 10 | mudabbaj | peers | Panel 2 title |
| 11 | akabir-an-asaghir | peers | Panel 3 title |
| 12 | abna-an-aba | peers | Panel 4 title |
| 13 | sabiq-wa-lahiq | early-late | Panel 1 title |
| 14 | muhmal | doubts | Panel 1 title |
| 15 | man-haddatha-wa-nasiya | doubts | Panel 2 title |
| 16 | musalsal | chained | Panel 1 title |

Counts: elevation 4, meeting 4, peers 4, early-late 1, doubts 2, chained 1, for 16. Pending: 0. View-only: 0.

## 14. Implementation outline

Conventions as the earlier phase 3 builds: `rtk`, bun only, one commit per scene (kit and schema changes in the commit of the scene that first needs them, or a kit commit), one-line subjects, no trailers, LF, never staging `source/`. Port 4432 only for any local server; stop every server and browser started.

Tests follow the writing-tests rules (`~/.claude/skills/writing-tests/SKILL.md`) and the al-Mardūd design §16. Commit only tests of core logic, each behaviour once, through the mechanism that owns it. Don't commit tests that restate content or copy (labels, legend kinds, counts, scene order), exact timings, coordinates or delays, tests of a library or the platform, or one browser test per data item on the same code path. "Verify:" bullets are checks to run while building, by eye or with a throwaway spec deleted before the commit. New scenes are covered with no new tests by:

- the build-time guards: `sceneErrors`, the panel guard in `Term.astro` (with `dx` for moving triggers), `XLink` and `viewAttrs`;
- `bun run test`: the motion CSS rule (finite keyframes are `from`-only) and the token contrast pairs in `src/lib/palette.ts`;
- `bun run test:dist`: S1 term targets, S2 view integrity, S3 links and hashes, S4 label in name;
- `bun run test:e2e`: the routes smoke (render, axe, text contrast, Labels-mode overlap, every route and `?view=`, both themes), V4 (no replayed load-in on a switch) and M5 (each scene moves, and rests under reduced motion).

**No new tests.** The two new kit parts are drawing parts with no branching (`Beads` and `beadRun` place rings on a line; `Glyph handshake` is a few paths; the `Scale` slots only swap what a pan draws). Add a test only for a new mechanism or as the regression for a real bug, named in the test.

**Task 1: scene `elevation`.** Add `Elevation` to the enum and `LEGEND`; the kit `Beads`; YAML (§2) with `scene: elevation` on 4 terms, two views. `Elevation.astro`, three panels. Verify: `?view=reward` swaps panel 3's tags; reduced motion shows the chips. Commit `scenes: add how-near-is-the-chain elevation scene`.

**Task 2: scene `meeting`.** Add `Meeting`; `Glyph handshake`. YAML (§3), 4 terms. `Meeting.astro`, two cells. Verify: bead counts match the book (eight, seven, eleven) by eye; portrait stacking. Commit `scenes: add where-does-our-route-meet scene`.

**Task 3: scene `peers`.** Add `Peers`. YAML (§4), 4 terms. `Peers.astro`, four panels. Verify: `?akabir-an-asaghir` portrait landing in panel 3 (a later panel). Commit `scenes: add who-narrates-from-whom scene`.

**Task 4: scene `early-late`.** Add `EarlyLate`. YAML (§5), 1 term, one extra. `EarlyLate.astro`, three panels. Commit `scenes: add how-far-apart-did-they-die scene`.

**Task 5: scene `doubts`.** Add `Doubts`. YAML (§6), 2 terms, one extra, two views. `Doubts.astro`, three panels. Verify: `?view=not-accepted` swaps panel 3 only. Commit `scenes: add does-the-doubt-harm-it scene`.

**Task 6: scene `chained`.** Add `Chained`. YAML (§7), 1 term, one extra. `Chained.astro`, three panels. Commit `scenes: add what-runs-through-every-link scene`.

**Task 7: checks.** `bun run check`, `bun run build`, `bun run test`, `bun run test:dist`; e2e `routes.spec.ts`, `views.spec.ts`, `motion.spec.ts` with `--workers=1`, narrowed by `--grep` to this division. Fix what they find in the scene or the shared mechanism, not with a per-scene test. A coloured text on a new coloured fill: add the pair to `src/lib/palette.ts`.

**Task 8: spec and notes.** Spec §4.3: a division 5 table. `notes/translation-queries.md`: add §12. `notes/annotation-usage.md`: the "used" rows of §9, and the "proposed" rows under Proposals. Screenshots when the owner asks (`bun run screenshots`).

## 15. Open questions for the owner

Each is in the review sheet (`2026-10-29-phase-3-lataif-review.json`) with options, sketches and a recommendation.

1. **q1 Six scenes or four.** Scenes 4 (sābiq wa-lāḥiq) and 6 (musalsal) have one term each. Keep them, or fold sābiq wa-lāḥiq into *Who narrates from whom?* as a fifth panel and musalsal into *Does the doubt harm it?* as a fourth?
2. **q2 The book's counts.** Scene 2 draws exactly eight, seven and eleven rings and writes "eight", "seven" and "eleven" in words. Is that within the "no numbers" rule, which is about gauges?
3. **q3 Death years.** Scene 4 labels the translation's death years and states no gap, because the translation's "one hundred and sixty years" does not match its own dates. Keep the years, or show only "died first" and "died last"?
4. **q4 The "reward" view.** §5.45 reports that some prefer the longer chain for the reward of the toil, and Ibn Ḥajar dismisses it. A view, or one line in Read as text?
5. **q5 Musāwāh's example** (owner's p.323): it sits under relative elevation, yet its example counts to the Prophet ﷺ. Draw it as the book does with a remark, or without?
6. **q6 Musalsal's tags.** Chips with the translation's few words at every link, or drawn icons (a date, a hand at the beard)?
7. **q7 Proposed annotations** (§9): swapped names → maqlūb, Awwaliyya's meaning, the Suhayl shorter route, the Iraq and Ḥijāz clue, the Dajjāl example. Any to approve?
8. **q8 Translation slips:** please rule on the eight rows of §12, especially §5.51 (160 or 150 years) and §5.52 (how a muhmal is made clear).

## 16. Interim decisions for the build

As for the earlier divisions, the owner asked for development to continue while they review.

- **Built:** `peers` and `doubts` (no open question touches them); `elevation` with the `reward` view (q4) and `meeting` with the counts in words and no musāwāh remark (q2, q5), both cheap to change (`built_with_interim` in the review sheet).
- **Left for the owner:** `early-late` and `chained`, which q1 may fold into other scenes, and q3 and q6 reshape.
- **Generation colours** where the chain or general knowledge gives them (Abū Hurayra, Abū Ṣāliḥ; a figure reporting straight from the Prophet ﷺ is gold).
- **Arabic quoted from the reports: none.** A few English words of the translation in bubbles and tags.
- **Views:** `elevation` (two) and `doubts` (two), from the translation. Swaps may be instant.
- **Illustrations** without a book example say "an illustration: the book names no example".
- **Owner's annotations:** only "used" rows go in. "Proposed" rows wait in `notes/annotation-usage.md`.
- **Translation slips:** all eight rows of §12 go to `notes/translation-queries.md`; the site uses the wording given there until a ruling.
- **Links** to scenes not yet built render only once their target exists (XLink throws otherwise), so scene 4's links wait for it.

### Deviations in the build

The four built scenes follow this design except as below. None changes a ruling or adds content beyond the translation.

- **`peers`:** the four panels are equal (260 each), with the two long titles (panels 3 and 4) in the 13px bold face so their triggers fit; panel 3's title sits 10 left of centre for its (i). Panel 1 has no shared-shaykh name under the peers, and the "illustration" line covers panels 1–3 in one footer. In panel 4 column (a)'s names sit to the left, column (b)'s to the right, with "one generation skipped" beside (b)'s long arrow, and the fourteen rings run in a row along the foot. Panel 3 says "or met fewer shaykhs, or later", with no visible bracket. The nested rings use `--gold-tint`.
- **`doubts`:** the bubbles quote the shortest exact fragments, "I did not report this" and "I do not remember", so they fit the kit bubble; the student has no bubble, but a label, "his student reports it from him". The view's tags are the translation's "core" and "periphery". In panel 1 the second example reads "another: an unspecified “Muḥammad”", and the general fallback stands apart under it. Panel 1's links read "its opposite: Who is who?" and "no name at all: Who is this narrator?". The Suhayl loop runs left to right from the moon, then down to Rabīʿa and back to al-Darāwardī, with the closing words "Suhayl, later: “Rabīʿa informed me”". The cross on the rejected card pops in (`m-enter`) rather than drawing. The scene is 572 tall.
- **`elevation`:** panel 3's pills read "Most desired", "Elevated in form" and "No elevation", with "sound", "with a weak link" and "forged" under the mini routes; the default view adds a tag "Ibn Ḥajar: the weightier chain". The scale's longer pan holds two large gold weights in Ibn Ḥajar's view and four plain ones under `reward` (the `Scale` right slot). Panel 2's imam list sits under "a great imam", its routes start lower, and a link, "its four kinds", leads to *Where does our route meet theirs?*.
- **`meeting`:** cell A's tree has Qutayba and al-Qaʿnabī a step above the first route row (both routes take the same first step), and the footer reads "each ring is a narrator · both names are mostly said when the route is shorter, but not only then". al-Qaʿnabī's elided route stops part-way with "to us by another route: no count given" and has no "us" chip. Cell B draws one level tie (al-Nasāʾī to the musāwāh "us"); the muṣāfaḥa row is shown by height and the line "our second route is level with his student", then the handshake glyph (two cuffed forearms and a joined band).
- **Checks run:** `bun run check`, `bun run build`, `bun run test`, `bun run test:dist`, and e2e `routes.spec.ts` (narrowed to this division), `views.spec.ts` and `motion.spec.ts` with `--workers=1`, all passing. No tests were added.
- **Shared styles:** `.lbl.end`, `.nm.mid`, `.level line` and `.bead` live in `src/styles/svg.css`; the scenes, *Where is the narrator alone?* included, no longer copy them.
- **Task 8 done:** the spec §4.3 table and §7.2 layout list, the eight slip rows in `notes/translation-queries.md`, and the used, proposed and not-proposed annotation rows in `notes/annotation-usage.md`.
