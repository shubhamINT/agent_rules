---
name: hirebot-fe-design-ui
description: >
  Premium, distinctive, responsive UI for the HireBot React frontend — never a
  plain or template-looking screen. Researches award-winning references
  (Awwwards, Godly, Mobbin, best-in-class SaaS), commits to a design direction
  with explicit dials (variance, motion, density), builds on design tokens with
  modern libraries (Tailwind v4, shadcn/ui, Motion, lucide), designs
  mobile-first for phone, tablet, laptop and wide screens, bans the generic
  "AI-generated" look, and always critiques what is weak and pitches 2–3
  concrete ideas to the user. Use whenever the user asks to build, design,
  redesign, restyle, polish, theme, or animate any page or component — "make it
  look better", "this looks bad", "make it premium", "make it responsive",
  "fix the mobile layout", "add animations", "new landing page", "dashboard
  UI" — and when reviewing how a screen looks. Runs inside hirebot-fe-workflow
  (types `ui`, `feature`, `verify`).
---

# Design UI

HireBot's users judge the product in the first second, and a screen that looks
like every other AI-generated dashboard reads as cheap, however good the
backend is. This skill makes the UI a set of deliberate, defended choices:
research real references, pick a direction with the user, build it on tokens,
make it work at every width, and keep pushing it further with the user.

You are the design lead here, not a code generator. That means two things:
have an opinion (propose, recommend, explain why), and never hide a weak
screen. When something you see is weak — in the existing UI or in what you
just built — say so, say why, and offer ideas.

**Gate — when this is the task itself** (not a step inside another task):
load `hirebot-fe-workflow` and run its phases 1–3 before anything else.
Invoking this skill directly (a slash command, a one-line request) is not an
exemption, and harness plan mode does not replace `plan.md`.

**Always, even inside another task:** make sure the repo is registered — the
hirebot-fe block in `AGENTS.md` and the `@AGENTS.md` import in `CLAUDE.md`
(`hirebot-fe-workflow`, Phase 2, "Register the pack") — and finish with the
docs sync (`hirebot-fe-workflow`, Phase 7) so the README matches the code.

| Need | Read |
|------|------|
| Where and how to research references | `references/inspiration.md` |
| The banned "generic AI UI" patterns | `references/anti-patterns.md` |
| Colour, type, spacing, radius, shadow tokens; dark mode | `references/tokens.md` |
| Breakpoints, layouts per device, touch, fluid type | `references/responsive.md` |
| Animation timing, easing, what to animate | `references/motion.md` |
| Which modern library for which job; upgrade pitches | `references/libraries.md` |
| Skeletons, slow / empty / error states, long AI jobs | `references/loading-states.md` |

---

## Step 1 — Design read (before any code)

Write three lines into `research/<slug>.md`:

1. **Product and user** — "Recruiters triaging 200 candidates a day on a
   laptop between calls."
2. **Job of this screen** — the one thing the user must do or understand.
3. **Mood** — three adjectives, e.g. "calm, precise, fast".

Then set the three dials (1–10) and write them down:

| Dial | Low (1–3) | High (8–10) | HireBot app default | HireBot marketing default |
|------|-----------|-------------|---------------------|---------------------------|
| **Variance** — how far from a standard layout | classic grid, predictable | asymmetric, editorial, bold type | 4 | 7 |
| **Motion** — how much moves | state changes only | scroll-linked, choreographed | 3 | 6 |
| **Density** — information per screen | airy, one idea per view | data-dense, compact tables | 6 | 3 |

Every later choice follows the read and the dials. A recruiter dashboard with
variance 9 is as wrong as a landing page with density 9.

## Step 2 — Research references

Follow `references/inspiration.md`: collect 3–5 real references for this kind
of screen, screenshot them with `hirebot-fe-verify-ui` (`--url`), and write
down for each the one idea worth taking (the grid, the type scale, the way
empty states talk, a signature detail). Borrow principles, never copy a site.

No web access? Say so, and work from the patterns in the reference files and
any screenshots the user provides.

## Step 3 — Propose directions, the user picks

For a new screen or a redesign, bring **2–3 directions** into the plan. Each
direction has:

- a name and a one-line mood
- type pairing (display + text), palette (neutral base + one accent), radius
  and shadow style
- the layout idea at mobile and desktop
- one **signature detail** that makes it memorable (a data-rich hero stat, a
  command bar, a timeline, an unusual but useful grid)
- the dial values
- which reference each idea comes from

Recommend one and say why. For small changes inside an existing design system,
skip the directions: follow the system and say so.

## Step 4 — Build in this order

1. **Tokens** — add or confirm the tokens the direction needs
   (`references/tokens.md`). Components use tokens only
   (`hirebot-fe-coding-standards` rule `style-tokens-only`).
2. **Layout, mobile first** — build the 375px layout, then widen
   (`references/responsive.md`). Screenshot at each breakpoint as you go.
3. **Components** — reuse the primitives (shadcn/ui or the repo's system);
   compose, do not fork.
4. **States** — loading, empty, error, and success for every data view, shaped
   like the real content (`references/loading-states.md`).
5. **Motion last** — only where it explains a change (`references/motion.md`).

Premium comes from restraint and precision, not decoration: a strict spacing
rhythm, a real type scale, aligned edges, generous white space where the dials
say so, one accent colour used with purpose, and content that is real (no lorem
ipsum; realistic names, numbers, and dates).

## Step 5 — Critique and pitch (every time)

After each `hirebot-fe-verify-ui` pass, look at the screenshots as a demanding
design reviewer and write the critique in `progress.md`:

- **Weak** — what looks generic, cramped, unbalanced, low-contrast, or unclear,
  with the screenshot and width where you saw it. Check every item in
  `references/anti-patterns.md`.
- **Fix now** — what is inside the approved scope; fix it and re-shoot.
- **Ideas** — 2–3 concrete ideas beyond the scope that would make the screen
  better (a keyboard shortcut bar, a smarter empty state, a micro-interaction,
  a denser table mode), each with the effort and the reference it comes from.

Share the weak points and the ideas with the user in chat, and ask which ideas
they want. Do the same when the user shows you an existing screen: point out
what is weak before they ask.

## Step 6 — Upgrade pitch (when the repo is behind)

Use what the repo has. When it uses something that blocks a premium result — no
design tokens, a dated component kit, CSS-in-JS runtime styling, icon fonts,
hand-rolled modals — pitch the modern option from `references/libraries.md` in
the plan with the trade-off (bundle, migration effort, risk). Add a dependency
only after the user approves, and verify its current version and API in its
docs first.

## Done means

- The direction the user chose is visible in the screenshots.
- Every target page passes `hirebot-fe-verify-ui` at every agreed width and
  theme.
- No item from `references/anti-patterns.md` appears.
- The critique and ideas were shared with the user.
