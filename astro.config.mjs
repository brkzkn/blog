// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://burakozkan.net',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    // /dev/* is development only and never ships; keep it out of the sitemap regardless.
    sitemap({ filter: (page) => !page.includes('/dev/') && !page.endsWith('/404/') }),
  ],
});
