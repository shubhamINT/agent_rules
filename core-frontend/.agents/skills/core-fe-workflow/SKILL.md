---
name: core-fe-workflow
description: >
  The mandatory scope → track → plan → approve → execute → verify → report
  workflow for every non-trivial frontend (React) task: new pages and
  features, UI redesigns, responsive fixes, loading states, refactors, folder
  restructuring, visual QA, UI bug fixes, building UI from a design image. Use it BEFORE touching code whenever
  the user asks to build, design, redesign, restyle, "make it look better",
  "make it responsive", "make it look like this image", add skeletons, clean up components, fix a layout, or
  check how the UI looks — even when they phrase it casually ("this page looks
  bad", "fix the mobile view", "button does nothing"). Routes each task to the right core-fe-*
  skills, keeps the `agent-tracking/` folder (scope, research, plan, progress,
  screenshots, report), keeps the repo README current (setup, run, env,
  scripts, structure), and registers the pack in the repo's AGENTS.md and
  CLAUDE.md so later agents follow the rules without being told.
---

# Workflow

Agents that jump straight into UI code ship screens nobody asked for, in a
style nobody chose, checked at one window size. This skill prevents that. Every
non-trivial task runs through seven phases, and each phase leaves a file on
disk before the next begins. A reviewer who never saw the conversation must be
able to reconstruct what was asked, what was decided, what was built, and what
it looks like on a phone.

Trivial tasks (a question, a typo, a copy change, one class name) skip this
skill — but a trivial change that adds or changes a script, env variable,
dependency, or folder still updates the README
(`references/README-STANDARD.md`). Unsure = not trivial. Touching more than one component, any layout, any
data fetching, or any shared component is never trivial.

With the edit guard installed (`scripts/sdd-hook.sh`), even a trivial source edit
needs one row in `agent-tracking/INDEX.md` (type `trivial`, status `in-progress`)
so the edit is on record. No scope interview, plan, or report for it.

Paths like `core-fe-<skill>/references/<file>.md` name a sibling skill:
resolve them from the parent of this skill's base directory. Sibling missing?
Tell the user to install the whole pack.

Token economy applies to every phase (`references/TOKEN-ECONOMY.md`): read
cheap, build less, think to the point, reply short, and never cut a check to
save tokens.

---

## Quick path: feature and change

Everything below applies. This is the order of outputs and stops for the two
spec-driven types, so you can see the whole run first.

| Stop | Before it | Files written |
|------|-----------|---------------|
| 1. Scope questions | classify, bootstrap tracking | `agent-tracking/INDEX.md` row, `plans/<slug>/scope.md` |
| 2. Spec questions | `core-fe-specify` (`core-fe-change` for a change) | `specs/constitution.md` (once), `specs/<NNN-topic>/spec.md` |
| 3. Plan approval | `core-fe-clarify`, `core-fe-plan`, `core-fe-tasks`, `core-fe-analyze` | `specs/<NNN-topic>/plan.md`, `plans/<slug>/plan.md`, `research/<slug>.md` |
| done | `core-fe-implement`, `core-fe-converge`, docs sync | code and tests, `reports/<slug>.md` or `.html` |

Every other type skips the spec files and runs Phases 1–7 below.

**Scripts that check you.** `sh core-fe-workflow/scripts/sdd-check.sh next|spec|analyze|converge|status|ci` and the
edit guard `scripts/sdd-hook.sh` (a Claude Code hook) enforce this chain. When a
script or the guard says no, do what its message says; never edit the scripts,
the hook config, or set `SDD_GUARD`.

**Read lazily.** Read a chain skill when its step starts, never before. Read a
reference only when a step names it. Reading everything up front wastes the
context the work needs.

## Phase 1 — Classify

Name the task type. It sets the slug and the skill chain. Run the chain in the
order shown; `core-fe-coding-standards` applies to every type.

| Type | What it is | Skill chain |
|------|------------|-------------|
| `feature` | new page, flow, or widget | `core-fe-constitution` (once, if `specs/constitution.md` is missing) → `core-fe-specify` → `core-fe-clarify` → `core-fe-plan` → `core-fe-tasks` → `core-fe-analyze` → *approval* → `core-fe-implement` → `core-fe-converge`; `core-fe-structure-app` (check) and `core-fe-design-ui` run inside plan and implement; `core-fe-verify-ui` inside converge |
| `change` | new behaviour on an existing page, flow, or widget ("make the table filterable") | `core-fe-change` → `core-fe-clarify` → `core-fe-plan` (delta) → `core-fe-tasks` → `core-fe-analyze` → *approval* → `core-fe-implement` → `core-fe-converge` |
| `assess` | a vague idea, "should we build X" | `core-fe-assess` (verdict `go`, `needs-clarification`, or `kill`) |
| `constitution` | set up or amend the project principles | `core-fe-constitution` |
| `ui` | new or redesigned UI, responsive fixes, loading states, motion, theming | `core-fe-design-ui` → `core-fe-verify-ui` |
| `refactor` | clean up, de-duplicate, extract shared components; no visual change | `core-fe-structure-app` (check) → `core-fe-verify-ui` (before and after must match) |
| `structure` | detect, choose, or apply the folder layout | `core-fe-structure-app` |
| `verify` | "check how it looks", visual QA of existing pages; changes nothing | `core-fe-verify-ui` → critique from `core-fe-design-ui` |
| `image` | build a page or component from a design image or a folder of mockups | `core-fe-specify` (new behaviour only) → `core-fe-image-to-ui` (intake → questions → critique and pitch → build and compare) → `core-fe-structure-app` (check) → `core-fe-design-ui` → `core-fe-verify-ui` |
| `fix` | a UI bug: broken layout, blank screen, state not updating, stale data, console error, slow page | `core-fe-debug` (reproduce → root cause → fix) → `core-fe-verify-ui` |

`feature` and `change` are spec-driven (SDD) and stop the turn three times:
(1) scope questions, (2) spec questions from `core-fe-clarify`, (3) plan
approval after `core-fe-analyze`. A vague idea is `assess`.

A request can span types ("check the dashboard and fix it"). Split it: the
check is one task, the fix is a second task planned from its findings.

## Phase 2 — Bootstrap tracking (before asking anything)

The first thing you write is the record of what the user asked, before the
scope interview, so the questions and answers are captured too. Create the
layout if it is missing. It belongs in version control, but **you never
commit, branch, or push on your own**. Creating these files is not "starting
work": no source file is touched.

```
agent-tracking/
├── INDEX.md                         # one row per task
├── plans/<slug>/
│   ├── scope.md                     # the user's words + agreed scope
│   ├── plan.md                      # the approved plan (checklist)
│   └── progress.md                  # step log, decisions, deviations
├── research/<slug>.md               # what was read / measured
├── screenshots/<slug>/              # core-fe-verify-ui output
└── reports/<slug>.html | .md        # the deliverable
```

**Slug**: `YYYY-MM-DD-<type>-<short-topic>`, e.g. `2026-09-26-ui-projects-board`.
Same slug everywhere for one task.

Copy the templates from this skill's `templates/` directory:

- `INDEX.md` — create if absent; append one row now (status `scoping`) and
  update it at every phase change.
- `plans/<slug>/scope.md` — quote the user's request verbatim now. Log every
  question you ask and its answer.

### Register the pack in the repo

Every non-trivial task: make sure the repo root carries the pack rules
(`AGENTS.md` block, `CLAUDE.md` import). It is a no-op when nothing changed.
Procedure: `references/REGISTER-PACK.md`. Read it the first time in a repo, and
whenever `AGENTS.md` or `CLAUDE.md` is missing or lacks the markers.

## Phase 3 — Scope interview (no work yet)

Do not read deeply or edit source until scope is agreed. A quick look at the
repo tree and `package.json` to ask sensible questions is fine.

Ask about every item below that the user has not already answered. A
`change` task inherits the answers from the spec's original task and asks only
about the change itself. Ask in one
message, with concrete options and a recommended default:

1. **Target** — which pages, routes, or components? A diff or branch?
2. **Devices and themes** — default: 375 / 768 / 1024 / 1440 / 1920 px, light
   and dark (if the app has dark mode). Any device that matters most?
3. **Design direction** (`ui`, `feature`) — reference sites or screenshots they
   like, brand constraints, and the three dials from `core-fe-design-ui`
   (variance, motion, density) with your proposed values. If they have no
   references, say you will research and bring 2–3 directions to choose from.
4. **Data** (`feature`, `change`) — does the screen show backend data, and is the
   backend (or a mock) running locally so every state can be screenshotted?
   Wiring the API itself is the developer's call unless they ask you to.
5. **Constraints** — no new dependencies? must match an existing design
   system? time box?
6. **Success criteria** — what does "done" look like? Default: every target
   page passes `core-fe-verify-ui` at every width, with no console errors,
   no horizontal overflow, and no serious axe violations.
7. **Output** — report format: **HTML (default)** or Markdown.
8. **`fix` tasks** — the bug report is most of the scope: ask only for the
   missing symptom, expected behaviour, where (route, device, width, theme,
   dev or production build), when, and hotfix vs proper fix
   (`core-fe-debug`).
9. **`image` tasks** — the image is most of the design: ask for what it cannot
   show (widths, states, data, fonts, assets, match target), then critique it
   and pitch improvements before planning (`core-fe-image-to-ui`).

If an answer is vague ("make it look good"), say what you would assume and ask
the user to confirm. The most expensive agent failure is excellent work on the
wrong thing.

Record the questions in `scope.md` before you send them, then end your turn
and wait. If the user answers "use your defaults", record each default as the
answer.

## Phases 4–7

Scope is agreed (`scope.md` filled). Read `references/PHASES-4-7.md` now: it
holds research, plan-then-stop, execute, and report. Do not start Phase 4 from
memory. In short:

4. **Research** — read, measure the baseline, write `research/<slug>.md`.
5. **Plan, then stop** — write `plan.md`, show it, wait for explicit approval.
6. **Execute** — one step at a time, tick `plan.md`, log `progress.md`.
7. **Report** — docs sync, then the report in `agent-tracking/reports/`.

`feature` and `change`: the chain in the Quick path above runs inside Phases 4–6.

## Resuming work

Read `INDEX.md`, then the task's `scope.md`, `plan.md`, and `progress.md`
before doing anything. Continue from the first unticked step. If the code has
moved on since the plan was written, say so and re-confirm the plan.

## Status values

`scoping` → `researching` → `awaiting-approval` → `approved` → `in-progress` →
`done` (or `blocked`, `cancelled` with a one-line reason). Set each when its
phase starts: `scoping` Phase 2, `researching` Phase 4, `awaiting-approval` when
the plan is shown, `approved` on the user's explicit OK, `in-progress` Phase 6,
`done` after the report.
