---
title: "watchtower.info"
description:
  "Rol Watchtower uit om Docker-containers automatisch bij te werken. Met de
  configuratie van een eigen Docker-netwerk en de service Watchtower, voor een
  goede en veilige werking."
url: "docker/compose-info/watchtower"
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
  - Portainer
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Portainer
  - Docker Compose
  - Container Management
  - Docker Network
  - Portainer Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Portainer Service

weight: 4127

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt een service in en rolt die uit met Docker Compose; het zet Watchtower op
om Docker-containers automatisch bij te werken.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `watchtower`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: dit bestand stelt een eigen Docker-netwerk en een service
  Watchtower in om containers automatisch bij te werken. Het bevat uitgebreide
  netwerkinstellingen en serviceconfiguraties, zodat Watchtower soepel en veilig
  draait.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: watchtower

networks:
  watchtower_net:
    attachable: false
    internal: false
    external: false
    name: watchtower
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.2.0/24
          ip_range: 172.20.2.0/24
          gateway: 172.20.2.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "watchtower"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.watchtower.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `watchtower_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk is niet extern gedefinieerd, maar wordt in
  dit Compose-bestand gemaakt.
- **name: watchtower**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "watchtower"**: geeft het bridge-netwerk
    een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.watchtower.network.description**: een label met een beschrijving van
    het netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  watchtower_app:
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
    container_name: watchtower
    image: ghcr.io/nicholas-fedor/watchtower:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    command: ["--schedule", "0 0 * * * *", "--cleanup", "--debug"]
    hostname: watchtower
    networks:
      watchtower_net:
        ipv4_address: 172.20.2.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.watchtower.description:
        "a container-based solution for automating Docker container base image
        updates."
    healthcheck:
      disable: false
      test: ["CMD", "/watchtower", "--health-check"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **watchtower_app**: de naam van de service voor de container van Watchtower.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: zorgt dat de container na een fout altijd opnieuw
    start.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt de grootte van een logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: watchtower**: geeft de container de naam "watchtower".
  - **image: ghcr.io/nicholas-fedor/watchtower**: gebruikt de image van
    Watchtower van de onderhouden fork `nicholas-fedor`. Het oorspronkelijke
    project `containrrr/watchtower` is gearchiveerd.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/var/run/docker.sock:/var/run/docker.sock**: koppelt de Docker-socket,
      zodat Watchtower met de Docker-daemon kan communiceren.
  - **environment**: stelt omgevingsvariabelen in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **command**: start Watchtower met bepaalde opties.
    - **--schedule "0 0 \* \* \* \*"**: laat Watchtower elk uur op updates
      controleren.
    - **--cleanup**: verwijdert oude images na het bijwerken.
    - **--debug**: zet de debugmodus aan voor uitgebreidere logs.
  - **hostname: watchtower**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `watchtower_net`.
    - **ipv4_address: 172.20.2.2**: geeft de container een vast IP-adres.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.watchtower.description**: label met een beschrijving van Watchtower.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check. Hier is dat
      `["CMD", "/watchtower", "--health-check"]`.
    - **interval**: de tijd tussen twee health checks (10 seconden).
    - **timeout**: de tijd die een health check mag duren voordat die als
      mislukt geldt (5 seconden).
    - **retries**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt (3 pogingen).
    - **start_period**: de beginperiode waarin een mislukte health check niet
      meetelt voor de pogingen (10 seconden).
    - **start_interval**: de tijd tussen health checks tijdens het opstarten (5
      seconden).

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaardtoegang {#default-access}

Watchtower heeft geen webinterface. Volg in de logs wat het doet:

```bash
docker logs watchtower
```

## Standaard inloggegevens {#default-login-credentials}

Watchtower heeft geen login.

## Conclusie {#conclusion}

Dit Compose-bestand zet een degelijke Docker-omgeving op voor Watchtower, een
hulpmiddel om Docker-containers automatisch bij te werken. Het maakt een eigen
bridge-netwerk met vaste IP-instellingen en beveiligingsinstellingen. De service
Watchtower bewaakt Docker-containers en werkt ze volgens een vast schema bij,
met blijvende opslag en verschillende netwerk- en beveiligingsopties. De
configuratie zorgt dat Watchtower continu draait, na een fout opnieuw start en
efficiënt logt.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/watchtower/compose.yml
