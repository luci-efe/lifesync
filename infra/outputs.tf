output "resource_group_name" {
  description = "The name of the resource group"
  value       = module.resource_group.name
}

output "frontend_url" {
  description = "URL of the frontend web app"
  value       = module.web_app_frontend.url
}

output "backend_url" {
  description = "URL of the backend web app"
  value       = module.web_app_backend.url
}

output "postgresql_connection_string" {
  description = "Connection string for the PostgreSQL database"
  value       = module.postgresql.connection_strings["lifesync_${var.environment}"]
  sensitive   = true
}

output "app_insights_connection_string" {
  description = "Connection string for Application Insights"
  value       = module.app_insights.connection_string
  sensitive   = true
}

output "summary" {
  description = "Summary of created resources"
  value = {
    environment = var.environment
    region      = var.location
    frontend    = module.web_app_frontend.name
    backend     = module.web_app_backend.name
    database    = module.postgresql.name
  }
}
