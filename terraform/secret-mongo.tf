resource "random_string" "mongoSuperPassword" {
  length           = 16
  special          = false
  override_special = "/@\" "
}

