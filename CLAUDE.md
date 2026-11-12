@AGENTS.md

# Website project

Stack: Next.js (App Router, TypeScript, `src/`), Tailwind CSS, Framer Motion.

## Animation
- Use Framer Motion for all animations: scroll-triggered fades, staggered reveals, smooth hover/press transitions on interactive elements.
- Be deliberate: favour one orchestrated moment (e.g. the hero load sequence) over identical fade-ups on every section. Respect `prefers-reduced-motion` (`useReducedMotion`).

## Design
- Follow the `frontend-design` skill in `.claude/skills/frontend-design/` for every UI task: define colour, type, and spacing tokens first (8px grid), then build.
- Keep tokens in one place (Tailwind theme / CSS variables). No ad-hoc hex codes or font sizes.

## Components (21st.dev)
- Components pasted in from https://21st.dev must be adapted to our design tokens, given our real copy, and given Framer Motion entrance animations.

## Quality floor
- Mobile-first and responsive, visible keyboard focus, lazy-loaded images (`next/image`), optimised fonts (`next/font`), Lighthouse 90+.
