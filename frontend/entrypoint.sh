#!/bin/bash

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"port\": \"${PORT}\",\n" >> ./config/default.json
printf "\"host\": \"${HOST}\",\n" >> ./config/default.json
printf "\"forumApiHost\": \"${FORUM_API_HOST}\",\n" >> ./config/default.json
printf "\"forumSocket\": \"${FORUM_SOCKET_HOST}\",\n" >> ./config/default.json
printf "\"jwtSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json
printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json
printf "}" >> ./config/default.json

yarn build
yarn start:prod
