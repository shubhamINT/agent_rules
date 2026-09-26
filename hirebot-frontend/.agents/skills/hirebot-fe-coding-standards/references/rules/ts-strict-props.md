---
title: Strict TypeScript and contract-derived props
impact: MEDIUM
impactDescription: type errors caught at build time, not by users
tags: typescript, types
---

# Strict TypeScript and contract-derived props

- `strict: true`. No `any`; use `unknown` and narrow. No `@ts-ignore`; use
  `@ts-expect-error` with a reason only when a library's types are wrong.
- API types come from the backend contract (generated from OpenAPI with the
  repo's generator, or a shared schema), never retyped by hand.
- Derive component types from those: `Pick<Job, "id" | "title">`,
  `ComponentProps<typeof Button>`.
- Props are a `type` next to the component. Export it only when a caller needs
  it.

**Incorrect:**

```ts
interface Job { id: any; title: string; status: string } // hand-copied, loose
```

**Correct:**

```ts
import type { components } from "@/lib/api/schema";
type Job = components["schemas"]["Job"];
```
