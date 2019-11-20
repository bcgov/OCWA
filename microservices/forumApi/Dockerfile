FROM node:11-alpine

RUN apk update && apk add mongodb>4.0.0


##App folder
WORKDIR /usr/src/app

##copy package and package-lock and install dependencies
COPY package*.json ./
RUN npm ci

RUN apk update && \
    apk add nginx && \
    adduser -D -g 'www' www && \
    mkdir /www && \
    mkdir /run/nginx && \
    chown -R www:www /var/lib/nginx && \
    chown -R www:www /www && \
    printf "user                            www;\n" > /etc/nginx/nginx.conf && \
    printf "worker_processes                auto;\n" >> /etc/nginx/nginx.conf && \
    printf "error_log                       /var/log/nginx/error.log warn;\n" >> /etc/nginx/nginx.conf && \
    printf "events {\n" >> /etc/nginx/nginx.conf && \
    printf "    worker_connections          1024;\n" >> /etc/nginx/nginx.conf && \
    printf "}\n" >> /etc/nginx/nginx.conf && \
    printf "http {\n" >> /etc/nginx/nginx.conf && \
    printf "    client_body_temp_path /tmp/nginx 1 2;\n" >> /etc/nginx/nginx.conf && \
    printf "    proxy_temp_path /tmp/nginx-proxy;\n" >> /etc/nginx/nginx.conf && \
    printf "    fastcgi_temp_path /tmp/nginx-fastcgi;\n" >> /etc/nginx/nginx.conf && \
    printf "    uwsgi_temp_path /tmp/nginx-uwsgi;\n" >> /etc/nginx/nginx.conf && \
    printf "    scgi_temp_path /tmp/nginx-scgi;\n" >> /etc/nginx/nginx.conf && \

    printf "    upstream websocket {\n" >> /etc/nginx/nginx.conf && \
    printf "        server 127.0.0.1:2999;\n" >> /etc/nginx/nginx.conf && \
    printf "    }\n" >> /etc/nginx/nginx.conf && \

    printf "    \n" >> /etc/nginx/nginx.conf && \

    printf "    server {\n" >> /etc/nginx/nginx.conf && \
    printf "        listen 3001;\n" >> /etc/nginx/nginx.conf && \
    printf "        location / {\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_set_header X-Real-IP \$remote_addr;\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_set_header Host \$http_host;\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_set_header X-NginX-Proxy true;\n" >> /etc/nginx/nginx.conf && \

    printf "            proxy_pass http://websocket;\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_redirect off;\n" >> /etc/nginx/nginx.conf && \

    printf "            proxy_http_version 1.1;\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_set_header Upgrade \$http_upgrade;\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_set_header Connection \"Upgrade\";\n" >> /etc/nginx/nginx.conf && \
    printf "            proxy_pass_request_headers      on;\n" >> /etc/nginx/nginx.conf && \
    printf "        }\n" >> /etc/nginx/nginx.conf && \
    printf "    }\n" >> /etc/nginx/nginx.conf && \
    printf "}\n" >> /etc/nginx/nginx.conf

RUN nginx -t
RUN apk update && apk add bridge openrc
RUN touch /var/lib/nginx/logs/error.log && \
    mkdir /var/tmp/nginx/client_body && \
    chmod -R 777 /var/lib/nginx && \
    chmod -R 777 /var/log/nginx && \
    chmod -R 777 /run/nginx && \
    chmod -R 777 /var && \
    chmod -R 777 /var/tmp && \
    chmod -R 777 /var/tmp/nginx && \
    chmod -R 777 /var/tmp/nginx/client_body && \
    chown -R www:www /var/tmp/nginx


# Bundle app source
COPY . .
RUN chmod +x entrypoint.sh

EXPOSE 2999
EXPOSE 3000
EXPOSE 3001
ENTRYPOINT ["./entrypoint.sh"]