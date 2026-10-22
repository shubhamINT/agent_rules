# Core Agent Rules — Backend (Python + Node.js)

General backend rules for any Python or Node.js service. A drop-in rule pack
that makes coding agents (Claude Code, Codex, Cursor, and any tool that reads
`AGENTS.md` + `.agents/skills/`) work the way a careful senior engineer would:

- **scope first** — the agent asks what to cover before it touches anything
- **plan first** — a written plan, approved by you, before any code change
- **traceable** — scope, research, plan, progress log, and final report are
  written to `agent-tracking/` and committed
- **standards-based** — Clean Code, SOLID, Google Python / TypeScript style
  guides, Fowler's refactoring catalog, OWASP Top 10:2025, OWASP API Top 10,
  OWASP ASVS 5.0, CWE Top 25, OWASP LLM Top 10
- **tool-enforced** — Ruff, mypy/pyright, ESLint 9 + typescript-eslint,
  Prettier, Semgrep, gitleaks, pip-audit, npm audit

It covers three main jobs: **building features** (spec first, see below), **refactoring bad code**, and
**security-auditing existing code** — plus test campaigns and code-quality audits.

## Contents

```
core-backend/
├── .claude-plugin/plugin.json                  # Claude Code plugin manifest
├── README.md                                   # this file
└── .agents/skills/
    │  always on
    ├── core-be-coding-standards/           # clean code, full Google style guides + section index, module design, bug radar, AI self-review, tooling
    ├── core-be-workflow/                   # record → scope → plan → approve → execute → report
    │   ├── references/                         # VISUAL-REPORT (diagrams), SAFE-DELIVERY (rollout/rollback), SUBAGENTS (roles, briefs), TOKEN-ECONOMY (lean context), PARALLEL-AGENTS (shared board)
    │   ├── templates/                          # AGENTS.md (repo rules block), INDEX, scope, research, plan, progress, report (.md + .html)
    │   └── scripts/                           # board.sh (multi-agent board), sdd-check.sh (validator), sdd-hook.sh (edit guard), install-hook.sh, test-sdd.sh
    │  tasks
    ├── core-be-constitution/              # specs/constitution.md: principles with yes/no gate questions; amend with approval
    ├── core-be-assess/                    # idea to verdict: go / needs-clarification / kill
    ├── core-be-explain/                   # read-only trace of how code works; one HTML page with diagrams
    ├── core-be-init/                       # set up or repair a repo: AGENTS.md / CLAUDE.md, tracking, constitution, project brief
    ├── core-be-specify/                   # new feature: specs/<NNN-topic>/spec.md, numbered acceptance criteria
    ├── core-be-change/                    # existing feature: edit the spec first, then plan the delta
    ├── core-be-clarify/                   # resolve open questions in a spec
    ├── core-be-plan/                      # durable design plan with constitution check
    ├── core-be-tasks/                     # test-first checklist, each step mapped to an AC, [P] for parallel
    ├── core-be-analyze/                   # read-only check: constitution, spec, plan, tasks agree
    ├── core-be-implement/                 # build from the approved checklist, test first
    ├── core-be-converge/                  # code vs spec table; Converged / Not converged loop
    ├── core-be-build-feature/              # building new behaviour + system design pass
    ├── core-be-refactor-code/              # behaviour-preserving refactors + architecture review
    ├── core-be-audit-code/                 # bugs, bad code, weak tests, AI-generated-code failure patterns
    ├── core-be-audit-security/             # OWASP / ASVS / CWE audit, scanners, per-language checks
    ├── core-be-write-tests/                # pytest + vitest, offline mocks, 80% floor
    ├── core-be-debug/                      # reproduce → hypotheses → root cause → fix + regression test
    ├── core-be-structure-service/          # detect / choose / record / apply project structure
    └── core-be-add-health-endpoint/        # GET /health contract, per-stack references
```

Each skill is a folder with a `SKILL.md` and, where needed, `references/`
(detail loaded on demand), `templates/`, or `scripts/`. Everything a skill needs
is inside `core-backend/` — nothing points outside it.

## Which skill for which task

