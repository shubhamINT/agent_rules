---
title: useEffect only syncs with systems outside React
impact: HIGH
impactDescription: fewer renders, logic where the reader expects it
tags: useEffect, events
---

# useEffect only syncs with systems outside React

An effect is for keeping React in sync with something external: a subscription,
a browser API, a non-React widget. Logic caused by a user action goes in the
event handler.

**Incorrect:**

```tsx
useEffect(() => {
  if (submitted) { toast.success("Saved"); navigate("/projects"); }
}, [submitted]);
```

**Correct:**

```tsx
async function handleSubmit(values: JobInput) {
  await saveJob.mutateAsync(values);
  toast.success("Saved");
  navigate("/projects");
}
```

Every effect that remains has a cleanup when it subscribes, listens, or
starts a timer.
