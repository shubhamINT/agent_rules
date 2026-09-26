<!-- onespace-fe:start -->
# OneSpace Frontend — Agent Rules

<!-- Managed by the onespace-frontend skill pack (onespace-fe-workflow, "Register
the pack"). Agents refresh the text between the onespace-fe markers; edit the
pack, not this block. Repo-specific notes go outside the markers. -->

These rules apply to every agent working in this repository: a **React +
TypeScript** frontend (Vite SPA or Next.js App Router).

> Talk first, plan first, then build. Reuse before you write. Premium, not
> plain. Nothing is done until it has been seen working at every screen size,
> and the README says how to run it.

## Load the skills before you act

This repo uses the `onespace-fe-*` skills. Before any frontend work, load
`onespace-fe-coding-standards`. For any non-trivial task, load
`onespace-fe-workflow` first; it routes to the other skills. Find them by name
(Claude Code plugin skills appear as `onespace-frontend:onespace-fe-<skill>`).

Skills not installed? Tell the user and suggest one of:

```
/plugin marketplace add shubhamINT/agent_rules
/plugin install onespace-frontend@int-agent-rules
```

```bash
npx skills add shubhamINT/agent_rules      # pick every onespace-fe-* skill
```

Until they are installed, follow the rules in this file.

## 1. Always on — every task, however small

| Always-on skill | What it guarantees |
|-----------------|--------------------|
| `onespace-fe-coding-standards` | Reuse-first, minimal React code, no fetching in effects, semantic accessible markup, tokens only, strict types |
| `onespace-fe-workflow` | Non-trivial work is recorded, scoped with the user, planned, approved, verified with screenshots, documented, and reported |
| `onespace-fe-busl-licence-compliance` | BUSL-1.1 header on every new source file, `"license": "BUSL-1.1"` in `package.json`, licence check on every new dependency, font, icon set, and image |

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
   `## Project structure` below. Empty? Run `onespace-fe-structure-app`.
6. **Verify by looking.** Every UI change is screenshotted at 375, 768, 1024,
   1440, and 1920 px in light and dark themes with `onespace-fe-verify-ui`, and
   every screenshot is read, before it is called done.
7. **Docs stay true.** Any change to scripts, env variables, dependencies,
   setup steps, or folders updates the README in the same change (install,
   run, scripts, env, structure, stack). A new developer must be able to run
   and understand the app from the README alone.
8. **Spend tokens on evidence, not words.** Search before reading, read a
   file once, trim tool output, shoot only the widths you are changing until
   the final verify. Chat replies short; files in normal prose. Never skip a
   check to save tokens (`onespace-fe-workflow/references/TOKEN-ECONOMY.md`).

## 2. Classify the task

| Task type | Examples | Skills |
|-----------|----------|--------|
| **Trivial** | a question, a typo, a copy change, one class name | Just do it (always-on rules still apply, docs included). No tracking. |
| **Feature** | "build the team members page", "add a task scheduling UI" | `onespace-fe-workflow` → `onespace-fe-structure-app` → `onespace-fe-design-ui` → `onespace-fe-verify-ui` |
| **UI** | "redesign the dashboard", "make it look premium", "fix mobile layout", "add skeletons", "add animations" | `onespace-fe-workflow` → `onespace-fe-design-ui` → `onespace-fe-verify-ui` |
| **Refactor** | "clean up components", "too much duplicate code", "make it reusable" | `onespace-fe-workflow` → `onespace-fe-structure-app` → `onespace-fe-verify-ui` |
| **Structure** | "organise the src folder", "where should this go" | `onespace-fe-workflow` → `onespace-fe-structure-app` |
| **Verify** | "check how it looks on mobile", "visual QA" | `onespace-fe-workflow` → `onespace-fe-verify-ui` → critique (`onespace-fe-design-ui`) |
| **Image** | "make it look like this", "implement designs/dashboard.png", "build the screens in ./mockups" | `onespace-fe-workflow` → `onespace-fe-image-to-ui` → `onespace-fe-structure-app` → `onespace-fe-design-ui` → `onespace-fe-verify-ui` |
| **Fix** | "layout breaks on iPad", "button does nothing", "shows old data", "infinite loop", "hydration failed", "page is slow", a pasted console error | `onespace-fe-workflow` → `onespace-fe-debug` → `onespace-fe-verify-ui` |

Unsure whether a task is trivial? Treat it as non-trivial. Touching more than
one component, any layout, any data fetching, or any shared component is never
trivial.

## 3. The non-trivial workflow

Follow `onespace-fe-workflow`. In short:

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
11. **Licence header on every new source file** (`onespace-fe-busl-licence-compliance`).
    New dependency or asset? Check its licence first; GPL/AGPL blocks the merge.

## 5. Skill index

| Skill | Kind | Use when |
|-------|------|----------|
| `onespace-fe-coding-standards` | always on | Writing, changing, or judging any React code |
| `onespace-fe-workflow` | always on | Any non-trivial task: record, scope, plan, approve, verify, docs, report |
| `onespace-fe-busl-licence-compliance` | always on | Any new file, new repo, new dependency, font, icon set, or image |
| `onespace-fe-design-ui` | task | Designing, redesigning, polishing, animating, loading states, responsive layout; critiquing UI |
| `onespace-fe-structure-app` | task | Detecting, choosing, recording, applying the folder structure |
| `onespace-fe-verify-ui` | task | Screenshotting pages at every width and theme; visual and accessibility checks |
| `onespace-fe-debug` | task | Reproducing, root-causing, and fixing UI bugs, with a regression test and screenshot proof |
| `onespace-fe-image-to-ui` | task | Building a page or component from a design image or a folder of mockups: critique first, then a measured pixel match |
<!-- onespace-fe:end -->

## Project structure

<!-- Repo-owned. Filled in by the `onespace-fe-structure-app` skill after the
user confirms the structure: stack, pattern, layout tree, import rules,
"where does X go" table, migration approach. Empty = run
`onespace-fe-structure-app` before placing or moving files. -->