You do not have to name a skill. Describe the task; `core-be-workflow` classifies it and runs
the chain. Skill names below drop the `core-be-` prefix.

| You say | Task type | Skills, in order | You get |
|---------|-----------|------------------|---------|
| "add CSV export", "build a webhook", "integrate Stripe" | `feature` | `workflow` → `constitution` (once) → `specify` → `clarify` → `plan` → `tasks` → `analyze` → you approve → `implement` → `converge` | `specs/<NNN>/spec.md` and `tasks.md`, the tracking record, a report |
| "limit it to 10k rows", "change how login works", "drop support for Y" | `change` | `workflow` → `change` → `clarify` → `plan` (delta) → `tasks` → `analyze` → you approve → `implement` → `converge` | the spec edited first with a change-log row, then code and a report |
| "should we build X?", a fuzzy idea | `assess` | `workflow` → `assess` | `specs/assessments/<slug>.md` with a verdict: go, needs-clarification, or kill |
| "how does X work?", "walk me through this" | `explain` | `workflow` → `explain` | `agent-tracking/reports/<slug>.html`: flow diagram, `file:line` evidence, where code and spec disagree |
| "set up this repo", "start a new project", messy `AGENTS.md` | `init` | `workflow` → `init` → first feature through `specify` | clean `AGENTS.md` + `CLAUDE.md` import, `specs/constitution.md`, approved `specs/project.md` |
| "set up SDD", "project principles" | `constitution` | `workflow` → `constitution` | `specs/constitution.md` |
| "clean this up", "this code is a mess" | `refactor` | `workflow` → `refactor-code` | behaviour-preserving changes and a report; no spec |
| "review this code", "find bad code" | `audit` | `workflow` → `audit-code` | a report; no spec |
| "security audit", "is this safe?", "OWASP check" | `security` | `workflow` → `audit-security` | a report; no spec |
| "add tests", "raise coverage" | `test` | `workflow` → `write-tests` | tests and a report |
| "this returns 500", "flaky test", a stack trace | `debug` | `workflow` → `debug`; if the spec was wrong or silent, `change` first | a root-cause fix, a regression test, a report |
| "where should this go?", "structure this repo" | `structure` | `workflow` → `structure-service` | the recorded `## Project structure` in `AGENTS.md` |
| "add a health check" | `health` | `workflow` → `add-health-endpoint` | `GET /health` |

`core-be-coding-standards` and `core-be-workflow` are always on. `core-be-build-feature` supplies the engineering rules that `plan` and `implement` call. A trivial edit (a question, a typo) skips the workflow, but with the
edit guard installed it still needs one `trivial` row in `agent-tracking/INDEX.md`.

## Build with SDD (spec-driven development)

`agent-tracking/` is history. For new behaviour the agent also keeps durable
files that say what the system does now. All are committed with the code.

| File | Holds | Skill |
|------|-------|-------|
| `specs/constitution.md` | project principles, each with a yes/no gate question | `core-be-constitution` |
| `specs/<NNN-topic>/spec.md` | what and why, numbered acceptance criteria (`AC-1`, ...), change log | `core-be-specify`, `core-be-change` |
| `specs/<NNN-topic>/plan.md` | the design: constitution check, data, contracts, decisions, rollback | `core-be-plan` |
| `specs/assessments/<slug>.md` | idea verdict: `go`, `needs-clarification`, `kill` | `core-be-assess` |

**New feature:** `core-be-specify` → `core-be-clarify` → `core-be-plan` → `core-be-tasks` →
`core-be-analyze` → you approve → `core-be-implement` → `core-be-converge`.

**Change to an existing feature:** `core-be-change` edits the spec first and logs it,
then `core-be-clarify` → `core-be-plan` (only the delta) → `core-be-tasks` → `core-be-analyze` →
you approve → `core-be-implement` → `core-be-converge`. Code is never edited first.

**Bug:** `core-be-debug` checks the spec. The spec states the behaviour: the
regression test cites that `AC-n`. The spec was wrong or silent: it routes to
`core-be-change` first.

