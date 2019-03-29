# OCWA Project API

## Installation

All installs require an instance of mongodb available.

### Prerequisites

- npm 6.4.1 or newer
- node 10.15.1 LTS or newer
- MongoDB 4.0 or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Create a default.json file from default.json.example under the config directory and edit the values to ones for your environment.
run `npm install` to install dependencies and `npm start` to start up the server.

### Docker Install

Run `docker build . -t ocwa_project_api` to build the docker container and the following commands to run it

``` sh
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
apiport=3005
docker run -e API_PORT=$apiport -e LOG_LEVEL=info -e DB_HOST=docker -e DB_USERNAME=mongoUser \
        -e DB_PASSWORD=mongoPassword -e DB_NAME=mongoDbName -e JWT_SECRET=MySecret \
        -e OCWA_URL=http://localhost:8000 -e ADMIN_GROUP="admin" -e OC_GROUP="oc" \
        -e USER_ID_FIELD=email -e EMAIL_FIELD=Email -e GIVENNAME_FIELD=GivenName \
        -e SURNAME_FIELD=Surname -e GROUP_FIELD=Groups \
        --add-host=docker:$hostip -p $apiport:$apiport ocwa_project_api
```

Replace the the configuration values above as necessary.

## Helm

For both below helm commands make a copy of values.yaml within the helm/project-api directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

``` sh
helm install --name ocwa-project-api --namespace ocwa ./helm/project-api -f ./helm/project-api/config.yaml
```

### Helm Update (Kubernetes)

``` sh
helm upgrade --name ocwa-project-api ./helm/project-api -f ./helm/project-api/config.yaml
```

## Test

``` sh
npm test
```
