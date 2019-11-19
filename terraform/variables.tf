variable "privateNetwork" {
    type = bool
    default = true
}
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

variable serviceNames {
    type = map(string)
    default = {
        ocwa_forum_api = "ocwa_forum_api"
        ocwa_frontend = "ocwa_frontend"
        ocwa_frontend_dl = "ocwa_frontend_download"
        ocwa_gitops_simulator = "ocwa_gitops_simulator"
        ocwa_policy_api = "ocwa_policy_api"
        ocwa_project_api = "ocwa_project_api"
        ocwa_request_api = "ocwa_request_api"
        ocwa_validate_api = "ocwa_validate_api"
        nginx_proxy = "ocwa_nginx"
        keycloak = "ocwa_keycloak"
        minio = "ocwaminio"
        tusd = "ocwa_tusd"
        postgres = "ocwa_postgres"
        mongodb = "ocwa_mongodb"
    }
}
