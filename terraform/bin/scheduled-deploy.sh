#!/bin/bash -e

cd /home/acope/onpremise/OCWA/terraform

terraform plan

terraform apply -auto-approve
