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
    │   ├── references/                        # VISUAL-REPORT, SUBAGENTS, README-STANDARD, TOKEN-ECONOMY, PARALLEL-AGENTS
    │   ├── templates/                         # AGENTS.md (repo rules block), INDEX, scope, research, plan, progress, report
    │   └── scripts/                           # board.sh (multi-agent board), sdd-check.sh (validator), sdd-hook.sh (edit guard), install-hook.sh, test-sdd.sh
    │  tasks
    ├── onespace-fe-constitution/              # specs/constitution.md: principles with yes/no gate questions; amend with approval
    ├── onespace-fe-assess/                    # idea to verdict: go / needs-clarification / kill
    ├── onespace-fe-explain/                   # read-only trace of how code works; one HTML page with diagrams
    ├── onespace-fe-init/                       # set up or repair a repo: AGENTS.md / CLAUDE.md, tracking, constitution, project brief
    ├── onespace-fe-specify/                   # new feature: specs/<NNN-topic>/spec.md, numbered acceptance criteria
    ├── onespace-fe-change/                    # existing feature: edit the spec first, then plan the delta
    ├── onespace-fe-clarify/                   # resolve open questions in a spec
    ├── onespace-fe-plan/                      # durable design plan with constitution check
    ├── onespace-fe-tasks/                     # test-first checklist, each step mapped to an AC, [P] for parallel
    ├── onespace-fe-analyze/                   # read-only check: constitution, spec, plan, tasks agree
    ├── onespace-fe-implement/                 # build from the approved checklist, test first
    ├── onespace-fe-converge/                  # code vs spec table; Converged / Not converged loop
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

## Which skill for which task

You do not have to name a skill. Describe the task; `onespace-fe-workflow` classifies it and runs
the chain. Skill names below drop the `onespace-fe-` prefix.

| You say | Task type | Skills, in order | You get |
|---------|-----------|------------------|---------|
| "build the team members page", "add a task scheduling UI" | `feature` | `workflow` → `constitution` (once) → `specify` → `clarify` → `plan` → `tasks` → `analyze` → you approve → `implement` → `converge`; `structure-app`, `design-ui`, `verify-ui` run inside | `specs/<NNN>/spec.md` and `tasks.md`, the tracking record, screenshots, a report |
| "make the table filterable", "change how the wizard validates" | `change` | `workflow` → `change` → `clarify` → `plan` (delta) → `tasks` → `analyze` → you approve → `implement` → `converge` | the spec edited first with a change-log row, then code, screenshots, a report |
| "should we build X?", a fuzzy idea | `assess` | `workflow` → `assess` | `specs/assessments/<slug>.md` with a verdict: go, needs-clarification, or kill |
| "how does X work?", "walk me through this" | `explain` | `workflow` → `explain` | `agent-tracking/reports/<slug>.html`: flow diagram, `file:line` evidence, where code and spec disagree |
| "set up this repo", "start a new project", messy `AGENTS.md` | `init` | `workflow` → `init` → first feature through `specify` | clean `AGENTS.md` + `CLAUDE.md` import, `specs/constitution.md`, approved `specs/project.md` |
| "set up SDD", "project principles" | `constitution` | `workflow` → `constitution` | `specs/constitution.md` |
| "redesign the dashboard", "make it look premium", "fix mobile layout" | `ui` | `workflow` → `design-ui` → `verify-ui` | restyled UI, screenshots at five widths, a report; no spec |
| "clean up", "extract shared components" | `refactor` | `workflow` → `structure-app` → `verify-ui` | no visual change, before and after screenshots; no spec |
| "where should this go?", "structure this app" | `structure` | `workflow` → `structure-app` | the recorded `## Project structure` in `AGENTS.md` |
| "check how it looks on mobile", "visual QA" | `verify` | `workflow` → `verify-ui` → critique from `design-ui` | screenshots and findings; changes nothing |
| "make it look like this", "implement designs/dashboard.png" | `image` | `workflow` → `specify` (new behaviour only) → `image-to-ui` → `structure-app` → `design-ui` → `verify-ui` | a page matched to the design image, pixel-diff proof |
| "blank screen", "state not updating", console error, slow page | `fix` | `workflow` → `debug` → `verify-ui`; if the spec was wrong or silent, `change` first | a root-cause fix, a regression test, screenshot proof |

