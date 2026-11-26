---
title: "mini-qr.info"
description:
  "Dit bestand rolt Mini QR uit, een aanpasbare QR-codegenerator, achter een
  reverse proxy met Nginx."
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

weight: 4112

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het rolt Mini QR
uit, een aanpasbare QR-codegenerator, achter een reverse proxy met Nginx.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `mini-qr`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service Mini QR in.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-configuratiebestand van Nginx**: [nginx-proxy.conf]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: mini-qr

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

- **networks**: definieert het eigen netwerk `mini-qr_net`.
- **attachable: false**: andere containers kunnen zich niet aan dit netwerk
  koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt.
- **name: mini-qr**: geeft de naam van het netwerk.
- **driver: bridge**: gebruikt het stuurprogramma bridge voor een afgeschermd
  netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **subnet**: `172.20.26.0/24`.
  - **ip_range**: `172.20.26.0/24`.
  - **gateway**: `172.20.26.1`.
- **driver_opts**: extra opties voor het netwerkstuurprogramma.
  - **com.docker.network.bridge.default_bridge: "false"**: geeft aan dat dit
    niet de standaardbridge van Docker is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: laat uitgaand
    verkeer eruitzien alsof het van de host komt.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt de
    bridge aan alle beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "mini-qr"**: geeft de bridge-interface op
    de host een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **label met beschrijving**: beschrijft het netwerk als een afgeschermd
    bridge-netwerk.

## Configuratie van de services {#services-configuration}

### `mini-qr_app`

```yaml
services:
  mini-qr_app:
    deploy:
      resources:
        limits:
          pids: 512 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: mini-qr
    image: ghcr.io/lyqht/mini-qr:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    read_only: true # Read-only root file system; nginx writes only to the tmpfs paths below.
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
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
    deploy:
      resources:
        limits:
          pids: 512 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: mini-qr_nginx
    image: docker.io/nginx:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    read_only: true # Read-only root file system; nginx writes only to the tmpfs paths below.
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
    depends_on:
      mini-qr_app:
        condition: service_started
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
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add: # The minimum for nginx: bind port 80 and switch to the nginx user.
      - CHOWN
      - DAC_OVERRIDE
      - NET_BIND_SERVICE
      - SETGID
      - SETUID
    labels:
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

- **mini-qr_app**: de definitie van de service.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: mini-qr**: geeft de container een naam.
  - **image: ghcr.io/lyqht/mini-qr**: gebruikt deze image.
  - **pull_policy: if_not_present**: haalt de image alleen op als die niet
    lokaal aanwezig is.
  - **read_only: true**: koppelt het root-bestandssysteem van de container
    alleen-lezen.
  - **tmpfs**: koppelt `/var/cache/nginx`, `/var/run` en `/tmp` als
    bestandssystemen in het geheugen, zodat de app er toch haar runtimebestanden
    kan schrijven.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: 1000**: de gebruikers-ID waarmee de container draait.
    - **PGID: 1000**: de groeps-ID waarmee de container draait.
    - **TZ: Europe/Amsterdam**: stel de tijdzone in op je eigen tijdzone. De
      volledige lijst met tijdzones vind je hier:
      https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
  - **hostname: mini-qr**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan `mini-qr_net` met het vaste IP-adres
    `172.20.26.2`.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container nieuwe
    rechten krijgt.
  - **labels**: een label met een beschrijving.
  - **healthcheck: disable: true**: de health check staat uit voor deze
    container.

- **mini-qr_nginx**: de reverse proxy met nginx voor de app Mini QR.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: mini-qr_nginx**: geeft de container een naam.
  - **image: docker.io/nginx**: gebruikt de image van nginx.
  - **pull_policy: if_not_present**: haalt de image alleen op als die niet
    lokaal aanwezig is.
  - **read_only: true**: koppelt het root-bestandssysteem van de container
    alleen-lezen.
  - **tmpfs**: koppelt `/var/cache/nginx`, `/var/run` en `/tmp` als
    bestandssystemen in het geheugen, zodat de app er toch haar runtimebestanden
    kan schrijven.
  - **depends_on**: start deze service pas nadat `mini-qr_app` is gestart.
  - **volumes**: koppelt `nginx-proxy.conf` als `/etc/nginx/nginx.conf`.
  - **environment**: stelt de gebruikers- en groeps-ID en de tijdzone in.
  - **domainname: mini-qr.local**: stelt de domeinnaam van de container in.
  - **hostname: mini-qr-nginx**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan `mini-qr_net` met het vaste IP-adres
    `172.20.26.3`.
  - **ports: 3017:80/tcp**: publiceert de webinterface op poort 3017 van de
    host.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container extra
    rechten krijgt.
  - **cap_drop: ALL**: laat alle Linux-capabilities vallen.
  - **cap_add**: voegt alleen terug wat nginx nodig heeft: `CHOWN`,
    `DAC_OVERRIDE`, `NET_BIND_SERVICE`, `SETGID` en `SETUID`. Daarmee kan het
    poort 80 gebruiken en naar de gebruiker `nginx` wisselen.
  - **labels**: een label met een beschrijving.
  - **healthcheck: disable: true**: de health check staat uit voor deze
    container.

## Configuratie van Nginx {#nginx-configuration}

Het bestand `nginx-proxy.conf` wordt in de Nginx-container gekoppeld als
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

Het bestand bestaat uit deze onderdelen:

- **Basis**
- **Logging**
- **Compressie**
- **Standaardwaarden van de proxy (DRY)**
- **Upstream**
- **Server**

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Kopieer `nginx-proxy.conf` naar `/docker/mini-qr/nginx-proxy.conf`. Docker
   maakt de andere mappen onder `/docker/mini-qr/` bij de eerste start.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Mini QR via deze URL:

```bash
http://your-ip-address:3017
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**: er is geen wachtwoord nodig.

## Conclusie {#conclusion}

Dit Compose-bestand rolt Mini QR uit op een eigen bridge-netwerk. De container
van de toepassing wordt niet direct gepubliceerd. De Nginx-container stuurt
verzoeken door naar de toepassing en publiceert poort 3017.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/mini-qr/compose.yml
[nginx-proxy.conf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/mini-qr/nginx-proxy.conf
