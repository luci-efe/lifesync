# Frontend Implementation Design

## Context

LifeSync requires a modern, elegant frontend that provides an exceptional user experience. The backend API is already deployed on Azure with:
- **Express.js API** with Tasks and Notes CRUD endpoints
- **Clerk authentication** validating userId from headers
- **PostgreSQL database** with Prisma ORM
- **Application Insights** for APM

The frontend must integrate seamlessly with this backend while providing a premium UX that makes users want to keep using the application.

## Goals / Non-Goals

### Goals
- Implement a fully functional Next.js 14 frontend with App Router
- Create an elegant, premium-feeling UI with smooth animations
- Support light and dark modes with seamless switching
- Integrate Clerk for authentication with protected routes
- Provide responsive design that works beautifully on all devices
- Enable containerized deployment to Azure App Service
- Create reusable component library for consistency

### Non-Goals
- Offline functionality (PWA features)
- Real-time collaboration features
- Mobile native apps
- Advanced text editor (WYSIWYG)
- Complex calendar features (recurring events, reminders)

## Decisions

### 1. Project Structure

**Decision**: Use a feature-based folder structure with shared components.

```
frontend/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth group (sign-in, sign-up)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/            # Protected dashboard group
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Dashboard home (redirect to /dashboard)
│   │   ├── dashboard/page.tsx  # Dashboard overview
│   │   ├── tasks/page.tsx      # Tasks list
│   │   ├── notes/
│   │   │   ├── page.tsx        # Notes list
│   │   │   └── [id]/page.tsx   # Note editor
│   │   └── calendar/page.tsx   # Calendar view
│   ├── layout.tsx              # Root layout with ClerkProvider
│   ├── page.tsx                # Landing page
│   └── globals.css             # Tailwind imports
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── skeleton.tsx
│   │   └── toast.tsx
│   ├── layout/                 # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── mobile-nav.tsx
│   │   └── theme-toggle.tsx
│   ├── tasks/                  # Task-specific components
│   │   ├── task-list.tsx
│   │   ├── task-card.tsx
│   │   ├── task-form.tsx
│   │   └── task-filters.tsx
│   ├── notes/                  # Note-specific components
│   │   ├── note-list.tsx
│   │   ├── note-card.tsx
│   │   └── note-editor.tsx
│   └── calendar/               # Calendar components
│       ├── calendar-grid.tsx
│       ├── calendar-day.tsx
│       └── calendar-nav.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts           # Base API client
│   │   ├── tasks.ts            # Tasks API functions
│   │   └── notes.ts            # Notes API functions
│   ├── hooks/
│   │   ├── use-tasks.ts        # Tasks data hook
│   │   ├── use-notes.ts        # Notes data hook
│   │   └── use-toast.ts        # Toast notifications hook
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
├── providers/
│   ├── theme-provider.tsx      # Theme context
│   └── toast-provider.tsx      # Toast notifications
├── middleware.ts               # Clerk middleware
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

**Rationale**: This structure separates concerns clearly, groups related files, and scales well. Route groups `(auth)` and `(dashboard)` organize pages without affecting URLs.

### 2. Styling Strategy

**Decision**: Use Tailwind CSS with a custom design system.

```typescript
// tailwind.config.ts
const config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand color - elegant blue
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Accent color for highlights
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        // Semantic colors
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

**Rationale**: Tailwind provides utility-first styling that's highly customizable. Custom animations create the premium feel users will love.

### 3. Theme System Architecture

**Decision**: Use next-themes with class-based dark mode and smooth transitions.

```typescript
// providers/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
```

**Theme Toggle Design**:
- Icon morphs between sun/moon with animation
- Three options: Light, Dark, System
- Dropdown appears on click
- Current theme indicated with check mark

**Rationale**: next-themes handles SSR correctly, prevents flash of wrong theme, and integrates with Tailwind's dark mode.

### 4. Authentication Flow

**Decision**: Use Clerk's hosted UI with custom routing.

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

**Route Protection**:
- `/` - Public landing page
- `/sign-in/*`, `/sign-up/*` - Clerk hosted pages
- `/dashboard/*`, `/tasks/*`, `/notes/*`, `/calendar/*` - Protected

**Rationale**: Clerk's middleware provides secure, battle-tested route protection. Using hosted UI reduces implementation time while maintaining security.

### 5. API Client Design

**Decision**: Use fetch wrapper with automatic userId injection.

```typescript
// lib/api/client.ts
import { auth } from '@clerk/nextjs/server';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }
}
```

