# OneSpace Agent Rules — Frontend (React + TypeScript)

A drop-in rule pack that makes coding agents (Claude Code, Codex, Cursor, and
any tool that reads `AGENTS.md` + `.agents/skills/`) work on the OneSpace
frontend the way a senior product engineer with a designer's eye would:

- **design image to UI** — give a mockup path or a folder of images; the
  agent asks what the image cannot show, critiques it and pitches upgrades,
  then builds real responsive UI and measures the match with a pixel diff
- **BUSL-1.1 compliant** — licence header on every new file, `package.json`
  licence field, and a licence check on every dependency, font, icon, and image
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
onespace-frontend/
├── .claude-plugin/plugin.json                 # Claude Code plugin manifest
├── README.md                                  # this file
└── .agents/skills/
    │  always on
    ├── onespace-fe-coding-standards/           # reuse-first, minimal React; 19 impact-ranked rules in references/rules/
    ├── onespace-fe-busl-licence-compliance/    # BUSL-1.1: LICENSE, NOTICE, headers, package.json, deps and assets
    │   ├── templates/                         # LICENSE, NOTICE, headers.md, README licence section
    │   └── scripts/add_license_headers.py     # idempotent; --dry-run, --check (CI gate)
    ├── onespace-fe-workflow/                   # record → scope → plan → approve → execute → verify → report
    │   ├── references/                        # VISUAL-REPORT, SUBAGENTS, README-STANDARD, TOKEN-ECONOMY
    │   └── templates/                         # AGENTS.md (repo rules block), INDEX, scope, research, plan, progress, report
    │  tasks
    ├── onespace-fe-design-ui/                  # design read + dials, inspiration research, directions, critique and ideas
    │   └── references/                        # inspiration, anti-patterns, tokens, responsive, motion, libraries, loading-states
    ├── onespace-fe-structure-app/              # detect / choose / record / apply the folder layout
    │   └── references/layouts.md              # Vite SPA and Next.js App Router trees, import rules
    ├── onespace-fe-verify-ui/                  # Playwright screenshots at 5 widths × 2 themes + checks
    │   └── scripts/shoot.mjs
    ├── onespace-fe-debug/                      # reproduce → hypotheses → root cause → fix + regression test
    │   ├── references/                        # symptom-playbook (10 bug classes), tools
    │   └── scripts/capture.mjs                # browser repro: steps, console, network, errors, trace
    └── onespace-fe-image-to-ui/                # design image → questions → critique and pitch → build → pixel match
        ├── references/design-read.md          # grid, spacing, type, colour, components from an image
        └── scripts/compare.mjs                # diff %, heatmap, side-by-side, worst-cell crops; --palette, --slice
```

## How the skills link together

```
        onespace-fe-workflow  (entry: register pack → classify → scope → plan → approve)
                 │
   ┌─────────────┬─────────────┼──────────────┬──────────────┬─────────────┐
 image         feature         ui          refactor       structure       fix
   │             │             │              │               │             │
 image-to-ui     │             │              │               │             │
 (questions,     │             │              │               │             │
  critique,      │             │              │               │             │
  compare)       │             │              │               │             │
   │             │             │              │               │             │
 structure-app structure-app   │          structure-app   structure-app   debug (repro → root cause → fix)
   │             │             │              │                             │
 design-ui ── design-ui ── design-ui          │                             │
   │             │              │                             │
   └─────────────┴──── verify-ui (screenshots, checks) ───────┘──── critique + ideas (design-ui)
                 │
     docs sync (README, AGENTS.md, CLAUDE.md) → report
   onespace-fe-coding-standards applies to every step that writes code
   onespace-fe-busl-licence-compliance applies to every new file, dependency, and asset
```

Every task skill opens with a gate: when invoked directly as the task, it
loads `onespace-fe-workflow` and runs scoping first. Every skill, even inside
another task, registers the pack in the repo and ends with the docs sync.

**Self-registration.** On each task the agent makes sure the repo root has:

- `AGENTS.md` with the pack block between `<!-- onespace-fe:start -->` and
  `<!-- onespace-fe:end -->` (always-on rules, task routing, skill index). Only
  the text between the markers is refreshed; your own notes and
  `## Project structure` are never touched.
- `CLAUDE.md` containing `@AGENTS.md`, so Claude Code loads the same rules.
  Codex and Cursor read `AGENTS.md` directly.

