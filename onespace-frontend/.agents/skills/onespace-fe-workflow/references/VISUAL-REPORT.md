# Visual Report Guide

Every report shows **what exists now** and **what changes**, as pictures first
and prose second. A reviewer should understand the proposal from the diagrams
alone; the text only names things and records evidence.

Save every report to `agent-tracking/reports/<slug>.html` (or `.md`), the
same `<slug>` as the task's `agent-tracking/plans/<slug>/` folder. Never save
it to the OS temp directory or the repo root. Link it from the task's row in
`agent-tracking/INDEX.md`.

Every report, architecture review included, starts from
`templates/report.html` (or `templates/report.md`). It holds the header, the
legend, summary numbers, and two worked Current → Target examples (a Mermaid
flowchart and a tree diff). Other patterns below are snippets to add when they
fit. Do not add CSS frameworks (no Tailwind, no Bootstrap) or new colours. The report is a plain record; the product UI is where design effort goes.

## Standard look

Plain and readable beats decorated. The reader should see content, not design.

- White page, dark grey text, one sans-serif font, one monospace font.
- Report header on top: title, one meta line (type · date · slug), trace links,
  the legend, and a one- or two-sentence headline result.
- Numbered plain section headings with a thin accent rule. No badges, icons,
  gradients, shadows, tinted cards, or dark mode.
- Colour only where it carries meaning: severity, the legend states (problem,
  added, changed, removed), and pass/fail. Everything else is grey or black.
- Cards and panels: 1px light grey border, white inside.
- Numbers in tables right-aligned. A thin bar beside a number is fine; a chart
  is not needed when a table says it.

Two hard rules when filling the template:

- Never put a `{{placeholder}}` inside a `style=""` attribute or a Mermaid
  block. Linters read `{{0}}` as an empty CSS ruleset, and Mermaid fails to
  parse braces. Write real numbers and names there.
- Keep the template's Mermaid loader. It renders diagrams one by one with fixed
  ids; `startOnLoad: true` can give two diagrams the same id and draw one in
  the wrong panel.

## Script policy

The template's Mermaid import is the only external script. A report must
contain **no secrets, tokens, API keys, internal hostnames, or security
findings**. A security hole found during a frontend task goes in chat and to
the backend team, not here. Screenshots are linked by relative path from
`agent-tracking/screenshots/<slug>/`, never inlined as base64.

## Legend (same meaning in every report)

| Mark | Meaning |
|------|---------|
| Solid box | module |
| Thick box | deep module (small interface, large implementation) |
| Dashed line | seam |
| Red | problem: leak, violation, failing check, finding |
| Green | added |
| Amber | changed or moved |
| Grey, struck through | removed |

The legend is one line in the header (`.legend` in the template). Mermaid diagrams
use the same colours through `classDef` (see below).

## The centrepiece: Current → Target panel

An `h3` naming the change, then two bordered panels side by side labelled
"Current" and "Target" in small grey caps. Stacks to one column under 720px.
Below the panels, one card with Problem, Change, and Wins as a definition
list, plus an optional one-line ADR note.

```html
<h3>Collapse the order intake pipeline</h3>
<div class="ct">
  <figure class="panel"><figcaption>Current</figcaption><!-- diagram --></figure>
  <figure class="panel"><figcaption>Target</figcaption><!-- diagram --></figure>
</div>
<div class="card">
  <dl>
    <dt>Problem</dt><dd>one sentence</dd>
    <dt>Change</dt><dd>one sentence</dd>
    <dt>Wins</dt><dd>locality: SQL in one module · tests hit one interface</dd>
  </dl>
  <div class="adr">ADR: one line</div>
</div>
```

Every report has at least one Current → Target panel.

## Diagram patterns

Pick the simplest pattern that makes the point. One clear diagram per change
is enough; add a second only when it shows something the first cannot.

### Mermaid flowchart (dependencies, call flow)

Use it when the point is "X calls Y calls Z, and look at the mess". Colour with
the legend classes:

```html
<pre class="mermaid">
flowchart LR
  H[OrderHandler] --> V[OrderValidator] --> R[OrderRepo]
  R -. leak .-> P[PricingClient]
  classDef bad fill:#fef2f2,stroke:#dc2626,color:#991b1b
  classDef add fill:#ecfdf5,stroke:#059669,color:#065f46
  classDef chg fill:#fffbeb,stroke:#d97706,color:#92400e
  classDef del fill:#fff,stroke:#6b7280,color:#6b7280,stroke-dasharray:4 4
  classDef deep fill:#fff,stroke:#1f2937,stroke-width:3px
  class R,P bad
</pre>
```

