# Design: Enhanced UI/UX

## Visual Style

### Color Palette (True Dark Mode)
Instead of the default slate/gray, we will use a "True Dark" palette based on pure blacks and very dark grays for high contrast and OLED optimization.

- **Background**: `#000000` (Main), `#09090b` (Secondary/Cards)
- **Foreground**: `#ffffff` (Primary Text), `#a1a1aa` (Secondary Text)
- **Borders**: `#27272a` (Subtle)
- **Primary**: `#3b82f6` (Blue) or `#ffffff` (Monochrome option for "Notion" feel)

### Typography
- **Font**: Inter (via `next/font/google`) or Geist Sans (already in use).
- **Weights**: Heavy use of Medium (500) for UI text, Bold (700) for headers.
- **Tracking**: Tight tracking for headings, normal for body.

### Glassmorphism
- Use `backdrop-filter: blur(12px)` for sticky headers, sidebars, and modals.
- Semi-transparent backgrounds (e.g., `bg-black/50` in dark mode).

## Interaction Design

### Animations (Framer Motion)
- **Micro-interactions**: Buttons scale down slightly (`0.98`) on click.
- **Transitions**: Smooth fade-ins (`opacity: 0 -> 1`, `y: 10 -> 0`) for content.
- **Layout**: `layout` prop on lists to animate items moving when others are added/removed.

### Components

#### Sidebar
- Floating or full-height with subtle border.
- Active state: Soft background pill with bold text.

#### Cards (Tasks/Notes)
- Minimalist.
- Dark mode: Dark gray background (`#09090b`), no border or very subtle border (`#27272a`).
- Hover: Slight lift (`translate-y-[-2px]`) and shadow increase.

#### Dialogs
- Centered, backdrop blur overlay.
- Scale-in animation.
