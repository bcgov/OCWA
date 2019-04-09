#!/bin/sh

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"apiPort\": ${API_PORT},\n" >> ./config/default.json
printf "\"logLevel\": \"${LOG_LEVEL}\",\n" >> ./config/default.json
printf "\"morganLogType\": \"dev\",\n" >> ./config/default.json

printf "\"database\": {\n" >> ./config/default.json
printf "\"host\": \"${DB_HOST}\",\n" >> ./config/default.json
printf "\"username\": \"${DB_USERNAME}\",\n" >> ./config/default.json
printf "\"password\": \"${DB_PASSWORD}\",\n" >> ./config/default.json
printf "\"dbName\": \"${DB_NAME}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"jwtSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json
printf "\"apiKey\": \"${API_KEY}\",\n" >> ./config/default.json
printf "\"ocwaUrl\": \"${OCWA_URL}\",\n" >> ./config/default.json

printf "\"adminGroup\": \"${ADMIN_GROUP}\",\n" >> ./config/default.json
printf "\"outputCheckerGroup\": \"${OC_GROUP}\",\n" >> ./config/default.json

printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\",\n" >> ./config/default.json
printf "\"emailField\": \"${EMAIL_FIELD}\",\n" >> ./config/default.json
printf "\"givenNameField\": \"${GIVENNAME_FIELD}\",\n" >> ./config/default.json
printf "\"surNameField\": \"${SURNAME_FIELD}\",\n" >> ./config/default.json
printf "\"groupField\": \"${GROUP_FIELD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

npm start
