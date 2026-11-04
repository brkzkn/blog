// @ts-nocheck: dense prototype code ported 1:1 for behaviour parity.
// Language switching: walks text nodes, attributes, <title> and meta description; shows the original-language banner
// (driven by data-original-lang on <main>). localStorage key: burak-language. English originals are remembered per node.
import { translations } from './i18n/tr';
import { translatePattern } from './i18n/patterns';
import { prefs, keyLang } from './prefs';
import { syncButtons } from './theme';

const records=new WeakMap(),attrRecords=new WeakMap();let titleRecord={en:null,last:null},metaRecord=null;
function translate(value){const t=value.trim();if(translations[t])return value.replace(t,translations[t]);const pattern=translatePattern(t);if(pattern)return value.replace(t,pattern);if(/^\d+ entr(?:y|ies)( matching your search)?$/.test(t))return value.replace(t,t.match(/^\d+/)[0]+(t.includes('matching')?' eşleşen içerik':' içerik'));if(t==='Sample preview · Full entry coming later')return 'Örnek önizleme · Tam içerik yakında';if(t.startsWith('← Back to '))return '← '+(translations[t.slice(10)]||t.slice(10))+' sayfasına dön';return value}
export function applyLanguage(){const lang=prefs.lang;document.documentElement.lang=lang;const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(!n.textContent.trim()||n.parentElement.closest('script,style,[data-original-note],.site-preferences'))continue;let rec=records.get(n);if(!rec||n.textContent!==rec.last)rec={en:n.textContent,last:n.textContent};const output=lang==='tr'?translate(rec.en):rec.en;if(n.textContent!==output)n.textContent=output;rec.last=output;records.set(n,rec)}
 // Original-language banner: driven by data-original-lang ("en" | "tr") on <main> or <body>. Shown only when the UI language differs from the content language; without the attribute it shows a neutral line in Turkish UI only.
 const originalLang=(document.querySelector('main[data-original-lang],body[data-original-lang]')?.dataset.originalLang||'').toLowerCase();
 const bannerMessages={'en>tr':'Arayüz Türkçe. Bu içeriğin özgün dili İngilizcedir; metin özgün dilinde korunmuştur.','tr>en':'The interface is in English. This content was written in Turkish and is kept in its original language.','>tr':'Arayüz Türkçe. İçerik özgün diliyle gösterilir.'};
 document.querySelectorAll('[data-original-note]').forEach(note=>{const message=bannerMessages[`${originalLang}>${lang}`]||'';note.hidden=!message;if(note.textContent!==message)note.textContent=message});
 // Attributes: title, aria-label, alt, placeholder. The English original is remembered per element and restored when switching back.
 const attrNames=['title','aria-label','alt','placeholder'];
 document.querySelectorAll('[title],[aria-label],[alt],[placeholder]').forEach(el=>{if(el.closest('.site-preferences,[data-search]')||el.matches('[data-search]'))return;let rec=attrRecords.get(el);if(!rec){rec={};attrRecords.set(el,rec)}attrNames.forEach(name=>{if(!el.hasAttribute(name))return;const now=el.getAttribute(name);let r=rec[name];if(!r||now!==r.last)r=rec[name]={en:now,last:now};const out=lang==='tr'?translate(r.en):r.en;if(now!==out)el.setAttribute(name,out);r.last=out})});
 if(titleRecord.en===null||document.title!==titleRecord.last)titleRecord={en:document.title,last:document.title};
 {const out=lang==='tr'?translate(titleRecord.en):titleRecord.en;if(document.title!==out)document.title=out;titleRecord.last=out}
 const metaDesc=document.querySelector('meta[name=description]');if(metaDesc){if(!metaRecord||metaDesc.content!==metaRecord.last)metaRecord={en:metaDesc.content,last:metaDesc.content};const out=lang==='tr'?translate(metaRecord.en):metaRecord.en;if(metaDesc.content!==out)metaDesc.content=out;metaRecord.last=out}
 syncButtons();document.querySelectorAll('[data-search]').forEach(x=>{const journal=x.dataset.searchScope==='journal';x.placeholder=journal?(lang==='tr'?'Not, gezi veya projelerde ara…':'Search notes, trips, projects…'):(lang==='tr'?'Yazılarda ara…':'Search writing…');x.setAttribute('aria-label',journal?(lang==='tr'?'Günlükte ara':'Search the journal'):(lang==='tr'?'Yazılarda ara':'Search writing previews'))});
}
export function initLanguage() {
  const languageButton = document.querySelector('#language-toggle');
  if (languageButton) languageButton.addEventListener('click', () => {
    prefs.lang = prefs.lang === 'tr' ? 'en' : 'tr';
    try { localStorage.setItem(keyLang, prefs.lang); } catch {}
    applyLanguage();
  });
}
