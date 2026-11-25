---
title: "uptime-kuma-beta.info"
description:
  "Rol de bètaversie van Uptime Kuma uit, een monitoringhulpmiddel dat je zelf
  host om de beschikbaarheid, de status en meldingen van verschillende diensten
  en domeinen te bewaken."
url: "docker/compose-info/uptime-kuma-beta"
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
  - Uptime Kuma
  - Docker Compose
  - Container Management
  - Infrastructure Monitoring
keywords:
  - Docker
  - Uptime Kuma
  - Docker Compose
  - Container Management
  - Docker Network
  - Uptime Kuma Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Infrastructure Monitoring
  - Self-hosted Monitoring

weight: 4125

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om de bètaversie
van Uptime Kuma uit te rollen, een monitoringhulpmiddel dat je zelf host.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `uptime-kuma-beta`, ingesteld met `name:` op het hoogste
  niveau van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service Uptime Kuma Beta in
  om de beschikbaarheid en status van verschillende diensten te bewaken.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-bestand .env**: [.env]
- **RAW-bestand stack.env**: [stack.env]
- **RAW-bestand my.cnf**: [my.cnf]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: uptime-kuma-beta

networks:
  # Joins the network of the uptime-kuma stack, which must be running first.
  uptime-kuma_net:
    external: true
    name: uptime-kuma
