---
name: hirebot-fe-debug
description: >
  Evidence-first debugging of the HireBot React frontend (Vite SPA or Next.js):
  reproduce the bug in a real browser or a failing test, classify the symptom,
  rank hypotheses, test them (in parallel with investigator subagents when
  available), prove the root cause, fix it at the narrowest layer, keep a
  regression test, and prove the fix with screenshots at every width. Covers
  broken layouts, blank screens, components that do not update, infinite
  re-renders, stale or wrong data, requests firing twice or out of order,
  hydration mismatches, focus and click problems, console errors, slow pages,
  and bugs that only happen in production builds, one browser, or one screen
  size. Use whenever something in the UI is broken or behaves unexpectedly —
  "the page is blank", "button does nothing", "state not updating", "it
  flickers", "shows old data", "infinite loop", "Maximum update depth
  exceeded", "hydration failed", "works locally not in prod", "breaks on
  iPhone", "it's slow", a pasted console error or stack trace — even if the
  user only says "fix this". Runs inside hirebot-fe-workflow as task type
  `fix`.
---

# Debug

The expensive frontend debugging failure is the fix that hides the symptom: a
`setTimeout` that wins a race most of the time, a `key={Math.random()}` that
forces a remount, `!important` or `z-index: 9999`, an `eslint-disable` on the
hooks rule, `suppressHydrationWarning`. The bug is still there, now harder to
find. This skill stops that by demanding evidence at each step: no fix is
written until the bug is reproduced and the root cause is shown, not guessed.

**Gate — before anything else:** load `hirebot-fe-workflow`. If
`agent-tracking/plans/<slug>/scope.md` for this task is missing, run
`hirebot-fe-workflow` phases 1–2 now (task type `fix`, request recorded).
Invoking this skill directly (a slash command, a one-line request) is not an
exemption, and harness plan mode does not replace `plan.md`. Scoping is
light: the bug report is the scope. Ask only for what is missing from:

- **Symptom** — what the user sees (a screenshot helps), the exact console
  error, or the wrong value.
- **Expected** behaviour.
- **Where** — route or component, browser and device, screen width, theme,
  signed-in role, dev server or production build.
- **When** — always or intermittent, since when, what changed recently
  (deploy, dependency bump, backend change).
- **Constraints** — hotfix now vs proper fix.

If the user pasted an error and the fix looks obvious, still reproduce it —
the reproduction becomes the regression test.

**Always, even inside another task:** make sure the repo is registered — the
hirebot-fe block in `AGENTS.md` and the `@AGENTS.md` import in `CLAUDE.md`
(`hirebot-fe-workflow`, Phase 2, "Register the pack") — and finish with the
docs sync (`hirebot-fe-workflow`, Phase 7) so the README matches the code.

| Need | Read |
|------|------|
| Symptom → likely causes → cheapest check, per bug class | `references/symptom-playbook.md` |
| Browser, React, network, and test tools; production-build and perf debugging | `references/tools.md` |

---

## Phase 4 — Reproduce, then investigate

Log everything in `research/<slug>.md` as you go.

### 4.1 Reproduce

Write the smallest thing that shows the bug, in this order of preference:

1. **A failing component or hook test** (Vitest or Jest + React Testing
   Library) — best for logic, state, and rendering bugs; it becomes the
   regression test. Query by role and label, drive it with `user-event`.
2. **A browser repro with `scripts/capture.mjs`** — for bugs that need a real
   browser: interactions, network timing, focus, scrolling, layout. It runs
   the steps you give it and saves console output with source locations, every
   request with status and timing, screenshots, and a Playwright trace:

   ```bash
   node <this-skill>/scripts/capture.mjs --url http://localhost:5173/jobs \
     --steps '[{"click":"role=button[name=\"Filters\"]"},{"click":"text=Open"},{"wait":500},{"shot":"after-filter"}]' \
     --width 375 --out agent-tracking/screenshots/<slug>/repro
   ```

   If the repo has Playwright tests, turn the repro into one at the end.
3. **Screenshots at the failing width** with `hirebot-fe-verify-ui` — for
   purely visual bugs (overflow, overlap, dark-mode contrast).
4. **Production-only bugs** — build and serve the production bundle locally
   (`npm run build` then `npm run preview` / `next start`) and reproduce
   there. Never debug against production data or real user credentials.

Run it and record the failure verbatim. Cannot reproduce? Say so, list what
was tried (widths, browsers, roles, dev vs prod build, slow network with
`shoot.mjs --slow`), and ask for more data: a screen recording, the exact
URL, the browser version, the console output. Do not fix a bug you cannot
see — unless the user explicitly accepts a speculative fix, which is then
labelled as such everywhere.

### 4.2 Classify and gather evidence

- **Classify the symptom** with `references/symptom-playbook.md`: layout,
  not updating, render loop, stale data, request race, hydration, event and
  focus, crash or blank screen, performance, environment-only. The class gives
  you the usual causes and the cheapest check for each.
