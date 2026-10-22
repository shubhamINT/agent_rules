# Phases 4–7

Paths are relative to the workflow skill folder.

## Phase 4 — Research

Write findings to `research/<slug>.md` as you go:

- **Stack** — framework (Vite SPA, Next.js App Router, Remix, other), router,
  styling (Tailwind version, CSS modules, CSS-in-JS), component library, data
  layer, form library, test runner. Read `package.json`, the lockfile, and the
  configs. Every later decision follows what is installed.
- **Project structure** — read `## Project structure` in the repo `AGENTS.md`.
  Missing, and the task places or moves code? Run `onespace-fe-structure-app`
  now.
- **Reuse inventory** — list the existing components, hooks, tokens, and API
  helpers that already do part of the job (`onespace-fe-coding-standards` rule
  `reuse-search-first`). This table decides what gets built.
- **Before screenshots** — for `ui`, `refactor`, `fix`, `verify`: run
  `onespace-fe-verify-ui` on the target pages now. These are the "before".
- **Baseline** — build, lint, type check, tests: exact commands and results.
- **README gaps** — compare the README with `references/README-STANDARD.md`
  and with reality (`package.json` scripts, `.env.example`, the folder tree).
  List what is missing or stale; the docs sync in Phase 7 fixes it.
- **Design research** (`ui`, `feature`) — per
  `onespace-fe-design-ui/references/inspiration.md`.

If a tool the plan needs is not installed, record that and ask before
installing anything.

## Phase 5 — Plan, then stop

Write `plans/<slug>/plan.md` from `templates/plan.md`:

- goal, success criteria, and the skill chain from Phase 1
- `feature` and `change`: `Spec: specs/<NNN-topic>/spec.md`; every `AC-n` is
  covered by a step, and each step names the `AC-n` it serves. `onespace-fe-plan`
  writes the durable design to `specs/<NNN-topic>/plan.md`; `onespace-fe-tasks`
  writes this checklist; `onespace-fe-analyze` must pass before you ask for approval
- for `ui` and `feature`: the design proposal from `onespace-fe-design-ui`
  (design read, dials, 2–3 directions with the recommended one first, and
  what in the current UI is weak and why)
- steps as a checkbox list, each small enough to verify on its own. Mark steps
  that touch different files and do not depend on each other `[P]`, so parallel
  agents can claim them
- files expected to change, and for each new component why no existing one fits
- the states every data view shows
  (`onespace-fe-design-ui/references/loading-states.md`)
- the README and `AGENTS.md` sections this change will touch
- pages and widths to screenshot, and the checks that must pass
- risks and the rollback recipe (revert; any new dependency or env var to undo)

Show the plan (short summary in chat, path to the file) and **wait for
explicit approval**. "Looks good", "go ahead" count; silence and follow-up
questions do not. If the user changes the plan, edit `plan.md`, note the change
in `progress.md`, and ask again. On approval, write exactly
`**Status:** approved (YYYY-MM-DD, by <name>)` as the second line of `plan.md`
and set INDEX status `approved`. The edit guard (`scripts/sdd-hook.sh`) and
`scripts/sdd-check.sh ci` read that line and the INDEX row.

## Phase 6 — Execute

Before the first edit, load `onespace-fe-coding-standards`; before creating any
file, adding a dependency, or adding a font, icon set, or image, load
`onespace-fe-busl-licence-compliance`.

Work through the checklist in order. After each step: tick the box, append to
`progress.md` (what changed, why, commands, result), and run the step's check.
A red step is fixed before the next one starts.

For UI work, screenshot as you go, not only at the end: build a section, run
`onespace-fe-verify-ui` on it, look at every image, fix, repeat. Problems found
at 375px after the whole page is built cost a rewrite.

Something outside the approved scope (a bug next door, an ugly page you were
not asked about)? Record it in `progress.md` under "Out-of-scope observations",
tell the user, and offer ideas. Do not fix it unasked.

Delegate where it helps (`references/SUBAGENTS.md`): parallel searches for
reusable components, 2–3 design directions explored in parallel, and a
fresh-context reviewer before the report (a separate pass when there are no
subagents or the diff is under about 50 lines).

**More than one agent editing this repo at once** (parallel sessions, an
orchestrator with workers, subagents that write files)? Coordinate through
`agent-tracking/board/` with `scripts/board.sh`
(`references/PARALLEL-AGENTS.md`): turn plan steps into tasks, claim before
you edit, lock the files you touch, never wait by re-reading code, and
`leave` when done. The last agent out removes the board.

## Phase 7 — Verify, then report

1. **Final verify.** Run `onespace-fe-verify-ui` on every target page at every
   agreed width and theme. Read every screenshot. A task is not done while a
   check fails or a screenshot shows a defect you would not ship.
2. **Critique.** List in chat what still looks weak and 2–3 concrete ideas to
   make it better (`onespace-fe-design-ui`, "Critique and pitch"). The user
   decides which become follow-up tasks.
3. **Docs sync.** A developer who clones the repo tomorrow must be able to
   install, run, and find their way from the README alone. Before the report:
   - update the README per `references/README-STANDARD.md` — scripts, env
     variables, setup steps, the structure tree, and the stack must match the
     code as it now is; create the README if it is missing
   - update `## Project structure` in `AGENTS.md` if folders changed
   - refresh the marked skills block in `AGENTS.md` and the `CLAUDE.md`
     import (Phase 2, "Register the pack")
   - `feature` and `change`: `onespace-fe-converge` sets the spec's `Status` and
     change log and updates `specs/<NNN-topic>/plan.md` if the design changed
   - list every doc change in `progress.md`
4. **Report.** Delete every template comment and every section marked for
   other task types. Write `agent-tracking/reports/<slug>.html` (or `.md`) from
   `templates/`, never to the OS temp directory, the repo root, a hosted page,
   or only to chat. Every report has: Summary, Scope and method, Current →
   Target, Changes (components reused vs added; for `feature` and `change`, a
   **Spec vs code** table from `onespace-fe-converge`; done only on verdict
   `Converged`), Verification (commands and
   checks, before vs after), Screenshots, Docs updated (README and
   `AGENTS.md` sections changed), Out-of-scope observations and next tasks,
   and trace links. Follow `references/VISUAL-REPORT.md`.

Set INDEX status `done` with the report link, and give the user a short chat
summary plus the report path.

---
