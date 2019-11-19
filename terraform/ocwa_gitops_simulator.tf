resource "docker_container" "gitops_simulator" {
  image   = "node:12.5.0-alpine"
  name    = "ocwa_gitops_simulator"
  restart = "on-failure"

  network_mode = var.privateNetwork ? "" : "host"

  dynamic networks_advanced {
      for_each = var.privateNetwork ? [""]:[]
      content {
        name = var.privateNetwork ? docker_network.private_network.name : "host"
      }
  }

  entrypoint = ["/app/gitops_entrypoint.sh"]
  volumes {
    host_path      = "${abspath(var.hostRootPath)}/data/gitops_simulator"
    container_path = "/tmp"
  }
  volumes {
    host_path      = "${abspath(path.module)}/scripts"
    container_path = "/app"
  }
  labels = {
    script = md5(file("${path.module}/scripts/gitops_simulator.js"))
  }
}

