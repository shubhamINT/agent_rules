---
title: Use semantic elements
impact: HIGH
impactDescription: keyboard, screen-reader, and SEO support without extra code
tags: a11y, html
---

# Use semantic elements

The browser gives `<button>`, `<a>`, `<label>`, `<nav>`, `<main>`, and
headings keyboard and screen-reader behaviour for free. A `div` with `onClick`
needs it all rebuilt, and usually is not.

**Incorrect:**

```tsx
<div className="btn" onClick={() => shortlist(id)}>Shortlist</div>
<div onClick={() => navigate(`/projects/${id}`)}>{title}</div>
```

**Correct:**

```tsx
<Button onClick={() => shortlist(id)}>Shortlist</Button>
<Link to={`/projects/${id}`}>{title}</Link>
```

- A click that changes the URL is a link. A click that does something is a
  button.
- One `h1` per page; headings do not skip levels.
- Every input has a `<label>` (or `aria-label` when a visible label is truly
  impossible).
- Never block paste, and never disable zoom (`user-scalable=no`).
