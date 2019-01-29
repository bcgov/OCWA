resource "docker_network" "private_network" {
  name = "ocwa_vnet"
  ipam_config = {
    ip_range = "4.4.5.0/24"
    subnet = "4.4.0.0/16"
  }
}
