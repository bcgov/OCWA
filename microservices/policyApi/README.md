# OCWA Policy API

## Installation

All installs require an instance of mongodb available.

### Prerequisites

- Python 3.6 or newer
- MongoDB 3.6 or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Create a default.json file from default.json.example under the config directory and edit the values to ones for your environment.  
Consider using `virtualenv` to isolate this Python environment from other Python programs.  
Run `pip install -r requirements.txt` to install dependencies and `python3 wsgi.py` to start up the server.

- *Windows Note: Other OCWA endpoints may not be able to resolve localhost and/or 127.0.0.1. You may change `wsgi.py` to listen from `0.0.0.0` to compensate, but DO NOT commit this to git!*

### Docker Install

Run `docker build . -t ocwa_policy_api` to build the docker container and the following commands to run it

``` sh
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
docker run -e JWT_SECRET=jwtSecret -e JWT_AUD=aud -e JWT_ACCESS_GROUP=admin -e JWT_GROUP=Groups -e API_SECRET=MySecret -e LOG_LEVEL=info -e DB_USERNAME=mongoUser -e DB_PASSWORD=mongoPassword -e DB_NAME=mongoDbName -e DB_PORT=27017 -e USER_ID_FIELD=Email  -e DB_HOST=docker --add-host=docker:$hostip -p LOCALPORT:3004 ocwa_policy_api
```

- *Windows Note: the `--add-host=docker:$hostip` parameter and hostip line are not necessary.*

Replace the configuration values as necessary and LOCALPORT with the local port you want to have the service on.

## Helm

For both below helm commands make a copy of values.yaml within the helm/policy-api directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

``` sh
helm install --name ocwa-policy-api --namespace ocwa ./helm/policy-api -f ./helm/policy-api/config.yaml
```

### Helm Update (Kubernetes)

``` sh
helm upgrade --name ocwa-policy-api ./helm/policy-api  -f ./helm/policy-api/config.yaml
```

## Test

``` sh
pip install '.[test]'
pytest --verbose
```

Run with coverage support. The report will be generated in htmlcov/index.html.

``` sh
coverage run -m pytest
coverage report
coverage html
```
