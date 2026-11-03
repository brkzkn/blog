// Shared by the home feed (feed.js) and the review page (feed-types.html): one renderer per entry type, plus the photo lightbox.
// UI strings are written in English; site.js translates them by exact text match (see its dictionary).
(()=>{
if(!window.FEED_TYPES)return;
const typeLabels=Object.fromEntries(window.FEED_TYPES),categoryLabels=Object.fromEntries(window.FEED_CATEGORIES);
const langNames={en:'English',tr:'Turkish'};
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthsLong=['January','February','March','April','May','June','July','August','September','October','November','December'];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=text=>text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
const setText=(node,v)=>{if(node.textContent!==String(v))node.textContent=String(v)};
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
const photoCount=n=>`<span>${n} photo${n===1?'':'s'}</span>`;
// a visible, button-like link to a detail page (trip guide, restaurant page); extra is anything that sits beside it on the row
const ctaRow=(href,label,extra='')=>href||extra?`<div class="fe-cta-row">${href?`<a class="btn sm fe-cta" href="${esc(href)}">${esc(label)} ${arrow}</a>`:''}${extra}</div>`:'';
const albumGrid=(e,name)=>{const n=e.photos.length;return `<div class="fe-album n${n}" style="--ratio:${e.photos[0].w}/${e.photos[0].h}" role="group" aria-label="${esc(name)}">${e.photos.map((p,i)=>`<button type="button" class="fe-photo" data-album="${e.id}" data-index="${i}" aria-label="${esc(photoLabel(i+1,n,p.alt))}">${img(p)}</button>`).join('')}</div>`};
const ratingHtml=e=>e.rating?`<p class="fe-rating"><span class="stars" aria-hidden="true">${Array.from({length:e.ratingMax},(_,i)=>`<i${i<e.rating?'':' class="off"'}></i>`).join('')}</span><span class="fe-sr">Rating</span> <span>${e.rating}/${e.ratingMax}</span></p>`:'';
const priceHtml=e=>e.price?`<span class="fe-price"><span class="fe-sr">Price level ${e.price} of 4</span><span aria-hidden="true">${(e.currency||'₺').repeat(e.price)}<i>${(e.currency||'₺').repeat(4-e.price)}</i></span></span>`:'';

// where a film or series was watched: small chips with a neutral monogram (not a brand logo); clickable only when the entry gives an href
const platformMark=(p,id)=>id==='cinema'?'<svg class="fe-platform-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18v3.2a1.8 1.8 0 0 0 0 3.6V17H3v-3.2a1.8 1.8 0 0 0 0-3.6Z"/></svg>':`<span class="fe-platform-mark" aria-hidden="true">${esc(p.mark)}</span>`;
const platformsHtml=e=>e.platforms&&e.platforms.length?`<p class="fe-platforms"><span class="tiny">Watched on</span><span class="fe-platform-list">${e.platforms.map(x=>{const p=(window.FEED_PLATFORMS||{})[x.id]||{label:x.id,mark:x.id.charAt(0).toUpperCase()};const inner=`${platformMark(p,x.id)}<span>${esc(p.label)}</span>`;
 return x.href?`<a class="fe-platform" href="${esc(x.href)}" target="_blank" rel="noopener noreferrer">${inner} <span class="fe-sr">Opens in a new tab</span></a>`:`<span class="fe-platform">${inner}</span>`}).join('')}</span></p>`:'';

const art={
 architecture:'<svg class="fe-art" viewBox="0 0 240 180" role="img" aria-label="Diagram: constraints lead to a small design that is tested, instead of an ideal diagram drawn first"><rect x="14" y="14" width="76" height="34" rx="3" class="dash"/><path d="M26 31h52" class="dash"/><rect x="14" y="73" width="76" height="34" rx="3"/><rect x="14" y="132" width="76" height="34" rx="3"/><rect x="150" y="73" width="76" height="34" rx="3" class="hot"/><path d="M90 90h60M52 107v25M52 48v25" class="line"/><path d="M144 85l6 5-6 5M46 126l6 6 6-6" class="line"/><circle cx="188" cy="90" r="5" class="hotfill"/></svg>',
 twins:'<svg class="fe-art fe-twins" viewBox="0 0 240 150" role="img" aria-label="Illustration: two small figures seen from behind under one arch"><path d="M20 140v-40a100 100 0 0 1 200 0v40" class="line"/><circle cx="100" cy="86" r="14"/><path d="M78 140c0-26 9-38 22-38s22 12 22 38" /><circle cx="148" cy="86" r="14" class="hot"/><path d="M126 140c0-26 9-38 22-38s22 12 22 38" class="hot"/><path d="M10 140h220" class="line"/></svg>',
 chip:'<svg class="fe-art" viewBox="0 0 320 180" role="img" aria-label="Placeholder preview: a small circuit board"><rect x="110" y="50" width="100" height="80" rx="4"/><path d="M130 50V30m30 20V30m30 20V30M130 130v20m30-20v20m30-20v20M110 70H90m20 20H90m20 20H90M210 70h20m-20 20h20m-20 20h20" class="line"/><circle cx="160" cy="90" r="10" class="hotfill"/></svg>'
};

// language and sample status live in the left meta column as one small label; the full language name is read out, "EN" is only shown
const origin=e=>`<span class="timeline-origin mock"><span class="fe-sr">Written in ${langNames[e.language]}</span><span aria-hidden="true">${e.language.toUpperCase()}</span>${e.sample?' · <span>Sample</span>':''}</span>`;

const renderers={
 note:e=>`<p class="fe-note-text" lang="${e.language}">${esc(e.body)}</p>`,

 album:e=>{const n=e.photos.length;
  return `${e.title?`<h2 class="h4">${esc(e.title)}</h2>`:''}<p class="fe-caption" lang="${e.language}">${esc(e.caption)}</p>
  ${albumGrid(e,e.title||e.place)}
  <p class="fe-meta tiny"><span>${esc(e.place)}</span>${photoCount(n)}</p>${ctaRow(e.href,e.linkLabel)}`},

 writing:e=>{const heading=e.href?`<a href="${esc(e.href)}">${esc(e.title)}</a>`:esc(e.title);
  const info=[e.publishedAt?`<span>Published</span> <time datetime="${e.publishedAt}">${fullDate(e)}</time>`:'',e.readingMinutes?`<span>${e.readingMinutes} min read</span>`:''].filter(Boolean).map(x=>`<span>${x}</span>`).join('');
  return `${e.cover?`<div class="fe-cover">${img(e.cover)}</div>`:''}<div class="fe-writing${e.art?' has-art':''}"><div class="fe-writing-text">
   <h2 class="h3" lang="${e.language}">${heading}</h2><p class="small" lang="${e.language}">${esc(e.summary)}</p>
   <p class="fe-meta tiny">${info}</p>${tagList(e)}${e.href?'':'<p class="fe-pending tiny">Sample preview · Full entry coming later</p>'}</div>${e.art?art[e.art]:''}</div>`},

 project:e=>`<div class="fe-log"><div class="fe-log-head"><p class="fe-kicker">${esc(e.project)}</p><span class="tag warm" lang="${e.language}">${esc(e.status)}</span></div>
  <h2 class="h4">${esc(e.title)}</h2><div class="fe-log-body${e.image?' has-img':''}"><dl class="fe-log-list"><dt>What changed</dt><dd><ul>${e.changes.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></dd>
  ${e.next?`<dt>Next step</dt><dd>${esc(e.next)}</dd>`:''}</dl>${e.image?`<div class="fe-log-img">${img(e.image)}</div>`:''}</div>
  <div class="fe-meta tiny">${e.logHref?`<a class="link" href="${esc(e.logHref)}">${esc(e.logLabel)} ${arrow}</a>`:''}${tagList(e)}</div></div>`,

 milestone:e=>`<div class="fe-milestone"><div class="fe-milestone-text"><p class="fe-milestone-date"><time datetime="${e.publishedAt}">${esc(e.dateLabel)}</time></p>
  <h2 class="h3" lang="${e.language}">${esc(e.title)}</h2><p class="fe-milestone-body" lang="${e.language}">${esc(e.body)}</p></div>
  <figure class="fe-milestone-art">${art.twins}<figcaption class="tiny">${esc(e.illustration)}</figcaption></figure></div>`,

 review:e=>{const book=e.subject==='Book';
  const cover=book?`<div class="fe-book" aria-hidden="true"><span class="fe-book-title">${esc(e.title)}</span><span class="fe-book-author">${esc(e.creator)}</span></div>`:(e.cover?img(e.cover,'fe-device'):'');
  return `<div class="fe-review${book?' is-book':''}${cover?'':' no-cover'}">${cover?`<div class="fe-review-cover">${cover}</div>`:''}<div class="fe-review-text">
   <p class="fe-kicker">Review · ${esc(e.subject)}</p><h2 class="h3" lang="${e.language}">${e.href?`<a href="${esc(e.href)}">${esc(e.title)}</a>`:esc(e.title)}</h2>
   ${e.creator?`<p class="small">${esc(e.creator)}${e.fictional?' <span class="mock">Fictional</span>':''}</p>`:''}${e.meta?`<p class="tiny">${esc(e.meta)}</p>`:''}${ratingHtml(e)}${platformsHtml(e)}
   <p class="fe-review-body" lang="${e.language}">${esc(e.body)}</p>
   ${e.recommend?`<p class="fe-recommend small"><b>Who I’d recommend it to</b> ${esc(e.recommend)}</p>`:''}
   ${e.href&&e.linkLabel?`<p class="fe-meta tiny"><a class="link" href="${esc(e.href)}">${esc(e.linkLabel)} ${arrow}</a></p>`:''}
   ${e.fictional?`<p class="tiny">${esc(e.fictional)}</p>`:''}</div></div>`},

 restaurant:e=>`<div class="fe-review fe-restaurant${e.photo?(e.photo.w/e.photo.h>1.15?' is-landscape':''):' no-cover'}">${e.photo?`<div class="fe-review-cover">${img(e.photo,'fe-device')}</div>`:''}<div class="fe-review-text">
   ${e.cuisine?`<p class="fe-kicker" lang="${e.language}">${esc(e.cuisine)}</p>`:''}<h2 class="h3" lang="${e.language}">${e.href?`<a href="${esc(e.href)}">${esc(e.name)}</a>`:esc(e.name)}</h2>
   <p class="small"><span lang="${e.language}">${esc(e.area)}</span>${e.price?' · ':''}${priceHtml(e)}${e.fictional?' <span class="mock">Fictional</span>':''}</p>
   ${ratingHtml(e)}${e.visited?`<p class="tiny">${esc(e.visited)}</p>`:''}
   <p class="fe-review-body" lang="${e.language}">${esc(e.body)}</p>
   ${e.order?`<p class="fe-recommend small"><b>Order again</b> <span lang="${e.language}">${esc(e.order)}</span></p>`:''}
   ${ctaRow(e.href,e.linkLabel)}
   ${e.fictional?`<p class="tiny">Fictional place, sample content.</p>`:''}</div></div>`,

 trip:e=>`<div class="fe-trip"><p class="fe-kicker" lang="${e.language}">${esc(e.country)}</p><h2 class="h3" lang="${e.language}">${esc(e.destination)}</h2>
  <p class="fe-trip-meta tiny"><span>${esc(e.dates)}</span>${e.days?`<span>${esc(e.days)}</span>`:''}</p>
  <p class="fe-caption" lang="${e.language}">${esc(e.caption)}</p>
  ${albumGrid(e,e.destination)}
  ${ctaRow(e.href,e.linkLabel,photoCount(e.photos.length).replace('<span>','<span class="tiny">'))}</div>`,

 monthly:e=>`<div class="fe-monthly"><div class="fe-collage" role="group" aria-label="Cover collage, illustrative images">${e.collage.map((p,i)=>`<img class="c${i}" src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" decoding="async">`).join('')}</div>
  <div class="fe-monthly-text"><h2 class="h3"><a href="${esc(e.href)}">${esc(e.title)}</a></h2>
  <ul class="fe-counts">${e.counts.map(([n,l])=>`<li><b>${n}</b> <span>${esc(l)}</span></li>`).join('')}</ul>
  <blockquote class="fe-highlight"><p class="fe-kicker">Highlight of the month</p><p lang="${e.language}">${esc(e.highlight)}</p></blockquote>
  <p class="fe-meta tiny"><a class="link" href="${esc(e.href)}">See the full month ${arrow}</a></p></div></div>`,

 link:e=>{const live=e.verified;const tag=live?'a':'div';
  const attrs=live?` href="${esc(e.url)}" target="_blank" rel="noopener noreferrer"`:'';
  return `<p class="fe-kicker">My note</p><p class="fe-comment" lang="${e.language}">${esc(e.comment)}</p>
  <${tag} class="fe-source"${attrs}><span class="fe-source-img">${art.chip}</span><span class="fe-source-text"><span class="fe-kicker">From the source</span>
  <span class="fe-source-title">${esc(e.linkTitle)}</span><span class="fe-source-desc" lang="en">${esc(e.description)}</span>
  <span class="fe-source-domain tiny"><span>${esc(e.domain)}</span> · <span>${live?'Opens in a new tab':'Fictional link, not clickable'}</span>${live?' <span aria-hidden="true">↗</span>':''}</span></span></${tag}>
  <p class="fe-meta tiny">Preview image is a placeholder drawn in code.</p>`}
};

// one timeline entry; extraMeta is appended to the left meta column (the review page uses it for variant labels)
const entryHtml=(e,extraMeta='')=>`<article class="timeline-entry fe-entry" id="entry-${e.id}" data-feed-entry="${e.id}" data-type="${e.type}" data-feed-cat="${e.category}"><div class="timeline-meta"><time datetime="${e.publishedAt}"><span class="timeline-date">${dateText(e)}</span><span class="timeline-year">${parts(e).y}</span></time><span class="timeline-category">${categoryLabels[e.category]}</span><span class="timeline-type">${typeLabels[e.type]}</span>${origin(e)}${extraMeta}</div><div class="timeline-content fe-body-${e.type}">${renderers[e.type](e)}</div></article>`;

// ---- photo lightbox: one dialog; scope is the element that holds the .fe-photo buttons, albumOf(id) returns that album's photos ----
function mountLightbox(scope,albumOf){
 const dialog=document.createElement('dialog');dialog.className='feed-lightbox';
 dialog.innerHTML=`<figure><img alt=""><figcaption><span data-lb-caption></span><span class="tiny"><span data-lb-count></span> · <span>Illustrative image</span></span></figcaption></figure><div class="feed-lightbox-bar"><button type="button" data-lb="prev"><span aria-hidden="true">‹</span> <span>Previous</span></button><button type="button" data-lb="next"><span>Next</span> <span aria-hidden="true">›</span></button><button type="button" data-lb="close"><span>Close</span> <span aria-hidden="true">×</span></button></div>`;
 document.body.append(dialog);
 const lbImg=dialog.querySelector('img'),lbCaption=dialog.querySelector('[data-lb-caption]'),lbCount=dialog.querySelector('[data-lb-count]');
 let album=null,index=0,opener=null;
 function show(i){index=(i+album.length)%album.length;const p=album[index];lbImg.src=p.src;lbImg.alt=p.alt;lbImg.width=p.w;lbImg.height=p.h;setText(lbCaption,p.alt);setText(lbCount,`${index+1} / ${album.length}`)}
 function labels(){dialog.setAttribute('aria-label',A('Photo viewer'));dialog.querySelector('[data-lb=prev]').setAttribute('aria-label',A('Previous photo'));dialog.querySelector('[data-lb=next]').setAttribute('aria-label',A('Next photo'));dialog.querySelector('[data-lb=close]').setAttribute('aria-label',A('Close'))}
 scope.addEventListener('click',ev=>{const b=ev.target.closest('.fe-photo');if(!b)return;opener=b;album=albumOf(b.dataset.album);const single=album.length<2;dialog.querySelectorAll('[data-lb=prev],[data-lb=next]').forEach(x=>x.hidden=single);labels();show(+b.dataset.index);dialog.showModal();dialog.querySelector('[data-lb=close]').focus()});
 dialog.addEventListener('click',ev=>{const a=ev.target.closest('[data-lb]')?.dataset.lb;if(a==='prev')show(index-1);else if(a==='next')show(index+1);else if(a==='close'||ev.target===dialog)dialog.close()});
 dialog.addEventListener('keydown',ev=>{if(album.length<2)return;if(ev.key==='ArrowLeft'){ev.preventDefault();show(index-1)}else if(ev.key==='ArrowRight'){ev.preventDefault();show(index+1)}});
 dialog.addEventListener('close',()=>{lbImg.removeAttribute('src');opener?.focus();opener=null});
 // photo and dialog aria strings follow the page language
 const refresh=()=>{scope.querySelectorAll('.fe-photo').forEach(b=>{const photos=albumOf(b.dataset.album),i=+b.dataset.index;b.setAttribute('aria-label',photoLabel(i+1,photos.length,photos[i].alt))});if(dialog.open)labels()};
 new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 refresh();
}

window.FeedRender={typeLabels,categoryLabels,esc,normalize,setText,A,parts,dateText,fullDate,monthName,entryHtml,mountLightbox};
})();
