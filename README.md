# Repo for Output Checker Workflow App 
[![Build Status](https://travis-ci.org/bcgov/OCWA.svg?branch=master)](https://travis-ci.org/bcgov/OCWA)

OCWA (pronounced "aqua")

## Components
### Forum Api
[README](/microservices/forumApi/README.md)
The forum API is a nodejs api providing topics (with subtopics), comments and permissions for them. Api docs are available using the OpenApi v3 specification
by running the API and visiting /v1/api-docs. The Forum API also provides a websocket interface for being notified when new topics/comments are created
that are relevant to the user.

### Policy Api
[README](/microservices/policyApi/README.md)
The policy API is a python api providing a policy. A policy consists of multiple rules rules define source to execute in python on a file.
Policy/Rules are specified using the [HCL language](https://github.com/hashicorp/hcl).
Api docs are available using the OpenApi v3 specification by running the API and visiting /v1/api-docs.

### Validation Api
[README](/microservices/validateApi/README.md)
The validate API is a python api providing a validation. The validation api uses validates files from the storage api
Api docs are available using the OpenApi v3 specification by running the API and visiting /v1/api-docs.
Note that the Validation API is not intended to be forward facing and is intended to be accessed only by other apis with an api key/secret.

### Request Api
[README](/microservices/requestApi/README.md)
The request API is a nodejs api providing the business logic behind OCWA. It uses the forum api to provide permissions by making a topic with a 1-1 request correlation.
Api docs are available using the OpenApi v3 specification by running the API and visiting /v1/api-docs.


### Storage Api
[README](/microservices/storageApi/README.md)
The storage API is a combination of open source existing products. Minio is used to treat any underlying storage as though it was S3 so that only one
backend needs to be supported even if the backend is GCP/Azure/Local Disk or actually S3. TUSD is used to support large file uploads so that they can be resumed
if interrupted due to a connection drop or whatever reason.

### Front End
[README](/frontend/README.md)
The front end is written using ReactJs. It implements the apis.

##Contributing
If you update apis that changes the signature at all, it is required to be under a new release (ie /v2 instead of /v1). The APIs are written specifically to make this easy.
You must pass the travis ci builds to be able to submit a pull request that is pullable.

## Notes
```Default Port list:
Forum Api: 3000
Forum WS: 3001
Request Api: 3002
Validate Api: 3003
Policy Api: 3004
Storage Api (Minio): 9000
Storage Api (Tusd): 1080

Front end: 8000
```
