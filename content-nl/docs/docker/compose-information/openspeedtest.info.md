---
title: "openspeedtest.info"
description:
  "Rol OpenSpeedTest uit, een server om de netwerksnelheid te testen. Met eigen
  Docker-netwerkinstellingen, de configuratie van de service en
  beveiligingsmaatregelen voor een betrouwbare en veilige werking."
url: "docker/compose-info/openspeedtest"
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
  - OpenSpeedTest
  - Docker Compose
  - Network Testing
  - Infrastructure Management
keywords:
  - Docker
  - OpenSpeedTest
  - Docker Compose
  - Container Management
  - Docker Network
  - OpenSpeedTest Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Network Speed Test
  - Infrastructure Monitoring

weight: 4116

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het bestand `compose.yml` voor OpenSpeedTest bekijken, dat een
Docker-omgeving opzet voor een server om de netwerksnelheid te testen.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `openspeedtest`, ingesteld met `name:` op het hoogste niveau
  van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: dit bestand stelt een eigen Docker-netwerk en een service
  OpenSpeedTest in, met uitgebreide netwerkinstellingen en serviceconfiguraties
  voor een betrouwbare en veilige werking.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: openspeedtest

networks:
  openspeedtest_net:
    attachable: false
    internal: false
    external: false
    name: openspeedtest
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.10.0/24
          ip_range: 172.20.10.0/24
          gateway: 172.20.10.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "openspeedtest"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.openspeedtest.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `openspeedtest_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk is niet extern gedefinieerd, maar wordt in
  dit Compose-bestand gemaakt.
- **name: openspeedtest**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "openspeedtest"**: geeft het
    bridge-netwerk een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.openspeedtest.network.description**: een label met een beschrijving
    van het netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  openspeedtest_app:
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
    container_name: openspeedtest
    image: docker.io/openspeedtest/latest:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    read_only: true # Read-only root file system; nginx writes only to the tmpfs paths below.
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
    volumes:
      - /docker/openspeedtest/production/config/nginx.conf:/etc/nginx.conf
      - /docker/openspeedtest/production/config/OpenSpeedTest-Server.conf:/etc/nginx/conf.d/OpenSpeedTest-Server.conf
      - /docker/openspeedtest/production/log:/var/log/letsencrypt
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      ENABLE_LETSENCRYPT: false
      DOMAIN_NAME: speedtest.local # Customize this with your own domain, e.g., `openspeedtest.local` to `openspeedtest.your-fqdn-here.com`.
      # USER_EMAIL: info@example.com
    domainname: openspeedtest.local # Customize this with your own domain, e.g., `openspeedtest.local` to `openspeedtest.your-fqdn-here.com`.
    hostname: openspeedtest
    networks:
      openspeedtest_net:
        ipv4_address: 172.20.10.2
    ports:
      - "3009:3000/tcp" # HTTP
      - "3010:3001/tcp" # HTTPS
    security_opt:
      - no-new-privileges:true
    labels:
      com.openspeedtest.description:
        "is a Free and Open-Source HTML5 Network Speed Test Software."
    healthcheck:
      disable: true
```

- **services**: definieert de services die worden uitgerold.
- **openspeedtest_app**: de naam van de service voor de container van
  OpenSpeedTest.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: zorgt dat de container opnieuw start, tenzij
    die uitdrukkelijk is gestopt.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt de grootte van een logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: openspeedtest**: geeft de container de naam
    "openspeedtest".
  - **image: docker.io/openspeedtest/latest**: gebruikt de image van
    OpenSpeedTest.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **read_only: true**: koppelt het root-bestandssysteem van de container
    alleen-lezen.
  - **tmpfs**: koppelt `/var/cache/nginx`, `/var/run` en `/tmp` als
    bestandssystemen in het geheugen, zodat de app er toch haar runtimebestanden
    kan schrijven.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/openspeedtest/production/config/nginx.conf:/etc/nginx.conf**:
      koppelt het configuratiebestand van Nginx.
    - **/docker/openspeedtest/production/config/OpenSpeedTest-Server.conf:/etc/nginx/conf.d/OpenSpeedTest-Server.conf**:
      koppelt het configuratiebestand van de OpenSpeedTest-server.
    - **/docker/openspeedtest/production/log:/var/log/letsencrypt**: koppelt de
      logmap.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **ENABLE_LETSENCRYPT: false**: zet Let's Encrypt uit.
    - **DOMAIN_NAME: speedtest.local**: stelt de domeinnaam van de service in.
  - **domainname: openspeedtest.local**: stelt de domeinnaam van de container
    in.
  - **hostname: openspeedtest**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `openspeedtest_net`.
    - **ipv4_address: 172.20.10.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **3009:3000/tcp**: koppelt HTTP-poort 3000 aan poort 3009 van de host.
    - **3010:3001/tcp**: koppelt HTTPS-poort 3001 aan poort 3010 van de host.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.openspeedtest.description**: label met een beschrijving van
      OpenSpeedTest.
  - **healthcheck**: configuratie van de health check.
    - **disable: true**: zet health checks voor de container uit.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Kopieer `nginx.conf` naar
   `/docker/openspeedtest/production/config/nginx.conf`. Kopieer
   `OpenSpeedTest-Server.conf` naar
   `/docker/openspeedtest/production/config/OpenSpeedTest-Server.conf`. Docker
   maakt de andere mappen onder `/docker/openspeedtest/` bij de eerste start.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van OpenSpeedTest via deze URL:

**HTTP**:

```bash
http://your-ip-address:3009
```

**HTTPS**:

```bash
https://your-ip-address:3010
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**: er is geen wachtwoord nodig.

## Conclusie {#conclusion}

Dit Compose-bestand zet een degelijke Docker-omgeving op voor OpenSpeedTest,
gratis opensourcesoftware in HTML5 om de netwerksnelheid te testen. Het maakt
een eigen bridge-netwerk met vaste IP-instellingen en beveiligingsinstellingen.
De service OpenSpeedTest draait continu, met blijvende opslag voor de
configuratie en de logs, en met opties om HTTPS met Let's Encrypt aan te zetten.
De configuratie zorgt dat OpenSpeedTest efficiënt en veilig draait, met passende
logging en een passend herstartbeleid.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/openspeedtest/compose.yml