The block's source is `onespace-fe-workflow/templates/AGENTS.md`; the skills
carry it, so plugin and `npx skills` installs get it too.

## Install into a frontend repository

1. **Install the skills.**

   - **Claude Code plugin**:

     ```
     /plugin marketplace add shubhamINT/agent_rules
     /plugin install onespace-frontend@int-agent-rules
     ```

     Skills appear as `onespace-frontend:onespace-fe-<skill>`.

   - **`npx skills`**:

     ```bash
     npx skills add shubhamINT/agent_rules --list
     npx skills add shubhamINT/agent_rules                 # interactive picker: select all onespace-fe-* skills
     npx skills update
     ```

   - **Manual copy**:

     ```bash
     mkdir -p <repo>/.agents
     cp -r onespace-frontend/.agents/skills <repo>/.agents/
     ```

2. **`AGENTS.md` and `CLAUDE.md` are written by the agent** on its first
   non-trivial task (see Self-registration). To add them up front:

   ```bash
   curl -o AGENTS.md https://raw.githubusercontent.com/shubhamINT/agent_rules/master/onespace-frontend/.agents/skills/onespace-fe-workflow/templates/AGENTS.md
   echo "@AGENTS.md" >> CLAUDE.md
   ```

   Install the whole pack: skills load each other, so one skill alone breaks
   links.

3. **For screenshots**, the repo needs Playwright as a dev dependency. The
   agent asks before installing it:
   `npm i -D playwright @axe-core/playwright && npx playwright install chromium`.
   Add `.auth/` to `.gitignore` if you use signed-in screenshots.
   `onespace-fe-image-to-ui` uses the same Playwright install for its pixel diff.

   **Licence**: the header script needs Python 3; `npx license-checker`
   generates `THIRD_PARTY_LICENSES.md`.

4. First task in the repo: the agent fills `## Project structure` at the end of
   `AGENTS.md` (via `onespace-fe-structure-app`) after confirming it with you.

## How a task flows

```
User: "the projects page looks bad on mobile, make it premium"
  1. Classify → ui
  2. agent-tracking/plans/2026-09-26-ui-projects-page/scope.md (request verbatim), INDEX row
  3. Registers the pack in AGENTS.md / CLAUDE.md; scope questions: devices, themes, references, dials, constraints, report format
  4. Research: stack, reuse inventory, README gaps, before screenshots at 5 widths, 3–5 design references
  5. plan.md with what is weak now and 2–3 design directions → STOP for approval
  6. Build: tokens → mobile layout → components → states → motion, screenshotting as it goes
  7. Final verify (all widths, both themes), critique + ideas in chat
  8. Docs sync: README (run, scripts, env, structure) and AGENTS.md brought up to date
  9. Report → reports/2026-09-26-ui-projects-page.html with before/after screenshots
```

```
User: "implement designs/billing.png as /settings/billing"
  1. Classify → image; copies the image to agent-tracking/designs/<slug>/
  2. Reads it (slices if tall), extracts the palette, works out the scale (2880px = 1440 at 2x)
  3. Asks what the image cannot show: other widths, hover/loading/empty/error, dark mode, data, fonts, asset licences
  4. Design read (grid, spacing, type, colour, components mapped to existing ones)
  5. Critique + 2–3 upgrades → you pick; accepted ones become intentional deviations
  6. plan.md → STOP for approval
  7. Build tokens → sections; compare.mjs after each: mismatch %, worst-cell crops, fix, repeat (target ≤ 3%)
  8. verify-ui at every width and theme; licence headers; docs sync
  9. Report with design vs build side by side, diff heatmap, mismatch first → final
```

## What the tracking folder looks like

```
agent-tracking/
├── INDEX.md
├── plans/<YYYY-MM-DD-type-topic>/{scope.md, plan.md, progress.md}
├── research/<YYYY-MM-DD-type-topic>.md
├── designs/<YYYY-MM-DD-type-topic>/*.png        # reference images for image tasks (copies)
├── screenshots/<YYYY-MM-DD-type-topic>/{before,after,refs,compare-NN}/*.png
└── reports/<YYYY-MM-DD-type-topic>.html | .md
```

## Updating the pack

Edit skills here and push to `master`. Every push is a new plugin version
(`plugin.json` has no `version` field on purpose). The next task in each repo
refreshes its `AGENTS.md` block automatically. Library versions move fast:
re-check `onespace-fe-design-ui/references/libraries.md` when a major version
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
