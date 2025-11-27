variable "resource_group_name" {
  type        = string
  description = "Nombre del Resource Group"
}

variable "location" {
  type        = string
  description = "Región de Azure donde se creará el Resource Group"
  default     = "westus2"
}

variable "tags" {
  type        = map(string)
  description = "Tags para organizar y categorizar el recurso"
  default     = {}
}

