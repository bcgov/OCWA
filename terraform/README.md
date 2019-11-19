

# Terraform-Based deployment

```

Run the following commands:

```
terraform init

cp terraform.tfvars.example terraform.tfvars

echo "hostRootPath = \"`pwd`/_tmp\"" >> terraform.tfvars

terraform plan

terraform apply -auto-approve
```


# Cleanup

You should always try: `terraform destroy` first, and then:

```
docker container stop $(docker container ls -aq --filter name=ocwa*) || true
docker container rm $(docker container ls -aq --filter name=ocwa*) || true
docker network rm ocwa_vnet || true
rm -rf _tmp
rm *.tfstate
mv terraform.tfvars terraform.tfvars.bak
terraform init
```
