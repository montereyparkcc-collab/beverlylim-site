# Beverly Lim — Portfolio Site

Editorial portfolio for [www.beverlylim.com](https://www.beverlylim.com). A static
site (plain HTML/CSS/JS, no build step) hosted on Vercel.

## Design system

- **Palette:** Cream `#FAF6F0` · Fuchsia `#E84E8A` · Rose `#C0547A` · Navy `#1A1530`
- **Type:** Playfair Display · Cormorant Garamond · DM Sans

## Project structure

```
index.html              Home (work grid, about, press, contact)
css/styles.css          All site styles
js/main.js              Nav, year stamp, and the shared lightboxes
work/<project>/         One folder per project page
assets/work/<project>/  Web-optimized images for each project
work/_archive/          Intentionally unlinked/archived pages
```

## Local preview

```bash
cd ~/beverlylim-site
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Deploying

The site is a Vercel project (directory-linked via `.vercel/`). To publish the
current files to production:

```bash
vercel deploy --prod
```

> Note: Vercel's automatic GitHub deploys are not currently wired to this repo
> (`origin` → `montereyparkcc-collab/beverlylim-site`). Until that is reconnected
> in the Vercel dashboard (Project → Settings → Git), publish with the CLI
> command above after pushing to `origin`.

## Image guidelines

- Keep the longest side ≤ 1600px and export JPEG at ~80% quality.
- Use descriptive, lowercase, hyphenated filenames (e.g. `gouache-peonies.jpg`).
- Store originals outside the repo to keep it lean.
