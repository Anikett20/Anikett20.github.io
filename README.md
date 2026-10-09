# Aniket Kulkarni — VLSI portfolio

A responsive, static personal portfolio for VLSI Design & Technology, built with HTML, CSS, and vanilla JavaScript. The dark vCard layout has a fixed desktop sidebar, a mobile menu, original circuit illustrations, five navigable sections, and project details.

## Files

- `index.html` — profile, experience, education, training, project summaries, and contact links.
- `assets/style.css` — desktop/mobile layout, visual styling, and reduced-motion support.
- `assets/app.js` — hash navigation, project filters and dialogs, mobile navigation, motion control, and email copying.
- `assets/Aniket_Kulkarni_Resume.pdf` — the supplied resume, copied unchanged. Both view and download links use this file.
- `assets/circuit-hero.svg`, `assets/project-*.svg`, and `assets/favicon.svg` — original decorative and schematic artwork. Project illustrations are explanatory graphics, not physical-design screenshots.

## Preview locally

There is no build step or package installation. Open `index.html` directly, or serve the repository directory with a local static server. For example, if Python is installed:

```sh
python -m http.server 8765
```

Then open `http://localhost:8765`. A local server is recommended for testing browser clipboard and PDF behavior. If email copying is unavailable, the page selects the visible address for manual copying.

## Publish

The files can be served from GitHub Pages or any static host. For this repository, configure GitHub Pages to deploy the `main` branch from `/ (root)` and keep `index.html` and `assets/` together. The site uses relative asset paths and requires no backend, secrets, or environment variables.

The Google Fonts stylesheet is optional: the page has local serif, sans-serif, and monospace fallbacks. All artwork and the resume are hosted within this repository. There are no third-party image/video dependencies, analytics, or contact-form services.

## Update content

Edit the visible profile and resume sections in `index.html`. The complete project-dialog content is in the `projects` object in `assets/app.js`; update its corresponding project summary in `index.html` at the same time. Project results are explicitly attributed to the resume. Replace the PDF at its existing path to update the downloadable document, and reconcile the page text with the new version.

Navigation supports `#home`, `#about`, `#resume`, `#portfolio`, and `#contact`. Earlier anchors such as `#projects`, `#experience`, `#education`, and `#skills` resolve to the relevant section. Browser Back/Forward and direct section URLs work without server rewrites.

## Accessibility

The site includes visible keyboard focus, a skip link, meaningful navigation labels, native modal dialogs with Escape-to-close and focus restoration, a mobile-menu focus loop, an announcement after project filtering, a pause-motion control, and support for the system's reduced-motion preference. With JavaScript disabled, all main sections and PDF links remain available.

## Content source

Biographical, educational, internship, workshop, and project information is based on Aniket Kulkarni's supplied resume. No source repository, technical report, portrait, or fabrication claim has been invented. The visual direction is an original implementation inspired by the user's requested dark vCard reference.
