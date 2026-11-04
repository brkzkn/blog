// Single client entry, imported by Base.astro. Same behaviour and order as the prototype site.js, split into modules.
import { initMenu } from './menu';
import { initFilters, initCopyLink } from './filters';
import { initLightbox } from './lightbox';
import { bindUnavailableClicks, initUnavailable } from './unavailable';
import { initTheme, applyTheme } from './theme';
import { initLanguage, applyLanguage } from './i18n';

initMenu();
initFilters();
initCopyLink();
initLightbox();
bindUnavailableClicks();
initTheme();
initLanguage();
applyTheme();
initUnavailable();
applyLanguage();
let queued = false;
new MutationObserver(() => {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    initUnavailable();
    applyLanguage();
  });
}).observe(document.body, { childList: true, characterData: true, subtree: true });
