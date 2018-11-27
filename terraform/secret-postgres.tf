resource "random_string" "postgresSuperPassword" {
  length = 16
  special = false
  override_special = "/@\" "
}

resource "random_string" "postgresAppPassword" {
  length = 16
  special = false
  override_special = "/@\" "
}