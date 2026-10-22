---
name: onespace-fe-specify
description: >
  Write the persistent spec for a new page, flow, or widget: `specs/<NNN-topic>/spec.md`, which
  says what it does and why, with numbered testable acceptance criteria and
  open questions marked. Use whenever the user asks to build, add, or implement
  something new — "add a team members page" — after scope is agreed through
  `onespace-fe-workflow`. Not for changing an existing page, flow, or widget (use `onespace-fe-change`), and not for
  refactors, audits, security reviews, debugging, or test work.
---

# Specify

`agent-tracking/` records what an agent did. A spec records what the system does
now. It outlives the task: the next change starts from it, and a new developer
reads it instead of reverse-engineering code.

<gate>
`onespace-fe-workflow` is loaded (do not re-read it); scope must be agreed (`scope.md`). Missing
`specs/constitution.md`? Run `onespace-fe-constitution` first, or tell the user and note
it in `progress.md` if they decline.
</gate>

**The rule:** behaviour starts at the spec. Never write code first and the spec
afterward.

Idea still fuzzy, or the user asks "should we build this"? Run `onespace-fe-assess`
first. This skill starts when the answer is `go`.

## Layout

```
specs/
├── constitution.md
└── 001-team-members/
    ├── spec.md        # this skill
    └── plan.md        # onespace-fe-plan
```

`NNN` is the next free number: scan `specs/` for folders named `NNN-*`, take the
highest, add one, zero-pad to three digits. This skill never creates a branch or
commits; the user chooses the branch.

## Steps

1. Get the folder name from `sh onespace-fe-workflow/scripts/sdd-check.sh next <topic>` (never count by hand). Copy
   `templates/spec.md` to `specs/<that-name>/spec.md`.
2. Fill it from the user's request and the agreed scope. The spec says **what**
   and **why**. It never names a component library, hook, route file, or CSS class; those belong in the plan. A named external standard (RFC, ISO) is fine.
3. Acceptance criteria are numbered `AC-1`, `AC-2`, ... and testable.
   Each criterion is a user action and an observable result. Cover, or write
   `N/A — reason` for:

   - the happy path
   - the states: loading, empty, error, partial data, offline or slow network
   - validation messages and how the user recovers
   - keyboard use, focus order, and screen-reader names
   - behaviour at 375, 768, 1024, 1440, and 1920 px

   A design image or link goes under **Design reference**; `onespace-fe-image-to-ui`
   handles the pixel match. The spec names the image; it does not describe pixels.
4. Anything you would have to guess goes under **Open questions** as
   `[NEEDS CLARIFICATION: ...]`. Never fill a gap with an assumption.
5. Add the spec path to `scope.md` (row `Spec`). Acceptance criteria live in the
   spec only; do not copy them into `scope.md`.
6. Run `sh onespace-fe-workflow/scripts/sdd-check.sh spec specs/<NNN-topic>`; fix every CRITICAL and HIGH line. Set
   `Status: draft`. `onespace-fe-clarify` sets `approved` once the user approves the
   spec; `onespace-fe-converge` sets `implemented`.
7. Hand over to `onespace-fe-clarify`.
