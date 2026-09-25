# AGENTS.md — OneSpace Backend Engineering Rules

These rules apply to every agent working in this repository. They cover backend
services written in **Python** (FastAPI, async, uv) and **Node.js** (TypeScript,
Express / Fastify). Skills are installed as a Claude Code plugin, with
`npx skills`, or by copying `.agents/skills/`, so find each one by name. Read
the ones named here before you act.

> Talk first, plan first, then build. Simple, clean, verified code beats clever
> code. Tools enforce style; you enforce correctness, security, and scope.

---

## 1. Always on — every task, however small

These apply to everything, including trivial edits and questions.

| Always-on skill | What it guarantees |
|-----------------|--------------------|
| `onespace-be-coding-standards` | Clean code, style, module design, the self-review for AI-generated code, and the **bug and smell radar** |
| `onespace-be-busl-licence-compliance` | Licence header on every new file, BUSL-1.1 manifest, licence check on every new dependency |
| `onespace-be-workflow` | Non-trivial work is recorded, scoped with the user, planned, and approved before any code changes |

Always-on behaviour:

1. **Converse before acting.** Understand what the user wants. If the request is
   ambiguous, ask — offer concrete options with a recommended default. Never
   guess scope.
2. **Plan before code** for anything non-trivial (§2). No source edits before
   the user approves the plan.
3. **Bug and smell radar.** While reading code for any reason, watch for bugs,
   security holes, and bad code. Explain each one to the user in plain terms —
   what, where (`file:line`), why it matters, how to fix it (name the fix or
   refactoring). Record it. Do not silently fix anything outside the agreed
   scope; offer a follow-up task. Report security holes immediately.
4. **Structure first.** Before placing or moving code, read the
   `## Project structure` section at the end of this file. If it is empty, run
   `onespace-be-structure-service`: detect the current structure, confirm it with the user,
   and record it there.
5. **Help the user understand.** Explain decisions and findings so a developer
   new to the code could follow and apply them. Prefer showing the fix over
   describing it.

## 2. Classify the task

| Task type | Examples | Skills |
|-----------|----------|--------|
| **Trivial** | answer a question, fix a typo, rename one variable, explain code | Just do it (always-on rules still apply, radar included). No tracking. |
| **Feature** | "add an endpoint", "support X", "integrate Y" | `onespace-be-workflow` → `onespace-be-build-feature` |
| **Refactor** | "clean this up", "this code is a mess", "restructure", "reduce duplication" | `onespace-be-workflow` → `onespace-be-refactor-code` |
| **Code audit** | "review this code", "check for bad code", "find bugs", "review what the AI wrote" | `onespace-be-workflow` → `onespace-be-audit-code` |
| **Security audit** | "security audit", "find vulnerabilities", "is this safe", "OWASP check" | `onespace-be-workflow` → `onespace-be-audit-security` |
| **Tests** | "add tests", "raise coverage", "fix the failing suite" | `onespace-be-workflow` → `onespace-be-write-tests` |
| **Debug** | "this returns 500", "flaky test", "worked yesterday", "users see wrong data", "it's slow", a pasted stack trace | `onespace-be-workflow` → `onespace-be-debug` |
| **Structure** | "structure this repo", "where should this go", "which architecture" | `onespace-be-workflow` → `onespace-be-structure-service` |
| **Health endpoint** | "add a health check", "readiness probe" | `onespace-be-workflow` → `onespace-be-add-health-endpoint` |

Unsure whether a task is trivial? Treat it as non-trivial. A change that touches
more than one file, any trust boundary (auth, input parsing, external calls,
secrets), or any public interface is never trivial.

## 3. The non-trivial workflow (mandatory)

Follow the `onespace-be-workflow` skill. In short:

1. **Record first.** Create `agent-tracking/` if missing and write the user's
   request verbatim to `agent-tracking/plans/<slug>/scope.md`, plus a row in
   `agent-tracking/INDEX.md`. Everything after — questions, answers, research,
   plan, progress, report — lands in the same folder.
2. **Scope with the user.** Ask until it is unambiguous: which paths, how deep,
   what is out of scope, constraints, success criteria, and the report format
   (**HTML by default, or Markdown**). Log questions and answers in `scope.md`.
   Reports are visual: a Current → Target diagram for every change
   (`onespace-be-workflow/references/VISUAL-REPORT.md`). Audit and security reports load no
   external scripts.
3. **Research**, then **plan**: write `plan.md`, show it, and wait for explicit
   approval.
4. **Execute the approved plan only.** Log each step in `progress.md`. New scope
   found mid-task: stop, record it, ask.
5. **Report** into `agent-tracking/reports/` and update `INDEX.md`.

