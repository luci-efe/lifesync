# Change: Refine UI to Notion Style

## Why

User requested a "Notion-like" aesthetic with a modern font (`Inter`) and neutral color palette, moving away from the previous "True Dark" implementation.

## What Changes

### Design System
- **Font**: Switch from `Geist` to `Inter`.
- **Colors**: Update palette to Notion's neutral tones (Off-white/Dark Grey).
- **Styling**: Remove heavy glassmorphism, use minimalist borders and solid backgrounds.

### Components
- **Sidebar**: Minimalist, monochrome icons.
- **Cards**: clean outlines, no heavy shadows.

## Impact

- **Affected specs**: `frontend`
- **Affected code**: `frontend/app/layout.tsx`, `frontend/tailwind.config.ts`, `frontend/app/globals.css`

## Credentials Status
No new credentials.
