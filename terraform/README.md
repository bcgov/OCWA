

# Terraform-Based deployment

Create a terraform.tfvars file (see terraform.tfvars.example):

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

ocwaWebSocketHost = "wss://ocwa.example.com/socket"

authHost = "https://auth.example.com"

sslCertificate = "/ssl/cert.pem"
sslCertificateKey = "/ssl/key.pem"

images = {
    request_api = ":edge"
    validate_api = ":edge"
    forum_api = ":edge"
    policy_api = ":edge"
    frontend = ":edge"
    minio = ":latest"
    tusd = ":latest"
}

```

Run the following commands:

```
terraform init

terraform plan -var hostRootPath=`pwd`/_tmp

terraform apply -var hostRootPath=`pwd`/_tmp -auto-approve
```
