// Home feed island (prototype: feed.js). The entries, filter pills, topic list and month list are rendered at build
// time (src/pages/index.astro); this script only filters, searches, counts and mounts the photo lightbox.
// UI strings are English; i18n.ts translates them by exact text / pattern match.
import { mountLightbox, A } from './feed-lightbox';
import { translations } from './i18n/tr';
import { applyLanguage } from './i18n';

// Strings this island adds to the UI; the shared dictionary is extended here so no other group's file changes.
Object.assign(translations, {
  'Open note': 'Notu aç', 'Newer:': 'Daha yeni:', 'Older:': 'Daha eski:', 'Photo viewer': 'Fotoğraf görüntüleyici',
});

const normalize = (text: string) => text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
const setText = (node: Element, v: string | number) => { if (node.textContent !== String(v)) node.textContent = String(v); };

function init() {
  const root = document.querySelector<HTMLElement>('[data-feed]');
  if (!root) return;
  const nodes = [...root.querySelectorAll<HTMLElement>('[data-feed-entry]')];
  const entries = nodes.map((n) => ({ n, category: n.dataset.feedCat ?? '', month: n.dataset.monthKey ?? '', hay: normalize(n.dataset.search ?? '') }));
  const total = entries.length;
  const state = { category: 'all', month: 'all', query: '' };
  const summary = root.querySelector('[data-feed-summary]')!, empty = root.querySelector<HTMLElement>('[data-feed-empty]')!;
  const searchInputs = [...document.querySelectorAll<HTMLInputElement>('[data-feed-search]')];
  type E = (typeof entries)[number];
  const ok = (e: E, except?: string) =>
    (except === 'category' || state.category === 'all' || e.category === state.category) &&
    (except === 'month' || state.month === 'all' || e.month === state.month) &&
    (except === 'query' || !state.query || e.hay.includes(state.query));

  function apply() {
    let shown = 0, first: HTMLElement | null = null, last: HTMLElement | null = null;
    entries.forEach((e) => {
      const show = ok(e);
      e.n.hidden = !show; e.n.classList.remove('is-first', 'is-last');
      if (show) { shown++; first = first || e.n; last = e.n; }
    });
    (first as HTMLElement | null)?.classList.add('is-first'); (last as HTMLElement | null)?.classList.add('is-last');
    const active = state.category !== 'all' || state.month !== 'all' || !!state.query;
    // the count only appears once a filter is on; an unfiltered feed needs no "showing 14 of 14"
    setText(summary, !active ? '' : shown ? `Showing ${shown} of ${total} entries` : 'No entries match');
    empty.hidden = shown !== 0;
    document.querySelectorAll<HTMLElement>('[data-feed-category]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.feedCategory === state.category)));
    document.querySelectorAll<HTMLElement>('[data-feed-month]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.feedMonth === state.month)));
    document.querySelectorAll<HTMLElement>('[data-count-category]').forEach((n) => setText(n, entries.filter((e) => (n.dataset.countCategory === 'all' || e.category === n.dataset.countCategory) && ok(e, 'category')).length));
    document.querySelectorAll<HTMLElement>('[data-count-month]').forEach((n) => setText(n, entries.filter((e) => (n.dataset.countMonth === 'all' || e.month === n.dataset.countMonth) && ok(e, 'month')).length));
    document.querySelectorAll<HTMLButtonElement>('[data-feed-reset]').forEach((b) => { b.disabled = !active; });
  }
  function reset() {
    state.category = 'all'; state.month = 'all'; state.query = ''; searchInputs.forEach((i) => (i.value = '')); apply();
    const f = document.activeElement as HTMLElement | null;
    if (!f || f === document.body || (f as HTMLButtonElement).disabled || f.closest('[hidden]')) root!.querySelector<HTMLElement>('[data-feed-filters] button')?.focus();
  }
  document.addEventListener('click', (ev) => {
    const t = ev.target as Element;
    const c = t.closest<HTMLElement>('[data-feed-category]'), m = t.closest<HTMLElement>('[data-feed-month]'), r = t.closest<HTMLButtonElement>('[data-feed-reset]');
    if (c) { state.category = c.dataset.feedCategory!; apply(); } else if (m) { state.month = m.dataset.feedMonth!; apply(); } else if (r && !r.disabled) reset();
  });
  // long feeds: one tap from the last entry back to the filters (focus follows, so keyboard users land on the first pill)
  const toolbar = root.querySelector('.feed-toolbar')!;
  root.querySelector('[data-feed-top]')?.addEventListener('click', () => {
    toolbar.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    toolbar.querySelector<HTMLElement>('[data-feed-filters] button')?.focus({ preventScroll: true });
  });
  searchInputs.forEach((input) => input.addEventListener('input', () => {
    state.query = normalize(input.value.trim());
    searchInputs.forEach((o) => { if (o !== input) o.value = input.value; });
    apply();
  }));

  mountLightbox(root.querySelector('.fe-entry')?.parentElement ?? root);
  const filtersLabel = () => root.querySelector('[data-feed-filters]')?.setAttribute('aria-label', A('Filter by category'));
  new MutationObserver(filtersLabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  filtersLabel(); apply(); applyLanguage();
}
init();
