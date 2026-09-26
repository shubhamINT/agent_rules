# Design Tokens

Tokens are the named values every component uses: colour, type, spacing,
radius, shadow, motion. They make the look consistent, make dark mode a
second set of values instead of a second set of classes, and turn a rebrand into
one file.

## Where tokens live

- **Tailwind v4:** CSS-first. Tokens are CSS variables in `@theme` inside the
  global stylesheet; there is no `tailwind.config.js` unless the repo kept one.
- **shadcn/ui:** semantic colour variables (`--background`, `--foreground`,
  `--primary`, `--primary-foreground`, `--muted`, `--accent`, `--destructive`,
  `--border`, `--input`, `--ring`, `--card`, `--popover`, chart colours) on
  `:root` and `.dark`, mapped into Tailwind with `@theme inline`.
- **Other setups** (CSS modules, vanilla-extract): one tokens file of CSS
  variables. Find it before adding a new one.

Check the installed Tailwind major version (`node_modules/tailwindcss/package.json`)
before writing config; v3 and v4 differ.

## A minimal Tailwind v4 + shadcn token set

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.2 0.02 265);
  --muted: oklch(0.96 0.005 265);
  --muted-foreground: oklch(0.5 0.02 265);
  --primary: oklch(0.55 0.2 265);          /* the one accent */
  --primary-foreground: oklch(0.99 0 0);
  --border: oklch(0.92 0.005 265);
  --ring: oklch(0.55 0.2 265);
}

.dark {
  --background: oklch(0.16 0.01 265);
  --foreground: oklch(0.96 0.005 265);
  --muted: oklch(0.22 0.01 265);
  --muted-foreground: oklch(0.7 0.01 265);
  --primary: oklch(0.68 0.17 265);
  --border: oklch(0.28 0.01 265);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
}
```

The values above are an example of the structure, not OneSpace's brand. Use
the brand values when they exist; propose them in the design direction when
they do not.

## Rules

- **Colour:** a neutral scale plus one accent, a destructive red, and a success
  green. Write colours in `oklch` so light and dark steps stay even. Check text
  contrast (4.5:1 body, 3:1 large text and UI parts).
- **Type:** one scale, e.g. 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48. Body 14–16
  in dense app UI, 16–18 on marketing pages. At most two families (one is
  often enough; a display face only for large headings). Self-host fonts
  (`@fontsource-variable/*` or `next/font`), `font-display: swap`.
- **Spacing:** Tailwind's 4px scale. Pick a rhythm (e.g. 4/8/12/16/24/32/48/64)
  and stay on it.
- **Radius:** one base radius, derived sizes. Inner radius = outer radius −
  padding, so nested corners look parallel.
- **Shadow:** at most three elevations (card, popover, modal). In dark mode,
  show elevation with a lighter surface, not a shadow.
- **Dark mode:** every colour token has a `.dark` value. Toggle with
  `next-themes` (Next.js) or the repo's theme provider; respect the system
  setting by default.

## Adding a token

Need a value twice? Add a token. Name it for its meaning (`--color-warning`),
not its look (`--color-orange`). Add the `.dark` value in the same change.
