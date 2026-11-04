// .unavailable contract: a muted, non-interactive stand-in for a target that does not exist yet. Works on <a>, <span>, buttons, cards, pills, panels.
// Strips href/title, sets aria-disabled + tabindex=-1 and appends a visible "soon" label (translated). Opt out of the label with data-no-label. Idempotent.
export function initUnavailable(): void {
  document.querySelectorAll<HTMLElement>('.unavailable:not([data-unavail])').forEach((el) => {
    el.dataset.unavail = '1';
    el.setAttribute('aria-disabled', 'true');
    el.tabIndex = -1;
    el.removeAttribute('href');
    el.removeAttribute('title');
    if (el.tagName === 'BUTTON') (el as HTMLButtonElement).disabled = true;
    if (el.hasAttribute('data-no-label') || el.parentElement?.closest('.unavailable') || el.querySelector(':scope>.unavail-label')) return;
    const label = document.createElement('span');
    label.className = 'unavail-label';
    label.textContent = 'soon';
    el.append(label);
  });
}

export function bindUnavailableClicks(): void {
  document.addEventListener('click', (event) => {
    if ((event.target as Element | null)?.closest?.('.unavailable')) event.preventDefault();
  }, true);
}
