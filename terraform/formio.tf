data "docker_registry_image" "formio" {
  name = "${var.images["formio"]}"
}

data "null_data_source" "indConfig" {
  inputs = {
    mongoConfig = "\"mongo\": \"mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp\""
    jwtConfig = "\"jwt\": { \"secret\": \"${random_string.jwtSecret.result}\"}"
  }
}

data "null_data_source" "values" {
  inputs = {
    nodeConfig = "{ ${data.null_data_source.indConfig.outputs["mongoConfig"]}, ${data.null_data_source.indConfig.outputs["jwtConfig"]} }"

  }
}

resource "docker_image" "formio" {
  name          = data.docker_registry_image.formio.name
  pull_triggers = [data.docker_registry_image.formio.sha256_digest]
}

resource "docker_container" "formio" {
  image   = docker_image.formio.latest
  name    = "ocwa_formio"
  restart = "on-failure"
  networks_advanced {
    name = docker_network.private_network.name
  }
  ports {
    internal = 3001
    external = 3006
  }
  env = [
    "NODE_CONFIG=${data.null_data_source.values.outputs["nodeConfig"]}",
    "DEBUG=formio:*",
    "MONGO=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp"
  ]

  depends_on = [null_resource.mongodb_formio_first_Time_install]
}

