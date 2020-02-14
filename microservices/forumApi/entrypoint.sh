#!/bin/sh

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"apiPort\": 3000,\n" >> ./config/default.json
printf "\"wsPort\": 2999,\n" >> ./config/default.json
printf "\"logLevel\": \"${LOG_LEVEL}\",\n" >> ./config/default.json
printf "\"morganLogType\": \"dev\",\n" >> ./config/default.json
printf "\"database\": {\n" >> ./config/default.json
printf "\"host\": \"${DB_HOST}\",\n" >> ./config/default.json
printf "\"username\": \"${DB_USERNAME}\",\n" >> ./config/default.json
printf "\"password\": \"${DB_PASSWORD}\",\n" >> ./config/default.json
printf "\"dbName\": \"${DB_NAME}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"jwtSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json
printf "\"defaultAccessIsGroup\": ${DEFAULT_ACCESS_IS_GROUP},\n" >> ./config/default.json
printf "\"requiredRoleToCreateTopic\": \"${REQUIRED_CREATE_ROLE}\",\n" >> ./config/default.json
printf "\"ignoreGroupsFromConsideration\": [${IGNORE_GROUPS}],\n" >> ./config/default.json
printf "\"adminGroup\": \"${ADMIN_GROUP}\",\n" >> ./config/default.json

printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\",\n" >> ./config/default.json
printf "\"emailField\": \"${EMAIL_FIELD}\",\n" >> ./config/default.json
printf "\"givenNameField\": \"${GIVENNAME_FIELD}\",\n" >> ./config/default.json
printf "\"surNameField\": \"${SURNAME_FIELD}\",\n" >> ./config/default.json
printf "\"groupField\": \"${GROUP_FIELD}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"email\": {\n" >> ./config/default.json
printf "\"enabled\": \"${EMAIL_ENABLED}\",\n" >> ./config/default.json
printf "\"service\": \"${EMAIL_SERVICE}\",\n" >> ./config/default.json
printf "\"secure\": ${EMAIL_SECURE},\n" >> ./config/default.json
printf "\"port\": \"${EMAIL_PORT}\",\n" >> ./config/default.json
printf "\"user\": \"${EMAIL_USER}\",\n" >> ./config/default.json
printf "\"pass\": \"${EMAIL_PASSWORD}\",\n" >> ./config/default.json
printf "\"from\": \"${EMAIL_FROM}\",\n" >> ./config/default.json
printf "\"subject\": \"${EMAIL_SUBJECT}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

nginx -c /etc/nginx/nginx.conf
npm start