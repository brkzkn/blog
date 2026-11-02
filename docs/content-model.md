# Content model (for the Astro build)

One collection, `posts`, with a `type` field. The feed is the collection sorted by date; section pages are filters over it.

## Post frontmatter

```yaml
title: ""            # optional for type: note
type: note | album | writing | project | milestone | review | monthly | link   # shape of the post
category: work | projects | travel | culture | family | gear | personal      # topic of the post
date: 2026-10-30
lang: tr | en        # original language
translated: true     # a sibling file exists in the other language, same slug
tags: [kadikoy, seafood]
place:               # optional
  name: ""
  area: "Kadıköy, Istanbul"
  lat: 0
  lng: 0
photos: [./01.jpg, ./02.jpg]   # colocated with the post
cover: ./cover.jpg   # trips and writing
rating: 4            # culture only, 1–5
draft: false
```

Folder: `src/content/posts/2026/2026-10-30-kadikoy-kalamar/index.tr.md` (+ `index.en.md`). Photos live in the same folder.

## Separate collections

- `work`: case studies. Fields: client (anonymised), industry, years, role, stack, summary, sections (context, problem, constraints, decisions, boundaries, operations, outcomes, lessons).
- `gear`: one file per device. Fields: name, category (computing, audio-video, wearables, home-network, workshop, play, everyday), since, until (optional), status (in-use | retired | sold), take (one line), notes (optional body), related posts.
- `pages`: about, now.

## URL scheme

```
/                     feed
/notes/<slug>/        any post (type-independent; types are filters, not paths)
/work/  /work/<slug>/
/projects/            filtered view + project pages
/life/  /life/trips/<slug>/  /life/culture/<yyyy-mm>/
/gear/  /gear/<slug>/
/writing/  (long posts only) /writing/<slug>/
/about/  /now/
/tr/...               Turkish routes mirror the above
/rss.xml  /rss.tr.xml
```

## Publishing flow (target)

1. Write a Markdown file (phone: GitHub mobile or Obsidian + git; desktop: VS Code).
2. Push to `main`. GitHub Actions builds Astro and deploys to Pages.
3. Translation step (later): an action or local script produces the sibling language file; owner reviews before merge.
4. Email digest: the RSS feed drives a Buttondown (or Kit) digest; the subscribe form posts there.

## Home feed prototype (2026-11-01)

The prototype home feed renders `prototype/assets/js/feed-data.js` (sample entries) with `feed.js`. Shared fields: `id`, `type`, `category`, `publishedAt`, `language`, `tags`. Title, cover, rating and detail link are optional per type. Books, films, series, restaurants and devices are `review` entries with a `subject`, not separate types. The older `trip`, `food`, `home`, `print`, `culture`, `gear-added` values above are now categories or review subjects.
