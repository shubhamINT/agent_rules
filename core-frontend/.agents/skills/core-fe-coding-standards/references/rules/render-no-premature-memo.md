---
title: No premature memoization
impact: MEDIUM
impactDescription: less noise; React Compiler handles most of it
tags: performance, memo, react-compiler
---

# No premature memoization

`useMemo`, `useCallback`, and `React.memo` add code and dependency arrays that
go stale. React Compiler memoizes automatically when the repo has it enabled
(`babel-plugin-react-compiler`, or `reactCompiler` in `next.config`).

- Compiler on: do not add manual memoization.
- Compiler off: memoize only what a profiler (React DevTools) shows is slow,
  or a value passed to a memoized child or an effect dependency.
- Fix the cause first: state placed too high (`state-colocate`) or derived
  state mirrored in effects (`minimal-derive-state`).

Very long lists (hundreds of rows) are virtualized (`@tanstack/react-virtual`),
not memoized.
