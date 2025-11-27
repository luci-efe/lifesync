# Change: Implement Terraform Infrastructure for LifeSync

## Why
LifeSync requires cloud infrastructure in Azure to host the application. The infrastructure specification (`specs/infra/spec.md`) defines all requirements, but no Terraform code exists yet. This proposal implements the IaC foundation using modular Terraform following patterns from the reference implementation in `project-context/terraform reference/`.

## What Changes
- Create `infra/` directory with modular Terraform structure
- Implement Resource Group module for environment isolation
- Implement App Service Plan module with F1/B1 SKU support
- Implement Web App module for Backend and Frontend (dev/prod)
- Implement PostgreSQL Flexible Server with dev/prod databases
- Implement Application Insights with Log Analytics Workspace
- Create environment-specific tfvars (dev.tfvars, prod.tfvars)
- Output connection strings and URLs for pipeline integration

## Impact
- **Affected specs**: `infra`
- **Affected code**: New `infra/` directory (approximately 15-20 files)
- **External dependencies**:
  - Azure subscription (Student tier verified)
  - Docker Hub account (already configured in Variable Groups)
  - Terraform CLI >= 1.1.0
  - Azure CLI (for authentication)
- **Cost**: ~$27-30/month within $100 student credits

## Prerequisites (Manual Steps Required)
Before running `terraform apply`, the implementer MUST:
1. **Authenticate to Azure**: Run `az login` and select the correct subscription
2. **Verify subscription**: Ensure `eastus2` region is available
3. **Gather credentials** (already in Azure DevOps Variable Groups):
   - `DOCKERHUB_USERNAME` - For pipeline integration
   - `DOCKERHUB_TOKEN` - For pipeline integration
4. **After terraform apply**, copy outputs to Variable Groups:
   - `DATABASE_URL` - PostgreSQL connection string
   - `APPLICATIONINSIGHTS_CONNECTION_STRING` - APM connection string

## Reference Implementation
This proposal follows patterns from `project-context/terraform reference/`:
- Modular architecture (resource-group, app-service-plan, web-app, etc.)
- Explicit `depends_on` declarations for resource sequencing
- Variable validation for constrained inputs (OS type, SKU)
- Comprehensive outputs including summary object
- Tags for resource organization (Environment, Project, ManagedBy)
