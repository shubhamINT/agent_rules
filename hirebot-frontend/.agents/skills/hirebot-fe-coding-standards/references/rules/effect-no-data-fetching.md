---
title: No data fetching in useEffect
impact: HIGH
impactDescription: caching, dedupe, race-free loading, and skeletons for free
tags: data, useEffect, tanstack-query
---

# No data fetching in useEffect

Hand-rolled `useEffect` + `useState` fetching has race conditions, no cache,
no retry, no dedupe, and usually no loading or error UI. Use the data layer the
repo has.

**Incorrect:**

```tsx
const [jobs, setJobs] = useState([]);
useEffect(() => {
  fetch("/api/jobs").then((r) => r.json()).then(setJobs);
}, []);
```

**Correct (SPA with TanStack Query):**

```tsx
const { data: jobs, isPending, error } = useQuery(jobsQueryOptions(filters));
```

**Correct (Next.js App Router):** fetch in the server component, or prefetch on
the server and hydrate the query client; the client component reads the cache.

The repo has no data layer yet? Pitch one (TanStack Query) in the plan
instead of adding another hand-rolled fetch; the developer decides.
