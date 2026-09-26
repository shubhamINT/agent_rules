---
title: Colocate state
impact: MEDIUM
impactDescription: fewer re-renders, easier deletion
tags: state, context, store
---

# Colocate state

Put state in the lowest component that needs it. Lift it only when a sibling
needs it too. Reach for context or a global store (Zustand, Redux) only for
state that is truly app-wide: the signed-in user, theme, feature flags.

Server data is not client state: it lives in the query cache
(`effect-no-data-fetching`), never copied into a store.

**Incorrect:** a global `useUiStore` with `isJobFilterOpen`, used by one
component.

**Correct:** `const [open, setOpen] = useState(false)` inside `JobsFilters`.
