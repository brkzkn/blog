// Home feed: renders window.FEED_ENTRIES onto the timeline (renderers live in feed-render.js), then wires filters, search, archive and the photo lightbox.
// UI strings are written in English; site.js translates them by exact text match (see its dictionary).
(()=>{
const root=document.querySelector('[data-feed]');const entries=window.FEED_ENTRIES,R=window.FeedRender;if(!root||!entries||!R)return;
const {categoryLabels,typeLabels,esc,normalize,setText,A,parts,dateText,fullDate,monthName,entryHtml}=R;

// ---- render ----
const sorted=[...entries].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
const stream=root.querySelector('[data-feed-list]');
const skip=new Set(['src','href','logHref','url','id']);
const collect=(v,out=[])=>{if(typeof v==='string')out.push(v);else if(Array.isArray(v))v.forEach(x=>collect(x,out));else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>skip.has(k)||collect(x,out));return out};
const haystack=new Map(sorted.map(e=>[e.id,normalize([...collect(e),categoryLabels[e.category],typeLabels[e.type],dateText(e),fullDate(e)].join(' '))]));
stream.innerHTML=sorted.map(e=>entryHtml(e)).join('');
const nodes=new Map([...stream.querySelectorAll('[data-feed-entry]')].map(n=>[n.dataset.feedEntry,n]));

// ---- controls built from the data ----
const catList=window.FEED_CATEGORIES,monthKeys=[...new Set(sorted.map(e=>parts(e).month))];
const btn=(attr,value,label)=>`<button type="button" ${attr}="${value}" aria-pressed="false"><span>${esc(label)}</span><span class="sidebar-count" data-count-${attr.replace('data-feed-','')}="${value}"></span></button>`;
document.querySelectorAll('[data-feed-topics]').forEach(n=>n.innerHTML=btn('data-feed-category','all','All entries')+catList.map(([k,l])=>btn('data-feed-category',k,l)).join(''));
document.querySelectorAll('[data-feed-months]').forEach(n=>n.innerHTML=btn('data-feed-month','all','All months')+monthKeys.map(k=>btn('data-feed-month',k,monthName(k))).join(''));
root.querySelector('[data-feed-filters]').innerHTML=['all',...catList.map(c=>c[0])].map(k=>`<button type="button" data-feed-category="${k}" aria-pressed="false">${esc(k==='all'?'All':categoryLabels[k])}</button>`).join('');

// ---- filtering ----
const state={category:'all',month:'all',query:''};
const summary=root.querySelector('[data-feed-summary]'),empty=root.querySelector('[data-feed-empty]');
const searchInputs=[...document.querySelectorAll('[data-feed-search]')];
const ok=(e,except)=>(except==='category'||state.category==='all'||e.category===state.category)&&(except==='month'||state.month==='all'||parts(e).month===state.month)&&(except==='query'||!state.query||haystack.get(e.id).includes(state.query));
function apply(){
 let shown=0,last=null,first=null;
 sorted.forEach(e=>{const n=nodes.get(e.id),show=ok(e);n.hidden=!show;n.classList.remove('is-first','is-last');if(show){shown++;first=first||n;last=n}});
 first?.classList.add('is-first');last?.classList.add('is-last');
 const active=state.category!=='all'||state.month!=='all'||!!state.query;
 // the count only appears once a filter is on; an unfiltered feed needs no "showing 14 of 14"
 setText(summary,!active?'':shown?`Showing ${shown} of ${sorted.length} entries`:'No entries match');empty.hidden=shown!==0;
 document.querySelectorAll('[data-feed-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feedCategory===state.category)));
 document.querySelectorAll('[data-feed-month]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feedMonth===state.month)));
 document.querySelectorAll('[data-count-category]').forEach(n=>setText(n,sorted.filter(e=>(n.dataset.countCategory==='all'||e.category===n.dataset.countCategory)&&ok(e,'category')).length));
 document.querySelectorAll('[data-count-month]').forEach(n=>setText(n,sorted.filter(e=>(n.dataset.countMonth==='all'||parts(e).month===n.dataset.countMonth)&&ok(e,'month')).length));
 document.querySelectorAll('[data-feed-reset]').forEach(b=>{b.disabled=!active});
}
function reset(){state.category='all';state.month='all';state.query='';searchInputs.forEach(i=>i.value='');apply();
 const f=document.activeElement;if(!f||f===document.body||f.disabled||f.closest('[hidden]'))root.querySelector('[data-feed-filters] button')?.focus()}
document.addEventListener('click',ev=>{
 const c=ev.target.closest('[data-feed-category]'),m=ev.target.closest('[data-feed-month]'),r=ev.target.closest('[data-feed-reset]');
 if(c){state.category=c.dataset.feedCategory;apply()}else if(m){state.month=m.dataset.feedMonth;apply()}else if(r&&!r.disabled)reset();
});
// long feeds: one tap from the last entry back to the filters (focus follows, so keyboard users land on the first pill)
const toolbar=root.querySelector('.feed-toolbar');
root.querySelector('[data-feed-top]')?.addEventListener('click',()=>{
 toolbar.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 toolbar.querySelector('[data-feed-filters] button')?.focus({preventScroll:true});
});
searchInputs.forEach(input=>input.addEventListener('input',()=>{state.query=normalize(input.value.trim());searchInputs.forEach(o=>{if(o!==input)o.value=input.value});apply()}));

// ---- photo lightbox + aria strings that follow the page language ----
R.mountLightbox(stream,id=>entries.find(e=>e.id===id).photos);
const filtersLabel=()=>root.querySelector('[data-feed-filters]').setAttribute('aria-label',A('Filter by category'));
new MutationObserver(filtersLabel).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
filtersLabel();apply();
})();
