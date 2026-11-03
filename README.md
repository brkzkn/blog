# burakozkan.net

Personal site of Burak Özkan: architecture work, things built at home, and a personal journal that replaces social media.

**Status:** static HTML prototype, design complete. Next: Astro migration (see `docs/roadmap.md`).

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
