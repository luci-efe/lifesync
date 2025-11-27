variable "name" {
  description = "Name of the Web App"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region location"
  type        = string
}

variable "service_plan_id" {
  description = "ID of the App Service Plan"
  type        = string
}

variable "docker_image_name" {
  description = "Docker image name (e.g., user/repo:tag)"
  type        = string
}

variable "docker_registry_url" {
  description = "Docker registry URL"
  type        = string
  default     = "https://index.docker.io"
}

variable "websites_port" {
  description = "Port exposed by the container"
  type        = string
  default     = "3000"
}

variable "always_on" {
  description = "Enable Always On (requires Basic SKU or higher)"
  type        = bool
  default     = false
}

variable "app_settings" {
  description = "Additional app settings"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
