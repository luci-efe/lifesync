output "resource_group_id" {
  description = "ID del Resource Group creado"
  value       = module.resource_group.id
}

output "resource_group_name" {
  description = "Nombre del Resource Group creado"
  value       = module.resource_group.name
}

output "app_service_plan_id" {
  description = "ID del App Service Plan creado"
  value       = module.app_service_plan.id
}

output "app_service_plan_name" {
  description = "Nombre del App Service Plan creado"
  value       = module.app_service_plan.name
}

output "app_service_plan_sku" {
  description = "SKU del App Service Plan creado"
  value       = module.app_service_plan.sku_name
}

output "web_app_1_id" {
  description = "ID del Web App 1 creado"
  value       = module.web_app_1.id
}

output "web_app_1_name" {
  description = "Nombre del Web App 1 creado"
  value       = module.web_app_1.name
}

output "web_app_1_url" {
  description = "URL del Web App 1"
  value       = "https://${module.web_app_1.default_hostname}"
}

output "web_app_2_id" {
  description = "ID del Web App 2 creado"
  value       = module.web_app_2.id
}

output "web_app_2_name" {
  description = "Nombre del Web App 2 creado"
  value       = module.web_app_2.name
}

output "web_app_2_url" {
  description = "URL del Web App 2"
  value       = "https://${module.web_app_2.default_hostname}"
}

output "summary" {
  value = {
    resource_group = module.resource_group.name
    location       = module.resource_group.location
    app_plan       = module.app_service_plan.name
    web_apps = [
      module.web_app_1.name,
      module.web_app_2.name
    ]
    urls = [
      "https://${module.web_app_1.default_hostname}",
      "https://${module.web_app_2.default_hostname}"
    ]
  }
  description = "Resumen de todos los recursos creados"
}

