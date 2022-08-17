import os
from string import Template

template = """ 

images = {
    owner = "quay.io/h3brandon"
    request_api = ":${TAG}"
    policy_api = ":${TAG}"
    project_api = ":${TAG}"
    validate_api = ":${TAG}"
    forum_api = ":${TAG}"
    frontend = ":${TAG}"
    formio = "h3brandon/formio:latest"
    minio = ":RELEASE.2019-04-23T23-50-36Z"
    tusd = ":68385adc0cba"
}
    """

s = Template(template)

with open('terraform.auto.tfvars', 'w') as the_file:
    the_file.write(s.substitute(TAG=os.environ['BRANCH'].replace('/', '-')))
