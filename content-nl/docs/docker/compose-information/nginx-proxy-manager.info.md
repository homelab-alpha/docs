---
title: "nginx-proxy-manager.info"
description:
  "Rol Nginx Proxy Manager uit met Docker Compose, een gebruiksvriendelijk
  hulpmiddel om reverse proxy's te beheren. Deze gids behandelt een eigen
  netwerk, de koppeling met MariaDB, de configuratie van de service en
  aanbevolen beveiligingswerkwijzen voor een betrouwbare en veilige werking."
url: "docker/compose-info/nginx-proxy-manager"
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
  - Docker Compose
  - Nginx Proxy Manager
  - Reverse Proxy
  - MariaDB
  - Networking
keywords:
  - nginx proxy manager
  - docker compose
  - mariadb container
  - reverse proxy management
  - custom docker network
  - container orchestration
  - homelab docker
  - docker networking

weight: 4115

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om een eigen
Docker-netwerk op te zetten voor Nginx Proxy Manager, een gebruiksvriendelijk
hulpmiddel om reverse proxy's te beheren.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `nginx-proxy-manager`, ingesteld met `name:` op het hoogste
  niveau van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: configuratie van Docker Compose voor Nginx Proxy Manager met
  MariaDB, een eigen netwerk en aanbevolen beveiligingswerkwijzen.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-bestand .env**: [.env]
- **RAW-bestand stack.env**: [stack.env]
- **RAW-bestand my.cnf**: [my.cnf]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: nginx-proxy-manager

