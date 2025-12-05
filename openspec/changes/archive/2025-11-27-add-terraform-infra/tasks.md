# Implementation Tasks: Terraform Infrastructure

## Prerequisites (Manual - Before Implementation)
- [ ] 0.1 Verify Azure CLI is installed and run `az login`
- [ ] 0.2 Verify correct subscription is selected: `az account show`
- [ ] 0.3 Verify `eastus2` region is available: `az account list-locations --query "[?name=='eastus2']"`
- [ ] 0.4 Gather Docker Hub username from Azure DevOps Variable Group `LifeSync-Secrets-Dev`
- [ ] 0.5 Decide PostgreSQL admin password (must meet complexity requirements: 8+ chars, mixed case, numbers)

---

## 1. Project Structure Setup
- [ ] 1.1 Create `infra/` directory at project root
- [ ] 1.2 Create `infra/modules/` directory for reusable modules
- [ ] 1.3 Create `infra/environments/` directory for tfvars files
- [ ] 1.4 Add `.gitignore` entries for Terraform state files:
  - `*.tfstate`
  - `*.tfstate.*`
  - `.terraform/`
  - `*.tfvars` (except environments/)
  - `tfplan`

---

## 2. Root Module Configuration
- [ ] 2.1 Create `infra/main.tf` with:
  - `terraform` block (required_providers, required_version)
  - `provider "azurerm"` with features block
  - Module calls for all infrastructure components
- [ ] 2.2 Create `infra/variables.tf` with root-level variables:
  - `environment` (string, validated: dev/prod)
  - `location` (string, default: eastus2)
  - `project_name` (string, default: lifesync)
  - `app_service_sku` (string, validated: F1/B1/B2/B3)
  - `dockerhub_username` (string, required)
  - `postgresql_admin_login` (string, required)
  - `postgresql_admin_password` (string, sensitive, required)
  - `owner_email` (string, required for tagging)
- [ ] 2.3 Create `infra/outputs.tf` with:
  - Web App URLs (frontend-dev, frontend-prod, backend-dev, backend-prod)
  - PostgreSQL connection strings (sensitive)
  - Application Insights connection string (sensitive)
  - Resource Group name
  - Summary object for quick reference

---

## 3. Resource Group Module
- [ ] 3.1 Create `infra/modules/resource-group/main.tf`:
  - `azurerm_resource_group` resource
  - Name pattern: `rg-{project}-{env}`
- [ ] 3.2 Create `infra/modules/resource-group/variables.tf`:
  - `name`, `location`, `tags`
- [ ] 3.3 Create `infra/modules/resource-group/outputs.tf`:
  - `id`, `name`, `location`

---

## 4. App Service Plan Module
- [ ] 4.1 Create `infra/modules/app-service-plan/main.tf`:
  - `azurerm_service_plan` resource
  - Name pattern: `asp-{project}-{env}`
  - OS type: Linux
  - SKU configurable (F1/B1)
- [ ] 4.2 Create `infra/modules/app-service-plan/variables.tf`:
  - `name`, `resource_group_name`, `location`, `os_type`, `sku_name`, `tags`
  - Add validation for `os_type` (Linux only for containers)
  - Add validation for `sku_name`
- [ ] 4.3 Create `infra/modules/app-service-plan/outputs.tf`:
  - `id`, `name`, `sku_name`

---

## 5. Web App Module
- [ ] 5.1 Create `infra/modules/web-app/main.tf`:
  - `azurerm_linux_web_app` resource
  - Container configuration for Docker Hub
  - App settings for WEBSITES_PORT
  - Application Insights integration (optional)
- [ ] 5.2 Create `infra/modules/web-app/variables.tf`:
  - `name`, `resource_group_name`, `location`, `service_plan_id`
  - `docker_image_name`, `docker_registry_url`
  - `websites_port`, `app_settings` (map)
  - `tags`
