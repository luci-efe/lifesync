# Backend Implementation Tasks

## 1. Project Setup (add-backend-setup)

- [x] 1.1 Initialize npm project with `package.json`
- [x] 1.2 Install production dependencies:
  - `express`, `cors`, `dotenv`, `zod`
  - `@prisma/client`
  - `applicationinsights`
- [x] 1.3 Install dev dependencies:
  - `typescript`, `@types/node`, `@types/express`, `@types/cors`
  - `ts-node-dev`, `tsx`
  - `eslint`, `prettier`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
  - `jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`
- [x] 1.4 Create `tsconfig.json` with strict mode and NodeNext module resolution
- [x] 1.5 Create `.eslintrc.json` and `.prettierrc` configuration files
- [x] 1.6 Create `src/config/env.ts` for environment variable validation
- [x] 1.7 Create `src/index.ts` with Express server setup
- [x] 1.8 Create `src/middleware/cors.ts` with environment-aware CORS config
- [x] 1.9 Create `src/routes/health.ts` with health check endpoints
- [x] 1.10 Add npm scripts: `dev`, `build`, `start`, `lint`, `format`
- [x] 1.11 Verify server starts locally on port 3001
- [x] 1.12 Test health endpoint returns correct response

## 2. Prisma Schema (add-prisma-schema)

- [x] 2.1 Initialize Prisma with `npx prisma init`
- [x] 2.2 Configure PostgreSQL datasource in `prisma/schema.prisma`
- [x] 2.3 Define `TaskStatus` enum (PENDING, COMPLETED)
- [x] 2.4 Define `TaskPriority` enum (LOW, MEDIUM, HIGH)
- [x] 2.5 Define `Task` model with all required fields
- [x] 2.6 Define `Note` model with all required fields
- [x] 2.7 Add `@@index` on `userId` for both models
- [x] 2.8 Create `src/lib/prisma.ts` singleton client
- [x] 2.9 Generate Prisma Client with `npx prisma generate`
- [x] 2.10 Create initial migration with `npx prisma migrate dev --name init`
- [x] 2.11 Verify migration applies successfully to local PostgreSQL

## 3. CRUD Endpoints (add-backend-crud)

### 3.1 Middleware
- [x] 3.1.1 Create `src/middleware/auth.ts` for userId extraction
- [x] 3.1.2 Create `src/middleware/error.ts` for centralized error handling
- [x] 3.1.3 Create `src/middleware/validate.ts` for Zod validation helper
- [x] 3.1.4 Create `src/types/express.d.ts` to extend Request type with userId

### 3.2 Tasks Service
- [x] 3.2.1 Create `src/services/task.service.ts`
- [x] 3.2.2 Implement `listTasks(userId)` - returns tasks ordered by createdAt desc
- [x] 3.2.3 Implement `createTask(userId, data)` - creates and returns task
- [x] 3.2.4 Implement `updateTask(userId, id, data)` - updates and returns task
- [x] 3.2.5 Implement `deleteTask(userId, id)` - deletes task

### 3.3 Tasks Routes
- [x] 3.3.1 Create `src/routes/tasks.ts`
- [x] 3.3.2 Define Zod schemas for task creation and update
- [x] 3.3.3 Implement `GET /api/v1/tasks` - list tasks
- [x] 3.3.4 Implement `POST /api/v1/tasks` - create task
- [x] 3.3.5 Implement `PATCH /api/v1/tasks/:id` - update task
- [x] 3.3.6 Implement `DELETE /api/v1/tasks/:id` - delete task

### 3.4 Notes Service
- [x] 3.4.1 Create `src/services/note.service.ts`
- [x] 3.4.2 Implement `listNotes(userId)` - returns notes ordered by updatedAt desc
- [x] 3.4.3 Implement `createNote(userId, data)` - creates and returns note
- [x] 3.4.4 Implement `updateNote(userId, id, data)` - updates and returns note
- [x] 3.4.5 Implement `deleteNote(userId, id)` - deletes note

### 3.5 Notes Routes
- [x] 3.5.1 Create `src/routes/notes.ts`
- [x] 3.5.2 Define Zod schemas for note creation and update
- [x] 3.5.3 Implement `GET /api/v1/notes` - list notes
- [x] 3.5.4 Implement `POST /api/v1/notes` - create note
- [x] 3.5.5 Implement `PATCH /api/v1/notes/:id` - update note
- [x] 3.5.6 Implement `DELETE /api/v1/notes/:id` - delete note

### 3.6 Integration
- [x] 3.6.1 Register all routes in `src/index.ts`
- [x] 3.6.2 Apply auth middleware to `/api/v1/*` routes
- [x] 3.6.3 Apply error middleware at the end of middleware chain
- [x] 3.6.4 Test all CRUD operations manually with curl or Postman

