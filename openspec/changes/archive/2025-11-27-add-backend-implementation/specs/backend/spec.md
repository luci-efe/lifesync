## ADDED Requirements

### Requirement: Project Initialization
The system SHALL provide a properly configured Node.js project with TypeScript support.

#### Scenario: Project Structure
- **WHEN** the backend directory is initialized
- **THEN** it contains a valid `package.json` with project metadata
- **AND** it contains TypeScript configuration in `tsconfig.json`
- **AND** it contains ESLint and Prettier configuration files
- **AND** all dependencies are listed with exact versions

#### Scenario: Development Scripts
- **WHEN** a developer runs `npm run dev`
- **THEN** the server starts in development mode with hot reload
- **AND** TypeScript files are compiled on-the-fly
- **WHEN** a developer runs `npm run build`
- **THEN** TypeScript is compiled to JavaScript in `dist/` directory

---

### Requirement: Express Server Setup
The system SHALL expose an Express server on the configured port.

#### Scenario: Server Startup
- **WHEN** `npm start` is executed
- **THEN** the server starts on `PORT` (default 3001)
- **AND** logs startup message to console
- **AND** accepts HTTP connections

#### Scenario: Environment Configuration
- **WHEN** the server starts
- **THEN** it reads environment variables from `.env` or system
- **AND** validates that `DATABASE_URL` is present
- **AND** fails with clear error if critical variables are missing

---

### Requirement: Health Check Endpoint
The system SHALL expose a health check endpoint to verify availability.

#### Scenario: Health Check Success
- **WHEN** GET `/api/health` is called
- **THEN** response status is `200`
- **AND** body is `{ "status": "healthy", "timestamp": "ISO8601", "version": "1.0.0" }`

#### Scenario: Health Check with DB Status
- **WHEN** GET `/api/health?detail=true` is called
- **THEN** response includes PostgreSQL connection status
- **AND** body is `{ "status": "healthy", "database": "connected" }`

---

### Requirement: Error Simulation Endpoint
The system SHALL expose an endpoint to simulate errors for APM demonstration.

#### Scenario: Simulate Server Error
- **WHEN** GET `/api/simulate-error` is called
- **THEN** response status is `500`
- **AND** body is `{ "error": "Simulated error for APM testing" }`
- **AND** error is recorded in Application Insights

#### Scenario: Simulate Slow Response
- **WHEN** GET `/api/simulate-error?type=slow` is called
- **THEN** response is delayed by 3 seconds
- **AND** response status is `200`
- **AND** latency is recorded in Application Insights

---

### Requirement: Prisma Database Schema
The system SHALL define the database schema using Prisma ORM.

#### Scenario: Task Model Definition
- **WHEN** Prisma schema is defined
- **THEN** `Task` model exists with fields:
  - `id`: UUID, primary key, auto-generated
  - `userId`: String, indexed (Clerk reference)
  - `title`: String, required
  - `description`: String, optional
  - `dueDate`: DateTime, optional
  - `status`: Enum (PENDING, COMPLETED)
  - `priority`: Enum (LOW, MEDIUM, HIGH)
  - `createdAt`: DateTime, default now
  - `updatedAt`: DateTime, auto-update

#### Scenario: Note Model Definition
- **WHEN** Prisma schema is defined
- **THEN** `Note` model exists with fields:
  - `id`: UUID, primary key, auto-generated
  - `userId`: String, indexed
  - `title`: String, required
  - `content`: Text, optional (markdown support)
  - `createdAt`: DateTime, default now
  - `updatedAt`: DateTime, auto-update

#### Scenario: Database Migration
- **WHEN** `npx prisma migrate dev` is executed
- **THEN** migrations are applied to PostgreSQL
- **AND** Prisma Client is generated

---

### Requirement: Tasks CRUD Endpoints
The system SHALL expose RESTful endpoints for task management.

#### Scenario: List User Tasks
- **WHEN** GET `/api/v1/tasks` with header `x-user-id` is called
- **THEN** response contains array of tasks for that user
- **AND** tasks are ordered by `createdAt` descending
- **AND** format is `{ "data": [...], "meta": { "total": N } }`

#### Scenario: Create Task
- **WHEN** POST `/api/v1/tasks` with valid body is called
- **THEN** task is created with the `userId` from header
- **AND** response status is `201`
- **AND** response body contains the created task

#### Scenario: Update Task
- **WHEN** PATCH `/api/v1/tasks/:id` with valid body is called
- **THEN** only provided fields are updated
- **AND** ownership is verified (task belongs to user)
- **AND** response body contains updated task

#### Scenario: Delete Task
- **WHEN** DELETE `/api/v1/tasks/:id` is called
- **THEN** task is deleted if it belongs to the user
- **AND** response status is `204`

