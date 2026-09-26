---
title: Visible focus and accessible names
impact: HIGH
impactDescription: keyboard users can use the app at all
tags: a11y, focus, aria
---

# Visible focus and accessible names

- Never remove the focus ring without a replacement:
  `outline-none` must come with `focus-visible:ring-2 focus-visible:ring-ring`.
- Icon-only buttons have a name: `<Button size="icon" aria-label="Close">`.
- Images have `alt` (empty `alt=""` for decoration).
- Dialogs, sheets, and menus trap focus and return it on close. Radix / shadcn
  primitives do this; hand-rolled overlays usually do not
  (`reuse-search-first`).
- Colour is never the only signal: a failed status has an icon or text too.
- Respect `prefers-reduced-motion` (`onespace-fe-design-ui/references/motion.md`).
- Text contrast at least 4.5:1 (3:1 for large text). `onespace-fe-verify-ui`
  runs axe to check.
