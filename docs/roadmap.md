# Roadmap

## Phase 0 — prototype (done)
13-page static HTML prototype with design system, dark theme, EN/TR UI toggle, feed filters and search. See `prototype/`.

## Phase 1 — Astro skeleton
- `npm create astro@latest`, static output, `site: https://burakozkan.net`.
- Port `site.css` as a global stylesheet; split `site.js` into small islands (menu, filters, theme/lang).
- Layouts: `Base`, `Feed`, `Post`, `Work`, `Gear`.
- Content collections per `docs/content-model.md`, with Zod schemas.
- Rebuild home, note, writing, gear, about from the prototype markup. Keep pixel parity; the prototype is the design source of truth.
- GitHub Actions deploy to Pages; `CNAME` file; DNS per the owner's registrar (A records to GitHub Pages, www CNAME).
- Write ADR-001 (Astro), ADR-002 (URL scheme), ADR-003 (content storage).
- Home "selected architecture" strip: render from `work` entries per ADR-004 (0 to 3 cards, no placeholders).

## Phase 2 — real content
- Owner provides: ~5 real notes, 1 real case study, gear list, About photos.
- Replace mock images; keep the `.ph` placeholder only where no photo exists yet.
- RSS feeds, sitemap, OpenGraph images (typographic, generated at build).

## Phase 3 — publishing comfort
- Mobile posting path tested end to end (GitHub mobile or Obsidian).
- Translation script (owner writes TR, script drafts EN or vice versa; review before merge).
- Email digest wired to the RSS feed.
- WordPress archive import: keep original dates and slugs, redirect old URLs.

## Open issues from the prototype review
1. Subscribe form not connected.
2. Gear/Life filters visual only.
3. Placeholder images outside the home hero.
4. TR dictionary does not cover all page copy (by design; content translated at publish time).
5. Mobile menu is a dropdown; full-screen menu design exists in the original concept.
6. Gear and Life pages still show the "Design preview" banner; remove the banner at launch.
