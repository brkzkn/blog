---
title: Why I stopped drawing the “ideal” architecture first
type: writing
category: work
date: 2026-10-24
lang: en
tags: [design process, ADRs, trade-offs, software architecture]
alt: ["Lead image: a whiteboard with a diagram, half erased"]
sample: true
---
For most of my first decade in software, the first thing I did on a new system was draw the target architecture. A clean diagram, boxes with good names, arrows that only went one way. It felt like the responsible thing to do, and it was always wrong in the same way: it described a system for a company with no history, no existing contracts, and no people.

## The diagram comes too early

The problem is not the diagram. It is the order. Drawn first, the diagram becomes a commitment. Every constraint discovered later is a deviation from it, and deviations feel like failures. You end up negotiating with your own picture instead of with reality.

> The ideal architecture is not a starting point. It is the thing you would arrive at if the constraints turned out not to exist. They always exist.

## What I do instead

I now start with three lists, in this order: what cannot change (contracts, regulations, the legacy system that will outlive us all), what the business needs to be true in a year, and what the teams can realistically operate. Only then do I draw, and the first drawing is of the system as it is, not as I want it.

The target diagram still gets drawn. It arrives around week three, and it is usually less ambitious and more useful than the one I would have drawn on day one.

## A worked example

On the order orchestration rebuild I wrote about in the <a class="link" href="/work/architecture-notes/">case study</a>, the day-one diagram would have had a clean event-driven core and no warehouse SOAP service anywhere in sight. The constraint list put the warehouse at the top. The architecture that shipped has an anti-corruption layer wrapped around it, and that layer is the reason the migration finished.

<pre tabindex="0" role="region" aria-label="Code example: the three lists"># The three lists, as I actually keep them
constraints:   # cannot change in this project
  - warehouse SOAP API (contract until 2027)
  - PCI scope stays with the payment team
needs:         # must be true in 12 months
  - brands deploy independently
  - support sees full order history
capacity:      # what we can operate
  - 2 squads, on-call rotation of 6</pre>

## Where this fails

Greenfield work with a small team and no legacy. There, the early diagram is cheap and the constraints are mostly imaginary. Draw it. Everywhere else, make the lists first.

If you keep architecture decision records, this maps neatly onto them: the constraints list becomes the context section of the first ADR, and the target diagram becomes the decision of the third or fourth.
