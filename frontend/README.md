# OCWA Front End

OCWA's user interface is powered by a modern JavaScript application, employing Babel, React and Redux for view rendering and state management. Development and production builds use Webpack and the server uses Express to interface with authentication, HTTP endpoints and file details.

It is recommended that you have a good understanding of modern JavaScript development and the Redux development stack and new features like Generators. See more in [Code Structure and Style](#4-coding-structure-and-style) for more details.

If you are interested in just viewing the application in a production ready, compiled state, view the [OCWA quick start guide](../README.md#developer-quick-start-guide). To boot up just the front end, skip ahead to the [installation instructions](#3-installation).

## 1. Configuration

The frontend directory includes a default config file, found in `frontend/config/default.json.example`. There are some default values filled in, as well as placeholder values. Copy and rename the file as `default.json` before starting the application with `$ npm start`. Details for each property are below.

#### `port: number` `required`

The assigned port for the front-end Express app.  
Defaults to `8000`

#### `wsPort: number` `required`

The assigned websocket port. Must match the same value in the [Forum service config](../microservices/forumApi/config/default.json.example) config.  
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

See [Forum service config](../microservices/forumApi/config/default.json.example) for reference.  
Defaults to `http://localhost:3000`

#### `forumSocket: url` `required`

See [Forum service config](../microservices/forumApi/config/default.json.example) for reference.  
Defaults to `ws://localhost:3001`

#### `requestApiHost: url` `required`

See [Request service config](../microservices/requestApi/config/default.json.example) for reference.  
Defaults to `http://localhost:3002`

#### `filesApiHost: url` `required`

See [Storage service README](../microservices/storageApi/README.md) for reference.  
Defaults to `http://localhost:1080`

#### `exporterGroup: string` `required`

Defines the identifying group exporters belong to. See more at [Groups and Modes](#2-groups-and-modes).  
Defaults to `/exporter`

#### `ocGroup: string` `required`

Defines the identifying group output checkers belong to. See more at [Groups and Modes](#2-groups-and-modes).  
Defaults to `/oc`

#### `reportsGroup: string` `required`

Defines the identifying group users with permissions to view reports belong to. See more at [Groups and Modes](#2-groups-and-modes).  
Defaults to `/reports`

#### `exporterMode: 'export' | 'download'` `required`

There are 2 different environments that the interface will accommodate. Exporting data/code out of a Secure Research Environment or importing. See more at [Groups and Modes](#2-groups-and-modes).

`export`: Inside the SRE to **export** code  
`download`: Outside the SRE to **import** data/code

Defaults to `export`

#### `codeExportEnabled: boolean` `required`

If enabled the New Request form will allow users to pick between data and code requests.  
Defaults to `false`

#### `repositoryHost: ?url`

If `codeExportEnabled` is on then you need to set the host of the repository so pull requests will work, for example something like `https://subdomain.bc.com/shares/`.

#### `auth: object` `required`

Define an user object based on the [Passport](http://www.passportjs.org/docs/) authentication. Recommended configuration would look something like this:

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

Storage settings are for connecting to Minio via their JavaScript API. All of these settings are required. See more about Minio's JavaScript Client [here](https://docs.min.io/docs/javascript-client-api-reference.html).

#### `storage.endPoint: string` `required`

See [Storage service README](../microservices/storageApi/README.md) for this value.  
Defaults to `localhost`

#### `storage.port: number` `required`

See [Storage service README](../microservices/storageApi/README.md) for this value.  
Defaults to `9000`

#### `storage.useSSL: boolean` `required`

Set to `true` if using `https`.  
Defaults to `false`

#### `storage.bucket: string` `required`

Set to the bucket you are storing your files in. See the [Storage service README](../microservices/storageApi/README.md) for these values.

#### `storage.accessKey: string` `required`

See the [Storage service README](../microservices/storageApi/README.md) for these values.

#### `storage.secretKey: string` `required`

See the [Storage service README](../microservices/storageApi/README.md) for these values.

**NOTE:** Minio is only used for file _viewing_. TUSD is used for uploading though there is no configuration required to upload via the frontend.

### `user` settings

#### `user.idField: string` `required`

Declare which property on a authenticated user object is the ID key.  
Defaults to `preferred_username` but can be whatever your authentication setup outputs.

## 2. Groups and Modes

There are 3 groups a user can belong to;

#### 1) Exporter (`/exporter` by default)

This interface allows a user to create new data or code export requests or download files from the SRE, depending on which environment OCWA is running in. In the SRE you can download approved import requests and outside of SRE you can download approved export requests.

#### 2) Output Checker (`/oc` by default)

Output Checkers can review requests and approve them or flag the request and discuss the reasons why the request has been flagged with the exporter.

#### 3) Reports (`/reports` by default)

Reports is a simple analytics tool that gathers all _submitted_ requests for purposes of analyzing trends like approval time, and can be filtered by project or exporter.

In addition there are 2 states the Exporter or Output Check interface can be viewed as; `import` into the SRE or `export` out of the SRE. The interface differences betweeen these modes is minimal, mostly string localization, though there can be minor functionality differences with the application as whole.

## 3. Installation Options

All installs require an instance of mongodb available.

### Prerequisites

- npm 6.4.1 or newer
- node 10.15.1 LTS or newer
- Docker 18.09.1 or newer

#### 3.1 Bare Metal Install

Copy and rename `frontend/config/default.json.example` to `frontend/config/default.json` and fill in the values. See [Configuration](#1-configuration) for details.

```sh
npm install
npm start
```

In some cases where you don't have an authentication service setup, you can boot the application in development mode by setting a `testGroup` value and a hardcoded JWT, which you can generate using an [online JWT generator](http://jwtbuilder.jamiekurtz.com/). Just be sure to configure the additional claims like so:

```json
{
  "email": "test_user@test.com",
  "display_name": "Test User",
  "preferred_username": "test_user",
  "groups": [
    "/oc" or "/exporter"
  ],
  "
}
```

- `testGroup`: set to either `/exporter`, `/reports` or `/oc`
- `testJWT:exporter`: A JWT that matches the above format (make sure the `group` array includes '/exporter')
- `testJWT:oc`: A JWT that matches the above format (make sure the **`group`** array includes '/oc\*\*)

**NOTE: DO NOT INCLUDE THESE VALUES IN PRODUCTION**

#### 3.2 Docker Install

You will need Docker installed. Build the container by running

```shell
$ cd path/to/repo/frontend/
$ docker build .
```

then run the following commands (replacing the values inside of the `<placeholder text>`. This would be the same as replacing the `default.json` values in bare metal installs):

```sh
$ hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
$ port=8000
$ docker run -e TOKEN_ENDPOINT=<oidc token endpoint> -e USER_INFO_ENDPOINT=<oidc user info endpoint> -e AUTH_ENDPOINT=<authendpoint> -e AUTH_CALLBACK_URL=<host/auth> -e AUTH_CLIENT=<oidc client> -e AUTH_ISSUER=<oidc issuer> -e AUTH_LOGOUT_URL=<oidc logout url> -e AUTH_SCOPES="openid offline_access" -e CLIENT_SECRET=<YOUR_CLIENT_SECRET> -e JWT_SECRET=<YOUR_API_SECRET> -e COOKIE_SECRET=<COOKIE_SECRET> -e HOST=docker -e FORUM_API_HOST=$hostip:3000 -e EXPORTER_GROUP="/exporter" -e OC_GROUP="/oc" -e REPORTS_GROUP="/reports" -e EXPORTER_MODE="export" -e FORUM_SOCKET_HOST=$hostip:3001 -e REQUEST_API_HOST=$hostip:3002 -e FILES_API_HOST=$hostip:1080 -e USER_ID_FIELD=email -e PORT=$port --add-host=docker:$hostip -p $port:$port <DOCKER_IMAGE>
```

#### 3.3 Helm

For both below helm commands make a copy of `values.yaml` within the helm/ocwa-frontend directory and modify it to contain the values specific for your deployment. Learn more about [Helm here](https://helm.sh).

**Helm Install (Kubernetes)**

```sh
$ helm install --name ocwa-frontend --namespace ocwa ./helm/ocwa-frontend -f ./helm/ocwa-frontend/config.yaml
```

**Helm Update (Kubernetes)**

```sh
$ helm upgrade --name ocwa-frontend ./helm/ocwa-frontend  -f ./helm/ocwa-frontend/config.yaml
```

## 4. Coding Structure and Style

#### 4.1 Code Formatting

This project aims to stay up-to-date with latest versions of the modern JavaScript development stack. [Babel](https://babeljs.io/) transpiles modern syntax (e.g. destructoring, generators, etc), [React](https://reactjs.org) is the view library, [ Redux ](https://redux.js.org) for state management, [Redux-Saga](https://redux-saga.js.org) for side effects and [AtlasKit](https://atlaskit.atlassian.com) components for UI.

The most advanced concept is the use of Generators when applied in sagas, but Redux Saga's website has good documentation and [resources](https://redux-saga.js.org/docs/ExternalResources.html) to help you get started.

For quality and consistency [ESLint](https://eslint.org) is used to ensure common mistakes are caught while coding and [Prettier](https://prettier.io/) formats your code into "prettier" and more readable code, but also standardized, which leads to a more consistent code base.

#### 4.2 Code structure

The UI employs a ducks-like style to structure, which seeks to break up the different domains of a project into separate modules responsible for their own content (e.g. Requests are handled in the `requests` module, discussions in the `discussions` module etc). All public facing code is kept in the `/src` directory.

#### `src/components`

All the global components that can be used across modules.

#### `src/modules`

See more about modules below.

#### `src/services`

All the global components that can be used across modules.

#### `src/utils`

Functions that are useful across the entire project.

#### 4.2.1) Modules

Each module contains a specific stack of the following:

```
/ ..
/ actions.js
/ components
/ containers
/ reducer.js (or (/reducer))
/ sagas.js
/ utils.js (if necessary)
```

This allows each module to have its own reducer data structure, actions and side-effects, but all of these are optional. Reducers and sagas are included during boot by the `src/index.js` entry file.

A quick note on containers/components if you are not familiar with Redux. Containers are file that connects the redux state object with a component and are kept separate to keep components dumb when it comes to where they get their data from. The `/data` module however containers a special connect helper that will help compose a data-fetching container.

To compose a data-aware component, in a module's `actions.js` export the following action:

```javascript
// anymodule/actions.js
import { createDataAction } from '@src/modules/data/actions';

export const fetchRequests = createDataAction('requests/get');
```

Then create a container which is composed like so:

```javascript
// anymodule/containers/requests.js
import { connect } from 'react-redux';
import withRequest from '@src/modules/data/components/data-request';

import Requests from '../components/requests';
import { requestsListSchema } from '../schemas';

const mapStateToProps = () => ({}); // Decorate the connect method as you normally would

export default connect(
  mapStateToProps,
  {
    // If dispatch props has a `initialRequest` prop, it'll fire that on mount
    initialRequest: ({ page }) =>
      fetchRequest(
        // If there are 2 arguments, the first one is considered a meta object
        {
          page: 1,
        },
        // The other object is the request object, with details about the request
        {
          url: `/api/v1/requests?page=${page}`, // compose the API endpoint you wish to fetch your data from
          schema: requestsListSchema, // Assign a normalized schema if relevant
        }
      ),
  }
)(withRequest(Requests)); // Add the higher-order component here to add loading props and kick off the request.
```

Data is stored in the `data` reducer property, with `entities` being the full data object, `fetchStatus` being the status of the request, which can be `loading`, `loaded` or `failed`.

In some cases you might add a `dataType` to the request container if you are requesting a payload that isn't able to be normalized into an ID based key/value storage object.

#### 4.3 Testing

To run the tests run

```sh
npm test
```

2.
