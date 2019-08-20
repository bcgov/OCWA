resource "random_string" "secretKey" {
  length           = 30
  special          = false
  override_special = "/@\" "
}

resource "random_id" "accessKey" {
  byte_length = 8
}

