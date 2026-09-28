---
title: One exported component per file, named like the file
impact: HIGH
impactDescription: every component is findable by file name
tags: structure, files
---

# One exported component per file, named like the file

A developer looking for `MemberRow` should find `MemberRow.tsx` (or
`member-row.tsx`, whichever the repo uses). Files that export several
components, or grow past ~200 lines, hide code.

- One exported component per file. Small private helpers used only by it may
  stay in the same file.
- Over ~200 lines, or more than one clear job: split by responsibility
  (`ProjectsPage` → `JobsFilters`, `JobsTable`, `JobsEmptyState`).
- A component's hook, types, and test sit next to it, or in the folder the
  recorded structure names.
- No `index.ts` barrels inside feature folders unless the repo already uses
  them; they slow the bundler and hide where code lives.
