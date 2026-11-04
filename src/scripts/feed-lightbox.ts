// Photo lightbox for .fe-photo buttons (prototype: mountLightbox in feed-render.js). One <dialog>; the photos of an album
// come from the data-photos JSON on its .fe-album group. UI strings are English; the TR table below covers attributes
// (the text walker in i18n.ts cannot reach aria-labels it creates itself).
const aria: Record<string, string> = { Close: 'Kapat', 'Previous photo': 'Önceki fotoğraf', 'Next photo': 'Sonraki fotoğraf', 'Photo viewer': 'Fotoğraf görüntüleyici', 'Filter by category': 'Kategoriye göre filtrele' };
export const isTr = () => document.documentElement.lang === 'tr';
export const A = (text: string) => (isTr() && aria[text]) || text;
const photoLabel = (i: number, n: number, alt: string) => (isTr() ? `${i} / ${n}. fotoğrafı büyüt: ${alt}` : `Open photo ${i} of ${n}: ${alt}`);
const setText = (node: Element, v: string | number) => { if (node.textContent !== String(v)) node.textContent = String(v); };
type Photo = { src: string; alt: string; w: number; h: number };

export function mountLightbox(scope: Element) {
  const albumOf = (btn: Element): Photo[] => JSON.parse(btn.closest('.fe-album')?.getAttribute('data-photos') ?? '[]');
  const dialog = document.createElement('dialog');
  dialog.className = 'feed-lightbox';
  dialog.innerHTML = `<figure><img alt=""><figcaption><span data-lb-caption></span><span class="tiny"><span data-lb-count></span> · <span>Illustrative image</span></span></figcaption></figure><div class="feed-lightbox-bar"><button type="button" data-lb="prev"><span aria-hidden="true">‹</span> <span>Previous</span></button><button type="button" data-lb="next"><span>Next</span> <span aria-hidden="true">›</span></button><button type="button" data-lb="close"><span>Close</span> <span aria-hidden="true">×</span></button></div>`;
  document.body.append(dialog);
  const lbImg = dialog.querySelector('img')!, lbCaption = dialog.querySelector('[data-lb-caption]')!, lbCount = dialog.querySelector('[data-lb-count]')!;
  let album: Photo[] = [], index = 0, opener: HTMLElement | null = null;
  const show = (i: number) => {
    index = (i + album.length) % album.length;
    const p = album[index];
    lbImg.src = p.src; lbImg.alt = p.alt; lbImg.width = p.w; lbImg.height = p.h;
    setText(lbCaption, p.alt); setText(lbCount, `${index + 1} / ${album.length}`);
  };
  const labels = () => {
    dialog.setAttribute('aria-label', A('Photo viewer'));
    dialog.querySelector('[data-lb=prev]')!.setAttribute('aria-label', A('Previous photo'));
    dialog.querySelector('[data-lb=next]')!.setAttribute('aria-label', A('Next photo'));
    dialog.querySelector('[data-lb=close]')!.setAttribute('aria-label', A('Close'));
  };
  scope.addEventListener('click', (ev) => {
    const b = (ev.target as Element).closest<HTMLElement>('.fe-photo');
    if (!b) return;
    opener = b; album = albumOf(b);
    const single = album.length < 2;
    dialog.querySelectorAll<HTMLElement>('[data-lb=prev],[data-lb=next]').forEach((x) => (x.hidden = single));
    labels(); show(+(b.dataset.index ?? 0)); dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-lb=close]')!.focus();
  });
  dialog.addEventListener('click', (ev) => {
    const a = (ev.target as Element).closest<HTMLElement>('[data-lb]')?.dataset.lb;
    if (a === 'prev') show(index - 1); else if (a === 'next') show(index + 1); else if (a === 'close' || ev.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (ev) => {
    if (album.length < 2) return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); show(index - 1); } else if (ev.key === 'ArrowRight') { ev.preventDefault(); show(index + 1); }
  });
  dialog.addEventListener('close', () => { lbImg.removeAttribute('src'); opener?.focus(); opener = null; });
  // photo and dialog aria strings follow the page language
  const refresh = () => {
    scope.querySelectorAll<HTMLElement>('.fe-photo').forEach((b) => {
      const photos = albumOf(b), i = +(b.dataset.index ?? 0);
      b.setAttribute('aria-label', photoLabel(i + 1, photos.length, photos[i].alt));
    });
    if (dialog.open) labels();
  };
  new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  refresh();
}
