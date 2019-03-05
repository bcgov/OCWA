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

variable "ocwaHostname" {
  type = "string"
}

variable "ocwaDLHost" {
  type = "string"
}

variable "ocwaDLHostname" {
  type = "string"
}

variable "ocwaWebSocketHost" {
  type = "string"
}

variable "authHost" {
  type = "string"
}

variable "authHostname" {
  type = "string"
}

variable "hostRootPath" {
  type = "string"
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
