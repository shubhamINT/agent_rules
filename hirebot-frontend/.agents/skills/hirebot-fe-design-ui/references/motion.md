# Motion

Motion explains change: where something came from, what just happened, what
is loading. It is never decoration. A UI a recruiter uses 200 times a day must
feel instant, so the more often an action happens, the less it animates.

## Library

- **Motion** (`motion` package, import from `motion/react`; formerly
  Framer Motion) for enter/exit (`AnimatePresence`), layout animations
  (`layout`), gestures, and springs. Check the installed package: old repos
  import from `framer-motion`; keep that import until an approved upgrade.
- **CSS transitions** for hover, focus, and colour changes. They need no
  JavaScript.
- **Tailwind `tw-animate-css`** (shadcn's default in v4 projects) for simple
  enter/exit utilities on Radix parts.
- The **View Transitions API** for route changes where the router supports it
  (React Router `viewTransition`, Next.js experimental); always behind a
  feature check.

## Timing and easing

| Change | Duration | Easing |
|--------|----------|--------|
| Hover, focus, colour | 100–150ms | ease-out |
| Button press | 100–160ms | ease-out, `scale(0.97)` on `:active` |
| Dropdown, popover, tooltip enter | 150–200ms | ease-out; exit faster (~100ms) |
| Dialog, sheet enter | 200–300ms | ease-out or a gentle spring |
| Layout change (list reorder, expand) | 200–300ms | spring (`type: "spring", bounce: 0`) |
| Page / route transition | 150–250ms | ease-out |

- UI animations stay under 300ms. Slower feels sluggish.
- Never `ease-in` for UI entering the screen: it starts slowly exactly when the
  user is waiting.
- Stagger lists by 30–60ms per item, and cap the total (animate at most the
  first ~8 items).

## What to animate

- Only `transform` and `opacity` (GPU-cheap). Never `width`, `height`, `top`,
  `left` in a loop; use Motion's `layout` for size changes.
- Scale from `0.95`, not `0`. Popovers grow from their trigger
  (`transform-origin` at the trigger; Radix sets
  `--radix-popover-content-transform-origin`).
- Skeleton shimmer: subtle, slow (1.5–2s), low contrast. Many skeletons with
  heavy shimmer look like an error.

## What not to animate

- Keyboard-driven and very frequent actions (typing, arrow-key navigation,
  toggling a checkbox in a long list).
- Content the user is trying to read (no parallax on text, no looping motion
  next to data).
- Anything on first load that delays the content appearing.

## Reduced motion

Respect `prefers-reduced-motion`: replace movement with a fade or nothing.

```tsx
import { MotionConfig } from "motion/react";

<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

In CSS: `motion-safe:` / `motion-reduce:` Tailwind variants.
