# Design system

Editorial, calm, personal. Inspired by independent magazines and architecture portfolios, not SaaS.

## Tokens (`prototype/assets/site.css`, `:root`)

| Token | Light | Role |
|---|---|---|
| `--bg` | `#F7F4EF` | page ground, warm off-white |
| `--surface` | `#FDFCFA` | cards, inputs |
| `--ink` | `#1E2430` | text, deep navy-charcoal |
| `--ink2` / `--ink3` | `#525A68` / `#6F7683` | secondary / tertiary text |
| `--line` / `--line2` | `#E4DED4` / `#D5CEC2` | hairlines / chip borders |
| `--blue` / `--blue-ink` / `--blue-tint` | `#3B6B9A` / `#2C5479` / `#E6EEF5` | primary accent, links, active states |
| `--orange` / `--orange-tint` | `#C4561F` / `#F6E7DC` | warm accent: active nav mark, ratings, one highlight per page |

Dark theme overrides the same variables under `[data-theme="dark"]`. Images are not re-tinted.

## Type

- `Newsreader` serif, weights 400/500 + italic: `.display` 84px, `.h1` 64px, `.h2` 44px, `.h3` 30px, `.h4` 23px, `.lede` 24px. Notes in the feed use the serif at 22px: the journal voice.
- `IBM Plex Sans` 400/500/600: body 17px/1.55, `.small` 14px, `.tiny` 13px, kickers 10–11px uppercase with letter-spacing (sidebar and section eyebrows only).
- `IBM Plex Mono` only in `pre`.

## Layout

- `.wrap` max 1240px, 40px gutters (20px under 640px). `.grid` is 12 columns, 32px gap; `.spanN` classes 2–12.
- Breakpoints: 1000px (nav collapses to menu button, grids go 2-col, spans go full) and 640px (single column).
- Asymmetry is intentional: hero text 7 cols + image composition 5 cols; feed 8 cols + sidebar 4 cols.

## Components

- `.nav` one row, six/seven items, active item has a 2px orange underline. Right side: EN/TR toggle, theme toggle, menu button on mobile.
- Feed item: date column (serif date, year, type label) with a small diamond marker, then content. Type decides size: Trip gets a 2:1 cover, Note gets up to three 1:1 photos, Gear gets a 110px thumbnail card, Writing gets title + excerpt only.
- Sidebar module: `.sidebar-module` with `.sidebar-kicker`; hairline separators, no boxes. Order on home: Stay in touch, Elsewhere, Now, Search, Browse by topic, Archive, Take a different path.
- Chips: `.filters > *` pill, active is inverted (ink on ground). `.tag` small outlined pill; `.tag.fill` blue tint, `.tag.warm` orange tint.
- `.panel` bordered card for Work decision/trade-off blocks; `.box` + `.conn/.vconn` for system maps built from HTML elements (no SVG diagrams).
- `.ph` placeholder: hatched tinted block with caption; ratio classes `.r169 .r43 .r11 .r34 .r21 .r32`.
- Ratings: `.stars` five 10px dots in orange, `.off` for empty.

## Do / don't

Do: generous whitespace, one bold accent per page, concrete captions, sentence case.
Don't: shadows, gradients, glassmorphism, equal visual weight for every section, nine-item nav, stock photos of people coding, ALL-CAPS labels outside kickers.
