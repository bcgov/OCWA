# OCWA Request API

## Installation

All installs require an instance of mongodb available.

### Prerequisites

- npm 6.4.1 or newer
- node 10.15.1 LTS or newer
- MongoDB 4.0 or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Create a default.json file from default.json.example under the config directory and edit the values to ones for your environment.
run `npm install` to install dependencies and npm start to start up the server.

### Docker Install

Run `docker build . -t ocwa_request_api` to build the docker container and the following commands to run it

``` sh
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
apiport=3002
docker run -e CREATE_ROLE="exporter" -e OC_GROUP="oc" -e ALLOW_DENY=true -e EMAIL_FIELD=Email -e GIVENNAME_FIELD=GivenName -e SURNAME_FIELD=Surname \
           -e GROUP_FIELD=Groups -e API_PORT=$apiport -e JWT_SECRET=MySecret -e LOG_LEVEL=info -e FORUM_API=docker:3000 -e VALIDATION_API_KEY=myForumApiKey \
           -e VALIDATION_API=docker:3003 -e VALIDATION_API_KEY=myApiKey -e DB_USERNAME=mongoUser -e DB_PASSWORD=mongoPassword -e DB_NAME=mongoDbName -e USER_ID_FIELD=email \
           -e DB_HOST=docker -e STORAGE_URI=storageURI -e STORAGE_PORT=9000 -e STORAGE_KEY=myKey -e STORAGE_SECRET=mySecret -e STORAGE_USESSL=false \
           -e PROJECT_API=http://docker:3005 -e PROJECT_API_KEY=ApiKeySecret \
           -e GITOPS_ENABLED=false -e GITOPS_URL=https://projectsc.com -e GITOPS_SECRET=s3cr3t \
           -e OCWA_URL=http://localhost:8000 -e EMAIL_ENABLED=false -e EMAIL_USER=me@ocwa.com -e EMAIL_PASSWORD=MYPASS -e EMAIL_FROM=donotreply@ocwa.com \
           -e EMAIL_SERVICE=smtp.gmail.com -e EMAIL_PORT=465 =e EMAIL_SECURE=true \
           -e STORAGE_WARN_SIZE=1024 -e STORAGE_MAX_SIZE=0 -e STORAGE_BUCKET=data -e AUTO_APPROVE=false --add-host=docker:$hostip -p $apiport:$apiport ocwa_request_api
```

Replace the the configuration values above as necessary.

To change the email template override (either directly or through a docker volume mount), modify `notifications/emailTemplate.html`

## Helm

For both below helm commands make a copy of values.yaml within the helm/request-api directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

``` sh
helm install --name ocwa-request-api --namespace ocwa ./helm/request-api -f ./helm/request-api/config.yaml
```

### Helm Update (Kubernetes)

``` sh
helm upgrade --name ocwa-request-api ./helm/request-api  -f ./helm/request-api/config.yaml
```

## Test

``` sh
npm test
```
