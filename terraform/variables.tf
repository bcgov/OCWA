variable "mongodb" {
  type = "map"
}

variable "postgres" {
  type = "map"
}

variable "keycloak" {
  type = "map"
}

variable "ocwaHost" {
  type = "string"
}

variable "ocwaWebSocketHost" {
  type = "string"
}

variable "authHost" {
  type = "string"
}

variable "hostRootPath" {
  type = "string"
  default = "${path.root}"
}

variable "sslCertificate" {
  type = "string"
}

variable "sslCertificateKey" {
  type = "string"
}

variable "images" {
  type = "map"
}
