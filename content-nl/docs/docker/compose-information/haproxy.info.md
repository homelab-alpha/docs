---
title: "haproxy.info"
description:
  "Rol HAProxy uit met Docker Compose, een snelle load balancer voor TCP/HTTP.
  Deze gids behandelt een eigen netwerk, de configuratie van de service, het
  koppelen van volumes voor SSL-certificaten en aanbevolen
  beveiligingswerkwijzen voor betrouwbare en efficiënte load balancing."
url: "docker/compose-info/haproxy"
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
  - HAProxy
  - Docker
  - Docker Compose
  - Load Balancer
  - TCP Load Balancer
  - HTTP Load Balancer
  - Networking
  - DevOps
  - Containerization
keywords:
  - haproxy
  - docker-compose
  - load balancing
  - tcp load balancer
  - http load balancer
  - container network
  - ssl certificates
  - docker volumes
  - high availability
  - devops

weight: 4106

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om HAProxy uit te
rollen, een betrouwbare, snelle load balancer voor TCP/HTTP.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `haproxy`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: opzet met Docker Compose voor load balancing met HAProxy,
  met SSL en netwerkbeheer.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: haproxy

networks:
  haproxy_net:
    attachable: true
    internal: false
    external: false
    name: haproxy
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.21.0/24
          ip_range: 172.20.21.0/24
          gateway: 172.20.21.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "haproxy"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.haproxy.network.description: "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `haproxy_net`.
- **attachable**: staat op `true`: andere containers kunnen zich aan dit netwerk
  koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: haproxy**: geeft de naam van het netwerk.
- **driver: bridge**: gebruikt het stuurprogramma bridge voor een afgeschermd
  netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **driver: default**: gebruikt het standaardstuurprogramma voor IPAM.
  - **config**: stelt de configuratie van de IP-adressen in.
    - **subnet**: definieert het subnet van het netwerk.
    - **ip_range**: beperkt het IP-bereik binnen het subnet.
    - **gateway**: stelt de gateway van het netwerk in.
- **driver_opts**: extra opties voor het netwerkstuurprogramma.
  - **com.docker.network.bridge.default_bridge: "false"**: geeft aan dat dit
    niet de standaardbridge van Docker is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: laat uitgaand
    verkeer eruitzien alsof het van de host komt.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt de
    bridge aan alle beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "haproxy"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.haproxy.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  haproxy_app:
    deploy:
      resources:
        limits:
          pids: 512 # Limits the number of processes and threads (fork bomb protection).
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: haproxy
    image: docker.io/haproxytech/haproxy-ubuntu:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/haproxy/production/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg
      - /docker/haproxy/production/certs:/certs
      - /etc/letsencrypt:/etc/letsencrypt
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: haproxy.local # Customize this with your own domain, e.g., `haproxy.local` to `haproxy.your-fqdn-here.com`.
    hostname: haproxy
    networks:
      haproxy_net:
        ipv4_address: 172.20.21.2
    dns:
      # Defines custom DNS servers to set on the container network interface configuration.
      # It can be a single value or a list.
      # Recommended: Quad9 for Malware Blocking, DNSSEC Validation, and Privacy.
      - 9.9.9.9 # Primary DNS server   (Quad9 - Security & Privacy)
      - 149.112.112.112 # Secondary DNS server (Quad9 - Redundant)
    ports:
      - "80:80/tcp" # HTTP
      - "443:443/tcp" # HTTPS
      - "443:443/udp" # HTTPS
      - "8404:8404/tcp" # Statistics Report
    security_opt:
      - no-new-privileges:true
    labels:
      com.haproxy.description:
        "the reliable, high performance tcp/http load balancer."
    healthcheck:
      disable: false
```

- **services**: definieert de services die worden uitgerold.
- **haproxy_app**: de naam van de service voor de container van HAProxy.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: zorgt dat de container altijd opnieuw start als die
    stopt.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt de grootte van een logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: haproxy**: geeft de container de naam "haproxy".
  - **image: docker.io/haproxytech/haproxy-ubuntu**: gebruikt de officiële
    Ubuntu-image van HAProxy.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/haproxy/production/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg**:
      koppelt het configuratiebestand van HAProxy in de container.
    - **/docker/haproxy/production/certs\:/certs**: koppelt de SSL-certificaten.
    - **/etc/letsencrypt:/etc/letsencrypt**: koppelt de certificaten van Let's
      Encrypt.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **domainname: haproxy.local**: stelt de domeinnaam van de container in.
  - **hostname: haproxy**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `haproxy_net`.
    - **ipv4_address: 172.20.21.2**: geeft de container een vast IP-adres.
  - **dns**: stelt eigen DNS-servers in voor de container.
    - **9.9.9.9**: primaire DNS-server (Quad9).
    - **149.112.112.112**: secundaire DNS-server (Quad9).
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **80:80/tcp**: koppelt de HTTP-poort (TCP).
    - **443:443/tcp**: koppelt de HTTPS-poort (TCP).
    - **443:443/udp**: koppelt de HTTPS-poort (UDP).
    - **8404:8404/tcp**: koppelt de poort voor het statistiekenrapport (TCP).
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges\:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.haproxy.description**: label met een beschrijving van HAProxy.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Kopieer `haproxy.cfg` naar `/docker/haproxy/production/haproxy.cfg`. Docker
   maakt de andere mappen onder `/docker/haproxy/` bij de eerste start.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaardtoegang {#default-access}

HAProxy heeft geen webinterface. De frontend `main` in `haproxy.cfg` luistert op
poort 80:

```bash
http://your-ip-address:80
```

Poort 8404 wordt ook gepubliceerd, maar `haproxy.cfg` definieert er geen
statistiekenpagina op.

## Standaard inloggegevens {#default-login-credentials}

HAProxy heeft geen login. Stel de frontends en backends in `haproxy.cfg` in.

## Conclusie {#conclusion}

Dit bestand `compose.yml` zet een Docker-omgeving op voor HAProxy, een
betrouwbare, snelle load balancer voor TCP/HTTP. De configuratie definieert een
eigen bridge-netwerk met vaste IP-instellingen en beveiligingsinstellingen. De
service HAProxy start altijd opnieuw, leest de configuratie en de
SSL-certificaten van de host, gebruikt Quad9 als DNS-servers en publiceert de
poorten 80, 443 en 8404, met beperkte logging.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/haproxy/compose.yml
