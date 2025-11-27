# Design: Implement CI/CD Pipelines

## Context

LifeSync is a personal organization web app with:
- **Backend**: Node.js 20 + Express + Prisma (PostgreSQL)
- **Frontend**: Next.js 14 + Tailwind CSS
- **Infrastructure**: Azure App Service (Linux containers) + PostgreSQL Flexible Server
- **Container Registry**: Docker Hub (per academic requirement)

This design documents the CI/CD pipeline architecture for Azure DevOps.

## Goals

1. **Automated Quality Gates**: Lint and test on every push
2. **Containerized Deployments**: Docker images pushed to Docker Hub
3. **Environment Separation**: Dev (automatic) and Prod (manual approval)
4. **Traceability**: Clear audit trail of what was deployed when
5. **Academic Compliance**: Meet rubric requirements for the course

## Non-Goals

- Infrastructure pipeline (Terraform runs locally)
- Database migration pipeline (Prisma runs at app startup)
- Blue-green or canary deployments
- Performance testing automation
- Multi-region deployments

## Architecture Decisions

### Decision 1: Centralized Pipelines Directory

**Choice**: Place pipeline files in `/pipelines/` at repo root

**Rationale**:
- Clear separation from application code
- Easy to find and manage all pipeline definitions
- Follows Azure DevOps best practices for multi-app repos

**Alternatives Considered**:
- Keep in `backend/azure-pipelines.yml` - Harder to manage, less discoverable
- Use `.azure-pipelines/` directory - Non-standard naming

### Decision 2: Multi-Stage YAML Pipelines

**Choice**: Single YAML file per component with multiple stages

```
Pipeline Flow:
┌─────────┐   ┌─────────┐   ┌───────────┐   ┌────────────┐
│  Build  │──▶│ Package │──▶│ Deploy-Dev│──▶│ Deploy-Prod│
│ & Test  │   │ Docker  │   │ (auto)    │   │ (approval) │
└─────────┘   └─────────┘   └───────────┘   └────────────┘
```

**Rationale**:
- Stages provide clear visual progress in Azure DevOps
- Built-in support for environments and approvals
- All pipeline logic in one versionable file

### Decision 3: Branch-Based Triggers

**Choice**: Different behavior for `dev` and `main` branches

| Branch | CI (Build/Test) | CD to Dev | CD to Prod |
|--------|-----------------|-----------|------------|
| `dev`  | Yes | Yes (auto) | No |
| `main` | Yes | No | Yes (approval) |
| `feature/*` | PR validation only | No | No |

**Rationale**:
- Dev branch for integration testing
- Main branch represents production-ready code
- Feature branches validated via PR builds

### Decision 4: Docker Hub as Container Registry

**Choice**: Use Docker Hub instead of Azure Container Registry (ACR)

**Rationale**:
- Academic requirement explicitly states Docker Hub
- Free tier sufficient for project scope
- Demonstrates real-world public registry workflow

**Configuration**:
```
Images:
  - {username}/lifesync-backend:dev-latest
  - {username}/lifesync-backend:{build-id}
  - {username}/lifesync-frontend:dev-latest
  - {username}/lifesync-frontend:{build-id}
```

### Decision 5: Azure DevOps Environments for Approvals

**Choice**: Use Environments feature with approval gates

**Rationale**:
- Native Azure DevOps feature
- Visual approval history
- Email notifications to approvers
- Configurable timeout (72 hours)

**Configuration**:
```yaml
environments:
  - name: dev
    approvals: none

  - name: prod
    approvals:
      - type: manual
        approvers: [project-admin]
        timeout: 72h
```

### Decision 6: Variable Groups for Secrets

**Choice**: Separate Variable Groups per environment

**Rationale**:
- Secrets stay out of YAML files
- Environment-specific values isolated
- Easy to update without pipeline changes
- Secret masking in logs

**Structure**:
```
Library/
├── LifeSync-Secrets-Dev
│   ├── CLERK_PUBLISHABLE_KEY
│   ├── CLERK_SECRET_KEY (secret)
│   ├── DATABASE_URL (secret)
│   ├── APPLICATIONINSIGHTS_CONNECTION_STRING (secret)
│   ├── DOCKERHUB_USERNAME
│   └── DOCKERHUB_TOKEN (secret)
│
└── LifeSync-Secrets-Prod
    └── (same structure)
```

## Pipeline Specifications

### Backend Pipeline (`pipelines/backend-pipeline.yml`)

