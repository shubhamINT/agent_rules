# OneSpace Agent Rules — Backend (Python + Node.js)

A drop-in rule pack that makes coding agents (Codex and any tool that reads
`AGENTS.md` + `.agents/skills/`) work on OneSpace backend services the way a
careful senior engineer would:

- **scope first** — the agent asks what to cover before it touches anything
- **plan first** — a written plan, approved by you, before any code change
- **traceable** — scope, research, plan, progress log, and final report are
  written to `agent-tracking/` and committed
- **standards-based** — Clean Code, SOLID, Google Python / TypeScript style
  guides, Fowler's refactoring catalog, OWASP Top 10:2025, OWASP API Top 10,
  OWASP ASVS 5.0, CWE Top 25, OWASP LLM Top 10
- **tool-enforced** — Ruff, mypy/pyright, ESLint 9 + typescript-eslint,
  Prettier, Semgrep, gitleaks, pip-audit, npm audit

It covers three main jobs: **building features**, **refactoring bad code**, and
**security-auditing existing code** — plus test campaigns and code-quality audits.

## Contents

```
onespace-backend/
├── .claude-plugin/plugin.json                  # Claude Code plugin manifest
├── README.md                                   # this file
└── .agents/skills/
    │  always on
    ├── onespace-be-coding-standards/           # clean code, full Google style guides + section index, module design, bug radar, AI self-review, tooling
    ├── onespace-be-busl-licence-compliance/    # BUSL-1.1 LICENSE/NOTICE/headers + header script
    ├── onespace-be-workflow/                   # record → scope → plan → approve → execute → report
    │   ├── references/                         # VISUAL-REPORT (diagrams), SAFE-DELIVERY (rollout/rollback), SUBAGENTS (roles, briefs), TOKEN-ECONOMY (lean context)
    │   └── templates/                          # AGENTS.md (repo rules block), INDEX, scope, research, plan, progress, report (.md + .html)
    │  tasks
    ├── onespace-be-build-feature/              # building new behaviour + system design pass
    ├── onespace-be-refactor-code/              # behaviour-preserving refactors + architecture review
    ├── onespace-be-audit-code/                 # bugs, bad code, weak tests, AI-generated-code failure patterns
    ├── onespace-be-audit-security/             # OWASP / ASVS / CWE audit, scanners, per-language checks
    ├── onespace-be-write-tests/                # pytest + vitest, offline mocks, 80% floor
    ├── onespace-be-debug/                      # reproduce → hypotheses → root cause → fix + regression test
    ├── onespace-be-structure-service/          # detect / choose / record / apply project structure
    └── onespace-be-add-health-endpoint/        # GET /health contract, per-stack references
```

Each skill is a folder with a `SKILL.md` and, where needed, `references/`
(detail loaded on demand), `templates/`, or `scripts/`. Everything a skill needs
is inside `onespace-backend/` — nothing points outside it.

## Install into a service repository

Pick one of the three ways to get the skills. The agent writes `AGENTS.md` and
`CLAUDE.md` itself on its first task (step 2).

1. **Install the skills.**

   - **Claude Code plugin** (Claude only, updates through the plugin manager):

     ```
     /plugin marketplace add shubhamINT/agent_rules
     /plugin install onespace-backend@int-agent-rules
     ```

     Update with `/plugin marketplace update int-agent-rules`, or turn on
     auto-update for the marketplace in `/plugin`. Skills appear as
     `onespace-backend:onespace-be-<skill>`.

   - **`npx skills`** (Claude, Codex, Cursor and other agents; pick skills,
     agent and scope):

     ```bash
     npx skills add shubhamINT/agent_rules --list        # show the skills
     npx skills add shubhamINT/agent_rules               # interactive picker
     npx skills add shubhamINT/agent_rules --skill onespace-be-audit-code -a claude-code
     npx skills update                                   # pull the latest version
     ```

   - **Manual copy**:

     ```bash
     mkdir -p <repo>/.agents
     cp -r onespace-backend/.agents/skills <repo>/.agents/
     ```

