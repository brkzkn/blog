// Mobile hamburger menu: toggle, close on Escape, outside click, link click and when the layout leaves the mobile breakpoint.
export function initMenu(): void {
  const toggle = document.querySelector<HTMLElement>('.menubtn');
  const menu = document.querySelector<HTMLElement>('#primary-menu');
  if (!toggle || !menu) return;
  const desktop = matchMedia('(min-width:1001px)');
  const setOpen = (open: boolean) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    if (menu.classList.contains('open') && !menu.contains(target) && !toggle.contains(target)) setOpen(false);
  });
  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
  desktop.addEventListener('change', (event) => { if (event.matches) setOpen(false); });
}
