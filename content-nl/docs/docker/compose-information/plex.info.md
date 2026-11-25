---
title: "plex.info"
description:
  "Rol Plex Media Server uit met Docker Compose en eigen netwerkinstellingen,
  voor een efficiënt beheer en streamen van media. Deze opzet heeft uitgebreide
  configuraties voor blijvende opslag, omgevingsvariabelen en
  beveiligingsmaatregelen, voor de beste prestaties en toegankelijkheid."
url: "docker/compose-info/plex"
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
  - Plex Media Server
  - Docker Compose
  - Media Streaming
  - Containerization
  - Docker Networking
keywords:
  - Docker Plex Media Server setup
  - Docker Compose Plex configuration
  - Plex Docker persistent storage
  - Media server Docker container
  - Docker network configuration

weight: 4118

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Deze
configuratie is speciaal bedoeld om Plex Media Server uit te rollen met Docker
Compose, voor een efficiënt beheer en streamen van media.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `plex`, ingesteld met `name:` op het hoogste niveau van het
  bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en een service voor Plex Media
  Server in.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-bestand .env**: [.env]
- **RAW-bestand stack.env**: [stack.env]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: plex

networks:
  plex_net:
    attachable: false
    internal: false
    external: false
    name: plex
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.12.0/24
          ip_range: 172.20.12.0/24
          gateway: 172.20.12.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "plex"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.plex.network.description: "is an isolated bridge network."
```

- **networks**: definieert het eigen netwerk `plex_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: plex**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "plex"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.plex.network.description**: een label met een beschrijving van het
    netwerk.

## De service Plex Media Server {#plex-media-server-service}

```yaml
services:
  plex_app:
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
    container_name: plex
    image: docker.io/plexinc/pms-docker:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/plex/production/app/config:/config
      - /docker/plex/production/app/temp:/transcode
      - /docker/media:/data:ro
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
      PLEX_CLAIM: ${PLEX_CLAIM_TOKEN} # Fill in the value in both the .env and stack.env files
      ADVERTISE_IP: ${IP_ADDRESS} # Fill in the value in both the .env and stack.env files
      CHANGE_CONFIG_DIR_OWNERSHIP: "false"
      # ALLOWED_NETWORKS: ""
    domainname: plex.local # Customize this with your own domain, e.g., `plex.local` to `plex.your-fqdn-here.com`.
    hostname: plex
    networks:
      plex_net:
        ipv4_address: 172.20.12.2
    ports:
      - 32400:32400/tcp # HTTP
      - 5353:5353/udp # older Bonjour/Avahi network discovery (not is use anymore)
      - 8324:8324/tcp # controlling Plex for Roku via Plex Companion
      - 1900:1900/udp # Plex DLNA Server
      - 32469:32469/tcp # Plex DLNA Server
      - 32410:32410/udp # GDM network discovery
      - 32412:32412/udp # GDM network discovery
      - 32413:32413/udp # GDM network discovery
      - 32414:32414/udp # GDM network discovery
    devices:
      - /dev/dri:/dev/dri
    security_opt:
      - no-new-privileges:true
    labels:
      com.plex.description:
        "organizes all of your personal media so you can enjoy it no matter
        where you are."
    healthcheck:
      disable: false
      test: ["CMD", "/healthcheck.sh"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **plex_app**: de naam van de service voor de container van Plex.
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
  - **container_name: plex**: geeft de container de naam "plex".
  - **image: docker.io/plexinc/pms-docker**: gebruikt de image van Plex Media
    Server.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/plex/production/app/config:/config**: koppelt de configuratiemap
      van Plex.
    - **/docker/plex/production/app/temp:/transcode**: koppelt de map voor
      transcoderen.
    - **/docker/media:/data:ro**: koppelt de mediamap (alleen-lezen).
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **PLEX_CLAIM**: stelt het claimtoken van Plex in.
    - **ADVERTISE_IP**: stelt het IP-adres in dat de Plex-server aankondigt.
    - **CHANGE_CONFIG_DIR_OWNERSHIP: "false"**: voorkomt dat het eigendom van de
      configuratiemap wordt gewijzigd.
  - **domainname: plex.local**: stelt de domeinnaam van de container in.
  - **hostname: plex**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `plex_net`.
    - **ipv4_address: 172.20.12.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **32400:32400/tcp**: koppelt de HTTP-poort.
    - **5353:5353/udp**: koppelt de poort voor netwerkdetectie van Bonjour/Avahi
      (oudere versie, niet meer in gebruik).
    - **8324:8324/tcp**: koppelt de poort om Plex for Roku te bedienen via Plex
      Companion.
    - **1900:1900/udp**: koppelt de poort van de DLNA-server van Plex.
    - **32469:32469/tcp**: koppelt de poort van de DLNA-server van Plex.
    - **32410:32410/udp**: koppelt de poort voor netwerkdetectie van GDM.
    - **32412:32412/udp**: koppelt de poort voor netwerkdetectie van GDM.
    - **32413:32413/udp**: koppelt de poort voor netwerkdetectie van GDM.
    - **32414:32414/udp**: koppelt de poort voor netwerkdetectie van GDM.
  - **devices**: geeft apparaten van de host door aan de container.
    - **/dev/dri:/dev/dri**: koppelt het apparaat voor transcoderen met
      hardwareversnelling.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.plex.description**: label met een beschrijving van Plex Media
      Server.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check. Hier is dat
      `["CMD", "/healthcheck.sh"]`.
    - **interval**: de tijd tussen twee health checks (10 seconden).
    - **timeout**: de tijd die een health check mag duren voordat die als
      mislukt geldt (5 seconden).
    - **retries**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt (3 pogingen).
    - **start_period**: de beginperiode waarin een mislukte health check niet
      meetelt voor de pogingen (10 seconden).
    - **start_interval**: de tijd tussen health checks tijdens het opstarten (5
      seconden).

## Omgevingsvariabelen {#environment-variables}

Dit bestand bevat instellingen die verschillende toepassingen kunnen gebruiken
(zoals Docker-containers of MySQL-servers). Doordat deze waarden buiten de
broncode staan, blijven gevoelige gegevens, zoals wachtwoorden en tokens,
veilig.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# Plex Claim Token Configuration
# Visit https://www.plex.tv/claim to get a claim token for logging into your Plex server with your Plex account.
# Replace the placeholder with your unique claim token.
PLEX_CLAIM_TOKEN=YourUniqueClaimTokenHere12345

# Server IP Address Configuration
# Customize this with your Plex server's IP address, e.g., `192.168.1.1:32400` to `192.168.69.69:32400`.
# Make sure to replace the placeholder with your actual server IP address.
IP_ADDRESS=http://YourServerIPHere:32400/
```

