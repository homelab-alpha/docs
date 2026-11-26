---
title: "speedtest-tracker-beta.info"
description:
  "Dit bestand rolt de bètaversie van Speedtest Tracker uit met een
  MariaDB-database. Het gebruikt de image `alexjustesen`, een eigen netwerk en
  de poorten 80 en 443."
url: "docker/compose-info/speedtest-tracker-beta"
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
  - Speedtest Tracker Beta
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Speedtest Tracker Beta
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Speedtest Tracker
  - MariaDB
  - Internet Speed Monitoring

weight: 4122

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het rolt de
bètaversie van Speedtest Tracker uit met een MariaDB-database. Het gebruikt de
image `alexjustesen`, een eigen netwerk en de poorten 80 en 443.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `speedtest-tracker-beta`, ingesteld met `name:` op het
  hoogste niveau van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de services van de bètaversie
  van Speedtest Tracker in.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-omgevingsbestand**: [stack.env]
- **RAW-configuratiebestand van MariaDB**: [my.cnf]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: speedtest-tracker-beta

networks:
  # Joins the network of the speedtest-tracker stack, which must be running first.
  speedtest-tracker_net:
    external: true
    name: speedtest-tracker
```

- **networks**: deze stack heeft geen eigen netwerk. Hij doet mee in het netwerk
  van de stack `speedtest-tracker`.
  - **speedtest-tracker_net**: de naam van het netwerk in dit Compose-bestand.
  - **external: true**: het netwerk bestaat al; Docker Compose maakt of
    verwijdert het niet. Start eerst de stack `speedtest-tracker`.
  - **name: speedtest-tracker**: de naam van het netwerk in Docker
    (`172.20.23.0/24`). De database gebruikt `172.20.23.4` en de app
    `172.20.23.5`; `speedtest-tracker` gebruikt `.2` en `.3`.

## Configuratie van de services {#services-configuration}

### `speedtest-tracker-beta_db`

```yaml
services:
  speedtest-tracker-beta_db:
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
    container_name: speedtest-tracker-beta_db
    image: docker.io/mariadb:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/speedtest-tracker-beta/testing/db:/var/lib/mysql
      - /docker/speedtest-tracker-beta/testing/my.cnf:/etc/my.cnf
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
      TZ: Europe/Amsterdam
      MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}
      MARIADB_DATABASE: ${NAME_DB}
      MARIADB_USER: ${USER_DB}
      MARIADB_PASSWORD: ${PASSWORD_DB}
    hostname: speedtest-tracker-beta_db
    networks:
      speedtest-tracker_net:
        ipv4_address: 172.20.23.4
    security_opt:
      - no-new-privileges:true
    labels:
      com.speedtest-tracker.db.description: "is a MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **speedtest-tracker-beta_db**: de definitie van de service.
  - **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: speedtest-tracker-beta_db**: geeft de container een naam.
  - **image: docker.io/mariadb**: gebruikt deze image.
  - **pull_policy: if_not_present**: haalt de image alleen op als die niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/speedtest-tracker-beta/testing/db:/var/lib/mysql**
    - **/docker/speedtest-tracker-beta/testing/my.cnf:/etc/my.cnf**
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: 1000**: de gebruikers-ID waarmee de container draait.
    - **PGID: 1000**: de groeps-ID waarmee de container draait.
    - **TZ: Europe/Amsterdam**
    - **MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}**
    - **MARIADB_DATABASE: ${NAME_DB}**
    - **MARIADB_USER: ${USER_DB}**
    - **MARIADB_PASSWORD: ${PASSWORD_DB}**
  - **hostname: speedtest-tracker-beta_db**: stelt de hostnaam van de container
    in.
  - **networks**: koppelt de service aan `speedtest-tracker_net` met het vaste
    IP-adres `172.20.23.4`.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container nieuwe
    rechten krijgt.
  - **labels**: een label met een beschrijving.
  - **healthcheck**: voert `healthcheck.sh --connect --innodb_initialized` uit.
    - **interval / timeout / retries / start_period / start_interval**: 10s / 5s
      / 3 / 10s / 5s.

### `speedtest-tracker-beta_app`

