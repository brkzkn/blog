// Home feed: renders window.FEED_ENTRIES onto the timeline, then wires filters, search, archive and the photo lightbox.
// UI strings are written in English; site.js translates them by exact text match (see its dictionary).
(()=>{
const root=document.querySelector('[data-feed]');const entries=window.FEED_ENTRIES;if(!root||!entries)return;
const typeLabels=Object.fromEntries(window.FEED_TYPES),categoryLabels=Object.fromEntries(window.FEED_CATEGORIES);
const langNames={en:'English',tr:'Turkish'};
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthsLong=['January','February','March','April','May','June','July','August','September','October','November','December'];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=text=>text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
// attribute strings are not reachable by site.js's text walker, so they carry their own TR table
const aria={'Filter by category':'Kategoriye göre filtrele','Close':'Kapat','Previous photo':'Önceki fotoğraf','Next photo':'Sonraki fotoğraf','Photo viewer':'Fotoğraf görüntüleyici'};
const isTr=()=>document.documentElement.lang==='tr';
const A=text=>isTr()&&aria[text]||text;
const photoLabel=(i,n,alt)=>isTr()?`${i} / ${n}. fotoğrafı büyüt: ${alt}`:`Open photo ${i} of ${n}: ${alt}`;

const parts=entry=>{const [y,m,d]=entry.publishedAt.split('-');return{y,m,d,month:`${y}-${m}`}};
const dateText=entry=>{const p=parts(entry);return p.d?`${p.d} ${months[+p.m-1]}`:months[+p.m-1]};
const fullDate=entry=>{const p=parts(entry);return p.d?`${+p.d} ${months[+p.m-1]} ${p.y}`:`${monthsLong[+p.m-1]} ${p.y}`};
const monthName=key=>{const [y,m]=key.split('-');return `${monthsLong[+m-1]} ${y}`};

const img=(p,cls='')=>`<img${cls?` class="${cls}"`:''} src="${esc(p.src)}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">`;
const tagList=e=>e.tags&&e.tags.length?`<ul class="fe-tags">${e.tags.slice(0,3).map(t=>`<li class="tag">${esc(t)}</li>`).join('')}</ul>`:'';
const arrow='<span aria-hidden="true">→</span>';

const art={
 architecture:'<svg class="fe-art" viewBox="0 0 240 180" role="img" aria-label="Diagram: constraints lead to a small design that is tested, instead of an ideal diagram drawn first"><rect x="14" y="14" width="76" height="34" rx="3" class="dash"/><path d="M26 31h52" class="dash"/><rect x="14" y="73" width="76" height="34" rx="3"/><rect x="14" y="132" width="76" height="34" rx="3"/><rect x="150" y="73" width="76" height="34" rx="3" class="hot"/><path d="M90 90h60M52 107v25M52 48v25" class="line"/><path d="M144 85l6 5-6 5M46 126l6 6 6-6" class="line"/><circle cx="188" cy="90" r="5" class="hotfill"/></svg>',
 twins:'<svg class="fe-art fe-twins" viewBox="0 0 240 150" role="img" aria-label="Illustration: two small figures seen from behind under one arch"><path d="M20 140v-40a100 100 0 0 1 200 0v40" class="line"/><circle cx="100" cy="86" r="14"/><path d="M78 140c0-26 9-38 22-38s22 12 22 38" /><circle cx="148" cy="86" r="14" class="hot"/><path d="M126 140c0-26 9-38 22-38s22 12 22 38" class="hot"/><path d="M10 140h220" class="line"/></svg>',
 chip:'<svg class="fe-art" viewBox="0 0 320 180" role="img" aria-label="Placeholder preview: a small circuit board"><rect x="110" y="50" width="100" height="80" rx="4"/><path d="M130 50V30m30 20V30m30 20V30M130 130v20m30-20v20m30-20v20M110 70H90m20 20H90m20 20H90M210 70h20m-20 20h20m-20 20h20" class="line"/><circle cx="160" cy="90" r="10" class="hotfill"/></svg>'
};

const foot=e=>`<p class="fe-foot tiny"><span>Written in ${langNames[e.language]}</span>${e.sample?'<span class="mock">Sample</span>':''}</p>`;
const body=e=>`<p lang="${e.language}">${esc(e.body)}</p>`;

const renderers={
 note:e=>`<p class="fe-note-text" lang="${e.language}">${esc(e.body)}</p>${foot(e)}`,

 album:e=>{const n=e.photos.length,r=e.photos[0].w/e.photos[0].h;
  return `${e.title?`<h2 class="h4">${esc(e.title)}</h2>`:''}<p class="fe-caption" lang="${e.language}">${esc(e.caption)}</p>
  <div class="fe-album n${n}" style="--ratio:${e.photos[0].w}/${e.photos[0].h}" role="group" aria-label="${esc(e.title||e.place)}">${e.photos.map((p,i)=>`<button type="button" class="fe-photo" data-album="${e.id}" data-index="${i}" aria-label="${esc(photoLabel(i+1,n,p.alt))}">${img(p)}</button>`).join('')}</div>
  <p class="fe-meta tiny"><span>${esc(e.place)}</span><span>${n} photos</span>${e.href?`<a class="link" href="${esc(e.href)}">${esc(e.linkLabel)} ${arrow}</a>`:''}</p>${foot(e)}`},

 writing:e=>{const heading=e.href?`<a href="${esc(e.href)}">${esc(e.title)}</a>`:esc(e.title);
  const info=[e.publishedAt?`<span>Published</span> <time datetime="${e.publishedAt}">${fullDate(e)}</time>`:'',e.readingMinutes?`<span>${e.readingMinutes} min read</span>`:''].filter(Boolean).map(x=>`<span>${x}</span>`).join('');
  return `${e.cover?`<div class="fe-cover">${img(e.cover)}</div>`:''}<div class="fe-writing${e.art?' has-art':''}"><div class="fe-writing-text">
   <h2 class="h3" lang="${e.language}">${heading}</h2><p class="small" lang="${e.language}">${esc(e.summary)}</p>
   <p class="fe-meta tiny">${info}</p>${tagList(e)}${e.href?'':'<p class="fe-pending tiny">Sample preview · Full entry coming later</p>'}</div>${e.art?art[e.art]:''}</div>${foot(e)}`},

 project:e=>`<div class="fe-log"><div class="fe-log-head"><p class="fe-kicker">${esc(e.project)}</p><span class="tag warm" lang="${e.language}">${esc(e.status)}</span></div>
  <h2 class="h4">${esc(e.title)}</h2><div class="fe-log-body${e.image?' has-img':''}"><dl class="fe-log-list"><dt>What changed</dt><dd><ul>${e.changes.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></dd>
  ${e.next?`<dt>Next step</dt><dd>${esc(e.next)}</dd>`:''}</dl>${e.image?`<div class="fe-log-img">${img(e.image)}</div>`:''}</div>
  <p class="fe-meta tiny">${e.logHref?`<a class="link" href="${esc(e.logHref)}">${esc(e.logLabel)} ${arrow}</a>`:''}${tagList(e)}</p></div>${foot(e)}`,

 milestone:e=>`<div class="fe-milestone"><div class="fe-milestone-text"><p class="fe-milestone-date"><time datetime="${e.publishedAt}">${esc(e.dateLabel)}</time></p>
  <h2 class="h3" lang="${e.language}">${esc(e.title)}</h2><p class="fe-milestone-body" lang="${e.language}">${esc(e.body)}</p></div>
  <figure class="fe-milestone-art">${art.twins}<figcaption class="tiny">${esc(e.illustration)}</figcaption></figure></div>${foot(e)}`,

 review:e=>{const book=e.subject==='Book';
  const cover=book?`<div class="fe-book" aria-hidden="true"><span class="fe-book-title">${esc(e.title)}</span><span class="fe-book-author">${esc(e.creator)}</span></div>`:(e.cover?img(e.cover,'fe-device'):'');
  const stars=e.rating?`<p class="fe-rating"><span class="stars" aria-hidden="true">${Array.from({length:e.ratingMax},(_,i)=>`<i${i<e.rating?'':' class="off"'}></i>`).join('')}</span><span class="fe-sr">Rating</span> <span>${e.rating}/${e.ratingMax}</span></p>`:'';
  return `<div class="fe-review${book?' is-book':''}"><div class="fe-review-cover">${cover}</div><div class="fe-review-text">
   <p class="fe-kicker">Review · ${esc(e.subject)}</p><h2 class="h3" lang="${e.language}">${e.href?`<a href="${esc(e.href)}">${esc(e.title)}</a>`:esc(e.title)}</h2>
   ${e.creator?`<p class="small">${esc(e.creator)}${e.fictional?' <span class="mock">Fictional</span>':''}</p>`:''}${e.meta?`<p class="tiny">${esc(e.meta)}</p>`:''}${stars}
   <p class="fe-review-body" lang="${e.language}">${esc(e.body)}</p>
   ${e.recommend?`<p class="fe-recommend small"><b>Who I’d recommend it to</b> ${esc(e.recommend)}</p>`:''}
   ${e.href&&e.linkLabel?`<p class="fe-meta tiny"><a class="link" href="${esc(e.href)}">${esc(e.linkLabel)} ${arrow}</a></p>`:''}
   ${e.fictional?`<p class="tiny">${esc(e.fictional)}</p>`:''}</div></div>${foot(e)}`},

 monthly:e=>`<div class="fe-monthly"><div class="fe-collage" role="group" aria-label="Cover collage, illustrative images">${e.collage.map((p,i)=>`<img class="c${i}" src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" decoding="async">`).join('')}</div>
  <div class="fe-monthly-text"><h2 class="h3"><a href="${esc(e.href)}">${esc(e.title)}</a></h2>
  <ul class="fe-counts">${e.counts.map(([n,l])=>`<li><b>${n}</b> <span>${esc(l)}</span></li>`).join('')}</ul>
  <blockquote class="fe-highlight"><p class="fe-kicker">Highlight of the month</p><p lang="${e.language}">${esc(e.highlight)}</p></blockquote>
  <p class="fe-meta tiny"><a class="link" href="${esc(e.href)}">See the full month ${arrow}</a></p></div></div>${foot(e)}`,

 link:e=>{const live=e.verified;const tag=live?'a':'div';
  const attrs=live?` href="${esc(e.url)}" target="_blank" rel="noopener noreferrer"`:'';
  return `<p class="fe-kicker">My note</p><p class="fe-comment" lang="${e.language}">${esc(e.comment)}</p>
  <${tag} class="fe-source"${attrs}><span class="fe-source-img">${art.chip}</span><span class="fe-source-text"><span class="fe-kicker">From the source</span>
  <span class="fe-source-title">${esc(e.linkTitle)}</span><span class="fe-source-desc" lang="en">${esc(e.description)}</span>
  <span class="fe-source-domain tiny"><span>${esc(e.domain)}</span> · <span>${live?'Opens in a new tab':'Fictional link, not clickable'}</span>${live?' <span aria-hidden="true">↗</span>':''}</span></span></${tag}>
  <p class="fe-meta tiny">Preview image is a placeholder drawn in code.</p>${foot(e)}`}
};

// ---- render ----
const sorted=[...entries].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
const stream=root.querySelector('[data-feed-list]');
const skip=new Set(['src','href','logHref','url','id']);
const collect=(v,out=[])=>{if(typeof v==='string')out.push(v);else if(Array.isArray(v))v.forEach(x=>collect(x,out));else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>skip.has(k)||collect(x,out));return out};
const haystack=new Map(sorted.map(e=>[e.id,normalize([...collect(e),categoryLabels[e.category],typeLabels[e.type],dateText(e),fullDate(e)].join(' '))]));
stream.innerHTML=sorted.map(e=>`<article class="timeline-entry fe-entry" id="entry-${e.id}" data-feed-entry="${e.id}" data-type="${e.type}" data-feed-cat="${e.category}"><div class="timeline-meta"><time datetime="${e.publishedAt}"><span class="timeline-date">${dateText(e)}</span><span class="timeline-year">${parts(e).y}</span></time><span class="timeline-category">${categoryLabels[e.category]}</span><span class="timeline-type">${typeLabels[e.type]}</span></div><div class="timeline-content fe-body-${e.type}">${renderers[e.type](e)}</div></article>`).join('');
const nodes=new Map([...stream.querySelectorAll('[data-feed-entry]')].map(n=>[n.dataset.feedEntry,n]));

// ---- controls built from the data ----
const catList=window.FEED_CATEGORIES,monthKeys=[...new Set(sorted.map(e=>parts(e).month))];
const btn=(attr,value,label)=>`<button type="button" ${attr}="${value}" aria-pressed="false"><span>${esc(label)}</span><span class="sidebar-count" data-count-${attr.replace('data-feed-','')}="${value}"></span></button>`;
document.querySelectorAll('[data-feed-topics]').forEach(n=>n.innerHTML=btn('data-feed-category','all','All entries')+catList.map(([k,l])=>btn('data-feed-category',k,l)).join(''));
document.querySelectorAll('[data-feed-months]').forEach(n=>n.innerHTML=btn('data-feed-month','all','All months')+monthKeys.map(k=>btn('data-feed-month',k,monthName(k))).join(''));
root.querySelector('[data-feed-filters]').innerHTML=['all',...catList.map(c=>c[0])].map(k=>`<button type="button" data-feed-category="${k}" aria-pressed="false">${esc(k==='all'?'All':categoryLabels[k])}</button>`).join('');
const select=root.querySelector('[data-feed-type]');
select.innerHTML=`<option value="all">All types</option>`+window.FEED_TYPES.map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join('');

// ---- filtering ----
const state={category:'all',type:'all',month:'all',query:''};
const summary=root.querySelector('[data-feed-summary]'),empty=root.querySelector('[data-feed-empty]');
const searchInputs=[...document.querySelectorAll('[data-feed-search]')];
const ok=(e,except)=>(except==='category'||state.category==='all'||e.category===state.category)&&(except==='type'||state.type==='all'||e.type===state.type)&&(except==='month'||state.month==='all'||parts(e).month===state.month)&&(except==='query'||!state.query||haystack.get(e.id).includes(state.query));
const setText=(node,v)=>{if(node.textContent!==String(v))node.textContent=String(v)};
function apply(){
 let shown=0,last=null,first=null;
 sorted.forEach(e=>{const n=nodes.get(e.id),show=ok(e);n.hidden=!show;n.classList.remove('is-first','is-last');if(show){shown++;first=first||n;last=n}});
 first?.classList.add('is-first');last?.classList.add('is-last');
 setText(summary,shown?`Showing ${shown} of ${sorted.length} entries`:'No entries match');empty.hidden=shown!==0;
 document.querySelectorAll('[data-feed-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feedCategory===state.category)));
 document.querySelectorAll('[data-feed-month]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feedMonth===state.month)));
 document.querySelectorAll('[data-count-category]').forEach(n=>setText(n,sorted.filter(e=>(n.dataset.countCategory==='all'||e.category===n.dataset.countCategory)&&ok(e,'category')).length));
 document.querySelectorAll('[data-count-month]').forEach(n=>setText(n,sorted.filter(e=>(n.dataset.countMonth==='all'||parts(e).month===n.dataset.countMonth)&&ok(e,'month')).length));
 if(select.value!==state.type)select.value=state.type;
 const active=state.category!=='all'||state.type!=='all'||state.month!=='all'||!!state.query;
 document.querySelectorAll('[data-feed-reset]').forEach(b=>{b.disabled=!active});
}
function reset(){state.category='all';state.type='all';state.month='all';state.query='';searchInputs.forEach(i=>i.value='');apply();
 const f=document.activeElement;if(!f||f===document.body||f.disabled||f.closest('[hidden]'))root.querySelector('[data-feed-filters] button')?.focus()}
document.addEventListener('click',ev=>{
 const c=ev.target.closest('[data-feed-category]'),m=ev.target.closest('[data-feed-month]'),r=ev.target.closest('[data-feed-reset]');
 if(c){state.category=c.dataset.feedCategory;apply()}else if(m){state.month=m.dataset.feedMonth;apply()}else if(r&&!r.disabled)reset();
});
select.addEventListener('change',()=>{state.type=select.value;apply()});
searchInputs.forEach(input=>input.addEventListener('input',()=>{state.query=normalize(input.value.trim());searchInputs.forEach(o=>{if(o!==input)o.value=input.value});apply()}));

// ---- photo lightbox ----
const dialog=document.createElement('dialog');dialog.className='feed-lightbox';
dialog.innerHTML=`<figure><img alt=""><figcaption><span data-lb-caption></span><span class="tiny"><span data-lb-count></span> · <span>Illustrative image</span></span></figcaption></figure><div class="feed-lightbox-bar"><button type="button" data-lb="prev"><span aria-hidden="true">‹</span> <span>Previous</span></button><button type="button" data-lb="next"><span>Next</span> <span aria-hidden="true">›</span></button><button type="button" data-lb="close"><span>Close</span> <span aria-hidden="true">×</span></button></div>`;
document.body.append(dialog);
const lbImg=dialog.querySelector('img'),lbCaption=dialog.querySelector('[data-lb-caption]'),lbCount=dialog.querySelector('[data-lb-count]');
let album=null,index=0,opener=null;
const albumOf=id=>entries.find(e=>e.id===id).photos;
function show(i){index=(i+album.length)%album.length;const p=album[index];lbImg.src=p.src;lbImg.alt=p.alt;lbImg.width=p.w;lbImg.height=p.h;setText(lbCaption,p.alt);setText(lbCount,`${index+1} / ${album.length}`)}
function labels(){dialog.setAttribute('aria-label',A('Photo viewer'));dialog.querySelector('[data-lb=prev]').setAttribute('aria-label',A('Previous photo'));dialog.querySelector('[data-lb=next]').setAttribute('aria-label',A('Next photo'));dialog.querySelector('[data-lb=close]').setAttribute('aria-label',A('Close'))}
stream.addEventListener('click',ev=>{const b=ev.target.closest('.fe-photo');if(!b)return;opener=b;album=albumOf(b.dataset.album);const single=album.length<2;dialog.querySelectorAll('[data-lb=prev],[data-lb=next]').forEach(x=>x.hidden=single);labels();show(+b.dataset.index);dialog.showModal();dialog.querySelector('[data-lb=close]').focus()});
dialog.addEventListener('click',ev=>{const a=ev.target.closest('[data-lb]')?.dataset.lb;if(a==='prev')show(index-1);else if(a==='next')show(index+1);else if(a==='close'||ev.target===dialog)dialog.close()});
dialog.addEventListener('keydown',ev=>{if(album.length<2)return;if(ev.key==='ArrowLeft'){ev.preventDefault();show(index-1)}else if(ev.key==='ArrowRight'){ev.preventDefault();show(index+1)}});
dialog.addEventListener('close',()=>{lbImg.removeAttribute('src');opener?.focus();opener=null});

// aria strings follow the page language
const ariaTargets=()=>{root.querySelector('[data-feed-filters]').setAttribute('aria-label',A('Filter by category'));document.querySelectorAll('.fe-photo').forEach(b=>{const n=albumOf(b.dataset.album).length,i=+b.dataset.index;b.setAttribute('aria-label',photoLabel(i+1,n,albumOf(b.dataset.album)[i].alt))});if(dialog.open)labels()};
new MutationObserver(ariaTargets).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
ariaTargets();apply();
})();
