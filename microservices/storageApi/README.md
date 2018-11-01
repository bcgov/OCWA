# OCWA Storage

OCWA has not created a storage API. Instead we use two existing software designed to provide highly available and
cloud/local storage agnostic tools. With file upload resume being possible.

## Service
The service/standard is provided by tus. https://tus.io/ It is recommended that the go binary tusd be used as it is the
standard and most updated way to use tus. However there is also a node server and other community created implementations.
It is further recommended that an official one be used not a community created one just to ensure up to date service. 
Tusd is available: https://github.com/tus/tusd - binaries at time of release: https://github.com/tus/tusd/releases/tag/0.10.0

Using the service requires using one of the existing client libraries which are also made officially available at https://tus.io
Official clients exist for JS, Java, Android and IOS. Some community clients also exist, as before it is recommended to use an
official client, the JS one is available here: https://github.com/tus/tus-js-client

## Storage
The storage backend requires an additional service. Since tus only supports Local Storage, Amazon S3, and Google Cloud out of the box
an additional tool is required if you wish to use say Azure. https://minio.io/azure.html, it also supports GCP/Local/etc.
Download from: https://minio.io/downloads.html

## Usage Example
Start minio with the following commands
```
export MINIO_ACCESS_KEY=azureaccountname;
export MINIO_SECRET_KEY=azureaccountkey;
minio gateway azure        
```

Start tusd with the following commands
```
export AWS_ACCESS_KEY_ID=azureaccountname;
export AWS_SECRET_ACCESS_KEY=azureaccountkey;
export AWS_REGION=us-east-1;
tusd -s3-endpoint http://localhost:9000 -s3-bucket blobContainerName
```
Before you start the demo modify demo/public/js/demo.js with a JWT that your tusd server will accept (if it requires one).
Start the demo with the following commands
```
cd demo;
npm install;
npm start
```

Then browse to http://127.0.0.1:3000 and upload a file by selecting one in the file input

## Helm
For both below helm commands make a copy of values.yaml within the helm/storage-api directory
and modify it to contain the values specific for your deployment.

### Helm install (Kubernetes)
helm install --name ocwa-storage-api --namespace ocwa ./helm/storage-api -f ./helm/storage-api/config.yaml

### Helm update (Kubernetes)
helm upgrade --name ocwa-storage-api ./helm/storage-api  -f ./helm/storage-api/config.yaml