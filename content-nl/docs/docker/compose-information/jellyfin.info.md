---
title: "jellyfin.info"
description:
  "Rol de mediaserver Jellyfin uit. Met uitgebreide instructies om een eigen
  Docker-netwerk en de service Jellyfin in te stellen, voor een soepel en veilig
  beheer en streamen van media."
url: "docker/compose-info/jellyfin"
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

weight: 4110

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt een mediaserver met Jellyfin in en rolt die uit met Docker Compose, voor
een soepel beheer en streamen van media.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `jellyfin`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: dit bestand stelt een eigen Docker-netwerk en een service
  Jellyfin in om media te beheren en te streamen. Het bevat uitgebreide
  netwerkinstellingen en serviceconfiguraties, zodat Jellyfin soepel en veilig
  draait.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: jellyfin

networks:
  jellyfin_net:
    attachable: false
    internal: false
    external: false
    name: jellyfin
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.5.0/24
          ip_range: 172.20.5.0/24
          gateway: 172.20.5.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "jellyfin"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.jellyfin.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `jellyfin_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk is niet extern gedefinieerd, maar wordt in
  dit Compose-bestand gemaakt.
- **name: jellyfin**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "jellyfin"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.jellyfin.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  jellyfin_app:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: jellyfin
    image: ghcr.io/jellyfin/jellyfin:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/jellyfin/production/app:/config
      - /docker/jellyfin/production/app/cache:/cache
      - /docker/media:/media:ro
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      JELLYFIN_PublishedServerUrl: "https://jellyfin.local" # Customize this with your own domain, e.g., `jellyfin.local` to `jellyfin.your-fqdn-here.com`.
    domainname: jellyfin.local # Customize this with your own domain, e.g., `jellyfin.local` to `jellyfin.your-fqdn-here.com`.
    hostname: jellyfin
    extra_hosts:
      host.docker.internal: "host-gateway"
    networks:
      jellyfin_net:
        ipv4_address: 172.20.5.2
    ports:
      - "8096:8096/tcp" # HTTP
      - "8920:8920/tcp" # HTTPS
    devices:
      - /dev/dri:/dev/dri
      - /dev/dri/renderD128:/dev/dri/renderD128
    security_opt:
      - no-new-privileges:true
    labels:
      com.jellyfin.description:
        "is a free software media system that puts you in control of managing
        and streaming your media."
    healthcheck:
      disable: false
      test:
        [
          "CMD",
          "curl",
          "--noproxy",
          "localhost",
          "-Lk",
          "-fsS",
          "http://localhost:8096/health",
        ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **jellyfin_app**: de naam van de service voor de container van Jellyfin.
  - **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
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
  - **container_name: jellyfin**: geeft de container de naam "jellyfin".
  - **image: ghcr.io/jellyfin/jellyfin**: gebruikt de image van Jellyfin.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/jellyfin/production/app:/config**: bewaart de
      configuratiegegevens van Jellyfin.
    - **/docker/jellyfin/production/app/cache:/cache**: bewaart de cachegegevens
      van Jellyfin.
    - **/docker/media:/media:ro**: koppelt de mediamap alleen-lezen.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in voor de rechten.
    - **PGID: "1000"**: stelt de groeps-ID in voor de rechten.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **JELLYFIN_PublishedServerUrl: "<https://jellyfin.local>"**: stelt de
      server-URL van Jellyfin in.
  - **domainname: jellyfin.local**: stelt de domeinnaam van de container in.
  - **hostname: jellyfin**: stelt de hostnaam van de container in.
  - **extra_hosts**: voegt items toe aan het bestand `/etc/hosts` van de
    container.
    - **host.docker.internal: "host-gateway"**: koppelt de gateway van de host.
  - **networks**: koppelt de service aan het netwerk `jellyfin_net`.
    - **ipv4_address: 172.20.5.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de host aan poorten van de container.
    - **"8096:8096/tcp"**: koppelt TCP-poort 8096 op de host aan poort 8096 in
      de container.
    - **"8920:8920/tcp"**: koppelt TCP-poort 8920 op de host aan poort 8920 in
      de container.
  - **devices**: voegt apparaten van de host toe aan de container.
    - **/dev/dri:/dev/dri**: voegt het Direct Rendering Infrastructure-apparaat
      van de host toe.
    - **/dev/dri/renderD128:/dev/dri/renderD128**: voegt het renderapparaat van
      de host toe.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges: true**: voorkomt dat de container extra rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.jellyfin.description**: label met een beschrijving van Jellyfin.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check. Hier is dat
      `["CMD", "curl", "--noproxy", "localhost", "-Lk", "-fsS", "http://localhost:8096/health"]`.
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

1. Zet je media in `/docker/media`. De stack koppelt die map in de container.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Jellyfin via deze URL:

**HTTP**:

```bash
http://your-ip-address:8096
```

**HTTPS (als dat is ingesteld)**:

```bash
https://your-ip-address:8920
```

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
Bij het eerste bezoek maakt de installatiewizard het beheerdersaccount en vraagt
die naar je mediabibliotheken.
{{% /alert %}}

**Gebruikersnaam**: gemaakt tijdens de installatie

**Wachtwoord**: gemaakt tijdens de installatie

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om tijdens de installatie een sterke
gebruikersnaam en een sterk wachtwoord te maken.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een degelijke Docker-omgeving op voor Jellyfin, een
systeem om media te beheren en te streamen. Het maakt een eigen bridge-netwerk
met vaste IP-instellingen en beveiligingsinstellingen. De service Jellyfin heeft
blijvende opslag, toegang tot de mediamappen en verschillende netwerk- en
beveiligingsopties. De configuratie zorgt dat Jellyfin continu draait, na een
fout opnieuw start en efficiënt logt.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/jellyfin/compose.yml
