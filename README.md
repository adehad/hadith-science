# Nuzhat al-Naẓar, visualised

A visual guide to Ibn Ḥajar al-ʿAsqalānī's *Nuzhat al-Naẓar*, his short book on the hadith sciences. The book sorts every report by how it reached us, whether it is accepted or rejected, where its chain ends, how it was passed on and who its narrators were. This site draws that structure: the eight divisions orbit the Prophet ﷺ as planets, narrators are figures whose scroll and seal show how far they can be trusted, and every term links to a short paraphrase with its section number.

Live site: <https://adehad.github.io/hadith-science/>

![The map of the book, animated: eight planets, one for each of Ibn Ḥajar's divisions, circling a full moon for the Prophet ﷺ, each with its moons for the sub-divisions. The light theme is shown above the diagonal and the dark theme below it](docs/screenshots/map.png)

## What's covered so far

- **The map** of all eight divisions. On portrait phones it becomes a nested list.
- **A page for each division** with its sub-divisions and terms.
- **The figure key** (`/narrators/`), showing how a narrator figure is read.
- **The glossary** (`/terms/`): all 169 terms, each with a paraphrased definition and its § reference. It can be filtered, and you can search without diacritics.
- **Share links:** `/t/<term>/`, `?<term>` and `?t=<term>` all go to the term. Unknown terms open a glossary search.
- Light and dark themes, and full support for reduced motion, plus a **Motion** switch in the header that stops every animation.
- Installable as an app, and readable offline after the first visit.

- **Twenty-one scenes** (below), each one diagram whose terms open a popover and have their own share link.

Terms without a scene yet are marked "scene coming soon" in the glossary. Later phases draw the rest, one division at a time.

![The figure key: eight narrator figures (reliable, unknown, unnamed, weak, liar, memory failed, conceals and missing link), each marked by its name scroll and seal, and below them a reliable narrator of each generation from the Prophet ﷺ to later narrators](docs/screenshots/narrators.png)

<p>
  <img width="71%" alt="How sound is it? with the popover for ṣaḥīḥ li-dhātihi open over the diagram: the term in Arabic, a paraphrased definition, its § reference, and buttons to copy its link, share it or see it in the glossary" src="docs/screenshots/popover.png">
  <img width="24%" alt="How many routes carry it? on a phone: the first panel of the carousel, a single chain from the Prophet ﷺ labelled gharīb, with the carousel's arrows and dots below it" src="docs/screenshots/phone.png">
</p>

## Scenes

| Scene | Page | Terms |
|---|---|---|
| **ʿAdad al-ṭuruq** (how a report reached us) | | |
| What is a report? | `/adad-al-turuq/report/` | khabar, ḥadīth, isnād, matn |
| How many routes carry it? | `/adad-al-turuq/routes/` | mutawātir, mashhūr, ʿazīz, gharīb |
| Which reports are acted on? | `/adad-al-turuq/sorting/` | āḥād, mustafīḍ, maqbūl, mardūd |
| How sure can we be? | `/adad-al-turuq/knowledge/` | al-ʿilm al-yaqīnī, al-ʿilm al-naẓarī, al-khabar al-muḥtaff bi-l-qarāʾin |
| Where is the narrator alone? | `/adad-al-turuq/lone/` | gharīb muṭlaq, fard, gharīb nisbī |
| **al-Maqbūl** (accepted reports) | | |
| How sound is it? | `/al-maqbul/grades/` | ṣaḥīḥ and ḥasan, in themselves and by others; ʿadl, ḍabṭ and ittiṣāl; the soundest chains; ḥasan ṣaḥīḥ |
| Who outweighs whom? | `/al-maqbul/opposition/` | ziyādat al-thiqa, shādhdh and maḥfūẓ, munkar and maʿrūf |
| Does anyone else carry it? | `/al-maqbul/support/` | iʿtibār, mutābaʿa (full and partial), mutābiʿ, shāhid |
| Can both be acted on? | `/al-maqbul/acted-on/` | muḥkam, mukhtalif al-ḥadīth, naskh, nāsikh and mansūkh, tarjīḥ, tawaqquf |
| **al-Mardūd** (rejected reports) | | |
| Why is a report rejected? | `/al-mardud/causes/` | saqṭ, ṭaʿn |
| Where does the chain break? | `/al-mardud/breaks/` | mursal, muʿallaq, muʿḍal, munqaṭiʿ |
| Did he hear it from him? | `/al-mardud/hidden/` | mudallas, mudallis, mursal khafī |
| Did he lie? | `/al-mardud/lying/` | kadhib, tuhma bi-l-kadhib, mawḍūʿ, matrūk |
| Did he keep it right? | `/al-mardud/slips/` | fuḥsh al-ghalaṭ, ghafla, wahm, muʿallal, sūʾ al-ḥifẓ, mukhtaliṭ |
| What changed in the telling? | `/al-mardud/changes/` | mukhālafa, mudraj (in the chain and the text), maqlūb, al-mazīd fī muttaṣil al-asānīd, muḍṭarib, muṣaḥḥaf, muḥarraf |
| May the words be changed? | `/al-mardud/wording/` | ikhtiṣār al-ḥadīth, al-riwāya bi-l-maʿnā, gharīb al-ḥadīth |
| Why is he unknown? | `/al-mardud/identity/` | jahāla, al-wuḥdān |
| Who is this narrator? | `/al-mardud/unknown/` | mubham, majhūl, majhūl al-ʿayn, mastūr |
| Does his belief count against him? | `/al-mardud/innovation/` | fisq, bidʿa |
| **Other divisions** | | |
| How was it received? | `/siyagh-al-ada/delivery/` | the eight ranks of delivery words, and the weaker ways below them |
| Who is who? | `/al-asma/names/` | muttafiq wa-muftariq, muʾtalif wa-mukhtalif, mutashābih |

Figure scenes can show a key under the diagram (**Key**) or write each narrator's kind beside the figure (**Labels**), and the choice is remembered. Where the book gives more than one position, **Other views** switches the diagram to it and keeps the view in the link (`?view=`). On a portrait phone a wide diagram becomes a swipe carousel, one panel at a time.

**ʿAdad al-ṭuruq** (how a report reached us)

![What is a report? The anatomy of a report: a chain of narrators from the Prophet ﷺ down to al-Bukhārī leading to the text "actions are judged by intentions", with the isnād and the matn labelled, beside a circle showing khabar and ḥadīth as two names for one thing](docs/screenshots/report.png)

![How many routes carry it? animated: four chains from the Prophet ﷺ with one, two, three and five narrators in each generation, labelled gharīb, ʿazīz, mashhūr and mutawātir, their dashed arrows flowing down](docs/screenshots/routes.png)

**al-Maqbūl** (accepted reports)

![How sound is it? The five conditions of a ṣaḥīḥ report ticked beside a chain, the four ranks of sound chains with their accuracy, reports raised to sound or fair by support, and al-Tirmidhī's double grade ḥasan ṣaḥīḥ](docs/screenshots/grades.png)

![Who outweighs whom? animated: added words checked for a clash, then balance scales that tip, maḥfūẓ outweighing shādhdh when both sides are reliable and maʿrūf outweighing munkar when the loser is weak](docs/screenshots/opposition.png)

**al-Mardūd** (rejected reports)

![Why is a report rejected? Three chains each missing a narrator in a different place, for omission (saqṭ), beside a ladder of the ten causes of criticism (ṭaʿn) from the gravest down](docs/screenshots/causes.png)

![Where does the chain break? Four chains from the Prophet ﷺ, each with a missing narrator in a different place, labelled mursal, muʿallaq, muʿḍal and munqaṭiʿ, with a verdict above each](docs/screenshots/breaks.png)

**Other divisions**

![How was it received? A staircase of the eight ranks of delivery words, from hearing the teacher alone down to ʿan and qāla, where hearing is not certain, each step with its Arabic words and an arrow that thins as contact grows less certain, and the weaker ways of receiving below the stairs](docs/screenshots/delivery.png)

![Who is who? Four cells: one name shared by two different men, letters told apart only by their dots, two names that differ by a vowel, and a list of similar names with the one meant highlighted](docs/screenshots/names.png)

## Source and copyright

The site follows the English translation of the *Nuzhah* in A. S. Hussain's 2012 thesis. That translation may not be redistributed, so:

- All text on the site is our own paraphrase. Every claim carries the § number it comes from, such as "§5.55".
- Nothing from the translation is reproduced beyond a few words of Arabic terminology.
- The thesis and anything extracted from it stay out of the repository, in the git-ignored `source/` folder. A pre-commit hook and CI both fail if any of it is committed.

Possible slips in the translation are listed in `notes/translation-queries.md`.

## Development

This project uses [Bun](https://bun.sh) for packages and scripts.

```sh
bun install
bun run dev           # local dev server
bun run build         # static build into dist/, then the offline service worker
bun run preview       # serve dist/
bun run check         # astro check (types)
bun run test          # unit tests (Vitest)
bun run test:dist     # static checks over dist; needs a build first
bun run test:e2e      # end-to-end tests (Playwright); needs a build first
bun run screenshots   # regenerate docs/screenshots/; needs a build first, and ffmpeg on PATH
bun run test:base     # build under /hadith-science/, check every link keeps the base, and run the dist checks on it
```

`bun run screenshots` assembles the animated PNGs (the map, and the routes and opposition scenes) with [ffmpeg](https://ffmpeg.org), and stops with a message if `ffmpeg` is not on your PATH.

The end-to-end tests run against `bun run preview` on port 4321. If something else is already using that port, set `E2E_PORT` to use a different one. Locally, Playwright drives the system Microsoft Edge. CI installs Playwright's own Chromium instead (`bunx playwright install --with-deps chromium`).

The app icons in `public/icons/` are generated from `public/icons/icon.svg` (a copy of `public/favicon.svg`) by `bunx pwa-assets-generator`; regenerate and commit them if the icon changes.

Pre-commit hooks are run by [prek](https://github.com/j178/prek) (`prek install`). They check whitespace, YAML, spelling, Arabic presentation forms and the source guard, and run the unit tests.

## Deployment

- **Production:** GitHub Pages, deployed by `.github/workflows/ci.yml` on every push to `main`. The workflow sets `SITE` and `BASE` from `actions/configure-pages`, so the site is served under `/hadith-science/`.
- **Branch previews:** Cloudflare Workers Builds, configured by `wrangler.toml`. Previews serve the site at `/`. To set them up once in the Cloudflare dashboard:
  1. Connect this repository to Workers Builds.
  2. Name the Worker **`hadith-science`**. It must match `name` in `wrangler.toml`.
  3. Set the build command to **`bun install && bun run build`**.
  4. Keep the default deploy command for non-production branches (`bunx wrangler versions upload`). Every branch then gets a preview URL.

## Licence

To be decided.
