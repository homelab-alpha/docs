---
title: "uptime-kuma.info"
description:
  "Rol een instantie van Uptime Kuma uit met een MariaDB-database, om de
  beschikbaarheid van websites te bewaken en meldingen te sturen. Met het eigen
  Docker-netwerk, de databaseservice, de service Uptime Kuma en de omgevings- en
  configuratiebestanden van MariaDB."
url: "docker/compose-info/uptime-kuma"
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
  - MariaDB
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Uptime Kuma
  - MariaDB
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Self-hosted Monitoring

weight: 4126

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt een instantie van Uptime Kuma in en rolt die uit, om de beschikbaarheid
van websites te bewaken en meldingen te sturen. Uptime Kuma bewaart zijn
gegevens in een aparte MariaDB-container, die eerst start en gezond moet zijn
voordat Uptime Kuma start.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `uptime-kuma`, ingesteld met `name:` op het hoogste niveau
  van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: dit bestand stelt een eigen Docker-netwerk, een
  databaseservice met MariaDB en een service Uptime Kuma in, om de
  beschikbaarheid van websites te bewaken en meldingen te sturen.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-omgevingsbestand**: [stack.env]
- **RAW-configuratiebestand van MariaDB**: [my.cnf]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: uptime-kuma

networks:
  uptime-kuma_net:
    attachable: false
    internal: false
    external: false
    name: uptime-kuma
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.19.3.0/24
          ip_range: 172.19.3.0/24
          gateway: 172.19.3.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "uptimekuma"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.uptime-kuma.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `uptime-kuma_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk is niet extern gedefinieerd, maar wordt in
  dit Compose-bestand gemaakt.
- **name: uptime-kuma**: geeft de naam van het netwerk.
- **driver: bridge**: gebruikt het stuurprogramma bridge voor een afgeschermd
  netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **driver: default**: gebruikt het standaardstuurprogramma voor IPAM.
  - **config**: stelt de configuratie van de IP-adressen in.
    - **subnet**: definieert het subnet (`172.19.3.0/24`) van het netwerk.
    - **ip_range**: beperkt het IP-bereik binnen het subnet.
    - **gateway**: stelt de gateway (`172.19.3.1`) van het netwerk in.
- **driver_opts**: extra opties voor het netwerkstuurprogramma.
  - **com.docker.network.bridge.default_bridge: "false"**: geeft aan dat dit
    niet de standaardbridge van Docker is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: laat uitgaand
    verkeer eruitzien alsof het van de host komt.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt de
    bridge aan alle beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "uptimekuma"**: geeft de bridge-interface
    op de host een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.uptime-kuma.network.description**: een label met een beschrijving van
    het netwerk.

## Configuratie van de services {#services-configuration}

### Databaseservice (`uptime-kuma_db`) {#database-service-uptime-kuma_db}

```yaml
services:
  uptime-kuma_db:
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
    container_name: uptime-kuma_db
    image: docker.io/mariadb:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/uptime-kuma/production/db:/var/lib/mysql
      - /docker/uptime-kuma/production/my.cnf:/etc/my.cnf
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
    hostname: uptime-kuma_db
    networks:
      uptime-kuma_net:
        ipv4_address: 172.19.3.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma.db.description: "is an MariaDB database."
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
- **uptime-kuma_db**: de naam van de service voor de MariaDB-container.
  - **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: zorgt dat de container opnieuw start, tenzij
    die uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: uptime-kuma_db**: geeft de container de naam
    "uptime-kuma_db".
  - **image: docker.io/mariadb**: gebruikt de image van MariaDB.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/uptime-kuma/production/db:/var/lib/mysql**: bewaart de
      databasebestanden blijvend.
    - **/docker/uptime-kuma/production/my.cnf:/etc/my.cnf**: koppelt het
      configuratiebestand van MariaDB.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: geeft
      MariaDB toegang tot de informatie over de geheugendruk van de host.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID / PGID**: de gebruikers- en groeps-ID waarmee de container draait.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **MARIADB_ROOT_PASSWORD**: het rootwachtwoord, uit `ROOT_PASSWORD_DB`.
    - **MARIADB_DATABASE**: de database die wordt gemaakt, uit `NAME_DB`.
    - **MARIADB_USER**: de databasegebruiker die wordt gemaakt, uit `USER_DB`.
    - **MARIADB_PASSWORD**: het wachtwoord van die gebruiker, uit `PASSWORD_DB`.
  - **hostname: uptime-kuma_db**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `uptime-kuma_net`.
    - **ipv4_address: 172.19.3.2**: geeft de container een vast IP-adres.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.uptime-kuma.db.description**: label met een beschrijving van de
      database.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: voert `healthcheck.sh --connect --innodb_initialized` uit, dat
      controleert of MariaDB verbindingen accepteert en of InnoDB is
      geïnitialiseerd.
    - **interval**: de tijd tussen twee health checks (10 seconden).
    - **timeout**: de tijd die een health check mag duren voordat die als
      mislukt geldt (5 seconden).
    - **retries**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt (3 pogingen).
    - **start_period**: de beginperiode waarin een mislukte health check niet
      meetelt voor de pogingen (10 seconden).
    - **start_interval**: de tijd tussen health checks tijdens de opstartperiode
      (5 seconden).

