terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

locals {
  tags = {
    Environment = var.environment
    Project     = "LifeSync"
    ManagedBy   = "Terraform"
    Owner       = var.owner_email
  }
}

module "resource_group" {
  source   = "./modules/resource-group"
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location
  tags     = local.tags
}

module "app_service_plan" {
  source              = "./modules/app-service-plan"
  name                = "asp-${var.project_name}-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  os_type             = "Linux"
  sku_name            = var.app_service_sku
  tags                = local.tags
}

module "app_insights" {
  source              = "./modules/app-insights"
  workspace_name      = "log-${var.project_name}-${var.environment}"
  insights_name       = "appi-${var.project_name}-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  retention_in_days   = 30
  tags                = local.tags
}

module "postgresql" {
  source                 = "./modules/postgresql"
  name                   = "psql-${var.project_name}-${var.environment}"
  resource_group_name    = module.resource_group.name
  location               = module.resource_group.location
  administrator_login    = var.postgresql_admin_login
  administrator_password = var.postgresql_admin_password
  sku_name               = "B_Standard_B1ms"
  storage_mb             = 32768
  server_version         = "16"
  databases              = ["lifesync_${var.environment}"]
  tags                   = local.tags
}

module "web_app_backend" {
  source              = "./modules/web-app"
  name                = "${var.project_name}-backend-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  service_plan_id     = module.app_service_plan.id
  docker_image_name   = "${var.dockerhub_username}/lifesync-backend:latest"
  docker_registry_url = "https://index.docker.io"
  websites_port       = "3001"
  always_on           = var.app_service_sku != "F1"
  
  app_settings = {
    "DATABASE_URL"                    = module.postgresql.connection_strings["lifesync_${var.environment}"]
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.app_insights.connection_string
  }
  
  tags = local.tags
}

module "web_app_frontend" {
  source              = "./modules/web-app"
  name                = "${var.project_name}-frontend-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  service_plan_id     = module.app_service_plan.id
  docker_image_name   = "${var.dockerhub_username}/lifesync-frontend:latest"
  docker_registry_url = "https://index.docker.io"
  websites_port       = "3000"
  always_on           = var.app_service_sku != "F1"
  
  app_settings = {
    "NEXT_PUBLIC_API_URL"             = module.web_app_backend.url
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.app_insights.connection_string
  }
  
  tags = local.tags
}
