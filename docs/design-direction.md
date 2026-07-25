Status: Current (v2, 2026-07-24 - supersedes v1 in full; right-sized reference doc,
not a ladder design doc - see AGENTS.md right-sizing rule)

# Visual & voice direction v2 - "friendly neighborhood cyberpunk, without the mods"

Recorded after an owner session with a career coach surfaced that v1's direction
(Vercel/Linear austere-minimal) had the wrong vibe and no message. Agreed with the
owner in-session, with adversarial review of the framing. v1 is superseded in full;
its execution gaps (no type scale, email-as-h1, color-only nav state, etc.) are
inherited as work items for the implementation pass.

## The ethos (this drives everything)

Pondsmith's cyberpunk: **high tech, low life.** The genre isn't the neon - it's the
people at street level taking technology that wasn't built to serve them and making
it work for them anyway. The owner's stated identity: *"friendly neighborhood
cyberpunk, without the mods"* - the street-level fixer who takes what the tech
towers make deliberately inscrutable (cloud, MLOps, the acronym cathedral) and hands
it to the neighborhood in a form people can actually use.

**"Without the mods" = no chrome for chrome's sake.** No glitch effects, no neon
assault, no hacker cosplay. The cyberpunk lives in the *stance* - anti-gatekeeping,
plain-spoken, a little irreverent toward the towers the owner is fluent in - not in
the costume.

Priority order when anything conflicts: **mission (make it understandable) drives;
cyberpunk seasons.** Never the reverse.

## Audience (be honest about it)

Written so anyone could follow it; aimed at people who might hire or collaborate.
The plain-language voice is the differentiator *to that audience* - engineers who
can explain things are rare. This is not "designed for the general public" as a
strategy; it is "no reader is ever gatekept" as a voice.

## Voice (the actual redesign)

- **Two registers, always in this order:** every project, skill, and job gets a
  street-level explanation first - *what this is and why it matters, in words a
  smart non-technical neighbor gets* - with the deep technical layer (repos, stacks,
  SHAs, metrics) present underneath for those who want it. The two-register
  structure IS the brand.
- **Plain first-person, active voice.** "I build X so that Y" - never "leveraged
  synergies," never unexplained acronyms in the plain register.
- **Microcopy carries the genre flavor** - sparingly. Section labels, empty states,
  and small asides may be street-lit ("the facts", "what's on the bench"); body
  copy stays clear. If a genre touch costs any comprehension, cut it.
- **Law 6 alignment (accuracy over polish):** the plain-language register must never
  round up. Simplified is fine; inflated is a constitution violation. Monospace
  remains reserved for verifiable/factual data (dates, repo names, versions) -
  visually marking "this is a checked fact."

## Mood (visuals)

Warm dark, human, legible. **Street-lit, not tower-lit:** sodium-streetlight warmth
against a dark evening base - a neighborhood at night, not a server room. Flavor
level agreed with owner: *subtle* - warm dark base, one hot accent, genre otherwise
present in voice/microcopy only.

## Color palette

| Token              | Value     | Use                                             |
| ------------------ | --------- | ----------------------------------------------- |
| `--bg`             | `#121009` | Page background (warm near-black, not blue-black) |
| `--surface`        | `#1c1812` | Card/panel background                           |
| `--border`         | `#332c1f` | 1px card/divider borders                        |
| `--text-primary`   | `#f0eade` | Body/heading text (warm off-white)              |
| `--text-secondary` | `#a89e8c` | Muted/meta text                                 |
| `--accent`         | `#f5a623` | The one hot accent: links, active nav, small tags (sodium amber) |
| `--accent-hover`   | `#ffc14d` | Hover/focus state for accent-colored elements   |

Constraints carried from v1, still binding:
- Accent/text contrast must pass WCAG AA (4.5:1 body, 3:1 large/UI) **before** a
  value ships; adjust hex rather than shipping a failing ratio.
- `lib/contrast.test.ts` hex literals must be updated in the same change as
  `app/globals.css` tokens (they are cross-referenced by comment, not derived).

## Typography

- Headings and body: Inter (already loaded via `next/font`). Keep it - the
  friendliness comes from scale, spacing, and voice, not a novelty typeface.
- Monospace: JetBrains Mono (already loaded), reserved for verifiable/factual data
  only, per the Law 6 note above.
- **The implementation pass must ship an actual type scale** (v1's central execution
  failure): deliberate heading sizes, body `line-height` ~1.6 for the prose column,
  vertical rhythm, `text-wrap: balance` on headings, en dashes for ranges.

## Layout

Single-column content, max-width ~720px, unchanged from v1 (it was never the
problem). Card-based lists for `/projects` and `/experience`. Subtle borders over
shadows. The homepage leads with the owner's *name* and a plain-language "what I
do" statement - never an email address as h1.

## Icons

Lucide (outlined, 1.5px stroke) if/when needed. Unchanged from v1.

## Non-goals (unchanged from the architecture design §7)

No theming system, no dark/light toggle, no i18n, no CMS. Single fixed dark theme.
Additionally out of scope for v2: glitch/scanline effects, neon glows, animated
terminal gimmicks - see "without the mods."
