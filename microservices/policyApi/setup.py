import os

from setuptools import setup, find_packages


def read(filename):
    file_path = os.path.join(os.path.dirname(__file__), filename)
    return open(file_path).read()


setup(
    name='validate',
    author='Brandon Sharratt',
    author_email='',
    version='0.1',
    description="OCWA Validate API",
    long_description=read('README.md'),
    license='Apache 2.0',

    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'config',
        'flask',
        'flask-compress',
        'gevent',
        'pyyaml',
        'mongoengine',
        'pyhcl',
        'requests'
    ],
    setup_requires=[
    ],
    tests_require=[
        'mocker',
        'pytest',
        'pytest-cov',
        'pycodestyle',
        'pylint'
    ]
)
