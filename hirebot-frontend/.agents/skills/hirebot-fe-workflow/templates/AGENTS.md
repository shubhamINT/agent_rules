<!-- hirebot-fe:start -->
# HireBot Frontend — Agent Rules

<!-- Managed by the hirebot-frontend skill pack (hirebot-fe-workflow, "Register
the pack"). Agents refresh the text between the hirebot-fe markers; edit the
pack, not this block. Repo-specific notes go outside the markers. -->

These rules apply to every agent working in this repository: a **React +
TypeScript** frontend (Vite SPA or Next.js App Router).

> Talk first, plan first, then build. Reuse before you write. Premium, not
> plain. Nothing is done until it has been seen working at every screen size,
> and the README says how to run it.

## Load the skills before you act

This repo uses the `hirebot-fe-*` skills. Before any frontend work, load
`hirebot-fe-coding-standards`. For any non-trivial task, load
`hirebot-fe-workflow` first; it routes to the other skills. Find them by name
(Claude Code plugin skills appear as `hirebot-frontend:hirebot-fe-<skill>`).

Skills not installed? Tell the user and suggest one of:

```
/plugin marketplace add shubhamINT/agent_rules
/plugin install hirebot-frontend@int-agent-rules
```

```bash
npx skills add shubhamINT/agent_rules      # pick every hirebot-fe-* skill
```

Until they are installed, follow the rules in this file.

## 1. Always on — every task, however small

| Always-on skill | What it guarantees |
|-----------------|--------------------|
| `hirebot-fe-coding-standards` | Reuse-first, minimal React code, no fetching in effects, semantic accessible markup, tokens only, strict types |
| `hirebot-fe-workflow` | Non-trivial work is recorded, scoped with the user, planned, approved, verified with screenshots, documented, and reported |

1. **Converse before acting.** If the request is ambiguous, ask, with concrete
   options and a recommended default. Never guess scope or design direction.
2. **Plan before code** for anything non-trivial (§2). No source edits before
   the user approves the plan.
3. **Reuse before writing.** Search for an existing component, hook, or token
   before creating one.
4. **Be the design lead.** When you see UI that is weak — generic, cramped,
   inconsistent, broken on mobile — say what and why, and offer 2–3 ideas.
   Do not fix it silently outside the agreed scope.
5. **Structure first.** Before placing or moving files, read
   `## Project structure` below. Empty? Run `hirebot-fe-structure-app`.
6. **Verify by looking.** Every UI change is screenshotted at 375, 768, 1024,
   1440, and 1920 px in light and dark themes with `hirebot-fe-verify-ui`, and
   every screenshot is read, before it is called done.
7. **Docs stay true.** Any change to scripts, env variables, dependencies,
   setup steps, or folders updates the README in the same change (install,
   run, scripts, env, structure, stack). A new developer must be able to run
   and understand the app from the README alone.

## 2. Classify the task

| Task type | Examples | Skills |
|-----------|----------|--------|
| **Trivial** | a question, a typo, a copy change, one class name | Just do it (always-on rules still apply, docs included). No tracking. |
| **Feature** | "build the candidate pipeline page", "add interview scheduling UI" | `hirebot-fe-workflow` → `hirebot-fe-structure-app` → `hirebot-fe-design-ui` → `hirebot-fe-verify-ui` |
| **UI** | "redesign the dashboard", "make it look premium", "fix mobile layout", "add skeletons", "add animations" | `hirebot-fe-workflow` → `hirebot-fe-design-ui` → `hirebot-fe-verify-ui` |
| **Refactor** | "clean up components", "too much duplicate code", "make it reusable" | `hirebot-fe-workflow` → `hirebot-fe-structure-app` → `hirebot-fe-verify-ui` |
| **Structure** | "organise the src folder", "where should this go" | `hirebot-fe-workflow` → `hirebot-fe-structure-app` |
| **Verify** | "check how it looks on mobile", "visual QA" | `hirebot-fe-workflow` → `hirebot-fe-verify-ui` → critique (`hirebot-fe-design-ui`) |
| **Fix** | "layout breaks on iPad", "console error on jobs page" | `hirebot-fe-workflow` → `hirebot-fe-verify-ui` (reproduce, then prove) |

Unsure whether a task is trivial? Treat it as non-trivial. Touching more than
one component, any layout, any data fetching, or any shared component is never
trivial.

## 3. The non-trivial workflow

Follow `hirebot-fe-workflow`. In short:

1. **Record first** in `agent-tracking/plans/<slug>/scope.md` and `INDEX.md`.
2. **Scope with the user**: pages, devices and themes, design direction,
   constraints, success criteria, report format (HTML by default).
3. **Research** (stack, structure, reuse inventory, README gaps, before
   screenshots, design references), then **plan** with 2–3 design directions
   for UI work, and wait for explicit approval.
4. **Execute the approved plan only**, screenshotting as you go.
5. **Verify, critique, sync docs, report** into `agent-tracking/reports/`.

## 4. Coding rules

1. **Read before you change.** Follow the repo's patterns and recorded structure.
2. **Minimal code.** No speculative props, wrappers, or abstractions. Delete
   dead code; never leave commented-out blocks.
3. **Never invent an API.** Every import, prop, and package must exist in the
   installed version.
4. **Use what the repo has; pitch upgrades.** New dependencies only after the
   user approves.
5. **Types come from the backend contract**, never retyped by hand.
6. **No secrets in the client bundle.** Only public values in `VITE_*` /
   `NEXT_PUBLIC_*`.
7. **Every data view has loading, empty, error, and success states.** No
   full-page spinners, no blank screens.
8. **Accessible by default**: semantic elements, labels, visible focus,
   contrast, reduced motion.
9. **Do not reformat code you did not otherwise change.**
10. **No git side effects unless asked.** Do not commit, branch, push, or delete
    lockfiles.

## 5. Skill index

| Skill | Kind | Use when |
|-------|------|----------|
| `hirebot-fe-coding-standards` | always on | Writing, changing, or judging any React code |
| `hirebot-fe-workflow` | always on | Any non-trivial task: record, scope, plan, approve, verify, docs, report |
| `hirebot-fe-design-ui` | task | Designing, redesigning, polishing, animating, loading states, responsive layout; critiquing UI |
| `hirebot-fe-structure-app` | task | Detecting, choosing, recording, applying the folder structure |
| `hirebot-fe-verify-ui` | task | Screenshotting pages at every width and theme; visual and accessibility checks |
<!-- hirebot-fe:end -->

## Project structure

<!-- Repo-owned. Filled in by the `hirebot-fe-structure-app` skill after the
user confirms the structure: stack, pattern, layout tree, import rules,
"where does X go" table, migration approach. Empty = run
`hirebot-fe-structure-app` before placing or moving files. -->
