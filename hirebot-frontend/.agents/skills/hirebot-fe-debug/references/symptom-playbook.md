# Symptom Playbook

Classify the symptom, then work down its table: the usual causes in rough
order of frequency, and the cheapest check that confirms or kills each one.
These are leads for hypotheses, not answers — prove the cause before fixing.

## Contents

1. Layout: overflow, overlap, wrong size, broken at one width
2. Component does not update
3. Render loop / "Maximum update depth exceeded"
4. Stale or wrong data
5. Requests fire twice, out of order, or never
6. Hydration mismatch (Next.js / SSR)
7. Clicks, focus, and keyboard
8. Crash, blank screen, error boundary
9. Slow page, janky interaction
10. Works in dev, fails in prod (or one browser)

---

## 1. Layout: overflow, overlap, wrong size, broken at one width

| Likely cause | Cheapest check |
|--------------|----------------|
| Fixed width or `min-width` wider than the viewport (`w-[600px]`, a table, a long URL or email with no wrapping) | `shoot.mjs` report lists the overflowing elements; inspect their computed width |
| Flex child that will not shrink (`min-width: auto` on flex items) | add `min-w-0` to the child in DevTools; if it fixes it, that is the cause |
| Grid column with content wider than the track (`1fr` = `minmax(auto, 1fr)`) | try `minmax(0,1fr)` in DevTools |
| Missing responsive variant (desktop classes with no mobile base) | read the class list mobile-first: what applies at 375? |
| `100vh` on mobile behind browser bars | swap to `100dvh` in DevTools |
| Stacking context traps `z-index` (a parent with `transform`, `filter`, `opacity < 1`, `position` + `z-index`, `isolation`) | walk up the parents in DevTools, look for a property that creates a stacking context |
| Portal content clipped by `overflow: hidden` ancestor | does the popover render inside the clipped element? Radix/shadcn portal it by default |
| Font loading shifts layout (CLS) | throttle network, watch the text reflow; check `font-display` and size-adjust |
| Dark mode only: hard-coded colour | search the component for hex / `bg-white` / `text-black` |

## 2. Component does not update

| Likely cause | Cheapest check |
|--------------|----------------|
| State mutated in place (`arr.push`, `obj.x = …` then `setState(obj)`) | log `Object.is(prev, next)` in the setter, or read the handler |
| Props copied into state once (`useState(props.value)`) | does the child have a `useState(prop)`? Change the prop in DevTools and watch |
| Stale closure: handler or effect captured an old value | log the value inside the callback vs. in render; check the effect's dependency array |
| Memoized with missing deps (`useMemo`, `useCallback`, `memo` with custom compare) | temporarily remove the memo; if it updates, the deps are wrong |
| Server-state cache not invalidated after a mutation | check the mutation's `onSuccess` / invalidation and the query key it targets |
| Query key does not include the variable (`['jobs']` instead of `['jobs', filters]`) | read the key; log it in the query function |
| External store read without subscription (reading `window` or a module variable in render) | is the source outside React? Use `useSyncExternalStore` or the store's hook |
| Next.js: server component data cached | check `fetch` cache options, `revalidate`, `router.refresh()` after mutation |

## 3. Render loop / "Maximum update depth exceeded"

| Likely cause | Cheapest check |
|--------------|----------------|
| `setState` during render (not in a handler or effect) | the stack trace points at the component body |
| Effect sets state that is in its own dependency list | read the effect: does it set something it depends on? |
| Object/array/function created in render used as an effect dependency | the dependency is a literal `{}` / `[]` / arrow in the component body |
| Handler called instead of passed: `onClick={handle()}` | read the JSX |
| Parent re-creates a prop every render and the child's effect depends on it | React DevTools "why did this render" (Profiler, record why each component rendered) |

## 4. Stale or wrong data

| Likely cause | Cheapest check |
|--------------|----------------|
| Race: a slow earlier response overwrites a newer one | `capture.mjs` network log: request order vs response order; type fast in a search box |
| Cache shows old data (long `staleTime`, no invalidation) | open the data library devtools; check the entry's age and key |
| Wrong key or id used (index key, reused component with new props but old state) | check `key` on the list/component; does state belong to the previous item? |
| Response parsed or mapped wrongly (field renamed in the backend) | compare the raw response in the network log with the generated types |
| Time zone / locale formatting | reproduce with another `timezoneId` / `locale` in Playwright |
| Optimistic update never rolled back on error | force the request to fail, watch the UI |

