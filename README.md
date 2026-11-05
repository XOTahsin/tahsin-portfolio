# XOTahsin Portfolio V2

A complete redesign of the XOTahsin personal portfolio. Built as a lightweight, dependency-free static website using semantic HTML, modular CSS and vanilla JavaScript. It can be deployed directly to Vercel, Netlify or GitHub Pages (at a root domain).

## What's included

- Editorial / digital-studio visual direction with dark and light themes.
- Responsive desktop, tablet and mobile layouts.
- Keyboard-accessible navigation and command palette (`Ctrl/Cmd + K`).
- Project category filters and dedicated case-study pages.
- Live public GitHub profile and repository snapshot (gracefully degrades if API limits are reached).
- A Now & Next focus section and short Field Notes / developer journal entries.
- Subtle motion, reveal-on-scroll, reading progress and reduced-motion support.
- Contact via email, copy-email action, résumé request link.
- Search/social metadata, SVG favicon, social share cover, web manifest and 404 page.
- Original SVG project cover illustrations. These are portfolio artwork / illustrative previews, not captured product screenshots.

## Project structure

```text
.
├── index.html
├── 404.html
├── robots.txt
├── site.webmanifest
├── BUILD-MANIFEST.json
├── .nojekyll
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   └── overrides.css
│   ├── img/
│   │   ├── favicon.svg
│   │   ├── og-cover.svg
│   │   └── project-*.svg
│   └── js/
│       ├── app.js
│       └── case.js
└── work/
    ├── studypro/index.html
    ├── habitron/index.html
    └── regnar/index.html
```

## Run locally

No build step or package installation is required.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy

For Vercel: import this repository, choose **Other** (static), leave the build command empty, and use `.` as the output directory. The site uses root-relative asset paths, so deploy it at the domain root. For GitHub Pages, configure the publishing source to the `main` branch and `/ (root)`; if using a project subpath, adjust root-relative paths to the repository base path.

## Personal details to verify before sharing widely

- Confirm the wording of the bio and capability statements.
- Replace the illustration covers with real product screenshots when available.
- Add a résumé PDF and update the “Request my résumé” link if you want direct downloads.
- The contact email currently points to `mdtahsinislam.official@gmail.com`.
- StudyPro and Habitron source repositories are not linked because their GitHub repositories are private; live product links are provided instead.
- GitHub statistics are retrieved client-side from the public GitHub API. No token is stored in the site.

## Accessibility and performance notes

- Native HTML controls, visible focus states and a skip link are included.
- `prefers-reduced-motion` is respected.
- The site has no framework runtime or build dependencies.
- Google Fonts are optional; the CSS has system-font fallbacks.
- Live GitHub data is progressive enhancement and does not block page content.
