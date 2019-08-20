resource "random_string" "mongoAdminPassword" {
  length           = 16
  special          = false
  override_special = "/@\" "
}

resource "random_string" "postgresAdminPassword" {
  length           = 16
  special          = false
  override_special = "/@\" "
}

