---
title: "postgresql.info"
description:
  "Dit bestand rolt een PostgreSQL-database uit met een eigen
  configuratiebestand, een blijvende gegevensmap en een health check."
url: "docker/compose-info/postgresql"
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
  - PostgreSQL
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - PostgreSQL
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - PostgreSQL
  - Database

weight: 4121

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het rolt een
PostgreSQL-database uit met een eigen configuratiebestand, een blijvende
gegevensmap en een health check.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `postgresql`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service PostgreSQL in.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-omgevingsbestand**: [stack.env]
- **RAW-configuratiebestand van PostgreSQL**: [config/postgresql.conf]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: postgresql

networks:
  postgresql_net:
    attachable: true
    internal: true
    external: false
    name: postgresql
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.25.0/24
          ip_range: 172.20.25.0/24
          gateway: 172.20.25.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "postgresql"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.postgresql.network.description: "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `postgresql_net`.
- **attachable: false**: andere containers kunnen zich niet aan dit netwerk
  koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt.
- **name: postgresql**: geeft de naam van het netwerk.
- **driver: bridge**: gebruikt het stuurprogramma bridge voor een afgeschermd
  netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **subnet**: `172.20.25.0/24`.
  - **ip_range**: `172.20.25.0/24`.
  - **gateway**: `172.20.25.1`.
- **driver_opts**: extra opties voor het netwerkstuurprogramma.
  - **com.docker.network.bridge.default_bridge: "false"**: geeft aan dat dit
    niet de standaardbridge van Docker is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: laat uitgaand
    verkeer eruitzien alsof het van de host komt.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt de
    bridge aan alle beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "postgresql"**: geeft de bridge-interface
    op de host een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **label met beschrijving**: beschrijft het netwerk als een afgeschermd
    bridge-netwerk.

## Configuratie van de services {#services-configuration}

### `postgresql_db`

```yaml
services:
  postgresql_db:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: postgresql_db
    image: docker.io/postgres:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/postgresql/config/postgresql.conf:/etc/postgresql/postgresql.conf
      - /docker/postgresql/18/production/db:/var/lib/postgresql
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
      POSTGRES_PASSWORD: ${POSTGRES_SUPERUSER_PASSWORD} # Fill in the value in both the .env and stack.env files
      POSTGRES_USER: ${POSTGRES_SUPERUSER_NAME} # Fill in the value in both the .env and stack.env files
    command: ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
    hostname: postgresql_db
    networks:
      postgresql_net:
        ipv4_address: 172.20.25.2
    ports:
      - target: 5432 # container port
        host_ip: 127.0.0.1 # The Host IP mapping, unspecified means all network interfaces (0.0.0.0)
        published: 5432 # publicly exposed port
        protocol: tcp # tcp or udp
        mode: ingress # host: For publishing a host port on each node
    security_opt:
      - no-new-privileges:true
    labels:
      com.postgresql.db.description: "is a PostgreSQL database."
    healthcheck:
      disable: false
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **postgresql_db**: de definitie van de service.
  - **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: start de container altijd opnieuw.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: postgresql_db**: geeft de container een naam.
  - **image: docker.io/postgres**: gebruikt deze image.
  - **pull_policy: if_not_present**: haalt de image alleen op als die niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/postgresql/config/postgresql.conf:/etc/postgresql/postgresql.conf**
    - **/docker/postgresql/18/production/db:/var/lib/postgresql** images van
      PostgreSQL 18 bewaren de gegevens in `/var/lib/postgresql/18/docker`, dus
      het koppelpunt is `/var/lib/postgresql` in plaats van
      `/var/lib/postgresql/data`.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: 1000**: de gebruikers-ID waarmee de container draait.
    - **PGID: 1000**: de groeps-ID waarmee de container draait.
    - **TZ: Europe/Amsterdam**: stel de tijdzone in op je eigen tijdzone. De
      volledige lijst met tijdzones vind je hier:
      https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    - **POSTGRES_PASSWORD: ${POSTGRES_SUPERUSER_PASSWORD}**: vul de waarde in
      zowel het bestand .env als het bestand stack.env in
    - **POSTGRES_USER: ${POSTGRES_SUPERUSER_NAME}**: vul de waarde in zowel het
      bestand .env als het bestand stack.env in
  - **command**: voert `postgres -c config_file=/etc/postgresql/postgresql.conf`
    uit.
  - **hostname: postgresql_db**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan `postgresql_net` met het vaste IP-adres
    `172.20.25.2`.
  - **ports**: koppelt poorten van de host aan poorten van de container.
    - **127.0.0.1:5432 -> 5432/tcp**: publiceert de poort alleen op het IP-adres
      `127.0.0.1` van de host.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container nieuwe
    rechten krijgt.
  - **labels**: een label met een beschrijving.
  - **healthcheck**: voert `pg_isready -U $${POSTGRES_USER}` uit.
    - **interval / timeout / retries / start_period / start_interval**: 10s / 5s
      / 3 / 10s / 5s.

## Omgevingsvariabelen {#environment-variables}

De variabelen staan in een omgevingsbestand, buiten het Compose-bestand. Gebruik
`.env` voor Docker Compose en `stack.env` voor Portainer. Beide bestanden moeten
dezelfde waarden bevatten.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# PostgreSQL Admin password: Change this to a strong, unique password
POSTGRES_SUPERUSER_PASSWORD=StrongUniqueAdminPassword5678

# PostgreSQL Admin username: Change this to your desired username
# Note: Avoid using 'root' or 'postgres' if possible
POSTGRES_SUPERUSER_NAME=admin
```

