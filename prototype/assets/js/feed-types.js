// Review page: draws every feed type with its variants through the same renderers the home feed uses (feed-render.js).
(()=>{
const R=window.FeedRender,groups=window.FEED_TYPE_EXAMPLES,entries=window.FEED_ENTRIES,host=document.querySelector('[data-review]');
if(!R||!groups||!entries||!host)return;
const {typeLabels,esc,entryHtml}=R;
const byId=new Map(entries.map(e=>[e.id,e]));
const resolve=v=>{const e=v.ref?byId.get(v.ref):v.entry;if(!e)throw new Error('Unknown example: '+(v.ref||v.label));return e};
const all=[];
host.innerHTML=groups.map(g=>{
 const items=g.variants.map((v,i)=>({n:i+1,v,e:resolve(v)}));
 items.forEach(x=>all.push(x.e));
 return `<section class="review-type" id="type-${g.type}" aria-labelledby="h-${g.type}">
  <header class="review-head"><p class="cat">TYPE · <code>${esc(g.type)}</code></p><h2 class="h3" id="h-${g.type}">${esc(typeLabels[g.type])}</h2>
  <p class="small" lang="tr">${esc(g.use)}</p><p class="tiny" lang="tr">${esc(g.fields)}</p>
  <ol class="review-variants" lang="tr">${items.map(x=>`<li><b>${esc(x.v.label)}</b> — ${esc(x.v.note)}</li>`).join('')}</ol>
  ${g.review?`<p class="review-note small" lang="tr"><b>İnceleme notu</b> ${esc(g.review)}</p>`:''}</header>
  <div class="review-stream">${items.map(x=>entryHtml(x.e,`<span class="review-variant-row"><span class="review-variant">${x.n} · ${esc(x.v.label)}</span></span>`)).join('')}</div>
 </section>`}).join('');
// the line should run through a section, not between sections
host.querySelectorAll('.review-stream').forEach(s=>{const a=s.querySelectorAll('.fe-entry');a[0].classList.add('is-first');a[a.length-1].classList.add('is-last')});
const toc=document.querySelector('[data-review-toc]');
if(toc)toc.innerHTML='<p class="sidebar-kicker">TÜRE GİT</p>'+groups.map(g=>`<a href="#type-${g.type}"><span>${esc(typeLabels[g.type])}</span><span class="sidebar-count">${g.variants.length}</span></a>`).join('');
R.mountLightbox(host,id=>all.find(e=>e.id===id).photos);
})();
