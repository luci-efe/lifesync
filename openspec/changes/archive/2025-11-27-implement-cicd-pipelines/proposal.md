# Proposal: Implement CI/CD Pipelines

## Summary

Implement complete CI/CD pipelines for LifeSync application in Azure DevOps, covering:
- **Backend Pipeline**: Linting, testing, Docker build, and deployment to Dev/Prod
- **Frontend Pipeline**: Linting, Next.js build, Docker build, and deployment to Dev/Prod
- **Approval Gates**: Manual approval required for production deployments
- **Environment Synchronization**: Ensure frontend, backend, and database are correctly synced

## Motivation

The LifeSync project requires automated CI/CD pipelines to:
1. Validate code quality through linting and testing
2. Build and push Docker images to Docker Hub
3. Deploy to Dev environment automatically on `dev` branch merges
4. Deploy to Prod environment with approval gates on `main` branch merges
5. Meet academic rubric requirements (pipelines, tests, approval gates, APM)

## Current State Analysis

### Existing Assets
- **Backend `azure-pipelines.yml`**: Partial implementation exists at `backend/azure-pipelines.yml`
  - Has Build stage with Node 20, npm ci, Prisma generate, build, test
  - Has Docker stage for build and push
  - Missing: Lint step, Dev/Prod deployment stages, proper triggers
  - Uses placeholder values for Docker Hub username

- **Frontend**: No pipeline exists yet
  - Has Dockerfile ready (multi-stage with build args)
  - Has `npm run lint` available (Next.js ESLint)
  - No test framework configured (acceptable per rubric)

- **Infrastructure**: Terraform already deployed for Dev environment
  - Web Apps: `lifesync-backend-dev`, `lifesync-frontend-dev`
  - PostgreSQL: `psql-lifesync-dev` with database `lifesync_dev`
  - App Insights: `appi-lifesync-dev`

### What Needs to Be Created
1. `pipelines/backend-pipeline.yml` - Complete multi-stage backend pipeline
2. `pipelines/frontend-pipeline.yml` - Complete multi-stage frontend pipeline
3. Azure DevOps configuration guide for:
   - Variable Groups (`LifeSync-Secrets-Dev`, `LifeSync-Secrets-Prod`)
   - Service Connections (`azure-lifesync`, `dockerhub-lifesync`)
   - Environments (`dev`, `prod` with approval gates)
   - Branch policies

## Scope

### In Scope
- Backend CI/CD pipeline (lint, test, docker, deploy dev, deploy prod)
- Frontend CI/CD pipeline (lint, build, docker, deploy dev, deploy prod)
- Approval gates for production deployments
- Variable groups for secrets management
- Health check verification after deployments
- Pipeline documentation

### Out of Scope
- Terraform pipeline (infrastructure runs locally)
- Blue-green deployments
- Canary releases
- Performance/load testing
- Database migration automation (handled by backend at startup)

## Credentials Required

### Azure DevOps Variable Groups

**`LifeSync-Secrets-Dev`** (to be created):
| Variable | Description | Source |
|----------|-------------|--------|
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend key | Clerk Dashboard |
| `CLERK_SECRET_KEY` | Clerk backend key (secret) | Clerk Dashboard |
| `DATABASE_URL` | PostgreSQL connection string (secret) | Terraform output |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | App Insights connection (secret) | Terraform output |
| `DOCKERHUB_USERNAME` | Docker Hub username | Docker Hub account |
| `DOCKERHUB_TOKEN` | Docker Hub access token (secret) | Docker Hub Settings > Security |

**`LifeSync-Secrets-Prod`** (same structure, production values)

### Azure DevOps Service Connections

| Connection Name | Type | Scope | Purpose |
|-----------------|------|-------|---------|
| `azure-lifesync-dev` | Azure Resource Manager | `rg-lifesync-dev` | Deploy to Dev Web Apps |
| `azure-lifesync-prod` | Azure Resource Manager | `rg-lifesync-prod` | Deploy to Prod Web Apps |
| `dockerhub-lifesync` | Docker Registry | N/A | Push images to Docker Hub |

**Note**: Using resource-group-scoped connections follows the principle of least privilege.

## Infrastructure Updates Required

**No Terraform changes required** - The existing infrastructure supports the CI/CD deployment:
- Web Apps are configured for Docker containers with `DOCKER_ENABLE_CI=true`
- PostgreSQL is accessible from Azure services
- App Insights connection strings are available as outputs

**However**, you may need to:
1. Run `terraform apply` for production environment if not yet deployed
2. Note the outputs for DATABASE_URL and APPLICATIONINSIGHTS_CONNECTION_STRING

## Environment Synchronization

The frontend, backend, and database synchronization is **automatic** through the deployment process:

1. **Database Schema**: Prisma migrations run at backend startup (existing behavior)
2. **Backend-Frontend API**: Frontend's `NEXT_PUBLIC_API_URL` build arg points to correct backend URL
3. **Deployment Order**: Backend deploys first, frontend second (implicit dependency through stages)

**Manual verification steps after CI/CD is configured**:
- [ ] Backend `/api/health` returns 200
- [ ] Frontend loads and can authenticate with Clerk
- [ ] Tasks/Notes CRUD operations work end-to-end
- [ ] App Insights shows traces/requests

## Impact Assessment

### Files Created
- `pipelines/backend-pipeline.yml` - Complete backend pipeline
- `pipelines/frontend-pipeline.yml` - Complete frontend pipeline
- `docs/CICD-SETUP.md` - Configuration guide for Azure DevOps

### Files Modified
- None (existing `backend/azure-pipelines.yml` will be superseded)

### Files Deleted
- `backend/azure-pipelines.yml` - Replaced by centralized pipeline

## Answers to Your Questions

### 1. Does this cover Linting and Testing in CI?
**Yes.** Both pipelines include:
- **Backend**: `npm run lint` (ESLint) + `npm test` (Jest with JUnit/Cobertura reporting)
- **Frontend**: `npm run lint` (Next.js ESLint) - No test framework exists, acceptable per rubric

### 2. Does this cover CD to push to Docker Hub for Dev?
**Yes.** When code is merged to `dev` branch:
1. Pipeline builds Docker image
2. Tags with `$(Build.BuildId)` and `dev-latest`
3. Pushes to Docker Hub: `{username}/lifesync-backend`, `{username}/lifesync-frontend`
4. Updates Azure Web App to use new image

### 3. Does this cover CD for merging dev into main (Production)?
**Yes.** When code is merged to `main` branch:
1. Pipeline runs full CI (lint, test, build)
2. Builds and pushes Docker image with `prod-latest` tag
3. **Requires manual approval** via Azure DevOps Environment
4. After approval, deploys to production Web Apps

### 4. What credentials are needed?
See "Credentials Required" section above. Summary:
- Docker Hub: Username + Access Token
- Clerk: Publishable Key + Secret Key (both environments)
- Azure: Service Principal for Resource Manager connection
- Terraform outputs: DATABASE_URL, APPLICATIONINSIGHTS_CONNECTION_STRING

### 5. Should infra files be updated?
**No infrastructure code changes needed.** Optionally:
- Run `terraform apply` with `environment=prod` to create production resources
- Document Terraform outputs needed for Variable Groups

### 6. Can frontend/backend/database sync be done now?
**Yes, verification can be done after CI/CD setup:**
- Database syncs automatically via Prisma migrations on backend startup
- Frontend-backend connection is configured via build args
- Manual smoke test checklist included in tasks
