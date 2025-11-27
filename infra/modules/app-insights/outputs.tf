output "workspace_id" {
  description = "The ID of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.log.id
}

output "insights_id" {
  description = "The ID of the Application Insights resource"
  value       = azurerm_application_insights.appi.id
}

output "instrumentation_key" {
  description = "The Instrumentation Key for Application Insights"
  value       = azurerm_application_insights.appi.instrumentation_key
  sensitive   = true
}

output "connection_string" {
  description = "The Connection String for Application Insights"
  value       = azurerm_application_insights.appi.connection_string
  sensitive   = true
}
