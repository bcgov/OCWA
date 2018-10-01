# OCWA Validate API

Validates outputs based on policies


# Running

````
docker build --tag oc_verifyapi .

--

docker run -vi -p 3003:3003 --name ocv oc_verifyapi

OR

docker run -vi -p 3003:3003 --name ocv -v `pwd`:/app oc_verifyapi

````

http://localhost:3003/v1/api-docs

curl -v http://localhost:3003/v1/validate

# Test

```
$ pip install '.[test]'
$ pytest --verbose
```

Run with coverage support:

```
$ coverage run -m pytest
$ coverage report
$ coverage html  # open htmlcov/index.html in a browser
```
