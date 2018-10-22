#!/bin/sh

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"port\": \"${PORT}\",\n" >> ./config/default.json
printf "\"host\": \"${HOST}\",\n" >> ./config/default.json
printf "\"forumApiHost\": \"${FORUM_API_HOST}\",\n" >> ./config/default.json
printf "\"forumSocket\": \"${FORUM_SOCKET_HOST}\",\n" >> ./config/default.json
printf "\"cookieSecret\": \"${COOKIE_SECRET}\",\n" >> ./config/default.json
printf "\"auth\": {\n" >> ./config/default.json
printf "\"authorizationEndpoint\": \"${AUTH_ENDPOINT}\",\n" >> ./config/default.json
printf "\"callbackURL\": \"${AUTH_CALLBACK_URL}\",\n" >> ./config/default.json
printf "\"clientID\": \"${AUTH_CLIENT}\",\n" >> ./config/default.json
printf "\"clientSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json
printf "\"issuer\": \"${AUTH_ISSUER}\",\n" >> ./config/default.json
printf "\"scope\": \"${AUTH_SCOPES}\",\n" >> ./config/default.json
printf "\"tokenEndpoint\": \"${TOKEN_ENDPOINT}\",\n" >> ./config/default.json
printf "\"userInfoURL\": \"${USER_INFO_ENDPOINT}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

yarn start:prod
