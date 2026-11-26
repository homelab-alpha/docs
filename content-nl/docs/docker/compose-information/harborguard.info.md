---
title: "harborguard.info"
description:
  "Dit bestand rolt HarborGuard uit, een platform om containers op beveiliging
  te scannen, met een webinterface om de beveiligingsbeoordelingen van
  Docker-images te beheren en in beeld te brengen. Het gebruikt een interne
  PostgreSQL-database en bewaart geen gegevens."
url: "docker/compose-info/harborguard"
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
  - HarborGuard
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - HarborGuard
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - HarborGuard
  - Container Security
  - Vulnerability Scanning

weight: 4107

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het rolt
HarborGuard uit, een platform om containers op beveiliging te scannen, met een
webinterface om de beveiligingsbeoordelingen van Docker-images te beheren en in
beeld te brengen. Het gebruikt een interne PostgreSQL-database en bewaart geen
gegevens.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `harborguard`, ingesteld met `name:` op het hoogste niveau
  van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service HarborGuard in.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-omgevingsbestand**: [stack.env]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: harborguard

networks:
  harborguard_net:
    attachable: false
    internal: false
    external: false
    name: harborguard
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.27.0/24
          ip_range: 172.20.27.0/24
          gateway: 172.20.27.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "harborguard"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.harborguard.network.description: "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `harborguard_net`.
- **attachable: false**: andere containers kunnen zich niet aan dit netwerk
  koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt.
- **name: harborguard**: geeft de naam van het netwerk.
- **driver: bridge**: gebruikt het stuurprogramma bridge voor een afgeschermd
  netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **subnet**: `172.20.27.0/24`.
  - **ip_range**: `172.20.27.0/24`.
  - **gateway**: `172.20.27.1`.
- **driver_opts**: extra opties voor het netwerkstuurprogramma.
  - **com.docker.network.bridge.default_bridge: "false"**: geeft aan dat dit
    niet de standaardbridge van Docker is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: laat uitgaand
    verkeer eruitzien alsof het van de host komt.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt de
    bridge aan alle beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "harborguard"**: geeft de bridge-interface
    op de host een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **label met beschrijving**: beschrijft het netwerk als een afgeschermd
    bridge-netwerk.

## Configuratie van de services {#services-configuration}

### `harborguard_app`

```yaml
services:
  harborguard_app:
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
    container_name: harborguard
    image: ghcr.io/harborguard/harborguard:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
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
      POSTGRES_DB: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0
      MAX_CONCURRENT_SCANS: 3
      SCAN_TIMEOUT_MINUTES: 30
      ENABLED_SCANNERS: trivy,grype,syft,dockle,osv,dive
      VERSION_CHECK_ENABLED: true
      TRIVY_CACHE_DIR: "/opt/trivy-cache"
      GRYPE_DB_CACHE_DIR: "/opt/grype-cache"
      SYFT_CACHE_DIR: "/opt/syft-cache"
      LOG_LEVEL: info
      CLEANUP_OLD_SCANS_DAYS: 30
      STORE_RAW_SCAN_DATA: true
      STORE_METADATA_JSON: true
      USE_NORMALIZED_APIS: true
      ENABLE_LEGACY_FALLBACK: true
      AUTO_UPDATE_SUMMARIES: true
      SUMMARY_CACHE_TTL_MINUTES: 5
      ENABLE_CVE_DEDUPLICATION: true
      DASHBOARD_API_TIMEOUT_MS: 105000
      BATCH_SUMMARY_UPDATE_SIZE: 10
    domainname: harborguard.local # Customize this with your own domain, e.g., `harborguard.local` to `harborguard.your-fqdn-here.com`.
    hostname: harborguard
    extra_hosts:
      harborguard: "0.0.0.0"
    networks:
      harborguard_net:
        ipv4_address: 172.20.27.3
    ports:
      - "3016:3000/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.harborguard.description:
        "is a comprehensive container security scanning platform that provides
        an intuitive web interface for managing and visualizing security
        assessments of Docker images."
    healthcheck:
      disable: false
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s
```

