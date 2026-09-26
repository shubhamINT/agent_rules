# Debugging Tools

Use the tool that answers the current hypothesis fastest. Record the command
and what it showed in `research/<slug>.md`.

## In the browser (headless, via Playwright)

- **`scripts/capture.mjs`** (this skill) — runs steps against a URL and saves
  `console.json` (type, text, source location), `network.json` (method, URL,
  status, duration, start time, type), `errors.json` (uncaught exceptions with
  stacks), screenshots at `shot` steps, and `trace.zip`.
  Open the trace with `npx playwright show-trace <out>/trace.zip`: a
  timeline of every action with DOM snapshots, console, and network — the
  closest thing to watching the bug happen.

  Steps (JSON array, run in order; selectors are Playwright locators such as
  `role=button[name="Save"]`, `text=Open`, `#email`, `[data-testid=row]`):

  | Step | Example |
  |------|---------|
  | click | `{"click": "role=button[name=\"Save\"]"}` |
  | fill | `{"fill": ["#email", "a@b.co"]}` |
  | press | `{"press": "Enter"}` |
  | hover | `{"hover": "text=Member"}` |
  | select | `{"select": ["#status", "open"]}` |
  | wait (ms or selector) | `{"wait": 800}`, `{"wait": "role=row"}` |
  | goto | `{"goto": "http://localhost:5173/projects/2"}` |
  | eval (read a value) | `{"eval": "document.activeElement?.outerHTML"}` |
  | shot | `{"shot": "after-save"}` |

  Options: `--width`, `--height`, `--theme light|dark`, `--browser
  chromium|webkit|firefox` (installed ones only), `--slow` (delay API
  responses 1.5s), `--offline-api` (fail API requests), `--storage-state`,
  `--timezone`, `--locale`, `--headed` (needs a display).
- **`onespace-fe-verify-ui/scripts/shoot.mjs`** — static screenshots at all
  widths and themes with overflow, console, request, and axe checks.
- For anything the step list cannot express, write a short Playwright script
  in the scratch area.

## React

- **React DevTools** (in a headed browser, when the user can run it): the
  component tree with props, state, and hooks; "Highlight updates when
  components render"; the Profiler's "Record why each component rendered".
  Headless, log instead: `console.count('JobsTable render')` and
  `console.log` of the props in question, captured by `capture.mjs`. Remove
  every debug log before the fix is done.
- **StrictMode** double-invokes render and effects in development to expose
  missing cleanups. A bug that appears only in dev is usually a real missing
  cleanup.
- **Data library devtools** (TanStack Query Devtools, Redux DevTools): cache
  entries, keys, age, and fetch status.

## Tests

- Vitest or Jest + React Testing Library + `@testing-library/user-event`.
  Reproduce the bug as a test when it lives in logic or rendering.
- Mock the network at the network layer (MSW) with the real response shape,
  so the test fails for the same reason the app does.
- `vi.useFakeTimers()` / `jest.useFakeTimers()` for debounce, polling, and
  time-dependent UI.
- Loop a flaky test: `for i in $(seq 50); do npx vitest run path -t "name" || break; done`.

## History

- `git log -p --since="3 days ago" -- src/features/projects`
- `git diff <good>..<bad> -- package.json <lockfile>` for dependency bumps.
- `git bisect start <bad> <good>` then `git bisect run <repro command>`
  (the command must exit non-zero when the bug is present; `capture.mjs` exits
  1 on console errors, page errors, or failed requests).

## Production build

- Build and serve locally: `npm run build && npm run preview` (Vite) or
  `npm run build && npm start` (Next.js).
- Keep source maps on for the local build (`build.sourcemap: true` in Vite)
  so stack traces point at source lines.
- Compare env variables between the local and the deployed build.

## Performance

- React Profiler (DevTools) for render counts and cost per commit.
- Lighthouse (`npx lighthouse <url> --view` or Chrome DevTools) for LCP, CLS,
  TBT; `web-vitals` in the app for real INP.
- Bundle size: `vite-bundle-visualizer` / `rollup-plugin-visualizer` (Vite),
  `@next/bundle-analyzer` (Next.js).
- Playwright CPU throttling via CDP for low-end devices:
  `await (await page.context().newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: 4 })`.
- Always report numbers before and after the change.
