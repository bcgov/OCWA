data "docker_registry_image" "nginx" {
  name = "nginx:latest"
}

resource "docker_image" "nginx" {
  name          = data.docker_registry_image.nginx.name
  pull_triggers = [data.docker_registry_image.nginx.sha256_digest]
}

resource "docker_container" "ocwa_nginx" {
  image   = docker_image.nginx.latest
  name    = "ocwa_nginx"
  restart = "on-failure"
  ports {
    internal = 80
    external = 80
  }
  ports {
    internal = 443
    external = 443
  }
  networks_advanced {
    name = docker_network.private_network.name
    #     ipv4_address = "4.4.4.4"
  }
  volumes {
    host_path      = "${var.hostRootPath}/ssl"
    container_path = "/ssl"
  }
  volumes {
    host_path      = "${var.hostRootPath}/config/nginx"
    container_path = "/etc/nginx/conf.d/"
  }
  volumes {
    host_path      = "${var.hostRootPath}/config/nginx/www"
    container_path = "/www/"
  }

  labels {
    NGINX_CONFIG_MD5 = md5(local_file.proxy.content)
  }

  depends_on = [
    local_file.proxy,
    null_resource.keycloak_first_time_install,
    null_resource.minio_first_install,
  ]
}

data "template_file" "proxy_config" {
  template = file("${path.module}/scripts/nginx-proxy.tpl")
  vars = {
    authHost          = var.authHost
    authHostname      = var.authHostname
    ocwaHost          = var.ocwaHost
    ocwaDLHostname    = var.ocwaDLHostname
    ocwaHostname      = var.ocwaHostname
    sslCertificate    = var.sslCertificate
    sslCertificateKey = var.sslCertificateKey
  }
}

resource "local_file" "proxy" {
  content  = data.template_file.proxy_config.rendered
  filename = "${var.hostRootPath}/config/nginx/proxy.conf"
}

