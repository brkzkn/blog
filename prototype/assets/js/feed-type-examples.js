// Review page data (feed-types.html): every feed type with the variants its renderer has to cope with.
// A variant is either { ref: '<id from FEED_ENTRIES>' } or an inline { entry: {...} } with the same shape as a feed entry.
// All inline entries are sample content. Descriptions are written in Turkish for the owner; the entries themselves follow the site language rules.
window.FEED_TYPE_EXAMPLES=[
 {
  type:'note',
  use:'Varsayılan biçim. Başlıksız, kısa; salı gecesi iki dakikada yazılabilen şey. Serif yazıyla, kutusuz.',
  fields:'Zorunlu: body. Başlık, görsel ve bağlantı yok.',
  variants:[
   {label:'Tek cümle',note:'En kısa hâl: tek satır.',entry:{id:'ex-note-one-line',type:'note',category:'personal',publishedAt:'2026-10-27',language:'en',tags:[],sample:true,body:'Rain, a window seat, and the ferry running late. Fine by me.'}},
   {label:'Kısa, EN',note:'İki üç cümle (ana sayfadaki aile notu).',ref:'note-nursery'},
   {label:'Orta, TR',note:'Türkçe, üç dört satır (ana sayfadaki kahve notu).',ref:'note-coffee'},
   {label:'Uzun',note:'Bir paragraf; satır uzunluğu ve ritmi görmek için.',entry:{id:'ex-note-long',type:'note',category:'work',publishedAt:'2026-10-14',language:'en',tags:['architecture'],sample:true,body:'Spent the morning reading a design document that was twelve pages long and answered none of the three questions I had. The diagrams were careful and the decisions were missing. I now start every review by asking which decision is hardest to reverse, and then I read only the pages that talk about it.'}}
  ]
 },
 {
  type:'album',
  use:'Fotoğraf öncelikli kayıt: 1 ila 4 fotoğraf, kısa açıklama, yer. Fotoğrafa tıklayınca görüntüleyici açılır.',
  fields:'Zorunlu: photos (1–4), caption, place. Opsiyonel: title, href + linkLabel.',
  variants:[
   {label:'1 foto',note:'Tek geniş fotoğraf (2:1). Oran ilk fotoğraftan alınır.',entry:{id:'ex-album-1',type:'album',category:'travel',publishedAt:'2026-10-13',language:'en',tags:['ayvalik'],sample:true,caption:'The harbour at seven in the morning, before anyone was awake.',place:'Ayvalık, Balıkesir',photos:[{src:'assets/images/trip-ayvalik.jpg',alt:'Ayvalık harbour',w:1400,h:700}]}},
   {label:'2 foto',note:'İki eşit kare.',entry:{id:'ex-album-2',type:'album',category:'personal',publishedAt:'2026-10-09',language:'en',tags:['food'],sample:true,caption:'Lunch, then the walk home.',place:'Moda, Istanbul',photos:[{src:'assets/images/note-calamari.jpg',alt:'Calamari',w:700,h:700},{src:'assets/images/note-terrace.jpg',alt:'The terrace',w:700,h:700}]}},
   {label:'3 foto',note:'Üç kare yan yana (ana sayfadaki Kadıköy albümü).',ref:'album-kadikoy'},
   {label:'4 + başlık',note:'Dört fotoğraf 2×2, başlık ve bağlantı (ana sayfadaki Londra albümü).',ref:'album-london'}
  ]
 },
 {
  type:'writing',
  use:'Başlıklı, uzun yazı. Seyrek. Akışta özet görünür, metin kendi sayfasındadır. Başlık bağlantı gibi görünür.',
  fields:'Zorunlu: title, summary. Opsiyonel: href, cover, art, readingMinutes, tags.',
  variants:[
   {label:'Çizimli',note:'Sağda diyagram, başlık bağlantılı (ana sayfadaki mimari yazısı).',ref:'writing-ideal-architecture'},
   {label:'Kapaklı',note:'Üstte geniş kapak; bağlantı yoksa "Sample preview" notu çıkar (ana sayfadaki Ayvalık yazısı).',ref:'writing-ayvalik'},
   {label:'Yalın',note:'Kapak ve çizim yok; sadece başlık, özet ve bilgi satırı.',entry:{id:'ex-writing-plain',type:'writing',category:'work',publishedAt:'2026-09-10',language:'en',tags:['design-reviews'],sample:true,title:'What I check first in a design review',href:'agentic-workflows.html',summary:'Three questions, in this order, before I read a single diagram. Most reviews end after the second one.',readingMinutes:5}},
   {label:'Türkçe',note:'Türkçe yazı; dil etiketi TR görünür.',entry:{id:'ex-writing-tr',type:'writing',category:'personal',publishedAt:'2026-08-30',language:'tr',tags:['istanbul'],sample:true,title:'Anadolu yakasında bir pazar sabahı',href:'blog.html',summary:'Vapur, simit ve yarım kalan bir toplantı notu. Şehri hatırlamanın en sakin yolu.',readingMinutes:4}}
  ]
 },
 {
  type:'project',
  use:'Bir projenin günlüğü: ne değişti, sıradaki adım. Makale değil, kısa bir kayıt. Sakin, çizgili kutu.',
  fields:'Zorunlu: project, title, status, changes[]. Opsiyonel: image, next, logHref + logLabel, tags.',
  variants:[
   {label:'Görselli',note:'Sağda görsel (ana sayfadaki Home Assistant braketi).',ref:'project-ha-mount'},
   {label:'Görselsiz',note:'Sadece liste ve sonraki adım (ana sayfadaki Thread kaydı).',ref:'project-thread'},
   {label:'En kısa',note:'Tek değişiklik, sonraki adım ve bağlantı yok.',entry:{id:'ex-project-min',type:'project',category:'projects',publishedAt:'2026-09-28',language:'en',tags:['petg'],sample:true,project:'3D printing',title:'Spool holder, second try',status:'Printed / Works',changes:['Hole moved 4 mm; the spool no longer rubs the wall.']}}
  ]
 },
 {
  type:'milestone',
  use:'Yaşamdaki dönüm noktası. Akıştaki tek kartlı, tek turuncu vurgulu kayıt; seyrek kullanılmalı.',
  fields:'Zorunlu: title, dateLabel, body, illustration. Fotoğraf yok; aile fotoğraflarında yüz gösterilmez.',
  variants:[
   {label:'Dönüm noktası',note:'Ana sayfadaki "The twins arrive" kaydı.',ref:'milestone-twins'}
  ],
  review:'Çizim şu an koda sabitlenmiş (iki figür). Başka bir dönüm noktası (yeni iş, taşınma) için genel bir çizim ya da çizimsiz bir düzen gerekir. Karar bekliyor.'
 },
 {
  type:'review',
  use:'Kitap, film, dizi, mekân ve cihaz için tek biçim. Solda kapak, sağda puan ve kısa yorum.',
  fields:'Zorunlu: subject, title, body. Opsiyonel: creator, rating + ratingMax, cover, meta, recommend, href + linkLabel.',
  variants:[
   {label:'Kitap',note:'Kapak kodla çizilir, puan var, kurgu etiketi (ana sayfadaki The Salt Ledger).',ref:'review-book-salt-ledger'},
   {label:'Cihaz',note:'Gerçek görsel, puansız, bağlantılı (ana sayfadaki Ray-Ban Meta).',ref:'review-rayban-meta'},
   {label:'Kapaksız',note:'Kapak yok; sol sütun boş kalmamalı.',entry:{id:'ex-review-film',type:'review',category:'culture',publishedAt:'2026-10-19',language:'en',tags:['film'],sample:true,subject:'Film',title:'A made-up film about a lighthouse',creator:'Sample director',fictional:'Fictional film and director, sample content.',rating:4,ratingMax:5,meta:'Watched 19 Oct 2026',body:'Slow, quiet and very well lit. I watched it twice in one week, which I almost never do.'}}
  ]
 },
 {
  type:'monthly',
  use:'Ay sonunda kültür günlüğünün özeti: sayılar ve ayın öne çıkanı. Üç görsellik kolaj ve başlık bağlantısı.',
  fields:'Zorunlu: title, href, collage (3), counts[], highlight.',
  variants:[
   {label:'Aylık özet',note:'Ana sayfadaki Ekim 2026 özeti.',ref:'monthly-2026-10'}
  ]
 },
 {
  type:'link',
  use:'Başkasının bir şeyine kısa yorumum. Yorum büyük yazılır, kaynak kartı altta. Doğrulanmamış bağlantı tıklanamaz.',
  fields:'Zorunlu: comment, url, domain, linkTitle, description, verified. Önizleme görseli kodla çizilen yer tutucudur.',
  variants:[
   {label:'Doğrulanmış',note:'Yeni sekmede açılır, kart tıklanabilir (ana sayfadaki ESPHome).',ref:'link-esphome'},
   {label:'Tıklanamaz',note:'verified: false. Kart bağlantı değil, "Fictional link" notu çıkar.',entry:{id:'ex-link-unverified',type:'link',category:'work',publishedAt:'2026-09-30',language:'en',tags:['architecture'],sample:true,comment:'A good short read on why queues hide problems instead of removing them.',url:'https://example.com/queues',domain:'example.com',linkTitle:'Queues do not fix overload',description:'A made-up article used to show the unverified state of a shared link.',verified:false}}
  ]
 }
];
