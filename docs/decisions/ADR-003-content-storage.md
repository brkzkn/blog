# ADR-003: Content storage and hosting

Date: 2026-11-04 · Status: accepted

## Context
Publishing must take under a minute from a phone or a laptop, and the owner wants to own the content. The previous WordPress blog depended on a database and a login, and went silent.

## Decision
- **Markdown in git.** One folder per post: `src/content/posts/<year>/<yyyy-mm-dd>-<slug>/index.<lang>.md`, with photos colocated in the same folder and referenced relatively (`./01.jpg`) through Astro's `image()` helper.
- **Glob content collections** (`glob()` loader) for `posts`, `work`, `gear` and `pages`, validated by Zod in `src/content.config.ts`. A translated sibling is another file in the same folder (`index.en.md` next to `index.tr.md`) with the same derived slug.
- **Hosting:** GitHub Pages, deployed by GitHub Actions (`withastro/action` then `actions/deploy-pages`) on every push to `main`.
- **Domain:** custom domain `burakozkan.net`, set by `public/CNAME`. DNS is configured at the registrar (A records to GitHub Pages, `www` CNAME).
- **Sample content** carries `sample: true` in frontmatter so the launch cleanup list in `docs/roadmap.md` stays auditable.

## Consequences
- No database, no admin panel; history, backup and review come from git.
- Photos are optimised at build time; large originals in the repo grow its size, so photos should be exported at a sensible size before commit.
- Publishing from a phone relies on GitHub mobile or Obsidian plus git.
- Pages serves only static files: no server redirects, no form handling (subscribe goes to an external provider later).
- Moving host later is easy (static `dist/`); moving off Markdown is not needed.

## Alternatives considered
- **Headless CMS:** extra login and service; the friction this project avoids.
- **Single flat file per post:** simpler, but photos then need a separate folder and drift from the text.
- **Netlify / Cloudflare Pages:** fine, but GitHub Pages is free, already tied to the repo, and enough.