#### Scenario: Task Not Found
- **WHEN** accessing a non-existent task or another user's task
- **THEN** response status is `404`
- **AND** body is `{ "error": "Task not found" }`

---

### Requirement: Notes CRUD Endpoints
The system SHALL expose RESTful endpoints for note management.

#### Scenario: List User Notes
- **WHEN** GET `/api/v1/notes` with header `x-user-id` is called
- **THEN** response contains array of notes for that user
- **AND** notes are ordered by `updatedAt` descending

#### Scenario: Create Note
- **WHEN** POST `/api/v1/notes` with valid body is called
- **THEN** note is created with the `userId` from header
- **AND** response status is `201`

#### Scenario: Update Note
- **WHEN** PATCH `/api/v1/notes/:id` is called
- **THEN** title and/or content are updated
- **AND** ownership is verified

#### Scenario: Delete Note
- **WHEN** DELETE `/api/v1/notes/:id` is called
- **THEN** note is deleted if it belongs to the user
- **AND** response status is `204`

---

### Requirement: User ID Extraction Middleware
The system SHALL extract and validate userId from requests.

#### Scenario: User ID from Header
- **WHEN** request includes header `x-user-id`
- **THEN** middleware extracts the userId
- **AND** attaches it to `req.userId`
- **AND** continues to next handler

#### Scenario: Missing User ID
- **WHEN** request does not include `x-user-id`
- **THEN** response status is `401`
- **AND** body is `{ "error": "User ID required" }`

---

### Requirement: Error Handling Middleware
The system SHALL handle errors consistently.

#### Scenario: Validation Error
- **WHEN** validation error occurs (Zod)
- **THEN** response status is `400`
- **AND** body is `{ "error": "Validation failed", "details": [...] }`

#### Scenario: Database Error
- **WHEN** Prisma error occurs
- **THEN** response status is `500`
- **AND** body is `{ "error": "Database error" }`
- **AND** internal details are logged (not exposed to client)

#### Scenario: Unhandled Error
- **WHEN** unhandled error occurs
- **THEN** response status is `500`
- **AND** body is `{ "error": "Internal server error" }`
- **AND** error is recorded in Application Insights

---

### Requirement: Application Insights Integration
The system SHALL integrate with Azure Application Insights for APM.

#### Scenario: Auto-Instrumentation
- **WHEN** server starts with `APPLICATIONINSIGHTS_CONNECTION_STRING`
- **THEN** Application Insights SDK is initialized
- **AND** auto-collection is enabled for requests, dependencies, exceptions

#### Scenario: Custom Telemetry
- **WHEN** error occurs in an endpoint
- **THEN** exception is recorded in Application Insights
- **AND** includes stack trace and request context

#### Scenario: Request Tracing
- **WHEN** any HTTP request is processed
- **THEN** duration, status code, and URL are recorded
- **AND** visible in Live Metrics and Transaction Search

---

### Requirement: CORS Configuration
The system SHALL configure CORS to allow frontend requests.

#### Scenario: Development CORS
- **WHEN** `NODE_ENV=development`
- **THEN** origin `http://localhost:3000` is allowed
- **AND** headers `Content-Type`, `x-user-id` are allowed

#### Scenario: Production CORS
- **WHEN** `NODE_ENV=production`
- **THEN** Azure frontend URL is allowed
- **AND** same headers are allowed

---

### Requirement: Docker Configuration
The system SHALL be packaged as a Docker image.

#### Scenario: Dockerfile Build
- **WHEN** `docker build -t backend .` is executed
- **THEN** image is created with Node.js 20 Alpine
- **AND** only production dependencies are included
- **AND** Prisma Client is generated

#### Scenario: Container Runtime
- **WHEN** container runs
- **THEN** server starts on exposed port
- **AND** connects to external PostgreSQL
- **AND** reads environment variables from runtime

---

### Requirement: Unit Testing
The system SHALL include unit tests with Jest.

#### Scenario: Health Endpoint Test
- **WHEN** `npm test` is executed
- **THEN** GET `/api/health` returns 200 is verified
- **AND** body contains `status: healthy`

#### Scenario: Task CRUD Tests
- **WHEN** task tests run
- **THEN** CRUD operations are tested with mocked Prisma
- **AND** userId filtering is verified

#### Scenario: Note CRUD Tests
- **WHEN** note tests run
- **THEN** CRUD operations are tested with mocked Prisma
- **AND** userId filtering is verified

#### Scenario: Test Coverage Report
- **WHEN** `npm run test:coverage` is executed
- **THEN** coverage report is generated
- **AND** format is compatible with Azure DevOps
