# Change: Enhance Frontend UI/UX

## Why

The current frontend implementation is functional but lacks the premium polish and "true dark mode" requested by the user. To align with modern design standards (like Notion or Apple), we need to refine the visual language, improve animations, and deepen the dark mode palette.

## What Changes

### Phase 1: Design System Update (`ui-design-system`)
- Update Tailwind configuration with a new "True Dark" color palette (Zinc/Neutral).
- Configure `inter` font family for a cleaner look.
- Define new animation utilities in Tailwind (or use Framer Motion).

### Phase 2: Component Refactoring (`ui-components`)
- **Global**: Update `globals.css` with new CSS variables for deeper blacks.
- **Layout**: Add glassmorphism (backdrop-blur) to Sidebar and Header.
- **Cards**: Remove heavy borders, use subtle shadows and background differentiation.
- **Buttons**: Implement "Apple-style" buttons with subtle scaling and refined states.
- **Inputs**: Remove default rings, use subtle border transitions.

### Phase 3: Animations (`ui-animations`)
- Integrate `framer-motion` for:
  - Page transitions (optional but recommended for "smoothness").
  - Modal entrance/exit animations.
  - List item layout animations (reordering/adding/deleting).
  - Hover effects on interactive elements.

## Impact

- **Affected specs**: `frontend`
- **Affected code**: `frontend/tailwind.config.ts`, `frontend/app/globals.css`, `frontend/components/`
- **Dependencies**: `framer-motion`, `clsx`, `tailwind-merge` (already installed)

## Credentials Status
No new credentials required.
