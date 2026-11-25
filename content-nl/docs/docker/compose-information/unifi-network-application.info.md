---
title: "unifi-network-application.info"
description:
  "Rol de UniFi Network Application uit met Docker Compose, een hulpmiddel voor
  netwerkbeheer, met een MongoDB-database. Met het eigen Docker-netwerk, de
  database- en toepassingsservices, het omgevingsbestand en het
  initialisatiescript van MongoDB."
url: "docker/compose-info/unifi-network-application"
aliases:
  - "docker/compose-info/unifi-controller"
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
  - UniFi Network Application
  - MongoDB
  - Docker Compose
  - Network Management
  - Docker Networking
keywords:
  - Docker UniFi Network Application setup
  - Docker Compose UniFi configuration
  - UniFi Network Application Docker persistent storage
  - Network management Docker container
  - Docker network configuration
  - MongoDB init script

weight: 4124

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand rolt
de UniFi Network Application uit (voorheen de UniFi Controller), een hulpmiddel
voor netwerkbeheer, samen met een MongoDB-database. De toepassing start pas als
de database gezond is.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `unifi-network-application`, ingesteld met `name:` op het
  hoogste niveau van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk, een databaseservice met MongoDB en
  een service UniFi Network Application in.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-omgevingsbestand**: [stack.env]
- **RAW-initialisatiescript van MongoDB**: [init-mongo.sh]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: unifi-network-application

networks:
  unifi-network-application_net:
    attachable: false
    internal: false
    external: false
    name: unifi-network-application
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.19.0/24
          ip_range: 172.20.19.0/24
          gateway: 172.20.19.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "unifi"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.unifi-network-application.network.description:
        "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `unifi-network-application_net`.
- **attachable: false**: andere containers kunnen zich niet aan dit netwerk
  koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt.
- **name: unifi-network-application**: geeft de naam van het netwerk.
- **driver: bridge**: gebruikt het stuurprogramma bridge voor een afgeschermd
  netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **subnet**: `172.20.19.0/24`.
  - **ip_range**: `172.20.19.0/24`.
  - **gateway**: `172.20.19.1`.
- **driver_opts**: extra opties voor het netwerkstuurprogramma.
  - **com.docker.network.bridge.default_bridge: "false"**: geeft aan dat dit
    niet de standaardbridge van Docker is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: laat uitgaand
    verkeer eruitzien alsof het van de host komt.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt de
    bridge aan alle beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "unifi"**: geeft de bridge-interface op de
    host een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.unifi-network-application.network.description**: een label met een
    beschrijving van het netwerk.

## Configuratie van de services {#services-configuration}

### Databaseservice (`unifi-network-application_db`) {#database-service-unifi-network-application_db}

