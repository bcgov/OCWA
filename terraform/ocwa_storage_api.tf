
data "docker_registry_image" "minio" {
  name = "minio/minio:latest"
}

resource "docker_image" "minio" {
  name          = "${data.docker_registry_image.minio.name}"
  pull_triggers = ["${data.docker_registry_image.minio.sha256_digest}"]
}

resource "docker_container" "minio" {
  image = "${docker_image.minio.latest}"
  name = "ocwaminio"
  command = [ "server", "/data" ]
  networks_advanced = { name = "${docker_network.private_network.name}" }
  volumes = [{
    host_path = "${var.hostRootPath}/data/minio"
    container_path = "/data"
  },{
    host_path = "${var.hostRootPath}/config/minio"
    container_path = "/root/.minio"
  }]
  env = [
      "MINIO_ACCESS_KEY=${random_id.accessKey.hex}",
      "MINIO_SECRET_KEY=${random_string.secretKey.result}"
  ]
}


data "docker_registry_image" "tusd" {
  name = "tusproject/tusd:latest"
}

resource "docker_image" "tusd" {
  name          = "${data.docker_registry_image.tusd.name}"
  pull_triggers = ["${data.docker_registry_image.tusd.sha256_digest}"]
}

resource "docker_container" "tusd" {
  image = "${docker_image.tusd.latest}"
  name = "ocwa_tusd"
  command = [ "-behind-proxy", "-s3-bucket", "bucket", "-s3-endpoint", "http://ocwaminio:9000" ]
  networks_advanced = { name = "${docker_network.private_network.name}" }
  env = [
      "AWS_ACCESS_KEY=${random_id.accessKey.hex}",
      "AWS_SECRET_ACCESS_KEY=${random_string.secretKey.result}",
      "AWS_REGION=not_applicable"
  ]
}

resource "null_resource" "minio_first_install" {
  provisioner "local-exec" {
    environment = {
        MC_HOSTS_PRIMARY = "http://${random_id.accessKey.hex}:${random_string.secretKey.result}@ocwaminio:9000"
    }
    command = "docker run -e MC_HOSTS_PRIMARY --net=ocwa_vnet minio/mc mb PRIMARY/bucket"
  }
}