```

- **networks**: deze stack heeft geen eigen netwerk. Hij doet mee in het netwerk
  van de stack `uptime-kuma`.
  - **uptime-kuma_net**: de naam van het netwerk in dit Compose-bestand.
  - **external: true**: het netwerk bestaat al; Docker Compose maakt of
    verwijdert het niet. Start eerst de stack `uptime-kuma`.
  - **name: uptime-kuma**: de naam van het netwerk in Docker (`172.19.3.0/24`).
    De database gebruikt `172.19.3.4` en de app `172.19.3.5`; `uptime-kuma`
    gebruikt `.2` en `.3`.

## Configuratie van de services {#services-configuration}

```yaml
services:
  uptime-kuma-beta_db:
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
    container_name: uptime-kuma-beta_db
    image: docker.io/mariadb:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/uptime-kuma-beta/testing/db:/var/lib/mysql
      - /docker/uptime-kuma-beta/testing/my.cnf:/etc/my.cnf
      - /sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure
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
      MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_DATABASE: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
    hostname: uptime-kuma-beta_db
    networks:
      uptime-kuma_net:
        ipv4_address: 172.19.3.4
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma-beta.db.description: "is an MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  uptime-kuma-beta_app:
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
    container_name: uptime-kuma-beta
    image: ghcr.io/louislam/uptime-kuma:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      uptime-kuma-beta_db:
        condition: service_healthy
    volumes:
      - /docker/uptime-kuma-beta/testing/app:/app/data
      - /usr/local/share/ca-certificates:/app/data/docker-tls
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
      # Replace 'root_ca.crt' with your own Root CA certificate, then uncomment the line
      # NODE_EXTRA_CA_CERTS: /app/data/docker-tls/root_ca.crt
      MARIADB_HOST: ${HOST_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PORT: ${PORT_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_NAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
    domainname: status.local # Customize this with your own domain, e.g., `status.local` to `status.your-fqdn-here.com`.
    hostname: status
    networks:
      uptime-kuma_net:
        ipv4_address: 172.19.3.5
    ports:
      - "3003:3001/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma-beta.description:
        "is an self-hosted monitoring tool that allows you to monitor uptime,
        status, and notifications for various services and domains."
    healthcheck:
      disable: false
      test: ["CMD", "extra/healthcheck"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  uptime-kuma-beta_socket-proxy:
    deploy:
      resources:
        limits:
          pids: 512 # Limits the number of processes and threads (fork bomb protection).
    # Read-only proxy for the Docker API. The app reaches Docker through this proxy instead of the socket.
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: uptime-kuma-beta_socket-proxy
    image: lscr.io/linuxserver/socket-proxy:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    read_only: true
    tmpfs:
      - /run
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      CONTAINERS: 1 # Allow GET /containers (list and inspect).
      INFO: 1 # Allow GET /info, used to test the Docker host.
      POST: 0 # Read-only: only GET and HEAD requests reach Docker.
    hostname: uptime-kuma-beta_socket-proxy
    networks:
      uptime-kuma_net:
        ipv4_address: 172.19.3.7
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma-beta.socket-proxy.description:
        "is a read-only Docker API proxy for Uptime Kuma Beta."
```

- **services**: definieert de services die worden uitgerold.
- **uptime-kuma-beta_db**: de service voor de MariaDB-database.
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
  - **container_name: uptime-kuma-beta_db**: geeft de container de naam
    `uptime-kuma-beta_db`.
  - **image: docker.io/mariadb**: gebruikt de image van MariaDB.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden in de container.
    - **/docker/uptime-kuma-beta/testing/db:/var/lib/mysql**: koppelt de map met
      de opslag van de database.
    - **/docker/uptime-kuma-beta/testing/my.cnf:/etc/my.cnf**: koppelt het eigen
      configuratiebestand van MariaDB.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: koppelt
      de informatie over de geheugendruk van het systeem, voor monitoring.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt de omgevingsvariabelen voor de verbinding met de
    database in.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container extra
    rechten krijgt.
  - **hostname: uptime-kuma-beta_db**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `uptime-kuma`.
    - **ipv4_address**: geeft de container een vast IP-adres.
  - **healthcheck**: stelt de health check van de service in.
    - **disable: false**: zet de health check aan.
    - **test**: geeft het commando voor de health check (met `healthcheck.sh`).
    - **interval**: bepaalt het interval van de health check (10 seconden).
    - **timeout**: bepaalt de time-out van health checks (5 seconden).
    - **retries**: het aantal pogingen voordat de container als ongezond geldt
      (3 pogingen).
    - **start_period**: de periode waarna mislukte health checks meetellen (10
      seconden).
    - **start_interval**: de tijd tussen health checks (5 seconden).

- **uptime-kuma-beta_app**: de service voor de app Uptime Kuma Beta.
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
  - **container_name: uptime-kuma-beta**: geeft de container de naam
    `uptime-kuma-beta`.
  - **image: ghcr.io/louislam/uptime-kuma**: gebruikt de opgegeven image van
    Uptime Kuma Beta.
  - **depends_on**: zorgt dat de databaseservice gezond is voordat de
    app-service start.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
  - **environment**: stelt de omgevingsvariabelen voor de app Uptime Kuma Beta
    in.
  - **domainname: status.local**: past de domeinnaam van de container aan.
  - **ports**: koppelt poorten van de container aan poorten van de host.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container extra
    rechten krijgt.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check. Hier is dat
      `["CMD", "extra/healthcheck"]`.
    - **interval**: de tijd tussen twee health checks (10 seconden).
    - **timeout**: de tijd die een health check mag duren voordat die als
      mislukt geldt (5 seconden).
    - **retries**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt (3 pogingen).
    - **start_period**: de beginperiode waarin een mislukte health check niet
      meetelt voor de pogingen (10 seconden).
    - **start_interval**: de tijd tussen health checks tijdens het opstarten (5
      seconden).

- **uptime-kuma-beta_socket-proxy**: de Docker-socketproxy die alleen leest.
  `uptime-kuma-beta_app` bereikt de Docker-API via deze proxy op poort 2375, in
  plaats van de Docker-socket te koppelen.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: uptime-kuma-beta_socket-proxy**: geeft de container een
    naam.
  - **image: lscr.io/linuxserver/socket-proxy**: gebruikt de image van de
    socketproxy van LinuxServer.io.
  - **pull_policy: if_not_present**: haalt de image alleen op als die niet
    lokaal aanwezig is.
  - **read_only: true**: koppelt het root-bestandssysteem van de container
    alleen-lezen.
  - **tmpfs: /run**: koppelt `/run` als bestandssysteem in het geheugen voor de
    runtimebestanden van de proxy.
  - **volumes**: koppelt de Docker-socket alleen-lezen. De vlag `:ro` beperkt de
    Docker-API niet; dat doet de proxy.
  - **environment**: bepaalt wat de proxy doorlaat. `CONTAINERS: 1` staat het
    opvragen en bekijken van containers toe, `INFO: 1` staat `GET /info` toe,
    waarmee de app de Docker-host test, en `POST: 0` blokkeert elk verzoek dat
    iets wijzigt. Alleen verzoeken met `GET` en `HEAD` bereiken Docker.
  - **hostname: uptime-kuma-beta_socket-proxy**: stelt de hostnaam van de
    container in.
  - **networks**: koppelt de service aan het netwerk van de stack met het vaste
    IP-adres `172.19.3.7`.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container extra
    rechten krijgt.
  - **labels**: een label met een beschrijving.

## Omgevingsvariabelen {#environment-variables}

Dit bestand bevat instellingen die verschillende toepassingen kunnen gebruiken
(zoals Docker-containers of je MariaDB-server). Deze waarden staan buiten de
broncode, voor meer **veiligheid, draagbaarheid en flexibiliteit**.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# Database Configuration: ROOT USER
# Change the MariaDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=uptime-kuma-beta_db

# Database name:
NAME_DB=uptime_kuma_beta_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=uptime-kuma
```

- **`ROOT_PASSWORD_DB`**: het wachtwoord van de rootgebruiker van de
  MariaDB-instantie. Deze gebruiker heeft alle beheerrechten. Gebruik een
  veilige, unieke waarde.
- **`HOST_DB`**: hostnaam of IP-adres van de databaseserver. In opstellingen met
  Docker is dit meestal de naam van de service (`uptime-kuma-beta_db`).
- **`NAME_DB`**: de naam van de database die de toepassing gebruikt (bijv.
  uptime_kuma_beta_db).
- **`PASSWORD_DB`**: het wachtwoord van de databasegebruiker zonder rootrechten
  (`USER_DB`). Zorg dat het veilig is.
- **`PORT_DB`**: het poortnummer waarop MariaDB luistert (standaard: 3306).
- **`USER_DB`**: de gebruikersnaam waarmee verbinding wordt gemaakt met de
  database.

## Configuratie van MariaDB/MySQL {#mariadbmysql-configuration}

Dit bestand stelt het gedrag van MariaDB of MySQL in: de werking van de server,
het afstemmen van de prestaties, replicatie, beveiliging en tekencodering.

### Onderdelen van dit bestand {#sections-in-this-file}

#### Algemene serverinstellingen {#general-server-settings}

```cnf
[mysqld]
server-id = 1
datadir = /var/lib/mysql/
pid-file = /var/run/mysqld/mysqld.pid
skip-name-resolve
default-storage-engine = InnoDB
transaction-isolation = REPEATABLE-READ
skip-symbolic-links
```

- **`server-id`**: unieke aanduiding van de MariaDB-instantie (gebruikt bij
  replicatie).
- **`datadir`**: pad van de map waarin de databasebestanden staan.
- **`pid-file`**: bewaart de proces-ID van de draaiende server.
- **`skip-name-resolve`**: zet DNS-resolutie voor hostnamen uit, wat de
  prestaties verbetert.
- **`default-storage-engine`**: maakt InnoDB de standaardengine (betrouwbaar en
  ACID-compliant).
- **`transaction-isolation`**: bepaalt het gedrag van transacties.
  `REPEATABLE-READ` voorkomt niet-herhaalbare leesacties.
- **`skip-symbolic-links`**: staat geen symbolische koppelingen in databestanden
  toe, om veiligheidsredenen.

#### Optimalisatie van de prestaties {#performance-optimizations}

```cnf
innodb-use-native-aio = 0
innodb-buffer-pool-size = 1G
innodb-buffer-pool-size-auto-min = 0
innodb-log-file-size = 1G
innodb-log-buffer-size = 32M
innodb-flush-log-at-trx-commit = 1
innodb-read-io-threads = 8
innodb-write-io-threads = 8
innodb-io-capacity = 6000
innodb-io-capacity-max = 8000
query-cache-type = 0
tmp-table-size = 64M
max-heap-table-size = 64M
max-connections = 200
thread-cache-size = 50
table-definition-cache = 4000
table-open-cache = 4000
aria-pagecache-buffer-size = 128M
```

- **`innodb-buffer-pool-size`**: geheugen voor de cache van InnoDB-gegevens en
  -indexen.
- **`innodb-buffer-pool-size-auto-min`**: minimale grootte van de bufferpool bij
  automatisch verkleinen (0 zet het minimum uit).
- **`innodb-log-file-size`**: grootte van elk redo-logbestand van InnoDB.
- **`innodb-log-buffer-size`**: grootte van de RAM-buffer voor InnoDB-logs
  voordat die naar schijf worden geschreven.
- **`innodb-flush-log-at-trx-commit`**: bepaalt hoe duurzaam transacties zijn (1
  = het veiligst).
- **`innodb-io-capacity` / `innodb-io-capacity-max`**: afstemwaarden voor de
  I/O-prestaties.
- **`query-cache-type`**: zet op 0 om de query cache uit te zetten (aanbevolen
  voor InnoDB).
- **`tmp-table-size`** / **`max-heap-table-size`**: maximale grootte van
  tijdelijke tabellen in het geheugen.
- **`max-connections`**: maximaal aantal gelijktijdige verbindingen van clients.
- **`thread-cache-size`**: threads in de cache, zodat er minder threads hoeven
  te worden gemaakt.
- **`table-definition-cache` / `table-open-cache`**: verbetert de prestaties bij
  veel tabellen.
- **`aria-pagecache-buffer-size`**: buffergrootte voor de opslagengine Aria (als
  die wordt gebruikt).

#### Beveiligingsinstellingen {#security-settings}

```cnf
secure-file-priv = /var/lib/mysql/
# plugin-load-add = validate_password.so
# validate-password-policy = STRONG
# validate-password-length = 12
# validate-password-mixed-case-count = 1
# validate-password-number-count = 1
# validate-password-special-char-count = 1
```

- **`secure-file-priv`**: beperkt de mappen die worden gebruikt voor het
  importeren en exporteren van bestanden.
- **`plugin-load-add`**: optioneel: zet de plug-in voor wachtwoordcontrole aan.
- **`validate-password-*`**: dwingt sterke wachtwoorden af bij het maken van
  gebruikers. Haal het commentaarteken weg om het aan te zetten.

#### Binaire logging en replicatie {#binary-logging-and-replication}

```cnf
log-bin = uptime-kuma-beta_binlog
max-binlog-size = 500M
expire-logs-days = 7
binlog-checksum = CRC32
binlog-format = ROW
log-bin-compress = 1
encrypt-binlog = 0
relay-log-purge = 1
relay-log-recovery = 1
slave_connections_needed_for_purge = 0
```

- **`log-bin`**: zet binaire logging aan voor replicatie en herstel.
- **`max-binlog-size`**: maximale grootte van afzonderlijke binaire
  logbestanden.
- **`expire-logs-days`**: aantal dagen voordat oude binaire logs worden
  opgeruimd.
- **`binlog-format`**: zet op `ROW` voor replicatie per rij (het nauwkeurigst).
- **`log-bin-compress`**: comprimeert binaire logs om ruimte te besparen.
- **`encrypt-binlog`**: versleutelt binaire logs (hier uitgezet).
- **`relay-log-purge`** / **`relay-log-recovery`**: helpt een schone en
  herstelbare replica te behouden.
- **`slave_connections_needed_for_purge`**: bepaalt of het opruimen afhangt van
  de status van de replicatie.

#### Tekenset en codering {#character-set-and-encoding}

```cnf
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci
init-connect = 'SET NAMES utf8mb4'
```

- **`character-set-server` / `collation-server`**: maakt UTF-8 de
  standaardtekenset en -sortering.
- **`init-connect`**: zorgt dat clients bij het verbinden dezelfde tekenset
  gebruiken.

#### Monitoring en debuggen {#monitoring-and-debugging}

```cnf
performance-schema = 1
performance-schema-consumer-events-statements-history = 1
performance-schema-consumer-events-transactions-history = 1
performance-schema-consumer-events-waits-history = 1
innodb-status-output = 0
innodb-status-output-locks = 0
general-log = 0
```

- **`performance-schema`**: zet het verzamelen van prestatiegegevens aan.
- **`*-history`-opties**: zetten het bijhouden van de geschiedenis van query's,
  transacties en wachttijden aan.
- **`innodb-status-output` / `innodb-status-output-locks`**: schrijft
  monitoringinformatie van InnoDB naar de logs (hier uitgezet).
- **`general-log`**: logt elke query; standaard uitgezet voor de prestaties.

#### Tijdelijke bestanden {#temporary-files}

```cnf
# tmpdir = /tmp
```

- **`tmpdir`**: map voor tijdelijke bestanden. Haal het commentaarteken weg en
  pas het aan voor eigen opslag.

#### Beveiliging met SSL/TLS {#ssltls-security}

```cnf
# ssl-ca = /etc/mysql/ssl/ca-cert.pem
# ssl-cert = /etc/mysql/ssl/server-cert.pem
# ssl-key = /etc/mysql/ssl/server-key.pem
# require-secure-transport = 1
```

- **SSL/TLS-instellingen**: optionele configuratie voor versleutelde
  communicatie tussen client en server. Haal het commentaarteken weg en stel het
  in waar nodig.

#### Extra configuratiebestanden opnemen {#inclusion-of-additional-configuration-files}

```cnf
!includedir /etc/mysql/conf.d/
!includedir /etc/mysql/mariadb.conf.d/
```

- **`!includedir`**: neemt extra configuratiebestanden uit opgegeven mappen op,
  voor een modulair beheer van de configuratie.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start eerst de stack `uptime-kuma`. Deze stack doet mee in het netwerk
   `uptime-kuma`, met de database op `172.19.3.4` en de app op `172.19.3.5`.

2. Kopieer `my.cnf` naar `/docker/uptime-kuma-beta/testing/my.cnf`. Docker maakt
   de andere mappen onder `/docker/uptime-kuma-beta/` bij de eerste start.

3. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

4. Start de stack:

   ```bash
   docker compose up -d
   ```

5. Om containers te bewaken, open je in Uptime Kuma **Settings → Docker Hosts**
   en voeg je een Docker-host toe met het verbindingstype **TCP / HTTP** en de
   Docker-daemon `http://uptime-kuma-beta_socket-proxy:2375`. De stack heeft
   geen directe toegang tot de Docker-socket; deze proxy die alleen leest is de
   enige toegang.

## Standaard webtoegang {#default-web-access}

Open de webinterface van Uptime Kuma Beta via deze URL:

```bash
http://your-ip-address:3003
```

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
De inloggegevens worden tijdens de eerste installatie gemaakt.
{{% /alert %}}

**Gebruikersnaam**: gemaakt tijdens de installatie

**Wachtwoord**: gemaakt tijdens de installatie

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om tijdens de installatie een sterke
gebruikersnaam en een sterk wachtwoord te maken.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit bestand `compose.yml` zet een Docker-omgeving op voor Uptime Kuma Beta, een
monitoringhulpmiddel dat je zelf host. De configuratie definieert een eigen
bridge-netwerk met vaste IP-instellingen, een databaseservice met MariaDB en de
toepassing Uptime Kuma Beta. Zo draaien beide services efficiënt en veilig, met
goede health checks, logging en een goed herstartbeleid.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/uptime-kuma-beta/compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/uptime-kuma-beta/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/uptime-kuma-beta/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/uptime-kuma-beta/my.cnf
