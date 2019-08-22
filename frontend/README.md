# OCWA Front End

OCWA's user interface is powered by a modern JavaScript application, employing Babel, React and Redux for view rendering and state management. Development and production builds use Webpack and the server uses Express to interface with authentication, HTTP endpoints and file reading.

## 1. Configuration

The frontend directory includes a default config file, found in `frontend/config/default.json.example`. There are some default values filled in, as well as placeholder values. Copy and rename the file as `default.json` before starting the application with `$ nmp start`. Details for each property are below.

#### `port: number` `required`

The assigned port for the front-end Express app.
Defaults to `8000`

#### `wsPort: number` `required`

The assigned websocket port. Must match the same value in the `microservices/forumApi` config.
Defaults to `3001`

#### `cookieSecret: string` `required`

Any random key for cookies

#### `jwtSecret: string` `required`

Used to sign the token after login.

#### `helpURL: ?url`

If you have a documentation site set up, adding this URL will add a help menu item to the app bar menu.

#### `host: string` `required`

Defaults to `localhost`

#### `forumApiHost: url` `required`

See `microservices/forumApi` for reference.
Defaults to `http://localhost:3000`

#### `forumSocket: url` `required`

See `microservices/forumApi` for reference.
Defaults to `ws://localhost:3001`

#### `requestApiHost: url` `required`

See `microservices/requestApi` for reference.
Defaults to `http://localhost:3002`

#### `filesApiHost: url` `required`

See `microservices/storageApi` for reference.
Defaults to `http://localhost:1080`

#### `exporterGroup: string` `required`

For the Exporter interface to be rendered this value must be found in the signed in user's `groups`
Defaults to `/exporter`

#### `ocGroup: string` `required`

For the Output Checker interface to be rendered this value must be found in the signed in user's `groups`
Defaults to `/oc`

#### `reportsGroup: string` `required`

For the Reports interface to be rendered this value must be found in the signed in user's `groups`
Defaults to `/reports`

#### `exporterMode: 'export' | 'download'` `required`

There are 2 different environments that the interface will accommodate. Exporting data/code out of a Secure Research Environment or importing.

`export`: Inside the SRE to export code
`download`: Outside the SRE to import data/code

Defaults to `export`

#### `codeExportEnabled: boolean` `required`

Defaults to `false`

#### `repositoryHost: ?url`

If `codeExportEnabled` is on then you need to set the host of the repository `https://subdomain.bc.com/shares/`

#### `auth: object` `required`

Define an user object based on the Passport authentication. Recommended configuration would look something like this:

```json
"auth": {
    "authorizationEndpoint": "https://host/auth/realms/realm/protocol/openid-connect/auth",
    "callbackURL": "http://localhost:8000/auth",
    "clientID": "outputchecker",
    "clientSecret": "secrect",
    "issuer": "https://host/auth/realms/realm",
    "logoutURL": "https://host/auth/realms/realm/protocol/openid-connect/logout?redirect_uri=http://localhost:8000",
    "scope": "openid offline_access profile",
    "tokenEndpoint": "https://host/auth/realms/realm/protocol/openid-connect/token",
    "userInfoURL": "https://host/auth/realms/realm/protocol/openid-connect/userinfo"
}
```

### Storage settings

Storage settings are for connecting to Minio via their JavaScript API. All of these settings are required.

#### `storage.endPoint: string` `required`

See `microservices/storageApi` for this value.
Defaults to `localhost`

#### `storage.port: number` `required`

See `microservices/storageApi` for this value.
Defaults to `9000`

#### `storage.useSSL: boolean` `required`

Set to `true` if using `https`.
Defaults to `false`

#### `storage.bucket: string` `required`

Set to the bucket you are storing your files in. See the `microservices/storageApi` for these values.

#### `storage.accessKey: string` `required`

See the `microservices/storageApi` for these values.

#### `storage.secretKey: string` `required`

See the `microservices/storageApi` for these values.

### `user` settings

#### `user.idField: string` `required`

Declare which property on a authenticated user object is the ID key.
Defaults to `preferred_username`.

### Groups and Modes

There are 3 groups a user can belong to;

##### Exporter (`/exporter` by default)

This interface allows a user to create new data or code export requests or download
files from the SRE, depending on which environment OCWA is running in. In the SRE
you can download approved import requests and outside of SRE you can download
approved export requests

##### Output Checker (`/oc` by default)

