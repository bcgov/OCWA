resource "docker_network" "private_network" {
  name = "ocwa_vnet"
#  ipam_config = {
#    gateway  = "4.4.0.1"
#    subnet   = "4.4.0.0/16"
#  }
}
