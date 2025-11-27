## ADDED Requirements

### Requirement: Terraform Module Structure
The system SHALL organize Terraform code in reusable modules following the established reference pattern. Each module MUST be independent and contain its own variables and outputs files.

#### Scenario: Module Directory Structure
- **WHEN** the `infra/` directory is examined
- **THEN** the following structure exists:
  - `main.tf` - Root module with provider and module calls
  - `variables.tf` - Root input variables
  - `outputs.tf` - Root outputs
  - `modules/` - Directory with reusable modules

#### Scenario: Module Composition
- **WHEN** Terraform is executed
- **THEN** the root module SHALL orchestrate the following modules:
  - `resource-group` - Azure Resource Group
  - `app-service-plan` - Azure Service Plan
  - `web-app` - Azure Web App (instantiated 4 times)
  - `postgresql` - PostgreSQL Flexible Server
  - `app-insights` - Application Insights + Log Analytics

---

### Requirement: Terraform Provider Configuration
The system SHALL configure the Azure provider with the correct version and required features to ensure compatibility.

#### Scenario: Provider Version Pinning
- **WHEN** `main.tf` is examined
- **THEN** the `azurerm` provider SHALL be configured with `version = "~> 3.0.2"`
- **AND** Terraform version SHALL be `>= 1.1.0`
- **AND** features block MUST be present (required by AzureRM 3.x)

---

### Requirement: Web App Container Configuration
The system SHALL configure Web Apps to run containers from Docker Hub with the correct environment variables.

#### Scenario: Container Settings for Backend
- **WHEN** the Backend Web App is configured
- **THEN** `site_config.application_stack` SHALL include:
  - `docker_image_name` = `{dockerhub_username}/lifesync-backend:latest`
  - `docker_registry_url` = `https://index.docker.io`
- **AND** `WEBSITES_PORT` SHALL be `3001`
- **AND** `DOCKER_ENABLE_CI` SHALL be `true` (for automatic deployment)

#### Scenario: Container Settings for Frontend
- **WHEN** the Frontend Web App is configured
- **THEN** `site_config.application_stack` SHALL include:
  - `docker_image_name` = `{dockerhub_username}/lifesync-frontend:latest`
  - `docker_registry_url` = `https://index.docker.io`
- **AND** `WEBSITES_PORT` SHALL be `3000`
- **AND** `DOCKER_ENABLE_CI` SHALL be `true`

---

### Requirement: PostgreSQL Administrator Credentials
The system SHALL manage PostgreSQL administrator credentials securely, without exposing passwords in code.

#### Scenario: Admin Credentials as Variables
- **WHEN** PostgreSQL is configured
- **THEN** `administrator_login` SHALL come from a variable (not hardcoded)
- **AND** `administrator_password` SHALL come from a variable marked as `sensitive = true`
- **AND** the password MUST meet minimum requirements (8+ characters, complexity)

#### Scenario: Connection String Output
- **WHEN** PostgreSQL is created
- **THEN** the output `postgresql_connection_string` SHALL be marked as `sensitive = true`
- **AND** SHALL have the format: `postgresql://{user}:{pass}@{host}:5432/{db}?sslmode=require`

---

### Requirement: Log Analytics Workspace
The system SHALL create a Log Analytics Workspace as backend for Application Insights to meet Azure requirements.

#### Scenario: Workspace Creation
- **WHEN** `terraform apply` is executed
- **THEN** a Log Analytics Workspace `log-lifesync` SHALL be created
- **AND** with retention of 30 days (minimum for free tier)
- **AND** with SKU `PerGB2018`

#### Scenario: Application Insights Link
- **WHEN** Application Insights is created
- **THEN** `workspace_id` SHALL point to the created Log Analytics Workspace
- **AND** both resources MUST be in the same Resource Group

---

### Requirement: Terraform Variable Validation
The system SHALL validate input variables to prevent invalid configurations before execution.

#### Scenario: Environment Validation
- **WHEN** the `environment` variable is provided
- **THEN** it SHALL only accept values `dev` or `prod`
- **AND** other values SHALL cause a validation error

#### Scenario: SKU Validation
- **WHEN** the `app_service_sku` variable is provided
- **THEN** it SHALL only accept values `F1`, `B1`, `B2`, `B3`
- **AND** other values SHALL cause a validation error

---

### Requirement: Resource Tagging Strategy
The system SHALL apply consistent tags to all Azure resources for organization and cost tracking.

#### Scenario: Standard Tags Applied
- **WHEN** any Azure resource is created
- **THEN** it SHALL include the following tags:
  - `Environment` = `dev` or `prod`
  - `Project` = `LifeSync`
  - `ManagedBy` = `Terraform`
  - `Owner` = variable value (student email)
