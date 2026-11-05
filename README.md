# XOTahsin — Digital Fieldnotes

An editorial, zine-inspired personal portfolio for MD Tahsin Islam. The site is intentionally built as a lightweight static website: no build step, no framework dependency and no external runtime service required.

## Run locally

Open `index.html` directly in a browser, or start a simple local server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Edit the content

- Homepage content and project entries: `index.html`
- Visual system and responsive layout: `assets/css/styles.css`
- Theme, mobile navigation, project filters and command palette: `assets/js/app.js`
- Individual project notes: `work/<project>/index.html`
- Project artwork, Open Graph cover and favicon: `assets/img/`

## Art direction

The visual system is an editorial digital zine: warm paper, ink, cobalt and vermilion; a serif/sans/mono type mix; asymmetric project layouts; print-like grain; and custom SVG artwork. It avoids generic glass cards, neon gradients and decorative skill scores.

## Interactions

- Paper / night theme switch, with saved preference when browser storage is available.
- Responsive navigation for small screens.
- Project filters: all, products and tools.
- Quick index / command palette with `Ctrl + K` or `/`; Escape closes it.
- Scroll reveals respect the user's reduced-motion preference.
- The public repository shelf attempts a lightweight GitHub API refresh and keeps an HTML fallback if that request is unavailable.
- All core content remains readable without JavaScript.

## Deploy

The site is plain static HTML/CSS/JS and can be deployed to GitHub Pages or Vercel with no build command. Use the repository root as the output directory.

## Notes

Project descriptions are intentionally limited to capabilities that are represented in the corresponding repositories or existing project pages. Visual project panels are original SVG artwork created for this portfolio, not screenshots of the live applications. Replace these with current product screenshots when you have approved images ready.
