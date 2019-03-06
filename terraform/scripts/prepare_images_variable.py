import os
from string import Template

template = """ 

images = {
    owner = "quay.io/ikethecoder"
    request_api = ":${TAG}"
    policy_api = ":${TAG}"
    validate_api = ":${TAG}"
    forum_api = ":${TAG}"
    frontend = ":${TAG}"
    minio = ":latest"
    tusd = ":latest"
}
    """

s = Template(template)

with open('terraform.auto.tfvars', 'w') as the_file:
    the_file.write(s.substitute(TAG=os.environ['TRAVIS_BRANCH']))
