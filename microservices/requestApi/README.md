#Request Api

##All installs
All installs require an instance of mongodb available.

##Bare Metal install
Create a default.json file from default.json.example under the config directory and edit the values to ones for your environment.
run `npm install` to install dependencies and npm start to start up the server

##Docker install
Run `docker build .` to build the docker container and the following commands to run it
```
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
apiport=3002
docker run -e CREATE_ROLE="exporter" -e OC_GROUP="oc" -e ALLOW_DENY=true -e EMAIL_FIELD=Email -e GIVENNAME_FIELD=GivenName -e SURNAME_FIELD=Surname -e GROUP_FIELD=Groups -e API_PORT=$apiport -e JWT_SECRET=MySecret -e LOG_LEVEL=info -e FORUM_API=docker:3000 -e VALIDATION_API_KEY=myForumApiKey -e VALIDATION_API=docker:3003 -e VALIDATION_API_KEY=myApiKey -e DB_USERNAME=mongoUser -e DB_PASSWORD=mongoPassword -e DB_NAME=mongoDbName -e USER_ID_FIELD=email  -e DB_HOST=docker --add-host=docker:$hostip -p $apiport:$apiport imageid
``` 
replacing image id with the image id from docker build and the configuration values as necessary


## Helm
For both below helm commands make a copy of values.yaml within the helm/request-api directory
and modify it to contain the values specific for your deployment.

### Helm install (Kubernetes)
helm install --name ocwa-request-api --namespace ocwa ./helm/request-api -f ./helm/request-api/config.yaml

### Helm update (Kubernetes)
helm upgrade --name ocwa-request-api ./helm/request-api  -f ./helm/request-api/config.yaml

## Test

```
$ npm test
```