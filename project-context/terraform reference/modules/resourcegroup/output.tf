output "id" {
  value       = azurerm_resource_group.rg.id
  description = "ID del Resource Group creado"
}

output "name" {
  value       = azurerm_resource_group.rg.name
  description = "Nombre del Resource Group"
}

output "location" {
  value       = azurerm_resource_group.rg.location
  description = "Ubicación del Resource Group"
}