```yaml
services:
  speedtest-tracker-beta_app:
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
    container_name: speedtest-tracker-beta
    image: ghcr.io/alexjustesen/docker-speedtest-tracker:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      speedtest-tracker-beta_db:
        condition: service_healthy
        restart: true
    volumes:
      - /docker/speedtest-tracker-beta/testing/.cert:/config/keys
      - /docker/speedtest-tracker-beta/testing/app:/config
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
      TZ: Europe/Amsterdam
      DB_CONNECTION: mysql
      DB_HOST: ${HOST_DB}
      DB_PORT: ${PORT_DB}
      DB_DATABASE: ${NAME_DB}
      DB_USERNAME: ${USER_DB}
      DB_PASSWORD: ${PASSWORD_DB}
      APP_KEY: ${APP_KEY}
      APP_LOCALE: en_EN
      APP_NAME: "Speedtest Tracker Beta"
      APP_TIMEZONE: Europe/Amsterdam
      APP_URL: http://localhost
      ASSET_URL: http://localhost
      # APP_DEBUG: true # Uncomment for debug mode
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_NAME: ${ADMIN_NAME}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      SPEEDTEST_INTERNET_CHECK_HOSTNAME: "google.com"
      SPEEDTEST_SCHEDULE: "*/10 * * * *"
      # SPEEDTEST_SCHEDULE: "*/1 * * * *"
      PUBLIC_DASHBOARD: "true"
      CHART_BEGIN_AT_ZERO: "true"
      CHART_DATETIME_FORMAT: "M jS, H:i"
      DATETIME_FORMAT: "F jS, Y, H:i"
      DISPLAY_TIMEZONE: "Europe/Amsterdam"
      PRUNE_RESULTS_OLDER_THAN: "31"
      API_RATE_LIMIT: "30"
    domainname: speedtest-tracker-beta.local
    hostname: speedtest-tracker-beta
    networks:
      speedtest-tracker_net:
        ipv4_address: 172.20.23.5
    ports:
      - "80:8080/tcp"
      - "443:8443/tcp"
    security_opt:
      - no-new-privileges:true
    labels:
      com.speedtest-tracker.description:
        "a self-hosted application that monitors the performance and uptime of
        your internet connection."
    healthcheck:
      disable: false
      test: curl -fSs APP_URL/api/healthcheck | jq -r .message || exit 1
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **speedtest-tracker-beta_app**: de definitie van de service.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: speedtest-tracker-beta**: geeft de container een naam.
  - **image: ghcr.io/alexjustesen/docker-speedtest-tracker**: gebruikt deze
    image.
  - **pull_policy: if_not_present**: haalt de image alleen op als die niet
    lokaal aanwezig is.
  - **depends_on**: start deze service pas als `speedtest-tracker-beta_db` de
    toestand `service_healthy` heeft.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/speedtest-tracker-beta/testing/.cert:/config/keys**
    - **/docker/speedtest-tracker-beta/testing/app:/config**
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: 1000**: de gebruikers-ID waarmee de container draait.
    - **PGID: 1000**: de groeps-ID waarmee de container draait.
    - **TZ: Europe/Amsterdam**
    - **DB_CONNECTION: mysql**
    - **DB_HOST: ${HOST_DB}**
    - **DB_PORT: ${PORT_DB}**
    - **DB_DATABASE: ${NAME_DB}**
    - **DB_USERNAME: ${USER_DB}**
    - **DB_PASSWORD: ${PASSWORD_DB}**
    - **APP_KEY: ${APP_KEY}**
    - **APP_LOCALE: en_EN**
    - **APP_NAME: Speedtest Tracker Beta**
    - **APP_TIMEZONE: Europe/Amsterdam**
    - **APP_URL: http://localhost**
    - **ASSET_URL: http://localhost**
    - **APP_DEBUG**: uitgecommentarieerd, dus de debugmodus staat uit. Haal het
      commentaarteken alleen weg tijdens het debuggen.
    - **ADMIN_EMAIL: ${ADMIN_EMAIL}**
    - **ADMIN_NAME: ${ADMIN_NAME}**
    - **ADMIN_PASSWORD: ${ADMIN_PASSWORD}**
    - **SPEEDTEST_INTERNET_CHECK_HOSTNAME: google.com**
    - **SPEEDTEST_SCHEDULE: */10 * * * ***
    - **PUBLIC_DASHBOARD: true**
    - **CHART_BEGIN_AT_ZERO: true**
    - **CHART_DATETIME_FORMAT: M jS, H:i**
    - **DATETIME_FORMAT: F jS, Y, H:i**
    - **DISPLAY_TIMEZONE: Europe/Amsterdam**
    - **PRUNE_RESULTS_OLDER_THAN: 31**
    - **API_RATE_LIMIT: 30**
  - **domainname: speedtest-tracker-beta.local**: stelt de domeinnaam van de
    container in. Vervang die door je eigen domein.
  - **hostname: speedtest-tracker-beta**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan `speedtest-tracker_net` met het vaste
    IP-adres `172.20.23.5`.
  - **ports**: koppelt poorten van de host aan poorten van de container.
    - **"80:8080/tcp"**
    - **"443:8443/tcp"**
  - **security_opt: no-new-privileges:true**: voorkomt dat de container nieuwe
    rechten krijgt.
  - **labels**: een label met een beschrijving.
  - **healthcheck**: voert
    `curl -fSs APP_URL/api/healthcheck | jq -r .message || exit 1` uit.
    - **interval / timeout / retries / start_period / start_interval**: 10s / 5s
      / 3 / 10s / 5s.

## Omgevingsvariabelen {#environment-variables}

De variabelen staan in een omgevingsbestand, buiten het Compose-bestand. Gebruik
`.env` voor Docker Compose en `stack.env` voor Portainer. Beide bestanden moeten
dezelfde waarden bevatten.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# Database Configuration: ROOT USER
# Change the MariaDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=speedtest-tracker-beta_db

# Database name: Change this to your desired database name
NAME_DB=speedtest_tracker_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=speedtest-tracker

# Application Key
# Define a secure application key for encryption.
# To generate a new secure key, run the following in the terminal:
#
#   echo -n 'base64:'; openssl rand -base64 32
#
# This will output a base64 encoded key.
# Example output: base64:BehUUH9rR5A+DDVqJDJLrj31X13asZ8YNNt9J+dauGg=
APP_KEY=Insert_the_App_key_here

# Admin Credentials for Dashboard Access
# Choose strong and unique credentials for admin access to the application dashboard.
# Avoid using default usernames and passwords in production.
ADMIN_EMAIL=admin@example.com
ADMIN_NAME=admin
ADMIN_PASSWORD=StrongUniqueUserPassword9012
```

