resource "azurerm_linux_web_app" "app" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = var.service_plan_id

  site_config {
    always_on = var.always_on
    
    application_stack {
      docker_image     = split(":", var.docker_image_name)[0]
      docker_image_tag = split(":", var.docker_image_name)[1]
    }
  }

  app_settings = merge(
    {
      "WEBSITES_PORT"    = var.websites_port
      "DOCKER_ENABLE_CI" = "true"
    },
    var.app_settings
  )

  tags = var.tags
}