networks:
  nginx-proxy-manager_net:
    attachable: true
    internal: false
    external: false
    name: nginx-proxy-manager
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.20.0/24
          ip_range: 172.20.20.0/24
          gateway: 172.20.20.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "npm"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.nginx-proxy-manager.network.description:
        "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `nginx-proxy-manager_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: nginx-proxy-manager**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "nginx-proxy-manager"**: geeft het
    bridge-netwerk een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.nginx-proxy-manager.network.description**: een label met een
    beschrijving van het netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  nginx-proxy-manager_db:
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
    container_name: nginx-proxy-manager_db
    image: docker.io/mariadb:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/nginx-proxy-manager/production/db:/var/lib/mysql
      # - /docker/nginx-proxy-manager/production/my.cnf:/etc/my.cnf
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
    hostname: nginx-proxy-manager_db
    networks:
      nginx-proxy-manager_net:
        ipv4_address: 172.20.20.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.nginx-proxy-manager.db.description: "is a MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  nginx-proxy-manager_app:
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
    container_name: nginx-proxy-manager
    image: docker.io/jc21/nginx-proxy-manager:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      nginx-proxy-manager_db:
        condition: service_healthy
        restart: true
    volumes:
      - /docker/nginx-proxy-manager/production/app:/data
      - /etc/letsencrypt:/etc/letsencrypt
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
      MARIADB_HOST: ${HOST_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PORT: ${PORT_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_NAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      INITIAL_ADMIN_EMAIL: ${ADMIN_EMAIL} # Fill in the value in both the .env and stack.env files
      INITIAL_ADMIN_PASSWORD: ${ADMIN_PASSWORD} # Fill in the value in both the .env and stack.env files
      DISABLE_IPV6: "true" # Set this to "true" if IPv6 is disabled on your host. (Default is "false")
    domainname: npm.local # Customize this with your own domain, e.g., `npm.local` to `npm.your-fqdn-here.com`.
    hostname: nginx-proxy-manager
    networks:
      nginx-proxy-manager_net:
        ipv4_address: 172.20.20.3
    ports:
      - "80:80/tcp" # HTTP
      - "81:81/tcp" # web admin port
      - "443:443/tcp" # HTTPS
    security_opt:
      - no-new-privileges:true
    labels:
      com.nginx-proxy-manager.description:
        "nginx proxy manager expose your services easily and securely."
    healthcheck:
      disable: false
      test: ["CMD", "/usr/bin/check-health"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **nginx-proxy-manager_db**: de naam van de service voor de MariaDB-container.
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
  - **container_name: nginx-proxy-manager_db**: geeft de container de naam
    "nginx-proxy-manager_db".
  - **image: docker.io/mariadb**: gebruikt de image van MariaDB.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden in de container.
    - **/docker/nginx-proxy-manager/production/db:/var/lib/mysql**: koppelt de
      map met de opslag van de database.
    - **/docker/nginx-proxy-manager/production/my.cnf:/etc/my.cnf**
      (uitgecommentarieerd): koppelt het eigen configuratiebestand van MariaDB
      als dat aan staat.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: koppelt
      de informatie over de geheugendruk van het systeem, voor monitoring.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **MARIADB_ROOT_PASSWORD**: stelt het rootwachtwoord van MariaDB in.
    - **MARIADB_DATABASE**: stelt de naam van de database in.
    - **MARIADB_USER**: stelt de gebruiker van MariaDB in.
    - **MARIADB_PASSWORD**: stelt het wachtwoord van de gebruiker van MariaDB
      in.
  - **hostname: nginx-proxy-manager_db**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `nginx-proxy-manager_net`.
    - **ipv4_address: 172.20.20.2**: geeft de container een vast IP-adres.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.nginx-proxy-manager.db.description**: label met een beschrijving van
      de MariaDB-container.
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

- **nginx-proxy-manager_app**: de naam van de service voor de container van
  Nginx Proxy Manager.
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
  - **container_name: nginx-proxy-manager**: geeft de container de naam
    "nginx-proxy-manager".
  - **image: docker.io/jc21/nginx-proxy-manager**: gebruikt de image van Nginx
    Proxy Manager.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **depends_on**: geeft de afhankelijkheden van deze service op.
    - **nginx-proxy-manager_db**: wacht tot de databaseservice gezond is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/nginx-proxy-manager/production/app:/data**: koppelt de
      gegevensmap van de toepassing.
    - **/etc/letsencrypt:/etc/letsencrypt**: koppelt de certificaten van Let's
      Encrypt.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **MARIADB_HOST**: de host van de database.
    - **MARIADB_PORT**: de poort van de database.
    - **MARIADB_NAME**: de naam van de database.
    - **MARIADB_USER**: de gebruiker van de database.
    - **MARIADB_PASSWORD**: het wachtwoord van de databasegebruiker.
    - **INITIAL_ADMIN_EMAIL**: het eerste e-mailadres van de beheerder van Nginx
      Proxy Manager.
    - **INITIAL_ADMIN_PASSWORD**: het eerste wachtwoord van de beheerder.
    - **DISABLE_IPV6: "true"**: zet IPv6 in de container uit.
  - **domainname: npm.local**: stelt de domeinnaam van de container in.
  - **hostname: nginx-proxy-manager**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `nginx-proxy-manager_net`.
    - **ipv4_address: 172.20.20.3**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **80:80/tcp**: koppelt de HTTP-poort (TCP).
    - **81:81/tcp**: koppelt de poort van de interface (TCP).
    - **443:443/tcp**: koppelt de HTTPS-poort (TCP).
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.nginx-proxy-manager.description**: label met een beschrijving van
      Nginx Proxy Manager.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check:
      `["CMD", "/usr/bin/check-health"]`.
    - **interval**: de tijd tussen twee health checks (1 minuut en 30 seconden).
    - **timeout**: de tijd die een health check mag duren voordat die als
      mislukt geldt (10 seconden).
    - **retries**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt (3 pogingen).
    - **start_period**: de beginperiode waarin een mislukte health check niet
      meetelt voor de pogingen (40 seconden).
    - **start_interval**: de tijd tussen health checks tijdens het opstarten (5
      seconden).

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
HOST_DB=nginx-proxy-manager_db

# Database name: Change this to your desired database name
NAME_DB=nginx_proxy_manager_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=nginx-proxy-manager

# Nginx Proxy Manager: Admin settings
# Set a secure email and password for the admin user.
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongUniqueAdminPassword1234
```

- **`ROOT_PASSWORD_DB`**: het wachtwoord van de rootgebruiker van de
  MariaDB-instantie. Deze gebruiker heeft alle beheerrechten. Gebruik een
  veilige, unieke waarde.
- **`HOST_DB`**: hostnaam of IP-adres van de databaseserver. In opstellingen met
  Docker is dit meestal de naam van de service (`nginx-proxy-manager_db`).
- **`NAME_DB`**: de naam van de database die de toepassing gebruikt (bijv.
  `nginx_proxy_manager_db`).
- **`PASSWORD_DB`**: het wachtwoord van de databasegebruiker zonder rootrechten
  (`USER_DB`). Zorg dat het veilig is.
- **`PORT_DB`**: het poortnummer waarop MariaDB luistert (standaard: 3306).
- **`USER_DB`**: de gebruikersnaam waarmee verbinding wordt gemaakt met de
  database.
- **`ADMIN_EMAIL`**: het eerste e-mailadres van de beheerder van Nginx Proxy
  Manager.
- **`ADMIN_PASSWORD`**: het eerste wachtwoord van de beheerder van Nginx Proxy
  Manager. Gebruik een sterk, uniek wachtwoord om het beheerdersaccount te
  beveiligen.

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
log-bin = nginx-proxy-manager_binlog
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

1. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Nginx Proxy Manager via deze URL:

```bash
http://your-ip-address:81
```

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
Heb je deze waarden gewijzigd in het bestand `.env` en/of `stack.env`, gebruik
dan die inloggegevens in plaats van de standaardwaarden.
{{% /alert %}}

**Gebruikersnaam**:

```bash
admin@example.com
```

**Wachtwoord**:

```bash
StrongUniqueAdminPassword1234
```

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om de standaard inloggegevens na de
eerste keer inloggen te wijzigen.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een Docker-omgeving op voor Nginx Proxy Manager en de
MariaDB-database. De configuratie definieert een eigen bridge-netwerk met vaste
IP-instellingen en beveiligingsinstellingen. De service MariaDB draait continu,
met blijvende opslag voor de databasegegevens en een eigen configuratie. De
service Nginx Proxy Manager hangt af van de service MariaDB en draait met
blijvende opslag voor de gegevens van de toepassing en de SSL-certificaten.
Beide services hebben uitgebreide logging, een herstartbeleid, health checks en
beveiligingsopties, voor een betrouwbare, efficiënte en veilige werking.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/nginx-proxy-manager/compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/nginx-proxy-manager/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/nginx-proxy-manager/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/nginx-proxy-manager/my.cnf