**Done** means `core-be-converge` returned `Converged`: every `AC-n` has passing
evidence, no code does what the spec never asked for, the constitution holds.
After three rounds without it, the agent stops and asks you.

No spec for refactors, audits, security reviews, debugging, or test work, which
change no behaviour. Nothing creates a branch or commits; review the specs with
the code.

## Enforcement (hooks, validator, CI)

Skills are advice; these make the workflow hard to skip, whichever model runs.

| Piece | Where | What it does |
|-------|-------|--------------|
| `sdd-check.sh` | `core-be-workflow/scripts/` | `next`, `spec`, `analyze`, `converge`, `status`, `ci`, `doctor`: deterministic checks on the spec, plan, task, and INDEX files. Exit 1 on CRITICAL or HIGH. Used by the skills and by CI. |
| `sdd-hook.sh` | `core-be-workflow/scripts/` | Claude Code hook. Blocks a source edit without an approved task (a `feature` or `change` also needs its spec first). Blocks stopping an in-progress `feature` or `change` before `Verdict: Converged`. |
| `hooks/hooks.json` | plugin root | Wires the hook up. Installed with the plugin; nothing to configure. |
| `sdd-check.yml` | `core-be-workflow/templates/` | Sample GitHub Actions job running `sdd-check.sh ci`. |
| `install-hook.sh` | `core-be-workflow/scripts/` | Registers the hook in `.claude/settings.json` for `npx skills` and manual installs. |
| `test-sdd.sh` | `core-be-workflow/scripts/` | Self-check for the two scripts: `sh scripts/test-sdd.sh`. |

**Without the plugin** (`npx skills` or manual copy) the hook is not installed. Run
the installer once, from the project root, as you (not the agent; it edits
`.claude/settings.json`):

```bash
sh .claude/skills/core-be-workflow/scripts/install-hook.sh            # npx skills with Claude Code
sh .agents/skills/core-be-workflow/scripts/install-hook.sh            # manual copy
sh .claude/skills/core-be-workflow/scripts/install-hook.sh --dry-run  # show the result, write nothing
```

It merges the `PreToolUse` and `Stop` entries into `.claude/settings.json`: other
settings and hooks stay, an invalid file is left untouched, the old file is backed
up as `settings.json.bak-<time>`, and a second run changes nothing. It needs
`python3`, and it refuses to run from a skills folder outside the project (a plugin
install already has the hook). Prefer to edit by hand? Add the same entries:

```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Write|Edit|MultiEdit|NotebookEdit",
      "hooks": [{ "type": "command", "command": "sh",
        "args": ["-c", "[ -f \"$1\" ] && exec sh \"$1\"; exit 0", "sdd-hook",
                  "${CLAUDE_PROJECT_DIR}/.claude/skills/core-be-workflow/scripts/sdd-hook.sh"] }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "sh",
        "args": ["-c", "[ -f \"$1\" ] && exec sh \"$1\"; exit 0", "sdd-hook",
                  "${CLAUDE_PROJECT_DIR}/.claude/skills/core-be-workflow/scripts/sdd-hook.sh"] }] }]
  }
}
```

(Use `.agents/skills/` in the path for a manual copy. Write `${CLAUDE_PROJECT_DIR}` with
braces: Claude Code does not expand the bare form. The `sh -c` wrapper makes a missing
script a no-op instead of a block.) Check with `/hooks` in Claude Code that both entries show up. The validator works
without the hook: `sh <skills dir>/core-be-workflow/scripts/sdd-check.sh status`. For CI, copy
`core-be-workflow/templates/sdd-check.yml` to `.github/workflows/`; it needs the scripts in the
repo (`npx skills` or manual copy).

**Limits.**
- The hook sees `Write`, `Edit`, `MultiEdit`, and `NotebookEdit`. Source written through Bash
  (`sed -i`, redirects) is not seen; CI and the Stop hook catch the outcome.
- A model can add its own INDEX row to pass the guard. Rows are an audit trail, and
  `sdd-check.sh ci` re-checks every approved row against its plan and spec.
