---
name: onespace-fe-structure-app
description: >
  Detect, choose, record, and apply the folder structure of a OneSpace React
  frontend (Vite SPA or Next.js App Router) so every component, hook, and API
  call is easy to find and edit. Use before placing new files or moving
  existing ones when the repo's AGENTS.md has no "Project structure" section;
  whenever the user asks to "structure the frontend", "organise the
  components", "where should this component go", "the src folder is a mess",
  "set up a new React app", or asks feature-based vs type-based folders; and as
  the first check of every onespace-fe-workflow `feature` and `refactor` task.
  Never imposes a structure silently: detects what exists, asks the user, and
  writes the decision into AGENTS.md so every later task follows it.
---

# Structure App

A frontend is easy to edit when a developer can guess where a file lives before
searching for it. That breaks when folders mix patterns (`components/` full of
pages, `pages/` full of API calls), or when an agent quietly moves code into the
layout *it* prefers. This skill makes structure an explicit, recorded decision:
detect → confirm with the user → record → apply.

`references/layouts.md` holds the concrete trees (Vite SPA, Next.js App
Router), the import rules, and the detection signals.

**Gate — when this is the task itself** (not a check inside another task):
load `onespace-fe-workflow` and run its phases 1–3 before anything else.
Invoking this skill directly (a slash command, a one-line request) is not an
exemption, and harness plan mode does not replace `plan.md`.

**Always, even inside another task:** make sure the repo is registered — the
onespace-fe block in `AGENTS.md` and the `@AGENTS.md` import in `CLAUDE.md`
(`onespace-fe-workflow`, Phase 2, "Register the pack") — and finish with the
docs sync (`onespace-fe-workflow`, Phase 7) so the README matches the code.

---

## Step 1 — Look for a recorded decision

Read the repo root `AGENTS.md`. If it has a `## Project structure` section,
**that is the structure**. Follow it and stop. Code that contradicts it is an
out-of-scope observation, not something to fix now.

## Step 2 — Detect what exists

Read `package.json` (framework, router) and the tree under `src/` (or `app/`).
Classify with the signals in `references/layouts.md`:

| Classification | Typical evidence |
|----------------|------------------|
| Feature-based | `src/features/<area>/` each with components, hooks, api |
| Type-based | top-level `components/`, `hooks/`, `services/`, `pages/` holding every feature |
| Next.js App Router | `app/` route segments with `page.tsx`, `layout.tsx`, `loading.tsx` |
| Mixed / unstructured | API calls inside components, one `components/` with 80 files, pages next to primitives, two patterns side by side |

Collect evidence as paths ("`src/components/ProjectsPage.tsx:40` calls `fetch`").
Check import direction: does a shared UI primitive import from a feature?

## Step 3 — Confirm or choose, with the user

Always ask; never decide alone.

- **Clear, consistent structure found** → "This repo is feature-based
  (evidence: …). I'll follow it. OK?"
- **Mixed or unstructured** → recommend **feature-based** (the default in
  `references/layouts.md`, in its Vite or Next.js form), with one-line
  trade-offs for the alternatives:
  1. **Feature-based** — *default.* Each business area (`projects`,
     `members`, `billing`) owns its components, hooks, and API calls;
     shared primitives live in `components/ui`. A change stays in one folder.
  2. **Type-based** — fine for small apps (under ~15 screens) that will stay small.
  3. **Next.js route-colocated** — feature code under `app/<route>/_components`;
     only when the team already works that way.

For a large repo, ask whether to migrate everything or only code touched by
current and future tasks (incremental, usually right).

When the recommendation moves code, show it first as a `structure` report
(`agent-tracking/reports/<slug>.html`, per
`onespace-fe-workflow/references/VISUAL-REPORT.md`) with a Current → Target tree
diff. The user decides on the picture.

## Step 4 — Record the decision in `AGENTS.md`

Write or update `## Project structure` at the end of the repo root `AGENTS.md`:

```markdown
## Project structure

**Stack:** Vite + React 19 + TypeScript, React Router 7, Tailwind v4, shadcn/ui, TanStack Query.
**Pattern:** Feature-based (decided YYYY-MM-DD with <name>).

**Layout**
<tree with one-line comment per folder>

**Import rules**
- features import from `components/ui`, `lib`, `hooks`; never from another feature's internals
- `components/ui` imports nothing from `features/`
- only `lib/api` talks to the network

**Where does X go**
| It … | Put it in |
|------|-----------|
| is a button, input, dialog used everywhere | `src/components/ui/` |
| is used by one feature only | `src/features/<area>/components/` |
| calls the backend | `src/features/<area>/api/` (query options + mutations) |

**Migration:** incremental — code moves into this layout when a task touches it.
```

Adapt names to what the repo already uses. Update the README's Project
structure tree to match in the same change
(`onespace-fe-workflow/references/README-STANDARD.md`). Log the decision in
`progress.md`.

## Step 5 — Apply

- **New code** goes exactly where the recorded structure says.
- **Moves** are planned, approved steps: `git mv` to keep history, update
  every import in the same step, re-run build and types. Behaviour and looks
  must not change (`onespace-fe-verify-ui` before and after).
- **Path aliases** (`@/` → `src/`) are set in `tsconfig.json` and the bundler
  config together; use the alias the repo already has.
- **README**: the structure tree and the Conventions section change in the
  same change as the files.
- Do not scaffold empty folders "for later".
