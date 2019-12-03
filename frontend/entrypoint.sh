#!/bin/sh

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"port\": \"${PORT}\",\n" >> ./config/default.json
printf "\"host\": \"${HOST}\",\n" >> ./config/default.json
printf "\"helpURL\": \"${HELP_URL}\",\n" >> ./config/default.json
printf "\"forumApiHost\": \"${FORUM_API_HOST}\",\n" >> ./config/default.json
printf "\"forumSocket\": \"${FORUM_SOCKET_HOST}\",\n" >> ./config/default.json
printf "\"requestApiHost\": \"${REQUEST_API_HOST}\",\n" >> ./config/default.json
printf "\"requestSocket\": \"${REQUEST_SOCKET_HOST}\",\n" >> ./config/default.json
printf "\"filesApiHost\": \"${FILES_API_HOST}\",\n" >> ./config/default.json
printf "\"exporterGroup\": \"${EXPORTER_GROUP}\",\n" >> ./config/default.json
printf "\"ocGroup\": \"${OC_GROUP}\",\n" >> ./config/default.json
printf "\"reportsGroup\": \"${REPORTS_GROUP}\",\n" >> ./config/default.json
printf "\"exporterMode\": \"${EXPORTER_MODE}\",\n" >> ./config/default.json
printf "\"codeExportEnabled\": \"${CODE_EXPORT_ENABLED}\",\n" >> ./config/default.json
printf "\"repositoryHost\": \"${REPOSITORY_HOST}\",\n" >> ./config/default.json
printf "\"cookieSecret\": \"${COOKIE_SECRET}\",\n" >> ./config/default.json
printf "\"jwtSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json
printf "\"forms\": {\n" >> ./config/default.json
printf "\"newRequest\": \"${NEW_REQUEST_FORM}\",\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"auth\": {\n" >> ./config/default.json
printf "\"authorizationEndpoint\": \"${AUTH_ENDPOINT}\",\n" >> ./config/default.json
printf "\"callbackURL\": \"${AUTH_CALLBACK_URL}\",\n" >> ./config/default.json
printf "\"clientID\": \"${AUTH_CLIENT}\",\n" >> ./config/default.json
printf "\"clientSecret\": \"${CLIENT_SECRET}\",\n" >> ./config/default.json
printf "\"issuer\": \"${AUTH_ISSUER}\",\n" >> ./config/default.json
printf "\"logoutURL\": \"${AUTH_LOGOUT_URL}\",\n" >> ./config/default.json
printf "\"scope\": \"${AUTH_SCOPES}\",\n" >> ./config/default.json
printf "\"tokenEndpoint\": \"${TOKEN_ENDPOINT}\",\n" >> ./config/default.json
printf "\"userInfoURL\": \"${USER_INFO_ENDPOINT}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"storage\": {\n" >> ./config/default.json
printf "\"endPoint\": \"${STORAGE_ENDPOINT}\",\n" >> ./config/default.json
printf "\"port\": ${STORAGE_PORT},\n" >> ./config/default.json
printf "\"useSSL\": ${STORAGE_SSL},\n" >> ./config/default.json
printf "\"bucket\": \"${STORAGE_BUCKET}\",\n" >> ./config/default.json
printf "\"accessKey\": \"${STORAGE_ACCESS_KEY}\",\n" >> ./config/default.json
printf "\"secretKey\": \"${STORAGE_SECRET_KEY}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

npm run start:prod
