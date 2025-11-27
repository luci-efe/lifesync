
output "id" {
  description = "ID de la Web App"
  value       = azurerm_windows_web_app.app.id
}

output "name" {
  description = "Nombre de la Web App"
  value       = azurerm_windows_web_app.app.name
}

output "default_hostname" {
  description = "Nombre de host por defecto de la Web App"
  value       = azurerm_windows_web_app.app.default_hostname
}

output "outbound_ip_addresses" {
  description = "Direcciones IP de salida de la Web App"
  value       = azurerm_windows_web_app.app.outbound_ip_addresses
}