### Toepassingsservice (`uptime-kuma_app`) {#application-service-uptime-kuma_app}

```yaml
services:
  uptime-kuma_app:
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
    container_name: uptime-kuma
    image: ghcr.io/louislam/uptime-kuma:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      uptime-kuma_db:
        condition: service_healthy
    volumes:
      - /docker/uptime-kuma/production/app:/app/data
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
        ipv4_address: 172.19.3.3
    ports:
      - "3001:3001/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma.description:
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
```

- **uptime-kuma_app**: de naam van de service voor de container van Uptime Kuma.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart**, **logging**, **stop_grace_period**, **pull_policy**: hetzelfde
    gedrag als bij de databaseservice.
  - **container_name: uptime-kuma**: geeft de container de naam "uptime-kuma".
  - **image: ghcr.io/louislam/uptime-kuma**: gebruikt de image van Uptime Kuma.
  - **depends_on**: start deze service pas als `uptime-kuma_db`
    `service_healthy` meldt.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/uptime-kuma/production/app:/app/data**: bewaart de gegevens van
      Uptime Kuma.
    - **/usr/local/share/ca-certificates:/app/data/docker-tls**: koppelt de map
      met eigen CA-certificaten.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID / PGID**: de gebruikers- en groeps-ID waarmee de container draait.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **# NODE_EXTRA_CA_CERTS: /app/data/docker-tls/root_ca.crt**:
      uitgecommentarieerd. Vervang `root_ca.crt` door je eigen
      root-CA-certificaat en haal het commentaarteken weg om het als vertrouwd
      rootcertificaat toe te voegen.
    - **MARIADB_HOST / MARIADB_PORT / MARIADB_NAME / MARIADB_USER /
      MARIADB_PASSWORD**: de verbindingsinstellingen van de database, uit
      `HOST_DB`, `PORT_DB`, `NAME_DB`, `USER_DB` en `PASSWORD_DB`.
  - **domainname: status.local**: stelt de domeinnaam van de container in.
    Vervang die door je eigen domein.
  - **hostname: status**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `uptime-kuma_net`.
    - **ipv4_address: 172.19.3.3**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de host aan poorten van de container.
    - **"3001:3001/tcp"**: koppelt TCP-poort 3001 op de host aan poort 3001 in
      de container.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.uptime-kuma.description**: label met een beschrijving van Uptime
      Kuma.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: voert `["CMD", "extra/healthcheck"]` uit.
    - **interval**, **timeout**, **retries**, **start_period**,
      **start_interval**: dezelfde waarden als bij de databaseservice.

### `uptime-kuma_socket-proxy`

```yaml
services:
  uptime-kuma_socket-proxy:
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
    container_name: uptime-kuma_socket-proxy
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
    hostname: uptime-kuma_socket-proxy
    networks:
      uptime-kuma_net:
        ipv4_address: 172.19.3.6
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma.socket-proxy.description:
        "is a read-only Docker API proxy for Uptime Kuma."
```

