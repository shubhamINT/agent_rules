# Inspiration and Research

Good design research is short and specific: 3–5 references for *this kind of
screen*, one idea taken from each, written down. Browsing twenty sites and
copying the prettiest one is not research.

## Where to look

| Source | Best for | URL |
|--------|----------|-----|
| Awwwards (Sites of the Day, Honors) | bold marketing pages, type, motion | https://www.awwwards.com/websites/ |
| Godly | curated modern web design, landing pages | https://godly.website |
| Land-book | landing and product pages by category | https://land-book.com |
| Mobbin | real app screens and flows (web and mobile) | https://mobbin.com |
| Refero | UI patterns from real products, searchable | https://refero.design |
| SaaS Landing Page | SaaS marketing sections | https://saaslandingpage.com |
| Dribbble / Behance | visual ideas only; many shots are not real, buildable UI | https://dribbble.com |
| CSS Design Awards | experimental front-end work | https://www.cssdesignawards.com |

Best-in-class product UI to study for a workspace SaaS (open the live
product or marketing site): Linear (density, keyboard-first, calm dark UI),
Attio (CRM tables and records), Vercel (type, grids, dashboards), Stripe
(documentation and data clarity), Raycast (command palette, motion), Notion
(empty states, onboarding), Asana and ClickUp (workspace domain patterns).

## How to research

1. **Search for the screen, not the style**: "project kanban board",
   "team member profile page", "SaaS pricing page", "analytics dashboard dark".
2. **Pick 3–5** that fit the design read and dials. Mix one from the workspace
   domain with ones from outside it.
3. **Screenshot them** with `onespace-fe-verify-ui` so the evidence stays in
   `agent-tracking/screenshots/<slug>/refs/`:
   `node <verify-ui>/scripts/shoot.mjs --url https://linear.app --name ref-linear --out agent-tracking/screenshots/<slug>/refs --widths 1440,375`
   Sites that block automation: note the URL and describe what you saw.
4. **Write one line per reference** in `research/<slug>.md`:

   | Reference | Idea to take | Where it applies |
   |-----------|--------------|------------------|
   | Linear issues list | 32px rows, status as a small coloured dot, hover reveals actions | member list |
   | Attio record page | two-column record, activity timeline on the right | member profile |
   | Vercel dashboard | quiet neutral palette, one accent for primary actions | whole app |

5. **Turn the ideas into the 2–3 directions** in `SKILL.md` Step 3.

## Borrow, do not copy

Take principles (a spacing rhythm, a way of grouping, a type contrast, an
interaction), never a whole layout, logo, illustration, or copy. The result must
look like OneSpace, not like Linear with another name.

## What makes a reference "award-level"

When judging a reference, or your own screen, look for:

- **Type with contrast** — a real scale (e.g. 12/14/16/20/28/40), tight
  tracking on large headings, comfortable line height on body text.
- **One strong idea per screen** — a signature layout or interaction, not ten
  small tricks.
- **Rhythm** — spacing from one scale, edges that align across sections.
- **Purposeful colour** — mostly neutral, one accent that means "act here".
- **Real content** — real-looking data makes the design believable.
- **Details** — focus states, empty states, hover, skeletons designed with the
  same care as the hero.
