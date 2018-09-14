FROM node:10.9.0

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 && \
    echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/4.0 main" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org


##App folder
WORKDIR /usr/src/app

##copy package and package-lock and install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
RUN chmod +x entrypoint.sh

EXPOSE ${API_PORT}
EXPOSE ${WS_PORT}
ENTRYPOINT ["./entrypoint.sh"]