## 5. Requests fire twice, out of order, or never

| Likely cause | Cheapest check |
|--------------|----------------|
| React StrictMode double-invokes effects in development | does it happen in the production build? If not, it is StrictMode exposing a missing cleanup |
| Fetch in `useEffect` without cleanup/abort | read the effect; add an abort and see if duplicates stop affecting state |
| Two components request the same data with different keys | `capture.mjs` duplicate GETs; compare keys |
| Waterfall: child waits for parent's data before starting | network log start times; parent and child requests should start together |
| Request never fires: query `enabled` false, or a condition in the effect | log the condition; check the data library devtools |
| CORS / auth failure shown as "no data" | network log status and the console CORS error |

## 6. Hydration mismatch (Next.js / SSR)

| Likely cause | Cheapest check |
|--------------|----------------|
| Rendering `Date.now()`, `Math.random()`, `new Date().toLocaleString()` | search the component; the error diff shows the differing text |
| Reading `window`, `localStorage`, media queries during render | search for browser APIs outside effects |
| Invalid HTML nesting (`<div>` inside `<p>`, `<a>` inside `<a>`, `<button>` inside `<button>`) | the console names the element; validate the markup |
| Browser extensions injecting attributes | reproduce in a clean Playwright browser (`capture.mjs`) |
| Theme set before hydration (dark class) | use the theme library's script (`next-themes`) and `suppressHydrationWarning` on `<html>` only |

## 7. Clicks, focus, and keyboard

| Likely cause | Cheapest check |
|--------------|----------------|
| An invisible element covers the target (overlay, pseudo-element, `pointer-events`) | Playwright reports "element intercepts pointer events"; DevTools element picker at that point |
| Handler on a non-interactive element (`div onClick`) — no keyboard, no focus | tab to it; does it get focus and respond to Enter/Space? |
| Form submits and reloads the page | a `<button>` inside a `<form>` defaults to `type="submit"` |
| `disabled` or `aria-disabled` left on | inspect the attribute after loading finishes |
| Focus lost after re-render (component remounted by a changing key) | watch `document.activeElement` across the update |
| Dialog/menu focus not trapped or not returned | tab through with the dialog open; close it and check where focus lands |
| Touch only: hover-dependent UI, 300ms delay myths, tiny targets | `shoot.mjs` touch-target warnings; `capture.mjs --width 375` uses touch emulation |

## 8. Crash, blank screen, error boundary

| Likely cause | Cheapest check |
|--------------|----------------|
| Reading a property of `undefined` while data is loading or empty | the console stack trace; which state was the data in? |
| Backend contract changed (field removed or renamed) | compare the response with the generated types; regenerate them |
| No error boundary, so one widget takes down the page | where is the nearest boundary? |
| Lazy chunk failed to load after a deploy (`ChunkLoadError`, "Failed to fetch dynamically imported module") | network log for 404 on a JS chunk; old tab after a deploy |
| Env variable missing at build time (`undefined` base URL) | log the value; check `.env` and the build command |

## 9. Slow page, janky interaction

| Likely cause | Cheapest check |
|--------------|----------------|
| Too many re-renders (state too high, context value re-created every render) | React Profiler: commit count and which components render on each keystroke |
| Expensive work in render (sorting or filtering thousands of rows) | Profiler flame chart; time it with `performance.now()` |
| Long lists not virtualized | row count in the DOM |
| Large bundle / no route splitting | bundle analyzer; network log size of JS on first load |
| Layout thrashing (reading layout then writing in a loop), animating `width`/`top` | Chrome Performance panel shows forced reflows |
| Images unoptimized or without dimensions | network log sizes; CLS in Lighthouse |

## 10. Works in dev, fails in prod (or one browser)

| Likely cause | Cheapest check |
|--------------|----------------|
| Env variable not exposed or not set at build time | `VITE_*` / `NEXT_PUBLIC_*` prefix present? value set in the build environment? |
| Code relying on StrictMode double effects or dev-only warnings | reproduce with the local production build |
| Minification breaks name-based logic (`constructor.name`, `fn.name`) | search for `.name` checks |
| Tailwind class built from string pieces is purged (`bg-${color}-500`) | is the full class name present in the source? |
| Base path / asset URL wrong on the deployed path | network log 404s on assets |
| Browser support (Safari: date parsing of `"2026-09-26 10:00"`, some CSS features) | reproduce in WebKit; check caniuse |
