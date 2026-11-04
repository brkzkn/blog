// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { translatedPaths } from './src/i18n/translated.ts';

// A /tr/ URL is listed in the sitemap only when it has a real Turkish page; the rest are noindex fallbacks (ADR-006).
const isTr = (/** @type {string} */ page) => new URL(page).pathname.startsWith('/tr/');
const trPath = (/** @type {string} */ page) => new URL(page).pathname.slice(3);

// https://astro.build/config
export default defineConfig({
  site: 'https://burakozkan.net',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // English at the root, Turkish under /tr/. Every route also exists under /tr/ through the rewrite fallback
  // (Turkish interface, English content until a Turkish page exists). Static output only: no middleware or redirects.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    fallback: { tr: 'en' },
    routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
  },
  integrations: [
    // /dev/* is development only and never ships; keep it out of the sitemap regardless.
    sitemap({
      filter: (page) => !page.includes('/dev/') && !page.endsWith('/404/') && (!isTr(page) || translatedPaths.includes(trPath(page))),
      i18n: { defaultLocale: 'en', locales: { en: 'en', tr: 'tr' } },
    }),
  ],
});
