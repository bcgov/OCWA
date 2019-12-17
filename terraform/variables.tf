variable "mongodb" {
  type = map(string)
}

variable "postgres" {
  type = map(string)
}

variable "keycloak" {
  type = map(string)
}

variable "ocwaHost" {
  type = string
}

variable "ocwaHostname" {
  type = string
}

variable "ocwaDLHost" {
  type = string
}

variable "ocwaDLHostname" {
  type = string
}

variable "ocwaWebSocketHost" {
  type = string
}

variable "requestWebSocketHost" {
  type = string
}

variable "requestDLWebSocketHost" {
  type = string
}

variable "authHost" {
  type = string
}

variable "authHostname" {
  type = string
}

variable "hostRootPath" {
  type = string
}

variable "sslCertificate" {
  type = string
}

variable "sslCertificateKey" {
  type = string
}

variable "images" {
  type = map(string)
}