**Client-side Hook**:
```typescript
// lib/hooks/use-tasks.ts
import { useAuth } from '@clerk/nextjs';
import useSWR from 'swr';

export function useTasks() {
  const { userId } = useAuth();

  const { data, error, mutate } = useSWR(
    userId ? '/api/v1/tasks' : null,
    (url) => fetcher(url, userId!)
  );

  return {
    tasks: data?.data ?? [],
    isLoading: !error && !data,
    error,
    mutate,
  };
}
```

**Alternatives Considered**:
- React Query: More features but SWR is sufficient and lighter
- Axios: fetch is native and adequate for our needs

**Rationale**: SWR provides caching, revalidation, and error handling. Automatic userId injection ensures consistent authentication.

### 6. State Management

**Decision**: Use React's built-in state + SWR for server state.

| State Type | Solution |
|------------|----------|
| Server state (tasks, notes) | SWR with automatic revalidation |
| UI state (modals, filters) | React useState |
| Theme | next-themes context |
| Auth | Clerk context |

**Rationale**: No need for Redux or Zustand complexity. SWR handles server state caching elegantly.

### 7. Component Design System

**Decision**: Build minimal, reusable UI components with consistent styling.

**Button Component**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}
```

**Design Principles**:
- Consistent spacing: 4px grid (p-1, p-2, p-4, etc.)
- Smooth transitions: 150-300ms duration
- Subtle shadows for depth
- Rounded corners: rounded-lg (8px) default
- Focus rings for accessibility

**Rationale**: Custom components ensure visual consistency and reduce duplication.

### 8. Calendar Implementation

**Decision**: Build custom calendar grid instead of using a library.

```typescript
// Simple monthly grid
const getDaysInMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // ... generate day cells
};
```

**Features**:
- Monthly view only (keep scope minimal)
- Tasks displayed as colored dots/pills
- Click day to see tasks for that day
- Navigate between months with arrows

**Alternatives Considered**:
- react-big-calendar: Overkill for our needs
- FullCalendar: Large bundle, complex API
- date-fns calendar utilities: Good but we need minimal features

**Rationale**: Custom implementation gives full control over styling and keeps bundle small.

### 9. Docker Build Strategy

**Decision**: Use Next.js standalone output mode.

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**next.config.js**:
```javascript
module.exports = {
  output: 'standalone',
};
```

**Rationale**: Standalone output includes only necessary files, reducing image size significantly (~100MB vs 500MB+).

### 10. UX Patterns for "Addictive" Experience

**Decision**: Implement micro-interactions and feedback patterns that delight users.

**Patterns to Implement**:

1. **Optimistic Updates**: Task status changes immediately, rollback on error
2. **Smooth Animations**: Page transitions, modal open/close, list reordering
3. **Loading States**: Skeleton loaders instead of spinners for content
4. **Success Feedback**: Subtle animations when tasks completed
5. **Empty States**: Friendly illustrations with CTAs
6. **Keyboard Shortcuts**: Quick add (n for note, t for task)
7. **Progress Indicators**: Visual progress for completed tasks
8. **Notification Toasts**: Non-intrusive feedback for actions

**Color Psychology**:
- Primary blue: Trust, productivity, calm
- Accent purple: Creativity, premium feel
- Success green: Accomplishment, positive reinforcement

**Rationale**: These patterns create dopamine hits when users complete actions, encouraging continued use.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Clerk rate limits during development | Use test mode keys; rate limits are generous |
| Dark mode flash on initial load | next-themes handles this with script injection |
| Bundle size with animations | Keep animations CSS-only where possible |
| Calendar not handling edge cases | Keep scope to monthly view; add features later if needed |
| SWR cache becoming stale | Configure appropriate revalidation intervals |

## Migration Plan

No migration required - this is a greenfield frontend implementation. The `frontend/` directory currently only contains `.env.example`.

**Deployment Steps**:
1. Implement and test locally
2. Build Docker image with build-time env vars
3. Push to Docker Hub
4. Deploy to Azure App Service (dev environment)
5. Configure App Service environment variables
6. Validate all features in dev environment
7. Complete PR with approval gate to production

## Open Questions

1. **Markdown Editor**: Should we use a library like react-markdown-editor or build simple textarea with preview?
   - **Recommendation**: Start with simple textarea + react-markdown preview. Add rich editor later if needed.

2. **Task Drag & Drop**: Should we support reordering tasks via drag & drop?
   - **Recommendation**: Defer to future iteration. Focus on core CRUD first.

3. **Notification Toasts**: Use react-hot-toast or build custom?
   - **Recommendation**: Use react-hot-toast for reliability and accessibility.

4. **Date Picker**: Use native input[type="date"] or a library?
   - **Recommendation**: Start with native for simplicity. Add library if UX is poor.
