---
title: Naming and file conventions
impact: LOW
impactDescription: code is where a reader guesses it is
tags: naming, files
---

# Naming and file conventions

Follow the repo first. Where it has no convention:

| Thing | Name | File |
|-------|------|------|
| Component | `CandidateRow` | `CandidateRow.tsx` (or `candidate-row.tsx` in shadcn-style repos) |
| Hook | `useCandidates` | `useCandidates.ts` |
| Query options | `candidatesQueryOptions` | in the feature's `api/` file |
| Event handler prop | `onSelect` | — |
| Handler inside | `handleSelect` | — |
| Boolean | `isOpen`, `hasError`, `canEdit` | — |

Name components after what they show (`JobStatusBadge`), not how
(`BlueBadge`). No `utils.ts` / `helpers.ts` dumping grounds: a helper lives
next to the concept it serves.
