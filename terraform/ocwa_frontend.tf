
data "docker_registry_image" "ocwa_frontend" {
  name = "bcgovimages/ocwa_frontend${var.images["frontend"]}"
}

resource "docker_image" "ocwa_frontend" {
  name          = "${data.docker_registry_image.ocwa_frontend.name}"
  pull_triggers = ["${data.docker_registry_image.ocwa_frontend.sha256_digest}"]
}

resource "docker_container" "ocwa_download_frontend" {
  image = "${docker_image.ocwa_frontend.latest}"
  name = "ocwa_download_frontend"
  restart = "on-failure"
  networks_advanced = { name = "${docker_network.private_network.name}" }
  ports = { 
    internal = 8000
    external = 8001
  }

  host = [
    {
      host = "${var.authHostname}"
      ip = "${docker_container.ocwa_nginx.ip_address}"
    }
  ]

  env = [
      "COOKIE_SECRET=${random_string.cookie.result}",
      "JWT_SECRET=${random_string.jwtSecret.result}",
      "AUTH_ENDPOINT=${var.authHost}/auth/realms/ocwa/protocol/openid-connect/auth",
      "TOKEN_ENDPOINT=${var.authHost}/auth/realms/ocwa/protocol/openid-connect/token",
      "USER_INFO_ENDPOINT=${var.authHost}/auth/realms/ocwa/protocol/openid-connect/userinfo",
      "AUTH_ISSUER=${var.authHost}/auth/realms/ocwa",
      "AUTH_CLIENT=outputchecker",
      "AUTH_SCOPES=openid offline_access",
      "AUTH_CALLBACK_URL=${var.ocwaHost}/auth",
      "CLIENT_SECRET=${random_uuid.outputcheckerClientSecret.result}",
      "FILES_API_HOST=${var.ocwaHost}",
      "REQUEST_API_HOST=ocwa_request_api:3002",
      "FORUM_API_HOST=none",
      "FORUM_SOCKET_HOST=none",
      "HOST=0.0.0.0",
      "PORT=8000",
      "USER_ID_FIELD=email",
      "STORAGE_ENDPOINT=ocwaminio",
      "STORAGE_PORT=9000",
      "STORAGE_SSL=false",
      "STORAGE_BUCKET=bucket",
      "STORAGE_ACCESS_KEY=${random_id.accessKey.hex}",
      "STORAGE_SECRET_KEY=${random_string.secretKey.result}",
      "NODE_TLS_REJECT_UNAUTHORIZED=0",
      "EXPORTER_GROUP=/exporter",
      "OC_GROUP=/oc",
      "EXPORTER_MODE=download"
  ]

}

resource "docker_container" "ocwa_frontend" {
  image = "${docker_image.ocwa_frontend.latest}"
  name = "ocwa_frontend"
  restart = "on-failure"
  networks_advanced = { name = "${docker_network.private_network.name}" }
  ports = { 
    internal = 8000
    external = 8000
  }

  host = [
    {
      host = "${var.authHostname}"
      ip = "${docker_container.ocwa_nginx.ip_address}"
    }
  ]

  env = [
      "COOKIE_SECRET=${random_string.cookie.result}",
      "JWT_SECRET=${random_string.jwtSecret.result}",
      "AUTH_ENDPOINT=${var.authHost}/auth/realms/ocwa/protocol/openid-connect/auth",
      "TOKEN_ENDPOINT=${var.authHost}/auth/realms/ocwa/protocol/openid-connect/token",
      "USER_INFO_ENDPOINT=${var.authHost}/auth/realms/ocwa/protocol/openid-connect/userinfo",
      "AUTH_ISSUER=${var.authHost}/auth/realms/ocwa",
      "AUTH_CLIENT=outputchecker",
      "AUTH_SCOPES=openid offline_access",
      "AUTH_CALLBACK_URL=${var.ocwaHost}/auth",
      "CLIENT_SECRET=${random_uuid.outputcheckerClientSecret.result}",
      "FILES_API_HOST=${var.ocwaHost}",
      "REQUEST_API_HOST=ocwa_request_api:3002",
      "FORUM_API_HOST=ocwa_forum_api:3000",
      "FORUM_SOCKET_HOST=${var.ocwaWebSocketHost}",
      "HOST=0.0.0.0",
      "PORT=8000",
      "USER_ID_FIELD=email",
      "STORAGE_ENDPOINT=ocwaminio",
      "STORAGE_PORT=9000",
      "STORAGE_SSL=false",
      "STORAGE_BUCKET=bucket",
      "STORAGE_ACCESS_KEY=${random_id.accessKey.hex}",
      "STORAGE_SECRET_KEY=${random_string.secretKey.result}",
      "NODE_TLS_REJECT_UNAUTHORIZED=0",
      "EXPORTER_GROUP=/exporter",
      "OC_GROUP=/oc",
      "EXPORTER_MODE=export"
  ]

}
