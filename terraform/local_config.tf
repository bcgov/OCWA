resource "local_file" "request_api" {
    content = <<EOF
{
    "apiPort": 3002,
    "logLevel": "verbose",
    "morganLogType": "dev",

    "database": {
      "host": "",
      "username": "dbUser",
      "password": "dbPass",
      "dbName": "dbName"
    },

    "forumApi": "http://ocwa_forum_api:3000",
    "validationApi": "http://ocwa_validate_api:3003",
    "validationApiSecret": "",

    "storageApi": {
        "uri": "ocwaminio",
        "port": 9000,
        "key": "",
        "secret": "",
        "useSSL": false,
        "warnRequestBundlesize": 1024,
        "maxRequestBundlesize": 0,
        "bucket": "bucket"
      },

    "jwtSecret": "",
    "ocwaUrl": "http://localhost:8000/",

    "email":{
      "enabled": false,
      "service": "smtp.gmail.com",
      "secure": true,
      "port": 465,
      "user": "ocwa@gmail.com",
      "pass": "ocwaPassword",
      "from": "ocwa@donotreply.com"
    },

    "gitops": {
      "enabled": false,
      "url": "http://ocwa_gitops_simulator:2000",
      "secret": "s3cr3t"
    },

    "requiredRoleToCreateRequest": "/exporter",
    "outputCheckerGroup": "/oc",
    "allowDenyRequest": true,

    "projectApi": "http://ocwa_project_api:2005/",
    "projectApiSecret": "",

    "autoAccept": false,

    "user":{
        "idField": "preferred_username",
        "emailField": "email",
        "givenNameField": "given_name",
        "surNameField": "family_name",
        "groupField": "groups"
  }
}
    EOF
    filename = "_tmp/default.json"
}