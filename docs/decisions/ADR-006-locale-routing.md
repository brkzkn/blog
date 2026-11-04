# ADR-006: Locale routing, language fallback and analytics

Date: 2026-11-04 · Status: accepted

## Context
The EN/TR toggle was client-side only: one URL per page, text swapped by a dictionary after load. Crawlers and LinkedIn previews saw English only, a shared link could not point to Turkish, and the language could not be bookmarked. The site is static on GitHub Pages (no server redirects or middleware). Most page copy is still English; Turkish content is produced at publish time (CLAUDE.md).

## Decision
**Language is the URL.** English at `/...`, Turkish at `/tr/...`. Astro's built-in i18n (`defaultLocale: en`, `prefixDefaultLocale: false`) with `fallback: { tr: 'en' }` and `fallbackType: 'rewrite'` generates every `/tr/` route at build time, including dynamic ones. Existing English URLs are unchanged (`/work/`, `/writing/`, ...; ADR-002 stays the source of route names).

**Real translation vs fallback.** A `/tr/` page is *real* only if it has its own page under `src/pages/tr/` and its English path is listed in `src/i18n/translated.ts`. Otherwise it is a fallback: Turkish interface (server-rendered header, footer, title; the dictionary covers the rest in the browser), English body, `noindex,follow`, canonical = the English page, no hreflang, not in the sitemap. Real pairs get `html lang`, self canonical, `hreflang` en/tr/x-default, `og:locale` and sitemap alternates.

**Links.** `Base.astro` renders the page body and rewrites root-relative `href`s to `/tr/...` for Turkish pages (files and assets excluded), so pages and components stay locale-agnostic.

**Preference.** The toggle stores the choice in `localStorage` (`burak-language`) and opens the same page in the other language. Opening a URL never changes the stored choice and nothing redirects by browser language. Theme: system by default, icon toggle, stored in `burak-theme`; choosing the theme the system already uses returns to `system`.

**Analytics.** Cloudflare Web Analytics, manual beacon (DNS is "DNS only", so no automatic injection), in `Analytics.astro` through the shared layout, token in `src/config/site.ts` (env `PUBLIC_CF_ANALYTICS_TOKEN` overrides). No token, no script. Only this beacon is allowed (CLAUDE.md). `/privacy/` (EN + TR, the first real translated page) describes it and appears in the footer.

## Consequences
- Turkish pages are shareable, bookmarkable and indexable once translated; untranslated ones cannot cause duplicate-content problems.
- Translating a page means adding the page under `src/pages/tr/` (or a locale-aware content route), then one line in `translated.ts`.
- The full static build is about twice as many pages (every route twice).
- `/tr/` fallbacks show English body text with `lang="tr"` on `<html>`; the existing original-language banner (`data-original-note`) explains this to readers.
- RSS stays a single English feed (`/rss.xml`) until Turkish content exists.

## Alternatives considered
- **Client-side toggle only (previous state):** nothing for crawlers or shared links.
- **Redirect by `Accept-Language` or stored preference:** impossible on GitHub Pages without JS, and surprising when someone opens an explicit URL.
- **Only generate `/tr/` for translated pages:** the toggle would have no target on most pages.
- **Google Analytics / GoatCounter:** cookie banner and a heavier script (GA); a second vendor (GoatCounter). Cloudflare already hosts the DNS.
