FROM python:3.7-alpine

WORKDIR /app

RUN apk add build-base

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 3004

ENTRYPOINT ["./entrypoint.sh"]
