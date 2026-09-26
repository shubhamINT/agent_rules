---
name: onespace-fe-image-to-ui
description: >
  Build a OneSpace React page or component from a design image — a mockup,
  Figma or Sketch export, screenshot, Dribbble shot, or hand-drawn wireframe —
  given as a file path or a directory of images. Reads the image, asks for
  what the image cannot show (widths, states, data, fonts, assets), critiques
  the design and pitches improvements before building, lets the user choose,
  then builds it with the repo's components and tokens and proves the match
  with a pixel-diff script (mismatch %, diff heatmap, side-by-side) plus
  screenshots at every width. Use whenever the user shares or points to an
  image of a UI and wants it built — "make it look like this", "implement
  this design", "build this screen from the mockup", "here is the Figma
  export", "copy this layout", "designs/dashboard.png", "the images are in
  ./mockups" — even if they do not say "image". Runs inside
  onespace-fe-workflow as task type `image`.
---

# Image to UI

A design image is a strong spec with holes. It shows one width, one state,
placeholder text, and a font the repo may not have; it never shows hover,
loading, errors, or what happens at 375px. The expensive failures are the two
extremes: a pixel copy built with absolute positions and fixed heights that
falls apart on a phone, or a "close enough" page that drifts from the design
the user approved. This skill avoids both: fill the holes with the user first,
agree the improvements, then build real, responsive UI and measure how close
it is.

**Gate — before anything else:** load `onespace-fe-workflow`. If
`agent-tracking/plans/<slug>/scope.md` for this task is missing, run
`onespace-fe-workflow` phases 1–2 now (task type `image`, request recorded).
Invoking this skill directly (a slash command, a one-line request) is not an
exemption, and harness plan mode does not replace `plan.md`.

**Always, even inside another task:** make sure the repo is registered — the
onespace-fe block in `AGENTS.md` and the `@AGENTS.md` import in `CLAUDE.md`
(`onespace-fe-workflow`, Phase 2, "Register the pack") — follow
`onespace-fe-busl-licence-compliance` for every new file and asset, and finish
with the docs sync (`onespace-fe-workflow`, Phase 7) so the README matches the
code.

| Need | Read |
|------|------|
| How to extract grid, spacing, type, colour, radii, and components from an image | `references/design-read.md` |
| Weak-UI patterns to critique, responsive rules, motion, loading states | `onespace-fe-design-ui` and its references |
| Screenshots at every width and theme | `onespace-fe-verify-ui` |

`scripts/compare.mjs` needs Playwright in the target repo (`npm i -D
playwright && npx playwright install chromium`); ask before installing it.

---

## Step 1 — Intake (Phase 2–3 of the workflow)

1. **Find the images.** The user gives a file path or a directory. For a
   directory, list the image files (`png`, `jpg`, `jpeg`, `webp`) and confirm
   which are in scope. A pasted image with no file: ask the user to save it
   into the repo (for example `designs/`) and give the path, so the scripts
   can read it.
2. **Copy, never edit.** Copy each image to
   `agent-tracking/designs/<slug>/` with a clear name (`dashboard-1440.png`,
   `dashboard-375.png`). The originals stay untouched; the copies are the
   record of what was approved.
3. **Look at every image** with the Read tool. Tall image (height over about
   1.5× width)? Slice it first and read the tiles, because a tall image is
   downscaled and small text and spacing are lost:

   ```bash
   node <this-skill>/scripts/compare.mjs --ref agent-tracking/designs/<slug>/dashboard-1440.png \
     --slice --palette --out agent-tracking/designs/<slug>/read
   ```

4. **Work out the scale.** An image 2880px wide is usually a 1440px design
   exported at 2×; 750 is 375 at 2×. Record width, height, and assumed device
   pixel ratio per image in `scope.md`, and confirm with the user.

## Step 2 — Ask what the image cannot show

Ask in one message, with a recommended default for each, and only for what
the user has not already answered:

| Question | Default to propose |
|----------|--------------------|
| Target route or component, and where it lives | from `## Project structure` |
| Which width each image represents; how the other widths behave | the image is the design width; the other widths follow `onespace-fe-design-ui/references/responsive.md` — propose the collapse (e.g. sidebar becomes a sheet, 3-column grid becomes 1) |
| States the image does not show: hover, focus, active, disabled, loading, empty, error | skeletons and states from `loading-states.md`, styled from the design's tokens |
| Dark mode | derived from the design's palette if the app has dark mode |
| Real data or static content | real data through the repo's data layer if it exists; placeholder text replaced |
| Fonts | identify the typeface; use it if its licence allows, else the closest licensed match |
| Assets: logos, icons, photos, illustrations | icons from the repo's icon set; photos and logos are placeholders until the source and licence are confirmed (`onespace-fe-busl-licence-compliance`, Step 6) |
| Match target | ≤ 3% mismatch at the design width, outside agreed deviations |

