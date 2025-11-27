variable "resource_group_name" {
  description = "resource_group_practica_11"
  type        = string
}

variable "location" {
  description = "Region de Azure donde se desplegarán los recursos"
  type        = string
  default     = "westus2"
}

variable "app_service_plan_name" {
  description = "app_service_plan_practica_11"
  type        = string
}

variable "os_type" {
  description = "Tipo de sistema operativo para el App Service Plan"
  type        = string
  default     = "Linux"
}

variable "sku_name" {
  description = "SKU del App Service Plan (F1=free, B1=basic, S1=standard"
  type        = string
  default     = "F1"
}

variable "web_app_1_name" {
  description = "Nombre de la primera Web App"
  type        = string
}

variable "web_app_2_name" {
  description = "Nombre de la segunda Web App"
  type        = string
}

variable "tags" {
  type        = map(string)
  description = "Etiquetas para los recursos"
  default = {
    Environment = "Development"
    Project     = "Terraform-Practica11"
    Managed_by  = "Terraform"
  }
}
