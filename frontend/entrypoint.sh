#!/bin/bash

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"port\": \"${PORT}\",\n" >> ./config/default.json
printf "\"host\": \"${HOST}\",\n" >> ./config/default.json
printf "\"forumApiHost\": \"${FORUM_API_HOST}\",\n" >> ./config/default.json
printf "\"forumSocket\": \"${FORUM_SOCKET_HOST}\",\n" >> ./config/default.json
printf "\"cookieSecret\": \"${COOKIE_SECRET}\",\n" >> ./config/default.json
printf "\"auth\": {\n" >> ./config/default.json
printf "\"authorizationEndpoint\": \"https://auth.bgddi.com/auth/realms/ocwa/protocol/openid-connect/auth\",\n" >> ./config/default.json
printf "\"callbackURL\": \"${AUTH_CALLBACK_URL}\",\n" >> ./config/default.json
printf "\"clientID\": \"outputchecker\",\n" >> ./config/default.json
printf "\"clientSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json
printf "\"issuer\": \"https://auth.bgddi.com/auth/realms/ocwa\",\n" >> ./config/default.json
printf "\"scope\": \"openid offline_access\",\n" >> ./config/default.json
printf "\"tokenEndpoint\": \"https://auth.bgddi.com/auth/realms/ocwa/protocol/openid-connect/token\",\n" >> ./config/default.json
printf "\"userInfoURL\": \"https://auth.bgddi.com/auth/realms/ocwa/protocol/openidconnect/userinfo\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

yarn build
yarn start:prod
