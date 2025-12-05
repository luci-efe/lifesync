variable "environment" {
  description = "The environment (dev or prod)"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "The environment must be dev or prod."
  }
}

variable "location" {
  description = "Azure region location"
  type        = string
  default     = "northcentralus"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "lifesync"
}

variable "app_service_sku" {
  description = "SKU for App Service Plan"
  type        = string
  validation {
    condition     = contains(["F1", "B1", "B2", "B3"], var.app_service_sku)
    error_message = "The app_service_sku must be one of F1, B1, B2, B3."
  }
}

variable "dockerhub_username" {
  description = "Docker Hub username"
  type        = string
}

variable "postgresql_admin_login" {
  description = "PostgreSQL administrator login"
  type        = string
}

variable "postgresql_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "owner_email" {
  description = "Email of the owner for tagging"
  type        = string
}

variable "clerk_secret_key" {
  description = "Clerk Secret Key"
  type        = string
  sensitive   = true
}

variable "clerk_publishable_key" {
  description = "Clerk Publishable Key"
  type        = string
}
