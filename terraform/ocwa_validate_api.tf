
data "docker_registry_image" "ocwa_validate_api" {
  name = "bcgovimages/ocwa_validate_api:latest"
}

resource "docker_image" "ocwa_validate_api" {
  name          = "bcgovimages/ocwa_validate_api${var.images["validate_api"]}"
}

resource "docker_container" "ocwa_validate_api" {
  image = "${docker_image.ocwa_validate_api.latest}"
  name = "ocwa_validate_api"
  restart = "on-failure"
  networks_advanced = { name = "${docker_network.private_network.name}" }
  env = [
      "LOG_LEVEL=debug",
      "JWT_SECRET=${random_string.jwtSecret.result}",
      "API_SECRET=${random_string.apiSecret.result}",
      "API_PORT=3003",
      "DB_HOST=ocwa_mongodb",
      "DB_PORT=27017",
      "DB_NAME=oc_db",
      "DB_USERNAME=${var.mongodb["username"]}",
      "DB_PASSWORD=${random_string.mongoSuperPassword.result}",
      "USER_ID_FIELD=email",
      "STORAGE_HOST=http://ocwaminio:9000",
      "STORAGE_BUCKET=bucket",
      "STORAGE_ACCESS_KEY=${random_id.accessKey.hex}",
      "STORAGE_ACCESS_SECRET=${random_string.secretKey.result}",
      "POLICY_URL=http://ocwa_policy_api:3004"
  ]
}