```yaml
services:
  unifi-network-application_db:
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
    container_name: unifi-network-application_db
    image: docker.io/mongo:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/unifi-network-application/production/db:/data/db
      - /docker/unifi-network-application/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh:ro
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
      MONGO_AUTHSOURCE: ${ROOT_AUTHSOURCE_DB} # Fill in the value in both the .env and stack.env files
      MONGO_INITDB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MONGO_INITDB_ROOT_USERNAME: ${ROOT_USER_DB} # Fill in the value in both the .env and stack.env files
      MONGO_DBNAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MONGO_PASS: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MONGO_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
    hostname: unifi-network-application_db
    networks:
      unifi-network-application_net:
        ipv4_address: 172.20.19.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.unifi-network-application.db.description: "is an Mongo database."
    healthcheck:
      disable: false
      test:
        [
          "CMD",
          "mongosh",
          "mongodb://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:${PORT_DB}/?authSource=${ROOT_AUTHSOURCE_DB}",
          "--quiet",
          "--eval",
          "printjson(db.runCommand('ping').ok)",
        ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
  threads in de container, wat de host beschermt tegen fork bombs.
- **restart: unless-stopped**: start de container opnieuw, tenzij die
  uitdrukkelijk is gestopt.
- **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
  bestand en maximaal 2 bestanden.
- **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
  wordt gestopt.
- **container_name: unifi-network-application_db**: geeft de container een naam.
- **image: docker.io/mongo**: gebruikt de image van MongoDB.
- **pull_policy: if_not_present**: haalt de image alleen op als die niet lokaal
  aanwezig is.
- **volumes**: koppelt mappen of bestanden van de host in de container.
  - **/docker/unifi-network-application/production/db:/data/db**: bewaart de
    databasebestanden blijvend.
  - **/docker/unifi-network-application/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh:ro**:
    koppelt het initialisatiescript alleen-lezen. Het draait bij de eerste start
    en maakt de gebruiker van de toepassing.
- **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
  Beide staan erin met `required: false`, zodat Compose het bestand dat
  ontbreekt overslaat.
- **environment**: stelt omgevingsvariabelen in.
  - **PUID / PGID**: de gebruikers- en groeps-ID waarmee de container draait.
  - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **MONGO_AUTHSOURCE**: de authenticatiedatabase, uit `ROOT_AUTHSOURCE_DB`.
  - **MONGO_INITDB_ROOT_USERNAME / MONGO_INITDB_ROOT_PASSWORD**: de
    rootinloggegevens, uit `ROOT_USER_DB` en `ROOT_PASSWORD_DB`.
  - **MONGO_DBNAME / MONGO_USER / MONGO_PASS**: de databasenaam, de gebruiker en
    het wachtwoord die het initialisatiescript gebruikt, uit `NAME_DB`,
    `USER_DB` en `PASSWORD_DB`.
- **hostname: unifi-network-application_db**: stelt de hostnaam van de container
  in.
- **networks**: koppelt de service aan het netwerk met het vaste IP-adres
  `172.20.19.2`.
- **security_opt**: `no-new-privileges:true` voorkomt dat de container nieuwe
  rechten krijgt.
- **labels**: `com.unifi-network-application.db.description` beschrijft de
  database.
- **healthcheck**: gebruikt `mongosh` om zich aan te melden met de gebruiker van
  de toepassing en een commando `ping` uit te voeren.
  - **interval**: 10 seconden.
  - **timeout**: 5 seconden.
  - **retries**: 3.
  - **start_period**: 10 seconden.
  - **start_interval**: 5 seconden.

### Toepassingsservice (`unifi-network-application_app`) {#application-service-unifi-network-application_app}

```yaml
services:
  unifi-network-application_app:
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
    container_name: unifi-network-application
    image: ghcr.io/linuxserver/unifi-network-application:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      unifi-network-application_db:
        condition: service_healthy
    volumes:
      - /docker/unifi-network-application/production/app:/config
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
      MONGO_AUTHSOURCE: ${ROOT_AUTHSOURCE_DB} # Fill in the value in both the .env and stack.env files
      MONGO_HOST: ${HOST_DB} # Fill in the value in both the .env and stack.env files
      MONGO_DBNAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MONGO_PASS: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MONGO_PORT: ${PORT_DB} # Fill in the value in both the .env and stack.env files
      MONGO_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      BASICAUTH: ${BASICAUTH} # Fill in the value in both the .env and stack.env files
      # MONGO_URL: ${MONGODB_URL}  # Fill in the value in both the .env and stack.env files
      MEM_LIMIT: 2048
      MEM_STARTUP: 2048
      # MONGO_TLS:
    domainname: unifi-network-application.local # Customize this with your own domain, e.g., `unifi-network-application.local` to `unifi-network-application.your-fqdn-here.com`.
    hostname: unifi-network-application
    networks:
      unifi-network-application_net:
        ipv4_address: 172.20.19.3
    ports:
      - "1900:1900/udp" # Required for Make controller discoverable on L2
      - "3478:3478/udp" # Unifi STUN port
      - "5514:5514/tcp" # Remote syslog port
      - "6789:6789/tcp" # For mobile throughput test
      - "8080:8080/tcp" # Required for device communication
      - "8443:8443/tcp" # Unifi web admin port
      - "8843:8843/tcp" # Unifi guest portal HTTPS redirect port
      - "8880:8880/tcp" # Unifi guest portal HTTP redirect port
      - "10001:10001/udp" # Required for AP discovery
    security_opt:
      - no-new-privileges:true
    labels:
      com.unifi-network-application.description:
        "is an end-to-end system of network devices across different locations —
        all controlled from a single interface."
    healthcheck:
      disable: true
