data "docker_registry_image" "ocwa_forum_api" {
  name = "${var.images["owner"]}/ocwa_forum_api${var.images["forum_api"]}"
}

resource "docker_image" "ocwa_forum_api" {
  name          = data.docker_registry_image.ocwa_forum_api.name
  pull_triggers = [data.docker_registry_image.ocwa_forum_api.sha256_digest]
}

resource "docker_container" "ocwa_forum_api" {
  image   = docker_image.ocwa_forum_api.latest
  name    = "ocwa_forum_api"
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
    "LOG_LEVEL=debug",
    "API_PORT=3000",
    "WS_PORT=3001",
    "DB_HOST=ocwa_mongodb",
    "DB_PORT=27017",
    "DB_NAME=oc_db",
    "DB_USERNAME=${var.mongodb["username"]}",
    "DB_PASSWORD=${random_string.mongoSuperPassword.result}",
    "USER_ID_FIELD=preferred_username",
    "EMAIL_FIELD=email",
    "GIVENNAME_FIELD=given_name",
    "SURNAME_FIELD=family_name",
    "GROUP_FIELD=groups",
    "DEFAULT_ACCESS_IS_GROUP=true",
    "REQUIRED_CREATE_ROLE=/exporter",
    "IGNORE_GROUPS=\"/researchers\"",
    "EMAIL_SUBJECT=forumApi",
    "EMAIL_ENABLED=false",
    "EMAIL_USER=forum@ocwa.com",
    "EMAIL_PASSWORD=MYPASS",
    "EMAIL_FROM=forum@ocwa.com",
    "EMAIL_SERVICE=smtp.gmail.com",
    "EMAIL_PORT=465",
    "EMAIL_SECURE=true",
  ]
}