- Hooks run only in Claude Code. Codex and Cursor read `AGENTS.md`; give them CI.
- Stop continues the turn at most eight times in a row, then lets it end.
- Managed settings with `allowManagedHooksOnly` disable plugin hooks.
- Trivial edits need one INDEX row (type `trivial`, status `in-progress`).
- Maintaining this pack with its own plugin installed: set `SDD_GUARD=off` in your
  shell. Only you can set it; the hook inherits Claude's environment, not the model's
  Bash calls.

## Install into a service repository

Pick one of the three ways to get the skills. The agent writes `AGENTS.md` and
`CLAUDE.md` itself on its first task (step 2).

1. **Install the skills.** The three methods install the same skills. They
   differ in where the files go and in whether the edit-guard hook comes with them.

   | | Claude Code plugin | `npx skills` | Manual copy |
   |---|---|---|---|
   | Agents | Claude Code | Claude Code, Codex, Cursor, others | any agent that reads `.agents/skills/` |
   | Skills land in | the plugin cache, not your repo | your repo: `.claude/skills/` for Claude Code, `.agents/skills/` for agents that use the shared folder (the CLI prints the exact paths) | `<repo>/.agents/skills/` |
   | Scripts (`sdd-check.sh`, `sdd-hook.sh`, `board.sh`) | come with the skills | come with the skills, inside `core-be-workflow/scripts/` | come with the skills |
   | Edit-guard hook | **automatic** (`hooks/hooks.json`) | **not installed**: run `install-hook.sh` once (see Enforcement) | **not installed**: run `install-hook.sh` once |
   | CI check (`sdd-check.sh ci`) | scripts are not in your repo: copy `core-be-workflow/scripts/` in, or use another method | works: scripts are in the repo | works |
   | Update | `/plugin marketplace update int-agent-rules` or auto-update | `npx skills update` | re-copy |

   - **Claude Code plugin** (hooks included):

     ```
     /plugin marketplace add shubhamINT/agent_rules
     /plugin install core-backend@int-agent-rules
     ```

     Skills appear as `core-backend:core-be-<skill>`.

   - **`npx skills`**. Install the whole pack, because skills load each other and
     one skill alone breaks links:

     ```bash
     npx skills add shubhamINT/agent_rules -a claude-code -s core-be-add-health-endpoint core-be-analyze core-be-assess core-be-audit-code core-be-audit-security core-be-build-feature core-be-change core-be-clarify core-be-coding-standards core-be-constitution core-be-converge core-be-debug core-be-explain core-be-implement core-be-init core-be-plan core-be-refactor-code core-be-specify core-be-structure-service core-be-tasks core-be-workflow core-be-write-tests
     npx skills add shubhamINT/agent_rules --list     # or pick interactively and select every core-be-* skill
     npx skills update                                 # pull the latest version
     ```

     Drop `-a claude-code` to choose agents interactively; add `-g` for a global
     install. Then commit the new skills folder and register the edit-guard hook:
     `sh .claude/skills/core-be-workflow/scripts/install-hook.sh` (see Enforcement).

   - **Manual copy**:

     ```bash
     mkdir -p <repo>/.agents
     cp -r core-backend/.agents/skills <repo>/.agents/
     ```

2. **`AGENTS.md` and `CLAUDE.md` are written by the agent.** On every
   non-trivial task, `core-be-workflow` makes sure the repo root has:

   - `AGENTS.md` with the pack block between `<!-- core-be:start -->` and
     `<!-- core-be:end -->` (always-on rules, task routing, skill index). Only
     the text between the markers is refreshed; your own notes and
     `## Project structure` are never touched.
   - `CLAUDE.md` containing `@AGENTS.md`, so Claude Code loads the same rules.
     Codex and Cursor read `AGENTS.md` directly.

   The block's source is `core-be-workflow/templates/AGENTS.md`; the skills carry
   it, so plugin and `npx skills` installs get it too. To add it up front:

   ```bash
   curl -o AGENTS.md https://raw.githubusercontent.com/shubhamINT/agent_rules/master/core-backend/.agents/skills/core-be-workflow/templates/AGENTS.md
   echo "@AGENTS.md" >> CLAUDE.md
   ```

