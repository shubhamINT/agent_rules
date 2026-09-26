---
title: No props, options, or abstractions without a caller today
impact: CRITICAL
impactDescription: less code to read, test, and break
tags: yagni, minimal, props
---

# No props, options, or abstractions without a caller today

Code for "later" is code nobody calls, and it is still read, reviewed, and
broken by every change. Write what today's task needs.

Signs of speculative code:
- a prop no caller passes, or a `variant` union with one member
- a wrapper component that only forwards props (`<MyButton {...props} />`)
- a generic `<DataRenderer config={…}>` for one screen
- a context, store, or reducer for state one component uses
- a new folder or barrel file with one file in it

**Incorrect:**

```tsx
type CardProps = {
  title: string; subtitle?: string; icon?: ReactNode; footer?: ReactNode;
  onClose?: () => void; collapsible?: boolean; elevation?: 0 | 1 | 2 | 3;
}; // the only caller passes title and children
```

**Correct:**

```tsx
export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
```

Add the prop in the change that first needs it.
