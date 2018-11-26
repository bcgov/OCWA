
data "docker_registry_image" "ocwa_forum_api" {
  name = "bcgovimages/ocwa_forum_api:edge"
}

resource "docker_image" "ocwa_forum_api" {
  name          = "${data.docker_registry_image.ocwa_forum_api.name}"
  pull_triggers = ["${data.docker_registry_image.ocwa_forum_api.sha256_digest}"]
}

resource "docker_container" "ocwa_forum_api" {
  image = "${docker_image.ocwa_forum_api.latest}"
  name = "ocwa_forum_api"
  networks_advanced = { name = "${docker_network.private_network.name}" }
  env = [
      "JWT_SECRET=${random_string.jwtSecret.result}",
      "LOG_LEVEL=debug",
      "API_PORT=3000",
      "WS_PORT=3001",
      "DB_HOST=ocwa_mongodb",
      "DB_NAME=oc_db",
      "DB_USERNAME=${var.mongodb["username"]}",
      "DB_PASSWORD=${random_string.mongoSuperPassword.result}",
      "USER_ID_FIELD=email",
      "EMAIL_FIELD=email",
      "GIVENNAME_FIELD=given_name",
      "SURNAME_FIELD=surname",
      "GROUP_FIELD=groups",
      "DEFAULT_ACCESS_IS_GROUP=true",
      "REQUIRED_CREATE_ROLE=/exporter"
  ]
}
