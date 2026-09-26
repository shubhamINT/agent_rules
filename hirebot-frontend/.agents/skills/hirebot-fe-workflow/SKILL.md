---
name: hirebot-fe-workflow
description: >
  The mandatory scope → track → plan → approve → execute → verify → report
  workflow for every non-trivial HireBot frontend (React) task: new pages and
  features, UI redesigns, responsive fixes, loading states, refactors, folder
  restructuring, visual QA, UI bug fixes. Use it BEFORE touching code whenever
  the user asks to build, design, redesign, restyle, "make it look better",
  "make it responsive", add skeletons, clean up components, fix a layout, or
  check how the UI looks — even when they phrase it casually ("this page looks
  bad", "fix the mobile view", "button does nothing"). Routes each task to the right hirebot-fe-*
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

Paths like `hirebot-fe-<skill>/references/<file>.md` name a sibling skill:
resolve them from the parent of this skill's base directory. Sibling missing?
Tell the user to install the whole pack.

---

## Phase 1 — Classify

Name the task type. It sets the slug and the skill chain. Run the chain in the
order shown; `hirebot-fe-coding-standards` applies to every type.

| Type | What it is | Skill chain |
|------|------------|-------------|
| `feature` | new page, flow, or widget | `hirebot-fe-structure-app` (check) → `hirebot-fe-design-ui` → `hirebot-fe-verify-ui` |
| `ui` | new or redesigned UI, responsive fixes, loading states, motion, theming | `hirebot-fe-design-ui` → `hirebot-fe-verify-ui` |
| `refactor` | clean up, de-duplicate, extract shared components; no visual change | `hirebot-fe-structure-app` (check) → `hirebot-fe-verify-ui` (before and after must match) |
| `structure` | detect, choose, or apply the folder layout | `hirebot-fe-structure-app` |
| `verify` | "check how it looks", visual QA of existing pages; changes nothing | `hirebot-fe-verify-ui` → critique from `hirebot-fe-design-ui` |
| `fix` | a UI bug: broken layout, blank screen, state not updating, stale data, console error, slow page | `hirebot-fe-debug` (reproduce → root cause → fix) → `hirebot-fe-verify-ui` |

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
├── screenshots/<slug>/              # hirebot-fe-verify-ui output
└── reports/<slug>.html | .md        # the deliverable
```

**Slug**: `YYYY-MM-DD-<type>-<short-topic>`, e.g. `2026-09-26-ui-jobs-board`.
Same slug everywhere for one task.

Copy the templates from this skill's `templates/` directory:

- `INDEX.md` — create if absent; append one row now (status `scoping`) and
  update it at every phase change.
- `plans/<slug>/scope.md` — quote the user's request verbatim now. Log every
  question you ask and its answer.

### Register the pack in the repo

So that the next agent follows these rules even when nobody invokes a skill,
make sure the repo root carries them. Agents such as Codex and Cursor read
`AGENTS.md` on their own; Claude Code reads `CLAUDE.md`, which imports it.
Do this on every non-trivial task; it is a no-op when nothing changed.

1. **No `AGENTS.md`** — copy `templates/AGENTS.md` to the repo root.
2. **`AGENTS.md` without the markers** `<!-- hirebot-fe:start -->` /
   `<!-- hirebot-fe:end -->` — append the template's marked block (markers
   included) below the existing content. Add the template's
   `## Project structure` section too if the file has none.
3. **Markers present** — replace only the text between them with the
   template's current block. Never edit anything outside the markers: the
   repo's own notes and `## Project structure` belong to the repo.
4. **`CLAUDE.md`** — missing: create it containing the single line
   `@AGENTS.md`. Present without that line: append `@AGENTS.md` once at the
   end. Never rewrite the rest of it.
5. Tell the user in one line what you created or updated, and log it in
   `progress.md`. These files are left for the user to commit.

## Phase 3 — Scope interview (no work yet)

Do not read deeply or edit source until scope is agreed. A quick look at the
repo tree and `package.json` to ask sensible questions is fine.

Ask about every item below that the user has not already answered, in one
message, with concrete options and a recommended default:

1. **Target** — which pages, routes, or components? A diff or branch?
2. **Devices and themes** — default: 375 / 768 / 1024 / 1440 / 1920 px, light
   and dark (if the app has dark mode). Any device that matters most?
3. **Design direction** (`ui`, `feature`) — reference sites or screenshots they
   like, brand constraints, and the three dials from `hirebot-fe-design-ui`
   (variance, motion, density) with your proposed values. If they have no
   references, say you will research and bring 2–3 directions to choose from.
4. **Data** (`feature`) — does the screen show backend data, and is the
   backend (or a mock) running locally so every state can be screenshotted?
   Wiring the API itself is the developer's call unless they ask you to.
5. **Constraints** — no new dependencies? must match an existing design
   system? time box?
6. **Success criteria** — what does "done" look like? Default: every target
   page passes `hirebot-fe-verify-ui` at every width, with no console errors,
   no horizontal overflow, and no serious axe violations.
7. **Output** — report format: **HTML (default)** or Markdown.
8. **`fix` tasks** — the bug report is most of the scope: ask only for the
   missing symptom, expected behaviour, where (route, device, width, theme,
   dev or production build), when, and hotfix vs proper fix
   (`hirebot-fe-debug`).

If an answer is vague ("make it look good"), say what you would assume and ask
the user to confirm. The most expensive agent failure is excellent work on the
wrong thing.

Record the questions in `scope.md` before you send them, then end your turn
and wait. If the user answers "use your defaults", record each default as the
answer.

## Phase 4 — Research

Write findings to `research/<slug>.md` as you go:

- **Stack** — framework (Vite SPA, Next.js App Router, Remix, other), router,
  styling (Tailwind version, CSS modules, CSS-in-JS), component library, data
  layer, form library, test runner. Read `package.json`, the lockfile, and the
  configs. Every later decision follows what is installed.
- **Project structure** — read `## Project structure` in the repo `AGENTS.md`.
  Missing, and the task places or moves code? Run `hirebot-fe-structure-app`
  now.
- **Reuse inventory** — list the existing components, hooks, tokens, and API
  helpers that already do part of the job (`hirebot-fe-coding-standards` rule
  `reuse-search-first`). This table decides what gets built.
- **Before screenshots** — for `ui`, `refactor`, `fix`, `verify`: run
  `hirebot-fe-verify-ui` on the target pages now. These are the "before".
- **Baseline** — build, lint, type check, tests: exact commands and results.
- **README gaps** — compare the README with `references/README-STANDARD.md`
  and with reality (`package.json` scripts, `.env.example`, the folder tree).
  List what is missing or stale; the docs sync in Phase 7 fixes it.
- **Design research** (`ui`, `feature`) — per
  `hirebot-fe-design-ui/references/inspiration.md`.

If a tool the plan needs is not installed, record that and ask before
installing anything.

## Phase 5 — Plan, then stop

Write `plans/<slug>/plan.md` from `templates/plan.md`:

- goal, success criteria, and the skill chain from Phase 1
- for `ui` and `feature`: the design proposal from `hirebot-fe-design-ui`
  (design read, dials, 2–3 directions with the recommended one first, and
  what in the current UI is weak and why)
- steps as a checkbox list, each small enough to verify on its own
- files expected to change, and for each new component why no existing one fits
- the states every data view shows
  (`hirebot-fe-design-ui/references/loading-states.md`)
- the README and `AGENTS.md` sections this change will touch
- pages and widths to screenshot, and the checks that must pass
- risks and the rollback recipe (revert; any new dependency or env var to undo)

Show the plan (short summary in chat, path to the file) and **wait for
explicit approval**. "Looks good", "go ahead" count; silence and follow-up
questions do not. If the user changes the plan, edit `plan.md`, note the change
in `progress.md`, and ask again.

## Phase 6 — Execute

Before the first edit, load `hirebot-fe-coding-standards`.

Work through the checklist in order. After each step: tick the box, append to
`progress.md` (what changed, why, commands, result), and run the step's check.
A red step is fixed before the next one starts.

For UI work, screenshot as you go, not only at the end: build a section, run
`hirebot-fe-verify-ui` on it, look at every image, fix, repeat. Problems found
at 375px after the whole page is built cost a rewrite.

Something outside the approved scope (a bug next door, an ugly page you were
not asked about)? Record it in `progress.md` under "Out-of-scope observations",
tell the user, and offer ideas. Do not fix it unasked.

Delegate where it helps (`references/SUBAGENTS.md`): parallel searches for
reusable components, 2–3 design directions explored in parallel, and a
fresh-context reviewer before the report.

## Phase 7 — Verify, then report

1. **Final verify.** Run `hirebot-fe-verify-ui` on every target page at every
   agreed width and theme. Read every screenshot. A task is not done while a
   check fails or a screenshot shows a defect you would not ship.
2. **Critique.** List in chat what still looks weak and 2–3 concrete ideas to
   make it better (`hirebot-fe-design-ui`, "Critique and pitch"). The user
   decides which become follow-up tasks.
3. **Docs sync.** A developer who clones the repo tomorrow must be able to
   install, run, and find their way from the README alone. Before the report:
   - update the README per `references/README-STANDARD.md` — scripts, env
     variables, setup steps, the structure tree, and the stack must match the
     code as it now is; create the README if it is missing
   - update `## Project structure` in `AGENTS.md` if folders changed
   - refresh the marked skills block in `AGENTS.md` and the `CLAUDE.md`
     import (Phase 2, "Register the pack")
   - list every doc change in `progress.md`
4. **Report.** Write `agent-tracking/reports/<slug>.html` (or `.md`) from
   `templates/`, never to the OS temp directory, the repo root, a hosted page,
   or only to chat. Every report has: Summary, Scope and method, Current →
   Target, Changes (components reused vs added), Verification (commands and
   checks, before vs after), Screenshots, Docs updated (README and
   `AGENTS.md` sections changed), Out-of-scope observations and next tasks,
   and trace links. Follow `references/VISUAL-REPORT.md`.

Set INDEX status `done` with the report link, and give the user a short chat
summary plus the report path.

---

## Resuming work

Read `INDEX.md`, then the task's `scope.md`, `plan.md`, and `progress.md`
before doing anything. Continue from the first unticked step. If the code has
moved on since the plan was written, say so and re-confirm the plan.

## Status values

`scoping` → `researching` → `awaiting-approval` → `approved` → `in-progress` →
`done` (or `blocked`, `cancelled` with a one-line reason).
