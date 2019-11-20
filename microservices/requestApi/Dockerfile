FROM node:11-alpine

RUN apk update && apk add mongodb>4.0.0

##App folder
WORKDIR /usr/src/app

##copy package and package-lock and install dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .
RUN chmod +x entrypoint.sh

EXPOSE 3002
ENTRYPOINT ["./entrypoint.sh"]
