---
title: "xen-orchestra.info"
description:
  "Rol Xen Orchestra uit met Docker Compose, voor een efficiënt beheer van een
  infrastructuur met XCP-ng of XenServer. Met de netwerkconfiguratie, de
  instellingen van de service en beveiligingsopties voor een soepele en veilige
  werking."
url: "docker/compose-info/xen-orchestra"
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
  - Xen Orchestra
  - Docker Compose
  - Infrastructure Management
  - XCP-ng
  - XenServer
keywords:
  - Docker
  - Xen Orchestra
  - Docker Compose
  - Container Management
  - Docker Network
  - Xen Orchestra Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Xen Orchestra Service
  - XCP-ng Management
  - XenServer Management

weight: 4128

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt een service in en rolt die uit met Docker Compose; het zet Xen Orchestra
op om een infrastructuur met XCP-ng of XenServer te beheren.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `xen-orchestra`, ingesteld met `name:` op het hoogste niveau
  van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: dit bestand stelt een eigen Docker-netwerk en een service
  Xen Orchestra in. Het bevat uitgebreide netwerkinstellingen en
  serviceconfiguraties, zodat Xen Orchestra soepel en veilig draait.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: xen-orchestra

networks:
  xen-orchestra_net:
    attachable: false
    internal: false
    external: false
    name: xen-orchestra
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.8.0/24
          ip_range: 172.20.8.0/24
          gateway: 172.20.8.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "xen-orchestra"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.xen-orchestra.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `xen-orchestra_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk is niet extern gedefinieerd, maar wordt in
  dit Compose-bestand gemaakt.
- **name: xen-orchestra**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "xen-orchestra"**: geeft het
    bridge-netwerk een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.xen-orchestra.network.description**: een label met een beschrijving
    van het netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  xen-orchestra_app:
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
    container_name: xen-orchestra
    image: docker.io/ronivay/xen-orchestra:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      # - /docker/xen-orchestra/production/.cert/client-cert.pem:/client-cert.pem
      # - /docker/xen-orchestra/production/.cert/client-key.pem:/client-key.pem
      # - /docker/xen-orchestra/production/.cert/ca-cert.pem:/ca-cert.pem
      - /docker/xen-orchestra/production/app:/var/lib/xo-server
      - /docker/xen-orchestra/production/redis:/var/lib/redis
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      HTTP_PORT: 80
      HTTPS_PORT: 443
      REDIRECT_TO_HTTPS: false
      # CERT_PATH: "/docker/xen-orchestra/production/.cert/client-cert.pem"
      # KEY_PATH: "/docker/xen-orchestra/production/.cert/client-key.pem"
    domainname: xo.local # Customize this with your own domain, e.g., `xo.local` to `xo.your-fqdn-here.com`.
    hostname: xo
    networks:
      xen-orchestra_net:
        ipv4_address: 172.20.8.2
    ports:
      - "3006:80/tcp" # HTTP
      # - "3007:443/tcp" # HTTPS
    # these are needed for file restore.
    # allows one backup to be mounted at once which will be umounted after some
    # minutes if not used (prevents other backups to be mounted during that)
    # add loop devices (loop1, loop2 etc) if multiple simultaneous mounts needed.
    # devices:
    #   - "/dev/fuse:/dev/fuse"
    #   - "/dev/loop-control:/dev/loop-control"
    #   - "/dev/loop0:/dev/loop0"
    security_opt:
      - no-new-privileges:true
      - apparmor:unconfined
    cap_add:
      - SYS_ADMIN
      - DAC_READ_SEARCH
    labels:
      com.xen-orchestra.description:
        "is a complete solution to visualize, manage, backup and delegate your
        XCP-ng or XenServer infrastructure."
    healthcheck:
      disable: false
      test: ["CMD", "/healthcheck.sh"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **xen-orchestra_app**: de naam van de service voor de container van Xen
  Orchestra.
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
  - **container_name: xen-orchestra**: geeft de container de naam
    "xen-orchestra".
  - **image: docker.io/ronivay/xen-orchestra**: gebruikt de image van Xen
    Orchestra.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/xen-orchestra/production/app:/var/lib/xo-server**: koppelt de
      map van de app.
    - **/docker/xen-orchestra/production/redis:/var/lib/redis**: koppelt de map
      van Redis.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **HTTP_PORT: 80**: stelt de HTTP-poort in.
    - **HTTPS_PORT: 443**: stelt de HTTPS-poort in.
    - **REDIRECT_TO_HTTPS: false**: zet de doorverwijzing naar HTTPS uit.
  - **domainname: xo.local**: stelt de domeinnaam van de container in.
  - **hostname: xo**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `xen-orchestra_net`.
    - **ipv4_address: 172.20.8.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **3006:80/tcp**: koppelt HTTP-poort 80 aan poort 3006 van de host.
    - **3007:443/tcp**: koppelt HTTPS-poort 443 aan poort 3007 van de host
      (uitgecommentarieerd).
  - **devices** (uitgecommentarieerd): geeft apparaten van de host door aan de
    container. Voeg loop-apparaten toe (loop1, loop2 enzovoort) als je meerdere
    koppelingen tegelijk nodig hebt.
    - **/dev/fuse:/dev/fuse**: koppelt het fuse-apparaat.
    - **/dev/loop-control:/dev/loop-control**: koppelt het apparaat
      loop-control.
    - **/dev/loop0:/dev/loop0**: koppelt het apparaat loop0.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
    - **apparmor:unconfined**: zet de beperkingen van AppArmor uit.
  - **cap_add**: voegt Linux-capabilities aan de container toe.
    - **SYS_ADMIN**: voegt de capability voor systeembeheer toe.
    - **DAC_READ_SEARCH**: voegt de capability toe om controles op leesrechten
      van bestanden te omzeilen.
  - **labels**: metadata van de container.
    - **com.xen-orchestra.description**: label met een beschrijving van Xen
      Orchestra.
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

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Xen Orchestra via deze URL:

```bash
http://your-ip-address:3006
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**:

```bash
admin@admin.net
```

**Wachtwoord**:

```bash
admin
```

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om de standaard inloggegevens na de
eerste keer inloggen te wijzigen.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een degelijke Docker-omgeving op voor Xen Orchestra, een
complete oplossing om een infrastructuur met XCP-ng of XenServer te beheren. Het
maakt een eigen bridge-netwerk met vaste IP-instellingen en
beveiligingsinstellingen. Met de service Xen Orchestra beheer je je
infrastructuur met XCP-ng of XenServer en maak je er back-ups van, met blijvende
opslag en netwerk- en beveiligingsopties. De configuratie zorgt dat Xen
Orchestra continu draait, na een fout opnieuw start en efficiënt logt.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/xen-orchestra/compose.yml
