Status: Current (right-sized; not a ladder design doc - see AGENTS.md right-sizing rule)

# Visual design direction

Recorded once, agreed with the site owner, ahead of implementing styling for the first
time. Not run through the design -> spec -> plan ladder or a reviewer car: this is a
styling change to an already-shipped, already-reviewed static site, which
`AGENTS.md`'s right-sizing rule explicitly exempts from that ceremony. Recorded here
anyway per "documentation ranks equal to code" - so the direction is traceable and
consistent as it's implemented, and so a later session doesn't have to reconstruct it
from chat history.

## Mood

Clean, minimal, dev-tool credible. Anchors: Vercel (near-black background, generous
spacing, minimal-shadow cards), Linear (restrained single-accent-color use, subtle
border-based separation over drop shadows).

## Color palette

| Token             | Value     | Use                                              |
| ------------------ | --------- | ------------------------------------------------- |
| `--bg`             | `#0a0a0c` | Page background (near-black, not pure black)      |
| `--surface`        | `#141417` | Card/panel background                             |
| `--border`         | `#26262b` | 1px card/divider borders                          |
| `--text-primary`   | `#ededf0` | Body/heading text                                 |
| `--text-secondary` | `#8b8b93` | Muted/meta text                                   |
| `--accent`         | `#3b82f6` | Links, active nav state, small tags/badges only   |
| `--accent-hover`   | `#60a5fa` | Hover/focus state for accent-colored elements      |

Constraint: accent-on-background contrast must be checked against WCAG AA (4.5:1 for
body text, 3:1 for large text/UI) before the value ships; adjust the exact hex if the
initial value falls short rather than shipping a failing contrast ratio.

## Typography

- Headings and body: Inter or Geist Sans.
- Monospace accents (dates, tech-stack tags, repo names/SHAs): JetBrains Mono or Geist
  Mono. Reserved specifically for verifiable/factual data, not decorative use -
  reinforces the constitution's Law 6 (accuracy over polish) distinction visually by
  visually marking "this is a checked fact" vs. prose.

## Layout

Single-column content, max-width ~720-840px for readability. Card-based list treatment
for `/projects` and `/experience` entries. Subtle bottom-border dividers, not heavy
shadows.

## Icons

Lucide (outlined, 1.5px stroke) if/when icons are needed - matches the established
aesthetic, tree-shakeable, has a clean Next.js integration.

## Non-goals (unchanged from `docs/design/2026-07-24-site-architecture-design.md` §7)

No theming system, no dark/light toggle, no i18n, no CMS. This is a single fixed dark
theme, not a configurable design system.
