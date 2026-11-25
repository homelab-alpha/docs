---
title: "it-tools.info"
description:
  "Rol IT-Tools uit met Docker Compose, een verzameling handige online
  hulpmiddelen voor ontwikkelaars. Deze gids behandelt een eigen netwerk, de
  configuratie van de service, beveiligingsopties en het koppelen van poorten
  voor eenvoudige toegang en een betrouwbare werking."
url: "docker/compose-info/it-tools"
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
  - IT-Tools
  - Docker
  - Docker Compose
  - Developer Tools
  - DevOps
  - Networking
  - Containers
  - Productivity
keywords:
  - it-tools
  - docker-compose
  - developer tools
  - online tools
  - containerized apps
  - docker network
  - security options
  - devops tools
  - productivity tools
  - container deployment

weight: 4109

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om IT-Tools uit
te rollen, een verzameling handige online hulpmiddelen voor ontwikkelaars, met
de netwerk- en beveiligingsconfiguratie.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `it-tools`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: opzet met Docker Compose voor IT-Tools, een verzameling
  online hulpmiddelen voor ontwikkelaars, met netwerk- en
  beveiligingsconfiguratie.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: it-tools

networks:
  it-tools_net:
    attachable: false
    internal: false
    external: false
    name: it-tools
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.22.0/24
          ip_range: 172.20.22.0/24
          gateway: 172.20.22.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "it-tools"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.it-tools.network.description: "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `it-tools_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: it-tools**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "it-tools"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.it-tools.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  it-tools_app:
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
    container_name: it-tools
    image: ghcr.io/corentinth/it-tools:<tag> # The current tag is in the RAW compose.yml.
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
    domainname: tools.local # Customize this with your own domain, e.g., `it-tools.local` to `it-tools.your-fqdn-here.com`.
    hostname: it-tools
    networks:
      it-tools_net:
        ipv4_address: 172.20.22.3
    ports:
      - "3014:80/tcp" # HTTP
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
      com.it-tools.description:
        "A collection of handy online tools for developers, with great UX."
    healthcheck:
      disable: true
```

- **services**: definieert de services die worden uitgerold.
- **it-tools_app**: de naam van de service voor de container van it-tools.
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
  - **container_name: it-tools**: geeft de container de naam "it-tools".
  - **image: ghcr.io/corentinth/it-tools**: gebruikt de image van it-tools.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **read_only: true**: koppelt het root-bestandssysteem van de container
    alleen-lezen.
  - **tmpfs**: koppelt `/var/cache/nginx`, `/var/run` en `/tmp` als
    bestandssystemen in het geheugen, zodat de app er toch haar runtimebestanden
    kan schrijven.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **domainname: tools.local**: stelt de domeinnaam van de container in.
  - **hostname: it-tools**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `it-tools_net`.
    - **ipv4_address: 172.20.22.3**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **3014:80/tcp**: koppelt de HTTP-poort (TCP).
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges\:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **cap_drop: ALL**: laat alle Linux-capabilities vallen.
  - **cap_add**: voegt alleen terug wat nginx nodig heeft: `CHOWN`,
    `DAC_OVERRIDE`, `NET_BIND_SERVICE`, `SETGID` en `SETUID`. Daarmee kan het
    poort 80 gebruiken en naar de gebruiker `nginx` wisselen.
  - **labels**: metadata van de container.
    - **com.it-tools.description**: label met een beschrijving van it-tools.
  - **healthcheck**: configuratie van de health check.
    - **disable: true**: zet health checks voor de container uit.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van IT Tools via deze URL:

```bash
http://your-ip-address:3014
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**: er is geen wachtwoord nodig.

## Conclusie {#conclusion}

Dit Compose-bestand zet een Docker-omgeving op voor IT-Tools, een verzameling
handige online hulpmiddelen voor ontwikkelaars. De configuratie definieert een
eigen bridge-netwerk met vaste IP-instellingen en beveiligingsinstellingen. De
service `it-tools` draait continu, met passende logging en een passend
herstartbeleid, zodat die efficiënt en veilig draait.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/it-tools/compose.yml
