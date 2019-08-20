resource "random_string" "jwtSecret" {
  length           = 30
  special          = false
  override_special = "/@\" "
}

