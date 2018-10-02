# OCWA frontend

A Babel 7 ready React single page application that uses Webpack for development.

You will need a JWT from (http://jwtbuilder.jamiekurtz.com/)[http://jwtbuilder.jamiekurtz.com/].

Make sure instead of `Roles` you assign `Groups`, e.g.

```
{
    "iss": "Online JWT Builder",
    "iat": 1536875344,
    "exp": 1568411344,
    "aud": "www.example.com",
    "sub": "username@example.com",
    "GivenName": "User",
    "Surname": "Name",
    "Email": "username@example.com",
    "Groups": [
        "Manager",
        "Project Administrator"
    ]
}
```

### For local development
Create a `config/default.json` from the `config/default.json.example` file and fill
in the values for jwt and jwtSecret
`$ yarn install`
`$ yarn start`

### For Docker environment
You will need to
`$ docker build .`
```
$ docker run -e JWT=<YOUR_API_TOKEN> -e JWT_SECRET=<YOUR_API_SECRET> -e HOST=localhost -e USER_ID_FIELD=Email -e PORT=8000 -p 8000:8000 <DOCKER_IMAGE>
```

## Testing
To run the tests run
```
yarn test
```

## Helm
For both below helm commands make a copy of values.yaml within the helm/ocwa-frontend directory
and modify it to contain the values specific for your deployment.

### Helm install (Kubernetes)
helm install --name ocwa-frontend --namespace ocwa ./helm/ocwa-frontend -f ./helm/ocwa-frontend/config.yaml

### Helm update (Kubernetes)
helm upgrade --name ocwa-frontend ./helm/ocwa-frontend  -f ./helm/ocwa-frontend/config.yaml

### NOTES

This is a proof-of-concept "Hello World" app and is not at all considered production ready.
