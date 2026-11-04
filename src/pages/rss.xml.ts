import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../lib/posts';

// Sample posts are listed only while PUBLIC_PREVIEW !== 'false'; after launch the feed carries real posts only.
const preview = import.meta.env.PUBLIC_PREVIEW !== 'false';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((p) => !p.data.draft && (preview || !p.data.sample));
  return rss({
    title: 'Burak Özkan',
    description: 'Systems I design, things I build, a life worth remembering.',
    site: context.site!,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    items: posts.map((p) => ({
      title: p.data.title ?? p.data.name ?? p.data.destination ?? `Note, ${p.data.date.toISOString().slice(0, 10)}`,
      pubDate: p.data.date,
      link: postUrl(p),
      customData: `<dc:language>${p.data.lang}</dc:language>`,
    })),
  });
}
