#!/bin/sh

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"apiPort\": 3004,\n" >> ./config/default.json

printf "\"database\": {\n" >> ./config/default.json
printf "\"host\": \"${DB_HOST}\",\n" >> ./config/default.json
printf "\"port\": \"${DB_PORT}\",\n" >> ./config/default.json
printf "\"username\": \"${DB_USERNAME}\",\n" >> ./config/default.json
printf "\"password\": \"${DB_PASSWORD}\",\n" >> ./config/default.json
printf "\"dbName\": \"${DB_NAME}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"apiSecret\": \"${API_SECRET}\",\n" >> ./config/default.json

printf "\"jwtSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json
printf "\"jwtAudience\": \"${JWT_AUD}\",\n" >> ./config/default.json
printf "\"jwt_access_group\": \"${JWT_ACCESS_GROUP}\",\n" >> ./config/default.json
printf "\"jwt_group\": \"${JWT_GROUP}\",\n" >> ./config/default.json

printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

python wsgi.py