Record the questions and answers in `scope.md`, end your turn, and wait.

## Step 3 — Design read (Phase 4)

Write the design read into `research/<slug>.md` following
`references/design-read.md`: layout and grid, spacing scale, type scale,
colour palette (from `palette.json`), radii, shadows, borders, iconography,
and a **component inventory** that maps every piece of the image to an
existing repo component, a variant of one, or a new component with the reason
no existing one fits (`onespace-fe-coding-standards`, `reuse-search-first`).

Map the design's values to the repo's tokens. A colour or spacing value the
repo lacks becomes a new token in the theme, never a hard-coded value in a
component (`style-tokens-only`).

## Step 4 — Critique and pitch, before building

This is where the agent earns its keep: do not just copy. Using
`onespace-fe-design-ui` (anti-patterns, responsive, motion, loading states),
tell the user what is weak or missing in the image, and why:

- contrast below WCAG AA, text too small, touch targets under 44px
- missing states, missing empty or error design
- inconsistent spacing, radii, or type sizes (list the values that disagree)
- layouts that cannot collapse to 375px as drawn
- generic or dated patterns listed in `anti-patterns.md`

Then pitch **2–3 concrete upgrades** that fit the design's own language:
motion for state changes, skeletons that match the layout, better hierarchy,
a command palette, sticky headers on long tables. For each: what, why, and
the cost.

The user picks. Each accepted change is an **intentional deviation**, recorded
in `plan.md` with the region of the image it affects (x, y, w, h in CSS px of
the design). Rejected ideas go to "Out-of-scope observations". Never apply an
improvement the user did not accept: the image is the spec until they say
otherwise.

## Step 5 — Plan (Phase 5)

`plan.md`, from the workflow template, adds:

- the images and their widths, and how the other widths behave
- new tokens, and components reused vs added
- steps section by section, top of the page first
- intentional deviations with their mask regions
- the match target, and every width and theme to verify

Show it and wait for explicit approval.

## Step 6 — Build and compare, section by section

1. **Tokens first**: colours, type scale, spacing, radii, shadows into the
   theme. Most of the match comes from getting these right.
2. **Layout skeleton**, then **one section at a time**, top to bottom.
3. After each section, compare at the design width:

   ```bash
   node <this-skill>/scripts/compare.mjs \
     --ref agent-tracking/designs/<slug>/dashboard-1440.png \
     --url http://localhost:5173/dashboard \
     --mask 960,120,420,300 \
     --out agent-tracking/screenshots/<slug>/compare-01
   ```

   Read `report.json` first: the overall `mismatchPct`, `sizeWarning`, and
   the five worst grid cells with their boxes. Then read only the crop images
   for those cells (`cell-rN-cM.png`: design on the left, build on the
   right), and `side-by-side.png` once per pass if the layout is off. Open
   `diff.png` only when you cannot tell from the crops where the difference
   is.
4. Fix the biggest cause first: wrong width or scale (see `sizeWarning`),
   then spacing and layout, then type, then colour, then detail.
5. Repeat until the target is met. Three passes with no real progress? Stop,
   show the user the side-by-side and the remaining differences, and ask
   whether they are acceptable.

**Never fake the match.** These make the number go down and the UI worse, and
are rejected:

| Fake | Why it fails |
|------|--------------|
| The design image, or a slice of it, used as a background or `<img>` | not real UI: no text, no a11y, no states |
| `position: absolute` with pixel offsets to line things up | breaks at every other width |
| Fixed heights and widths copied from the image | overflow as soon as real data arrives |
| Hard-coded colours and sizes instead of tokens | the next screen drifts |
| Tuning `--threshold` or adding masks to pass | hides the difference instead of fixing it; masks are only for agreed deviations and dynamic content (dates, avatars, charts with live data) |

Some difference is expected and fine: font rendering and anti-aliasing,
placeholder text replaced by real data, and the agreed deviations. Explain
the remaining mismatch rather than chasing the last percent.

Log each pass (mismatch %, what was fixed) in `progress.md`.

## Step 7 — Verify and report (Phase 7)

1. Final `compare.mjs` at the design width, for every image (for example the
   1440 and the 375 design), with only the agreed masks.
2. `onespace-fe-verify-ui` at every width and theme. The widths the image did
   not show must look designed, not merely not broken.
3. Licence: headers on new files, fonts and assets recorded
   (`onespace-fe-busl-licence-compliance`).
4. Report, from the workflow template, adds a **Design match** section: the
   reference and the build side by side per image, the diff heatmap, the
   mismatch % per pass (first and last), the deviations applied and their
   reasons, and the known limits.
