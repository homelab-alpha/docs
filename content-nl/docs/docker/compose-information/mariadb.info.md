---
title: "mariadb.info"
description:
  "Rol een MariaDB-instantie uit met Docker Compose, met de netwerkconfiguratie,
  de instellingen van de service en beveiligingsmaatregelen voor een optimale
  werking."
url: "docker/compose-info/mariadb"
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
  - MariaDB
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - MariaDB
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Database
  - Infrastructure Monitoring
  - Self-hosted Docker Management

weight: 4111

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt een MariaDB-instantie in en rolt die uit met Docker Compose, voor een
efficiënt databasebeheer en een veilige werking. Het bevat netwerkinstellingen,
omgevingsvariabelen voor de configuratie en health checks om het systeem stabiel
te houden.

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `mariadb`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een eigen netwerk en een service MariaDB in met Docker
  Compose.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-bestand .env**: [.env]
- **RAW-bestand stack.env**: [stack.env]
- **RAW-bestand my.cnf**: [my.cnf]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: mariadb

networks:
  mariadb_net:
    attachable: true
    internal: true
    external: false
    name: mariadb
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.16.0/24
          ip_range: 172.20.16.0/24
          gateway: 172.20.16.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "mariadb"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.mariadb.network.description: "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `mariadb_net`.
- **attachable**: staat op `true`: andere containers kunnen zich aan dit netwerk
  koppelen.
- **internal**: staat op `true`: het netwerk is alleen intern bereikbaar.
- **external**: staat op `false`: het netwerk is niet extern gedefinieerd.
- **name**: geeft het netwerk de naam `mariadb`.
- **driver**: gebruikt het stuurprogramma `bridge` voor een afgeschermd netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **driver**: het standaardstuurprogramma voor IPAM wordt gebruikt.
  - **config**: definieert de IP-configuratie van het netwerk.
    - **subnet**: zet het subnet van het netwerk op `172.20.16.0/24`.
    - **ip_range**: beperkt het IP-bereik tot `172.20.16.0/24`.
    - **gateway**: definieert `172.20.16.1` als gateway van het netwerk.
- **driver_opts**: extra opties voor het stuurprogramma.
  - **com.docker.network.bridge.default_bridge: "false"**: zorgt dat dit niet de
    standaardbridge van Docker is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: staat
    IP-masquerading toe voor uitgaand verkeer.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt aan alle
    beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "mariadb"**: geeft het bridge-netwerk de
    naam `mariadb`.
  - **com.docker.network.driver.mtu: "1500"**: stelt de MTU (Maximum
    Transmission Unit) van het netwerk in.
- **labels**: metadata die het netwerk beschrijft.
  - **com.mariadb.network.description**: beschrijft het netwerk als een
    afgeschermd bridge-netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  mariadb_db:
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
    container_name: mariadb_db
    image: docker.io/mariadb:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/mariadb/config/my.cnf:/etc/my.cnf
      - /docker/mariadb/production/db:/var/lib/mysql
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
    hostname: mariadb_db
    networks:
      mariadb_net:
        ipv4_address: 172.20.16.2
    ports:
      - target: 3306 # container port
        host_ip: 127.0.0.1 # The Host IP mapping, unspecified means all network interfaces (0.0.0.0)
        published: 3306 # publicly exposed port
        protocol: tcp # tcp or udp
        mode: ingress # host: For publishing a host port on each node
    security_opt:
      - no-new-privileges:true
    labels:
      com.mariadb.db.description: "is a MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **mariadb_db**: de naam van de service voor de MariaDB-container.
  - **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: de container start altijd opnieuw als die stopt.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt logbestanden tot maximaal 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: geeft de container 1 minuut om te stoppen.
  - **container_name: mariadb_db**: geeft de container de naam `mariadb_db`.
  - **image: docker.io/mariadb**: gebruikt de image van MariaDB.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden in de container.
    - **/docker/mariadb/production/db:/var/lib/mysql**: koppelt de map met de
      opslag van de database.
    - **/docker/mariadb/config/my.cnf:/etc/my.cnf**: koppelt het eigen
      configuratiebestand van MariaDB.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: koppelt
      de informatie over de geheugendruk van het systeem, voor monitoring.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt de omgevingsvariabelen van de MariaDB-instantie in.
    - **PUID**: stelt de gebruikers-ID van de container in.
    - **PGID**: stelt de groeps-ID van de container in.
    - **TZ**: stelt de tijdzone in; pas die aan je eigen tijdzone aan.
    - **MARIADB_ROOT_PASSWORD**: definieert het rootwachtwoord van MariaDB (met
      een variabele uit het bestand `.env`).
  - **hostname: mariadb_db**: stelt `mariadb_db` in als hostnaam van de
    container.
  - **networks**: koppelt de service aan het netwerk `mariadb_net` met het vaste
    IP-adres `172.20.16.2`.
  - **ports**: publiceert de poort van MariaDB op de host.
    - **target: 3306**: de poort van de container.
    - **host_ip: 127.0.0.1**: koppelt de gepubliceerde poort alleen aan de
      loopback-interface van de host.
    - **published: 3306**: de poort die op de host wordt opengezet.
    - **protocol: tcp**: gebruikt TCP.
    - **mode: ingress**: publiceert de poort op het ingress-netwerk van de
      swarm.
  - **security_opt**: voegt beveiligingsopties aan de container toe.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten kan
      krijgen.
  - **labels**: metadata van de container.
    - **com.mariadb.db.description**: beschrijft de service als een
      MariaDB-database.
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
```

- **`ROOT_PASSWORD_DB`**: het wachtwoord van de rootgebruiker van de
  MariaDB-instantie. Deze gebruiker heeft alle beheerrechten. Gebruik een
  veilige, unieke waarde.

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
max-connections = 500
thread-cache-size = 50
table-definition-cache = 4000
table-open-cache = 4000
aria-pagecache-buffer-size = 256M
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
log-bin = binlog
max-binlog-size = 512M
expire-logs-days = 14
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

1. Kopieer `config/my.cnf` naar `/docker/mariadb/config/my.cnf`. Docker maakt de
   andere mappen onder `/docker/mariadb/` bij de eerste start.

2. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

3. Start de stack:

   ```bash
   docker compose up -d
   ```

## Verbinding {#connection}

MariaDB heeft geen webinterface. De poort is alleen op de host gepubliceerd
(`127.0.0.1`), dus maak verbinding vanaf de host zelf:

```bash
mariadb --host 127.0.0.1 --port 3306 --user root --password
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: root

**Wachtwoord**: de waarde van `ROOT_PASSWORD_DB` in het bestand `.env` of
`stack.env`.

## Conclusie {#conclusion}

Dit bestand `compose.yml` zet een MariaDB-instantie op, met een eigen netwerk
voor afscherming en veilige communicatie. De MariaDB-container heeft blijvende
opslag, omgevingsvariabelen voor de inloggegevens van de database en een health
check die de beschikbaarheid bewaakt. De opzet zorgt voor een veilig en
efficiënt databasebeheer, met passende logging en een passend herstartbeleid.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/mariadb/compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/mariadb/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/mariadb/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/mariadb/config/my.cnf
