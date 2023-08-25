import os

from setuptools import setup, find_packages
from setuptools.command.test import test as TestCommand


def read(filename):
    file_path = os.path.join(os.path.dirname(__file__), filename)
    return open(file_path).read()

class PyTest(TestCommand):
    user_options = [("pytest-args=", "a", "Arguments to pass to pytest")]

    def initialize_options(self):
        TestCommand.initialize_options(self)
        self.pytest_args = ""

    def run_tests(self):
        import shlex

        # import here, cause outside the eggs aren't loaded
        import pytest

        errno = pytest.main(shlex.split(self.pytest_args))
        sys.exit(errno)


setup(
    name='policy',
    author='Brandon Sharratt',
    author_email='',
    version='3.1.5',
    description="OCWA Policy API",
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
        'requests',
        'flask-jwt-simple',
    ],
    setup_requires=[
    ],
    tests_require=[
        'mocker',
        'pytest',
        'pytest-cov',
        'pytest-mock',
        'mongomock',
        'pycodestyle',
        'pylint'
    ],
    cmdclass={"pytest": PyTest},
)
