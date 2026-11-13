@AGENTS.md

# Website project

Stack: Next.js (App Router, TypeScript, `src/`), Tailwind CSS.

## Look and motion
- Keep the site **static and clean**: no animations, no illustrations/decorative images, single centred column. (The founders chose this.)
- Simple colour changes on hover/focus are fine; no movement, transforms or entrance effects.

## Design
- Use the `ui-ux-pro-max` skill (`.claude/skills/ui-ux-pro-max/`) for UI work: run its `--domain ux` / `--stack nextjs` searches and its pre-delivery checklist. Style: Soft UI Evolution; palette: soft pink + lavender (contrast-checked, see `src/app/globals.css`).
- Also follow the `frontend-design` skill in `.claude/skills/frontend-design/`: define colour, type, and spacing tokens first (8px grid), then build.
- Fonts: **Brana** (local file `src/app/fonts/brana/`, SIL OFL) for all Ge'ez/Tigrinya text via unicode-range; Latin uses Abyssinica SIL (headings, `font-display`, single weight — never bold) and Menbere (body).
- Keep tokens in one place (Tailwind theme / CSS variables). No ad-hoc hex codes or font sizes.

## Components (21st.dev)
- Components pasted in from https://21st.dev must be adapted to our design tokens and real copy, with any animation removed.

## Quality floor
- Mobile-first and responsive, visible keyboard focus, lazy-loaded images (`next/image`), optimised fonts (`next/font`), Lighthouse 90+.