- **harborguard_app**: de definitie van de service.
  - **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: harborguard**: geeft de container een naam.
  - **image: ghcr.io/harborguard/harborguard**: gebruikt deze image met de tag
    `latest`.
  - **pull_policy: if_not_present**: haalt de image alleen op als die niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/var/run/docker.sock:/var/run/docker.sock:ro**
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: 1000**: de gebruikers-ID waarmee de container draait.
    - **PGID: 1000**: de groeps-ID waarmee de container draait.
    - **TZ: Europe/Amsterdam**: stel de tijdzone in op je eigen tijdzone. De
      volledige lijst met tijdzones vind je hier:
      https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    - **POSTGRES_DB: ${NAME_DB}**: vul de waarde in zowel het bestand .env als
      het bestand stack.env in
    - **POSTGRES_PASSWORD: ${PASSWORD_DB}**: vul de waarde in zowel het bestand
      .env als het bestand stack.env in
    - **POSTGRES_USER: ${USER_DB}**: vul de waarde in zowel het bestand .env als
      het bestand stack.env in
    - **NODE_ENV: production**
    - **PORT: 3000**
    - **HOSTNAME: 0.0.0.0**
    - **MAX_CONCURRENT_SCANS: 3**
    - **SCAN_TIMEOUT_MINUTES: 30**
    - **ENABLED_SCANNERS: trivy,grype,syft,dockle,osv,dive**
    - **VERSION_CHECK_ENABLED: True**
    - **TRIVY_CACHE_DIR: /opt/trivy-cache**
    - **GRYPE_DB_CACHE_DIR: /opt/grype-cache**
    - **SYFT_CACHE_DIR: /opt/syft-cache**
    - **LOG_LEVEL: info**
    - **CLEANUP_OLD_SCANS_DAYS: 30**
    - **STORE_RAW_SCAN_DATA: True**
    - **STORE_METADATA_JSON: True**
    - **USE_NORMALIZED_APIS: True**
    - **ENABLE_LEGACY_FALLBACK: True**
    - **AUTO_UPDATE_SUMMARIES: True**
    - **SUMMARY_CACHE_TTL_MINUTES: 5**
    - **ENABLE_CVE_DEDUPLICATION: True**
    - **DASHBOARD_API_TIMEOUT_MS: 105000**
    - **BATCH_SUMMARY_UPDATE_SIZE: 10**
  - **domainname: harborguard.local**: stelt de domeinnaam van de container in.
    Vervang die door je eigen domein.
  - **hostname: harborguard**: stelt de hostnaam van de container in.
  - **extra_hosts**: laat `harborguard` in de container verwijzen naar
    `0.0.0.0`.
  - **networks**: koppelt de service aan `harborguard_net` met het vaste
    IP-adres `172.20.27.3`.
  - **ports**: koppelt poorten van de host aan poorten van de container.
    - **"3016:3000/tcp"**: HTTP.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container nieuwe
    rechten krijgt.
  - **labels**: een label met een beschrijving.
  - **healthcheck**: voert `curl -f http://localhost:3000/api/health` uit.
    - **interval / timeout / retries / start_period / start_interval**: 1m30s /
      10s / 3 / 40s / 5s.

## Omgevingsvariabelen {#environment-variables}

De variabelen staan in een omgevingsbestand, buiten het Compose-bestand. Gebruik
`.env` voor Docker Compose en `stack.env` voor Portainer. Beide bestanden moeten
dezelfde waarden bevatten.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# NOTE:
# This setup uses an **internal PostgreSQL database** and **does not persist data**.
#
# To use the Harbor Guard Compose file, you must provide either a `.env`
# or `stack.env` file with the required environment variables.

# Database Configuration: USER
# Database name: no changes needed
NAME_DB=harborguard_db

# PostgreSQL user password: no changes needed
PASSWORD_DB=StrongUniqueUserPassword5678

# PostgreSQL username: no changes needed
USER_DB=harborguard
```

- **`NAME_DB`**: databasenaam: niets wijzigen
- **`PASSWORD_DB`**: wachtwoord van de PostgreSQL-gebruiker: niets wijzigen
- **`USER_DB`**: gebruikersnaam van PostgreSQL: niets wijzigen

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

Open de webinterface van Harbor Guard via deze URL:

```bash
http://your-ip-address:3016
```

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
Deze opzet gebruikt een interne database en bewaart je gegevens **niet**. Voor
een opzet die klaar is voor productie, met een externe PostgreSQL-database, zie
de
[documentatie van Harbor Guard op GitHub](https://github.com/HarborGuard/HarborGuard),
met de bestanden
[docker-compose.yml](https://github.com/HarborGuard/HarborGuard/blob/main/docker-compose.yml)
en
[.env.example](https://github.com/HarborGuard/HarborGuard/blob/main/.env.example).
{{% /alert %}}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**: er is geen wachtwoord nodig.

## Conclusie {#conclusion}

Dit Compose-bestand rolt HarborGuard uit op een eigen bridge-netwerk met een
vast IP-adres. De scanners (Trivy, Grype, Syft, Dockle, OSV en Dive) staan aan
via omgevingsvariabelen, en de Docker-socket is alleen-lezen gekoppeld, zodat
images kunnen worden gescand. De meegeleverde database bewaart geen gegevens.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/harborguard/compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/harborguard/stack.env
