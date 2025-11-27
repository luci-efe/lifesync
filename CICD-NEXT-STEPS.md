# CI/CD Implementation - Next Steps

This document outlines the steps to complete the CI/CD setup for LifeSync in Azure DevOps.

## Current Status

- [x] Pipeline YAML files created (`pipelines/backend-pipeline.yml`, `pipelines/frontend-pipeline.yml`)
- [x] Documentation created (`docs/CICD-SETUP.md`)
- [x] Variable Groups configured (`LifeSync-Secrets-Dev`, `LifeSync-Secrets-Prod`)
- [x] Service Connections configured (`azure-lifesync-dev`, `azure-lifesync-prod`, `dockerhub-lifesync`)
- [x] Changes committed to `feature/ci-cd-and-integration` branch

---

## Step 1: Create Pull Request to `dev`

1. Go to Azure DevOps → Repos → Pull Requests
2. Click **New Pull Request**
3. Configure:
   - Source branch: `feature/ci-cd-and-integration`
   - Target branch: `dev`
   - Title: `feat(pipeline): implement CI/CD pipelines for backend and frontend`
4. Click **Create**
5. Complete the PR (approve and merge)

---

## Step 2: Create Pipelines in Azure DevOps

After the PR is merged, create both pipelines:

### Backend Pipeline

1. Go to **Pipelines** → **New Pipeline**
2. Select **Azure Repos Git**
3. Select your repository
4. Select **Existing Azure Pipelines YAML file**
5. Branch: `dev`
6. Path: `/pipelines/backend-pipeline.yml`
7. Click **Continue** → **Run** (or Save first to review)

### Frontend Pipeline

1. Go to **Pipelines** → **New Pipeline**
2. Select **Azure Repos Git**
3. Select your repository
4. Select **Existing Azure Pipelines YAML file**
5. Branch: `dev`
6. Path: `/pipelines/frontend-pipeline.yml`
7. Click **Continue** → **Run** (or Save first to review)

---

## Step 3: Create `prod` Environment with Approval Gate

**Important**: Do this BEFORE merging anything to `main`.

1. Go to **Pipelines** → **Environments**
2. Click **New environment**
3. Name: `prod`
4. Click **Create**
5. Click on the `prod` environment
6. Click **⋮** (three dots) → **Approvals and checks**
7. Click **+** → **Approvals**
8. Add yourself (or team members) as approvers
9. Optional: Set timeout (e.g., 72 hours)
10. Click **Create**

> Note: The `dev` environment will auto-create when the pipeline first runs. No approvals needed for dev.

---

## Step 4: Verify Dev Deployment

After pipelines run on the `dev` branch:

1. Check pipeline execution in Azure DevOps → Pipelines
2. Verify all stages passed: Build → Package → DeployDev
3. Test the deployed applications:
   - Backend: https://lifesync-backend-dev.azurewebsites.net/api/health
   - Frontend: https://lifesync-frontend-dev.azurewebsites.net
4. Verify in Azure Portal:
   - App Services are running
   - Application Insights shows traces

---

## Step 5: Production Deployment (When Ready)

When you're ready to deploy to production:

1. Create PR from `dev` → `main`
2. Complete the PR (approve and merge)
3. Pipeline triggers automatically
4. Build and Package stages run
5. **DeployProd stage waits for approval**
6. You'll receive an email notification
7. Go to the pipeline run → Click **Review** → **Approve**
8. Deployment proceeds to production

---

## Troubleshooting

### Pipeline fails at Build stage
- Check lint errors: `npm run lint` locally
- Check test failures: `npm test` locally
- Review pipeline logs for specific errors

### Docker push fails
- Verify `dockerhub-lifesync` service connection is valid
- Ensure Docker Hub token has Read & Write permissions
- Check `DOCKERHUB_USERNAME` in Variable Group matches your Docker Hub username

### Deployment fails
- Verify Azure service connections have Contributor access to resource groups
- Check App Service logs in Azure Portal
- Ensure `DOCKER_ENABLE_CI` is set to `true` in App Service Configuration

### Environment not found
- Environments auto-create on first run
- For `prod`, manually create with approval gate before merging to `main`

---

## Quick Reference

### URLs

| Environment | Backend | Frontend |
|-------------|---------|----------|
| Dev | https://lifesync-backend-dev.azurewebsites.net | https://lifesync-frontend-dev.azurewebsites.net |
| Prod | https://lifesync-backend-prod.azurewebsites.net | https://lifesync-frontend-prod.azurewebsites.net |

### Azure DevOps Resources

| Resource | Name |
|----------|------|
| Variable Group (Dev) | `LifeSync-Secrets-Dev` |
| Variable Group (Prod) | `LifeSync-Secrets-Prod` |
| Service Connection (Dev) | `azure-lifesync-dev` |
| Service Connection (Prod) | `azure-lifesync-prod` |
| Service Connection (Docker) | `dockerhub-lifesync` |
| Environment (Dev) | `dev` |
| Environment (Prod) | `prod` |

### Pipeline Triggers

| Action | Backend Pipeline | Frontend Pipeline |
|--------|-----------------|-------------------|
| Push to `dev` | Build → Package → DeployDev | Build → Package → DeployDev |
| Push to `main` | Build → Package → DeployProd (approval) | Build → Package → DeployProd (approval) |
| PR to `dev` or `main` | Build only (validation) | Build only (validation) |

---

## Next Actions Checklist

- [ ] Create PR from `feature/ci-cd-and-integration` to `dev`
- [ ] Merge the PR
- [ ] Create Backend Pipeline in Azure DevOps
- [ ] Create Frontend Pipeline in Azure DevOps
- [ ] Verify pipelines run successfully
- [ ] Create `prod` environment with approval gate
- [ ] Test dev deployment (health check, frontend access)
- [ ] (Later) Create PR from `dev` to `main` for production deployment