- **`PLEX_CLAIM_TOKEN`**: het claimtoken waarmee je Plex-server zich bij je
  Plex-account aanmeldt. Ga naar [Plex Claim](https://www.plex.tv/claim) voor
  een claimtoken om in te loggen op je server. Vervang de plaatshouder door het
  unieke claimtoken dat je krijgt.
- **`IP_ADDRESS`**: het IP-adres van je Plex-server, met de poort. Meestal in de
  vorm `http://<IP_ADDRESS>:32400/`. Vervang de plaatshouder door het echte
  IP-adres van je server, in de juiste vorm voor je opzet.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Zet je media in `/docker/media`. De stack koppelt die map in de container.

2. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

3. Haal een claimtoken op bij <https://www.plex.tv/claim> en zet het in
   `PLEX_CLAIM_TOKEN`. Het token verloopt na een paar minuten en wordt alleen
   bij de eerste start gebruikt, dus start de stack direct daarna.

4. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Plex Media Server via deze URL:

```bash
http://your-ip-address:32400/web
```

## Standaard inloggegevens {#default-login-credentials}

Log in met je Plex-account. Het claimtoken koppelt de server bij de eerste start
aan dat account.

## Conclusie {#conclusion}

Dit bestand `compose.yml` zet een Plex Media Server op met een eigen
bridge-netwerk. De configuratie heeft blijvende opslag voor de configuratie-,
transcodeer- en mediamappen van Plex. Omgevingsvariabelen passen de opzet aan,
zoals de tijdzone en het claimtoken van Plex. De service start opnieuw tenzij
die met de hand is gestopt, met logopties om de grootte en bewaartijd van de
logs te beheren. De netwerkinstellingen geven de Plex-container een vast
IP-adres binnen het opgegeven subnet, en verschillende poorten worden gekoppeld
voor de diensten van Plex. Beveiligingsopties maken de container veiliger door
te voorkomen dat rechten worden uitgebreid.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/plex/compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/plex/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/plex/stack.env
