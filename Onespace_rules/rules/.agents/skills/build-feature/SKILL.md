---
name: build-feature
description: >
  How to add new behaviour to a OneSpace Python (FastAPI) or Node.js
  (TypeScript) backend service the right way: agreed acceptance criteria, the
  right layer, a small deep interface, tests first, security at every trust
  boundary, docs and licence in the same change. Use whenever the user asks to
  build, add, implement, integrate, or support something new — "add an
  endpoint", "build a webhook", "integrate Stripe", "support CSV export", "new
  job that…" — after scope and plan are agreed through workflow.
---

# Feature Development

A feature is done when it does what was agreed, is tested through its
interface, is safe at its trust boundaries, sits in the right place, and the
docs say it exists. Code that works on the happy path is roughly a third of that.

Prerequisite: `workflow` phases 1–3. This skill supplies phases 4–7.

## Phase 4 — Research

1. **Acceptance criteria** — confirm from scope: inputs, outputs, error cases,
   who may call it and see what, limits (size, rate, time). Write them as a
   numbered list in `scope.md`; each becomes at least one test.
2. **Read the neighbourhood** — the repo's recorded structure (`AGENTS.md` →
   `## Project structure`; if missing, run `structure-service` first), the closest existing
   feature of the same kind (a similar route, a similar upstream client), and its
   tests. The new feature copies that shape unless there is a reason not to.
3. **Reuse before writing** — search for existing helpers, clients, models,
   error types, and fixtures that already do part of the job.
4. **External facts** — for any library or upstream API involved, read the
   docs for the **installed** version and record the relevant bits with links in
   `research/<slug>.md`. Never code against a remembered API (`audit-code/references/ai-generated-code.md` §1).
5. **Baseline** — run tests, lint, types; record results.

## Phase 5 — Design and plan

Design the interface first, in `plan.md`:

- **HTTP surface**: method, path, auth, request schema, response schema (in the
  service's envelope), every status code.
- **Placement**: which files in which folder, exactly as the recorded project
  structure's "where does X go" table says. HTTP handlers stay HTTP-only;
  business logic and data access go where the structure puts them.
- **Module interface**: smallest interface that covers the acceptance criteria
  (`coding-standards/references/module-design.md`: deep modules, no speculative seams — one adapter is not a
  seam; production + test fake is two).
- **Data**: new collections/tables/fields, indexes, migrations (reversible).
- **Config**: new env vars with defaults, added to the settings module and `.env.example`.
- **Security**: trust boundaries crossed and the control for each (see below).
- **Tests**: list them, mapped to acceptance criteria.
- **Docs**: README sections that change.

Steps in `plan.md` are ordered so each ends green. Get approval.

## Phase 6 — Build

1. **Tests first where the behaviour is clear**: write the failing test for the
   next acceptance criterion, make it pass with the least code, repeat. At
   minimum every criterion has a test by the end of the step that implements it.
2. **Smallest change at the right layer.** Routes validate, delegate, shape the
   response. Business rules in the domain. I/O in services, behind a function
   that condenses the upstream response at the boundary.
3. **Security controls by default** at every boundary the feature crosses:
   - authentication on the route, and **ownership / role checks on every resource access**
   - schema validation with unknown fields rejected (pydantic `extra="forbid"` / zod `.strict()`)
   - parameterised queries; no shell; no dynamic code
   - timeouts on outbound calls; limits on sizes, page lengths, concurrency
   - secrets only from config; never logged or returned
   - errors through the central handler; no internals in responses
4. **No new dependency** unless the plan approved it — then verify it exists, is
   maintained, licence-compatible, and regenerate `THIRD_PARTY_LICENSES.md`.
5. **Licence header** on every new file (`busl-licence-compliance`).
6. **Docs in the same change**: README endpoint table, env table, structure
   tree, data stores; docstrings / JSDoc on public functions.
7. Log each step in `progress.md`.

## Phase 6b — Self-review before calling it done

- The AI-generated-code self-review in `coding-standards` (all eight checks).
- `audit-security` checklist items for every trust boundary the feature touched.
- `coding-standards` checklist.
- Gates: formatter, linter, type checker, full test suite, coverage ≥ 80%, BUSL
  `--check`. All green, no new ignores.

## Phase 7 — Report

`workflow` report template. Feature-specific content: what was built
(mapped to acceptance criteria), the interface (routes / functions / events),
files added and changed, tests added (mapped to criteria), config and data
changes, verification results before/after, known limits and follow-ups.