- **Read the failing path end to end**: route → page → component → hook →
  data call → response, plus the CSS that styles the broken element.
- **Use the right tool** (`references/tools.md`): React DevTools for props,
  state, and why a component rendered; the network log from `capture.mjs` for
  request order and duplicates; computed styles for layout.
- **History**: `git log -p --since=<when it started> -- <paths>`, and the
  lockfile diff for dependency bumps. With a known good commit:
  `git bisect run <repro command>`.
- **Compare with a working case**: which width, browser, role, data, or
  build differs?

### 4.3 Rank hypotheses

Write 2–5 hypotheses in research, each with: the mechanism, the evidence for
and against, and the cheapest check that would confirm or kill it. Rank by
likelihood × cheapness of the check.

### 4.4 Test hypotheses

Check the top hypothesis first. When two or more are independent and each
needs real reading or running, delegate one per `investigator` subagent in
parallel (`hirebot-fe-workflow/references/SUBAGENTS.md`); brief each with the
repro command and the single hypothesis to confirm or kill, with `file:line`
evidence. Verify what they return before trusting it.

Change one thing at a time. A check you cannot explain the result of is not
evidence.

### 4.5 State the root cause

One paragraph: the defect, the exact `file:line`, the mechanism from user
action to symptom, and the evidence that proves it (the repro now explained, a
console line, a render count, a request order, a bisected commit). "The fix
makes the symptom go away" is not proof of cause — explain why it happened.

Then ask: **where else does this bug class live?** (the same missing effect
cleanup in sibling components, the same fixed width in other cards). Record
hits as out-of-scope observations; tell the user; do not fix them unasked.

## Phase 5 — Plan the fix

In `plan.md`: root cause (link to research), the fix at the narrowest
responsible layer, the regression test, the widths and themes to re-shoot,
and the rollback. If the proper fix is large, offer two options — a contained
hotfix now and the structural fix as a follow-up task — with a
recommendation.

Get approval. For an urgent production bug the user may approve in one line;
the record is still written.

## Phase 6 — Fix and prove

1. The repro is red on the unfixed code. (If it was a `capture.mjs` run, keep
   its output as the "before".)
2. Apply the smallest fix that removes the cause, following
   `hirebot-fe-coding-standards`. These are symptom masks, not fixes, and are
   rejected unless the root cause section explains why they are correct:

   | Mask | What it hides |
   |------|---------------|
   | `setTimeout` / `requestAnimationFrame` to "wait for" something | a race or wrong effect order |
   | `key={Math.random()}` or a changing key to force remount | state that should reset or derive |
   | `// eslint-disable-next-line react-hooks/exhaustive-deps` | a stale closure or an effect that should not exist |
   | `!important`, `z-index: 9999` | a specificity or stacking-context problem |
   | `overflow: hidden` on `body` or a wrapper | the element that overflows |
   | `suppressHydrationWarning` on real content | server and client rendering different things |
   | `try/catch` that swallows, `?.` sprinkled until it stops crashing | missing data states or a wrong contract |
   | `// @ts-ignore`, `as any` | a type that tells the truth about the bug |

3. The repro is green. Tests, types, and lint are green.
4. **Visual proof**: run `hirebot-fe-verify-ui` on the affected pages at every
   width and theme — a fix at 768px must not break 375px. Read every image.
5. For non-trivial fixes, a `reviewer` subagent (or your own separate review
   pass) checks the diff against the root cause: does it fix the mechanism,
   and only that?
6. Log the step in `progress.md`.

## Special cases

**Flaky UI tests.** Treat as a real bug until proven otherwise. Usual causes:
asserting before an async update (use `findBy*` / `waitFor`, not sleeps),
shared state between tests (query client, stores, MSW handlers not reset),
timers and dates (control them with fake timers), animations, test order. Run
the test many times in a loop to measure the failure rate before and after.
Never add a retry or a longer timeout as the fix.

**Slow pages and janky interactions.** Measure first (`references/tools.md`,
"Performance"): React Profiler for render cost and counts, Lighthouse or
`web-vitals` for LCP, INP, and CLS, a bundle analyzer for size. Change one
thing, re-measure, report numbers before and after.

**One browser only.** If the repo's Playwright has WebKit or Firefox
installed, reproduce there (`capture.mjs --browser webkit`). Check the
feature on caniuse and the browser's console for unsupported APIs.

**Production build only.** Minification, dead-code elimination, env variables
baked at build time, StrictMode double effects (development only), and
server/client differences in Next.js. Reproduce with the local production
build and source maps.

## Phase 7 — Report

Write the report to `agent-tracking/reports/<slug>.html` (or `.md`) from the
`hirebot-fe-workflow` template, never to the repo root, the temp directory,
or a hosted page. Required: symptom (with the "before" screenshot or console
line), root cause with `file:line` and evidence, a sequence diagram of the
failing path (user action → component → hook → request → render) with the
defect marked, the fix (Current → Target of the changed step), the regression
test name, verification before and after including screenshots, same-class
occurrences found elsewhere, and follow-up tasks.
