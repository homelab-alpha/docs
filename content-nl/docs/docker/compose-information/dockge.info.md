---
title: "dockge.info"
description:
  "Rol Dockge uit, een gebruiksvriendelijke interface die je zelf host om stacks
  van Docker Compose te beheren. Met eigen Docker-netwerkinstellingen, de
  configuratie van de service en beveiligingsmaatregelen voor een efficiënte en
  veilige werking."
url: "docker/compose-info/dockge"
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
  - Dockge
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - Dockge
  - Docker Compose
  - Container Management
  - Docker Network
  - Dockge Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Infrastructure Monitoring
  - Self-hosted Docker Management

weight: 4103

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om Dockge uit te
rollen, een gebruiksvriendelijke interface om stacks van Docker Compose te
beheren.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `dockge`, ingesteld met `name:` op het hoogste niveau van het
  bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service Dockge in om stacks
  van Docker Compose te beheren.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: dockge

networks:
  dockge_net:
    attachable: false
    internal: false
    external: false
    name: dockge
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.7.0/24
          ip_range: 172.20.7.0/24
          gateway: 172.20.7.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "dockge"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.dockge.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `dockge_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: dockge**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "dockge"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.dockge.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  dockge_app:
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
    container_name: dockge
    image: docker.io/louislam/dockge:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/dockge/production/app/data:/app/data
      - /docker/dockge/production/app/stacks:/opt/stacks
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      DOCKGE_STACKS_DIR: /opt/stacks
    domainname: dockge.local # Customize this with your own domain, e.g., `dockge.local` to `dockge.your-fqdn-here.com`.
    hostname: dockge
    networks:
      dockge_net:
        ipv4_address: 172.20.7.2
    ports:
      - "3005:5001/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.dockge.description:
        "a fancy, easy-to-use and reactive self-hosted docker compose.yml stack."
    healthcheck:
      disable: false
      test: ["CMD", "extra/healthcheck"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **dockge_app**: de naam van de service voor de container van Dockge.
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
  - **container_name: dockge**: geeft de container de naam "dockge".
  - **image: docker.io/louislam/dockge**: gebruikt de image van Dockge.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/dockge/production/app/data:/app/data**: koppelt de gegevensmap
      van de app.
    - **/docker/dockge/production/app/stacks:/opt/stacks**: koppelt de map met
      stacks.
    - **/var/run/docker.sock:/var/run/docker.sock**: koppelt de Docker-socket.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **DOCKGE_STACKS_DIR: /opt/stacks**: stelt de map met stacks in.
  - **domainname: dockge.local**: stelt de domeinnaam van de container in.
  - **hostname: dockge**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `dockge_net`.
    - **ipv4_address: 172.20.7.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **3005:5001/tcp**: koppelt de HTTP-poort.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.dockge.description**: label met een beschrijving van Dockge.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check. Hier is dat
      `extra/healthcheck`.
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

## Standaard webtoegang {#default-web-access}

Open de webinterface van Dockge via deze URL:

```bash
http://your-ip-address:3005
```

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
Bij het eerste bezoek vraagt Dockge je het beheerdersaccount te maken.
{{% /alert %}}

**Gebruikersnaam**: gemaakt tijdens de installatie

**Wachtwoord**: gemaakt tijdens de installatie

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om tijdens de installatie een sterke
gebruikersnaam en een sterk wachtwoord te maken.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een Docker-omgeving op voor Dockge, een mooie,
gebruiksvriendelijke en reactieve beheerder voor stacks van Docker Compose die
je zelf host. De configuratie definieert een eigen bridge-netwerk met vaste
IP-instellingen en beveiligingsinstellingen. De service Dockge draait continu,
met blijvende opslag voor de gegevens van de toepassing en de stacks van Docker
Compose. De opzet zorgt dat Dockge efficiënt en veilig draait, met passende
logging en een passend herstartbeleid, en is zo een uitstekend hulpmiddel om
stacks van Docker Compose te beheren.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/dockge/compose.yml
