resource "random_string" "apiKey" {
  length = 30
  special = false
  override_special = "/@\" "
}
