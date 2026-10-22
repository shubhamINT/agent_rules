---
name: onespace-be-tasks
description: >
  Turn a spec and its design plan into the ordered task checklist: test-first,
  each step mapped to an acceptance criterion, independent steps marked `[P]`.
  Writes it into `agent-tracking/plans/<slug>/plan.md`. Use after `onespace-be-plan`.
  The list is then checked by `onespace-be-analyze` and approved by the user.
---

# Tasks

**Gate:** `specs/<NNN-topic>/spec.md` and `specs/<NNN-topic>/plan.md` exist.

Write the checklist into `agent-tracking/plans/<slug>/plan.md` from
`onespace-be-workflow/templates/plan.md`: goal, `Spec:` line, steps, files expected to change,
verification, risks. This is the approved checklist the workflow's Phase 5
stops on.

## Rules for the steps

1. **Order**: setup and shared foundations first, then one slice per
   acceptance criterion, then docs and the final converge step. Each slice is
   independently verifiable; the first slice is the smallest working behaviour.
2. **Test-first**: inside a slice, the failing test comes before the code.
3. **One `AC-n` per step.** Write it at the start of the step. Setup and docs
   steps carry `setup` or `docs` instead, and the final step carries `converge`.
   A step with none of these is unrequested
   work; delete it.
4. **Exact paths and commands.** Each step names the files it touches and the
   command that verifies it.
5. **`[P]`** marks steps that touch different files and do not depend on each
   other, so parallel agents can claim them
   (`onespace-be-workflow/references/PARALLEL-AGENTS.md`).
6. The last step is always: run `onespace-be-converge`.
7. Under `**Spec:**` write `**Covers:** AC-1, AC-2, ...`: the criteria this task
   owns. A feature owns every criterion; a change owns only the ones it adds or
   changes. `sdd-check.sh` checks coverage against this line, and `ci` checks that
   the tasks together cover every active criterion.

Hand over to `onespace-be-analyze`.
