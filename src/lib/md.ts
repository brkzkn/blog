// Tiny Markdown subset for the short text fields of the work collection (frontmatter strings are not
// processed by Astro's Markdown pipeline): paragraphs, "- " lists, **bold**, *italic*, `code`, [text](url).
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function inline(src: string): string {
  return esc(src)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}

export const blocks = (src: string): string[] =>
  src.trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

export const isList = (block: string) => block.split('\n').every((l) => /^\s*[-*]\s+/.test(l));
export const listItems = (block: string) => block.split('\n').map((l) => l.replace(/^\s*[-*]\s+/, '').trim());

/** Renders a Markdown string. Attributes for the elements can be given per tag, e.g. { p: ' class="small"' }. */
export function md(src: string, attrs: { p?: string; ul?: string } = {}): string {
  return blocks(src)
    .map((b) =>
      isList(b)
        ? `<ul${attrs.ul ?? ''}>${listItems(b).map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`
        : `<p${attrs.p ?? ''}>${inline(b.replace(/\n/g, ' '))}</p>`,
    )
    .join('\n');
}

/** First sentence of a text (up to the first full stop followed by a space), or the whole text. */
export const firstSentence = (s: string) => s.match(/^.*?[.!?](?=\s|$)/s)?.[0] ?? s;
