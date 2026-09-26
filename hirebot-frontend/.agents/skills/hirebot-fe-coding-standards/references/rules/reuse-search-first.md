---
title: Search for an existing component before creating one
impact: CRITICAL
impactDescription: prevents duplicate components, the main cause of UI drift
tags: reuse, components, search
---

# Search for an existing component before creating one

Every duplicate component is a second place to fix every future bug, and the
two copies drift apart visually. Before you create a component, hook, or
helper, search the repo for one that already does the job.

```bash
rg -n "export (default )?(function|const) \w*(Modal|Dialog)" src/
rg -ln "useQuery\(|queryKey" src/          # existing data hooks
ls src/components/ui 2>/dev/null           # shadcn / design-system primitives
```

Search by role, not only by name: a "Sheet" may be your "Drawer". Record what
you found in the research "reuse inventory" table.

**Incorrect:** creating `src/features/jobs/JobModal.tsx` with its own overlay,
focus handling, and close button while `src/components/ui/dialog.tsx` exists.

**Correct:**

```tsx
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function JobDetailsDialog({ job, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{job.title}</DialogTitle>
        <JobSummary job={job} />
      </DialogContent>
    </Dialog>
  );
}
```

Nothing close exists? Create it in the shared UI folder if two features will
use it, in the feature folder otherwise.
