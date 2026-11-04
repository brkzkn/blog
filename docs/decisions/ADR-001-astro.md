# ADR-001: Build the site with Astro (static output)

Date: 2026-11-04 · Status: accepted

## Context
The prototype is 13 hand-written HTML pages sharing one stylesheet and one script. Posts are rendered client-side from `feed-data.js`. That cannot serve real content: no per-post URLs, no RSS, no sitemap, and every page repeats the header and footer. The site must publish a short note in under a minute (Markdown in git), be fast and crawlable, and keep pixel parity with the prototype.

## Decision
Use **Astro** with `output: 'static'`, `trailingSlash: 'always'`, `build.format: 'directory'`, `site: https://burakozkan.net`, and `@astrojs/sitemap`. Content is Markdown in content collections validated by Zod. Pages are `.astro` components that reuse the prototype markup, classes and `site.css` unchanged. No UI framework; client JS is the existing vanilla script, loaded through one entry (`src/scripts/main.ts`).

## Consequences
- Zero JS is shipped except what we write; the prototype's markup ports one to one.
- Content collections give typed frontmatter, colocated image optimisation and build-time errors for bad posts.
- RSS, sitemap and per-post pages come from the build, not from hand editing.
- Adds a Node toolchain and a build step; publishing goes through CI instead of copying files.
- Reversible at moderate cost: content is plain Markdown, so a framework change would not touch posts.

## Alternatives considered
- **Keep hand-written HTML:** no content pipeline, no RSS, duplication on every page.
- **Eleventy / Hugo:** good static generators, but weaker typed content and image handling for this shape of site; Hugo templates are less familiar to the owner.
- **Next.js / SvelteKit:** a runtime framework for a site that needs none.
- **WordPress again:** the previous blog went silent because of publishing friction.
