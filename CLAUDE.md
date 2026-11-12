@AGENTS.md

# Website project

Stack: Next.js (App Router, TypeScript, `src/`), Tailwind CSS, Framer Motion.

## Animation
- Use Framer Motion for all animations: scroll-triggered fades, staggered reveals, smooth hover/press transitions on interactive elements.
- Be deliberate: favour one orchestrated moment (e.g. the hero load sequence) over identical fade-ups on every section. Respect `prefers-reduced-motion` (`useReducedMotion`).

## Design
- Use the `ui-ux-pro-max` skill (`.claude/skills/ui-ux-pro-max/`) for UI work: run its `--domain ux` / `--stack nextjs` searches and its pre-delivery checklist. Style: Soft UI Evolution; palette: soft pink + lavender (contrast-checked, see `src/app/globals.css`).
- Also follow the `frontend-design` skill in `.claude/skills/frontend-design/`: define colour, type, and spacing tokens first (8px grid), then build.
- Fonts: Abyssinica SIL (headings, `font-display`, single weight — never bold) and Menbere (body). Both support Ge'ez and Latin.
- Keep tokens in one place (Tailwind theme / CSS variables). No ad-hoc hex codes or font sizes.

## Components (21st.dev)
- Components pasted in from https://21st.dev must be adapted to our design tokens, given our real copy, and given Framer Motion entrance animations.

## Quality floor
- Mobile-first and responsive, visible keyboard focus, lazy-loaded images (`next/image`), optimised fonts (`next/font`), Lighthouse 90+.
