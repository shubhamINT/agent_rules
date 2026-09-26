---
title: Derive values during render; never mirror state
impact: CRITICAL
impactDescription: removes a whole class of stale-state bugs and extra renders
tags: state, useEffect, derived
---

# Derive values during render; never mirror state

If a value can be computed from props or other state, compute it while
rendering. Copying it into state with `useEffect` renders twice and goes stale.

**Incorrect:**

```tsx
const [visible, setVisible] = useState<Job[]>([]);
useEffect(() => {
  setVisible(jobs.filter((j) => j.status === status));
}, [jobs, status]);
```

**Correct:**

```tsx
const visible = jobs.filter((j) => j.status === status);
```

Expensive and measured slow? `useMemo` (or let React Compiler do it). Need to
reset state when a prop changes? Give the component a `key`:
`<CandidateForm key={candidate.id} candidate={candidate} />`.
