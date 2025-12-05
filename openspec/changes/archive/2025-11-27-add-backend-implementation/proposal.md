# Change: Add Backend Implementation

## Why

The LifeSync application requires a fully functional backend API to support the frontend application. The infrastructure (Azure App Service, PostgreSQL, Application Insights) is already deployed and running in Azure. This proposal implements the complete Express.js backend including:

1. **Project Setup** - TypeScript + Express foundation with health check endpoints
2. **Database Schema** - Prisma ORM with Task and Note models
3. **CRUD Endpoints** - RESTful API for Tasks and Notes management
4. **APM Integration** - Azure Application Insights for monitoring and error tracking
5. **Unit Testing** - Jest tests with coverage reporting
6. **Docker Configuration** - Multi-stage Dockerfile for containerized deployment

This implementation fulfills the academic rubric requirements for:
- Backend Pipeline with UAT and Coverage (10 pts)
- APM Monitoring with traces/errors (10 pts)
- Visible changes in Dev and Prod environments (20 pts)

## What Changes

### Phase 1: Express Server Setup (`add-backend-setup`)
- Initialize Node.js project with TypeScript configuration
- Configure Express.js server with middleware (CORS, JSON parsing)
- Implement health check endpoints (`GET /api/health`, `GET /api/health?detail=true`)
- Implement error simulation endpoint (`GET /api/simulate-error`)
- Environment variable validation and configuration

### Phase 2: Prisma Database Schema (`add-prisma-schema`)
- Initialize Prisma with PostgreSQL provider
- Define Task model with status (PENDING/COMPLETED) and priority (LOW/MEDIUM/HIGH) enums
- Define Note model with markdown content support
- Generate initial migration and Prisma Client

### Phase 3: CRUD Endpoints (`add-backend-crud`)
- User ID extraction middleware (from `x-user-id` header)
- Tasks CRUD: `GET/POST/PATCH/DELETE /api/v1/tasks`
- Notes CRUD: `GET/POST/PATCH/DELETE /api/v1/notes`
- Error handling middleware with consistent response format
- Input validation using Zod

### Phase 4: APM Integration (`add-backend-apm`)
- Azure Application Insights SDK integration
- Auto-instrumentation for requests, dependencies, exceptions
- Custom telemetry for error tracking with stack traces
- Request tracing for Live Metrics and Transaction Search

### Phase 5: Unit Testing (`add-backend-tests`)
- Jest configuration with TypeScript support
- Health endpoint tests
- Tasks CRUD tests with mocked Prisma
- Notes CRUD tests with mocked Prisma
- Coverage report generation in Azure DevOps compatible format

### Phase 6: Docker Configuration (`add-backend-docker`)
- Multi-stage Dockerfile with Node.js 20 Alpine
- Production dependencies only
- Prisma Client generation in build stage
- Port 3001 exposure with environment variable support

## Impact

- **Affected specs**: `backend` (full implementation of all requirements)
- **Affected code**:
  - `backend/` - New directory with complete Express.js API
  - `backend/src/` - Source code with routes, services, middleware
  - `backend/prisma/` - Database schema and migrations
  - `backend/tests/` - Jest unit tests
  - `backend/Dockerfile` - Container configuration
- **Dependencies**:
  - Infrastructure already deployed (Azure App Service, PostgreSQL, Application Insights)
  - Clerk authentication keys required for production
  - Docker Hub for image publishing
