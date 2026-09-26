# Loading, Slow, Empty, Error States

Every view that shows backend data designs all of its states, with the same
care as the success state. The goal: the user always sees something meaningful
and always knows what is happening. This file is about what the user *sees*;
how the data is fetched is the developer's choice (use the repo's data layer).

## The states

| State | When | Show |
|-------|------|------|
| Loading (first) | no cached data yet | skeleton shaped like the final content |
| Refreshing | cached data, refetch in background | the cached data; at most a small indicator |
| Placeholder | filter / page change | previous data dimmed (`opacity-60`), inline progress |
| Slow | still loading after ~2–3s | the skeleton **plus** a short message ("Still loading members…") |
| Very slow / long job | > ~8–10s, or a known long AI job | progress steps, partial results, and a way to leave and come back |
| Empty | success, zero items | explanation + the next action ("No members yet. Invite a teammate or import a CSV.") |
| No results | filter matched nothing | say which filter, offer "Clear filters" |
| Error | request failed | human message, **Retry**, the rest of the page still working |
| Unauthorised / no access | 401 / 403 | sign-in redirect / "You don't have access" with who to ask |
| Success | data | the real UI |

## Skeletons

- Shaped like the real content: same grid, same row height, same number of
  visible rows, avatar circles where avatars go. Swap in the content with no
  layout shift.
- Build them from the shadcn `Skeleton` (or the repo's), next to the component
  they mimic (`JobsTable` → `JobsTableSkeleton`).
- Skeleton only the part that loads; headers, filters, and navigation render
  immediately.
- Avoid a flash on fast responses: delay showing the skeleton ~150–200ms, or
  keep the previous data on screen (most data libraries have an option for it).
- Never a full-page spinner. Spinners are only for small inline actions (a
  button while its mutation runs).

```tsx
export function JobsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="divide-y rounded-lg border">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
```

## Slow and long waits — keep the user engaged

OneSpace runs AI work (summarising, generating, analysing documents) that can take
seconds to minutes. Waiting is fine; waiting blind is not.

- **Say what is happening** in steps: "Reading files → Extracting data →
  Summarising" with the current step highlighted, driven by the job status from
  the backend (not a fake timer).
- **Show partial results** as they arrive: stream text token by token; add
  rows to the list as each one finishes.
- **Let the user leave**: long jobs continue in the background; a toast or
  badge tells them when it is done.
- **Be honest about time**: a real progress bar only with real progress;
  otherwise an indeterminate indicator with the step text.
- **Offer a way out**: Cancel for long jobs; Retry on failure.

### Streaming text

```ts
const res = await fetch(url, { method: "POST", body, signal });
const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  setText((t) => t + value);
}
```

Show a blinking caret while streaming; keep the container height stable
(`min-h`) so the page does not jump; announce completion to screen readers
(`aria-live="polite"` on the region).

## Error states

- Local to the region that failed; the rest of the page keeps working.
- Human words, the next step, and **Retry** (re-run the request or reset the
  error boundary).
- Mutation errors: a toast plus the form staying filled in; never lose the
  user's input.
- Log the technical detail (console in dev, the repo's error reporter in prod).

## Perceived speed checklist

- [ ] Header, navigation, and filters render before data arrives.
- [ ] Every data region has a skeleton that matches its final layout.
- [ ] Returning to a page shows cached data instantly.
- [ ] Links to detail pages prefetch on hover / focus.
- [ ] Filters and pagination keep previous data on screen.
- [ ] Optimistic updates for quick, reversible actions.
- [ ] A message appears if loading passes ~2–3 seconds.
- [ ] Long AI jobs show steps or partial results and can run in the background.
- [ ] No layout shift when content replaces the skeleton.
