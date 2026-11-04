// @ts-nocheck: dense prototype code ported 1:1 for behaviour parity.
// TEMPORARY SECTION. Journal filters/search (home feed) and the copy-link button, kept here verbatim from the prototype
// site.js because the page owners' own scripts (feed.js, life and writing filters) do not exist yet.
// Remove each part once its owner ships a replacement; see needsFromOthers in the group report.
export function initFilters() {
const buttons=[...document.querySelectorAll('[data-filter]')];const items=[...document.querySelectorAll('[data-category]')];const monthButtons=[...document.querySelectorAll('[data-month]')];const searchInputs=[...document.querySelectorAll('[data-search]')];let selected='all',query='',month='all';
if(items.length){
 const summary=document.createElement('p');summary.className='filter-summary';summary.setAttribute('aria-live','polite');document.querySelector('.filters')?.after(summary);
 const empty=document.createElement('div');empty.className='journal-empty';empty.hidden=true;empty.innerHTML='<h3 class="h4">No entries found.</h3><p class="small">Try a different search or clear the filters.</p><button type="button" data-empty-reset>Show all entries →</button>';items.at(-1).after(empty);
 const normalize=text=>text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
 const originalSearch=new WeakMap(items.map(item=>[item,normalize(item.textContent)]));
 const matchesQuery=item=>!query||normalize(item.textContent).includes(query)||originalSearch.get(item).includes(query);
 const matchesMonth=item=>month==='all'||(item.querySelector('time')?.dateTime||'').startsWith(month);
 const setCount=(node,value)=>{if(node.textContent!==String(value))node.textContent=String(value)};
 function apply(){
  let count=0;items.forEach(item=>{const show=(selected==='all'||item.dataset.category===selected)&&matchesMonth(item)&&matchesQuery(item);item.hidden=!show;if(show)count++});
  summary.textContent=`${count} ${count===1?'entry':'entries'}${query?' matching your search':''}`;empty.hidden=count!==0;
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===selected)));
  monthButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.month===month)));
  document.querySelectorAll('[data-count-category]').forEach(node=>setCount(node,items.filter(item=>(node.dataset.countCategory==='all'||item.dataset.category===node.dataset.countCategory)&&matchesMonth(item)&&matchesQuery(item)).length));
  document.querySelectorAll('[data-count-month]').forEach(node=>setCount(node,items.filter(item=>(node.dataset.countMonth==='all'||(item.querySelector('time')?.dateTime||'').startsWith(node.dataset.countMonth))&&(selected==='all'||item.dataset.category===selected)&&matchesQuery(item)).length));
  document.querySelectorAll('[data-reset-filters]').forEach(button=>button.disabled=selected==='all'&&month==='all'&&!query);
 }
 function reset(){selected='all';month='all';query='';searchInputs.forEach(input=>input.value='');apply()}
 buttons.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.filter;apply()}));
 monthButtons.forEach(button=>button.addEventListener('click',()=>{month=button.dataset.month;apply()}));
 searchInputs.forEach(input=>input.addEventListener('input',()=>{query=normalize(input.value.trim());searchInputs.forEach(other=>{if(other!==input)other.value=input.value});apply()}));
 document.querySelectorAll('[data-reset-filters],[data-empty-reset]').forEach(button=>button.addEventListener('click',reset));apply();
}
}

export function initCopyLink() {
document.querySelectorAll('.copy-link').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);button.textContent='Link copied'}catch{button.textContent='Copy this page URL from your address bar'}}));
}
