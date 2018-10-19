# OCWA Policy API

## All installs
All installs require an instance of mongodb available.

## Bare Metal install
Create a default.json file from default.json.example under the config directory and edit the values to ones for your environment.
run `python3 wsgi.py` to install dependencies and `python3 wsgi.py` to start up the server

## Docker install
Run the below to build the contianer
```
docker build --tag ocwa_policy_api .
```
--

Run the below to run the contianer after building it
```
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
docker run -e JWT_SECRET=jwtSecret -e JWT_AUD=aud -e JWT_ACCESS_GROUP=admin -e JWT_GROUP=Groups -e API_SECRET=MySecret -e LOG_LEVEL=info -e DB_USERNAME=mongoUser -e DB_PASSWORD=mongoPassword -e DB_NAME=mongoDbName -e DB_PORT=27017 -e USER_ID_FIELD=Email  -e DB_HOST=docker --add-host=docker:$hostip -p LOCALPORT:3004 ocwa_policy_api
``` 
replacing the configuration values as necessary and LOCALPORT with the local port you want to have the service on

## Helm
For both below helm commands make a copy of values.yaml within the helm/policy-api directory
and modify it to contain the values specific for your deployment.

### Helm install (Kubernetes)
helm install --name ocwa-policy-api --namespace ocwa ./helm/policy-api -f ./helm/policy-api/config.yaml

### Helm update (Kubernetes)
helm upgrade --name ocwa-policy-api ./helm/policy-api  -f ./helm/policy-api/config.yaml

# Test

```
$ pip install '.[test]'
$ pytest --verbose
```

Run with coverage support:

```
$ coverage run -m pytest
$ coverage report
$ coverage html  # open htmlcov/index.html in a browser
```
