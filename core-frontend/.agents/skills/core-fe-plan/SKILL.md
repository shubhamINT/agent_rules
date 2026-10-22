---
name: core-fe-plan
description: >
  Write the technical design plan for a spec: `specs/<NNN-topic>/plan.md` with the
  constitution check, design, data model, contracts, placement, research
  decisions, complexity tracking, and rollback. Use after `core-fe-clarify`, to
  turn an approved spec into a design, and in delta mode after `core-fe-change`.
  Not the task checklist; that is `core-fe-tasks`.
---

# Plan

The spec says what. The plan says how, and it stays true after the task ends:
the next change edits it instead of rediscovering the design.

**Gate:** an approved spec with no open markers, and `specs/constitution.md`.
Either missing? Stop and run `core-fe-clarify` or `core-fe-constitution`.

Two plans exist, on purpose:

- `specs/<NNN-topic>/plan.md` (this skill): the durable design.
- `agent-tracking/plans/<slug>/plan.md` (`core-fe-tasks`): this task's approved
  checklist.

## Steps

1. Copy `templates/plan.md` to `specs/<NNN-topic>/plan.md`.
2. **Technical context**: stack and versions from the repo, not from memory.
3. **Constitution check**: answer every gate question from
   `specs/constitution.md`, yes or no. A no goes under **Complexity tracking**
   with the reason and the simpler alternative rejected. Rewrite the design
   until the gates pass, or record the violation.
4. **Design**: Run the design proposal from `core-fe-design-ui` (design read, dials, 2–3
directions, the recommended one first) and write it into **Design**. List the
states every data view shows (`core-fe-design-ui/references/loading-states.md`)
and the reuse inventory: existing components, hooks, and tokens, and for each
new component why none fits. Placement comes from the repo's recorded
`## Project structure` in `AGENTS.md` (missing: run `core-fe-structure-app`
first).
5. **Data model** and **Contracts**: entities, invariants, interfaces, error
   cases. They must trace to acceptance criteria; a field no `AC-n` needs is
   speculative, so delete it.
6. **Research decisions**: for each real choice, the options compared, the pick,
   and why. Facts about libraries come from the installed version's docs, with
   links.
7. **Rollout and rollback** per `core-fe-workflow/references/SAFE-DELIVERY.md`.
8. Tell the user in chat what the plan decides, and hand over to `core-fe-tasks`.

## Delta mode (after a change)

Edit only the sections the change touches. Add a dated line to the plan's
**Change log** naming the `AC-n` that caused it. Re-run the constitution check
on the changed parts only.
