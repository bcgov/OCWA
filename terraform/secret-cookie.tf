resource "random_string" "cookie" {
  length           = 30
  special          = false
  override_special = "/@\" "
}

