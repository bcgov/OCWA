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
$ hostip=$(ifconfig en0 | awk '$1 == "inet" {print $2}')
$ port=8000
$ docker run -e JWT_SECRET=<YOUR_API_SECRET> -e HOST=docker -e FORUM_API_HOST=$hostip:3000 -e FORUM_SOCKET_HOST=$hostip:3001 -e USER_ID_FIELD=Email -e PORT=$port --add-host=docker:$hostip -p $port:$port <DOCKER_IMAGE>
```

### NOTES

This is a proof-of-concept "Hello World" app and is not at all considered production ready.