- [ ] 5.3 Create `infra/modules/web-app/outputs.tf`:
  - `id`, `name`, `default_hostname`, `url` (https://...)

---

## 6. PostgreSQL Module
- [ ] 6.1 Create `infra/modules/postgresql/main.tf`:
  - `azurerm_postgresql_flexible_server` resource
  - Name pattern: `psql-{project}`
  - Burstable tier (B_Standard_B1ms)
  - PostgreSQL version 16
  - Storage: 32GB
  - `azurerm_postgresql_flexible_server_firewall_rule` for Azure Services
  - `azurerm_postgresql_flexible_server_database` for dev and prod databases
- [ ] 6.2 Create `infra/modules/postgresql/variables.tf`:
  - `name`, `resource_group_name`, `location`
  - `administrator_login`, `administrator_password` (sensitive)
  - `sku_name`, `storage_mb`, `version`
  - `databases` (list of database names)
  - `tags`
- [ ] 6.3 Create `infra/modules/postgresql/outputs.tf`:
  - `id`, `name`, `fqdn`
  - `connection_strings` (map, sensitive) for each database

---

## 7. Application Insights Module
- [ ] 7.1 Create `infra/modules/app-insights/main.tf`:
  - `azurerm_log_analytics_workspace` resource
  - Name pattern: `log-{project}`
  - Retention: 30 days, SKU: PerGB2018
  - `azurerm_application_insights` resource
  - Name pattern: `appi-{project}`
  - Application type: web
  - Linked to Log Analytics Workspace
- [ ] 7.2 Create `infra/modules/app-insights/variables.tf`:
  - `workspace_name`, `insights_name`
  - `resource_group_name`, `location`
  - `retention_in_days`, `tags`
- [ ] 7.3 Create `infra/modules/app-insights/outputs.tf`:
  - `workspace_id`, `insights_id`
  - `instrumentation_key` (sensitive)
  - `connection_string` (sensitive)

---

## 8. Environment Configuration
- [ ] 8.1 Create `infra/environments/dev.tfvars`:
  - `environment = "dev"`
  - `app_service_sku = "F1"`
  - Other dev-specific values
- [ ] 8.2 Create `infra/environments/prod.tfvars`:
  - `environment = "prod"`
  - `app_service_sku = "B1"` (or F1 for budget)
  - Other prod-specific values
- [ ] 8.3 Create `infra/terraform.tfvars.example`:
  - Template with all required variables
  - Comments explaining each variable
  - DO NOT include actual secrets

---

## 9. Module Integration in Root
- [ ] 9.1 Wire up Resource Group module in `main.tf`
- [ ] 9.2 Wire up App Service Plan module with `depends_on` Resource Group
- [ ] 9.3 Wire up PostgreSQL module with `depends_on` Resource Group
- [ ] 9.4 Wire up Application Insights module with `depends_on` Resource Group
- [ ] 9.5 Wire up Web App modules (4 instances) with `depends_on` App Service Plan:
  - `lifesync-backend-dev`
  - `lifesync-backend-prod`
  - `lifesync-frontend-dev`
  - `lifesync-frontend-prod`
- [ ] 9.6 Pass Application Insights connection string to Web Apps

---

## 10. Validation and Testing
- [ ] 10.1 Run `terraform fmt -recursive` to format all files
- [ ] 10.2 Run `terraform init` to initialize providers
- [ ] 10.3 Run `terraform validate` to check syntax
- [ ] 10.4 Run `terraform plan -var-file=environments/dev.tfvars` to preview dev changes
- [ ] 10.5 Review plan output for expected resources (should create ~10-12 resources for dev)

---

## 11. Deployment (Manual - Requires Azure Access)
- [ ] 11.1 **DEV Environment**: Run `terraform apply -var-file=environments/dev.tfvars`
- [ ] 11.2 Verify resources in Azure Portal:
  - Resource Group `rg-lifesync-dev` exists
  - App Service Plan `asp-lifesync-dev` exists
  - Web Apps exist and are running (cold start expected on F1)
  - PostgreSQL server is accessible
  - Application Insights is receiving data
- [ ] 11.3 Copy outputs to Azure DevOps Variable Groups:
  - `DATABASE_URL` → `LifeSync-Secrets-Dev`
  - `APPLICATIONINSIGHTS_CONNECTION_STRING` → `LifeSync-Secrets-Dev`
- [ ] 11.4 **PROD Environment**: Run `terraform apply -var-file=environments/prod.tfvars`
- [ ] 11.5 Copy prod outputs to `LifeSync-Secrets-Prod` Variable Group

---

## 12. Documentation
- [ ] 12.1 Update `infra/README.md` with:
  - Prerequisites (Terraform, Azure CLI, subscription)
  - Quick start commands
  - Variable descriptions
  - Output descriptions
  - Cost estimation
- [ ] 12.2 Add architecture diagram to Wiki (reference design.md)

---

## Dependencies and Parallelization Notes

**Can be done in parallel:**
- Tasks 3.x, 4.x, 5.x, 6.x, 7.x (all modules can be developed simultaneously)
- Tasks 8.1, 8.2, 8.3 (environment files are independent)

**Must be sequential:**
- Task 1.x → Task 2.x (structure before root module)
- All modules (3-7) → Task 9.x (modules must exist before integration)
- Task 9.x → Task 10.x (integration before validation)
- Task 10.x → Task 11.x (validation before deployment)

**Blocking dependencies:**
- Task 11.x requires Azure subscription access and credentials
- Task 11.3, 11.5 require Azure DevOps Library access
