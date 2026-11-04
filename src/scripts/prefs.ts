// Shared UI preference state (theme + language). Initial values come from the inline boot script in Base.astro (window.__burakPrefs).
// localStorage keys: burak-theme, burak-language.
export type Theme = 'system' | 'light' | 'dark';
export type Lang = 'en' | 'tr';

declare global {
  interface Window {
    __burakPrefs: { theme: string; lang: string };
  }
}

export const keyTheme = 'burak-theme';
export const keyLang = 'burak-language';

const boot = window.__burakPrefs;
export const prefs: { theme: Theme; lang: Lang } = {
  theme: (['system', 'light', 'dark'].includes(boot.theme) ? boot.theme : 'system') as Theme,
  lang: (['en', 'tr'].includes(boot.lang) ? boot.lang : 'en') as Lang,
};
