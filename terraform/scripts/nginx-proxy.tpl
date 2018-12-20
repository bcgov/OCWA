map $http_upgrade $connection_upgrade {
  default upgrade;
  "" close;
}

server {
  listen                    443 ssl;
  server_name               authdev.popdata.bc.ca;

  ssl_certificate           ${sslCertificate};
  ssl_certificate_key       ${sslCertificateKey};

  location = / {
    return 301 /auth;
  }

  # Proxy everything over to the service
  location /auth/ {
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;

    proxy_pass http://ocwa_keycloak:8080;
  }
}

server {
  listen                    443 ssl;
  server_name               ocwadev.popdata.bc.ca;

  ssl_certificate           ${sslCertificate};
  ssl_certificate_key       ${sslCertificateKey};

  location /version {
      root   /www;
      index  index.html;
  }
  
  location /minio/ {
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;

    proxy_pass http://ocwa_minio:9000;
  }

  location /files {
    proxy_pass http://ocwa_tusd:1080/files;

    # Disable request and response buffering
    proxy_request_buffering  off;
    proxy_buffering          off;
    proxy_http_version       1.1;

    # Add X-Forwarded-* headers
    proxy_set_header X-Forwarded-Host $hostname;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection "upgrade";
    client_max_body_size     0;
  }

  # Proxy everything else to the frontend
  location / {
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;

    proxy_pass http://ocwa_frontend:8000;
  }
}

server {
  listen                    443 ssl default;

  ssl_certificate           ${sslCertificate};
  ssl_certificate_key       ${sslCertificateKey};

  return 301 ${authHost};
}

server {
  listen                    80 default;

  return 301 ${ocwaHost};
}
