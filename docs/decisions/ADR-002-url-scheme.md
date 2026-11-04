# ADR-002: URL scheme

Date: 2026-11-04 · Status: accepted

## Context
URLs are hard to reverse once indexed and shared. The scheme in `docs/content-model.md` was a target; the prototype's 13 files must map onto it, and the old WordPress archive may be imported later with original slugs.

## Decision
Every route ends with a trailing slash (`trailingSlash: 'always'`, `build.format: 'directory'`). No `.html` in any internal link.

| Prototype file | Route |
|---|---|
| `index.html` | `/` |
| `work.html` | `/work/` |
| `architecture-notes.html` | `/work/architecture-notes/` |
| `projects.html` | `/projects/` |
| `smart-home.html` | `/projects/smart-home/` |
| `life.html` | `/life/` |
| `london-guide.html` | `/life/trips/london-guide/` |
| `october-2026.html` | `/life/culture/2026-10/` |
| `restaurant.html` | `/life/restaurants/kucuk-liman/` |
| `gear.html` | `/gear/` |
| `note.html` | `/notes/kadikoy-kalamar/` |
| `blog.html` | `/writing/` |
| `agentic-workflows.html` | `/writing/agentic-workflows/` |
| `profile.html` | `/about/` |
| `feed-types.html` | `/dev/feed-types/` (dev only, `getStaticPaths` returns `[]` in production) |

Rules from the content model stay: any post is served at `/notes/<slug>/` regardless of type (types are rendering hints, not paths); long posts also list under `/writing/`; `/gear/<slug>/`, `/now/`, `/rss.xml` follow the content model. The slug is the post folder name without its date prefix (`2026-10-30-kadikoy-kalamar` gives `kadikoy-kalamar`).

**Language routes.** `/tr/...` mirrors are specified but Phase 1 ships English routes only, with the client-side EN/TR UI toggle. A post that has a sibling `index.tr.md` / `index.en.md` gets `/tr/` routes later; until then the single file is served at its normal route with its original language marked.

## Consequences
- Links survive a later move of content storage; slugs are stable identifiers.
- A post's URL does not change if its type changes.
- Detail pages for trips, restaurants and culture diaries have their own sub-trees, so these are not reachable under `/notes/`.
- Adding `/tr/` later is additive. Renaming a slug afterwards requires a redirect.

## Alternatives considered
- **Type in the path (`/trip/<slug>/`):** breaks links when a post is re-typed.
- **Date in the path (`/2026/10/<slug>/`):** longer, and leaks nothing useful; dates are in frontmatter.
- **No trailing slash:** GitHub Pages redirects directory URLs anyway; one canonical form avoids duplicates.
