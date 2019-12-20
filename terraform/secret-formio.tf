resource "random_string" "formioSuperPassword" {
  length           = 16
  special          = false
  override_special = "/@\" "
}