`onespace-fe-coding-standards` and `onespace-fe-workflow` are always on. A trivial edit (a
question, a typo) skips the workflow, but with the edit guard installed it still
needs one `trivial` row in `agent-tracking/INDEX.md`.

## Build with SDD (spec-driven development)

`agent-tracking/` is history. For new behaviour the agent also keeps durable
files that say what the system does now. All are committed with the code.

| File | Holds | Skill |
|------|-------|-------|
| `specs/constitution.md` | project principles, each with a yes/no gate question | `onespace-fe-constitution` |
| `specs/<NNN-topic>/spec.md` | what and why, numbered acceptance criteria (`AC-1`, ...), change log | `onespace-fe-specify`, `onespace-fe-change` |
| `specs/<NNN-topic>/plan.md` | the design: constitution check, data, contracts, decisions, rollback | `onespace-fe-plan` |
| `specs/assessments/<slug>.md` | idea verdict: `go`, `needs-clarification`, `kill` | `onespace-fe-assess` |

**New feature:** `onespace-fe-specify` → `onespace-fe-clarify` → `onespace-fe-plan` → `onespace-fe-tasks` →
`onespace-fe-analyze` → you approve → `onespace-fe-implement` → `onespace-fe-converge`.

**Change to an existing feature:** `onespace-fe-change` edits the spec first and logs it,
then `onespace-fe-clarify` → `onespace-fe-plan` (only the delta) → `onespace-fe-tasks` → `onespace-fe-analyze` →
you approve → `onespace-fe-implement` → `onespace-fe-converge`. Code is never edited first.

**Bug:** `onespace-fe-debug` checks the spec. The spec states the behaviour: the
regression test cites that `AC-n`. The spec was wrong or silent: it routes to
`onespace-fe-change` first.

**Done** means `onespace-fe-converge` returned `Converged`: every `AC-n` has passing
evidence, no code does what the spec never asked for, the constitution holds.
After three rounds without it, the agent stops and asks you.

No spec for refactors, audits, security reviews, debugging, or test work, which
change no behaviour. Nothing creates a branch or commits; review the specs with
the code.

## Enforcement (hooks, validator, CI)

Skills are advice; these make the workflow hard to skip, whichever model runs.

| Piece | Where | What it does |
|-------|-------|--------------|
| `sdd-check.sh` | `onespace-fe-workflow/scripts/` | `next`, `spec`, `analyze`, `converge`, `status`, `ci`, `doctor`: deterministic checks on the spec, plan, task, and INDEX files. Exit 1 on CRITICAL or HIGH. Used by the skills and by CI. |
| `sdd-hook.sh` | `onespace-fe-workflow/scripts/` | Command hook for Claude Code, Codex, Copilot, Cursor, Gemini CLI, and Windsurf. Blocks a source edit without an approved task (a `feature` or `change` also needs its spec first). Blocks stopping an in-progress `feature` or `change` before `Verdict: Converged`. |
| `hooks/hooks.json` | plugin root | Wires the hook up. Installed with the plugin; nothing to configure. |
| `sdd-check.yml` | `onespace-fe-workflow/templates/` | Sample GitHub Actions job running `sdd-check.sh ci`. |
| `install-hook.sh` | `onespace-fe-workflow/scripts/` | Registers the hook for the agents you use (`--agent codex`, `--all`, and so on) for `npx skills` and manual installs. |
| `test-sdd.sh` | `onespace-fe-workflow/scripts/` | Self-check for the two scripts: `sh scripts/test-sdd.sh`. |

**Without the plugin** (`npx skills` or manual copy) the hook is not installed. Run
the installer once, from the project root, as you (not the agent; it edits
`.claude/settings.json`):

