FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
ENV NPM_CONFIG_PRODUCTION false

RUN npm install -g webpack webpack-cli
COPY ./config/config.docker /usr/src/app/config/default.json

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install
COPY . /usr/src/app
RUN echo "{}" > /usr/src/app/config/production.json
RUN chmod +x entrypoint.sh

#Commenting out for now, compiling pushes environment variables
#RUN yarn build

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
