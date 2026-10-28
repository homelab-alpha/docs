---
title: "mini-qr.info"
description:
  "This file deploys Mini QR, a customizable QR code generator, behind an Nginx
  reverse proxy."
url: "docker/compose-info/mini-qr"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker Compose
tags:
  - Docker
  - Mini QR
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Mini QR
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Mini QR
  - QR Code Generator
  - Nginx

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail. This file
deploys Mini QR, a customizable QR code generator, behind an Nginx reverse
proxy.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: October 28, 2026
- **Description**: Configures a Docker network and the Mini QR service.
- **RAW Compose File**: [docker-compose.yml]
- **RAW Nginx Configuration File**: [nginx-proxy.conf]

<br />

## Networks Configuration

```yaml
networks:
  mini-qr_net:
    attachable: false
    internal: false
    external: false
    name: mini-qr
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.26.0/24
          ip_range: 172.20.26.0/24
          gateway: 172.20.26.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "mini-qr"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.mini-qr.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `mini-qr_net`.
- **attachable: false**: Other containers can't attach to this network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file.
- **name: mini-qr**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **subnet**: `172.20.26.0/24`.
  - **ip_range**: `172.20.26.0/24`.
  - **gateway**: `172.20.26.1`.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "mini-qr"**: Names the bridge interface on
    the host.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **description label**: Describes the network as an isolated bridge network.

<br />

## Services Configuration

### `mini-qr_app`

```yaml
services:
  mini-qr_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: mini-qr
    image: ghcr.io/lyqht/mini-qr:v0.32.0
    pull_policy: if_not_present
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    hostname: mini-qr
    networks:
      mini-qr_net:
        ipv4_address: 172.20.26.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "mini-qr"
      com.mini-qr.description:
        "A user-friendly and customizable QR code generator that allows you to
        create styled QR codes with ease."
    healthcheck:
      disable: true
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s

  mini-qr_nginx:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: mini-qr_nginx
    image: docker.io/nginx:1.31.2-alpine3.23-perl
    pull_policy: if_not_present
    depends_on:
      mini-qr_app:
        condition: service_started
    links:
      - mini-qr_app
    volumes:
      - /docker/mini-qr/nginx-proxy.conf:/etc/nginx/nginx.conf
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: mini-qr.local # Customize this with your own domain, e.g., `mini-qr.local` to `mini-qr.your-fqdn-here.com`.
    hostname: mini-qr-nginx
    networks:
      mini-qr_net:
        ipv4_address: 172.20.26.3
    ports:
      - "3017:80/tcp" # HTTP
      - "3017:80/udp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "mini-qr-nginx"
      com.mini-qr.description:
        "a flexible and high-performance server that can handle HTTP, mail, TCP,
        and UDP traffic."
    healthcheck:
      disable: true
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s
```

<br />

- **mini-qr_app**: The service definition.
  - **restart: unless-stopped**: Restarts the container unless it is explicitly
    stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: mini-qr**: Names the container.
  - **image: ghcr.io/lyqht/mini-qr:v0.32.0**: Uses this image, pinned to version
    `v0.32.0`.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **environment**: Sets environment variables.
    - **PUID: 1000**: The user ID the container runs as.
    - **PGID: 1000**: The group ID the container runs as.
    - **TZ: Europe/Amsterdam**: Adjust the timezone to match your local
      timezone. You can find the full list of timezones here
      https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
  - **hostname: mini-qr**: Sets the hostname for the container.
  - **networks**: Connects the service to `mini-qr_net` with static IP address
    `172.20.26.2`.
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining new privileges.
  - **labels**: Project label and a description label.
  - **healthcheck: disable: true**: The health check is disabled for this
    container.

<br />

## Nginx Configuration

The `nginx-proxy.conf` file is mounted into the Nginx container as
`/etc/nginx/nginx.conf`.

```nginx
# nginx.conf
worker_processes auto;

events {
    worker_connections 1024;
    multi_accept on;
}

http {
    # --- Core ---
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;

    keepalive_timeout  65;
    keepalive_requests 1000;

    server_tokens off;

    # --- Logging ---
    access_log /var/log/nginx/access.log;
    error_log  /var/log/nginx/error.log warn;

    # --- Compression ---
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_vary on;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        image/svg+xml;

    # --- Proxy defaults (DRY) ---
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host  $host;
    proxy_set_header X-Forwarded-Port  $server_port;

    proxy_connect_timeout   5s;
    proxy_send_timeout      60s;
    proxy_read_timeout      60s;

    proxy_buffering on;
    proxy_buffers 16 16k;
    proxy_buffer_size 32k;

    # --- Upstream ---
    upstream mini-qr-backend {
        server mini-qr:8080;
        keepalive 32;
    }

    # --- Server ---
    server {
        listen 80;
        server_name localhost;

        # Health check (no proxy)
        location = /health {
            access_log off;
            default_type text/plain;
            return 200 "healthy\n";
        }

        # Static assets (aggressieve caching)
        location /assets/ {
            proxy_pass http://mini-qr-backend;

            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # App
        location / {
            proxy_pass http://mini-qr-backend;
        }

        # Errors
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

<br />

The file is divided into the following sections:

- **Core**
- **Logging**
- **Compression**
- **Proxy defaults (DRY)**
- **Upstream**
- **Server**

<br />

## Conclusion

This `docker-compose` file deploys Mini QR on a custom bridge network. The
application container is not published directly. The Nginx container proxies
requests to it and publishes port 3017.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mini-qr/docker-compose.yml
[nginx-proxy.conf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mini-qr/nginx-proxy.conf
