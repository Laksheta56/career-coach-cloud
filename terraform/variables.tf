variable "resource_group_name" {
  type    = string
  default = "rg-career-coach"
}

variable "location" {
  type    = string
  default = "East US"
}

variable "acr_name" {
  type    = string
  default = "crcoachregistry"
}

variable "aks_cluster_name" {
  type    = string
  default = "aks-career-coach"
}

variable "openai_account_name" {
  type    = string
  default = "openai-career-coach"
}
