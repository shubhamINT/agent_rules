---
name: onespace-fe-verify-ui
description: >
  Prove a OneSpace React UI works and looks right by running it in headless
  Chromium (Playwright) and screenshotting every target page at 375, 768,
  1024, 1440 and 1920 px in light and dark themes, then reading every image
  and fixing what is wrong. The bundled scripts/shoot.mjs also fails the run
  on console errors, failed requests, horizontal overflow and serious axe
  accessibility violations, and warns on small touch targets and duplicate API
  calls. Use after every UI change before calling it done, when the user asks
  to "check how it looks", "test on mobile", "test responsiveness", "take
  screenshots", "does it work on tablet", "visual QA", when reproducing a
  layout bug, and to capture "before" screenshots and design references.
  Required final step of every onespace-fe-workflow `feature`, `ui`,
  `refactor` and `fix` task.
---

# Verify UI

Code that compiles is not a UI that works. Layouts break at 375px, dark mode
hides text, a skeleton never goes away, a console error hides behind a working
page. The only proof is to run the app, look at it at every width, and read
the result. This skill does that with a real browser and leaves the evidence in
`agent-tracking/screenshots/<slug>/`.

**Gate — when this is the task itself** (a `verify` task, not a step inside
another task): load `onespace-fe-workflow` and run its phases 1–3 before
anything else. Invoking this skill directly (a slash command, a one-line
request) is not an exemption, and harness plan mode does not replace `plan.md`.

**Always, even inside another task:** make sure the repo is registered — the
onespace-fe block in `AGENTS.md` and the `@AGENTS.md` import in `CLAUDE.md`
(`onespace-fe-workflow`, Phase 2, "Register the pack") — and finish with the
docs sync (`onespace-fe-workflow`, Phase 7) so the README matches the code.

---

## Step 1 — Set up once per repo

1. Playwright in the project (dev dependency). If missing, ask before
   installing:
   `npm i -D playwright @axe-core/playwright && npx playwright install chromium`
   (use the repo's package manager). `@axe-core/playwright` is optional but
   recommended; without it the accessibility check is skipped.
2. Start the app's dev server in the background (`npm run dev`, or the
   repo's command) and note the URL. Start the backend too, or the agreed mock,
   for pages that show data.
3. **Signed-in pages:** ask the user for a test account and create a session
   file once with `npx playwright codegen --save-storage=.auth/state.json <url>`
   (sign in, close the window). Pass it with `--storage-state`.
   **This file holds live session cookies:** add `.auth/` to `.gitignore`,
   never commit it, and never copy it into reports.

## Step 2 — Shoot

The script path is this skill's `scripts/shoot.mjs`. Run it from the repo root
(Playwright is resolved from the project):

```bash
node <this-skill>/scripts/shoot.mjs \
  --url http://localhost:5173/projects --name projects \
  --url http://localhost:5173/projects/42 --name project-detail \
  --out agent-tracking/screenshots/<slug>
```

| Option | Default | Use |
|--------|---------|-----|
| `--widths` | `375,768,1024,1440,1920` | add `320` for the smallest phones |
| `--themes` | `light,dark` | `light` only if the app has no dark mode |
| `--theme-mode` | `media` | `class` when dark mode is a `.dark` class that ignores the system setting |
| `--wait <selector>` | — | wait for real content (e.g. a table row) |
| `--slow` | off | delays API responses ~1.5s: screenshot the skeleton and slow states |
| `--storage-state` | — | signed-in pages |
| `--no-full-page` | full page | viewport only (above-the-fold check) |

Output: `<name>-<width>-<theme>.png` per shot, `report.json` with every
check, and one line per shot (`ok` / `WARN` / `FAIL`). Exit code 1 means a
failing check.

Naming: before a change, shoot into `.../<slug>/before`; after, into
`.../<slug>/after`, so the report can show both. Design references go in
`.../<slug>/refs` (see `onespace-fe-design-ui/references/inspiration.md`).

Phones are emulated as mobile: a page wider than the screen is zoomed out to
fit, exactly as a real phone does. A tiny, zoomed-out 375 screenshot therefore
means horizontal overflow, even before you read `report.json`.

## Step 3 — Read every screenshot

The script catches mechanical failures. Only looking catches the rest. Open
each image (the Read tool shows images) and check:

- **Layout** — nothing clipped, overlapping, or off-screen; alignment and
  spacing consistent; no awkward empty areas at 1440 and 1920; content width
  capped on wide screens.
- **Responsive** — each width has a layout chosen for it
  (`onespace-fe-design-ui/references/responsive.md`); navigation works at
  375; tables reflow or scroll inside their container.
- **Theme** — dark mode has no unreadable text, white flashes, or
  hard-coded colours.
- **States** — with `--slow`, the skeleton matches the final layout; empty and
  error states look designed
  (`onespace-fe-design-ui/references/loading-states.md`).
- **Design** — nothing from `onespace-fe-design-ui/references/anti-patterns.md`.

For interactions the static shots cannot show (open a dialog, hover a row,
submit a form), write a short Playwright script in the scratch area that
performs the action and screenshots the result at 375 and 1440, or use the
Playwright MCP server if the host has one.

## Step 4 — Fix, re-shoot, repeat

Fix every `FAIL` and every defect you saw, then shoot again. `WARN` items
(small touch targets, duplicate GETs) are fixed unless there is a stated
reason. Stop when every shot is `ok` and every image is one you would ship.
Record each round in `progress.md`: the command, the ok/WARN/FAIL counts, and
what you fixed.

A `refactor` must look the same before and after: compare the `before` and
`after` images at each width; any visible difference is a regression.

## Step 5 — Hand over

- Link the final screenshots in the report's Screenshots section
  (`onespace-fe-workflow/references/VISUAL-REPORT.md`).
- Put the check results in Verification: per page and width, console errors,
  failed requests, overflow, axe.
- Pass the images to the critique step of `onespace-fe-design-ui`: what still
  looks weak, and 2–3 ideas for the user.

## When you cannot run a browser

No Node, no Chromium, or the app will not start? Say so plainly, record why
in `progress.md`, and give the user the exact `shoot.mjs` command to run. Never
claim a UI is verified without screenshots.
