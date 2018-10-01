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
docker run -e API_PORT=$apiport -e JWT_SECRET=MySecret -e LOG_LEVEL=info -e FORUM_API=docker:3000 -e VALIDATION_API_KEY=myForumApiKey -e VALIDATION_API=docker:3003 -e VALIDATION_API_KEY=myApiKey -e DB_USERNAME=mongoUser -e DB_PASSWORD=mongoPassword -e DB_NAME=mongoDbName -e USER_ID_FIELD=email  -e DB_HOST=docker --add-host=docker:$hostip -p $apiport:$apiport imageid
``` 
replacing image id with the image id from docker build and the configuration values as necessary


##Helm install (Kubernetes)
Coming Soon...