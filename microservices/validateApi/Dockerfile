FROM python:3.7.0

RUN pip install pyyaml requests gevent && \
    # FLASK Micro-framework
    pip install flask flask_compress && \
    # Mongo SDK
    pip install mongoengine && \
    # Amazon EC2/S3 SDK
    pip install boto3 && \
    # dot accessible dictionary
    pip install munch && \
    # HCL Parser
    pip install pyhcl

RUN pip install pytest

WORKDIR /app

COPY . .

COPY config/default.json.template config/default.json

EXPOSE 3003

ENTRYPOINT ["python", "./wsgi.py"]