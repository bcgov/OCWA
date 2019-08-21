resource "random_string" "apiSecret" {
  length           = 30
  special          = false
  override_special = "/@\" "
}

