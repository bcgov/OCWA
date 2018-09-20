FROM node:10.9.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV development

COPY package.json /usr/src/app
RUN yarn install
COPY . /usr/src/app
RUN chmod +x entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
