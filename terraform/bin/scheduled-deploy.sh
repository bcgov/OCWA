#!/bin/bash -e

cd ${pwd}/deploy/OCWA/terraform

terraform plan

terraform apply -auto-approve
