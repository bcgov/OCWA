#!/bin/sh

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"apiPort\": 3003,\n" >> ./config/default.json
printf "\"logLevel\": \"${LOG_LEVEL}\",\n" >> ./config/default.json

printf "\"database\": {\n" >> ./config/default.json
printf "\"host\": \"${DB_HOST}\",\n" >> ./config/default.json
printf "\"port\": ${DB_PORT},\n" >> ./config/default.json
printf "\"username\": \"${DB_USERNAME}\",\n" >> ./config/default.json
printf "\"password\": \"${DB_PASSWORD}\",\n" >> ./config/default.json
printf "\"dbName\": \"${DB_NAME}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"subscribers\": [\n" >> ./config/default.json
if [[ ! -z "${REQUEST_WEBHOOK_ENDPOINT}" ]]; then
  printf "  {\n" >> ./config/default.json
  printf "    \"endpoint\" : \"${REQUEST_WEBHOOK_ENDPOINT}\",\n" >> ./config/default.json
  printf "    \"api_key\"  : \"${REQUEST_WEBHOOK_SECRET}\"\n" >> ./config/default.json
  printf "  }\n" >> ./config/default.json
fi
printf "],\n" >> ./config/default.json
printf "\"storage\": {\n" >> ./config/default.json
printf "\"endpoint\": \"${STORAGE_HOST}\",\n" >> ./config/default.json
printf "\"bucket\": \"${STORAGE_BUCKET}\",\n" >> ./config/default.json
printf "\"access_key\": \"${STORAGE_ACCESS_KEY}\",\n" >> ./config/default.json
printf "\"secret_key\": \"${STORAGE_ACCESS_SECRET}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"policyApi\": \"${POLICY_URL}\",\n" >> ./config/default.json

printf "\"apiSecret\": \"${API_SECRET}\",\n" >> ./config/default.json
printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"md5_scan_file_path\": \"${MD5_BLACKLIST}\",\n" >> ./config/default.json
printf "\"alwaysScanFiles\": ${ALWAYS_SCAN_FILES},\n" >> ./config/default.json
printf "\"workingLimit\": ${WORKING_LIMIT},\n" >> ./config/default.json
printf "\"failOverWorkingLimit\": ${FAIL_OVER_WORKING_LIMIT}\n" >> ./config/default.json
printf "}" >> ./config/default.json

cat ./config/default.json
python wsgi.py
