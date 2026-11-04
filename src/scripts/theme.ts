import { prefs, keyTheme } from './prefs';

const media = matchMedia('(prefers-color-scheme: dark)');
const themeButton = () => document.querySelector<HTMLElement>('#theme-toggle');
const languageButton = () => document.querySelector<HTMLElement>('#language-toggle');

// Keeps the aria-labels/titles of the theme and language buttons in step with the current theme and language.
export function syncButtons(): void {
  const { lang } = prefs;
  const dark = document.documentElement.dataset.theme === 'dark';
  const themeLabel = lang === 'tr' ? (dark ? 'Açık temaya geç' : 'Koyu temaya geç') : dark ? 'Switch to light mode' : 'Switch to dark mode';
  const languageLabel = lang === 'tr' ? 'Switch to English' : 'Türkçeye geç';
  const tb = themeButton();
  const lb = languageButton();
  if (tb) {
    tb.setAttribute('aria-label', themeLabel);
    tb.title = themeLabel;
    tb.setAttribute('aria-pressed', String(dark));
  }
  if (lb) {
    lb.setAttribute('aria-label', languageLabel);
    lb.title = languageLabel;
    const code = lb.querySelector('[data-language-code]');
    if (code && code.textContent !== lang.toUpperCase()) code.textContent = lang.toUpperCase();
  }
}

export function applyTheme(): void {
  document.documentElement.dataset.theme = prefs.theme === 'system' ? (media.matches ? 'dark' : 'light') : prefs.theme;
  syncButtons();
}

// Registers listeners only; main.ts calls applyTheme() afterwards, as the prototype did.
export function initTheme(): void {
  themeButton()?.addEventListener('click', () => {
    // Icon toggle between the two visible themes. Picking the theme the system already uses goes back to 'system'
    // (stored value removed), so Light / Dark / System are all reachable without a dropdown.
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    prefs.theme = next === (media.matches ? 'dark' : 'light') ? 'system' : next;
    try { prefs.theme === 'system' ? localStorage.removeItem(keyTheme) : localStorage.setItem(keyTheme, prefs.theme); } catch {}
    applyTheme();
  });
  media.addEventListener('change', () => { if (prefs.theme === 'system') applyTheme(); });
}
