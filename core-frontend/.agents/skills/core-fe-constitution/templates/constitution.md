# Constitution

- **Version:** 1.0.0
- **Ratified:** YYYY-MM-DD
- **Owner:** <name/role>

Standing rules every plan must pass. Each principle has a gate question a plan
answers yes or no. Stricter than the coding standards, never looser. Change it
only through `core-fe-constitution`, with the user's approval.

## Principles

Starter set; keep, drop, or reword with the user before ratifying.

| # | Principle | Rule | Gate question |
|---|-----------|------|---------------|
| 1 | Test-first behaviour | Every behavioural acceptance criterion has a failing test before its code exists. | Does every behavioural `AC-n` have a test step that runs before its code step? |
| 2 | Simplicity and reuse | Reuse an existing component, hook, or token before writing one; no wrapper without a named reason. | Does the plan list the reuse inventory and justify each new component? |
| 3 | Every state designed | Loading, empty, error, and partial-data states exist for every data view. | Does the plan cover all four states for every data view? |
| 4 | Accessible by default | Keyboard operable, visible focus, named controls, sufficient contrast. | Does the plan state keyboard behaviour and accessible names? |
| 5 | Responsive and themed | Works at 375, 768, 1024, 1440, 1920 px, in every theme the app has. | Does the plan name the widths and themes to verify? |
| 6 | Tokens, not literals | Colours, spacing, and type come from design tokens, not literals. | Does the plan use existing tokens, and name any new one? |

For each principle kept, add a one-line **Why** below.

- **<Principle>:** <why it matters in this repo>

## Governance

- A violation is allowed only when the plan records it under Complexity
  tracking, with the reason and the simpler alternative rejected.
- `core-fe-analyze` treats an unrecorded violation as Critical.
- Amendments need the user's approval and a version bump.

## Amendment log

| Date | Version | Change | Reason |
|------|---------|--------|--------|
| YYYY-MM-DD | 1.0.0 | Ratified | |
