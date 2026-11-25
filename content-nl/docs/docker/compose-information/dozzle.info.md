---
title: "dozzle.info"
description:
  "Rol Dozzle uit, een webinterface om de logs van Docker live te volgen. Met
  eigen Docker-netwerkinstellingen, de configuratie van de service en
  beveiligingsmaatregelen voor een efficiënte en veilige werking."
url: "docker/compose-info/dozzle"
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
  - Dozzle
  - Docker Compose
  - Container Management
  - Log Monitoring
keywords:
  - Docker
  - Dozzle
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Log Monitoring
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Infrastructure Monitoring
  - Real-time Log Viewer

weight: 4104

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}} Claude heeft bijgedragen aan dit document. Wees
daarom voorzichtig met de informatie hier en controleer die zo nodig.
{{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om Dozzle uit te
rollen, een webinterface om de logs van Docker live te volgen.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `dozzle`, ingesteld met `name:` op het hoogste niveau van het
  bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service Dozzle in om de logs
  van Docker live te volgen.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: dozzle

networks:
  dozzle_net:
    attachable: false
    internal: false
    external: false
    name: dozzle
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.9.0/24
          ip_range: 172.20.9.0/24
          gateway: 172.20.9.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "dozzle"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.dozzle.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `dozzle_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: dozzle**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "dozzle"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.dozzle.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  dozzle_app:
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
    container_name: dozzle
    image: ghcr.io/amir20/dozzle:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/dozzle/production/app:/data
      - /docker/dozzle/users.yml:/data/users.yml
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      DOZZLE_AUTH_PROVIDER: "none" # Options: none, simple, forward-proxy. Use "simple" to enable authentication via users.yml.
      DOZZLE_AUTH_TTL: 48h
      DOZZLE_ENABLE_ACTIONS: "false"
      DOZZLE_HOSTNAME: docker-server
      DOZZLE_LEVEL: info
      DOZZLE_NO_ANALYTICS: "true"
      DOZZLE_ENABLE_SHELL: "false"
      # DOZZLE_REMOTE_HOST: tcp://192.168.*.*:2376|dozzle-remote.local
    domainname: dozzle.local # Customize this with your own domain, e.g., `dozzle.local` to `dozzle.your-fqdn-here.com`.
    hostname: dozzle
    networks:
      dozzle_net:
        ipv4_address: 172.20.9.2
    ports:
      - "3008:8080/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    labels:
      com.dozzle.description:
        "is a small lightweight application with a web based interface to
        monitor Docker logs."
    healthcheck:
      disable: false
      test: ["CMD", "/dozzle", "healthcheck"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **dozzle_app**: de naam van de service voor de container van Dozzle.
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
  - **container_name: dozzle**: geeft de container de naam "dozzle".
  - **image: ghcr.io/amir20/dozzle**: gebruikt de image van Dozzle.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/dozzle/production/app:/data**: koppelt de gegevensmap van de
      app.
    - **/docker/dozzle/users.yml:/data/users.yml**: koppelt een eigen bestand
      users.yml voor de configuratie van de gebruikersauthenticatie.
    - **/var/run/docker.sock:/var/run/docker.sock:ro**: koppelt de Docker-socket
      alleen-lezen.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **DOZZLE_AUTH_PROVIDER: "none"**: zet authenticatie uit (opties: none,
      simple, forward-proxy).
    - **DOZZLE_AUTH_TTL: 48h:** verlengt de levensduur van de
      authenticatiecookie tot 48 uur.
    - **DOZZLE_ENABLE_ACTIONS: "false"**: zet acties in Dozzle uit.
    - **DOZZLE_HOSTNAME: docker-server**: stelt de hostnaam van Dozzle in.
    - **DOZZLE_LEVEL: info**: zet het logniveau op info.
    - **DOZZLE_NO_ANALYTICS: "true"**: zet analytics uit.
    - **DOZZLE_ENABLE_SHELL: "false"**: zet toegang tot de shell uit
    - **DOZZLE_REMOTE_HOST**: geeft eventueel een externe host voor Docker op
      (uitgecommentarieerd).
  - **domainname: dozzle.local**: stelt de domeinnaam van de container in.
  - **hostname: dozzle**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `dozzle_net`.
    - **ipv4_address: 172.20.9.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **3008:8080/tcp**: koppelt de HTTP-poort.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **cap_drop: ALL**: laat alle Linux-capabilities vallen. Dozzle leest alleen
    de Docker-socket en heeft er geen nodig.
  - **labels**: metadata van de container.
    - **com.dozzle.description**: label met een beschrijving van Dozzle.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check. Hier is dat
      `["CMD", "/dozzle", "healthcheck"]`.
    - **interval**: de tijd tussen twee health checks (10 seconden).
    - **timeout**: de tijd die een health check mag duren voordat die als
      mislukt geldt (5 seconden).
    - **retries**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt (3 pogingen).
    - **start_period**: de beginperiode waarin een mislukte health check niet
      meetelt voor de pogingen (10 seconden).
    - **start_interval**: de tijd tussen health checks tijdens het opstarten (5
      seconden).

## Gebruikersconfiguratie {#user-configuration}

{{% alert context="primary" %}} Dozzle ondersteunt geen met Bcrypt gehashte
wachtwoorden met de tekens . of / Bevat je gemaakte hash een van deze tekens,
voer het commando hieronder dan opnieuw uit tot je een geschikte hash krijgt.
{{% /alert %}}

### Een met Bcrypt gehasht wachtwoord maken {#generate-a-bcrypt-hashed-password}

Voer dit commando uit om een met Bcrypt gehasht wachtwoord te maken:

```bash
htpasswd -nbB username 'StrongUniqueUserPassword1234'
```

Je krijgt uitvoer zoals deze:

```bash
username:$2y$05$tK8ahNrufhDMcyrMGELXAONvKZ1ydGvwVxtyiwIO7wJYN50XoYsIG
```

### De hash gebruiken {#using-the-hash}

Kopieer **alleen** het gehashte deel (alles na de dubbele punt `:`) en plak het
in het veld `password` van de bijbehorende gebruiker:

```bash
$2y$05$tK8ahNrufhDMcyrMGELXAONvKZ1ydGvwVxtyiwIO7wJYN50XoYsIG
```

### users.yml

```yml
---
users:
  # Administrator Account
  admin: # Change "admin" to a custom username if desired
    email: admin@email.net # Administrator email address
    name: Admin # Display name in the UI
    password: # Insert the Bcrypt-hashed password here
    filter: # Optional: Custom filter rules for this user

  # Guest Account
  guest: # Change "guest" to a custom username if desired
    email: guest@email.net # Guest user email address
    name: Guest # Display name in the UI
    password: # Insert the Bcrypt-hashed password here
    filter: "label=com.example.app" # Optional: Example filter to restrict guest access
```

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Kopieer `users.yml` naar `/docker/dozzle/users.yml`. Docker maakt de andere
   mappen onder `/docker/dozzle/` bij de eerste start.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Dozzle via deze URL:

```bash
http://your-ip-address:3008
```

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="info" %}}
Heb je gebruikers toegevoegd in het bestand `users.yml`, gebruik dan die
inloggegevens.
{{% /alert %}}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**: er is geen wachtwoord nodig.

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om authenticatie in te stellen met
het bestand `users.yml`, zodat de toegang beperkt is.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een Docker-omgeving op voor Dozzle, een lichte
toepassing met een webinterface om de logs van Docker te volgen. De configuratie
definieert een eigen bridge-netwerk met vaste IP-instellingen en
beveiligingsinstellingen. De service Dozzle draait continu, met blijvende opslag
voor de gegevens van de toepassing en alleen-lezen toegang tot de Docker-socket.
De opzet zorgt dat Dozzle efficiënt en veilig draait, met passende logging en
een passend herstartbeleid, en is zo een uitstekend hulpmiddel om de logs van
Docker live te volgen.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/dozzle/compose.yml
