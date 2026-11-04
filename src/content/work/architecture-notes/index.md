---
# Sample case study, ported from prototype/architecture-notes.html. Remove `sample: true` once the figures are real.
# Launch-cleanup placeholders removed from the data (kept here so the cleanup stays auditable):
#   - metric "[n]" fewer "stuck order" tickets per month (add figure)
#   - metric "[weeks]" to onboard the fifth brand (add figure)
#   - fact "Scale": "[orders/day] across four brands, peak during seasonal sales"
#   - card tile "Outcome": "Independent deploys per domain; [metric] fewer stuck orders"
title: "Rebuilding order orchestration for a multi-brand retailer"
client: "Multi-brand retailer"
industry: "Retail and e-commerce"
years: "2024 to 2025"
date: 2025-12-01
role: "Technical Architect; design lead for two squads of five"
duration: "14 months, delivered in four increments"
stack: [".NET 8", "Kafka", "PostgreSQL", "Redis", "Kubernetes on a private cloud"]
summary: "Four storefront brands shared one order service that had grown for nine years. Every team deployed to it, nobody owned it, and a failed payment callback could leave an order in a state no screen could show. The brief was not “microservices”; it was “let brands release independently and let support see what happened to an order.”"
featured: true
featuredOrder: 1
diagram: "/assets/diagrams/order-orchestration.svg"
sample: true
metrics:
  - value: "4 → 1"
    label: "deploy approvals needed for a brand-level change"
  - value: "2"
    label: "read-model rebuilds in production, both uneventful"
sections:
  context: |
    The group acquired its third and fourth brands within two years. Each came with its own storefront and its own promises to customers: next-day delivery, click and collect, split shipments. All of those promises ended up implemented as branches inside a single order service and a single shared database.

    Releases were weekly, coordinated by a release manager, and increasingly cancelled. The business case was framed around time to market for a new brand and the cost of support tickets about “orders stuck in processing.”

    ### What the business asked for

    - Brands release on their own schedule
    - Support can see an order’s full history
    - Onboard a fifth brand in under a quarter
  problem: |
    The order lifecycle was spread across synchronous calls: storefront to order service, order service to payment provider, payment provider back to a webhook, webhook to warehouse API. Any link failing left the order in whatever state the last successful call had written. There was no record of attempts, only of final states.

    Underneath that, the real problem was ownership. Pricing, stock, fulfilment and notification rules all lived in the same codebase and the same tables, so no team could change a rule without a cross-team review.
  constraints: |
    - No freeze on the daily release train
    - Legacy warehouse system stays, SOAP and all
    - Two squads, not ten
    - Private cloud only; no managed streaming
  boundaries: "Solid boxes are services the team owns. Dashed boxes are external or legacy. Arrows show the direction of commands and events, not every network call."
  decisions:
    - title: "An event log as the only integration contract"
      body: "Downstream domains subscribe to order events instead of reading order tables. Shared database access was removed by rotating credentials, not by asking nicely."
      tradeoff: "stock is eventually consistent; a nightly reconciliation job compares warehouse and order views and raises tickets for drift."
    - title: "Orchestration, not choreography, for the order saga"
      body: "A single orchestrator owns the order lifecycle so support can answer “where is this order” from one place. Choreography was tested and rejected because the failure paths were impossible to explain to the support team."
      tradeoff: "the orchestrator is a coordination point; it is stateless, horizontally scaled, and treated as the most reviewed code in the system."
    - title: "Outbox pattern from the first service"
      body: "Order writes and event publication share a transaction. A relay publishes to Kafka. No dual writes anywhere, even where it felt like overkill."
      tradeoff: "a little extra latency and one more table per service. Worth it the first time a broker was unavailable for 40 minutes."
    - title: "Strangle the monolith by brand, not by feature"
      body: "The smallest brand moved first, end to end. The monolith kept serving the other three until each moved. Feature-by-feature migration would have meant two code paths for every brand at once."
      tradeoff: "the largest brand ran on the old system for nine of the fourteen months."
  operations: |
    - **Observability.** Every event carries the order id as a trace attribute; the support console links straight to the trace.
    - **Replay.** Read models can be rebuilt from the log; this was used twice in the first quarter to fix projection bugs.
    - **Dead letters.** A small UI lists dead-lettered sagas with a one-click retry; on-call stopped needing database access.
    - **Capacity.** Seasonal sale load tested by replaying the previous year’s log at 3× speed.
  lessons: |
    What I would do differently: start the support console earlier. It became the thing that made the architecture legible to non-engineers, and it arrived in month nine. And I would push harder on removing the third payment provider instead of wrapping it.
---

<div class="panel map-lanes" style="padding: 36px; display: flex; flex-direction: column; gap: 28px; overflow-x: auto">
<div class="lane"><span class="lbl">Clients</span>
<div class="chips">
<div class="box ext">Brand A storefront</div><div class="box ext">Brand B storefront</div><div class="box ext">Brand C storefront</div><div class="box ext">Brand D storefront</div><div class="box ext">Support console</div>
</div>
</div>
<div class="vconn"></div>
<div class="lane"><span class="lbl">Order domain</span>
<div class="flow">
<div class="box core"><b>Order API</b>Accepts commands, validates, writes order + outbox in one transaction</div>
<div class="conn"></div>
<div class="box core"><b>Order store</b>PostgreSQL, one schema per service, credentials enforce the boundary</div>
<div class="conn"></div>
<div class="box hot"><b>Event log</b>Kafka. Topics per aggregate: order, payment, shipment. Retained 30 days, compacted snapshots</div>
<div class="conn"></div>
<div class="box core"><b>Orchestrator</b>Saga per order; retries with backoff; dead-letter after 5 attempts</div>
</div>
</div>
<div class="vconn"></div>
<div class="lane"><span class="lbl">Downstream domains</span>
<div class="down-grid">
<div class="box"><b>Payments</b>Wraps three PSPs; idempotent capture</div>
<div class="box"><b>Fulfilment</b>Anti-corruption layer over legacy warehouse</div>
<div class="box"><b>Notifications</b>Email, SMS, push; brand templates</div>
<div class="box"><b>Order history read model</b>Projection for support console</div>
</div>
</div>
<div class="vconn"></div>
<div class="lane"><span class="lbl">Legacy and external</span>
<div class="chips">
<div class="box ext">Warehouse (SOAP)</div><div class="box ext">PSP 1</div><div class="box ext">PSP 2</div><div class="box ext">PSP 3</div><div class="box ext">Carrier APIs</div>
</div>
</div>
</div>
