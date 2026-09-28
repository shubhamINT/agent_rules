# Safe delivery (frontend)

Every change in a plan (page, feature, refactor, bug fix) ships so that any
step can be stopped, verified, and undone without drama. This is not ceremony.
The goal is that a reviewer can approve each step alone, and that a bad
release is a five-minute revert, not an incident.

Use this when you write the **Steps** and **Delivery and rollback** sections
of `plan.md`.

## 1. Small steps, each green

- Each step changes one thing. It ends with type check, lint, tests and the
  step's screenshots passing. Fix a red step before the next one starts.
- Put risky or hard-to-undo parts last, after everything before them is proven.
- Prefer steps that are safe to ship alone: a component nothing renders yet, a
  route not linked from the nav, a hook no page calls yet.
- Refactor and behaviour change are separate steps. A diff that moves code and
  changes what it does cannot be reviewed.

## 2. Backend contracts: tolerate old and new

The frontend and the API deploy separately, and users keep old tabs open for
days. When a response shape, field, query param or endpoint changes:

1. **Expand:** the UI accepts both shapes (new field optional, old field still
   read). It ships first, or together with the backend's expand step.
2. **Migrate:** switch reads to the new field once the backend sends it
   everywhere.
3. **Contract:** delete the old-shape code in a later, separate change, after
   the backend stops sending it.

Never rename a field the UI reads in one step. Parse API data at the boundary
(schema or type guard) so an unexpected shape shows the error state instead of
a white screen.

## 3. State that outlives a deploy

Some things persist across releases, and the new code meets old data:

- **URLs and routes:** a renamed or removed route keeps a redirect from the old
  path. Bookmarks, emails and shared links still point there.
- **URL search params:** keep reading old param names, or map them to new ones.
- **`localStorage`, `sessionStorage`, IndexedDB, cookies:** version the key or
  the stored shape. Code must handle missing, old or corrupt values without
  crashing, and fall back to the default.
- **Query cache keys:** a changed key shape must not return stale data from the
  old shape.
- **Service workers and long-cached assets:** a stale cached bundle may call the
  new API. Know how the app updates clients (hashed filenames, SW update flow)
  before you change a shared contract.

## 4. Feature flags only when rollout risk warrants

A flag is justified when the change alters behaviour existing users rely on and
must be switched off faster than a deploy, or rolled out gradually. It is not
justified for a new page no one links to yet.

When you use one: default **off**, test both paths, and record a follow-up
task in `progress.md` to delete the flag and the dead path. A flag without a
removal task becomes permanent complexity.

## 5. Blast radius

State in the plan who is affected if this change is wrong. Examples: one
component on one page, one route, every page (layout, providers, router, global
CSS, design tokens, auth guard), or every build (bundler config, a dependency
upgrade). The larger the radius, the smaller the steps and the stronger the
verification: more pages and widths screenshotted, a flag, a staged rollout.

## 6. Rollback recipe: concrete

"Revert the commit" is a recipe only when the change is pure code. Write the
real steps:

- **Code only:** revert commit(s) `<which>` and redeploy. No data impact.
- **New dependency:** revert, reinstall from the lockfile, and confirm the
  build no longer includes the package.
- **New env var or build config:** revert, and remove or restore
  `<VAR>` in every environment.
- **Stored client data changed shape:** say what the old code does with data
  the new code wrote (reads it, ignores it, crashes). Make the old code tolerate
  it before you ship.
- **Flag:** set `<FLAG>` off. No deploy needed.
- **Things that cannot be rolled back** (emails sent, analytics events fired,
  data submitted to the backend): say so, and say how you would compensate.
