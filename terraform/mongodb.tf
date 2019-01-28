data "docker_registry_image" "mongodb" {
  name = "mongo:4.1.3"
}

resource "docker_image" "mongodb" {
  name          = "${data.docker_registry_image.mongodb.name}"
  pull_triggers = ["${data.docker_registry_image.mongodb.sha256_digest}"]
}

resource "docker_container" "ocwa_mongodb" {
  image = "${docker_image.mongodb.latest}"
  name = "ocwa_mongodb"
  volumes = {
    host_path = "${var.hostRootPath}/data/mongodb"
    container_path = "/data/db"
  }
  networks_advanced = { name = "${docker_network.private_network.name}" }
}

data "template_file" "mongodb_script" {
  template = "${file("${path.module}/scripts/mongodb.tpl")}"
  vars = {
     MONGO_USERNAME = "${var.mongodb["username"]}",
     MONGO_PASSWORD = "${random_string.mongoSuperPassword.result}"
  }
}

resource "local_file" "mongodb_script" {
    content = "${data.template_file.mongodb_script.rendered}"
    filename = "${var.hostRootPath}/mongodb_script.js"
}

resource "null_resource" "mongodb_first_time_install" {
  provisioner "local-exec" {
    command = "sleep 10"
  }
  provisioner "local-exec" {
    environment = {
        SCRIPT_PATH = "${var.hostRootPath}"
    }
    command = "sleep 15; docker run --net=ocwa_vnet -v \"$SCRIPT_PATH:/work\" mongo:4.1.3 mongo mongodb://ocwa_mongodb/oc_db /work/mongodb_script.js"
  }
  depends_on = ["docker_container.ocwa_mongodb"]
}
