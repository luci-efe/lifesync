terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }
  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

module "resource_group" {
  source              = "./modules/resourcegroup"
  resource_group_name = var.resource_group_name
  location            = var.location
  tags                = var.tags
}

module "app_service_plan" {
  source                = "./modules/appserviceplan"
  app_service_plan_name = var.app_service_plan_name
  location              = module.resource_group.location
  resource_group_name   = module.resource_group.name
  os_type               = var.os_type
  sku_name              = var.sku_name
  tags                  = var.tags

  depends_on = [module.resource_group]
}

module "web_app_1" {
  source              = "./modules/appservice"
  app_name            = var.web_app_1_name
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  service_plan_id     = module.app_service_plan.id
  tags                = var.tags

  depends_on = [module.app_service_plan]
}

module "web_app_2" {
  source              = "./modules/appservice"
  app_name            = var.web_app_2_name
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  service_plan_id     = module.app_service_plan.id
  tags                = var.tags

  depends_on = [module.app_service_plan]
}
