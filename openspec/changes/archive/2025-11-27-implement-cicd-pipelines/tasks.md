# Tasks: Implement CI/CD Pipelines

## Overview

Implementation tasks for LifeSync CI/CD pipelines in Azure DevOps.

**Estimated Effort**: Implementation + Configuration
**Dependencies**: Azure DevOps project access, Docker Hub account, Clerk credentials

---

## Phase 1: Pipeline Files Creation

### Task 1.1: Create pipelines directory structure
- [ ] Create `/pipelines/` directory at repository root
- [ ] Add `.gitkeep` or initial files

**Validation**: Directory exists and is committed

### Task 1.2: Create backend pipeline YAML
- [ ] Create `pipelines/backend-pipeline.yml`
- [ ] Configure trigger for `main` and `dev` branches
- [ ] Configure path filter for `backend/**`
- [ ] Add PR trigger for validation builds
- [ ] Implement Build stage:
  - Node.js 20 setup
  - `npm ci`
  - `npx prisma generate`
  - `npm run lint`
  - `npm test` with JUnit reporter
  - `npm run build`
  - Publish test results
  - Publish code coverage
- [ ] Implement Package stage:
  - Docker build
  - Docker push to Docker Hub
  - Tag with BuildId and branch-latest
- [ ] Implement Deploy-Dev stage:
  - Condition: `dev` branch only
  - Use `dev` environment
  - AzureWebAppContainer deployment
  - Health check verification
- [ ] Implement Deploy-Prod stage:
  - Condition: `main` branch only
  - Use `prod` environment (approval required)
  - AzureWebAppContainer deployment
  - Health check verification

**Validation**: `openspec validate implement-cicd-pipelines --strict` passes

### Task 1.3: Create frontend pipeline YAML
- [ ] Create `pipelines/frontend-pipeline.yml`
- [ ] Configure trigger for `main` and `dev` branches
- [ ] Configure path filter for `frontend/**`
- [ ] Add PR trigger for validation builds
- [ ] Implement Build stage:
  - Node.js 20 setup
  - `npm ci`
  - `npm run lint`
  - `npm run build`
- [ ] Implement Package stage:
  - Docker build with args (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_API_URL)
  - Docker push to Docker Hub
  - Tag with BuildId and branch-latest
- [ ] Implement Deploy-Dev stage:
  - Condition: `dev` branch only
  - Use `dev` environment
  - AzureWebAppContainer deployment
- [ ] Implement Deploy-Prod stage:
  - Condition: `main` branch only
  - Use `prod` environment (approval required)
  - AzureWebAppContainer deployment

**Validation**: YAML syntax is valid, stages are properly sequenced

### Task 1.4: Remove old backend pipeline file
- [ ] Delete `backend/azure-pipelines.yml` (superseded by centralized pipeline)
- [ ] Verify no references to old file

**Validation**: Old file removed, no broken references

---

## Phase 2: Azure DevOps Configuration (Manual)

### Task 2.1: Create Service Connections
- [ ] Create Azure Resource Manager service connection for Dev:
  - Name: `azure-lifesync-dev`
  - Type: Service Principal (automatic)
  - Subscription: Select Azure subscription
  - Resource Group: `rg-lifesync-dev`
- [ ] Create Azure Resource Manager service connection for Prod:
  - Name: `azure-lifesync-prod`
  - Type: Service Principal (automatic)
  - Subscription: Select Azure subscription
  - Resource Group: `rg-lifesync-prod`
- [ ] Create Docker Registry service connection:
  - Name: `dockerhub-lifesync`
  - Type: Docker Registry
  - Registry URL: `https://index.docker.io/v1/`
  - Username: Your Docker Hub username
  - Password: Docker Hub Access Token

**Validation**: Connections show "Verified" status in Azure DevOps

