// Sample teasers shown on /work/ in the design preview only (PUBLIC_PREVIEW !== 'false'): case studies that
// do not exist yet. They are not content-collection entries (no page, no frontmatter rules) and never ship at
// launch (docs/roadmap.md, launch cleanup). Each diagram is an SVG under public/assets/diagrams/.
export const sampleTeasers = [
  { kicker: 'Fintech, 2023', title: 'A ledger service that regulators could audit without asking us', summary: 'Append-only postings, deterministic replay, and a reporting read model rebuilt nightly. The hard part was convincing teams to stop updating balances in place.', tags: ['Event sourcing', 'CQRS', 'PostgreSQL'], diagram: '/assets/diagrams/ledger-replay.svg' },
  { kicker: 'Logistics, 2022', title: 'Moving a courier platform off nightly batch into near real time', summary: 'Change data capture from the legacy database, a thin streaming layer, and a strict rule: nobody writes to the old schema from the new side.', tags: ['CDC', 'Kafka Connect', 'Strangler fig'], diagram: '/assets/diagrams/courier-cdc.svg' },
  { kicker: 'Platform, 2021', title: 'An internal platform so teams could stop writing their own deployment scripts', summary: 'Golden paths on Kubernetes, paved roads for observability, and a deliberate choice to make the easy path the compliant one.', tags: ['Kubernetes', 'GitOps', 'OpenTelemetry'], diagram: '/assets/diagrams/platform-golden-path.svg' },
  { kicker: 'Media, 2020', title: 'Personalisation at the edge without a data lake rewrite', summary: 'A small feature store, cache-first delivery, and a boundary that kept the recommendation team from blocking the content team.', tags: ['Redis', 'gRPC', 'Feature flags'], diagram: '/assets/diagrams/edge-personalisation.svg' },
];
export const sampleNotes = [
  { num: 'ADR', title: 'Outbox before you need it', text: 'Why I add the outbox table on day one of any service that publishes events.', kind: 'Decision record' },
  { num: 'ADR', title: 'One database per service, enforced by credentials', text: 'Boundaries that live in a diagram erode; boundaries that live in IAM do not.', kind: 'Decision record' },
  { num: 'Map', title: 'A system map template I keep reusing', text: 'Four layers, two kinds of arrows, and a legend that fits on one line.', kind: 'Template' },
  { num: 'Note', title: 'What “operational concerns” actually means in a design review', text: 'A checklist of the questions that only get asked after the first incident.', kind: 'Checklist' },
];
