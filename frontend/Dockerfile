FROM node:10.9.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV development
ENV API_HOST ocwa-demo.canadacentral.cloudapp.azure.com

COPY package.json /usr/src/app
RUN yarn install
COPY . /usr/src/app

EXPOSE 8000
CMD ["yarn", "start"]
