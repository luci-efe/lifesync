variable "name" {
  description = "Name of the App Service Plan"
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

variable "os_type" {
  description = "The O/S type for the App Services to be hosted in this plan"
  type        = string
  default     = "Linux"
  validation {
    condition     = var.os_type == "Linux"
    error_message = "The os_type must be Linux."
  }
}

variable "sku_name" {
  description = "The SKU for the plan"
  type        = string
  validation {
    condition     = contains(["F1", "B1", "B2", "B3"], var.sku_name)
    error_message = "The sku_name must be one of F1, B1, B2, B3."
  }
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
