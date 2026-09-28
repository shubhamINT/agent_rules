---
title: Merge conditional classes with cn()
impact: MEDIUM
impactDescription: no conflicting classes, readable conditions
tags: styling, tailwind, clsx
---

# Merge conditional classes with cn()

Build conditional class names with the repo's helper, usually
`cn()` = `clsx` + `tailwind-merge` in `src/lib/utils.ts` (shadcn). It removes
conflicting utilities so a caller's `className` wins.

**Incorrect:**

```tsx
<div className={"px-4 " + (active ? "bg-primary " : "") + className}>
```

**Correct:**

```tsx
<div className={cn("px-4", active && "bg-primary", className)}>
```

Components that render a root element accept `className` and merge it last.
