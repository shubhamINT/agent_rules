---
name: onespace-fe-busl-licence-compliance
description: >
  Enforces OneSpace BUSL-1.1 licence compliance in React / TypeScript frontend
  repositories. Use when creating a new frontend repo or app, creating any new
  source file (.ts, .tsx, .js, .jsx, .css, .scss, index.html), adding or
  upgrading an npm dependency, adding a font, icon set, illustration, image,
  or animation file, building UI from a design image that contains logos or
  photos, modifying a file that has no licence header, or when asked to "make
  this repo compliant", "add the licence", "check licensing", or "add licence
  headers". Also use before the first commit of any new repo. Carries its own
  LICENSE/NOTICE templates and an idempotent header script, so it works
  unchanged in any repository it is copied into.
---

# BUSL-1.1 Licence Compliance (frontend)

OneSpace is licensed under the **Business Source License 1.1 (BUSL-1.1)** — a
source-available licence, not open source. Clients may see, deploy, and modify
the code for their own internal use. They may **not** resell it, white-label it,
or host it as a service for others without a separate commercial agreement with
Indus Net Technologies   (INT).

Every repository, and every source file in it, must carry the notices below.
This is a legal obligation, not a style preference — apply it consistently.
A frontend ships more than code: fonts, icons, images, and animations are
distributed to every browser, so their licences matter as much as npm's.

Licence parameters (never alter these):

| Parameter | Value |
|-----------|-------|
| Licensor | Indus Net Technologies   |
| Licensed Work | OneSpace Platform |
| Change Date | Four years from the date of the first public release |
| Change License | Apache License, Version 2.0 |
| Additional Use Grant | Single-instance internal production use; internal modification permitted; no commercial service to third parties, resale, sublicensing, white-labelling, or hosting-as-a-service without a separate commercial licence from INT |
| Commercial enquiries | licensing@intglobal.com |

---

## Step 1 — Root `LICENSE` must exist

Every repository needs a `LICENSE` file at the project root, containing the full
BUSL-1.1 text with the parameters above filled in.

- **Missing?** Copy `templates/LICENSE` from this skill to the repo root.
- **Present?** Treat it as **read-only**. Never delete, rename, or edit it.

Do this before the first commit of a new repo.

## Step 2 — Header on every source file

Every source file carries a copyright and licence notice at the very top, before
any imports or code: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.css`,
`.scss`, and `index.html`. Exact text per type: `templates/headers.md`.

Frontend placement rules (the script applies them):

- `"use client"` / `"use server"`: the header comment goes **above** the
  directive. Directives must be the first statement; comments are not
  statements.
- CSS: a leading `@charset` stays on line 1; the header goes before `@import`
  and `@tailwind`.
- HTML: after `<!doctype html>`.

**Do not paste headers by hand across a repo.** Run the bundled script — it is
idempotent and covers every file type. Run it from the repo root. `<skill-dir>`
is the folder that holds this `SKILL.md`: `.claude/skills/…`, `.agents/skills/…`,
or the plugin cache, depending on how the skill was installed.

```bash
# preview
python3 <skill-dir>/scripts/add_license_headers.py --root . --dry-run

# apply
python3 <skill-dir>/scripts/add_license_headers.py --root .

# CI gate: exit 1 if any file lacks a header
python3 <skill-dir>/scripts/add_license_headers.py --root . --check
```

`--exclude 'src/generated/*'` (repeatable) skips more trees. The script already
skips `node_modules`, `dist`, `build`, `.next`, `out`, `coverage`,
`storybook-static`, Playwright output, and `agent-tracking/`, plus the
framework-generated files `next-env.d.ts`, `*.gen.ts`, and
`mockServiceWorker.js`.

**Exempt from headers:** test fixtures, mock data, auto-generated files (API
clients, route trees), and third-party files vendored in unchanged. Mark a
generated file at the top with `// AUTO-GENERATED — DO NOT EDIT`; the script
detects that marker and skips it. Components copied in by `npx shadcn add`
are source you now own and edit: they **do** get headers.

**Never reword a header.** If the text needs to change, raise it with the tech
lead; it is not an individual decision.

## Step 3 — Declare the licence in `package.json`

The only correct value is `BUSL-1.1`. Never blank, never `UNLICENSED`, never
another identifier. Keep `"private": true` if the app is not published to npm.

```json
{
  "name": "onespace-{app-name}",
  "version": "1.0.0",
  "private": true,
  "license": "BUSL-1.1",
  "author": "Indus Net Technologies  ",
  "homepage": "https://intglobal.com/onespace"
}
```

Replace `{app-name}` with the real app name (e.g. `admin-web`, `portal`).
In a monorepo, every workspace `package.json` carries the field.

## Step 4 — Root `NOTICE`

Every repository needs a plain-text `NOTICE` file at the root declaring product,
owner, and contact. Copy `templates/NOTICE` from this skill.

## Step 5 — `THIRD_PARTY_LICENSES.md` for npm dependencies

OneSpace is legally required to acknowledge the open source it ships. Generate
the file; never hand-write it:

```bash
npx license-checker --production --markdown --out THIRD_PARTY_LICENSES.md
```