```

- **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
  threads in de container, wat de host beschermt tegen fork bombs.
- **restart**, **logging**, **stop_grace_period**, **pull_policy**: hetzelfde
  gedrag als bij de databaseservice.
- **container_name: unifi-network-application**: geeft de container een naam.
- **image: ghcr.io/linuxserver/unifi-network-application**: gebruikt de image
  van de UniFi Network Application van LinuxServer.io.
- **depends_on**: start deze service pas als de database `service_healthy` is.
- **volumes**: `/docker/unifi-network-application/production/app:/config`
  bewaart de configuratie van de toepassing.
- **env_file**: hetzelfde gedrag als bij de databaseservice.
- **environment**: stelt omgevingsvariabelen in.
  - **PUID / PGID / TZ**: gebruikers- en groeps-ID en de tijdzone.
  - **MONGO_AUTHSOURCE / MONGO_HOST / MONGO_DBNAME / MONGO_PASS / MONGO_PORT /
    MONGO_USER**: de verbindingsinstellingen van de database, uit het
    omgevingsbestand.
  - **BASICAUTH**: zet basisauthenticatie aan, uit `BASICAUTH`.
  - **# MONGO_URL**: uitgecommentarieerd. Een alternatief voor de losse
    verbindingsinstellingen, uit `MONGODB_URL`.
  - **MEM_LIMIT / MEM_STARTUP**: geheugenlimiet en opstartgeheugen van de
    toepassing in MB (2048).
  - **# MONGO_TLS**: uitgecommentarieerd. Hiermee kun je TLS aanzetten voor de
    verbinding met de database.
- **domainname: unifi-network-application.local**: stelt de domeinnaam van de
  container in. Vervang die door je eigen domein.
- **hostname: unifi-network-application**: stelt de hostnaam van de container
  in.
- **networks**: koppelt de service aan het netwerk met het vaste IP-adres
  `172.20.19.3`.
- **ports**: koppelt poorten van de host aan poorten van de container.
  - **1900/udp**: maakt de controller vindbaar op L2.
  - **3478/udp**: STUN-poort van UniFi.
  - **5514/tcp**: poort voor syslog op afstand.
  - **6789/tcp**: doorvoertest voor mobiel.
  - **8080/tcp**: communicatie met apparaten.
  - **8443/tcp**: poort van de webbeheerinterface van UniFi.
  - **8843/tcp**: HTTPS-doorverwijzing van het gastportaal.
  - **8880/tcp**: HTTP-doorverwijzing van het gastportaal.
  - **10001/udp**: detectie van toegangspunten.
- **security_opt**: `no-new-privileges:true` voorkomt dat de container nieuwe
  rechten krijgt.
- **labels**: een label met een beschrijving van de toepassing.
- **healthcheck: disable: true**: de health check staat uit voor deze container.

## Omgevingsvariabelen {#environment-variables}

De inloggegevens van de database staan in een omgevingsbestand, buiten het
Compose-bestand. Gebruik `.env` voor Docker Compose en `stack.env` voor
Portainer. Beide bestanden moeten dezelfde waarden bevatten.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# Database Configuration: ROOT USER
# Change the MongoDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_AUTHSOURCE_DB=admin
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234
ROOT_USER_DB=root

# Database Configuration: USER
# Database host and connection settings
HOST_DB=unifi-network-application_db

# Database name:
NAME_DB=unifi_network_application_db

# MongoDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MongoDB connection port (default: 27017)
PORT_DB=27017

# MongoDB username: Change this to your desired username
USER_DB=unifi

# MongoDB URL - Make sure to replace with real credentials
MONGODB_URL=mongodb://root:StrongUniqueRootPassword1234@mongo:27017/?authSource=admin

# Enable Basic Authentication for additional security (set to true if needed)
BASICAUTH=false
```

