---
title: Extend the existing component; never copy and tweak
impact: CRITICAL
impactDescription: one source of truth per UI element
tags: reuse, variants, cva
---

# Extend the existing component; never copy and tweak

When an existing component is almost right, add a variant or accept
`children`. Copying it to change one colour creates a fork that never gets the
next fix.

**Incorrect:**

```tsx
// DangerButton.tsx — a copy of Button.tsx with bg-red-600
export function DangerButton(props: ButtonProps) { /* 40 copied lines */ }
```

**Correct:** add the variant where the variants live (`cva` in shadcn).

```tsx
const buttonVariants = cva("inline-flex items-center …", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
  },
});
```

A shared component needs a change that would break its other callers? Check the
callers first (`rg -n "<Button" src/`). If the needs really differ, compose a new
component from the shared one; do not copy its internals.
