// Locale helpers shared by layouts, components and astro.config. Static-only: no middleware, no redirects.
import { translatedPaths } from './translated';
import { comingSoon } from '../config/site';

export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// While the site is in coming-soon mode the home page is a real two-language page, so it is treated as translated.
export const isTranslated = (enPath: string) => translatedPaths.includes(enPath) || (comingSoon && enPath === '/');

/** '/tr/work/' -> '/work/'; '/work/' -> '/work/'. */
export function stripLocale(path: string): string {
  if (path === '/tr' || path === '/tr/') return '/';
  return path.startsWith('/tr/') ? path.slice(3) : path;
}

/** Path for a locale. Input may be either locale's path. */
export function localizePath(path: string, locale: Locale): string {
  const p = stripLocale(path);
  return locale === 'tr' ? `/tr${p}` : p;
}

// Internal hrefs that must NOT get the /tr prefix: files (rss.xml, pdf), built assets.
const isFileLike = (pathOnly: string) => /^\/(assets|_astro)\//.test(pathOnly) || /\.[a-z0-9]+$/i.test(pathOnly.split('/').pop() ?? '');

/**
 * Rewrites root-relative `href="/x/"` to `href="/tr/x/"` in rendered page HTML so a Turkish page links to Turkish pages.
 * One central pass in Base.astro replaces per-link locale handling in every page and component.
 */
export function localizeHtml(html: string, locale: Locale): string {
  if (locale === 'en') return html;
  return html.replace(/(\shref=)(["'])(\/(?!\/)[^"']*?)\2/g, (m, attr, q, url: string) => {
    const pathOnly = url.split(/[?#]/)[0];
    if (pathOnly === '/tr' || pathOnly.startsWith('/tr/') || isFileLike(pathOnly)) return m;
    return `${attr}${q}/tr${url}${q}`;
  });
}
