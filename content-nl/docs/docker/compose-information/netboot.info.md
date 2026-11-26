---
title: "netboot.info"
description:
  "Rol NetBoot uit, waarmee je verschillende besturingssystemen en
  hulpprogramma's via het netwerk opstart. Met de Docker-netwerkinstellingen, de
  configuratie van de service en beveiligingsmaatregelen voor een soepele en
  veilige werking."
url: "docker/compose-info/netboot"
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
  - NetBoot
  - Docker Compose
  - Container Management
  - Network Booting
keywords:
  - Docker
  - NetBoot
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Network Boot
  - Operating System Boot
  - Utility Disk Boot

weight: 4113

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt de service NetBoot in en rolt die uit met Docker Compose, zodat je
verschillende besturingssystemen en hulpprogramma's via het netwerk kunt
opstarten.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `netboot`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service NetBoot in, een
  omgeving om verschillende besturingssystemen en hulpprogramma's via het
  netwerk op te starten.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: netboot

networks:
  netboot_net:
    attachable: false
    internal: false
    external: false
    name: netboot
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.11.0/24
          ip_range: 172.20.11.0/24
          gateway: 172.20.11.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "netboot"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.netboot.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `netboot_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: netboot**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "netboot"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.netboot.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  netboot_app:
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
    container_name: netboot
    image: ghcr.io/netbootxyz/netbootxyz:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/netboot/production/app:/config
      - /docker/media/images/netboot/assets:/assets
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      # MENU_VERSION: 2.0.79 # optional
      # PORT_RANGE: 30000:30010 # optional
      # SUBFOLDER: / # optional
    domainname: netboot.local # Customize this with your own domain, e.g., `netboot.local` to `netboot.your-fqdn-here.com`.
    hostname: netboot
    networks:
      netboot_net:
        ipv4_address: 172.20.11.2
    ports:
      - "69:69/udp" # TFTP Port
      - "3011:3000/tcp" # Web configuration interface.
      # - "3012:80/tcp" # NGINX server for hosting assets.
    security_opt:
      - no-new-privileges:true
    labels:
      com.netboot.description:
        "is a convenient place to boot into any type of operating system or
        utility disk without the need of having to go spend time retrieving the
        ISO just to run it."
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
- **netboot_app**: de naam van de service voor de container van NetBoot.
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
  - **container_name: netboot**: geeft de container de naam "netboot".
  - **image: ghcr.io/netbootxyz/netbootxyz**: gebruikt de image van NetBootXYZ.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/netboot/production/app:/config**: koppelt de configuratiemap.
    - **/docker/media/images/netboot/assets:/assets**: koppelt de map met
      assets.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **domainname: netboot.local**: stelt de domeinnaam van de container in.
  - **hostname: netboot**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `netboot_net`.
    - **ipv4_address: 172.20.11.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **69:69/udp**: koppelt de TFTP-poort.
    - **3011:3000/tcp**: koppelt de poort van de webconfiguratie-interface.
    - **3012:80/tcp**: koppelt de poort van de NGINX-server
      (uitgecommentarieerd).
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.netboot.description**: label met een beschrijving van NetBoot.
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

1. Stel de DHCP-server van je netwerk zo in dat die naar deze host verwijst als
   TFTP-server (poort 69/udp). Zie `notes/netboot_boot_option.md`.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van netboot.xyz via deze URL:

**Webconfiguratie-interface**:

```bash
http://your-ip-address:3011
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**: er is geen wachtwoord nodig.

{{% alert context="warning" %}}
**De webinterface heeft geen login. Stel die niet open buiten je netwerk.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een Docker-omgeving op voor NetBoot, een service waarmee
je verschillende besturingssystemen of hulpprogramma's via een netwerk opstart.
De configuratie definieert een eigen bridge-netwerk met vaste IP-instellingen en
beveiligingsinstellingen. De service NetBoot draait continu, met blijvende
opslag voor de configuratie en de assets, en met opties voor de TFTP-poort en de
webconfiguratie-interface. De opzet zorgt dat NetBoot efficiënt en veilig
draait, met passende logging en een passend herstartbeleid.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/netboot/compose.yml
