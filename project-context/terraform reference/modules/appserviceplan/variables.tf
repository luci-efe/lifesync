variable "app_service_plan_name" {
  type        = string
  description = "Nombre del App Service Plan"
}

variable "resource_group_name" {
  type        = string
  description = "Nombre del Resource Group donde se creará el App Service Plan"
}

variable "location" {
  type        = string
  description = "Región de Azure"
}

variable "os_type" {
  type        = string
  description = "Sistema operativo: Linux o Windows"
  default     = "Linux"

  validation {
    condition     = contains(["Linux", "Windows"], var.os_type)
    error_message = "El os_type debe ser 'Linux' o 'Windows'"
  }
}

variable "sku_name" {
  type        = string
  description = "SKU del plan (ej: F1=Free, B1=Basic, P1v2=Premium)"
  default     = "F1"
}

variable "tags" {
  type        = map(string)
  description = "Tags para el recurso"
  default     = {}
}

