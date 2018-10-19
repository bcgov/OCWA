FROM python:3.7.0

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 3004

ENTRYPOINT ["./entrypoint.sh"]
