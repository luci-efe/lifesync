# Backend Implementation Design

## Context

LifeSync requires a RESTful API backend to support the frontend application. The infrastructure is already deployed on Azure with:
- **Azure App Service** (Linux containers) for hosting
- **PostgreSQL Flexible Server** with `lifesync_dev` and `lifesync_prod` databases
- **Application Insights** for APM and monitoring
- **Docker Hub** for container image registry

The backend must integrate with Clerk for authentication (userId validation) and follow the existing project conventions for TypeScript, naming, and API patterns.

## Goals / Non-Goals

### Goals
- Implement a fully functional Express.js REST API
- Integrate with existing Azure PostgreSQL database
- Enable APM monitoring via Application Insights
- Support containerized deployment to Azure App Service
- Provide unit tests with coverage reporting for CI/CD pipeline
- Follow existing project conventions and patterns

### Non-Goals
- Full JWT validation with Clerk (simplified to header-based userId for MVP)
- GraphQL or other API paradigms
- Real-time features (WebSockets)
- Advanced caching mechanisms
- Rate limiting (can be added later)

## Decisions

### 1. Project Structure

**Decision**: Use a modular folder structure with clear separation of concerns.

```
backend/
├── src/
│   ├── index.ts              # Entry point, server setup
│   ├── config/
│   │   └── env.ts            # Environment configuration
│   ├── middleware/
│   │   ├── auth.ts           # User ID extraction
│   │   ├── error.ts          # Error handling
│   │   └── cors.ts           # CORS configuration
│   ├── routes/
│   │   ├── health.ts         # Health check routes
│   │   ├── tasks.ts          # Tasks CRUD routes
│   │   └── notes.ts          # Notes CRUD routes
│   ├── services/
│   │   ├── task.service.ts   # Task business logic
│   │   └── note.service.ts   # Note business logic
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── appInsights.ts    # Application Insights setup
│   └── types/
│       └── express.d.ts      # Express type extensions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── tests/
│   ├── health.test.ts
│   ├── tasks.test.ts
│   └── notes.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
├── Dockerfile
├── .env.example
└── .gitignore
```

**Rationale**: This structure follows the project conventions, separates concerns clearly, and scales well for future features.

### 2. TypeScript Configuration

**Decision**: Use strict mode with ES2022 target and ESM modules.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Rationale**: Matches project conventions (strict mode enabled) and uses modern Node.js module resolution.

### 3. Authentication Strategy

**Decision**: Use header-based userId extraction with optional Clerk JWT validation.

```typescript
// Middleware extracts userId from x-user-id header
// Frontend (Next.js with Clerk) passes authenticated userId in header
// Backend validates presence, optionally verifies JWT with @clerk/backend
```

**Alternatives Considered**:
- Full Clerk JWT validation: More secure but adds complexity and latency
- Session-based auth: Not suitable for stateless API architecture

**Rationale**: Simplified header-based approach meets MVP requirements. The frontend handles Clerk authentication and passes the verified userId. Full JWT validation can be added later.

### 4. Database Access Pattern

**Decision**: Use Prisma ORM with a singleton client instance.

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

**Rationale**: Prisma provides type-safe database access, automatic migrations, and excellent TypeScript integration. Singleton pattern prevents connection pool exhaustion.

### 5. API Response Format

**Decision**: Consistent JSON response structure across all endpoints.

```typescript
// Success response
{
  "data": {...} | [...],
  "meta": { "total": number } // For list endpoints
}

// Error response
{
  "error": "Error message",
  "details": [...] // Optional, for validation errors
}
```

**Rationale**: Follows project conventions defined in `openspec/project.md`.

### 6. Error Handling Strategy

**Decision**: Centralized error handling middleware with typed error classes.

```typescript
// Custom error classes
class ValidationError extends Error { status = 400; }
class NotFoundError extends Error { status = 404; }
class AuthError extends Error { status = 401; }

// Error middleware catches and formats all errors
// Internal details logged to Application Insights
// Sanitized messages returned to client
```

**Rationale**: Provides consistent error responses while protecting internal implementation details.

### 7. Input Validation

**Decision**: Use Zod for runtime schema validation.

**Alternatives Considered**:
- Joi: More established but larger bundle size
- class-validator: Requires decorators and classes
- Manual validation: Error-prone and verbose

**Rationale**: Zod provides excellent TypeScript integration, small bundle size, and composable schemas.

### 8. Application Insights Integration

**Decision**: Initialize Application Insights before Express app.

```typescript
// index.ts
import { initAppInsights } from './lib/appInsights';
initAppInsights(); // Must be first!

import express from 'express';
// ... rest of app setup
```

**Rationale**: Application Insights auto-instrumentation requires initialization before other modules are loaded.

### 9. Docker Build Strategy

**Decision**: Multi-stage build with separate builder and runner stages.

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

**Rationale**: Reduces final image size by excluding dev dependencies and source files. Prisma client must be generated in build stage.

### 10. Testing Strategy

**Decision**: Unit tests with mocked Prisma client using Jest.

```typescript
// Mock Prisma client
jest.mock('../src/lib/prisma', () => ({
  task: { findMany: jest.fn(), create: jest.fn(), ... },
  note: { findMany: jest.fn(), create: jest.fn(), ... },
}));
```

**Rationale**: Unit tests should be fast and isolated from database. Integration tests can be added later for E2E validation.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Header-based auth less secure than JWT validation | Document as MVP limitation; add full Clerk validation in future |
| Prisma cold start latency | Acceptable for student project; can optimize connection pool later |
| No rate limiting | Add in future iteration if needed; Azure App Service provides basic DDoS protection |
| Single Prisma client instance | Monitor for connection issues; implement connection retry logic |

## Migration Plan

No migration required - this is a greenfield implementation. The backend directory is currently empty except for `.env.example`.

**Deployment Steps**:
1. Implement and test locally
2. Build Docker image and push to Docker Hub
3. Deploy to Azure App Service (dev environment)
4. Run database migrations: `npx prisma migrate deploy`
5. Validate health endpoints and APM integration
6. Complete PR with approval gate to production

## Open Questions

1. **Clerk Integration**: Should we implement full JWT validation now or defer to a future iteration?
   - **Recommendation**: Defer to keep MVP simple. Header-based userId is sufficient for demo.

2. **CORS Origins**: Should we make CORS origins configurable via environment variables?
   - **Recommendation**: Yes, use `ALLOWED_ORIGINS` env var with fallback to default values.

3. **Database Seeding**: Should we include seed scripts for demo data?
   - **Recommendation**: No, keep scope minimal. Can add if time permits.
