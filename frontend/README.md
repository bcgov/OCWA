# OCWA Front End

A Babel 7 ready React single page application that uses Webpack for development.

- *Note: This is a proof-of-concept "Hello World" app and is not at all considered production ready.*

## Configuration

You will need a JWT from <http://jwtbuilder.jamiekurtz.com/>.

Make sure instead of `Roles` you assign `Groups`, e.g.

``` json
{
  "iss": "Online JWT Builder",
  "iat": 1536875344,
  "exp": 1568411344,
  "aud": "www.example.com",
  "sub": "username@example.com",
  "givenName": "User",
  "surname": "Name",
  "email": "username@example.com",
  "groups": [
    "/exporter"
  ]
}
```
### Groups and Modes
There are 2 default groups a user can belong to; Exporter(/exporter by default)
or Output Checker (/oc by default). In addition the app has 2 modes it can run in,
export or download. Note that the `export` value works for both the OC or Exporter
and can be really any value or nil, but if it is set to `download` it'll open an
exporter-only download interface.


## Installation

All installs require an instance of mongodb available.

### Prerequisites

- npm 6.4.1 or newer
- yarn 1.13.0 or newer
- node 10.15.1 LTS or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Create a `config/default.json` from the `config/default.json.example` file and fill in the values for jwt and jwtSecret.

``` sh
yarn install
yarn start
```
$ hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
$ port=8000
$ docker run -e TOKEN_ENDPOINT=<oidc token endpoint> -e USER_INFO_ENDPOINT=<oidc user info endpoint> -e AUTH_ENDPOINT=<authendpoint> -e AUTH_CALLBACK_URL=<host/auth> -e AUTH_CLIENT=<oidc client> -e AUTH_ISSUER=<oidc issuer> -e AUTH_LOGOUT_URL=<oidc logout url> -e AUTH_SCOPES="openid offline_access" -e CLIENT_SECRET=<YOUR_CLIENT_SECRET> -e JWT_SECRET=<YOUR_API_SECRET> -e COOKIE_SECRET=<COOKIE_SECRET> -e HOST=docker -e HELP_URL=http://help-url.com -e FORUM_API_HOST=$hostip:3000 -e EXPORTER_GROUP="/exporter" -e OC_GROUP="/oc" -e REPORTS_GROUP="/reports" -e EXPORTER_MODE="export" -e FORUM_SOCKET_HOST=$hostip:3001 -e REQUEST_API_HOST=$hostip:3002 -e FILES_API_HOST=$hostip:1080 -e USER_ID_FIELD=email -e PORT=$port --add-host=docker:$hostip -p $port:$port <DOCKER_IMAGE>

Note that if you want to use a test user, ensure the `default.json` config has the following fields:

- `testGroup`: set to either `/exporter`, `/reports` or `/oc`
- `testJWT:exporter`: A JWT that matches the above format (make sure the group array includes '/exporter')
- `testJWT:oc`: A JWT that matches the above format (make sure the group array includes '/oc**)

**NOTE: DO NOT INCLUDE THESE VALUES IN PRODUCTION**

### Docker Install

You will need to `$ docker build .` to build the docker container and the following commands to run it

``` sh
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
port=8000
docker run -e TOKEN_ENDPOINT=<oidc token endpoint> -e USER_INFO_ENDPOINT=<oidc user info endpoint> -e AUTH_ENDPOINT=<authendpoint> -e AUTH_CALLBACK_URL=<host/auth> -e AUTH_CLIENT=<oidc client> -e AUTH_ISSUER=<oidc issuer> -e AUTH_LOGOUT_URL=<oidc logout url> -e AUTH_SCOPES="openid offline_access" -e CLIENT_SECRET=<YOUR_CLIENT_SECRET> -e JWT_SECRET=<YOUR_API_SECRET> -e COOKIE_SECRET=<COOKIE_SECRET> -e HOST=docker -e FORUM_API_HOST=$hostip:3000 -e EXPORTER_GROUP="/exporter" -e OC_GROUP="/oc" -e REPORTS_GROUP="/reports" -e EXPORTER_MODE="export" -e FORUM_SOCKET_HOST=$hostip:3001 -e REQUEST_API_HOST=$hostip:3002 -e FILES_API_HOST=$hostip:1080 -e USER_ID_FIELD=email -e PORT=$port --add-host=docker:$hostip -p $port:$port <DOCKER_IMAGE>
```

## Testing

To run the tests run

``` sh
yarn test
```

## Helm

For both below helm commands make a copy of values.yaml within the helm/ocwa-frontend directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

``` sh
helm install --name ocwa-frontend --namespace ocwa ./helm/ocwa-frontend -f ./helm/ocwa-frontend/config.yaml
```

### Helm Update (Kubernetes)

``` sh
helm upgrade --name ocwa-frontend ./helm/ocwa-frontend  -f ./helm/ocwa-frontend/config.yaml
```
