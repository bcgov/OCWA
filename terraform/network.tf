resource "docker_network" "private_network" {
  name = "ocwa_vnet"
  ipam_config {
     subnet = "192.168.50.0/24"
     ip_range = "192.168.50.0/25"
  }
}

