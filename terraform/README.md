

# Terraform-Based deployment

Create a terraform.tfvars file:

```
hostRootPath = "/var/ocwa"

mongodb = {
    username = "appuser"
}

postgres = {
    username = "kcuser"
}

keycloak = {
    username = "kcadmin"
}

ocwaHost = "https://ocwa.example.com"

authHost = "https://auth.example.com"

sslCertificate = "/ssl/cert.pem"
sslCertificateKey = "/ssl/key.pem"
```

Run the following commands:

```
terraform init

terraform plan

terraform apply
```

