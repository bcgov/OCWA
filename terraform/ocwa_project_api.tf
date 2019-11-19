data "docker_registry_image" "ocwa_project_api" {
  name = "${var.images["owner"]}/ocwa_project_api${var.images["project_api"]}"
}

resource "docker_image" "ocwa_project_api" {
  name          = data.docker_registry_image.ocwa_project_api.name
  pull_triggers = [data.docker_registry_image.ocwa_project_api.sha256_digest]
}

resource "docker_container" "ocwa_project_api" {
  image   = docker_image.ocwa_project_api.latest
  name    = "ocwa_project_api"
  restart = "on-failure"

  network_mode = var.privateNetwork ? "" : "host"

  dynamic networks_advanced {
      for_each = var.privateNetwork ? [""]:[]
      content {
        name = var.privateNetwork ? docker_network.private_network.name : "host"
      }
  }

  env = [
    "JWT_SECRET=${random_string.jwtSecret.result}",
    "API_KEY=${random_string.apiSecret.result}",
    "PROJECT_API=http://ocwa_project_api:3005",
    "PROJECT_API_KEY=${random_string.apiSecret.result}",
    "LOG_LEVEL=debug",
    "API_PORT=3005",
    "DB_HOST=ocwa_mongodb",
    "DB_PORT=27017",
    "DB_NAME=oc_db",
    "DB_USERNAME=${var.mongodb["username"]}",
    "DB_PASSWORD=${random_string.mongoSuperPassword.result}",
    "OCWA_URL=${var.ocwaHost}",
    "ADMIN_GROUP=/admin",
    "OC_GROUP=/oc",
    "USER_ID_FIELD=preferred_username",
    "EMAIL_FIELD=email",
    "GIVENNAME_FIELD=given_name",
    "SURNAME_FIELD=family_name",
    "GROUP_FIELD=groups",
  ]
}

