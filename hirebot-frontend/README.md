# HireBot Agent Rules — Frontend (React + TypeScript)

A drop-in rule pack that makes coding agents (Claude Code, Codex, Cursor, and
any tool that reads `AGENTS.md` + `.agents/skills/`) work on the HireBot
frontend the way a senior product engineer with a designer's eye would:

- **premium UI** — researches award-winning references, proposes design
  directions for you to pick, bans the generic "AI-generated" look, and always
  tells you what looks weak and how to make it better
- **responsive everywhere** — designed mobile-first and checked at 375, 768,
  1024, 1440, and 1920 px
- **clean structure** — a recorded, feature-based folder layout so every
  component is easy to find and edit
- **minimal code** — reuse before writing, no speculative abstractions,
  enforced by ESLint, TypeScript, and knip
- **never a blank screen** — skeletons shaped like the content, slow, empty
  and error states, and progress for long AI jobs
- **self-documenting** — every task keeps the repo README current: setup,
  run, scripts, env, structure, stack
- **self-registering** — every task writes the pack's rules and skill index
  into the repo's `AGENTS.md` (and `@AGENTS.md` into `CLAUDE.md`), so later
  agents follow them without being told
- **verified by looking** — headless Chromium screenshots in light and dark
  themes, plus console, overflow, and accessibility checks, before anything is
  called done
- **scoped and traceable** — scope, plan, progress, screenshots, and report in
  `agent-tracking/`

## Contents

```
hirebot-frontend/
├── .claude-plugin/plugin.json                 # Claude Code plugin manifest
├── README.md                                  # this file
└── .agents/skills/
    │  always on
    ├── hirebot-fe-coding-standards/           # reuse-first, minimal React; 19 impact-ranked rules in references/rules/
    ├── hirebot-fe-workflow/                   # record → scope → plan → approve → execute → verify → report
    │   ├── references/                        # VISUAL-REPORT, SUBAGENTS, README-STANDARD
    │   └── templates/                         # AGENTS.md (repo rules block), INDEX, scope, research, plan, progress, report
    │  tasks
    ├── hirebot-fe-design-ui/                  # design read + dials, inspiration research, directions, critique and ideas
    │   └── references/                        # inspiration, anti-patterns, tokens, responsive, motion, libraries, loading-states
    ├── hirebot-fe-structure-app/              # detect / choose / record / apply the folder layout
    │   └── references/layouts.md              # Vite SPA and Next.js App Router trees, import rules
    └── hirebot-fe-verify-ui/                  # Playwright screenshots at 5 widths × 2 themes + checks
        └── scripts/shoot.mjs
```

## How the skills link together

```
        hirebot-fe-workflow  (entry: register pack → classify → scope → plan → approve)
                 │
   ┌─────────────┼──────────────┬──────────────┐
 feature         ui          refactor       structure
   │             │              │               │
 structure-app   │          structure-app   structure-app
   │             │              │
 design-ui ── design-ui         │
   │             │              │
   └─────────────┴──── verify-ui (screenshots, checks) ──── critique + ideas (design-ui)
                 │
     docs sync (README, AGENTS.md, CLAUDE.md) → report
   hirebot-fe-coding-standards applies to every step that writes code
```

Every task skill opens with a gate: when invoked directly as the task, it
loads `hirebot-fe-workflow` and runs scoping first. Every skill, even inside
another task, registers the pack in the repo and ends with the docs sync.

**Self-registration.** On each task the agent makes sure the repo root has:

- `AGENTS.md` with the pack block between `<!-- hirebot-fe:start -->` and
  `<!-- hirebot-fe:end -->` (always-on rules, task routing, skill index). Only
  the text between the markers is refreshed; your own notes and
  `## Project structure` are never touched.
- `CLAUDE.md` containing `@AGENTS.md`, so Claude Code loads the same rules.
  Codex and Cursor read `AGENTS.md` directly.

The block's source is `hirebot-fe-workflow/templates/AGENTS.md`; the skills
carry it, so plugin and `npx skills` installs get it too.

