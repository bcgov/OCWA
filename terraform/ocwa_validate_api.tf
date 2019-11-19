data "docker_registry_image" "ocwa_validate_api" {
  name = "${var.images["owner"]}/ocwa_validate_api${var.images["validate_api"]}"
}

resource "docker_image" "ocwa_validate_api" {
  name          = data.docker_registry_image.ocwa_validate_api.name
  pull_triggers = [data.docker_registry_image.ocwa_validate_api.sha256_digest]
}

resource "docker_container" "ocwa_validate_api" {
  image   = docker_image.ocwa_validate_api.latest
  name    = "ocwa_validate_api"
  restart = "on-failure"

  network_mode = var.privateNetwork ? "" : "host"

  dynamic networks_advanced {
      for_each = var.privateNetwork ? [""]:[]
      content {
        name = var.privateNetwork ? docker_network.private_network.name : "host"
      }
  }

  volumes {
    host_path      = "${var.hostRootPath}/data/ocwa_validate_api"
    container_path = "/data"
  }
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
    "USER_ID_FIELD=preferred_username",
    "STORAGE_HOST=http://ocwaminio:9000",
    "STORAGE_BUCKET=bucket",
    "STORAGE_ACCESS_KEY=${random_id.accessKey.hex}",
    "STORAGE_ACCESS_SECRET=${random_string.secretKey.result}",
    "REQUEST_WEBHOOK_ENDPOINT=http://ocwa_request_api:3002/v1/webhook",
    "REQUEST_WEBHOOK_SECRET=${random_string.webhookSecret.result}",
    "POLICY_URL=http://ocwa_policy_api:3004",
    "ALWAYS_SCAN_FILES=false",
    "WORKING_LIMIT=5242880",
    "FAIL_OVER_WORKING_LIMIT=true",
    "MD5_BLACKLIST=/data/md5_blacklist.txt",
  ]
}

resource "local_file" "md5_backlist" {
  content  = file("${path.module}/scripts/md5_blacklist.txt")
  filename = "${var.hostRootPath}/data/ocwa_validate_api/md5_blacklist.txt"
}

