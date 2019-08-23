data "docker_registry_image" "ocwa_policy_api" {
  name = "${var.images["owner"]}/ocwa_policy_api${var.images["policy_api"]}"
}

resource "docker_image" "ocwa_policy_api" {
  name          = data.docker_registry_image.ocwa_policy_api.name
  pull_triggers = [data.docker_registry_image.ocwa_policy_api.sha256_digest]
}

resource "docker_container" "ocwa_policy_api" {
  image   = docker_image.ocwa_policy_api.latest
  name    = "ocwa_policy_api"
  restart = "on-failure"
  networks_advanced {
    name = docker_network.private_network.name
  }
  env = [
    "LOG_LEVEL=info",
    "JWT_SECRET=${random_string.jwtSecret.result}",
    "API_SECRET=${random_string.apiSecret.result}",
    "API_PORT=3004",
    "DB_HOST=ocwa_mongodb",
    "DB_NAME=oc_db",
    "DB_PORT=27017",
    "DB_USERNAME=${var.mongodb["username"]}",
    "DB_PASSWORD=${random_string.mongoSuperPassword.result}",
    "JWT_AUD=aud",
    "JWT_ACCESS_GROUP=admin",
    "JWT_GROUPS=groups",
    "USER_ID_FIELD=email",
  ]
}

