# README Standard (frontend)

The README is part of the deliverable. **A change to scripts, env variables,
dependencies, setup steps, routes, or folders is not complete until the README
reflects it in the same change.** The test: a developer who has never seen the
repo can clone it, install, run it against a backend, and find where to add a
page, using only the README.

## Required sections, in order

1. **Title + what it is** — one paragraph: what the app does and for whom.
   One screenshot (from `agent-tracking/screenshots/`) is welcome.
2. **Requirements** — Node version (match `.nvmrc` / `engines`), package
   manager and version (match the lockfile: `pnpm-lock.yaml`,
   `package-lock.json`, `yarn.lock`, `bun.lock`), and the backend it talks to.
3. **Getting started** — copy-paste steps that work on a clean machine:

   ```bash
   pnpm install
   cp .env.example .env        # then set VITE_API_URL
   pnpm dev                    # http://localhost:5173
   ```

   Plus how to build and preview a production build, and how to point the app
   at a local or remote backend.
4. **Scripts** — a table of every `package.json` script: name, what it does,
   when to use it. Must match `package.json` exactly.
5. **Environment** — a table of every variable: name, example value, required
   or optional, what it does. Must match `.env.example` exactly. Mark which are
   exposed to the browser (`VITE_*`, `NEXT_PUBLIC_*`) and state that no secret
   may go in them.
6. **Project structure** — the folder tree with a one-line comment per entry,
   matching `## Project structure` in `AGENTS.md`.
7. **Stack** — a table of layer and technology: framework, router, styling,
   components, icons, motion, data fetching, forms, tests, lint/format.
8. **Conventions** — short: where a new page, component, and hook go; how to
   add a shadcn component (`npx shadcn@latest add <name>`) if the repo uses
   shadcn; how to run lint, types, tests, and the screenshot check
   (`hirebot-fe-verify-ui`).

Add sections the repo needs (deployment, feature flags, i18n) after these.

## Rules

- Read the README before changing anything. Missing? Create it with the
  sections above.
- Take values from the source, never from memory: scripts from
  `package.json`, variables from `.env.example` (create it if variables exist
  only in code — grep `import.meta.env` / `process.env`), ports from the
  bundler config, the tree from the file system.
- After every change, re-read the **whole** README for staleness. Scripts, env
  variables, and the structure tree drift first.
- Keep it short and scannable: tables and code blocks over paragraphs.
- Never put secrets, real tokens, or internal-only URLs in the README.