2. **`AGENTS.md` and `CLAUDE.md` are written by the agent.** On every
   non-trivial task, `onespace-be-workflow` makes sure the repo root has:

   - `AGENTS.md` with the pack block between `<!-- onespace-be:start -->` and
     `<!-- onespace-be:end -->` (always-on rules, task routing, skill index). Only
     the text between the markers is refreshed; your own notes and
     `## Project structure` are never touched.
   - `CLAUDE.md` containing `@AGENTS.md`, so Claude Code loads the same rules.
     Codex and Cursor read `AGENTS.md` directly.

   The block's source is `onespace-be-workflow/templates/AGENTS.md`; the skills carry
   it, so plugin and `npx skills` installs get it too. To add it up front:

   ```bash
   curl -o AGENTS.md https://raw.githubusercontent.com/shubhamINT/agent_rules/master/onespace-backend/.agents/skills/onespace-be-workflow/templates/AGENTS.md
   echo "@AGENTS.md" >> CLAUDE.md
   ```

   Skills are self-sufficient. Install the whole pack: skills load each other,
   so `--skill <one>` alone breaks links.

3. Commit the skills, `AGENTS.md`, and `CLAUDE.md`. `agent-tracking/` is created by the agent on first use and is
   committed too — it is the audit trail.

4. First task in the repo: the agent fills the `## Project structure` section at
   the end of `AGENTS.md` (via `onespace-be-structure-service`) after confirming the
   structure with you. Review and keep it — every later task follows it.

## How a task flows

```
User: "refactor the billing module, it's a mess"
  1. Agent classifies → refactor
  2. Agent creates agent-tracking/plans/2026-09-24-refactor-billing/scope.md (request verbatim), INDEX row
  3. Agent asks scope: which paths? depth? behaviour change allowed? report HTML or MD? — logged in scope.md
  4. Agent researches → research/2026-09-24-refactor-billing.md (structure, tests, lint, complexity baseline);
     no recorded structure → detects it, asks you, records it in AGENTS.md
  5. Agent writes plan.md and STOPS for approval
  6. On approval: executes step by step, logging progress.md
  7. Report → reports/2026-09-24-refactor-billing.html, INDEX row → done
```

Trivial requests (questions, typos, one-line renames) skip the workflow, but
the always-on rules still apply: the agent still reports bugs and security
holes it notices, without fixing them unasked.

## What the tracking folder looks like

```
agent-tracking/
├── INDEX.md
├── plans/<YYYY-MM-DD-type-topic>/{scope.md, plan.md, progress.md}
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
- `onespace-be-busl-licence-compliance` and `onespace-be-add-health-endpoint` are owned by the platform
  team; keep them in sync with the owners.
- Standards editions move (OWASP Top 10, CWE Top 25 yearly). Update
  `onespace-be-audit-security/references/standards.md` when a new edition lands.
- Licence header text is owned by the tech lead — never reword it here.

## Sources

- Robert C. Martin, *Clean Code*; Martin Fowler, *Refactoring* (2nd ed.) and https://refactoring.com/catalog/
- Google style guides (bundled under `onespace-be-coding-standards/references/google/`, CC-BY 3.0): https://google.github.io/styleguide/ · Google code review: https://google.github.io/eng-practices/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- OWASP Top 10:2025 https://top10.owasp.org/2025 · API Top 10:2023 https://api-security.owasp.org/ · ASVS 5.0 https://github.com/OWASP/ASVS · LLM Top 10 https://genai.owasp.org/llm-top-10/
- CWE Top 25 (2025): https://cwe.mitre.org/top25/
- AI-code risk: Spracklen et al., "We Have a Package for You!" (USENIX Security 2025); Pearce et al., "Asleep at the Keyboard?" (IEEE S&P 2022); Veracode GenAI Code Security Report (2025)