**Think like the senior engineer on call for it.** Features get a system design
pass (`onespace-be-build-feature/references/system-design.md`): concurrency,
idempotency, failure modes, limits, compatibility — sized to the real risk.
Every code change ships in small reversible steps with a concrete rollback
(`onespace-be-workflow/references/SAFE-DELIVERY.md`).

**Use subagents where they add independence or parallelism**
(`onespace-be-workflow/references/SUBAGENTS.md`): read-only `investigator`s for
audit fan-out and debugging hypotheses, a `test-writer` that writes tests from
the contract, and a fresh-context `reviewer` before every report. Brief a
general-purpose subagent with the role text from `SUBAGENTS.md`. Verify what
they return.

`agent-tracking/` belongs in version control, but the user commits it — see rule 12.

## 4. Coding rules

1. **Read before you change.** Never edit code you have not read. Follow the
   repo's existing patterns and recorded structure.
2. **Simplest thing that works.** No speculative abstractions, config options, or
   layers "for later". Delete dead code; never leave commented-out blocks.
3. **Never invent an API.** Every import, package, function, method, flag, and
   config key must exist in the installed version. Verify in the lockfile and
   the package source or official docs. Never add a dependency you have not
   confirmed exists under that exact name.
4. **Handle errors explicitly.** No bare `except:` / empty `catch {}`. Fail
   closed at trust boundaries; degrade gracefully only where the contract says so.
5. **Validate all external input** (bodies, headers, query params, files, env,
   upstream responses) with a schema: pydantic (Python) or zod (Node).
6. **No secrets in code, logs, errors, or tests.** One settings module reads the
   environment; `.env.example` lists every variable with safe placeholders.
7. **Every outbound call has a timeout. Every query is parameterised. Every
   resource-scoped read checks ownership.**
8. **Tests ship with the change** and pass offline. Coverage floor 80%; never
   lower it, never loosen an assertion to go green.
9. **Licence header on every new source file** (`onespace-be-busl-licence-compliance`).
10. **Docs stay true.** README endpoint, env, and structure sections change in
    the same change as the code.
11. **Do not reformat code you did not otherwise change.** Keep diffs reviewable.
12. **No git side effects unless asked.** Do not commit, branch, push, or delete
    lockfiles. Leave changes in the working tree for the user to review.

## 5. Language baselines

| | Python | Node.js |
|--|--------|---------|
| Runtime | Python 3.12+, `uv` | Node 24 LTS, TypeScript `strict` |
| Style guide | Google Python Style Guide | Google TypeScript Style Guide |
| Format + lint | Ruff (`ruff format`, `ruff check`) | Prettier + ESLint 9 flat config + typescript-eslint |
| Types | mypy or pyright, strict on new code | `tsc --noEmit`, no `any` |
| Security lint | Ruff `S` rules, Semgrep | eslint-plugin-security, Semgrep |
| Dependencies | `pip-audit` | `npm audit` / `pnpm audit` |
| Secrets | gitleaks | gitleaks |
| Complexity | Ruff `C901`, max 10 | ESLint `complexity`, max 10 |
| Tests | pytest (`onespace-be-write-tests`) | vitest (`onespace-be-write-tests`) |

Every section of the Google Python, TypeScript and JavaScript style guides is
indexed (enforced by tool / rule / OneSpace override) in
`references/{python,typescript,javascript}-style.md` of the
`onespace-be-coding-standards` skill; the full guides are bundled in its
`references/google/`.

## 6. Skill index

| Skill | Kind | Use when |
|-------|------|----------|
| `onespace-be-coding-standards` | always on | Writing, changing, or judging any code |
| `onespace-be-busl-licence-compliance` | always on | Any new file, new repo, new dependency |
| `onespace-be-workflow` | always on | Any non-trivial task: record, scope, plan, approve, report |
| `onespace-be-build-feature` | task | Building new behaviour |
| `onespace-be-refactor-code` | task | Changing structure without changing behaviour; architecture review |
| `onespace-be-audit-code` | task | Finding bugs, bad code, weak tests, AI-generated-code failures |
| `onespace-be-audit-security` | task | Finding vulnerabilities (OWASP, ASVS, CWE) |
| `onespace-be-write-tests` | task | Writing or fixing tests; coverage |
| `onespace-be-debug` | task | Reproducing, root-causing, and fixing bugs, flaky tests, slowness |
| `onespace-be-structure-service` | task | Detecting, choosing, recording, applying the project structure |
| `onespace-be-add-health-endpoint` | task | Adding or fixing `GET /health` |

---

## Project structure

<!-- Filled in per repository by the `onespace-be-structure-service` skill, after the user
confirms the structure: pattern, layout tree, dependency rules, "where does X
go" table, terms, migration approach. Empty = run `onespace-be-structure-service` before
placing or moving code. -->
