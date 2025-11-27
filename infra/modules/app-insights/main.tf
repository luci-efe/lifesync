resource "azurerm_log_analytics_workspace" "log" {
  name                = var.workspace_name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = var.retention_in_days
  tags                = var.tags
}

resource "azurerm_application_insights" "appi" {
  name                = var.insights_name
  location            = var.location
  resource_group_name = var.resource_group_name
  workspace_id        = azurerm_log_analytics_workspace.log.id
  application_type    = "web"
  tags                = var.tags
  depends_on          = [azurerm_log_analytics_workspace.log]
}
