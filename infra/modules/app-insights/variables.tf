variable "workspace_name" {
  description = "Name of the Log Analytics Workspace"
  type        = string
}

variable "insights_name" {
  description = "Name of the Application Insights resource"
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

variable "retention_in_days" {
  description = "Data retention in days"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
