resource "tls_private_key" "example" {
  algorithm   = "ECDSA"
  ecdsa_curve = "P384"
}

resource "tls_self_signed_cert" "example" {
  key_algorithm   = tls_private_key.example.algorithm
  private_key_pem = tls_private_key.example.private_key_pem

  subject {
    common_name  = "example.demo"
    organization = "ACME Examples, Inc"
  }

  validity_period_hours = 12

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

resource "local_file" "ssl_key" {
  content  = tls_private_key.example.private_key_pem
  filename = "${var.hostRootPath}/ssl/example.key"
}

resource "local_file" "ssl_cert" {
  content  = tls_self_signed_cert.example.cert_pem
  filename = "${var.hostRootPath}/ssl/example.crt"
}