- **`ROOT_AUTHSOURCE_DB`**: de authenticatiedatabase van de rootgebruiker
  (`admin`).
- **`ROOT_USER_DB`**: de gebruikersnaam van de MongoDB-rootgebruiker.
- **`ROOT_PASSWORD_DB`**: het wachtwoord van de MongoDB-rootgebruiker. Gebruik
  een veilige, unieke waarde.
- **`HOST_DB`**: hostnaam van de databaseserver. Dit is de naam van de service
  (`unifi-network-application_db`).
- **`NAME_DB`**: de naam van de database die de toepassing gebruikt.
- **`USER_DB`**: de gebruikersnaam waarmee de toepassing verbinding maakt met de
  database.
- **`PASSWORD_DB`**: het wachtwoord van die gebruiker. Gebruik een veilige,
  unieke waarde.
- **`PORT_DB`**: de poort waarop MongoDB luistert (standaard: 27017).
- **`MONGODB_URL`**: een verbindings-URL, alleen gebruikt als `MONGO_URL` in het
  Compose-bestand aan staat. Vervang die door echte inloggegevens.
- **`BASICAUTH`**: zet op `true` om basisauthenticatie aan te zetten.

## Initialisatiescript van MongoDB {#mongodb-init-script}

Het script `init-mongo.sh` wordt gekoppeld in `/docker-entrypoint-initdb.d/` en
draait alleen als de database voor het eerst wordt geïnitialiseerd.

```bash
#!/bin/bash

if which mongosh > /dev/null 2>&1; then
  mongo_init_bin='mongosh'
else
  mongo_init_bin='mongo'
fi
"${mongo_init_bin}" << EOF
use ${MONGO_AUTHSOURCE}
db.auth("${MONGO_INITDB_ROOT_USERNAME}", "${MONGO_INITDB_ROOT_PASSWORD}")
db.createUser({
  user: "${MONGO_USER}",
  pwd: "${MONGO_PASS}",
  roles: [
    { db: "${MONGO_DBNAME}", role: "dbOwner" },
    { db: "${MONGO_DBNAME}_stat", role: "dbOwner" }
  ]
})
EOF
```

- **mongosh or mongo**: gebruikt `mongosh` als dat beschikbaar is en anders
  `mongo`.
- **use ${MONGO_AUTHSOURCE}**: kiest de authenticatiedatabase.
- **db.auth(...)**: meldt zich aan als rootgebruiker.
- **db.createUser(...)**: maakt de gebruiker van de toepassing met de rol
  `dbOwner` op de database van de toepassing en op de database `_stat`.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Kopieer `init-mongo.sh` naar
   `/docker/unifi-network-application/init-mongo.sh`. Docker maakt de andere
   mappen onder `/docker/unifi-network-application/` bij de eerste start.

2. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

3. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van de UniFi Network Application via deze URL:

```bash
https://your-ip-address:8443
```

De toepassing gebruikt een zelfondertekend certificaat, dus je browser toont bij
het eerste bezoek een waarschuwing.

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
Bij het eerste bezoek maakt de installatiewizard het beheerdersaccount of zet
die een back-up terug.
{{% /alert %}}

**Gebruikersnaam**: gemaakt tijdens de installatie

**Wachtwoord**: gemaakt tijdens de installatie

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om tijdens de installatie een sterke
gebruikersnaam en een sterk wachtwoord te maken.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand rolt de UniFi Network Application uit met een eigen
MongoDB-database. Het maakt een eigen bridge-netwerk met vaste IP-adressen,
maakt de databasegebruiker met een initialisatiescript en start de toepassing
pas als de database gezond is. De inloggegevens staan in een omgevingsbestand,
en beide services starten automatisch opnieuw, loggen efficiënt en draaien met
`no-new-privileges`.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/unifi-network-application/compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/unifi-network-application/stack.env
[init-mongo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/unifi-network-application/init-mongo.sh
