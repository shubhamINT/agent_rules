---
title: Lazy-load routes and heavy widgets
impact: MEDIUM
impactDescription: smaller first load, faster first paint
tags: performance, bundle, lazy
---

# Lazy-load routes and heavy widgets

Users download only what the first screen needs.

- Vite SPA: route-level `lazy()` (React Router `lazy`, TanStack Router
  `lazyRouteComponent`, or `React.lazy` + `Suspense`).
- Next.js: routes split automatically; use `next/dynamic` for heavy client-only
  widgets (charts, editors, maps).
- Import heavy libraries only where they are used, never from a shared barrel.
- Import icons one by one (`import { Search } from "lucide-react"`).

The `Suspense` fallback is a skeleton shaped like the page
(`hirebot-fe-design-ui/references/loading-states.md`), not a spinner.
