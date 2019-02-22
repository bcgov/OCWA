
data "docker_registry_image" "ocwa_request_api" {
  name = "bcgovimages/ocwa_request_api${var.images["request_api"]}"
}

resource "docker_image" "ocwa_request_api" {
  name          = "${data.docker_registry_image.ocwa_request_api.name}"
  pull_triggers = ["${data.docker_registry_image.ocwa_request_api.sha256_digest}"]
}

resource "docker_container" "ocwa_request_api" {
  image = "${docker_image.ocwa_request_api.latest}"
  name = "ocwa_request_api"
  restart = "on-failure"
  networks_advanced = { name = "${docker_network.private_network.name}" }
  env = [
      "JWT_SECRET=${random_string.jwtSecret.result}",
      "API_PORT=3002",
      "DB_HOST=ocwa_mongodb",
      "DB_PORT=27017",
      "DB_NAME=oc_db",
      "DB_USERNAME=${var.mongodb["username"]}",
      "DB_PASSWORD=${random_string.mongoSuperPassword.result}",
      "USER_ID_FIELD=email",
      "EMAIL_FIELD=email",
      "GIVENNAME_FIELD=given_name",
      "SURNAME_FIELD=surname",
      "GROUP_FIELD=groups",
      "CREATE_ROLE=/exporter",
      "OC_GROUP=oc",
      "ALLOW_DENY=true",
      "AUTO_APPROVE=false",
      "VALIDATION_API=http://ocwa_validate_api:3003",
      "VALIDATION_API_KEY=${random_string.apiSecret.result}",
      "FORUM_API=http://ocwa_forum_api:3000",
      "FORUM_API_KEY=${random_string.apiSecret.result}",
      "STORAGE_URI=ocwaminio",
      "STORAGE_PORT=9000",
      "STORAGE_USESSL=false",
      "STORAGE_BUCKET=bucket",
      "STORAGE_WARN_SIZE=5242880",
      "STORAGE_MAX_SIZE=10485760",
      "STORAGE_KEY=${random_id.accessKey.hex}",
      "STORAGE_SECRET=${random_string.secretKey.result}",
      "OCWA_URL=${var.ocwaHost}",
      "EMAIL_ENABLED=false",
      "EMAIL_SERVICE=na",
      "EMAIL_SECURE=false",
      "EMAIL_PORT=25",
      "EMAIL_USER=user",
      "EMAIL_PASSWORD=password",
      "EMAIL_FROM=no-reply@gmail.com"
      
  ]
}