### Task 2.2: Create Variable Groups
- [ ] Create `LifeSync-Secrets-Dev` variable group:
  - `CLERK_PUBLISHABLE_KEY`: pk_test_... (from Clerk Dashboard)
  - `CLERK_SECRET_KEY`: sk_test_... (mark as secret)
  - `DATABASE_URL`: postgresql://... (from Terraform output, mark as secret)
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`: InstrumentationKey=... (from Terraform output, mark as secret)
  - `DOCKERHUB_USERNAME`: Your Docker Hub username
  - `DOCKERHUB_TOKEN`: Access token (mark as secret)
- [ ] Create `LifeSync-Secrets-Prod` variable group (same structure, prod values)
- [ ] Link variable groups to pipelines

**Validation**: Variable groups created with all required variables

### Task 2.3: Create Environments
- [ ] Create `dev` environment:
  - No approvals required
  - Link to backend and frontend pipelines
- [ ] Create `prod` environment:
  - Add approval check
  - Add yourself as approver
  - Set timeout to 72 hours
  - Enable email notifications

**Validation**: Environments visible in Azure DevOps, approval gate configured for prod

### Task 2.4: Configure Branch Policies
- [ ] Configure `main` branch:
  - Require pull request
  - Require at least 1 reviewer
  - Require build validation (both pipelines)
  - Disallow direct push
- [ ] Configure `dev` branch:
  - Require pull request
  - Require build validation

**Validation**: Cannot push directly to main/dev, PRs trigger validation builds

---

## Phase 3: Documentation

### Task 3.1: Create CI/CD setup guide
- [ ] Create `docs/CICD-SETUP.md` with:
  - Prerequisites (Azure subscription, Docker Hub account, Clerk account)
  - Step-by-step Azure DevOps configuration
  - Variable group values documentation
  - Service connection setup instructions
  - Environment configuration guide
  - Troubleshooting common issues

**Validation**: Documentation is clear and complete

---

## Phase 4: Verification & Testing

### Task 4.1: Test backend pipeline
- [ ] Create test branch with backend changes
- [ ] Open PR to `dev` branch
- [ ] Verify PR validation build runs
- [ ] Verify test results appear in Azure DevOps
- [ ] Merge PR to `dev`
- [ ] Verify Deploy-Dev stage runs automatically
- [ ] Verify health check passes (`/api/health` returns 200)
- [ ] Verify Docker image pushed to Docker Hub

**Validation**: Full pipeline executed successfully for dev

### Task 4.2: Test frontend pipeline
- [ ] Create test branch with frontend changes
- [ ] Open PR to `dev` branch
- [ ] Verify PR validation build runs
- [ ] Merge PR to `dev`
- [ ] Verify Deploy-Dev stage runs automatically
- [ ] Verify frontend accessible and functional

**Validation**: Full pipeline executed successfully for dev

### Task 4.3: Test production deployment flow
- [ ] Create PR from `dev` to `main`
- [ ] Verify build validation passes
- [ ] Merge PR to `main`
- [ ] Verify approval notification received
- [ ] Approve deployment
- [ ] Verify Deploy-Prod stages execute
- [ ] Verify production applications functional

**Validation**: Approval gate works, production deployment successful

### Task 4.4: Verify environment synchronization
- [ ] Verify backend health check: `GET /api/health` returns 200
- [ ] Verify frontend loads correctly
- [ ] Test Clerk authentication (sign in/sign up)
- [ ] Test Tasks CRUD operations
- [ ] Test Notes CRUD operations
- [ ] Verify data persists in PostgreSQL
- [ ] Verify App Insights shows traces/requests

**Validation**: Full stack working end-to-end

---

## Phase 5: Cleanup & Finalization

### Task 5.1: Clean up test artifacts
- [ ] Remove any test branches
- [ ] Clean up test data if any

### Task 5.2: Archive OpenSpec change
- [ ] Run `openspec archive implement-cicd-pipelines --yes`
- [ ] Verify specs updated

**Validation**: Change archived successfully

---

## Dependencies Graph

```
Phase 1 (Pipeline Files)
    │
    ├── Task 1.1 (Create directory)
    │       │
    │       ├── Task 1.2 (Backend YAML)
    │       │
    │       └── Task 1.3 (Frontend YAML)
    │               │
    │               └── Task 1.4 (Remove old file)
    │
    ▼
Phase 2 (Azure DevOps Config) ──── Parallel with Phase 1
    │
    ├── Task 2.1 (Service Connections)
    │       │
    │       └── Task 2.2 (Variable Groups)
    │
    └── Task 2.3 (Environments)
            │
            └── Task 2.4 (Branch Policies)
    │
    ▼
Phase 3 (Documentation) ──── Can start anytime
    │
    ▼
Phase 4 (Verification) ──── Requires Phase 1 + 2
    │
    ├── Task 4.1 (Test backend)
    │       │
    │       └── Task 4.2 (Test frontend)
    │               │
    │               └── Task 4.3 (Test prod flow)
    │                       │
    │                       └── Task 4.4 (Verify sync)
    │
    ▼
Phase 5 (Cleanup)
```

---

## Quick Reference: Required Credentials

| Credential | Where to Get | Used In |
|------------|--------------|---------|
| Docker Hub Username | hub.docker.com | Variable Group |
| Docker Hub Access Token | hub.docker.com > Settings > Security | Variable Group |
| Clerk Publishable Key | dashboard.clerk.com | Variable Group |
| Clerk Secret Key | dashboard.clerk.com | Variable Group |
| DATABASE_URL | `terraform output postgresql_connection_string` | Variable Group |
| APPLICATIONINSIGHTS_CONNECTION_STRING | `terraform output app_insights_connection_string` | Variable Group |
| Azure Subscription ID | Azure Portal | Service Connection |