- **`POSTGRES_SUPERUSER_PASSWORD`**: wachtwoord van de PostgreSQL-beheerder:
  wijzig dit in een sterk, uniek wachtwoord
- **`POSTGRES_SUPERUSER_NAME`**: gebruikersnaam van de PostgreSQL-beheerder:
  wijzig dit in de gewenste gebruikersnaam. Let op: gebruik zo mogelijk niet
  'root' of 'postgres'

## Configuratie van PostgreSQL {#postgresql-configuration}

Het bestand `postgresql.conf` wordt in de container gekoppeld en geladen met de
optie `config_file` van het commando `postgres`. Zie [postgresql.conf] voor het
volledige bestand met commentaar. Het bestaat uit deze onderdelen:

- **Verbindingsinstellingen**
- **Geheugeninstellingen**
- **Logginginstellingen**
- **Taal, regio en tijdzone**
- **Zoeken in volledige tekst**
- **Beveiliging en toegangscontrole**
- **Extra configuratiebestanden opnemen**

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Kopieer `config/postgresql.conf` naar
   `/docker/postgresql/config/postgresql.conf`. Docker maakt de andere mappen
   onder `/docker/postgresql/` bij de eerste start.

2. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

3. Start de stack:

   ```bash
   docker compose up -d
   ```

## Verbinding {#connection}

PostgreSQL heeft geen webinterface. De poort is alleen op de host gepubliceerd
(`127.0.0.1`), dus maak verbinding vanaf de host zelf:

```bash
psql --host 127.0.0.1 --port 5432 --username admin
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: de waarde van `POSTGRES_SUPERUSER_NAME` (standaard `admin`).

**Wachtwoord**: de waarde van `POSTGRES_SUPERUSER_PASSWORD` in het bestand
`.env` of `stack.env`.

## Conclusie {#conclusion}

Dit Compose-bestand rolt PostgreSQL uit op een eigen bridge-netwerk met een vast
IP-adres. De poort wordt alleen op `127.0.0.1` gepubliceerd, de inloggegevens
van de superuser staan in een omgevingsbestand en de health check gebruikt
`pg_isready`.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/postgresql/compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/postgresql/stack.env
[config/postgresql.conf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/postgresql/config/postgresql.conf
