#!/bin/bash

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"apiPort\": 3003,\n" >> ./config/default.json
printf "\"logLevel\": \"${LOG_LEVEL}\",\n" >> ./config/default.json

printf "\"database\": {\n" >> ./config/default.json
printf "\"host\": \"${DB_HOST}\",\n" >> ./config/default.json
printf "\"port\": \"${DB_PORT}\",\n" >> ./config/default.json
printf "\"username\": \"${DB_USERNAME}\",\n" >> ./config/default.json
printf "\"password\": \"${DB_PASSWORD}\",\n" >> ./config/default.json
printf "\"dbName\": \"${DB_NAME}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"storage\": {\n" >> ./config/default.json
printf "\"endpoint\": \"${STORAGE_HOST}\",\n" >> ./config/default.json
printf "\"bucket\": \"${STORAGE_BUCKET}\",\n" >> ./config/default.json
printf "\"access_key_id\": \"${STORAGE_ACCESS_KEY}\",\n" >> ./config/default.json
printf "\"access_secret_id\": \"${STORAGE_ACCESS_SECRET}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"policyApi\": \"${POLICY_URL}\",\n" >> ./config/default.json

printf "\"apiSecret\": \"${API_SECRET}\",\n" >> ./config/default.json
printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

python wsgi.py
