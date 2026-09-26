# Design Read

How to turn a design image into numbers and a component list before writing
code. Guessing values while building is what makes a page "almost" match: a
16px gap built as 20px, repeated across a page, is a visible drift. Measure
once, write it down, then build from the read.

All values are in **CSS px at the design width**: divide image pixels by the
device pixel ratio (a 2880px-wide image at 2× means 1px in CSS = 2px in the
image).

## 1. Layout and grid

- Page width, content max-width, and outer margins.
- Columns and gutters: count the columns the content aligns to (12 is common;
  dashboards often use a sidebar plus a fluid area).
- Regions top to bottom: header, hero or toolbar, content, footer. Give each
  a name; the plan's steps follow these names.
- Sticky or fixed parts (header, sidebar, action bar).

## 2. Spacing scale

Measure the gaps between repeated elements: card padding, gaps between cards,
section spacing, and label-to-field distance. Snap them to a scale (4px or 8px
based). When two measurements are 1–2px apart, they are the same token: the
difference is anti-aliasing or a sloppy mockup. Map the scale to the repo's
spacing tokens (Tailwind's `p-4` = 16px); list values the repo lacks.

## 3. Type scale

For each text style (display, h1–h3, body, small, label, numeric):
size, weight, line height, letter spacing, case, colour. Identify the
typeface by its letterforms (the `g`, `a`, `R`, and digits). If it cannot be
identified with confidence, say so and propose the closest licensed match.

## 4. Colour

Start from `palette.json` (`compare.mjs --palette`): it lists the dominant
colours with their share of the image. Assign roles: background, surface,
border, text primary and secondary, primary action, accent, and status
colours (success, warning, danger). Near-duplicate colours (`#0f172a` and
`#0f1833`) are anti-aliasing; keep one. Check text and background pairs for
WCAG AA contrast (4.5:1 body, 3:1 large text) and flag failures in the
critique. Map each role to an existing token or propose a new one in the
theme.

## 5. Shape, depth, and detail

Border radius per element type, border width and colour, shadow (offset,
blur, colour, opacity), dividers, and icon style (outline or filled, stroke
width, size). Match icons to the repo's icon set (lucide by default); note any
icon without an equivalent.

## 6. Component inventory

One row per distinct piece of UI in the image:

| Piece in the image | Region | Existing component | Action |
|--------------------|--------|--------------------|--------|
| Top navigation | header | `AppHeader` | reuse |
| Stat card ×4 | overview | `Card` | new `StatCard` composed from `Card` |
| Filter pills | toolbar | `ToggleGroup` | reuse, new `pill` variant |
| Activity table | content | `DataTable` | reuse |

Search before filling the "Existing" column (`reuse-search-first`). A new
component needs a one-line reason no existing one fits.

## 7. What the image does not say

List every open question the image leaves: widths not shown, states not
shown, interactions (what opens on click), real data length (names longer
than the placeholder, 0 items, 10,000 items), and assets whose source is
unknown. These feed the questions in SKILL.md Step 2 and the critique in
Step 4.
