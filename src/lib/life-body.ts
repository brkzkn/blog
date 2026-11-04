// Tiny structured-Markdown reader for the Life detail pages (trip, restaurant, monthly diary).
// The schema has no fields for day-by-day rows, dishes or diary lists, so those live in the post body under fixed
// `##` headings. Conventions are documented in a comment at the top of each sample post. Everything is plain text;
// `inline()` escapes it and understands two things: [text](/route/) links and {d:yyyy-mm-dd} / {D:yyyy-mm-dd} dates.

export interface Block {
  title: string;
  fields: Record<string, string>; // "@key value" lines
  before: string[]; // paragraphs before the first list
  after: string[]; // paragraphs after the list
  list: string[]; // "- " rows
}
export interface Body {
  lede: string;
  sections: Map<string, Block & { subs: Block[] }>;
}

const blank = (title = ''): Block => ({ title, fields: {}, before: [], after: [], list: [] });

export function parseBody(raw: string): Body {
  const text = raw.replace(/<!--[\s\S]*?-->/g, '');
  const intro = blank();
  const sections: Body['sections'] = new Map();
  let section: (Block & { subs: Block[] }) | null = null;
  let target: Block = intro;
  let para: string[] = [];
  const flush = () => {
    if (!para.length) return;
    (target.list.length ? target.after : target.before).push(para.join(' '));
    para = [];
  };
  for (const line of text.split(/\r?\n/)) {
    const h2 = line.match(/^## (.+?)\s*$/);
    const h3 = line.match(/^### (.+?)\s*$/);
    if (h2) {
      flush();
      section = { ...blank(h2[1]), subs: [] };
      sections.set(h2[1], section);
      target = section;
    } else if (h3 && section) {
      flush();
      const sub = blank(h3[1]);
      section.subs.push(sub);
      target = sub;
    } else if (!line.trim()) flush();
    else if (/^- /.test(line)) {
      flush();
      target.list.push(line.slice(2).trim());
    } else if (/^@[a-z]+ /.test(line)) {
      flush();
      const m = line.match(/^@([a-z]+) (.*)$/)!;
      target.fields[m[1]] = m[2].trim();
    } else para.push(line.trim());
  }
  flush();
  return { lede: intro.before[0] ?? '', sections };
}

/** "a | b | c" row -> trimmed cells; the last cell keeps any further pipes. */
export const cells = (row: string, n: number): string[] => {
  const parts = row.split('|').map((s) => s.trim());
  return parts.length <= n ? parts : [...parts.slice(0, n - 1), parts.slice(n - 1).join(' | ')];
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: m - 1, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
};
export const longDate = (iso: string) => { const p = parts(iso); return `${p.d} ${MONTHS[p.m]}`; }; // 19 October
export const shortDate = (iso: string) => { const p = parts(iso); return `${p.d} ${MONTHS[p.m].slice(0, 3)}`; }; // 4 Oct
export const weekdayDate = (iso: string) => { const p = parts(iso); return `${WEEKDAYS[p.wd]} ${p.d} ${MONTHS[p.m]}`; }; // Friday 14 March
export const fullDate = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; // 30 October 2026
export const monthYear = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; // October 2026
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);
export const isoMonth = (d: Date) => d.toISOString().slice(0, 7);
export const monthName = (d: Date) => MONTHS[d.getUTCMonth()];

export function inline(s: string): string {
  return esc(s)
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a class="tag" href="$2">$1</a>')
    .replace(/\{d:(\d{4}-\d{2}-\d{2})\}/g, (_, iso) => `<time datetime="${iso}">${shortDate(iso)}</time>`)
    .replace(/\{D:(\d{4}-\d{2}-\d{2})\}/g, (_, iso) => `<time datetime="${iso}">${longDate(iso)}</time>`);
}
/** Plain text with the same tokens resolved, for attributes and meta. */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\(\/[^)\s]*\)/g, '$1');

export const langName = (l: string) => (l === 'tr' ? 'Turkish' : 'English');
