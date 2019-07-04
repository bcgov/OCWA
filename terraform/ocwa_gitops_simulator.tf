
resource "docker_container" "gitops_simulator" {
  image = "node:12.5.0-alpine"
  name = "gitops_simulator"
  restart = "on-failure"
  networks_advanced = { name = "${docker_network.private_network.name}" }
  entrypoint = ["/app/gitops_entrypoint.sh"]
  volumes = [{ 
    host_path = "${var.hostRootPath}/data/gitops_simulator"
    container_path = "/tmp"
  },{ 
    host_path = "${path.module}/scripts"
    container_path = "/app"
  }]
  labels = {
    script = "${md5("${file("${path.module}/scripts/gitops_simulator.js")}")}"
  }
}
