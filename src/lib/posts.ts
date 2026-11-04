// Helpers for the posts collection. Ids are `<slug>.<fileLang>`; see src/content.config.ts.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const postSlug = (p: Post) => p.id.replace(/\.(en|tr)$/, '');
export const postFileLang = (p: Post): 'en' | 'tr' => (p.id.endsWith('.tr') ? 'tr' : 'en');
export const postUrl = (p: Post) => `/notes/${postSlug(p)}/`;

/** Published posts, one per slug (the `en` file wins when siblings exist), newest first. Drafts are hidden in production. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', (p) => import.meta.env.DEV || !p.data.draft);
  const bySlug = new Map<string, Post>();
  for (const p of all) {
    const prev = bySlug.get(postSlug(p));
    if (!prev || postFileLang(p) === 'en') bySlug.set(postSlug(p), p);
  }
  return [...bySlug.values()].sort((a, b) => +b.data.date - +a.data.date);
}
