# Nuzhat al-Naẓar, visualised: design

Date: 2026-10-28
Status: divisions 1–3 built (phases 1 and 2, then phase 3's ʿAdad al-ṭuruq, al-Maqbūl and al-Mardūd)
Concept mockup: https://claude.ai/artifact/8V78csjQ1dFRqbjoWoZza1 (reference for look and motion; not production code)

## 1. Goal

A public static website that teaches the hadith sciences in Ibn Ḥajar's *Nuzhat al-Naẓar* visually. Each concept is shown as one animated diagram instead of a page of prose. It is the companion a student keeps open beside the text.

Success means all of these hold:

- Every term Ibn Ḥajar defines appears on some page, with a § reference.
- Each term has a shareable link that lands on its diagram.
- The site reads correctly in light and dark themes, on desktop and on a phone.
- The site works with reduced motion and with a screen reader.

### Out of scope

- Full text of the translation.
- Commentary from the thesis the translation sits in.
- User accounts, comments, search beyond the glossary filter, and translations of the UI.

## 2. Source and copyright

- **Primary source:** Ibn Ḥajar, *Nuzhat al-Naẓar*, in the English translation inside A. S. Hussain's 2012 thesis (`Nuzhat al-Nazar - Ibn Hajar.pdf`). The thesis says "further distribution prohibited".
- **Rules that follow from the copyright:**
  - Site text is written fresh in our own words, never copied.
  - Every claim carries its § number, for example "§5.55".
  - No passage of the translation is reproduced beyond a few words of quoted Arabic terminology.
  - The thesis author's commentary and footnote analysis are not used.
- **Second source:** the repo owner's own PDF annotations (sticky notes, highlights, ink). They clarify the translation. They are extracted locally with pypdf, and the owner approves which notes are used.
- **Kept out of git:** the PDF, the extracted text and the annotation dumps all live in a git-ignored `source/` folder. CI fails if any of them is committed (§9).
- **Translation slips:**
  - Known so far: §5.20 muʿḍil, the p.159 "specified", §5.51 Sarrāj.
  - They are collected in `notes/translation-queries.md` for the owner to rule on.
  - Until a ruling, the site follows the Arabic term.

## 3. Visual language

These decisions were settled through the mockup.

### 3.1 Narrators

| Who | Look |
|---|---|
| The Prophet ﷺ | Full moon, ﷺ at the centre, slow pulsing glow |
| Companion (ṣaḥābī) | Gold, with a shimmer and a star |
| Successor (tābiʿī) | Green, with a band across the chest |
| Later narrator | Black (light ink in dark theme) |

Generation is shown by colour and by row only; there is no headwear.

### 3.2 Narrator assessment

A narrator figure carries two items:

- a **name scroll**, meaning his identity is known;
- a **seal**, meaning someone vouches for him.

A missing item shows as an empty slot that blinks.

| Case | Arabic | Figure |
|---|---|---|
| Reliable | ثِقَةٌ | scroll + seal |
| Unknown | مَجْهُولٌ | scroll + empty seal slot |
| Unnamed | مُبْهَمٌ | blank face, both slots empty |
| Weak | ضَعِيفٌ | cracked seal |
| Liar | كَذَّابٌ | mask, voided seal |
| Memory failed | مُخْتَلِطٌ | faded head |
| Conceals | مُدَلِّسٌ | hand over mouth |
| Missing link | سَقْطٌ | dashed red ghost |

### 3.3 Typography and text

- **Fonts:** Fraunces for display, Source Sans 3 for UI and body, Amiri for Arabic. All are self-hosted through `@fontsource` packages (no Google Fonts request), so preview builds, axe runs and screenshots are deterministic.
  - Fraunces has no ʿ or ʾ glyphs (U+02BE–02BF), so `src/styles/fonts.css` borrows them from Source Sans 3 under the Fraunces family name.
  - The same file declares Fraunces's latin-ext face again, after latin, for the precomposed letters (ā, ī, ū, ḥ, ṣ and so on). Otherwise Chromium splits them into letter + combining macron and draws the macron from the latin face, where it lands on the next letter.
- **Arabic:** always fully voweled (full tashkeel, with case endings). It is marked `lang="ar" dir="rtl"` and shown with its transliteration.
- **Quoted delivery words** (for example حَدَّثَنِي رَجُلٌ) appear in a speech bubble coming from the narrator who says them, not as a caption under the person being described.

### 3.4 Motion

- **Chains:** arrows along a chain flow in the direction of narration (a stroke-dash animation).
- **Missing items:** blink.
- **Header:** a starfield whose stars drift and fade.
- **"Other views" switch:** elements animate to their new position and size; they are not redrawn.
- **Reduced motion:** `prefers-reduced-motion` turns off every animation, every transition and the view transitions.
- **Motion switch (WCAG 2.2.2):** much of the motion loops without end (flowing chain arrows; blinking ghosts, slots and dots; the moon pulse; the starfield; the map's orbits; the Changes sway), so the header has a **Motion: on / off** switch (§5) that stops it without the system setting.
  - Off does exactly what reduced motion does. `motion.css` applies the same `animation: none; transition: none` under `:root[data-motion="off"]`; `prefs.ts` pauses SMIL; the starfield, the orbits, the carousel's smooth scroll and the view switch's transitions ask `motionAllowed()` in `src/lib/motion.ts` and listen for its change event; and the head script skips cross-document view transitions on `pageswap` and `pagereveal`.
  - The choice is kept in `localStorage` (`nuzhah-motion`), and the head script sets `data-motion="off"` on `<html>` before first paint, so nothing moves even for a frame. The switch's own look and its "on"/"off" come from CSS on that attribute and the media query, so it is right in that frame too, before `prefs.ts` runs. A choice made in another tab applies through the `storage` event.
  - Its accessible name is always "Motion"; `aria-pressed` carries the state, and the visible "on"/"off" is `aria-hidden`.
  - When the system asks for reduced motion, that wins: the switch reads "Motion: off" and is `aria-disabled` (not `disabled`, so keyboard users still reach it), ignores clicks, and adds "(system setting)" for screen readers.

### 3.5 Labels

- Info icons sit beside terms in the diagrams and open the term popover (§6); there are no caption rows.
- One popover serves both purposes: definition and share actions. It is an HTML overlay positioned over the SVG, because the HTML `popover` attribute doesn't work on SVG elements.
- On a scene, the popover shows that scene's caption note (§7.3) in place of the definition. The glossary and `/t/<slug>/` keep the term's short definition from the inventory.
- A global **Key / Labels** switch shows either the symbol key overlay or inline labels.

### 3.6 Themes

- Colours are tokens on `:root`, with a dark set for `prefers-color-scheme: dark` and a manual override (`data-theme`).
- Contrast meets WCAG AA in both themes.

## 4. Information architecture

### 4.1 Home: the map

- Eight planets orbit the full moon (the Prophet ﷺ), one for each of Ibn Ḥajar's top-level divisions, in his order.
- Each planet's moons are its sub-divisions.
- Each planet is labelled with Ibn Ḥajar's term, with a plain-English name on a second line. Both labels travel with the planet; there are no fixed labels on the orbits.

| # | Term | English | § |
|---|---|---|---|
| 1 | ʿAdad al-ṭuruq | How it reached us | 5.2–5.8 |
| 2 | al-Maqbūl | Accepted reports | 5.9–5.16 |
| 3 | al-Mardūd | Breaks in the chain · criticism of narrators | 5.17–5.39 |
| 4 | Muntahā al-isnād | Where the chain ends | 5.40–5.44 |
| 5 | Laṭāʾif al-isnād | Features of the chain | 5.45–5.54 |
| 6 | Ṣiyagh al-adāʾ | How it was passed on | 5.55–5.58 |
| 7 | al-Asmāʾ | Names that look alike | 5.59–5.61 |
| 8 | Maʿrifat al-ruwāt | Knowing the narrators | 5.62–5.71 |

On portrait phones (under 640px) the orbit map is replaced by a nested list: the moon ﷺ as the root, the eight divisions as coloured planet dots with term, Arabic, English and §, and their sub-divisions as indented bullets (links once scenes exist). Landscape and wider show the orbit map.

Clicking a planet navigates to `/<division>/`, and the view transition (§5) makes this look like a zoom into the planet. That page shows the planet large, with its moons. Clicking a moon opens that scene.

### 4.2 Routes

| Route | Content |
|---|---|
| `/` | Map |
| `/<division>/` | The planet zoomed in, listing its scenes (also the fallback when JavaScript is off) |
| `/<division>/<scene>/` | One scene: one diagram |
| `/narrators/` | Full figure key (§3.1–3.2) |
| `/terms/` | Glossary: every term, its Arabic, a short definition, § and a link to its scene; filter box |
| `/t/<slug>/` | Share-link landing page for one term (§6) |
| `/404.html` | Themed not-found page with a link to the map |

Division slugs are ASCII transliterations, for example `adad-al-turuq` and `siyagh-al-ada`.

### 4.3 Scenes

A scene is one diagram that teaches one sub-division.

**Phase 2** (§10) builds the five scenes already proven in the mockup:

| Scene | Division | § | Diagram |
|---|---|---|---|
| How many routes carry it? | 1 | 5.2–5.6 | Chains fanning out for mutawātir, mashhūr, ʿazīz and gharīb |
| Where does the chain break? | 3 | 5.18–5.20 | Muʿallaq, mursal, muʿḍal and munqaṭiʿ shown as ghosts in a chain. All four omission types share one diagram of six generation rows, so muʿḍal and munqaṭiʿ don't overlap muʿallaq. Other views: the rulings on mursal (§5.19): the majority of hadith scholars pause (tawaqquf), one of Aḥmad's two opinions; the Mālikīs, the Kūfīs and Aḥmad's other opinion accept it outright; al-Shāfiʿī accepts it when another report supports it |
| Who is this narrator? | 3 | 5.35–5.36 | Mubham vs majhūl; speech bubble "حَدَّثَنِي رَجُلٌ". Majhūl al-ʿayn and mastūr are small notes beside the majhūl figure |
| How was it received? | 6 | 5.55–5.58 | Ranked staircase: Ibn Ḥajar's eight delivery levels, with wijāda, waṣiyya, iʿlām and general ijāza "below the stairs". Other views: the scholars of Madīna; al-Bukhārī and others |
| Who is who? | 7 | 5.59–5.61 | Eyebrow "Names that are shared or look alike". Four panels: muttafiq/muftariq fork; muʾtalif/mukhtalif dot glyphs; mutashābih with the differing letters pulsing; a filter-box worked example narrowing to ʿAbd Allāh ibn Zayd ibn ʿAbd Rabbih |

The figure key from the mockup's "Reading a narrator" becomes `/narrators/`.

*Mursal* has a wider fiqh sense (any chain with a gap), but that comes from the thesis commentary, not Ibn Ḥajar's text, so it is out of scope (§2). An earlier draft of this table had it as the breaks scene's other view.

**Phase 3 onwards** adds the rest of the sub-divisions, one division at a time, in planet order.

**Phase 3: division 1** (ʿAdad al-ṭuruq), designed in `docs/superpowers/specs/2026-10-28-phase-3-turuq-design.md`. The phase 2 `routes` scene stays as it was, moved to second place:

| Scene | § | Form | Views |
|---|---|---|---|
| What is a report? (`report`) | 5.2, 5.5 | Two cells: the Intentions report's chain flowing down from its text card, the isnād bracket pointing up to it, with the isnād and matn marked, and two circles for khabar and ḥadīth that merge, separate or nest | One meaning; Two kinds; General and particular |
| How many routes carry it? (`routes`) | 5.2–5.6 | Chains fanning out for mutawātir, mashhūr, ʿazīz and gharīb (phase 2, unchanged) | none |
| Which reports are acted on? (`sorting`) | 5.3–5.7 | A sorting gate, left to right: mutawātir and the āḥād come in, mutawātir bypasses the check, and the āḥād reach three tinted outcome cards: accepted, held back, rejected. A dot inset shows the mustafīḍ counting rule | none |
| How sure can we be? (`knowledge`) | 5.3, 5.7 | A knowledge meter: a three-band column, with mutawātir on one side and the three supporting signs lifting a report on the other | Ibn Ḥajar: certain; Some: reasoned only |
| Where is the narrator alone? (`lone`) | 5.8, 5.5 | Four chains side by side, the lone links on soft halos: the walāʾ, Branches of Faith and Intentions reports for absolute gharīb, and an unnamed illustration for relative gharīb | none |

**Phase 3: division 2** (al-Maqbūl), designed in `docs/superpowers/specs/2026-10-28-phase-3-maqbul-design.md`:

| Scene | § | Form | Views |
|---|---|---|---|
| How sound is it? (`grades`) | 5.9–5.10 | Four cells: the conditions of the sound as a checklist, a ladder of chains from soundest down, many routes lifting a grade, and al-Tirmidhī's "ḥasan ṣaḥīḥ" | Ibn Ḥajar; al-Tirmidhī, in his book |
| Who outweighs whom? (`opposition`) | 5.10–5.12 | Three panels: added words on two text cards, then two balance scales for shādhdh against maḥfūẓ and munkar against maʿrūf | Ibn Ḥajar and the early masters; accept every addition |
| Does anyone else carry it? (`support`) | 5.13 | The crescent-moon report as a tree of routes, swept by the iʿtibār lens; brackets mark full and partial follow-ups and the shāhid | none |
| Can both be acted on? (`acted-on`) | 5.14–5.16 | A decision path of five questions in Ibn Ḥajar's order, each answer dropping to an outcome card: muḥkam, mukhtalif al-ḥadīth, naskh, tarjīḥ, tawaqquf | none |

**Phase 3: division 3** (al-Mardūd), designed in `docs/superpowers/specs/2026-10-28-phase-3-mardud-design.md`. The phase 2 `breaks` and `unknown` scenes stay as they were, moved to second and ninth place:

| Scene | § | Form | Views |
|---|---|---|---|
| Why is a report rejected? (`causes`) | 5.17, 5.21, 5.23–5.38 | Two cells: omission as three mini chains with the drop in each of its three places, over the plain and hidden drops as lifespan boxes; criticism as a ladder of the ten causes in the book's order, gravest first, each rung a link to the scene that draws it | none |
| Where does the chain break? (`breaks`) | 5.18–5.20 | Muʿallaq, mursal, muʿḍal and munqaṭiʿ as ghosts in a chain (phase 2, unchanged) | Most hadith scholars; Mālikīs, Kūfīs, Aḥmad (other opinion); al-Shāfiʿī |
| Did he hear it from him? (`hidden`) | 5.21–5.22 | Three panels pairing lifespan bars with a chain fragment: tadlīs (they met), mursal khafī (no known meeting), and the mukhaḍramūn as Ibn Ḥajar's evidence | Ibn Ḥajar: they met; Some: living at the same time |
| Did he lie? (`lying`) | 5.23–5.25 | Three panels: the liar and the suspect with what their reports are called, three clue cards for knowing a forgery, and the sources and motives of forged words | none |
| Did he keep it right? (`slips`) | 5.23, 5.26–5.27, 5.38 | Three panels: a record strip of marked errors and an unticked check, a hidden defect found by gathering routes under a lens, and poor memory as a whole-life bar and a bar broken late in life | none |
| What changed in the telling? (`changes`) | 5.23, 5.28–5.32 | Six cells: a sorter asking what changed, linking to a cell for each form (mudraj, maqlūb, al-mazīd, muḍṭarib, muṣaḥḥaf and muḥarraf) | none |
| May the words be changed? (`wording`) | 5.33–5.34 | Three panels on one text card: cut short by an expert and by one who does not know, told in other words through a gate, and a shelf of the books on rare words | Most scholars; Some: single words only; Some: if he knows the words; Some: if he has forgotten them |
| Why is he unknown? (`identity`) | 5.35–5.36 | Two cells: al-Kalbī's many names gathering into one man, and a narrator with one student against one with many | none |
| Who is this narrator? (`unknown`) | 5.35–5.36 | Mubham and majhūl figures (phase 2, unchanged) | none |
| Does his belief count against him? (`innovation`) | 5.23, 5.37 | Three panels: open sin against sin in belief, then a decision path for each kind of innovation | Ibn Ḥajar; Unless he allows lying; Reject |

- Each division gets its own short design pass, written as a design doc in `docs/superpowers/specs/`. It is then built on its own branch and reviewed through its PR preview. At the owner's request, to keep development moving, this replaces the earlier step of a mockup in the concept artifact.
- Design rules for every scene:
  - Prefer a real worked example from the book over a generic one.
  - Pick the diagram form that fits the idea (staircase, filter box, fork, etc.) rather than forcing every idea into a chain.

Until a division is built, its planet still shows on the map, and its moons are listed as "coming soon".

## 5. Page layout and interaction

- **Header** on every page:
  - starfield behind the site title;
  - breadcrumb (Map › Division › Scene);
  - Key/Labels switch, theme switch and motion switch (§3.4), all saved in `localStorage`. Every storage access is wrapped in try/catch, and the page works without storage.
  - The switches are `<button>`s with `aria-pressed`; the motion switch is pressed while motion is on. All three need script, so they are hidden without it.
- **Main area:** one diagram per page.
  - Scenes with scholarly disagreement show Ibn Ḥajar's view by default, with an **Other views** switch.
  - The chosen view is kept in the URL (`?view=madinah`) so that a link opens on that view.
- **Under the diagram:**
  - previous/next links within the division;
  - a collapsible **Read as text** section listing the scene's captions in order, with Arabic and § references, for screen readers and search engines.
- **Footer:**
  - credits Ibn Ḥajar and the translation and states that the text is paraphrased;
  - links to `/terms/`, `/narrators/` and the repository.
- **Map to scene:** native cross-document view transitions (`@view-transition { navigation: auto; }`, declared inside `@media (prefers-reduced-motion: no-preference)` so reduced motion disables them without JavaScript, and skipped by the head script when the motion switch is off (§3.4), plus matching `view-transition-name`s) morph the planet into the division page and the moon into the scene.
  - Astro's `<ClientRouter />` is **not** used. Every navigation is a full page load, so islands only need to initialise once on load.
  - Browsers without support (currently Firefox) get plain navigation. Without JavaScript, these are plain links.
- **Keyboard:** planets and info icons can be reached with Tab and opened with Enter or Space.
- **Mobile, under about 640px:**
  - The SVG scales to the screen width.
  - The term popover opens as a bottom sheet.
  - Orbits slow down.
  - **Carousel:** a scene that declares `panels` (for example "How many routes", the figure key) becomes a swipe carousel in portrait.
    - The diagram is rendered **once**: there is a single SVG and no duplicated markup, so IDs, markers and view-switch targets stay unique.
    - Panels are horizontal slices of the diagram, each defined by an x-range in diagram units. A scene that uses panels must lay its diagram out as a single row.
    - In portrait, the SVG is set wider than the screen inside a horizontally scrolling container. The track is sized so that the widest panel fits the viewport (diagram width ÷ widest panel × 100vw), not panel count × viewport, because uneven panels would otherwise overflow the screen. Invisible snap targets, one per panel and positioned from the x-ranges, give CSS scroll-snap its stops.
    - It has page dots and previous/next buttons, and needs no library. In portrait the dots bar is sticky at the bottom, so it stays in view while a tall diagram scrolls past.
    - The scroller is a focusable region (`tabindex`, `role`, `aria-label`) only in portrait; `carousel.ts` removes those attributes in landscape and wider, where nothing scrolls.
    - Landscape, and anything wider, removes the overflow and shows the full diagram at 100% width.
    - The switch is done by CSS media query (`orientation` and width), so rotating the phone switches the layout straight away.
    - Scenes laid out as a grid (for example "Who is who?") don't use panels. Each cell is its own small SVG inside an HTML CSS grid, which becomes a single column in portrait. There is still only one copy of each cell.

## 6. Shareable term links

- **Slugs:** every term has a stable ASCII slug in the term inventory, for example `mutawatir`, `mursal` or `ijaza-amma`.
- **Term on a page:** a button. Clicking or tapping it opens a popover with:
  - the term, its Arabic and its definition: on a scene, that scene's caption note (§7.3); on the glossary and figure key, the inventory's short definition (§3.5);
  - **Copy link**;
  - **Share**, using `navigator.share` where available and hidden otherwise;
  - **See in glossary**.
- **Canonical share link:** `/t/<slug>/`.
  - This is a generated static page with Open Graph tags (term, Arabic, definition), so it shows a proper card when pasted into a chat.
  - It redirects to the term's place with `<meta http-equiv="refresh">` plus `<link rel="canonical">`, so it works without JavaScript. The canonical URL is absolute (`SITE` + `BASE`); the refresh target is base-relative so the redirect also works on preview hosts; `og:url` is the `/t/<slug>/` URL itself, so link cards stay stable.
- **Short forms:** any page also accepts `?t=<slug>`, or a bare `?<slug>`.
  - **What counts as a bare slug:** a query string that is exactly one key with no value, where that key is not a reserved word (`t`, `view`, `q`). Anything else is ignored. The build fails if a slug equals a reserved word.
  - **How it resolves:** a tiny inline script checks `location.search`. Only when one of these shapes is present does it fetch a build-generated `terms-index.json` (its URL includes `BASE`) (slug → target URL) and redirect with `location.replace`. Pages without a slug query never load the index.
- **Landing:** the target URL is `/<division>/<scene>/?view=<v>#<slug>`.
  - `view` is added only when the term appears only under a non-default view.
  - Term elements carry `data-term="<slug>"` rather than an `id`. `popover.ts` reads the hash on DOMContentLoaded and finds the element. If the element is in a view that isn't showing, it switches to that view (`viewswitch.ts`, via `window.nuzhah.setView`). In a portrait carousel it moves the carousel to the element (`carousel.ts`, `window.nuzhah.reveal`). It then scrolls the element into view. Finally it draws a pulse ring round the term and opens its popover.
- **Pending terms** (in a division not yet built, §9):
  - `/t/<slug>/` is still generated.
  - It and the short forms redirect to the term's glossary entry, `/terms/#<slug>`. That entry shows "coming soon" and links to the division page.
- **Unknown slug:** `?t=<unknown>` and `/t/` URLs that don't exist open `/terms/?q=<slug>` with the filter pre-filled and a "no exact match" note. An unknown bare `?<key>` is ignored, so stray tracking keys never bounce visitors. A `/t/<x>/` URL that doesn't exist is served by `404.html`, which has a small script that spots the `/t/` path and redirects to `/terms/?q=<x>`.

## 7. Architecture

### 7.1 Stack

- **Astro + TypeScript, static output.** Chosen for reusable components, content collections with schema validation, one URL per page, good SEO by default, and small client islands.
- No UI framework. Client islands are plain TypeScript modules.
- Islands talk to each other only through `window.nuzhah` (`openTerm`, `setView`, `reveal`), declared once in `src/env.d.ts`.
- **Bun** is the package manager and script runtime (`bun install`, `bun --bun astro …`).
- **prek** runs the hooks in `.pre-commit-config.yaml` locally and in CI.

### 7.2 Layout

```
src/
  components/
    svg/          Moon, Narrator, Chain, Arrow, SpeechBubble, Pill, Term, TermTitle, LayerGuides,
                  InfoIcon, Defs, NameTag, Chip, Gauge, Glyph, Scale, Matn, Decision, Bracket,
                  Lifespan (division 3: a rounded life bar, no axis or dates);
                  Glyph kinds: memory, book, check, cross (division 1: rejected or not reached), lens,
                  pause, text, companion, clock, coin (dashed for a false one), scissors;
                  Narrator faces: blank, faded, mask, mask-dashed (suspected, not proven), hand;
                  figures.ts (FIG / KIND_NAME, with the division 3 kinds mudallis, liar, accused and
                  mukhtalit), geom.ts (f, titleTrigger, rowTrigger, panelTrigger, SUBT_TRIGGER,
                  ROW_TITLE_TRIGGER)
    layout/       Header, Footer, Breadcrumb, Starfield, ThemeToggle, KeyToggle, MotionToggle,
                  ViewSwitch, ReadAsText, TermPopover, Legend, Carousel
    scenes/       Routes, Breaks, Unknown, Delivery, Names, Grades, Opposition, Support,
                  ActedOn, Report, Sorting, Knowledge, Lone, Causes, Hidden, Lying, Slips,
                  Changes, Wording, Identity, Innovation (one diagram per scene)
  content/
    divisions.yaml  the eight divisions (term, Arabic, English, §, order, moons)
    scenes.yaml     every scene (see 7.3)
    terms.yaml      the term inventory
  content.config.ts collections: divisions, terms, scenes
  lib/
    terms.ts      slug → target path; ?t= / bare ?slug parsing
    views.ts      read/write ?view=
    staircase.ts  delivery step boxes per view
    kit.ts        pure layout maths for the kit parts (chip widths and rows, gauge cells, scale ends, disc rows, the sweep timing, diamond path, bracketPath for Bracket, dotCluster for the mustafīḍ inset, stackY for name lines beside a figure, pillWidth for a verdict pill, lifespanBar and spanOverlap for Lifespan, and the letter helpers letterShape, LETTER_DOTS, letterDots and vowelMark shared by Names and Changes)
    motion.ts     the motion switch's state: motionAllowed(), setMotion(), onMotionChange() (§3.4)
    panels.ts     carousel track width and snap stops
    orbit.ts      map orbit maths
    scene.ts      caption lookup, popover JSON, DiagramProps
    inventory.ts  build-time term/scene cross-checks
    content.ts    loads collections and runs the checks
    url.ts        base-aware link helper
  islands/        prefs.ts, stars.ts, orbit.ts, slugquery.ts, popover.ts, glossary.ts,
                  sw.ts, viewswitch.ts, carousel.ts
  layouts/        Page.astro
  pages/          index, [division]/index, [division]/[scene], narrators,
                  terms, terms-index.json, t/[slug], 404
  styles/         tokens.css, base.css, fonts.css, svg.css, motion.css
source/           (git-ignored) PDF, extracted text, annotation dumps
notes/            translation-queries.md, annotation-usage.md
docs/             specs, plans, screenshots/
```

### 7.3 Scene content file

All scenes live in one file, `src/content/scenes.yaml`, validated by the `scenes` collection in `src/content.config.ts`. Each entry holds:

- **Header data:** id, division, `moons` (an array of indices into the division's moons that this scene covers), order within the division, title, eyebrow, lede and source line (§ range).
- **Captions:** each has a term slug and a `note`: the longer paraphrase shown in the scene's popover and in "Read as text". The translit, Arabic and English come from the term inventory.
- **Views:** optional; at least two when present, and the first is the default. Each view has an id, a label, the scholars it reflects with §, and a note. The per-element targets live in the diagram component, not the YAML.
- **Panels:** optional, for the mobile carousel. Each panel has an id, a label and an x-range in diagram units (§5); `width` gives the diagram's viewBox width.
- **Extra:** optional non-term worked examples (title, optional Arabic, §, note). They have no term slug and are shown only in "Read as text".
- **Diagram:** the name of the Astro diagram component.

Content and drawing are separate:

- The diagram component draws the scene.
- The YAML supplies its words and data.
- A scene can be reworded without touching any drawing code.

### 7.4 Client behaviour

- **Islands:** each one is a plain module included only on pages that need it. It initialises once on load, since there is no client-side router.
- **Reduced motion:** JS-driven motion (the starfield canvas and the planet orbits, which use `requestAnimationFrame`) checks `prefers-reduced-motion` and draws one static frame instead of animating.
- **View switching:**
  - Each element carries its per-view targets as data attributes (`data-v-<id>` transform, `data-h-<id>` height, `data-fill-<id>` fill), and `[data-view-show]` parts outside the active view get the `off` class.
  - Switching applies the new targets in the frame after layout, so CSS transitions run. This is the mockup's staircase technique.
  - Under reduced motion the switch is immediate.
- **Missing data:** a scene's YAML is validated at build time (§9), so runtime code assumes valid data. A runtime error in an island leaves the static SVG in place.

## 8. Hosting

- **Production: GitHub Pages**, from a public repository `adehad/hadith-science`, deployed by GitHub Actions.
- **Branch previews: Cloudflare.**
  - A `wrangler.toml` at the repo root follows the pattern of the owner's dhikr-hub repo:
    ```toml
    # Cloudflare Workers & Pages config
    name = "hadith-science"
    compatibility_date = "2026-10-28"

    [assets]
    directory = "./dist/"
    not_found_handling = "404-page"
    ```
  - The repo is connected to Cloudflare Workers Builds in the dashboard, with build command `bun install && bun run build`. This is a one-off manual step for the owner. Every branch then gets a preview URL.
- **Base path:**
  - GitHub Pages serves the site under `/hadith-science/`; Cloudflare previews serve it at `/`.
  - `astro.config` reads `SITE` and `BASE` from the environment. The Pages workflow sets them from `actions/configure-pages`. The defaults are `/` for Cloudflare and local builds.
  - Every internal link goes through `lib/url.ts`, which normalises `BASE` to exactly one leading and one trailing slash. A test checks this (§9).
  - `404.html` is served at arbitrary depths by GitHub Pages, so its links are root-absolute (including `BASE`).
- **Owner setup notes for Cloudflare:** the Worker name in the dashboard must equal `name` in `wrangler.toml`. Non-production branches use the default `bunx wrangler versions upload` deploy command to get preview URLs.

## 8a. Installable app (PWA)

- A web app manifest (name, icons incl. maskable, `display: standalone`, night-sky theme colour) with relative `start_url` and `scope`, so it installs from both GitHub Pages (`/hadith-science/`) and previews (`/`).
- A service worker generated after the build by Workbox (`generateSW`) precaches the built pages, styles, scripts, fonts and icons (not the `/t/` redirects), so the site reads offline after the first visit. Precached pages are served from the cache; each deploy changes their revisions and the new worker takes over immediately (the first navigation after a deploy may still show the old page). Pages outside the precache are network-first with a cache fallback. Outdated caches are cleaned on update.
- Query strings are ignored when matching the precache, so `?view=` and `?slug` links read offline.
- Registered only in production builds, scoped to the base path.
- Tests: manifest validity and icons, service worker registration, offline navigation to cached pages.

## 9. Testing and CI

- **Content validation at build:**
  - Astro content collections check every division, scene and term file against a zod schema.
  - A scene that names an unknown term slug fails the build.
  - A term in the inventory that no scene uses fails the build. A term can be marked `pending` while its division is unbuilt; pending terms are listed in the glossary as "coming soon".
- **Type check:** `astro check`.
- **Unit tests (Vitest):**
  - slug resolution, including view-only terms and unknown slugs;
  - staircase, orbit and panel layout maths, and the scene kit's geometry;
  - `?view=` read/write, and the scene neighbours and moon lists;
  - the base-aware URL helper;
  - finite keyframes are `from`-only, so a scene rests where its motion ends;
  - every coloured text-on-fill token pair (`src/lib/palette.ts`) reaches 4.5:1 in both themes.
- **Static checks over `dist`** (`bun run test:dist`): every term's `/t/` target and trigger, view integrity, every internal link and hash, and label in name for links and triggers.
- **Playwright** (Chromium). One test per behaviour, through the mechanism that owns it, not one per term or scene (the test audit, `docs/superpowers/plans/2026-10-29-test-audit.md`):
  - Every route, and every non-default `?view=`, renders with no console errors and passes an axe scan in both themes. On the same pass, SVG text contrast is measured against what is painted under it, and on figure scenes Labels mode is scanned and its labels checked for overlaps.
  - Representative term landings: `/t/<slug>/`, `?<slug>`, a later panel of a portrait carousel, a tap in the carousel, a `?view=` kept through a landing, and a pending term reaching its glossary entry. `?t=<unknown>` and an unknown `/t/` open the glossary filter.
  - The view switch: `?view=` on load, the buttons, the animated transition, and no replayed load-in on a view or Key/Labels switch.
  - Mobile portrait (390×844) shows the carousel; mobile landscape (844×390) shows the full diagram.
  - With reduced motion emulated, a scene runs no animations, CSS or SMIL, and every scene rests where its motion ends. The starfield canvas and the planet positions are also unchanged after one second, because they are drawn with `requestAnimationFrame` and `getAnimations()` doesn't see them.
  - Built HTML contains no internal link that bypasses the base path. Checked by building with `BASE=/hadith-science/` and crawling, including the `/t/` refresh and canonical URLs, the `terms-index.json` fetch URL and `404.html`.
- **README screenshots:**
  - A separate Playwright project captures one picture per concept into `docs/screenshots/`, light theme only: the figure key, eight scenes cropped to their title and diagram, a scene with a term's popover open, and a scene on a phone showing the carousel.
  - The map, the routes scene and the opposition scene are animated PNGs. Their frames are shot at fixed times (CSS animations and SMIL are paused and stepped, and the map's `requestAnimationFrame` runs on a stepped clock) and assembled by ffmpeg. The map is split on the diagonal, light theme top-left and dark bottom-right.
  - `Math.random` is seeded and the browser rasters in software, so an unchanged build gives byte-identical files.
  - `bun run screenshots` refreshes them locally and they are committed by hand. CI runs the project only on demand (`workflow_dispatch`).
  - They are documentation, not visual-regression baselines.
- **Copyright guard:**
  - `source/` is git-ignored.
  - A CI step fails if any `*.pdf`, `nuzhah*.txt` or annotation dump is tracked.
- **Workflows:**
  - Pull requests: install, `astro check`, Vitest, build, Playwright.
  - Pushes to `main`: the same steps, then deploy to GitHub Pages.
  - Cloudflare builds previews independently.

## 10. Delivery phases

1. **Foundation.**
   - Repo, tooling, CI, Pages and Cloudflare config, copyright guard.
   - Tokens, layout, header/footer, the map with all eight divisions.
   - Term inventory for the whole book; terms in unbuilt divisions are marked `pending`.
   - Glossary, figure key, share-link system.
2. **Mocked scenes.** The five scenes in §4.3, ported from the mockup into components and content files, with tests and screenshots.
3. **One phase per remaining division,** in planet order. Each phase starts with a design doc in `docs/superpowers/specs/`, then is built on its own branch and reviewed through its PR preview (§4.3).

Each phase has its own implementation plan.

## 11. Open items

- Translation queries (§2) await the owner's ruling.
- Which annotations are used: `notes/annotation-usage.md` is drafted in phase 1 for the owner's approval.
- Highlight and ink annotations have no text attached. Their text has to be recovered from the PDF using the annotation coordinates (QuadPoints) in phase 1.
- Delivery, madinah view: the "best of all: dictated (imlāʾ)" trigger moves with step 1 to the second column, where it runs past the first panel's edge (x 113–280 against 0–220) and is cut off in the portrait carousel. The panel guard checks it only at its default position (the comment in `Delivery.astro`). Move or shorten it, or accept the cut?
- Names: the ruled-out rows rest at opacity .12 (about 1.3:1) and are marked `data-incidental`, so the contrast check skips them as text meant not to be read (WCAG 1.4.3's incidental exemption). Confirm, or raise them to a readable strength?
- Cross-scene links: their accessible names now read the visible text, then ", scene: Title" or " (scene: Title)" (`XLink.astro`), so the name starts with what is shown (WCAG 2.5.3). Confirm the form.