Output Checkers can review requests and approve them or flag the request and
discuss the reasons why the request has been flagged with the exporter

##### Reports (`/reports` by default)

Reports is a simple analytics tool that gathers all _submitted_ requests for purposes
of analyzing trends like approval time, and can be filtered by project or exporter.

## Installation

All installs require an instance of mongodb available.

### Prerequisites

- npm 6.4.1 or newer
- node 10.15.1 LTS or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Copy and rename `config/default.json.example` to `config/default.json` and fill in the values.

```sh
npm install
npm start
```

```sh
$ hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
$ port=8000
$ docker run -e TOKEN_ENDPOINT=<oidc token endpoint> -e USER_INFO_ENDPOINT=<oidc user info endpoint> -e AUTH_ENDPOINT=<authendpoint> -e AUTH_CALLBACK_URL=<host/auth> -e AUTH_CLIENT=<oidc client> -e AUTH_ISSUER=<oidc issuer> -e AUTH_LOGOUT_URL=<oidc logout url> -e AUTH_SCOPES="openid offline_access" -e CLIENT_SECRET=<YOUR_CLIENT_SECRET> -e JWT_SECRET=<YOUR_API_SECRET> -e COOKIE_SECRET=<COOKIE_SECRET> -e HOST=docker -e HELP_URL=http://help-url.com -e FORUM_API_HOST=$hostip:3000 -e EXPORTER_GROUP="/exporter" -e OC_GROUP="/oc" -e REPORTS_GROUP="/reports" -e EXPORTER_MODE="export" -e FORUM_SOCKET_HOST=$hostip:3001 -e REQUEST_API_HOST=$hostip:3002 -e FILES_API_HOST=$hostip:1080 -e USER_ID_FIELD=email -e PORT=$port --add-host=docker:$hostip -p $port:$port <DOCKER_IMAGE>
```

Note that if you want to use a test user, ensure the `default.json` config has the following fields:

- `testGroup`: set to either `/exporter`, `/reports` or `/oc`
- `testJWT:exporter`: A JWT that matches the above format (make sure the group array includes '/exporter')
- `testJWT:oc`: A JWT that matches the above format (make sure the group array includes '/oc\*\*)

**NOTE: DO NOT INCLUDE THESE VALUES IN PRODUCTION**

### Docker Install

You will need to `$ docker build .` to build the docker container and the following commands to run it

```sh
hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
port=8000
docker run -e TOKEN_ENDPOINT=<oidc token endpoint> -e USER_INFO_ENDPOINT=<oidc user info endpoint> -e AUTH_ENDPOINT=<authendpoint> -e AUTH_CALLBACK_URL=<host/auth> -e AUTH_CLIENT=<oidc client> -e AUTH_ISSUER=<oidc issuer> -e AUTH_LOGOUT_URL=<oidc logout url> -e AUTH_SCOPES="openid offline_access" -e CLIENT_SECRET=<YOUR_CLIENT_SECRET> -e JWT_SECRET=<YOUR_API_SECRET> -e COOKIE_SECRET=<COOKIE_SECRET> -e HOST=docker -e FORUM_API_HOST=$hostip:3000 -e EXPORTER_GROUP="/exporter" -e OC_GROUP="/oc" -e REPORTS_GROUP="/reports" -e EXPORTER_MODE="export" -e FORUM_SOCKET_HOST=$hostip:3001 -e REQUEST_API_HOST=$hostip:3002 -e FILES_API_HOST=$hostip:1080 -e USER_ID_FIELD=email -e PORT=$port --add-host=docker:$hostip -p $port:$port <DOCKER_IMAGE>
```

## Testing

To run the tests run

```sh
npm test
```

## Helm

For both below helm commands make a copy of values.yaml within the helm/ocwa-frontend directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

```sh
helm install --name ocwa-frontend --namespace ocwa ./helm/ocwa-frontend -f ./helm/ocwa-frontend/config.yaml
```

### Helm Update (Kubernetes)

```sh
helm upgrade --name ocwa-frontend ./helm/ocwa-frontend  -f ./helm/ocwa-frontend/config.yaml
```

### Coding Structure and Style

This project aims to stay up-to-date with latest versions of the modern JavaScript development stack. [Babel](https://babeljs.io/) transpiles modern syntax (e.g. destructoring, generators, etc), React is the view library, Redux for state management, Redux-Saga for side effects and AtlasKit components for UI.
