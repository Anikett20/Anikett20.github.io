# Aniket Kulkarni — VLSI portfolio

A responsive, static personal portfolio for VLSI Design & Technology, built with HTML, CSS, and vanilla JavaScript. The warm charcoal, ivory, and muted copper palette complements a dark vCard layout with a fixed desktop sidebar, a mobile menu, original circuit illustrations, five navigable sections, and project details.

## Files

- `index.html` — profile, experience, education, training, project summaries, and contact links.
- `assets/style.css` — desktop/mobile layout, visual styling, and reduced-motion support.
- `assets/app.js` — hash navigation, project filters and dialogs, mobile navigation, motion control, and email copying.
- `assets/Aniket_Kulkarni_Resume.pdf` — the updated one-page resume, including seven documented Verilog projects, the SemiX AI hardware workshop, and 4th Annual SemiX Summit. The Resume section contains one Download resume (PDF) action.
- `assets/updates.css` — styles for the featured SoC card, project links, and workshop source links.
- `assets/project-riscv-layout.jpg` — actual phase-5 GDSII layout shown in KLayout, from the author's project documentation.
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

Edit the visible profile and resume sections in `index.html`. The complete project-dialog content is in the `projects` object in `assets/app.js`; update its corresponding project summary in `index.html` at the same time. Replace the PDF at its existing path to update the downloadable document, and reconcile the page text with the new version. Keep the project count and filter status consistent with the cards.

Navigation supports `#home`, `#about`, `#resume`, `#portfolio`, and `#contact`. Earlier anchors such as `#projects`, `#experience`, `#education`, and `#skills` resolve to the relevant section. Browser Back/Forward and direct section URLs work without server rewrites.

## Accessibility

The site includes visible keyboard focus, a skip link, meaningful navigation labels, native modal dialogs with Escape-to-close and focus restoration, a mobile-menu focus loop, an announcement after project filtering, a pause-motion control, and support for the system's reduced-motion preference. With JavaScript disabled, all main sections and the resume download remain available.

## Content source

Biographical, educational, internship, and earlier-project information is based on Aniket Kulkarni's supplied resume and public LinkedIn profile. The October 2026 additions use these author-supplied posts, all published on 26 October 2026:

- [RV32IM + Zicsr microcontroller SoC](https://www.linkedin.com/posts/aniket-kulkarni-2352a0322_rv32im-zicsr-microcontroller-soc-report-activity-7520454299001188352-KaMY)
- [SemiX AI hardware workshop](https://www.linkedin.com/posts/aniket-kulkarni-2352a0322_vlsi-systolicarray-synopsys-activity-7520472122079735808-SAjJ)
- [4th Annual SemiX Summit, 14–17 October 2026](https://www.linkedin.com/posts/aniket-kulkarni-2352a0322_semix-iitbombay-vlsi-activity-7520465655326846977-D3-4)

The seven project cards are grounded in the [Projects source repository](https://github.com/Anikett20/Projects), including each project README, testbench, and the [upload audit](https://github.com/Anikett20/Projects/blob/main/verification/UPLOAD_AUDIT.md). The supplied CI passes directed simulation for all seven, with generic Yosys synthesis results for the MIPS16, MIPS32, FIFO, and matrix projects. These checks do not cover every instruction, input, or corner. Historical OpenLane and Synopsys reports are described as saved evidence; physical signoff is not claimed.

The SoC figures were cross-checked against the author's phase-5 OpenLane metrics, post-route OpenSTA power/timing summaries, DRC/LVS reports, and engineering report. Power values are estimates. Saved extracted setup WNS spans −0.83 to −1.42 ns across corners, and antenna checks report 507 pin violations. Zero Magic DRC / Netgen LVS errors are scoped to those specific checks and do not imply complete manufacturing signoff. The AI workshop was a guided walkthrough using pre-built reference designs.

The visual direction preserves the original dark vCard implementation. Illustrations for the earlier projects remain explanatory graphics; the SoC image is an actual layout capture.
