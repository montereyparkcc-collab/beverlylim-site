# Beverly Lim � Portfolio Site

Editorial portfolio redesign for [beverlylim.com](https://www.beverlylim.com), inspired by [Good Alley](https://www.good-alley.com).

## Design system

- **Palette:** Cream `#FAF6F0` � Fuchsia `#E84E8A` � Rose `#C0547A` � Navy `#1A1530`
- **Type:** Playfair Display � Cormorant Garamond � DM Sans
- **Signature:** About portrait bleeds from the left edge and overlaps into the Work section above

## Local preview

```bash
cd ~/beverlylim-site
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Deploying (replacing Wix)

Your live site is currently on Wix. To use this custom build:

1. **Host** the folder on Vercel, Netlify, or Cloudflare Pages (drag-and-drop or connect a Git repo).
2. **Point DNS** for `beverlylim.com` from Wix to your new host.
3. **Update** contact email, Instagram/LinkedIn URLs, and portfolio project links in `index.html`.

## Assets

- **Hero image:** save your file as `assets/hero-placeholder.jpg` (JPG or PNG � if PNG, rename the reference in `index.html` or save as `.jpg`)
- Portrait (About section): `assets/portrait.jpg`
- Work thumbnails: `assets/work/`
- Source portfolio files live in `~/Documents/BEVERLY/PORTFOLIO/`
