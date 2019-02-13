# OCWA Storage API

OCWA has not created a storage API. We instead leverage two existing software designed to provide highly available and cloud/local storage agnostic tools with file upload resume capability.

## Components

- Tus (<https://tus.io/>)
- Minio (<https://minio.io/>)

### Service (Tus)

The service/standard is provided by Tus. We recommend that the go binary `tusd` be used as it is the standard and most updated way to use tus. However there is also a node server and other community created implementations. We suggest that an official implementation be used instead of a community created one to ensure up to date service.  

- Source: <https://github.com/tus/tusd>
- Binary Releases: <https://github.com/tus/tusd/releases>

Using the service requires using one of the existing client libraries for tus. Official clients exist for JS, Java, Android and iOS. While ome other community clients also exist, we recommended to use an official client. The JS one is available here: <https://github.com/tus/tus-js-client>

### Storage (Minio)

The storage backend is provided by Minio. Since tus only supports Local Storage, Amazon S3, and Google Cloud out of the box, an additional tool is required if you wish to use say Azure (<https://minio.io/azure.htm>). Minio also supports GCP/Local/etc.

- Binary Releases: <https://minio.io/downloads.html>

## Demo Example

Start minio with the following commands

``` sh
export MINIO_ACCESS_KEY=azureaccountname
export MINIO_SECRET_KEY=azureaccountkey
minio gateway azure
```

Start tusd with the following commands

``` sh
export AWS_ACCESS_KEY_ID=azureaccountname
export AWS_SECRET_ACCESS_KEY=azureaccountkey
export AWS_REGION=us-east-1
tusd -s3-endpoint http://localhost:9000 -s3-bucket blobContainerName
```

Before you start the demo, modify demo/public/js/demo.js with a JWT that your tusd server will accept (if it requires one).

Start the demo with the following commands

``` sh
cd demo
npm install
npm start
```

Then browse to <http://127.0.0.1:3000> and upload a file by selecting one in the file input.

### Windows Environment

The tusd binary does not appear to behave correctly on Windows. You will likely need to run tusd via a Docker container to have a functional OCWA Storage API. To run tusd in a Docker container, runn the following:

``` sh
docker run -it --rm -p 1080:1080 --name tusd1 -e "AWS_ACCESS_KEY_ID=azureaccountname" -e "AWS_SECRET_ACCESS_KEY=azureaccountkey" -e "AWS_REGION=us-east-1" tusproject/tusd -s3-endpoint http://10.0.75.1:9000 -s3-bucket blobContainerName
```

## Helm

For both below helm commands make a copy of values.yaml within the helm/storage-api directory
and modify it to contain the values specific for your deployment.

### Helm Install (Kubernetes)

``` sh
helm install --name ocwa-storage-api --namespace ocwa ./helm/storage-api -f ./helm/storage-api/config.yaml
```

### Helm Update (Kubernetes)

``` sh
helm upgrade --name ocwa-storage-api ./helm/storage-api  -f ./helm/storage-api/config.yaml
```