```bash
sh .claude/skills/onespace-fe-workflow/scripts/install-hook.sh            # npx skills with Claude Code
sh .agents/skills/onespace-fe-workflow/scripts/install-hook.sh            # manual copy
sh .claude/skills/onespace-fe-workflow/scripts/install-hook.sh --dry-run  # show the result, write nothing
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
                  "${CLAUDE_PROJECT_DIR}/.claude/skills/onespace-fe-workflow/scripts/sdd-hook.sh"] }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "sh",
        "args": ["-c", "[ -f \"$1\" ] && exec sh \"$1\"; exit 0", "sdd-hook",
                  "${CLAUDE_PROJECT_DIR}/.claude/skills/onespace-fe-workflow/scripts/sdd-hook.sh"] }] }]
  }
}
```

(Use `.agents/skills/` in the path for a manual copy. Write `${CLAUDE_PROJECT_DIR}` with
braces: Claude Code does not expand the bare form. The `sh -c` wrapper makes a missing
script a no-op instead of a block.) Check with `/hooks` in Claude Code that both entries show up. The validator works
without the hook: `sh <skills dir>/onespace-fe-workflow/scripts/sdd-check.sh status`. For CI, copy
`onespace-fe-workflow/templates/sdd-check.yml` to `.github/workflows/`; it needs the scripts in the
repo (`npx skills` or manual copy).

