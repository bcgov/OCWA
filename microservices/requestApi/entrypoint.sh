#!/bin/sh

mkdir -p ./config
printf "{\n" > ./config/default.json
printf "\"apiPort\": ${API_PORT},\n" >> ./config/default.json
printf "\"wsPort\": ${WS_PORT},\n" >> ./config/default.json
printf "\"logLevel\": \"${LOG_LEVEL}\",\n" >> ./config/default.json
printf "\"morganLogType\": \"dev\",\n" >> ./config/default.json
printf "\"database\": {\n" >> ./config/default.json
printf "\"host\": \"${DB_HOST}\",\n" >> ./config/default.json
printf "\"username\": \"${DB_USERNAME}\",\n" >> ./config/default.json
printf "\"password\": \"${DB_PASSWORD}\",\n" >> ./config/default.json
printf "\"dbName\": \"${DB_NAME}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"forumApi\": \"${FORUM_API}\",\n" >> ./config/default.json
printf "\"validationApi\": \"${VALIDATION_API}\",\n" >> ./config/default.json
printf "\"validationApiSecret\": \"${VALIDATION_API_KEY}\",\n" >> ./config/default.json

printf "\"storageApi\": {\n" >> ./config/default.json
printf "\"uri\": \"${STORAGE_URI}\",\n" >> ./config/default.json
printf "\"port\": \"${STORAGE_PORT}\",\n" >> ./config/default.json
printf "\"key\": \"${STORAGE_KEY}\",\n" >> ./config/default.json
printf "\"secret\": \"${STORAGE_SECRET}\",\n" >> ./config/default.json
printf "\"useSSL\": \"${STORAGE_USESSL}\",\n" >> ./config/default.json
printf "\"warnRequestBundlesize\": \"${STORAGE_WARN_SIZE}\",\n" >> ./config/default.json
printf "\"maxRequestBundlesize\": \"${STORAGE_MAX_SIZE}\",\n" >> ./config/default.json
printf "\"warnImportRequestBundlesize\": \"${STORAGE_IMP_WARN_SIZE}\",\n" >> ./config/default.json
printf "\"maxImportRequestBundlesize\": \"${STORAGE_IMP_MAX_SIZE}\",\n" >> ./config/default.json
printf "\"bucket\": \"${STORAGE_BUCKET}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"jwtSecret\": \"${JWT_SECRET}\",\n" >> ./config/default.json

printf "\"ocwaUrl\": \"${OCWA_URL}\",\n" >> ./config/default.json
printf "\"ocwaImportUrl\": \"${OCWA_IMPORT_URL}\",\n" >> ./config/default.json
printf "\"gitops\": {\n" >> ./config/default.json
printf "\"enabled\": ${GITOPS_ENABLED},\n" >> ./config/default.json
printf "\"url\": \"${GITOPS_URL}\",\n" >> ./config/default.json
printf "\"secret\": \"${GITOPS_SECRET}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json
printf "\"email\": {\n" >> ./config/default.json
printf "\"enabled\": ${EMAIL_ENABLED},\n" >> ./config/default.json
printf "\"service\": \"${EMAIL_SERVICE}\",\n" >> ./config/default.json
printf "\"secure\": ${EMAIL_SECURE},\n" >> ./config/default.json
printf "\"port\": \"${EMAIL_PORT}\",\n" >> ./config/default.json
printf "\"user\": \"${EMAIL_USER}\",\n" >> ./config/default.json
printf "\"pass\": \"${EMAIL_PASSWORD}\",\n" >> ./config/default.json
printf "\"from\": \"${EMAIL_FROM}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"autoAccept\": {\n" >> ./config/default.json
printf "    \"export\": ${AUTO_APPROVE},\n" >> ./config/default.json
printf "    \"import\": ${AUTO_APPROVE_IMPORT}\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"requiredRoleToCreateRequest\": \"${CREATE_ROLE}\",\n" >> ./config/default.json
printf "\"outputCheckerGroup\": \"${OC_GROUP}\",\n" >> ./config/default.json
printf "\"reportsGroup\": \"${REPORTS_GROUP}\",\n" >> ./config/default.json
printf "\"allowDenyRequest\": ${ALLOW_DENY},\n" >> ./config/default.json
printf "\"ignoreGroupsFromConsideration\": [${IGNORE_GROUPS}],\n" >> ./config/default.json

printf "\"projectApi\": \"${PROJECT_API}\",\n" >> ./config/default.json
printf "\"projectApiSecret\": \"${PROJECT_API_KEY}\",\n" >> ./config/default.json

printf "\"webhookSecret\": \"${WEBHOOK_API_KEY}\",\n" >> ./config/default.json

printf "\"emailOnInitialSubmit\": ${EMAIL_ON_SUBMIT},\n" >> ./config/default.json
printf "\"orgAttribute\": \"${ORG_ATTRIBUTE}\",\n" >> ./config/default.json
printf "\"adminGroup\": \"${ADMIN_GROUP}\",\n" >> ./config/default.json

printf "\"user\": {\n" >> ./config/default.json
printf "\"idField\": \"${USER_ID_FIELD}\",\n" >> ./config/default.json
printf "\"emailField\": \"${EMAIL_FIELD}\",\n" >> ./config/default.json
printf "\"givenNameField\": \"${GIVENNAME_FIELD}\",\n" >> ./config/default.json
printf "\"surNameField\": \"${SURNAME_FIELD}\",\n" >> ./config/default.json
printf "\"groupField\": \"${GROUP_FIELD}\"\n" >> ./config/default.json
printf "},\n" >> ./config/default.json

printf "\"formio\": {\n" >> ./config/default.json
printf "\"defaultExportFormName\": \"${DEFAULT_EXPORT_FORM_NAME}\",\n" >> ./config/default.json
printf "\"defaultImportFormName\": \"${DEFAULT_IMPORT_FORM_NAME}\",\n" >> ./config/default.json
printf "\"defaultExportCodeFormName\": \"${DEFAULT_EXPORT_CODE_FORM_NAME}\",\n" >> ./config/default.json
printf "\"defaultImportCodeFormName\": \"${DEFAULT_IMPORT_CODE_FORM_NAME}\",\n" >> ./config/default.json
printf "\"url\": \"${FORMIO_URL}\",\n" >> ./config/default.json
printf "\"username\": \"${FORMIO_USERNAME}\",\n" >> ./config/default.json
printf "\"password\": \"${FORMIO_PASSWORD}\"\n" >> ./config/default.json
printf "}\n" >> ./config/default.json

printf "}" >> ./config/default.json

npm start
