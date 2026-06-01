# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static personal portfolio site for thomasdenny.co. No build system, no framework, no package manager — pure HTML, CSS, and vanilla JS, deployed via GitHub Pages.

## Development

To preview locally, serve from a local HTTP server (file:// won't handle the SPA routing correctly):

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

**After editing `styles.css` or `scripts.js`, bump the cache-buster query string** on the corresponding `<link>` and `<script>` tags at the bottom of `index.html`:

```html
<link rel="stylesheet" href="/styles.css?v=mobilenav3" />
...
<script src="/scripts.js?v=mobilenav3"></script>
```

Increment or rename the version token so returning visitors get the updated file.

## Deployment

Push to `main` — GitHub Pages auto-deploys. The `CNAME` file maps the repo to `thomasdenny.co`.

## Architecture

**Three files do everything:**

- `index.html` — single page; all content lives here as semantic HTML sections (`#work`, `#built`, `#now`, `#contact`)
- `styles.css` — all styles; design tokens defined in `:root`
- `scripts.js` — all interactions as self-contained IIFEs

**SPA routing** is handled by an inline `<script>` at the bottom of `index.html`. It uses the History API and `sessionStorage` to treat URL paths like `/work` as scroll targets, so deep links and the back button work correctly on GitHub Pages.

**Design system (`:root` in `styles.css`):**

| Token | Value | Use |
|---|---|---|
| `--ivory` / `--paper` / `--bone` | warm off-whites | backgrounds |
| `--ink` / `--ink-2` | near-black | primary text |
| `--brass` / `--brass-2` | gold | accents, links |
| `--oxblood` | dark red | italics, hover states |
| `--hairline` | warm gray | borders, dividers |
| `--serif-display` | Fraunces | headlines |
| `--serif-body` | Newsreader | body copy |
| `--mono` | JetBrains Mono | labels, tags, nav |

**Responsive breakpoints:**
- `≤ 700px` — mobile nav (hamburger replaces inline links)
- `≤ 800px` — dossier section collapses to single column
- `≤ 900px` — hero grid collapses to single column

**Reveal animations** use `.reveal` + IntersectionObserver; add `data-stagger="1–6"` for staggered delay. Hero entrance is handled by CSS `@keyframes rise` with per-element `animation-delay`.

**`404.html`** is intentionally a separate file using Tailwind CDN — it doesn't share the main design system.