- **`ROOT_PASSWORD_DB`**: wijzig het rootwachtwoord van MariaDB in een sterk,
  uniek wachtwoord naar keuze. Zorg dat het wachtwoord complex is en niet
  makkelijk te raden.
- **`HOST_DB`**: host van de database en verbindingsinstellingen
- **`NAME_DB`**: databasenaam: wijzig dit in de gewenste databasenaam
- **`PASSWORD_DB`**: wachtwoord van de MariaDB-gebruiker: wijzig dit in een
  sterk, uniek wachtwoord
- **`PORT_DB`**: verbindingspoort van MariaDB (standaard: 3306)
- **`USER_DB`**: gebruikersnaam van MariaDB: wijzig dit in de gewenste
  gebruikersnaam
- **`APP_KEY`**: applicatiesleutel. Definieer een veilige applicatiesleutel voor
  versleuteling. Voer dit uit in de terminal om een nieuwe, veilige sleutel te
  maken: echo -n 'base64:'; openssl rand -base64 32 Dit geeft een sleutel in
  base64. Voorbeeld van de uitvoer:
  base64:BehUUH9rR5A+DDVqJDJLrj31X13asZ8YNNt9J+dauGg=
- **`ADMIN_EMAIL`**: inloggegevens van de beheerder voor het dashboard. Kies
  sterke en unieke inloggegevens voor de beheerderstoegang tot het dashboard van
  de toepassing. Gebruik in productie geen standaardgebruikersnamen en
  -wachtwoorden.
- **`ADMIN_NAME`**
- **`ADMIN_PASSWORD`**

## Configuratie van MariaDB {#mariadb-configuration}

Het bestand `my.cnf` wordt in de databasecontainer gekoppeld als `/etc/my.cnf`.
Het is gelijk aan het bestand op de pagina's
[Speedtest Tracker](/docker/compose-info/speedtest-tracker/) en
[MariaDB](/docker/compose-info/mariadb/). Zie [my.cnf] voor het volledige
bestand met commentaar.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start eerst de stack `speedtest-tracker`. Deze stack doet mee in het netwerk
   `speedtest-tracker`, met de database op `172.20.23.4` en de app op
   `172.20.23.5`.

2. Kopieer `my.cnf` naar `/docker/speedtest-tracker-beta/testing/my.cnf`. Docker
   maakt de andere mappen onder `/docker/speedtest-tracker-beta/` bij de eerste
   start.

3. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

4. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van de bètaversie van Speedtest Tracker via deze URL:

**HTTP**:

```bash
http://your-ip-address:80
```

**HTTPS**:

```bash
https://your-ip-address:443
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
StrongUniqueUserPassword9012
```

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om de standaard inloggegevens na de
eerste keer inloggen te wijzigen.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand rolt de bètaversie van Speedtest Tracker uit met een eigen
MariaDB-database. Het doet mee in het netwerk van de gewone Speedtest Tracker
(`172.20.23.0/24`) en verschilt daarvan in de image, de namen, de paden op de
host (`/docker/speedtest-tracker-beta/testing/`), de gepubliceerde poorten (80
en 443) en de debugmodus die aan staat.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/speedtest-tracker-beta/compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/speedtest-tracker-beta/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/speedtest-tracker-beta/my.cnf
