FROM python:3.7.0

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

RUN chmod +x entrypoint.sh

EXPOSE 3004

ENTRYPOINT ["./entrypoint.sh"]
