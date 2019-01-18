FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./config/config.docker /usr/src/app/config/default.json

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install
COPY . /usr/src/app
RUN echo "{}" > /usr/src/app/config/production.json
RUN chmod +x entrypoint.sh

ENV NODE_ENV production
RUN yarn build

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
