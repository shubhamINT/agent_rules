# Anti-patterns: the generic "AI UI" look

These patterns make a screen look template-made. None of them may appear in a
finished HireBot screen unless the user explicitly asks for it. Check the list
against every screenshot during the critique.

## Layout

- Centred hero with a headline, a sub-headline, two buttons, and a gradient
  blob behind it, as the default for every page.
- Three (or four) equal cards in a row, each an icon + title + two lines of
  text.
- Everything centred; nothing aligned to a strong left edge.
- Sections of identical height and padding stacked forever.
- Content stretched edge to edge on a 1920px screen (no max width), or a narrow
  column floating in empty space at 1440.
- Decorative numbering (01 / 02 / 03) with no sequence to explain.
- A dashboard that is only a grid of big-number cards with no hierarchy.

## Colour and surface

- Purple-to-blue (or any rainbow) gradients as the brand.
- Glassmorphism, glow, and blur on every card.
- A shadow on everything; several shadow styles at once.
- Grey text on grey background below 4.5:1 contrast.
- More than one accent colour competing for attention.
- Untouched shadcn defaults: the stock neutral palette and radius with no brand
  decision at all.

## Type

- More than two font families.
- Every heading the same weight and size as the body with only bold added.
- All-caps labels everywhere, eyebrow text above every heading.
- One highlighted gradient word in every headline.
- Body lines longer than ~75 characters.

## Components and content

- Emoji used as icons; mixed icon sets.
- Lorem ipsum, "John Doe", "Acme Inc", and round fake numbers (1,000 users,
  99.9%).
- A full-page spinner while data loads (use skeletons shaped like the content).
- An empty state that says only "No data".
- Hover-only actions with no way to reach them on touch.
- Tooltips carrying information the user needs to finish the task.
- Rounded-3xl on every element, or radii that differ from component to
  component.
- Motion on everything: bouncing buttons, parallax on a data table, entrance
  animations on every scroll.

## What to do instead

Pick the one idea the screen is about and let it lead. Align to a grid. Use one
type scale and one spacing scale. Use a neutral base and one accent. Show real
content. Design the empty, loading, and error states. Animate only what changes.
