# Eduardo García-Valdecasas — personal academic website

English: <https://eduardo-garcia-valdecasas.github.io/>

Español: <https://eduardo-garcia-valdecasas.github.io/es/>

A bilingual Quarto website hosted free on GitHub Pages. The five pages are Me, Research, Teaching, Outreach and Talks. Both contact forms deliver to eduardo.garcia.valdecasas@gmail.com through FormSubmit.

## Updating the content

The editable content is in **source/data/content.json**. It contains the bilingual bio, current role, publications, courses, supervised projects, outreach videos and research talks. English and Spanish share the same scientific records, while the interface and summaries are translated.

The page generator in **scripts/generate-pages.mjs** controls page layout and interface wording. It generates the `.qmd` pages before rendering; edits to generated pages are replaced at the next build. The design is in **source/assets/site.css** and the page shell is in **source/templates/page.html**.

Use **source/publications.bib** for the downloadable bibliography. Update that file alongside the publication records.

### Adding notes, solved exercises or an HTML animation

1. Put the PDF, HTML file or supporting folder in **source/assets/materials/**. An animation can be an ordinary HTML page with its JavaScript and images alongside it. No server or paid service is required.
2. Add a record to the `materials` array in `source/data/content.json`:

```json
{
  "title": {"en": "Your resource title", "es": "Título del recurso"},
  "description": {"en": "A brief description.", "es": "Una descripción breve."},
  "kind": "notes",
  "url": "assets/materials/your-file.pdf"
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

To publish an update with the existing GitHub Pages setup, copy the contents of `dist/` to the repository root, keeping `source/` and `scripts/`, then commit and push to `main`. The existing GitHub Pages deployment publishes the root automatically. The generated `.nojekyll` file is required. Nothing requires a paid hosting plan.

## Contact forms

Both forms use FormSubmit, with separate email subjects for PhD enquiries and outreach invitations. FormSubmit requires recipient verification before delivery; follow the activation email if the address or website origin changes. Native required fields and a honeypot provide basic validation and spam reduction. The forms display a delivery error when the service does not confirm success, and a direct email link is always visible. No attachments are requested; prospective students can share a CV link.

FormSubmit and YouTube are external services with their own availability and privacy policies. Hosting remains static and free. GitHub Pages does not run server-side application code.

## Content sources

Publication links point to INSPIRE, arXiv and the journal. Talks link to verified event programmes, slides or recordings when available. The teaching page distinguishes the historical Quantum Mechanics I syllabus from a later official Fundamentals of Physics III guide. The current UPM role and October 2026 start date were supplied by Eduardo.

The photograph and research content belong to their respective owners. The photograph was provided by Eduardo for this site.
