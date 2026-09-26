---
title: Shareable state lives in the URL
impact: MEDIUM
impactDescription: back button, reload, and shared links work
tags: state, url, router
---

# Shareable state lives in the URL

Filters, search text, sort, tabs, pagination, and the open item in a
master-detail view belong in the URL. Users reload, press Back, and paste
links to colleagues; component state loses all of that.

Use the router the repo has: `useSearchParams` (React Router, Next.js),
TanStack Router's typed search params, or `nuqs` if it is installed.

**Incorrect:** `const [status, setStatus] = useState("open")` for the jobs
filter.

**Correct (React Router):**

```tsx
const [params, setParams] = useSearchParams();
const status = params.get("status") ?? "open";
```

Debounce text search before writing it to the URL.
