// Life page category filter. Island for pages/life/index.astro; behaviour matches the prototype's shared filter
// (hidden entries, aria-pressed, live summary, empty state) but binds to data-life-* so it never doubles up with
// the home-feed filters in filters.ts.
export {}; // module scope

const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-life-filter]')];
const items = [...document.querySelectorAll<HTMLElement>('[data-life-category]')];

if (buttons.length && items.length) {
  let selected = 'all';
  const summary = document.createElement('p');
  summary.className = 'filter-summary';
  summary.setAttribute('aria-live', 'polite');
  document.querySelector('.filters')?.after(summary);

  const empty = document.createElement('div');
  empty.className = 'journal-empty';
  empty.hidden = true;
  empty.innerHTML =
    '<h3 class="h4">No entries found.</h3><p class="small">Try a different search or clear the filters.</p><button type="button" data-empty-reset>Show all entries →</button>';
  items.at(-1)!.after(empty);

  const apply = () => {
    let count = 0;
    for (const item of items) {
      const show = selected === 'all' || item.dataset.lifeCategory === selected;
      item.hidden = !show;
      if (show) count++;
    }
    summary.textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
    empty.hidden = count !== 0;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.lifeFilter === selected));
  };
  for (const b of buttons)
    b.addEventListener('click', () => {
      selected = b.dataset.lifeFilter ?? 'all';
      apply();
    });
  empty.querySelector('[data-empty-reset]')?.addEventListener('click', () => {
    selected = 'all';
    apply();
  });
  apply();
}
