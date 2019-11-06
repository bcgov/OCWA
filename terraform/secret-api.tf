resource "random_string" "apiSecret" {
  length           = 30
  special          = false
  override_special = "/@\" "
}
resource "random_string" "webhookSecret" {
  length           = 30
  special          = false
  override_special = "/@\" "
}