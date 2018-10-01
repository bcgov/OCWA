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
apiport=3004
docker run -e API_PORT=$apiport -e DB_HOST=docker --add-host=docker:$hostip -p $apiport:$apiport ocwa_policy_api
``` 
replacing the configuration values as necessary

## Helm
Coming Soon...

### Helm install (Kubernetes)
Coming Soon...

### Helm update (Kubernetes)
Coming Soon...

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
