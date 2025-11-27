output "id" {
  value       = azurerm_service_plan.asp.id
  description = "ID del App Service Plan"
}

output "name" {
  value       = azurerm_service_plan.asp.name
  description = "Nombre del App Service Plan"
}

output "location" {
  value       = azurerm_service_plan.asp.location
  description = "Ubicación del App Service Plan"
}

output "os_type" {
  value       = azurerm_service_plan.asp.os_type
  description = "Sistema operativo del plan"
}

output "sku_name" {
  value       = azurerm_service_plan.asp.sku_name
  description = "SKU del plan"
}

