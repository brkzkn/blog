# burakozkan.net

Personal site of Burak Özkan: architecture work, things built at home, and a personal journal that replaces social media.

**Status:** static HTML prototype (design source of truth, `prototype/`) and the Astro foundation at the repo root (layout, content schemas, deploy). Pages are being ported (see `docs/roadmap.md`).

## Run the Astro site

Needs Node 22.23.4 or newer (Astro 7).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
npm run check     # astro check (types, content schemas)
```

**Preview flag.** `PUBLIC_PREVIEW` (see `.env.example`; local `.env` is git-ignored) controls the "DESIGN PREVIEW" banner and the "V4.2 preview" footer line. Anything other than `false` shows them, so the default is on. At launch set it to `false` in `.env` and in `.github/workflows/deploy.yml` (`env: PUBLIC_PREVIEW`).

**Deploy.** Every push to `main` runs `.github/workflows/deploy.yml` (build with `withastro/action`, publish with `actions/deploy-pages`); it can also be started by hand (workflow_dispatch). One-time setup: repository Settings, Pages, Source = GitHub Actions; custom domain `burakozkan.net` is set by `public/CNAME`; DNS at the registrar (A records to GitHub Pages, `www` CNAME to `<user>.github.io`).

Content lives in `src/content/` (schemas in `src/content.config.ts`, fields in `docs/content-model.md`); global CSS is `src/styles/site.css` (a copy of the prototype stylesheet) and images are in `public/assets/images/`.

## Run the prototype

```bash
cd prototype
python3 -m http.server 8080
# open http://localhost:8080
```

`prototype/feed-types.html` shows every home-feed entry type with its variants in one place (not linked from the site). Add a variant in `assets/js/feed-type-examples.js`.

Pages also open directly from disk. Theme and language preferences are stored in `localStorage`.

## For Claude Code

Project instructions live in `CLAUDE.md`. Design tokens in `docs/design-system.md`, content model in `docs/content-model.md`.