```yaml
# Trigger Configuration
trigger:
  branches:
    include: [main, dev]
  paths:
    include: [backend/**, pipelines/backend-pipeline.yml]

# PR Validation
pr:
  branches:
    include: [main, dev]
  paths:
    include: [backend/**]

# Stages
stages:
  1. Build:
     - Node.js 20 setup
     - npm ci
     - Prisma generate
     - npm run lint
     - npm test (with JUnit output)
     - npm run build
     - Publish test results
     - Publish coverage

  2. Package:
     - Docker build
     - Docker push to Docker Hub
     - Tags: {build-id}, {branch}-latest

  3. Deploy-Dev:
     - Condition: dev branch only
     - Environment: dev (no approval)
     - AzureWebAppContainer task
     - Health check: /api/health

  4. Deploy-Prod:
     - Condition: main branch only
     - Environment: prod (requires approval)
     - AzureWebAppContainer task
     - Health check: /api/health
```

### Frontend Pipeline (`pipelines/frontend-pipeline.yml`)

```yaml
# Trigger Configuration
trigger:
  branches:
    include: [main, dev]
  paths:
    include: [frontend/**, pipelines/frontend-pipeline.yml]

# Stages
stages:
  1. Build:
     - Node.js 20 setup
     - npm ci
     - npm run lint
     - npm run build

  2. Package:
     - Docker build with args:
       - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
       - NEXT_PUBLIC_API_URL (environment-specific)
     - Docker push to Docker Hub

  3. Deploy-Dev:
     - Condition: dev branch only
     - Environment: dev
     - AzureWebAppContainer task

  4. Deploy-Prod:
     - Condition: main branch only
     - Environment: prod (requires approval)
     - AzureWebAppContainer task
```

## Service Connection Configuration

### Azure Resource Manager Connections

**Dev Connection**:
- **Name**: `azure-lifesync-dev`
- **Type**: Service Principal (automatic)
- **Scope**: Resource Group `rg-lifesync-dev`
- **Permissions**: Contributor on Web Apps

**Prod Connection**:
- **Name**: `azure-lifesync-prod`
- **Type**: Service Principal (automatic)
- **Scope**: Resource Group `rg-lifesync-prod`
- **Permissions**: Contributor on Web Apps

**Rationale**: Using resource-group-scoped connections follows least privilege principle and provides better isolation between environments.

### Docker Registry Connection

**Name**: `dockerhub-lifesync`
**Type**: Docker Registry
**Registry**: `https://index.docker.io/v1/`
**Authentication**: Docker Hub username + Access Token

## Deployment Flow Diagrams

### Dev Deployment (Automatic)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Developer   │     │   Azure      │     │    Azure     │
│  merges PR   │────▶│   DevOps     │────▶│   Web App    │
│  to 'dev'    │     │   Pipeline   │     │   (Dev)      │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Docker Hub  │
                     │  (dev-latest)│
                     └──────────────┘
```

### Prod Deployment (With Approval)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Developer   │     │   Azure      │     │   Approval   │
│  merges PR   │────▶│   DevOps     │────▶│   Gate       │
│  to 'main'   │     │   Pipeline   │     │   (email)    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                           ┌──────▼───────┐
                                           │   Approver   │
                                           │   Reviews    │
                                           └──────┬───────┘
                                                  │
                            ┌─────────────────────┴────────────┐
                            │                                   │
                      ┌─────▼─────┐                      ┌─────▼─────┐
                      │  Approve  │                      │  Reject   │
                      └─────┬─────┘                      └───────────┘
                            │
                     ┌──────▼──────┐
                     │  Deploy to  │
                     │  Production │
                     └─────────────┘
```

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pipeline timeout (free tier) | Build fails | Optimize npm install with cache |
| Secrets in logs | Security breach | Use secret variables, verify masking |
| Deploy fails, no rollback | Downtime | Health check fails stage, manual rollback |
| Approval forgotten | Blocked release | 72h timeout, email notifications |
| Database schema mismatch | App errors | Prisma migrations run at startup |
| Wrong environment config | Data corruption | Separate Variable Groups per env |

## Testing Strategy

### Pipeline Testing
1. Create feature branch with pipeline changes
2. Open PR to trigger validation build
3. Verify all stages execute correctly
4. Check test results appear in Azure DevOps
5. Verify Docker image is pushed with correct tags

### Deployment Verification
1. **Dev**: Automatic after merge to `dev`
   - Health check endpoint responds 200
   - App Insights shows traces

2. **Prod**: After approval
   - Health check endpoint responds 200
   - Manual smoke test of core features

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Include lint as separate stage? | No, combine with Build for simplicity |
| Tag Docker images with branch name? | Yes, use `{branch}-latest` pattern |
| Run database migrations in pipeline? | No, Prisma runs at app startup |
| Separate pipeline for PR validation? | No, use same pipeline with PR trigger |
