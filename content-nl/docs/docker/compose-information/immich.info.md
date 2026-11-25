---
title: "immich.info"
description:
  "Uitgebreide opzet met Docker Compose voor Immich, een oplossing die je zelf
  host om foto's en video's te beheren, met PostgreSQL, caching met Redis en
  services voor machine learning, voor betere automatisering van media en
  controle met privacy voorop."
url: "docker/compose-info/immich"
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
  - Immich
  - Docker Compose
  - Self-Hosted
  - Photo Management
  - Video Management
  - PostgreSQL
  - Redis
  - Machine Learning
  - Media Automation
  - Privacy
keywords:
  - immich docker compose
  - self-hosted photo manager
  - video management solution
  - docker postgres redis immich
  - immich machine learning
  - homelab photo server
  - media automation docker
  - immich privacy control
  - docker compose example
  - immich deployment

weight: 4108

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om Immich uit te
rollen, een oplossing die je zelf host om foto's en video's te beheren, samen
met de ondersteunende services: MariaDB voor het databasebeheer, Redis voor
caching en een onderdeel voor machine learning voor betere automatisering van
media.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `immich`, ingesteld met `name:` op het hoogste niveau van het
  bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: configuratie van Docker Compose voor Immich met PostgreSQL,
  Redis en services voor machine learning, om media zelf te hosten en te
  beheren.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-bestand .env**: [.env]
- **RAW-bestand stack.env**: [stack.env]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: immich

networks:
  immich_net:
    attachable: false
    internal: false
    external: false
    name: immich
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.24.0/24
          ip_range: 172.20.24.0/24
          gateway: 172.20.24.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "immich"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.immich.network.description: "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `immich_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: immich**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "immich"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.immich.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  immich_db:
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
    container_name: immich_db
    image: ghcr.io/immich-app/postgres:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/immich/production/db:/var/lib/postgresql/data
    env_file:
      # Compose loads each file that exists and skips a missing one:
      # '.env' for the Docker Compose CLI, 'stack.env' for Portainer.
      - path: .env
        required: false
      - path: stack.env
        required: false
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      POSTGRES_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_DB: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_INITDB_ARGS: "--data-checksums"
      # DB_STORAGE_TYPE: "HDD" # Uncomment if using HDD storage
    hostname: database # DO NOT MODIFY – Essential for Immich stack functionality.
    networks:
      immich_net:
        ipv4_address: 172.20.24.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.db.description: "is a PostgreSQL database."
    healthcheck:
      disable: false
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  immich_redis:
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
    container_name: immich_redis
    image: docker.io/valkey/valkey:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/immich/production/redis:/data
      - /docker/immich/production/redis:/usr/local/etc/redis/redis.conf
      - /docker/immich/production/redis:/var/lib/redis
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    hostname: redis # DO NOT MODIFY – Essential for Immich stack functionality.
    networks:
      immich_net:
        ipv4_address: 172.20.24.3
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.redis.description: "is a redis database."
    healthcheck:
      disable: false
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  immich_ml:
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
    container_name: immich_ml
    image: ghcr.io/immich-app/immich-machine-learning:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/immich/production/ml:/cache
    env_file:
      # Compose loads each file that exists and skips a missing one:
      # '.env' for the Docker Compose CLI, 'stack.env' for Portainer.
      - path: .env
        required: false
      - path: stack.env
        required: false
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    hostname: immich-machine-learning # DO NOT MODIFY – Essential for Immich stack functionality.
    networks:
      immich_net:
        ipv4_address: 172.20.24.4
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.ml.description:
        "a machine learning-powered component of immich, designed to enhance
        media management and automation."
    healthcheck:
      disable: false

  immich_app:
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
    container_name: immich
    image: ghcr.io/immich-app/immich-server:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      immich_db:
        condition: service_healthy
        restart: true
      immich_redis:
        condition: service_healthy
      immich_ml:
        condition: service_started
        restart: true
    volumes:
      - /docker/immich/production/app:/data
      - /docker/immich/production/app:/usr/src/app/upload
      - /etc/localtime:/etc/localtime:ro
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: photos.local # Customize this with your own domain, e.g., `photos.local` to `photos.your-fqdn-here.com`
    hostname: photos
    networks:
      immich_net:
        ipv4_address: 172.20.24.5
    ports:
      - "3015:2283/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.description:
        "a self-hosted solution for seamless photo and video management,
        offering privacy and full control."
    healthcheck:
      disable: false
