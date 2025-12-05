output "id" {
  description = "The ID of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.psql.id
}

output "name" {
  description = "The name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.psql.name
}

output "fqdn" {
  description = "The FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.psql.fqdn
}

output "connection_strings" {
  description = "Connection strings for created databases"
  sensitive   = true
  value = {
    for db in var.databases : db => "postgresql://${var.administrator_login}:${var.administrator_password}@${azurerm_postgresql_flexible_server.psql.fqdn}:5432/${db}?sslmode=require"
  }
}