`--production` lists what ends up in the bundle; drop it if the tech lead wants
dev tooling listed too. On Windows PowerShell, use `--out` (as above), never `>`
redirection, which writes UTF-16.

Regenerate it **whenever a dependency is added or upgraded**, in the same change.

**GPL / AGPL is a blocker, not a warning.** After generating, check:

```bash
grep -niE '\b(a|l)?gpl' THIRD_PARTY_LICENSES.md
```

Any GPL or AGPL hit must be raised with the tech lead in `#onespace-dev`
**before merging**. Report LGPL, MPL, and "UNKNOWN" / "UNLICENSED" hits too
and let the tech lead decide. Never silently merge past a hit.

## Step 6 — Fonts, icons, images, and animations

npm is not the only way third-party work reaches the browser. Before adding
any asset to `public/`, `src/assets/`, or a CSS `@font-face`:

| Asset | Usually fine | Check or ask first |
|-------|--------------|--------------------|
| Fonts | Google Fonts / Fontsource (SIL OFL) | commercial fonts (a web licence per domain or pageview), fonts lifted from another site |
| Icons | lucide, Heroicons, Radix, Tabler (MIT / ISC) | Font Awesome Pro, icon packs from marketplaces |
| Illustrations and photos | made in-house, Unsplash (Unsplash licence), unDraw | stock photos, anything from a Dribbble shot or another company's site |
| Animations | made in-house | LottieFiles assets (check each file's licence) |
| Logos | OneSpace and client logos with permission | any other brand's logo |

- Record every third-party asset in `THIRD_PARTY_ASSETS.md` at the root (a
  table: name, source URL, licence, where it is used). It is a separate file
  because the Step 5 generator overwrites `THIRD_PARTY_LICENSES.md`.
- **Never ship assets copied from an inspiration site** or a competitor's
  product. Inspiration means patterns, not files.
- **Images inside a design mockup** (stock photos, avatars, logos in a
  screenshot the user gave you) are placeholders until their source and licence
  are confirmed. Build with a neutral placeholder and list them as an open
  question.

## Step 7 — Modifying an existing file

- File already has the correct header? Change nothing. Just write your code.
- File has **no** header (predates this guideline)? Add it as part of your change,
  in a **separate commit**: `chore: add licence header to {filename}`.
  Keeps the functional diff readable.

For a repo-wide first-time sweep, the whole sweep is one isolated commit:
`chore: add BUSL-1.1 licence headers to source files`.

You never commit on your own: prepare the changes and tell the user which
commits to make.

## Step 8 — `README.md` licence section

Every repository's `README.md` ends with a licence section. Copy it from
`templates/README-licence-section.md` and append it at the bottom.

If the README contains a project-structure tree, update that tree to show the new
root files (`LICENSE`, `NOTICE`, `THIRD_PARTY_LICENSES.md`, `THIRD_PARTY_ASSETS.md`) — a stale tree is a
documentation bug.

---

## What NOT to do

- **No other licence identifier.** Not MIT, not Apache-2.0, not ISC, not
  `UNLICENSED`, not blank. Only `BUSL-1.1`.
- **Never skip the header on a new file.** Add it before writing any code.
- **Never copy third-party code or assets in without checking the licence.**
  A GPL snippet or a commercial font is a legal problem. Ask the tech lead first.
- **Never commit a generated file without the `AUTO-GENERATED — DO NOT EDIT`
  marker.** It keeps the licence audit clean.
- **Never delete or modify `LICENSE`.** It is the legal foundation of every
  client deployment.
- **Never reword a licence header.**

## Quick reference checklist

**New repository**

- [ ] `LICENSE` at root (`templates/LICENSE`)
- [ ] `NOTICE` at root (`templates/NOTICE`)
- [ ] `THIRD_PARTY_LICENSES.md` generated
- [ ] `package.json` declares `"license": "BUSL-1.1"`
- [ ] `README.md` has the licence section
- [ ] `python3 <skill-dir>/scripts/add_license_headers.py --root . --check` exits 0

**New source file**

- [ ] correct header at the top (`templates/headers.md`)

**Adding / upgrading a dependency**

- [ ] regenerated `THIRD_PARTY_LICENSES.md`
- [ ] no GPL/AGPL introduced (if yes → stop, raise with tech lead)

**Adding a font, icon set, image, or animation**

- [ ] licence allows use in a commercial product
- [ ] recorded in `THIRD_PARTY_ASSETS.md` with source and licence

**Modifying a header-less file**

- [ ] header added in a separate `chore:` commit

## Who to contact

Ask **before** committing, not after.

- Tech lead — raise in `#onespace-dev`
- External licensing enquiries — licensing@intglobal.com

This skill covers developer obligations only. Client contract clauses and
deployment agreement language are managed by the tech lead and legal team.

---

## Installation

This skill ships in the OneSpace frontend rules pack (`onespace-frontend/`) and
is installed with it — see the pack `README.md`. It is self-contained:
templates and the script travel with it.

First time in a repository: run
`python3 <skill-dir>/scripts/add_license_headers.py --root . --dry-run`,
then apply, then work through the new-repository checklist above.