```

- **services**: definieert de services die worden uitgerold.
- **immich_db**: de naam van de service voor de container van de
  PostgreSQL-database.
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
  - **container_name: immich_db**: geeft de container de naam "immich_db".
  - **image**: geeft de image van de PostgreSQL-database op, met een bepaalde
    tag.
    - **ghcr.io/immich-app/postgres**
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen van de host in de container.
    - **/docker/immich/production/db:/var/lib/postgresql/data**: bewaart de
      databasegegevens op de host.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt de omgevingsvariabelen van de PostgreSQL-database in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **POSTGRES_PASSWORD: ${PASSWORD_DB}**: stelt het wachtwoord van de
      database in.
    - **POSTGRES_USER: ${USER_DB}**: stelt de gebruiker van de database in.
    - **POSTGRES_DB: ${NAME_DB}**: stelt de naam van de database in.
    - **POSTGRES_INITDB_ARGS: '--data-checksums'**: zet checksums voor gegevens
      aan bij de initialisatie.
  - **hostname: database**: stelt de hostnaam van de container in. Dit is
    verplicht en **mag niet worden gewijzigd** (standaard: database).
  - **networks**: koppelt de service aan het netwerk `immich_net`.
    - **ipv4_address: 172.20.24.2**: geeft de container een vast IP-adres.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.immich.db.description: "is a PostgreSQL database."**: label met een
      beschrijving van de databasecontainer.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: commando dat controleert of PostgreSQL klaar is.
      - `["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]`
    - **interval: 10s**: de tijd tussen twee health checks.
    - **timeout: 5s**: de tijd die een health check mag duren.
    - **retries: 3**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt.
    - **start_period: 10s**: de beginperiode voordat health checks meetellen.
    - **start_interval: 5s**: de tijd tussen health checks tijdens het
      opstarten.

- **immich_redis**: de naam van de service voor de container van de
  Redis-database.
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
  - **container_name: immich_redis**: geeft de container de naam "immich_redis".
  - **image: docker.io/valkey/valkey**: gebruikt de image van Valkey (een
    key-value store die compatibel is met Redis).
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen van de host in de container.
    - **/docker/immich/production/redis:/data**: bewaart de gegevens van Redis
      op de host.
    - **/docker/immich/production/redis:/usr/local/etc/redis/redis.conf**:
      koppelt het configuratiebestand van Redis.
    - **/docker/immich/production/redis:/var/lib/redis**: koppelt de
      bibliotheekgegevens van Redis.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **hostname: redis**: stelt de hostnaam van de container in. Dit is verplicht
    en **mag niet worden gewijzigd** (standaard: redis).
  - **networks**: koppelt de service aan het netwerk `immich_net`.
    - **ipv4_address: 172.20.24.3**: geeft de container een vast IP-adres.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.immich.redis.description: "is a redis database."**: label met een
      beschrijving van de Redis-container.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: commando dat controleert of Redis beschikbaar is.
      - `["CMD", "redis-cli", "ping"]`
    - **interval: 10s**: de tijd tussen twee health checks.
    - **timeout: 5s**: de tijd die een health check mag duren.
    - **retries: 3**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt.
    - **start_period: 10s**: de beginperiode voordat health checks meetellen.
    - **start_interval: 5s**: de tijd tussen health checks tijdens het
      opstarten.

- **immich_ml**: de naam van de service voor de container van het onderdeel voor
  machine learning.
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
  - **container_name: immich_ml**: geeft de container de naam "immich_ml".
  - **image: ghcr.io/immich-app/immich-machine-learning**: gebruikt de image
    voor machine learning uit de opgegeven repository.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen van de host in de container.
    - **/docker/immich/production/ml:/cache**: koppelt de cachemap.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **hostname: immich-machine-learning**: stelt de hostnaam van de container
    in. Dit is verplicht en **mag niet worden gewijzigd** (standaard:
    immich-machine-learning).
  - **networks**: koppelt de service aan het netwerk `immich_net`.
    - **ipv4_address: 172.20.24.4**: geeft de container een vast IP-adres.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.immich.ml.description**: "a machine learning-powered component of
      immich, designed to enhance media management and automation."
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.

- **immich_app**: de naam van de service voor de container van de toepassing
  Immich.
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
  - **container_name: immich**: geeft de container de naam "immich".
  - **image: ghcr.io/immich-app/immich-server**: gebruikt de serverimage van
    Immich uit de GitHub Container Registry.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **depends_on**: geeft de afhankelijkheden van deze service op.
    - **immich_db**: wacht tot de databaseservice gezond is; start opnieuw.
    - **immich_redis**: wacht tot de service Redis gezond is.
    - **immich_ml**: wacht tot de service voor machine learning is gestart, en
      start mee opnieuw.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/immich/production/app:/data**: koppelt de gegevensmap van de
      toepassing.
    - **/docker/immich/production/app:/usr/src/app/upload**: koppelt de map voor
      uploads.
    - **/etc/localtime:/etc/localtime:ro**: koppelt het bestand localtime
      (alleen-lezen) om de tijd gelijk te zetten.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **domainname: photos.local**: stelt de domeinnaam van de container in.
  - **hostname: photos**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `immich_net`.
    - **ipv4_address: 172.20.24.5**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **3015:2283/tcp**: koppelt TCP-poort 2283 in de container aan poort 3015
      van de host.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.immich.description**: "a self-hosted solution for seamless photo and
      video management, offering privacy and full control."
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.

## Omgevingsvariabelen {#environment-variables}

Dit bestand bevat instellingen die verschillende toepassingen kunnen gebruiken
(zoals Docker-containers of je MariaDB-server). Deze waarden staan buiten de
broncode, voor meer **veiligheid, draagbaarheid en flexibiliteit**.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# Database Configuration: USER
# Database name: DO NOT MODIFY – Essential for Immich stack functionality.
NAME_DB=immich

# PostgreSQL user password: DO NOT MODIFY – Essential for Immich stack functionality.
PASSWORD_DB=postgres

# PostgreSQL username: DO NOT MODIFY – Essential for Immich stack functionality.
USER_DB=postgres
```

- **`NAME_DB`**: de naam van de PostgreSQL-database die de stack van Immich
  gebruikt. Deze waarde **mag niet worden gewijzigd**, anders werkt het niet
  goed (standaard: `immich`).
- **`PASSWORD_DB`**: het wachtwoord van de PostgreSQL-gebruiker. Dit is
  essentieel voor de werking van de stack van Immich en **mag niet worden
  gewijzigd** (standaard: `postgres`).
- **`USER_DB`**: de gebruikersnaam van PostgreSQL die de stack van Immich
  gebruikt. Dit is verplicht en **mag niet worden gewijzigd** (standaard:
  `postgres`).

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Immich via deze URL:

```bash
http://your-ip-address:3015
```

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
Klik bij het eerste bezoek op **Getting Started**. De eerste gebruiker die zich
registreert, wordt de beheerder.
{{% /alert %}}

**Gebruikersnaam**: gemaakt tijdens de installatie

**Wachtwoord**: gemaakt tijdens de installatie

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om tijdens de installatie een sterke
gebruikersnaam en een sterk wachtwoord te maken.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een Docker-omgeving op voor de toepassing Immich en de
services waarvan die afhangt. De configuratie definieert grenzen en
reserveringen voor bronnen, eigen netwerken met vaste IP-adressen en
beveiligingsopties voor veiligere containers. De container van de app Immich
hangt af van gezonde services voor de database, Redis en machine learning, met
een passend herstartbeleid om beschikbaar te blijven. Er is blijvende opslag
voor uploads, en de tijdzone wordt gelijkgezet. Logging en health checks bewaken
de status van de containers, zodat de services efficiënt en veilig draaien.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/immich/compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/immich/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/immich/stack.env
