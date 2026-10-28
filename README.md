# Nuzhat al-Naẓar, visualised

A visual guide to Ibn Ḥajar al-ʿAsqalānī's *Nuzhat al-Naẓar*, his short book on the hadith sciences. The book sorts every report by how it reached us, whether it is accepted or rejected, where its chain ends, how it was passed on and who its narrators were. This site draws that structure: the eight divisions orbit the Prophet ﷺ as planets, narrators are figures whose scroll and seal show how far they can be trusted, and every term links to a short paraphrase with its section number.

Live site: <https://adehad.github.io/hadith-science/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/map-desktop-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/screenshots/map-desktop-light.png">
  <img alt="The map of the book: eight planets, one for each of Ibn Ḥajar's divisions, orbiting a full moon" src="docs/screenshots/map-desktop-light.png">
</picture>

## What's covered so far

- **The map** of all eight divisions. On portrait phones it becomes a nested list.
- **A page for each division** with its sub-divisions and terms.
- **The figure key** (`/narrators/`), showing how a narrator figure is read.
- **The glossary** (`/terms/`): all 169 terms, each with a paraphrased definition and its § reference. It can be filtered, and you can search without diacritics.
- **Share links:** `/t/<term>/`, `?<term>` and `?t=<term>` all go to the term. Unknown terms open a glossary search.
- Light and dark themes, and full support for reduced motion.
- Installable as an app, and readable offline after the first visit.

No division has its scenes drawn yet, so every term is still marked "scene coming soon". Later phases build the scenes one division at a time.

| | Light | Dark |
|---|---|---|
| Figure key | ![Figure key, light](docs/screenshots/narrators-desktop-light.png) | ![Figure key, dark](docs/screenshots/narrators-desktop-dark.png) |
| Phone | ![Map on a phone, light](docs/screenshots/map-mobile-light.png) | ![Glossary on a phone, dark](docs/screenshots/terms-mobile-dark.png) |

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
bun run test:e2e      # end-to-end tests (Playwright); needs a build first
bun run screenshots   # regenerate docs/screenshots/; needs a build first
bun run test:base     # build under /hadith-science/ and check every link keeps the base
```

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