## Install into a frontend repository

1. **Install the skills.**

   - **Claude Code plugin**:

     ```
     /plugin marketplace add shubhamINT/agent_rules
     /plugin install hirebot-frontend@int-agent-rules
     ```

     Skills appear as `hirebot-frontend:hirebot-fe-<skill>`.

   - **`npx skills`**:

     ```bash
     npx skills add shubhamINT/agent_rules --list
     npx skills add shubhamINT/agent_rules                 # interactive picker: select all hirebot-fe-* skills
     npx skills update
     ```

   - **Manual copy**:

     ```bash
     mkdir -p <repo>/.agents
     cp -r hirebot-frontend/.agents/skills <repo>/.agents/
     ```

2. **`AGENTS.md` and `CLAUDE.md` are written by the agent** on its first
   non-trivial task (see Self-registration). To add them up front:

   ```bash
   curl -o AGENTS.md https://raw.githubusercontent.com/shubhamINT/agent_rules/master/hirebot-frontend/.agents/skills/hirebot-fe-workflow/templates/AGENTS.md
   echo "@AGENTS.md" >> CLAUDE.md
   ```

   Install the whole pack: skills load each other, so one skill alone breaks
   links.

3. **For screenshots**, the repo needs Playwright as a dev dependency. The
   agent asks before installing it:
   `npm i -D playwright @axe-core/playwright && npx playwright install chromium`.
   Add `.auth/` to `.gitignore` if you use signed-in screenshots.

4. First task in the repo: the agent fills `## Project structure` at the end of
   `AGENTS.md` (via `hirebot-fe-structure-app`) after confirming it with you.

## How a task flows

```
User: "the jobs page looks bad on mobile, make it premium"
  1. Classify → ui
  2. agent-tracking/plans/2026-09-26-ui-jobs-page/scope.md (request verbatim), INDEX row
  3. Registers the pack in AGENTS.md / CLAUDE.md; scope questions: devices, themes, references, dials, constraints, report format
  4. Research: stack, reuse inventory, README gaps, before screenshots at 5 widths, 3–5 design references
  5. plan.md with what is weak now and 2–3 design directions → STOP for approval
  6. Build: tokens → mobile layout → components → states → motion, screenshotting as it goes
  7. Final verify (all widths, both themes), critique + ideas in chat
  8. Docs sync: README (run, scripts, env, structure) and AGENTS.md brought up to date
  9. Report → reports/2026-09-26-ui-jobs-page.html with before/after screenshots
```

## What the tracking folder looks like

```
agent-tracking/
├── INDEX.md
├── plans/<YYYY-MM-DD-type-topic>/{scope.md, plan.md, progress.md}
├── research/<YYYY-MM-DD-type-topic>.md
├── screenshots/<YYYY-MM-DD-type-topic>/{before,after,refs}/*.png
└── reports/<YYYY-MM-DD-type-topic>.html | .md
```

## Updating the pack

Edit skills here and push to `master`. Every push is a new plugin version
(`plugin.json` has no `version` field on purpose). The next task in each repo
refreshes its `AGENTS.md` block automatically. Library versions move fast:
re-check `hirebot-fe-design-ui/references/libraries.md` when a major version
lands.

## Sources

- React docs, "You Might Not Need an Effect": https://react.dev/learn/you-might-not-need-an-effect
- Vercel agent skills (React best practices, composition patterns, web design guidelines): https://github.com/vercel-labs/agent-skills
- Anthropic `frontend-design` skill: https://github.com/anthropics/skills
- Emil Kowalski, design engineering and animation skills: https://github.com/emilkowalski/skills
- taste-skill (design dials, anti-slop rules): https://github.com/leonxlnx/taste-skill
- shadcn/ui: https://ui.shadcn.com · Tailwind CSS v4: https://tailwindcss.com
- WCAG 2.2: https://www.w3.org/TR/WCAG22/ · axe-core: https://github.com/dequelabs/axe-core
- Playwright: https://playwright.dev
