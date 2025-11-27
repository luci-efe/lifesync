# Frontend Implementation Tasks

## 1. Project Setup (add-frontend-setup)

- [ ] 1.1 Initialize Next.js 14 project with TypeScript:
  ```bash
  npx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
  ```
- [ ] 1.2 Install production dependencies:
  - `@clerk/nextjs` - Authentication
  - `next-themes` - Theme switching
  - `swr` - Data fetching and caching
  - `react-hot-toast` - Toast notifications
  - `react-markdown` - Markdown rendering
  - `clsx` - Conditional classes
  - `lucide-react` - Icons
- [ ] 1.3 Install dev dependencies:
  - `@tailwindcss/forms` - Form styling plugin
- [ ] 1.4 Configure `tailwind.config.ts`:
  - Enable dark mode with `class` strategy
  - Add custom colors (primary, accent, success, warning, error)
  - Add custom animations (fade-in, slide-up, scale-in)
  - Configure @tailwindcss/forms plugin
- [ ] 1.5 Update `app/globals.css`:
  - Tailwind directives
  - CSS custom properties for theme colors
  - Smooth transitions for theme changes
- [ ] 1.6 Configure `next.config.js`:
  - Enable standalone output mode
  - Configure images domain for avatars (if needed)
- [ ] 1.7 Create `.env.example` with required variables:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
  CLERK_SECRET_KEY=sk_...
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```
- [ ] 1.8 Create `.env.local` with actual development values
- [ ] 1.9 Verify project runs with `npm run dev`

## 2. Clerk Authentication (add-clerk-auth)

- [ ] 2.1 Create `middleware.ts` at project root:
  - Import `clerkMiddleware` from `@clerk/nextjs/server`
  - Export clerkMiddleware as default
  - Configure matcher patterns (skip static files, always run for API/trpc)
- [ ] 2.2 Update `app/layout.tsx`:
  - Wrap entire app with `<ClerkProvider>`
  - Import Geist fonts from next/font/google
  - Apply font variables to body
- [ ] 2.3 Create `app/(auth)/sign-in/[[...sign-in]]/page.tsx`:
  - Use `<SignIn />` component from @clerk/nextjs
  - Style container for centered layout
- [ ] 2.4 Create `app/(auth)/sign-up/[[...sign-up]]/page.tsx`:
  - Use `<SignUp />` component from @clerk/nextjs
  - Style container for centered layout
- [ ] 2.5 Create `app/(auth)/layout.tsx`:
  - Minimal layout for auth pages
  - Centered card with LifeSync branding
- [ ] 2.6 Test authentication flow:
  - Sign up with new account
  - Sign in with existing account
  - Verify redirect to dashboard after auth

## 3. Theme System (add-theme-system)

- [ ] 3.1 Create `providers/theme-provider.tsx`:
  - Use ThemeProvider from next-themes
  - Configure attribute="class", defaultTheme="system", enableSystem
- [ ] 3.2 Create `components/ui/theme-toggle.tsx`:
  - Button with sun/moon icon
  - Dropdown with Light/Dark/System options
  - Smooth icon transition animation
- [ ] 3.3 Update `app/layout.tsx`:
  - Add ThemeProvider inside ClerkProvider
  - Add suppressHydrationWarning to html element
- [ ] 3.4 Update `tailwind.config.ts`:
  - Add dark mode variants for all custom colors
- [ ] 3.5 Test theme switching:
  - Verify toggle works correctly
  - Verify system preference detection
  - Verify persistence across page reloads
  - Verify no flash of wrong theme on initial load

## 4. Landing Page (add-landing-page)

- [ ] 4.1 Create `app/page.tsx` (landing page):
  - Hero section with LifeSync title and tagline
  - Feature highlights (Tasks, Notes, Calendar)
  - CTA buttons: "Get Started" (sign-up), "Sign In"
  - Elegant gradient background
- [ ] 4.2 Add conditional content for authenticated users:
  - Show "Go to Dashboard" button instead of auth CTAs
  - Display user greeting with UserButton
- [ ] 4.3 Style landing page:
  - Full viewport height hero
  - Responsive typography
  - Subtle animations on scroll
  - Dark mode compatible
- [ ] 4.4 Add header to landing page:
  - LifeSync logo/text
  - Theme toggle
  - SignedIn/SignedOut conditional buttons

## 5. Dashboard Layout (add-frontend-layout)

- [ ] 5.1 Create `components/layout/sidebar.tsx`:
  - Logo at top
  - Navigation links with icons (Dashboard, Tasks, Notes, Calendar)
  - Active state highlighting
  - Collapsible on mobile (slide-over)
  - Fixed width on desktop (256px)
- [ ] 5.2 Create `components/layout/header.tsx`:
  - Mobile menu button (hamburger)
  - Page title (dynamic)
  - Theme toggle
  - UserButton from Clerk
- [ ] 5.3 Create `components/layout/mobile-nav.tsx`:
  - Slide-over panel for mobile
  - Same navigation as sidebar
  - Backdrop overlay
  - Close on navigation or backdrop click
- [ ] 5.4 Create `app/(dashboard)/layout.tsx`:
  - Sidebar + main content layout
  - Apply to all dashboard routes
  - Protect with Clerk (redirect if not authenticated)
- [ ] 5.5 Create `app/(dashboard)/dashboard/page.tsx`:
  - Welcome message with user name
  - Quick stats cards (pending tasks count, total notes)
  - Recent tasks (last 5 upcoming)
  - Recent notes (last 5)
  - Quick action buttons (New Task, New Note)
- [ ] 5.6 Test responsive behavior:
  - Verify sidebar collapses on mobile
  - Verify hamburger menu works
  - Verify navigation works correctly

## 6. UI Components Library (add-ui-components)

- [ ] 6.1 Create `components/ui/button.tsx`:
  - Variants: primary, secondary, ghost, danger
  - Sizes: sm, md, lg
  - Loading state with spinner
  - Disabled state
- [ ] 6.2 Create `components/ui/card.tsx`:
  - Base card with shadow and rounded corners
  - Header, body, footer slots
  - Hover effects
- [ ] 6.3 Create `components/ui/input.tsx`:
  - Text input with label
  - Error state
  - Disabled state
  - Textarea variant
- [ ] 6.4 Create `components/ui/modal.tsx`:
  - Centered overlay
  - Close on backdrop click
  - Close on Escape key
  - Animated entrance/exit
- [ ] 6.5 Create `components/ui/skeleton.tsx`:
  - Pulsing placeholder for loading states
  - Variants: text, circular, rectangular
- [ ] 6.6 Create `components/ui/badge.tsx`:
  - Priority badges (Low/Medium/High)
  - Status badges (Pending/Completed)
  - Color variants
- [ ] 6.7 Create `components/ui/empty-state.tsx`:
  - Illustration placeholder
  - Message text
  - CTA button
- [ ] 6.8 Setup toast notifications:
  - Add Toaster from react-hot-toast to layout
  - Create `lib/hooks/use-toast.ts` wrapper

## 7. API Client (add-api-client)

- [ ] 7.1 Create `lib/types.ts`:
  - Task type matching backend model
  - Note type matching backend model
  - API response types
- [ ] 7.2 Create `lib/api/client.ts`:
  - Base fetcher function
  - Error handling wrapper
  - Type-safe request helper
- [ ] 7.3 Create `lib/api/tasks.ts`:
  - `getTasks()` - GET /api/v1/tasks
  - `createTask(data)` - POST /api/v1/tasks
  - `updateTask(id, data)` - PATCH /api/v1/tasks/:id
  - `deleteTask(id)` - DELETE /api/v1/tasks/:id
- [ ] 7.4 Create `lib/api/notes.ts`:
  - `getNotes()` - GET /api/v1/notes
  - `createNote(data)` - POST /api/v1/notes
  - `updateNote(id, data)` - PATCH /api/v1/notes/:id
  - `deleteNote(id)` - DELETE /api/v1/notes/:id
- [ ] 7.5 Create `lib/hooks/use-tasks.ts`:
  - SWR hook for fetching tasks
  - Optimistic update helpers
  - Mutation functions
- [ ] 7.6 Create `lib/hooks/use-notes.ts`:
  - SWR hook for fetching notes
  - Mutation functions
- [ ] 7.7 Test API client with backend:
  - Verify tasks CRUD works
  - Verify notes CRUD works
  - Verify error handling works

## 8. Tasks UI (add-tasks-ui)

- [ ] 8.1 Create `components/tasks/task-card.tsx`:
  - Checkbox for status toggle
  - Title and description
  - Priority badge (colored)
  - Due date display
  - Edit and delete buttons
  - Completed state styling (strikethrough, muted)
- [ ] 8.2 Create `components/tasks/task-list.tsx`:
  - Render list of TaskCard components
  - Empty state when no tasks
  - Loading skeleton state
- [ ] 8.3 Create `components/tasks/task-form.tsx`:
  - Form fields: title, description, priority, dueDate
  - Validation (title required)
  - Submit and cancel buttons
  - Works for both create and edit
- [ ] 8.4 Create `components/tasks/task-filters.tsx`:
  - Status filter: All / Pending / Completed
  - Priority filter: All / Low / Medium / High
  - Sort: Date / Priority / Alphabetical
- [ ] 8.5 Create `app/(dashboard)/tasks/page.tsx`:
  - Header with "Add Task" button
  - Filters section
  - Task list
  - Modal for create/edit task
- [ ] 8.6 Implement task interactions:
  - Click checkbox to toggle status (optimistic update)
  - Click card to open edit modal
  - Click delete with confirmation
  - Show toast on success/error
- [ ] 8.7 Test tasks functionality:
  - Create new task
  - Edit existing task
  - Mark task complete/incomplete
  - Delete task
  - Filter and sort tasks

## 9. Notes UI (add-notes-ui)

- [ ] 9.1 Create `components/notes/note-card.tsx`:
  - Title display
  - Content preview (truncated, plain text from markdown)
  - Updated timestamp
  - Click to navigate to editor
  - Delete button
- [ ] 9.2 Create `components/notes/note-list.tsx`:
  - Grid layout for notes
  - Empty state when no notes
  - Loading skeleton state
- [ ] 9.3 Create `components/notes/note-editor.tsx`:
  - Title input field
  - Content textarea
  - Markdown preview toggle (side-by-side or toggle view)
  - Save button
  - Auto-save indicator
- [ ] 9.4 Create `app/(dashboard)/notes/page.tsx`:
  - Header with "New Note" button
  - Notes grid
  - Create new note navigates to /notes/new
- [ ] 9.5 Create `app/(dashboard)/notes/new/page.tsx`:
  - Note editor for new note
  - Save creates note and redirects to list
  - Cancel returns to list
- [ ] 9.6 Create `app/(dashboard)/notes/[id]/page.tsx`:
  - Note editor for existing note
  - Load note data on mount
  - Save updates note
  - Back button to list
- [ ] 9.7 Test notes functionality:
  - Create new note with markdown
  - View markdown preview
  - Edit existing note
  - Delete note

## 10. Calendar View (add-calendar-view)

- [ ] 10.1 Create `lib/utils/calendar.ts`:
  - `getDaysInMonth(year, month)` - get array of day cells
  - `getMonthName(month)` - get month display name
  - `isSameDay(date1, date2)` - date comparison
- [ ] 10.2 Create `components/calendar/calendar-nav.tsx`:
  - Previous/Next month buttons
  - Current month and year display
  - Today button to reset
- [ ] 10.3 Create `components/calendar/calendar-day.tsx`:
  - Day number display
  - Task dots/pills for tasks with dueDate
  - Today highlight
  - Click to show tasks for that day
- [ ] 10.4 Create `components/calendar/calendar-grid.tsx`:
  - 7-column grid for days of week
  - Day header row (Sun-Sat)
  - Render CalendarDay for each day in month
  - Handle previous/next month overflow days
- [ ] 10.5 Create `app/(dashboard)/calendar/page.tsx`:
  - Calendar navigation
  - Calendar grid
  - Selected day task list (sidebar or modal)
- [ ] 10.6 Test calendar functionality:
  - Navigate between months
  - See tasks on correct days
  - Click day to see task details
  - Verify today is highlighted

## 11. Loading and Error States (add-loading-error-states)

- [ ] 11.1 Create `app/(dashboard)/loading.tsx`:
  - Dashboard skeleton loader
- [ ] 11.2 Create `app/(dashboard)/tasks/loading.tsx`:
  - Task list skeleton loader
- [ ] 11.3 Create `app/(dashboard)/notes/loading.tsx`:
  - Notes grid skeleton loader
- [ ] 11.4 Create `app/(dashboard)/calendar/loading.tsx`:
  - Calendar skeleton loader
- [ ] 11.5 Create `app/(dashboard)/error.tsx`:
  - Error display with retry button
  - Friendly error message
- [ ] 11.6 Implement error boundaries in data components:
  - Handle API errors gracefully
  - Show inline error states
  - Provide retry functionality

## 12. Docker Configuration (add-frontend-docker)

- [ ] 12.1 Create `Dockerfile`:
  - Stage 1: deps - install dependencies
  - Stage 2: builder - build with env vars as build args
  - Stage 3: runner - copy standalone output
- [ ] 12.2 Create `.dockerignore`:
  - node_modules
  - .next (local)
  - .env.local
  - coverage
  - .git
- [ ] 12.3 Update `next.config.js`:
  - Verify output: 'standalone' is set
- [ ] 12.4 Build Docker image locally:
  ```bash
  docker build \
    --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cGVhY2VmdWwtbW9sbHVzay00LmNsZXJrLmFjY291bnRzLmRldiQ \
    --build-arg NEXT_PUBLIC_API_URL=https://lifesync-backend-dev.azurewebsites.net \
    -t lucidotbat/lifesync-frontend .
  ```
- [ ] 12.5 Test container locally:
  ```bash
  docker run -p 3000:3000 \
    -e CLERK_SECRET_KEY=sk_test_... \
    lucidotbat/lifesync-frontend
  ```
- [ ] 12.6 Verify all features work in containerized environment
- [ ] 12.7 Document build args and runtime env vars in README

## 13. Final Validation

- [ ] 13.1 Run lint check: `npm run lint`
- [ ] 13.2 Fix any lint errors
- [ ] 13.3 Run production build: `npm run build`
- [ ] 13.4 Test production build locally: `npm start`
- [ ] 13.5 Build and test Docker image
- [ ] 13.6 Verify all pages work correctly:
  - Landing page (public)
  - Sign in / Sign up (Clerk)
  - Dashboard (protected)
  - Tasks list and CRUD
  - Notes list and CRUD
  - Calendar view
- [ ] 13.7 Verify responsive design on mobile viewport
- [ ] 13.8 Verify dark mode on all pages
- [ ] 13.9 Verify loading states work correctly
- [ ] 13.10 Verify error states work correctly
- [ ] 13.11 Update README with:
  - Setup instructions
  - Environment variables
  - Development workflow
  - Docker build instructions

## Dependencies & Parallelization

**Sequential dependencies:**
- Section 1 (Setup) must complete before all other sections
- Section 2 (Auth) must complete before Sections 4-10 (protected pages)
- Section 3 (Theme) should complete before Section 4 (Landing) for styling
- Section 6 (Components) should complete before Sections 8-10 (feature pages)
- Section 7 (API Client) must complete before Sections 8-10 (data fetching)
- Section 12 (Docker) can start after Section 1 but finalize after all sections

**Parallelizable:**
- Sections 3 and 6 (Theme and Components) can run in parallel
- Sections 8, 9, and 10 (Tasks, Notes, Calendar) can run in parallel after API client
- Section 11 (Loading/Error states) can run in parallel with 8-10

## Credentials Status

### Already Configured (in `frontend/.env`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_API_URL=http://localhost:3001` - Local backend URL

### For Docker/Azure Deployment:
- **Backend API URL (Dev)**: `https://lifesync-backend-dev.azurewebsites.net`
- **Backend API URL (Prod)**: `https://lifesync-backend-prod.azurewebsites.net`
- **Docker Hub Repository**: `lucidotbat/lifesync-frontend`

### No Manual Setup Required
All Clerk keys are already in place. Just run the backend locally on port 3001 for development.
