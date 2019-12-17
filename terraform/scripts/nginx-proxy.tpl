map $http_upgrade $connection_upgrade {
  default upgrade;
  "" close;
}

server {
  listen                    443 ssl;
  server_name               ${authHostname};

  ssl_certificate           ${sslCertificate};
  ssl_certificate_key       ${sslCertificateKey};

  location = / {
    return 301 /auth;
  }

  # Proxy everything over to the service
  location /auth/ {
    resolver 127.0.0.11 valid=30s;
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
  server_name               ${ocwaHostname};

  ssl_certificate           ${sslCertificate};
  ssl_certificate_key       ${sslCertificateKey};

  location /version {
      root   /www;
      index  index.html;
  }
  
  location /minio/ {
    resolver 127.0.0.11 valid=30s;
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;

    proxy_pass http://ocwaminio:9000;
  }

  location /files {
    resolver 127.0.0.11 valid=30s;

    proxy_pass http://ocwa_tusd:1080/files;

    # Disable request and response buffering
    proxy_request_buffering  off;
    proxy_buffering          off;
    proxy_http_version       1.1;

    # Add X-Forwarded-* headers
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;

    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;
    client_max_body_size     0;
  }

  location /socket {
    resolver 127.0.0.11 valid=30s;
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        Connection $connection_upgrade;

    set $backend "http://ocwa_forum_api:3001";

    proxy_pass $backend;
  }

  location /reqsocket {
    resolver 127.0.0.11 valid=30s;
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        Connection $connection_upgrade;

    set $backend "http://ocwa_request_api:2998";

    proxy_pass $backend;
  }

  # Proxy everything else to the frontend
  location / {
    resolver 127.0.0.11 valid=30s;

    set $backend "http://ocwa_frontend:8000";
    proxy_pass $backend;

    # Disable request and response buffering
    proxy_request_buffering  off;
    proxy_buffering          off;
    proxy_http_version       1.1;

    # Add X-Forwarded-* headers
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;

    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;
    client_max_body_size     0;
  }

}



server {
  listen                    443 ssl;
  server_name               ${ocwaDLHostname};

  ssl_certificate           ${sslCertificate};
  ssl_certificate_key       ${sslCertificateKey};

  location /files {
    resolver 127.0.0.11 valid=30s;

    proxy_pass http://ocwa_tusd:1080/files;

    # Disable request and response buffering
    proxy_request_buffering  off;
    proxy_buffering          off;
    proxy_http_version       1.1;

    # Add X-Forwarded-* headers
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;

    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;
    client_max_body_size     0;
  }

  location /socket {
    resolver 127.0.0.11 valid=30s;
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        Connection $connection_upgrade;

    set $backend "http://ocwa_forum_api:3001";

    proxy_pass $backend;

  }

  location /reqsocket {
    resolver 127.0.0.11 valid=30s;
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        Connection $connection_upgrade;

    set $backend "http://ocwa_request_api:2998";

    proxy_pass $backend;
  }

  # Proxy everything else to the frontend
  location / {
    resolver 127.0.0.11 valid=30s;

    set $backend "http://ocwa_download_frontend:8000";
    proxy_pass $backend;

    # Disable request and response buffering
    proxy_request_buffering  off;
    proxy_buffering          off;
    proxy_http_version       1.1;

    # Add X-Forwarded-* headers
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;

    proxy_set_header         Upgrade $http_upgrade;
    proxy_set_header         Connection $connection_upgrade;
    client_max_body_size     0;
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
