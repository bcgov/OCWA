# Output Checker Workflow App &middot; [![Build Status](https://github.com/bcgov/OCWA/actions/workflows/ocwa.yaml/badge.svg?branch=main)](https://github.com/bcgov/OCWA/actions/workflows/ocwa.yaml) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

OCWA (pronounced "aqua") is a microservice application suite that can store, validate, and enforce file export policies for the purpose of output checking.

## Table of Contents

- [Output Checker Workflow App](#output-checker-workflow-app-middot-build-statushttpstravis-ciorgbcgovocwa-licensehttpsopensourceorglicensesapache-20)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Operating System](#operating-system)
  - [Components](#components)
    - [Forum API](#forum-api)
    - [Policy API](#policy-api)
    - [Request API](#request-api)
    - [Storage API](#storage-api)
    - [Validation API](#validation-api)
    - [Front End](#front-end)
  - [Helm](#helm)
    - [Helm Install (Kubernetes)](#helm-install-kubernetes)
    - [Helm Update (Kubernetes)](#helm-update-kubernetes)
    - [Openshift (OCP)](#openshift-ocp)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)
  - [Notes](#notes)
    - [Default Port List](#default-port-list)
    - [Developer Quick Start Guide](#developer-quick-start-guide)

## Installation

OCWA is written in both node.js and Python 3. Docker is also strongly recommended for Windows platforms. For each of the OCWA components, refer to their associated README files for specific instructions. If you are looking at the integration tests, you will also require Katalon Studio ( with language support for Groovy and Gherkin).

### Prerequisites

- Python 3.6 or newer
- npm 6.4.1 or newer
- node 10.15.1 LTS or newer
- MongoDB 4.0 or newer
- Docker 18.09.1 or newer
- Katalon Studio 5.10 or newer
- Minio (Storage API)
- Tusd (Storage API)

### Operating System

OCWA was fully developed on Mac using baremetal, developed with a combo of bare metal and docker on windows (docker for the python apis) and has been deployed on Linux using Terraform, and Kubernetes using Helm.
Windows with Terraform doesn't work, we haven't had enough time to devote to fixing that.

## Components

### Forum API

- [README](/microservices/forumApi/README.md)

The forum API is a nodejs api providing topics (with subtopics), comments and permissions for them. Api docs are available using the OpenApi v3 specification
by running the API and visiting /v1/api-docs. The Forum API also provides a websocket interface for being notified when new topics/comments are created
that are relevant to the user.

### Policy API

- [README](/microservices/policyApi/README.md)

The policy API is a python api providing a policy. A policy consists of multiple rules rules define source to execute in python on a file.
Policy/Rules are specified using the [HCL language](https://github.com/hashicorp/hcl).
Api docs are available using the OpenApi v3 specification by running the API and visiting /v1/api-docs.

### Request API

- [README](/microservices/requestApi/README.md)

The request API is a nodejs api providing the business logic behind OCWA. It uses the forum api to provide permissions by making a topic with a 1-1 request correlation.
Api docs are available using the OpenApi v3 specification by running the API and visiting /v1/api-docs.

### Storage API

- [README](/microservices/storageApi/README.md)

The storage API is a combination of open source existing products. Minio is used to treat any underlying storage as though it was S3 so that only one
backend needs to be supported even if the backend is GCP/Azure/Local Disk or actually S3. TUSD is used to support large file uploads so that they can be resumed
if interrupted due to a connection drop or whatever reason.

### Validation API

- [README](/microservices/validateApi/README.md)

The validate API is a python api providing a validation. The validation api uses validates files from the storage api
Api docs are available using the OpenApi v3 specification by running the API and visiting /v1/api-docs.
Note that the Validation API is not intended to be forward facing and is intended to be accessed only by other apis with an api key/secret.

### Front End

- [README](/frontend/README.md)

The front end is written using ReactJs. It implements the apis.

## Helm

There is a helm chart in this top level. It deploys all of OCWA in one convenient package.
For both below helm commands make a copy of values.yaml within the helm/ocwa directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

```sh
helm dep up ./helm/ocwa
helm install --name ocwa --namespace ocwa ./helm/ocwa -f ./helm/ocwa/config.yaml
```

### Helm Update (Kubernetes)

```sh
helm dep up ./helm/ocwa
helm upgrade ocwa ./helm/ocwa  -f ./helm/ocwa/config.yaml
```

### Openshift (OCP)

Openshift has a bit of a different deployment as helm is not supported by the test deployment area. Additionally due to the way Openshift runs containers as a random UID, many of the images that work for Kubernetes/Docker and are standard do not work on OpenShift.
As a result the following changes are required.

Mongo Image (forum-api: mongoImage: repository: ) registry.access.redhat.com/rhscl/mongodb-34-rhel7

Because the mongo image is different, the below must also change

```yaml
forum-api:
  dbPod:
    persistence: /var/lib/mongodb/data
    adminEnv: MONGODB_USER
    passEnv: MONGODB_PASSWORD
    dbEnv: MONGODB_DATABASE
    addAdminPassEnv: true
    adminPassEnv: MONGODB_ADMIN_PASSWORD
    initDb: false
```

## Contributing

If you update APIs that changes the signature at all, it is required to be under a new release (ie /v2 instead of /v1). The APIs are written specifically to make this easy. This should be discussed in an issue before implementation starts.
You must pass the Travis CI builds to be able to submit a pull request that can be accepted.

## [Code of Conduct](/CODE_OF_CONDUCT.md)

Please have a read through our [Code of Conduct](/CODE_OF_CONDUCT.md) that we expect all project participants to adhere to. It will explain what actions will and will not be tolerated.

## License

OCWA is [Apache 2.0 licensed](/LICENSE).

## Notes

### Default Port List

| **Endpoint**        | **Port** |
| ------------------- | -------- |
| Forum WS            | 2999     |
| Forum WS (Nginx)    | 3001     |
| Forum Api           | 3000     |
| Request Api         | 3002     |
| Validate Api        | 3003     |
| Policy Api          | 3004     |
| Formio              | 3001     | (recommend changing)
| Storage Api (Minio) | 9000     |
| Storage Api (Tusd)  | 1080     |
| Front End           | 8000     |

### Developer Quick Start Guide

After ensuring the [prerequisite libraries](#prerequisites) are installed and cloning this repo follow the below steps to get the program up and running

1. Configure the frontend, forum api, policy api, project api, request api and validate api by copying the `default.json.example` or `default.json.template` file in their respective `/config` folders,  renaming to `default.json` and modifying or adding their values where appropriate. For the storage API you will need sign into Minio's web interface at `http://localhost:9000` and create a new bucket matching the storage config options defined in the frontend and request api's `default.json`.
2. Create virtual environments for both the policy and validate api's named venv (by running `$ virtualenv venv` in each directory)
3. Run the `startAll.py` script in this directory `$ python startAll.py`

The script will terminate all the pieces upon CTRL+C (SigINT). The node apis and frontend will automatically restart upon any changes, but the python ones will need a manual kick. This script is not expected to work on Windows as it has not been tested on Windows.
