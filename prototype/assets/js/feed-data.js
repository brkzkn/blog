// Home feed sample entries. Every entry is sample content, not a real claim.
// Shared fields: id, type, category, publishedAt (YYYY-MM-DD or YYYY-MM), language, tags, sample.
// Everything else is type specific and optional: title, cover, rating and href are never required.
// Types: note, album, writing, project, milestone, review, monthly, link.
// Categories: work, projects, travel, culture, family, gear, personal.
window.FEED_TYPES = [
  ['note', 'Short note'], ['album', 'Photo album'], ['writing', 'Writing'], ['project', 'Project update'],
  ['milestone', 'Milestone'], ['review', 'Review'], ['monthly', 'Monthly summary'], ['link', 'Shared link']
];
window.FEED_CATEGORIES = [
  ['work', 'Work'], ['projects', 'Projects'], ['travel', 'Travel'], ['culture', 'Culture'],
  ['family', 'Family'], ['gear', 'Gear'], ['personal', 'Personal']
];
window.FEED_ENTRIES = [
  {
    id: 'monthly-2026-10', type: 'monthly', category: 'culture', publishedAt: '2026-10-31', language: 'en',
    tags: ['monthly', 'culture'], sample: true,
    title: 'October 2026 — Watched, read, visited', href: 'october-2026.html',
    collage: [
      { src: 'assets/images/london-01.jpg', alt: 'Red bus on a wet London street' },
      { src: 'assets/images/note-view.jpg', alt: 'View from a terrace table' },
      { src: 'assets/images/hero-istanbul.jpg', alt: 'Istanbul rooftops at dawn' }
    ],
    counts: [['3', 'films'], ['1', 'series'], ['2', 'books'], ['1', 'theatre'], ['1', 'cultural trip']],
    highlight: 'The one that stayed with me was the theatre evening: two actors, one table, no set. I walked home instead of taking the ferry.'
  },
  {
    id: 'album-kadikoy', type: 'album', category: 'personal', publishedAt: '2026-10-30', language: 'tr',
    tags: ['food', 'istanbul'], sample: true,
    caption: 'Kadıköy’de yeni açılan bir yer: kalamar iyi, servis yavaş, manzara her şeyi affettiriyor. We will go back on a weekday.',
    place: 'Kadıköy, Istanbul',
    photos: [
      { src: 'assets/images/note-calamari.jpg', alt: 'Calamari', w: 700, h: 700 },
      { src: 'assets/images/note-view.jpg', alt: 'The view from the table', w: 700, h: 700 },
      { src: 'assets/images/note-terrace.jpg', alt: 'The terrace', w: 700, h: 700 }
    ]
  },
  {
    id: 'review-rayban-meta', type: 'review', category: 'gear', publishedAt: '2026-10-29', language: 'en',
    tags: ['gear', 'wearables'], sample: true, subject: 'Device',
    title: 'Ray-Ban Meta glasses', href: 'gear.html', linkLabel: 'Full note on the gear page',
    cover: { src: 'assets/images/gear-rayban-meta.jpg', alt: 'Ray-Ban Meta glasses', w: 960, h: 720 },
    meta: 'Added to my gear',
    body: 'Two weeks in. The camera is the reason I bought them; the speakers are the reason I keep wearing them.'
  },
  {
    id: 'note-coffee', type: 'note', category: 'personal', publishedAt: '2026-10-28', language: 'tr',
    tags: ['coffee'], sample: true,
    body: 'Sabah kahvesini beklerken dünkü sorunun aslında iki sınıf ve bir kuyruk meselesi olduğunu fark ettim. Üç günlük çözümüm, kahve soğumadan yarım sayfaya sığdı. Bazen basit olan, sadece henüz çizilmemiş olandır.'
  },
  {
    id: 'project-ha-mount', type: 'project', category: 'projects', publishedAt: '2026-10-26', language: 'en',
    tags: ['home-assistant', '3d-printing', 'petg'], sample: true,
    project: 'Home Assistant sensor mount', title: 'A bracket that stops the sensor sliding off the shelf edge',
    status: 'Iteration 03 / Testing',
    image: { src: 'assets/images/stock-3d-printer.jpg', alt: 'Printed cable holders next to a desktop 3D printer', w: 1448, h: 1086 },
    changes: ['Wall thickness 1.6 mm to 2.4 mm; iteration 02 flexed under the cable weight.', 'Added a 3 mm lip so the sensor cannot rotate out.', 'Moved the cable slot to the back; the front is clean now.'],
    next: 'Print in PETG and leave it on the hallway shelf for a week.', logHref: 'smart-home.html', logLabel: 'Smart home log'
  },
  {
    id: 'review-book-salt-ledger', type: 'review', category: 'culture', publishedAt: '2026-10-21', language: 'en',
    tags: ['books', 'fiction'], sample: true, subject: 'Book',
    title: 'The Salt Ledger', creator: 'Ines Varga', rating: 4, ratingMax: 5,
    meta: 'Finished 21 Oct 2026',
    body: 'A slow novel about a harbour accountant who finds the numbers have been lying for thirty years. Quiet, precise, and the last forty pages earn every earlier one.',
    recommend: 'Readers who like patient fiction and unreliable spreadsheets.',
    fictional: 'Fictional book and author, sample content.'
  },
  {
    id: 'link-esphome', type: 'link', category: 'projects', publishedAt: '2026-10-18', language: 'en',
    tags: ['open-source', 'iot'], sample: true,
    comment: 'Worth a look if your sensors live on cheap microcontrollers. Configuration instead of firmware code is the right trade for a hallway dashboard.',
    url: 'https://github.com/esphome/esphome', domain: 'github.com', linkTitle: 'esphome/esphome',
    description: 'ESPHome is a system to control your ESP32, ESP8266, BK72xx, RP2040 by simple yet powerful configuration files and control them remotely through Home Automation systems.',
    verified: true
  },
  {
    id: 'album-london', type: 'album', category: 'travel', publishedAt: '2026-10-15', language: 'en',
    tags: ['london', 'rain'], sample: true,
    title: 'Frames from London', href: 'london-guide.html', linkLabel: 'Read the London guide',
    caption: 'Wet pavements, red buses, one flag. Four frames from three rainy days.',
    place: 'London, United Kingdom',
    photos: [
      { src: 'assets/images/london-01.jpg', alt: 'Red double-decker bus passing Big Ben on a wet road', w: 960, h: 640 },
      { src: 'assets/images/london-02.jpg', alt: 'Union flag and black railings on a rainy street', w: 960, h: 640 },
      { src: 'assets/images/london-03.jpg', alt: 'Lamp light reflected on a wet pavement', w: 960, h: 640 },
      { src: 'assets/images/london-04.jpg', alt: 'Clock tower and a street lamp above the river bridge', w: 960, h: 640 }
    ]
  },
  {
    id: 'writing-ayvalik', type: 'writing', category: 'travel', publishedAt: '2026-10-12', language: 'en',
    tags: ['ayvalik', 'weekend'], sample: true,
    title: 'A long weekend in Ayvalık',
    summary: 'Three days, one rented house, olive oil bought by the litre. Itinerary, where we ate, and what we would change.',
    cover: { src: 'assets/images/trip-ayvalik.jpg', alt: 'Ayvalık harbour', w: 1400, h: 700 }
  },
  {
    id: 'project-thread', type: 'project', category: 'projects', publishedAt: '2026-10-06', language: 'en',
    tags: ['thread', 'smart-home'], sample: true,
    project: 'Smart home log', title: 'Thread border router: first impressions',
    status: 'Entry 23 / Comparing',
    changes: ['Pairing is better than Zigbee.', 'Range in a concrete building is not.'],
    next: 'Keep both networks for now.', logHref: 'smart-home.html', logLabel: 'Smart home log'
  },
  {
    id: 'project-cable-clip', type: 'project', category: 'projects', publishedAt: '2026-10-02', language: 'en',
    tags: ['3d-printing', 'petg'], sample: true,
    project: '3D printing', title: 'A clip that holds the monitor cable against the desk leg',
    status: 'Printed / Works',
    image: { src: 'assets/images/print-cable-clip.jpg', alt: 'Printed cable clip on the desk leg', w: 960, h: 720 },
    changes: ['Printed from a shared model, scaled 105%.', '40 minutes, PETG.'],
    next: 'Print two more for the second monitor.'
  },
  {
    id: 'writing-ideal-architecture', type: 'writing', category: 'work', publishedAt: '2026-09-24', language: 'en',
    tags: ['architecture', 'design-reviews', 'trade-offs'], sample: true,
    title: 'Why I stopped drawing the “ideal” architecture first', href: 'agentic-workflows.html',
    summary: 'The diagram you draw before you understand the constraints becomes the thing you defend instead of the thing you test.',
    readingMinutes: 7, art: 'architecture'
  },
  {
    id: 'note-nursery', type: 'note', category: 'family', publishedAt: '2026-09-20', language: 'en',
    tags: ['nursery'], sample: true,
    body: 'First nursery day. They walked in holding hands and did not look back. We stood outside longer than they would have liked.'
  },
  {
    id: 'milestone-twins', type: 'milestone', category: 'family', publishedAt: '2024-07', language: 'en',
    tags: ['family', 'twins'], sample: true,
    title: 'The twins arrive', dateLabel: 'July 2024',
    body: 'Two daughters, one summer, and a house that went quiet and loud at the same time. Everything I plan now starts with where they will be.',
    illustration: 'Illustration, not a family photo'
  }
];
