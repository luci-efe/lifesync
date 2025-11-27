resource "azurerm_windows_web_app" "app" {
  name                = var.app_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = var.service_plan_id

  site_config {
    always_on = false

    application_stack {
      current_stack = "node"
      node_version  = "12-LTS"
    }
  }

  tags = var.tags
}
