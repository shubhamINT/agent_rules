---
name: onespace-be-implement
description: >
  Build from the approved task checklist: test first for each acceptance
  criterion, tick each step, log progress, and stop when the code would diverge
  from the spec. Use after the user approves the plan, then run `onespace-be-converge`.
  Never starts without an approved plan and a clean analysis.
---

# Implement

**Gate:** the checklist at `agent-tracking/plans/<slug>/plan.md` is approved,
and `onespace-be-analyze` left no Critical or High finding. Either missing? Stop.

Engineering rules come from `onespace-be-build-feature` (security at every trust
boundary, tests through the interface, docs in the same change) and
`onespace-be-coding-standards` (load it before the first edit). Before creating any
file, load `onespace-be-busl-licence-compliance`.

## Steps

For each step in order (`onespace-be-workflow`, Phase 6):

1. If it is a behavioural `AC-n`: write its test from the spec's wording and run
   it. It must fail for the right reason. A spec with five or fewer criteria may
   write all its tests first and take one red run. A boundary test that already
   passes on existing code is allowed: log it in `progress.md` as a guard.
2. Write the smallest code that makes it pass.
3. Run the step's verification. A red step is fixed before the next starts.
4. Tick the box in `plan.md`; append to `progress.md`: what changed, why,
   commands, result.

`[P]` steps may run in parallel through the board
(`onespace-be-workflow/references/PARALLEL-AGENTS.md`).

## When the code wants to diverge from the spec

Stop. Do not "just make it work". The spec is wrong, the plan is wrong, or the
requirement changed.

- Spec wrong or silent: tell the user, run `onespace-be-change`, then resume.
- Plan wrong: edit `specs/<NNN-topic>/plan.md`, re-run `onespace-be-analyze`, tell the
  user.
- Something outside the agreed scope: record it in `progress.md` under
  Out-of-scope observations and tell the user. Do not fix it unasked.

When the last step before converge is ticked, run `onespace-be-converge`.