## 4. APM Integration (add-backend-apm)

- [x] 4.1 Create `src/lib/appInsights.ts` with initialization logic
- [x] 4.2 Configure auto-collection for requests, dependencies, exceptions
- [x] 4.3 Import and initialize App Insights **before** Express in `src/index.ts`
- [x] 4.4 Create `src/routes/simulate-error.ts` with error simulation endpoints
- [x] 4.5 Implement `GET /api/simulate-error` - returns 500 error
- [x] 4.6 Implement `GET /api/simulate-error?type=slow` - 3 second delay
- [x] 4.7 Add custom telemetry for errors in error middleware
- [x] 4.8 Test error simulation endpoint logs to Application Insights
- [x] 4.9 Verify requests appear in Live Metrics in Azure Portal

## 5. Unit Testing (add-backend-tests)

- [x] 5.1 Create `jest.config.js` with TypeScript support
- [x] 5.2 Create `tests/setup.ts` for test environment setup
- [x] 5.3 Create `tests/__mocks__/prisma.ts` for mocked Prisma client
- [x] 5.4 Create `tests/health.test.ts`:
  - [x] 5.4.1 Test GET /api/health returns 200 with status: healthy
  - [x] 5.4.2 Test GET /api/health?detail=true includes database status
- [x] 5.5 Create `tests/tasks.test.ts`:
  - [x] 5.5.1 Test GET /api/v1/tasks returns tasks for user
  - [x] 5.5.2 Test POST /api/v1/tasks creates task
  - [x] 5.5.3 Test PATCH /api/v1/tasks/:id updates task
  - [x] 5.5.4 Test DELETE /api/v1/tasks/:id deletes task
  - [x] 5.5.5 Test 401 when x-user-id header is missing
  - [x] 5.5.6 Test 404 when task not found
- [x] 5.6 Create `tests/notes.test.ts`:
  - [x] 5.6.1 Test GET /api/v1/notes returns notes for user
  - [x] 5.6.2 Test POST /api/v1/notes creates note
  - [x] 5.6.3 Test PATCH /api/v1/notes/:id updates note
  - [x] 5.6.4 Test DELETE /api/v1/notes/:id deletes note
- [x] 5.7 Add npm scripts: `test`, `test:watch`, `test:coverage`
- [x] 5.8 Verify all tests pass with `npm test`
- [x] 5.9 Generate coverage report with `npm run test:coverage`
- [x] 5.10 Ensure coverage report is in Cobertura XML format for Azure DevOps

## 6. Docker Configuration (add-backend-docker)

- [x] 6.1 Create `Dockerfile` with multi-stage build:
  - Stage 1 (builder): Install deps, generate Prisma, compile TypeScript
  - Stage 2 (runner): Copy dist, node_modules, prisma, run app
- [x] 6.2 Create `.dockerignore` to exclude dev files
- [x] 6.3 Update `package.json` scripts for production build
- [x] 6.4 Build Docker image locally: `docker build -t lifesync-backend .`
- [x] 6.5 Test container locally with Docker Compose or direct run:
  - Verify server starts
  - Verify health endpoint responds
  - Verify database connection works
- [x] 6.6 Document environment variables required for container
- [x] 6.7 Update `.env.example` with all required variables

## 7. Final Validation

- [x] 7.1 Run full test suite: `npm test`
- [x] 7.2 Run lint check: `npm run lint`
- [x] 7.3 Build production bundle: `npm run build`
- [x] 7.4 Build Docker image: `docker build -t lifesync-backend .`
- [x] 7.5 Run container and test all endpoints
- [x] 7.6 Verify Application Insights receives telemetry
- [x] 7.7 Update README with setup instructions

## Dependencies & Parallelization

**Sequential dependencies:**
- Section 1 (Setup) must complete before all other sections
- Section 2 (Prisma) must complete before Section 3 (CRUD)
- Section 3 (CRUD) must complete before Section 5 (Tests)
- Section 4 (APM) can run in parallel with Section 3 after Section 1
- Section 6 (Docker) can start after Section 1 but finalize after Section 3

**Parallelizable within sections:**
- Tasks 3.2.x and 3.4.x (services) can run in parallel
- Tasks 3.3.x and 3.5.x (routes) can run in parallel after respective services
- Tasks 5.5.x and 5.6.x (test files) can run in parallel

## Credentials Required

Before starting implementation, ensure access to:

1. **PostgreSQL Connection String** - From Azure portal or Terraform outputs
2. **Application Insights Connection String** - From Azure portal or Terraform outputs
3. **Clerk Secret Key** - From Clerk dashboard (optional for MVP, required for production)
4. **Docker Hub credentials** - For pushing images (for pipeline phase)
