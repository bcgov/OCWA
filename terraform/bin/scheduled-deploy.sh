#!/bin/bash -e

cd /home/acope/deploy/OCWA/terraform

terraform plan

terraform apply -auto-approve