**Other coding agents.** The same guard runs in every agent that has command hooks. The
script adapts each agent's JSON, so the rules are written once. Run the installer once per
agent the team uses, from the project root, as you (it writes that agent's hook file):

```bash
sh <skills dir>/onespace-fe-workflow/scripts/install-hook.sh --agent codex      # also: claude, cursor, copilot, gemini, windsurf
sh <skills dir>/onespace-fe-workflow/scripts/install-hook.sh --all              # every agent below
```

| Agent | Hook file it writes | Edit guard | Stop guard | Checked |
|-------|--------------------|-----------|-----------|---------|
| Claude Code | `.claude/settings.json` (or the plugin) | yes | yes | live |
| Codex | `.codex/hooks.json` (run `/hooks` and trust it) | yes, through `apply_patch` | yes | live |
| GitHub Copilot | `.github/hooks/sdd-guard.json` | yes | yes | live in the CLI with `--trust-folder`; the cloud agent needs the file on the default branch |
| Cursor | `.cursor/hooks.json` | yes | yes | from the docs only |
| Gemini CLI | `.gemini/settings.json` | yes | yes | from the docs only |
| Windsurf | `.devin/hooks.json` | yes | no stop event | from the docs only |
| opencode, Aider, Cline, Roo Code | none shipped (opencode and Cline hooks are JS plugins; not built or checked) | no | no | `AGENTS.md` and CI only |

"From the docs only" means the stdin shapes come from the vendor's documentation and the
`test-sdd.sh` fixtures, not from a run of that agent. Check one on your machine: install it,
ask the agent to edit a source file with no task, and expect the `SDD guard:` message. Path
keys the docs do not name (Cursor, Gemini) are matched by trying the likely names; an edit
event with no path found is allowed, and CI is the backstop. Shell writes (`sed -i`, redirects)
are not seen by any agent. Cursor's CLI hooks are reported as unreliable on Linux.

**Limits.**
- The hook sees `Write`, `Edit`, `MultiEdit`, and `NotebookEdit`. Source written through Bash
  (`sed -i`, redirects) is not seen; CI and the Stop hook catch the outcome.
- A model can add its own INDEX row to pass the guard. Rows are an audit trail, and
  `sdd-check.sh ci` re-checks every approved row against its plan and spec.
- Agents without command hooks (opencode, Aider, Cline, Roo Code) read `AGENTS.md`; give them CI.
- Stop continues the turn at most eight times in a row, then lets it end.
- Managed settings with `allowManagedHooksOnly` disable plugin hooks.
- Trivial edits need one INDEX row (type `trivial`, status `in-progress`).
- Maintaining this pack with its own plugin installed: set `SDD_GUARD=off` in your
  shell. Only you can set it; the hook inherits Claude's environment, not the model's
  Bash calls.

## Install into a frontend repository

1. **Install the skills.** The three methods install the same skills. They
   differ in where the files go and in whether the edit-guard hook comes with them.

   | | Claude Code plugin | `npx skills` | Manual copy |
   |---|---|---|---|
   | Agents | Claude Code | Claude Code, Codex, Cursor, others | any agent that reads `.agents/skills/` |
   | Skills land in | the plugin cache, not your repo | your repo: `.claude/skills/` for Claude Code, `.agents/skills/` for agents that use the shared folder (the CLI prints the exact paths) | `<repo>/.agents/skills/` |
   | Scripts (`sdd-check.sh`, `sdd-hook.sh`, `board.sh`, `shoot.mjs`, `capture.mjs`) | come with the skills | come with the skills, inside each skill's `scripts/` | come with the skills |
   | Edit-guard hook | **automatic** (`hooks/hooks.json`) | **not installed**: run `install-hook.sh` once (see Enforcement) | **not installed**: run `install-hook.sh` once |
   | CI check (`sdd-check.sh ci`) | scripts are not in your repo: copy `onespace-fe-workflow/scripts/` in, or use another method | works: scripts are in the repo | works |
   | Update | `/plugin marketplace update int-agent-rules` or auto-update | `npx skills update` | re-copy |

   - **Claude Code plugin** (hooks included):

     ```
     /plugin marketplace add shubhamINT/agent_rules
     /plugin install onespace-frontend@int-agent-rules
     ```

     Skills appear as `onespace-frontend:onespace-fe-<skill>`.

   - **`npx skills`**. Install the whole pack, because skills load each other and
     one skill alone breaks links:

     ```bash
     npx skills add shubhamINT/agent_rules -a claude-code -s onespace-fe-analyze onespace-fe-assess onespace-fe-busl-licence-compliance onespace-fe-change onespace-fe-clarify onespace-fe-coding-standards onespace-fe-constitution onespace-fe-converge onespace-fe-debug onespace-fe-design-ui onespace-fe-explain onespace-fe-image-to-ui onespace-fe-implement onespace-fe-init onespace-fe-plan onespace-fe-specify onespace-fe-structure-app onespace-fe-tasks onespace-fe-verify-ui onespace-fe-workflow
     npx skills add shubhamINT/agent_rules --list     # or pick interactively and select every onespace-fe-* skill
     npx skills update                                 # pull the latest version
     ```

     Drop `-a claude-code` to choose agents interactively; add `-g` for a global
     install. Then commit the new skills folder and register the edit-guard hook:
     `sh .claude/skills/onespace-fe-workflow/scripts/install-hook.sh` (see Enforcement).

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
  5. tasks.md with what is weak now and 2–3 design directions → STOP for approval
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
  6. tasks.md → STOP for approval
  7. Build tokens → sections; compare.mjs after each: mismatch %, worst-cell crops, fix, repeat (target ≤ 3%)
  8. verify-ui at every width and theme; licence headers; docs sync
  9. Report with design vs build side by side, diff heatmap, mismatch first → final
```

A spec-driven task (`feature` or `change`):

```
User: "add a team members page"
  1. Agent classifies → feature; INDEX row, scope.md; asks scope questions        (stop 1)
  2. specs/constitution.md missing → onespace-fe-constitution proposes principles, you confirm
  3. onespace-fe-specify writes specs/001-team-members/spec.md (AC-1..n, states, widths) and
     asks the open questions it could not answer                                   (stop 2)
  4. onespace-fe-clarify folds your answers into the spec; sdd-check.sh spec passes; status approved
  5. onespace-fe-plan writes specs/001-team-members/plan.md (design, reuse inventory, gate answers)
     onespace-fe-tasks writes the test-first checklist; onespace-fe-analyze runs sdd-check.sh analyze
     Agent shows spec + design + checklist and STOPS for approval                 (stop 3)
  6. On approval the plan is marked approved; the edit guard now allows source edits
  7. onespace-fe-implement builds test first with design-ui; onespace-fe-converge fills the evidence
     table (tests and screenshots), runs sdd-check.sh converge, writes
     "Verdict: Converged", then the report

User later: "make the table filterable"
  1. onespace-fe-change edits spec.md first (new AC, change-log row), then the same chain
     plans and builds only the delta
```

## What the tracking folder looks like

```
agent-tracking/
├── INDEX.md
├── plans/<YYYY-MM-DD-type-topic>/{scope.md, tasks.md, progress.md}
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