3. Commit the skills, `AGENTS.md`, and `CLAUDE.md`. `agent-tracking/` is created by the agent on first use and is
   committed too — it is the audit trail.

4. First task in the repo: the agent fills the `## Project structure` section at
   the end of `AGENTS.md` (via `core-be-structure-service`) after confirming the
   structure with you. Review and keep it — every later task follows it.

## How a task flows

```
User: "refactor the billing module, it's a mess"
  1. Agent classifies → refactor
  2. Agent creates agent-tracking/plans/2026-09-24-refactor-billing/scope.md (request verbatim), INDEX row
  3. Agent asks scope: which paths? depth? behaviour change allowed? report HTML or MD? — logged in scope.md
  4. Agent researches → research/2026-09-24-refactor-billing.md (structure, tests, lint, complexity baseline);
     no recorded structure → detects it, asks you, records it in AGENTS.md
  5. Agent writes tasks.md and STOPS for approval
  6. On approval: executes step by step, logging progress.md
  7. Report → reports/2026-09-24-refactor-billing.html, INDEX row → done
```

A spec-driven task (`feature` or `change`):

```
User: "add CSV export of orders"
  1. Agent classifies → feature; INDEX row, scope.md; asks scope questions        (stop 1)
  2. specs/constitution.md missing → core-be-constitution proposes principles, you confirm
  3. core-be-specify writes specs/001-csv-export/spec.md (AC-1..n) and asks the open
     questions it could not answer                                                 (stop 2)
  4. core-be-clarify folds your answers into the spec; sdd-check.sh spec passes; status approved
  5. core-be-plan writes specs/001-csv-export/plan.md (design, gate answers)
     core-be-tasks writes the test-first checklist; core-be-analyze runs sdd-check.sh analyze
     Agent shows spec + design + checklist and STOPS for approval                 (stop 3)
  6. On approval the plan is marked approved; the edit guard now allows source edits
  7. core-be-implement builds test first; core-be-converge fills the evidence table,
     runs sdd-check.sh converge, writes "Verdict: Converged", then the report

User later: "limit it to 10000 rows"
  1. core-be-change edits spec.md first (new AC, change-log row), then the same chain
     plans and builds only the delta
```

Trivial requests (questions, typos, one-line renames) skip the workflow, but
the always-on rules still apply: the agent still reports bugs and security
holes it notices, without fixing them unasked.

## What the tracking folder looks like

```
agent-tracking/
├── INDEX.md
├── plans/<YYYY-MM-DD-type-topic>/{scope.md, tasks.md, progress.md}
├── research/<YYYY-MM-DD-type-topic>.md
└── reports/<YYYY-MM-DD-type-topic>.html | .md
```

## Updating the pack

- Edit skills here and push to `master`. Every push is a new plugin version
  (`plugin.json` has no `version` field on purpose). Plugin users with
  auto-update get it automatically; `npx skills` users pull the change with their update command; manual
  installs re-copy `.agents/skills/`. When updating a
  repo's `AGENTS.md`, the next task refreshes the pack block automatically and
  keeps its `## Project structure` section — it is repo-specific.
- Standards editions move (OWASP Top 10, CWE Top 25 yearly). Update
  `core-be-audit-security/references/standards.md` when a new edition lands.

## Sources

- Robert C. Martin, *Clean Code*; Martin Fowler, *Refactoring* (2nd ed.) and https://refactoring.com/catalog/
- Google style guides (bundled under `core-be-coding-standards/references/google/`, CC-BY 3.0): https://google.github.io/styleguide/ · Google code review: https://google.github.io/eng-practices/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- OWASP Top 10:2025 https://top10.owasp.org/2025 · API Top 10:2023 https://api-security.owasp.org/ · ASVS 5.0 https://github.com/OWASP/ASVS · LLM Top 10 https://genai.owasp.org/llm-top-10/
- CWE Top 25 (2025): https://cwe.mitre.org/top25/
- AI-code risk: Spracklen et al., "We Have a Package for You!" (USENIX Security 2025); Pearce et al., "Asleep at the Keyboard?" (IEEE S&P 2022); Veracode GenAI Code Security Report (2025)