### Mermaid sequence diagram (round trips, request flow)

Good for "before: 6 round trips; after: 1" and for showing a new feature's
request path end to end. Use `rect rgb(236,253,245)` blocks to tint the added
steps green.

### Hand-built boxes (when Mermaid's layout fights you)

Modules as `<span class="box">` in a `.row`, joined by plain `→`. Modifiers:
`.add`, `.chg`, `.bad`, `.del`. `.box.deep` is the thick-bordered deep module;
put its interface on the first line and the internal parts as plain `.box`
items inside it.

```html
<div class="row"><span class="box">PriceCalc</span> → <span class="box bad">DiscountUtil</span> → <span class="box del">PricingFacade</span></div>
<div class="box deep"><code>price(order) → Money</code>
  <div class="row"><span class="box">tax</span><span class="box">discount</span><span class="box">rounding</span></div></div>
```

### Cross-section (layered shallowness)

A vertical list of `.box` items, one per layer a call passes through.
Current: six boxes each doing nothing. Target: one `.box.deep` named after the
consolidated responsibility.

### Mass diagram (interface as wide as implementation)

A small table per side: module, public functions (interface), lines of
implementation. Current: the two numbers are close (shallow). Target: few
public functions, many lines behind them (deep).

### Call-graph collapse

Current: nested `.box` tree of function calls. Target: the same tree folded
into one `.box.deep`, the now-internal calls shown faded inside it.

### Tree diff (folder structure)

A `<pre class="tree">` per side. Wrap paths in `<span class="add">`,
`<span class="chg">`, `<span class="del">`, or `<span class="bad">`, and the
reason in `<span class="why">`.

```html
<pre class="tree">src/
├── <span class="del">routes.py</span>   <span class="why"># 900 lines, SQL in handlers</span>
└── <span class="add">orders/</span>
    ├── <span class="add">router.py</span>
    ├── <span class="add">service.py</span>
    └── <span class="add">repository.py</span></pre>
```

### Metrics table (before / after numbers)

A table with Metric, Before, After, and Δ columns. Numbers right-aligned
(`td.num`). Δ is `.better` (green) or `.worse` (red). An optional thin `.bar`
under the After value, width = After / larger value as a real percentage.

```html
<tr><td>Functions over complexity 10</td><td class="num">14</td>
  <td class="num">3<span class="bar" style="width:21%"></span></td><td class="num better">−11</td></tr>
```

### Screenshot grid (every UI change)

The `.shots` grid in the template: one `<figure>` per screenshot from
`onespace-fe-verify-ui`, caption `<width> · <theme>`. For a redesign, show
before and after as two rows of the same viewports. Mark a screenshot that
shows a defect with a red caption (`class="fail"`) and say what is wrong.

## What each report type shows

| Type | Required visuals | Optional |
|------|------------------|----------|
| feature, ui | Current → Target component tree with added parts green; screenshot grid (5 widths, both themes) | before/after screenshot rows; metrics table (bundle size, lines +/−) |
| refactor | Current → Target component or module graph; metrics table (lines +/−, duplicate components removed, lint/type errors); screenshots proving nothing changed visually | call-graph collapse |
| structure | Current → Target tree diff; import-direction graph with rule violations red | table "where does X go" |
| verify | screenshot grid; checks table (console errors, overflow, axe) per page and width | — |

## Markdown fallback

Same sections, same order. Mermaid goes in fenced ` ```mermaid ` blocks, which
GitHub, GitLab, and most IDE previews render. Put Current and Target as two
consecutive blocks under `### Current` and `### Target`. Metrics are the same
Before / After / Δ table. Tree diffs become two fenced text
blocks with `+`, `~`, `-` prefixes. Screenshots go in a table as
`![](../screenshots/<slug>/<file>.png)`.

## Style

- Follow "Standard look" above. When in doubt, remove decoration, never content.
- Diagrams carry the weight. Problem and change are one sentence each. If a
  diagram needs a paragraph to be understood, redraw the diagram.
- Name things the way the code does: component, hook, route, query key.
- The page must work at 375px width with no horizontal page scroll; wide
  diagrams and tables scroll inside their own container.
