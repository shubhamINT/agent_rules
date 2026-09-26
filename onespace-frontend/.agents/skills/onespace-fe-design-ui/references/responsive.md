# Responsive Design

Every screen works, and looks designed, at every width from 320px to 2560px.
"Works" means no horizontal page scroll, no clipped text, no overlapping
elements, and every action reachable by touch. "Looks designed" means each
width has a layout chosen for it, not a desktop layout squeezed.

## Widths

| Name | Test width | Tailwind prefix (min-width) | Typical device |
|------|------------|------------------------------|----------------|
| Mobile | 375 (also 320 for the smallest) | base (no prefix) | phones |
| Large mobile | — | `sm` 640 | large phones landscape |
| Tablet | 768 | `md` 768 | iPad portrait |
| Laptop small | 1024 | `lg` 1024 | iPad landscape, small laptops |
| Laptop | 1440 | `xl` 1280 | most laptops |
| Wide | 1920 | `2xl` 1536 | desktop monitors |

`onespace-fe-verify-ui` screenshots 375, 768, 1024, 1440, and 1920 by default.

## Mobile first

Write the base classes for the phone, then add `md:`, `lg:` for wider
screens. Base styles that assume a desktop and then undo themselves at small
widths (`max-*` everywhere) are a sign the layout was not designed for mobile.

```tsx
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
```

## Layout per device

| Element | Mobile | Tablet | Laptop / wide |
|---------|--------|--------|---------------|
| App navigation | top bar + bottom tab bar or a sheet (`Sheet` / `vaul` drawer) | collapsible sidebar (icons only) | full sidebar |
| Data table | card list, or the table scrolls inside its own container with the first column sticky | table with fewer columns | full table |
| Filters | a "Filters" button opening a sheet | inline, wrapping | inline bar |
| Master–detail | list, then the detail as a new route or full-screen sheet | list + detail side by side if it fits | side by side |
| Forms | one column, full-width inputs, sticky submit | one or two columns | two columns max; never wider than ~720px |
| Dialogs | full-screen or bottom drawer | centred dialog | centred dialog |
| Page content | full width with 16px gutters | 24px gutters | `max-w-screen-xl` or `max-w-7xl`, centred |

## Component-level responsiveness

Use container queries when a component's layout depends on the space it gets,
not the viewport (a card in a sidebar vs in the main column):

```tsx
<div className="@container">
  <div className="flex flex-col gap-2 @md:flex-row @md:items-center">
```

Tailwind v4 has container queries built in; v3 needs `@tailwindcss/container-queries`.

## Details that break on real devices

- **Touch targets** at least 44×44px for primary actions, never under 24×24px
  (WCAG 2.2). Pad icon buttons, do not only enlarge the icon.
- **Hover** is not available on touch. Actions shown only on hover must also be
  reachable another way (always visible on mobile, or a "more" menu). Gate
  hover styles with `@media (hover: hover)` when they would stick on tap
  (Tailwind v4 `hover:` already does this).
- **Viewport height:** use `dvh`/`svh` (`min-h-dvh`), not `100vh`, which hides
  content behind mobile browser bars.
- **Safe areas:** fixed bottom bars add `pb-[env(safe-area-inset-bottom)]`.
- **Inputs:** 16px font size minimum on mobile, or iOS zooms the page. Use the
  right `type` and `inputMode` (`email`, `tel`, `numeric`) for the keyboard.
- **Long content:** long names, emails, and URLs `truncate` or `break-words`;
  test with the longest realistic value, not "John".
- **Images and media:** set `aspect-ratio` or width/height to avoid layout
  shift; responsive `srcset` (or `next/image`).
- **Type:** fluid headings with `clamp()`, e.g.
  `text-[clamp(1.75rem,1.2rem+2vw,3rem)]` — or a token for it.
- **Wide screens:** cap line length (~65–75 characters) and content width;
  use the extra space for a second column, not for stretching.
- **Orientation:** check a phone in landscape (e.g. 844×390) for fixed headers
  that eat the screen.

## Checklist before calling it responsive

- [ ] No horizontal page scroll at 320, 375, 768, 1024, 1440, 1920.
- [ ] Navigation usable at every width.
- [ ] Every action reachable by touch.
- [ ] Tables and wide content scroll inside their own container, or reflow.
- [ ] Text readable without zoom; no clipped or overlapping text.
- [ ] Layout at 1920 uses the space well, and does not stretch.
