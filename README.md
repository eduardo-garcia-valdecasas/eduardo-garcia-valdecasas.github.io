# Eduardo García-Valdecasas — personal academic website

English: <https://eduardo-garcia-valdecasas.github.io/>

Español: <https://eduardo-garcia-valdecasas.github.io/es/>

A bilingual Quarto website prepared for free GitHub Pages hosting. The public address currently shows only a temporary offline notice; the academic pages and assets are excluded from publication. The five pages are Me, Research, Teaching, Outreach and Talks. The PhD and outreach sections provide protected email links.

## Updating the content

The editable content is in **source/data/content.json**. It contains the bilingual bio, current role, publications, courses, supervised projects, outreach videos and research talks. English and Spanish share the same scientific records, while the interface and summaries are translated.

The page generator in **scripts/generate-pages.mjs** controls page layout and interface wording. It generates the `.qmd` pages before rendering; edits to generated pages are replaced at the next build. The design is in **source/assets/site.css** and the page shell is in **source/templates/page.html**.

The Research illustration is an original regular hyperbolic tessellation, generated as static SVG by **scripts/ads-tessellation.mjs**.

Use **source/publications.bib** for the downloadable bibliography. Update that file alongside the publication records.

### Adding an HTML problem-solution animation

1. Put the HTML animation or its supporting folder in **source/assets/materials/**. An animation can be an ordinary HTML page with its JavaScript and images alongside it. No server or paid service is required.
2. Add a record to the `materials` array in `source/data/content.json`:

```json
{
  "title": {"en": "Your resource title", "es": "Título del recurso"},
  "description": {"en": "A brief description.", "es": "Una descripción breve."},
  "kind": "animation",
  "url": "assets/materials/your-animation.html"
}
```

`kind` can be `notes`, `exercises`, `animation` or `video`. Use a full YouTube URL for a video. Use `assets/materials/...` for local files: the generator adjusts this path for Spanish pages. The Teaching page lists resources automatically; until resources exist it shows a short notice.

### Adding a YouTube recording

Add an entry under `outreach` or `recorded_talks`, following an existing record, with the 11-character video `id`, title, channel, URL, upload date and duration in seconds. Outreach records also contain `summary_en` and `summary_es`. A privacy-enhanced YouTube player loads when a visitor chooses to play. The direct YouTube link is always available.

## Build and preview

Install [Quarto](https://quarto.org/docs/get-started/) and [Node.js](https://nodejs.org/). This project needs no npm packages.

From the repository folder:

```text
npm run build
npm run preview
```

The built site appears in `dist/`. Preview it at `http://127.0.0.1:4321`. `QUARTO_BIN` can point to a portable Quarto installation.

Keep the academic pages offline until Eduardo explicitly asks to make the site public again. To restore publication, remove the temporary root `_config.yml`, copy the contents of `dist/` to the repository root (including `.nojekyll`), keep `source/` and `scripts/`, and commit and push to `main`. This replaces the temporary offline `index.html`, `404.html` and `robots.txt`. The GitHub Pages deployment then publishes the restored site. Nothing requires a paid hosting plan.

## Protected email links

The contact address is encoded in `source/data/content.json`. The browser assembles a `mailto:` link only when a visitor clicks an email link. PhD and outreach links prefill distinct subjects. A readable, obfuscated fallback is available without JavaScript. The current rendered pages and source files do not contain the plain email address.

This deters basic email-harvesting bots. A public contact method cannot prevent all automated collection. No form service, registration, activation email or backend is needed. To change the contact address, update `contact_code` using the same character encoding as the click handler in `source/assets/site.js`.

YouTube is an external service with its own availability and privacy policy. Hosting remains static and free.

## Content sources

Publication links point to INSPIRE, arXiv and the journal. Talks link to verified event programmes, slides or recordings when available. The Teaching page focuses on Classical Mechanics and Physics II at ETSIAE, planned HTML solution animations, and a compact summary of earlier UAM teaching and BSc supervision. The current UPM role and October 2026 start date were supplied by Eduardo.

The photograph and research content belong to their respective owners. The photograph was provided by Eduardo for this site.
