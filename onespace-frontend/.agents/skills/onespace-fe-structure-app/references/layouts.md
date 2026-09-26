# Frontend Layouts

## Contents

1. Detection signals
2. Feature-based, Vite SPA (default)
3. Feature-based, Next.js App Router
4. Type-based (small apps)
5. Import rules that hold in every layout

---

## 1. Detection signals

| Signal | Suggests |
|--------|----------|
| `vite.config.*`, `index.html` at root, `src/main.tsx` | Vite SPA |
| `next.config.*`, `app/**/page.tsx` | Next.js App Router |
| `pages/**/*.tsx` + `next.config.*` | Next.js Pages Router (legacy; pitch App Router only in a dedicated task) |
| `react-router` / `@tanstack/react-router` in `package.json` | client routing; find the route tree (`routes.tsx`, `src/routes/`) |
| `src/features/*` or `src/modules/*` | feature-based |
| `src/components` with 40+ files mixing pages and primitives | mixed |
| `components.json` | shadcn/ui; primitives in the `ui` alias path |

## 2. Feature-based, Vite SPA (default)

```
src/
├── main.tsx                  # mounts <App/>, providers
├── app/
│   ├── providers.tsx         # QueryClientProvider, ThemeProvider, Toaster
│   ├── router.tsx            # route tree, lazy route components
│   └── layouts/              # AppShell, AuthLayout
├── routes/                   # one file per route: loads data, composes feature components
│   └── projects.tsx
├── features/
│   └── projects/
│       ├── api/              # jobsQueryOptions, useCreateJob — the only place that calls lib/api
│       ├── components/       # JobsTable, JobFilters, JobCard, JobsSkeleton
│       ├── hooks/            # feature-only hooks
│       └── types.ts          # feature types derived from the API schema
├── components/
│   ├── ui/                   # shadcn / design-system primitives (Button, Dialog, Skeleton)
│   └── common/               # app-wide composites (EmptyState, ErrorState, PageHeader)
├── hooks/                    # app-wide hooks (useMediaQuery, useDebouncedValue)
├── lib/
│   ├── api/                  # client.ts (fetch wrapper), schema.ts (generated types)
│   └── utils.ts              # cn() only; no grab bag
└── styles/
    └── globals.css           # Tailwind import, @theme tokens, base layer
```

Route files stay thin: read params, start the query, compose feature
components. A feature grows sub-folders only when it has files for them.

## 3. Feature-based, Next.js App Router

```
app/
├── layout.tsx                # html/body, fonts, providers
├── (dashboard)/
│   ├── layout.tsx            # AppShell
│   └── projects/
│       ├── page.tsx          # server component: prefetch, compose
│       ├── loading.tsx       # route skeleton
│       └── error.tsx         # route error boundary ("use client")
src/
├── features/projects/{api,components,hooks,types.ts}
├── components/{ui,common}/
├── lib/{api,utils.ts}
└── styles/globals.css
```

Keep `"use client"` at the leaves (interactive widgets), not on pages or
layouts. Server-only code (secrets, direct backend calls with tokens) imports
`server-only`.

## 4. Type-based (small apps)

```
src/
├── pages/        # one per route
├── components/   # ui/ + shared composites
├── hooks/
├── api/          # one file per backend resource
└── lib/
```

Move to feature-based when a type folder passes ~30 files.

## 5. Import rules that hold in every layout

- `components/ui` imports nothing from features, routes, or `lib/api`.
- A feature never reaches into another feature's `components/` or `api/`
  internals. Shared needs move to `components/common` or `hooks/`.
- Only the `api/` layer calls the network; components call hooks.
- Tests sit next to the file they test (`JobsTable.test.tsx`) unless the repo
  uses a separate `tests/` tree.
- No circular imports. `madge --circular src` (if installed) proves it.
