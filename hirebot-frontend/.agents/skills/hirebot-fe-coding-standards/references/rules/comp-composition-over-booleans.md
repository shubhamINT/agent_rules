---
title: Composition over boolean props
impact: HIGH
impactDescription: components stay small as requirements grow
tags: composition, props, compound
---

# Composition over boolean props

Each boolean prop doubles the states a component can be in. Once a component
has `showHeader`, `showFooter`, `isCompact`, and `hasActions`, nobody can tell
which combinations work. Pass parts as `children`, or use compound components.

**Incorrect:**

```tsx
<JobCard job={job} showStatus showActions isCompact hideSalary />
```

**Correct:**

```tsx
<JobCard job={job}>
  <JobCard.Status />
  <JobCard.Actions>
    <Button size="sm">Shortlist</Button>
  </JobCard.Actions>
</JobCard>
```

A small, fixed set of looks is a `variant` (`reuse-extend-not-fork`), not
several booleans. React 19: `ref` is a normal prop; do not add `forwardRef` to
new components.
