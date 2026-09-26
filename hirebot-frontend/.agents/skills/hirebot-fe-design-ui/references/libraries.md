# Modern Libraries

Defaults for HireBot frontend work. **Always use what the repo already has
first.** When the repo lacks something below, or uses an older option, pitch
the upgrade in the plan with its trade-off; install only after the user
approves. Before writing code against any library, check the installed version
(`node_modules/<pkg>/package.json`) and its current docs — APIs move.

## Defaults

| Job | Default | Notes |
|-----|---------|-------|
| Styling | **Tailwind CSS v4** | CSS-first `@theme`; `prettier-plugin-tailwindcss` sorts classes |
| Primitives and components | **shadcn/ui** (Radix or Base UI primitives) | code lives in the repo (`components/ui`); customise tokens, not internals |
| Animation | **Motion** (`motion/react`) | see `motion.md` |
| Icons | **lucide-react** | one icon set only; import icons one by one |
| Server state | **TanStack Query** | data fetching is the developer's choice; suggest, do not impose |
| Forms | **react-hook-form + zod** (shadcn `Form` / `Field`) | the zod schema can come from the API contract |
| Tables | **TanStack Table** (+ shadcn data table) | headless; sorting, filters, column visibility |
| Long lists | **TanStack Virtual** | for hundreds of rows |
| Toasts | **sonner** | shadcn's toast |
| Drawer (mobile) | **vaul** (shadcn `Drawer`) | bottom sheets on phones |
| Command palette | **cmdk** (shadcn `Command`) | keyboard-first navigation; a signature detail for power users |
| Charts | **Recharts** via shadcn charts | themed by chart tokens |
| Dates | **date-fns** | tree-shakable; `Intl` for formatting where enough |
| Theme switch | **next-themes** (works outside Next.js too) | `class` strategy for Tailwind dark mode |
| Fonts | `@fontsource-variable/*` (Vite) or `next/font` (Next.js) | self-hosted, no layout shift |
| Carousel | **embla-carousel-react** (shadcn `Carousel`) | only when a carousel is truly needed |

## Upgrade pitches

When you find one of these, name it in the critique and pitch the upgrade:

| Found | Pitch | Trade-off to state |
|-------|-------|--------------------|
| Tailwind v3 | Tailwind v4 (official upgrade tool `npx @tailwindcss/upgrade`) | config moves to CSS; plugin compatibility |
| Runtime CSS-in-JS (styled-components, Emotion) | Tailwind v4 + tokens | migration per component; no runtime style cost afterwards; works with server components |
| Material UI / Bootstrap / Ant with default theme | shadcn/ui on tokens, component by component | effort per screen; full design control |
| Icon fonts or several icon sets | lucide-react | swap per usage |
| `framer-motion` import | `motion` package (`motion/react`) | mostly a rename; check the migration notes |
| `useEffect` fetching, Redux for server data | TanStack Query | caching, dedupe, loading states; migration per screen |
| Moment.js | date-fns or `Intl` | smaller bundle |
| Hand-rolled modal / dropdown / tooltip | Radix-based shadcn primitive | accessibility and focus handling for free |
| CRA (Create React App) | Vite | build config move; much faster dev server |

## Rules

- Never add a library for what a few lines or a platform feature can do
  (`<dialog>`-level needs are still better served by the shadcn primitive
  already in the repo; a date input may be enough for a date field).
- Never add a second library for a job an installed one already does.
- Confirm every package name exists on npm under that exact name before
  proposing it.
