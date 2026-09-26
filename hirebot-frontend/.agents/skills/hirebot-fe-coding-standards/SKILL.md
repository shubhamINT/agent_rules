---
name: hirebot-fe-coding-standards
description: >
  ALWAYS-ON HireBot frontend coding standard for React + TypeScript — applies to
  every component, hook, or style an agent writes or reviews, however small.
  Reuse before writing (search for an existing component first), minimal code
  (no speculative props, wrappers, or abstractions), derive instead of syncing
  state, no data fetching in useEffect, composition over boolean props, one
  component per file, semantic accessible markup, design tokens only, strict
  TypeScript, and the tools that enforce it (ESLint 9 + react-hooks with React
  Compiler rules, Prettier + Tailwind plugin, tsc, knip). Use whenever writing,
  changing, reviewing, or judging React code, and when the user says "clean
  this up", "too much code", "make it reusable", "is this good React"; it is the
  yardstick for every other hirebot-fe-* skill.
---

# Frontend Coding Standards

The best React code in a HireBot repo is the code that was not written because
a component already existed. Agents write too much: a new `Button` next to the
old one, a `useEffect` that copies props into state, a wrapper that forwards
every prop, a `utils/helpers.ts` that grows forever. Each one is small; together
they make a codebase nobody can find anything in. These rules keep the code
small, findable, and editable.

Rules live one per file in `references/rules/<prefix>-<name>.md`, each with an
impact level, a reason, and **Incorrect** / **Correct** code. Read the rule
file when a rule applies to what you are writing; the list below is the index.

Stack variance: the rules hold for Vite SPAs and Next.js App Router alike.
Where they differ (data loading, routing, `"use client"`), the rule says so.
Always use what the repo already has; `hirebot-fe-design-ui` says how to
pitch an upgrade.

---

## Rules by impact

| Impact | Rule | One line |
|--------|------|----------|
| CRITICAL | `reuse-search-first` | Search for an existing component, hook, or token before creating one |
| CRITICAL | `reuse-extend-not-fork` | Add a variant to the existing component; never copy it and tweak |
| CRITICAL | `minimal-no-speculative` | No prop, option, wrapper, or abstraction without a caller today |
| CRITICAL | `minimal-derive-state` | Compute from props/state during render; never mirror them with `useEffect` |
| HIGH | `effect-no-data-fetching` | Server data comes from the data layer (query hook, loader, server component), not `useEffect` + `useState` |
| HIGH | `effect-only-for-sync` | `useEffect` only syncs with something outside React; event logic goes in the handler |
| HIGH | `comp-composition-over-booleans` | `children` and compound parts instead of `showX`/`isY` prop piles |
| HIGH | `comp-one-per-file` | One exported component per file, named like the file, under ~200 lines |
| HIGH | `a11y-semantic-elements` | `<button>`, `<a>`, `<label>`, headings in order; never `div onClick` |
| HIGH | `a11y-focus-and-names` | Visible focus, accessible names on icon buttons, dialogs trap focus |
| MEDIUM | `state-colocate` | State lives in the lowest component that needs it; global store only for truly global state |
| MEDIUM | `state-url-for-shareable` | Filters, tabs, pagination, search live in the URL |
| MEDIUM | `render-stable-keys` | Keys are stable ids, never array index for reorderable lists |
| MEDIUM | `render-no-premature-memo` | No `useMemo`/`useCallback`/`memo` without a measured need or React Compiler off |
| MEDIUM | `render-split-routes` | Routes and heavy widgets are lazy-loaded |
| MEDIUM | `style-tokens-only` | Colours, spacing, radii, shadows, fonts come from tokens; no magic hex or px |
| MEDIUM | `style-class-merge` | Conditional classes through `cn()` (clsx + tailwind-merge) or the repo's helper |
| MEDIUM | `ts-strict-props` | `strict` on, no `any`, props typed from the data contract, no duplicated types |
| LOW | `naming-and-files` | PascalCase components, `useX` hooks, kebab or Pascal file names — whichever the repo uses |

## Before you write a component

1. Read the repo's `## Project structure` in `AGENTS.md`
   (`hirebot-fe-structure-app` if empty). New files go where it says.
2. Search: `rg -n "export (function|const) \w*<Thing>" src/` and the UI
   folder (`src/components/ui`, the shadcn folder). Found something close?
   Extend it (`reuse-extend-not-fork`).
3. Write the smallest version that does today's job. No props "for later".

## Self-review before calling it done

Read your own diff as if someone else wrote it. Each "yes" is a fix:

- Is there a component, hook, or helper in the repo that already does this?
- Does any prop, option, or branch have no caller?
- Does a `useEffect` set state from props or state, or fetch data?
- Is any file over ~200 lines, or does it export more than one component?
- Is any JSX copy-pasted with small changes (that is a variant or a map)?
- Is any colour, spacing, or font a literal instead of a token?
- Is there a `div` with `onClick`, an icon button without a name, or an `<img>`
  without `alt`?
- Is there an `any`, a `// @ts-ignore`, or a type copied by hand from the API?
- Did I leave dead code, commented-out blocks, `console.log`, or unused
  exports? (`knip` finds them.)
- Did I add or change a script, env variable, dependency, or folder without
  updating the README (`hirebot-fe-workflow/references/README-STANDARD.md`)?
- Did I invent an import, prop, or API? Check it exists in the installed
  version (`node_modules/<pkg>/package.json`, its types, or its docs).

## Tooling that enforces it

Use what the repo has. When a tool is missing, propose it in the plan; install
only after approval.

| Concern | Tool | Notes |
|---------|------|-------|
| Lint | ESLint 9 flat config + `typescript-eslint` + `eslint-plugin-react-hooks` (v6+, includes React Compiler rules) + `eslint-plugin-jsx-a11y` | Next.js: `eslint-config-next` covers React + hooks |
| Format | Prettier + `prettier-plugin-tailwindcss` | sorts Tailwind classes; do not hand-sort |
| Types | `tsc --noEmit` with `strict: true` | |
| Dead code | `knip` | unused files, exports, dependencies |
| Tests | the repo's runner (Vitest or Jest) + React Testing Library | query by role and label |

Run lint, types, and knip before the report and record the results in
`progress.md`. Do not reformat code you did not otherwise change.