- **uptime-kuma_socket-proxy**: de Docker-socketproxy die alleen leest.
  `uptime-kuma_app` bereikt de Docker-API via deze proxy op poort 2375, in
  plaats van de Docker-socket te koppelen.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: uptime-kuma_socket-proxy**: geeft de container een naam.
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
  - **hostname: uptime-kuma_socket-proxy**: stelt de hostnaam van de container
    in.
  - **networks**: koppelt de service aan het netwerk van de stack met het vaste
    IP-adres `172.19.3.6`.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container extra
    rechten krijgt.
  - **labels**: een label met een beschrijving.

## Omgevingsvariabelen {#environment-variables}

De inloggegevens van de database staan in een omgevingsbestand, buiten het
Compose-bestand. Gebruik `.env` voor Docker Compose en `stack.env` voor
Portainer. Beide bestanden moeten dezelfde waarden bevatten.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# Database Configuration: ROOT USER
# Change the MariaDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=uptime-kuma_db

# Database name:
NAME_DB=uptime_kuma_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=uptime-kuma
```

- **`ROOT_PASSWORD_DB`**: het rootwachtwoord van de MariaDB-instantie. Gebruik
  een veilige, unieke waarde.
- **`HOST_DB`**: hostnaam van de databaseserver. Dit is de naam van de service
  (`uptime-kuma_db`).
- **`NAME_DB`**: de naam van de database die Uptime Kuma gebruikt.
- **`PASSWORD_DB`**: het wachtwoord van de databasegebruiker zonder rootrechten.
  Gebruik een veilige, unieke waarde.
- **`PORT_DB`**: de poort waarop MariaDB luistert (standaard: 3306).
- **`USER_DB`**: de gebruikersnaam waarmee Uptime Kuma verbinding maakt met de
  database.

## Configuratie van MariaDB {#mariadb-configuration}

Het bestand `my.cnf` wordt in de databasecontainer gekoppeld als `/etc/my.cnf`.
Het stelt de werking van de server, het afstemmen van de prestaties,
beveiliging, binaire logging, tekencodering en monitoring in. Zie [my.cnf] voor
het volledige bestand met commentaar. Dezelfde opbouw wordt uitgebreid uitgelegd
op de [Compose-pagina van MariaDB](/docker/compose-info/mariadb/).

- **Algemeen**: `server-id`, `datadir`, `skip-name-resolve` en InnoDB als
  standaardopslagengine.
- **Prestaties**: een InnoDB-bufferpool en redo-log van 1G, 8 I/O-threads voor
  lezen en schrijven, en tot 200 verbindingen.
- **Binaire logging**: aan als `uptime-kuma_binlog`, in de vorm `ROW` met
  `CRC32`-checksums, compressie en een bewaartijd van 7 dagen
  (`expire-logs-days`).
- **Tekenset**: `utf8mb4` met de sortering `utf8mb4_general_ci`.
- **Beveiliging**: `secure-file-priv` beperkt importeren en exporteren tot
  `/var/lib/mysql/`. De opties voor wachtwoordcontrole en TLS zijn
  uitgecommentarieerd.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Kopieer `my.cnf` naar `/docker/uptime-kuma/production/my.cnf`. Docker maakt
   de andere mappen onder `/docker/uptime-kuma/` bij de eerste start.

2. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

3. Start de stack:

   ```bash
   docker compose up -d
   ```

4. Om containers te bewaken, open je in Uptime Kuma **Settings → Docker Hosts**
   en voeg je een Docker-host toe met het verbindingstype **TCP / HTTP** en de
   Docker-daemon `http://uptime-kuma_socket-proxy:2375`. De stack heeft geen
   directe toegang tot de Docker-socket; deze proxy die alleen leest is de enige
   toegang.

## Standaard webtoegang {#default-web-access}

Open de webinterface van Uptime Kuma via deze URL:

```bash
http://your-ip-address:3001
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

Dit Compose-bestand zet een Docker-omgeving op voor Uptime Kuma, een
monitoringhulpmiddel dat je zelf host, vergelijkbaar met Uptime Robot, met een
eigen MariaDB-database. Het maakt een eigen bridge-netwerk met vaste
IP-adressen, start Uptime Kuma pas als de database gezond is en bewaart alle
inloggegevens in een omgevingsbestand. Beide services starten automatisch
opnieuw, loggen efficiënt en draaien met `no-new-privileges`.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/uptime-kuma/compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/uptime-kuma/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/uptime-kuma/my.cnf
