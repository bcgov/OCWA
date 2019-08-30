resource "random_string" "keycloakAdminPassword" {
  length           = 16
  special          = false
  override_special = "/@\" "
}

resource "random_string" "testUserPassword" {
  length           = 16
  special          = false
  override_special = "/@\" "
}

resource "random_uuid" "outputcheckerClientSecret" {
}

