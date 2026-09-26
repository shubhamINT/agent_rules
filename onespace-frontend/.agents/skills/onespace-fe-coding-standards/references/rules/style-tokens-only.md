---
title: Tokens only for colour, spacing, radius, type
impact: MEDIUM
impactDescription: consistent look; dark mode and rebrands in one place
tags: styling, tokens, tailwind
---

# Tokens only for colour, spacing, radius, type

A hex code or pixel value in a component is a design decision nobody can find
or change. Use the tokens the repo defines (Tailwind v4 `@theme`, CSS
variables, shadcn `--primary` etc.). `onespace-fe-design-ui/references/tokens.md`
says how to add a missing one.

**Incorrect:**

```tsx
<div style={{ color: "#6b21a8", padding: 18 }} className="rounded-[7px]">
```

**Correct:**

```tsx
<div className="rounded-lg p-4 text-primary">
```

- Arbitrary Tailwind values (`p-[18px]`, `text-[#6b21a8]`) are a smell; add a
  token if the value is needed twice.
- Inline `style` only for truly dynamic values (a computed width, a CSS
  variable from data).
