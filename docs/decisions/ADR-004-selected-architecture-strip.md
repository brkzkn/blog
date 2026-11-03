# ADR-004: Home "selected architecture" strip shows as many case studies as exist, up to three

Date: 2026-11-03 · Status: accepted

## Context
The home page needs a compact professional door under the hero, next to the personal feed. In the prototype the strip went from one bar to three cards. Two of the three pointed at case studies that do not exist yet, so two titles linked to the wrong article. A fixed count forces either placeholders or a half-empty strip.

## Decision
The strip lists case studies from the `work` collection and shows **as many as are published, capped at three**.

- **Source:** entries with `featured: true` and `draft: false`. Order by `featuredOrder` ascending, then `date` descending. If more than three are featured, the first three render and the build prints a warning (it does not fail).
- **Count:** `min(featured, 3)`. The component passes it as `data-count` and CSS picks the layout; no client JS.
  - 0: the strip is not rendered. The hero link "Architecture work" stays.
  - 1: one full-width card.
  - 2: two columns, 1.3fr / 1fr.
  - 3: three columns, 1.45fr / 1fr / 1fr.
  - 640px and below: one column in every case.
- **Lead card:** the first item is the lead: accent top line, larger title. The others are quiet.
- **Card content:** kicker (sector, years) and title only. No summary and no tags; both stay on the case study page and on `/work/`.
- **Real pages only:** every card links to its own published case study. No placeholder cards, no "coming later" entries, no shared fallback link.
- **Footer link:** "All case studies" goes to `/work/` whenever the strip renders.

The prototype (`prototype/index.html`) shows two cards as a sample. The second one links to `architecture-notes.html` as a stand-in, marked by an HTML comment, and the "Illustrative case study" chip is prototype-only.

## Consequences
- Publishing a case study and featuring it is a frontmatter change (`featured`, `featuredOrder`); no template edit.
- The cap keeps the strip about 160px tall on desktop, so the journal starts early on the page.
- With one real case study the strip is sparse but honest. That is accepted.
- To feature a fourth study, one of the three has to leave the strip.
- Reversible: changing the cap or the layouts touches one component and one CSS block.

## Alternatives considered
- **Always three, with placeholders:** fills the layout but links people to the wrong article.
- **Fixed two:** simple, but it either wastes space or hides a real third study.
- **Carousel:** hides content, and non-interactive cards are unreachable by keyboard.
- **Summary and tags on each card:** more informative, but it grew the strip to about 300px.
