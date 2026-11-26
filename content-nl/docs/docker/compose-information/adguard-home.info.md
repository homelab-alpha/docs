---
title: "adguard-home.info"
description:
  "Rol AdGuard Home uit met Docker Compose, software die op het hele netwerk
  advertenties en tracking blokkeert. Deze gids behandelt eigen
  netwerkinstellingen, de configuratie van de service en beveiligingsmaatregelen
  voor een efficiënte werking."
url: "docker/compose-info/adguard-home"
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
  - AdGuard Home
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - AdGuard Home
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Docker Containers
  - DNS Filtering
  - Self-hosted Docker Management

weight: 4101

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om met Docker
Compose AdGuard Home uit te rollen, software die op het hele netwerk
advertenties en tracking blokkeert.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `adguard-home`, ingesteld met `name:` op het hoogste niveau
  van het bestand.
- **Auteur**: Homelab-Alpha
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service AdGuard Home in, om
  op het hele netwerk advertenties en tracking te blokkeren.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: adguard-home

networks:
  adguard-home_net:
    attachable: false
    internal: false
    external: false
    name: adguard-home
    driver: host
    ipam:
      driver: default
      config:
        - subnet: 172.20.15.0/24
          ip_range: 172.20.15.0/24
          gateway: 172.20.15.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "adguard-home"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.adguard-home.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `adguard-home_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt in dit Compose-bestand gemaakt en niet
  extern gedefinieerd.
- **name: adguard-home**: geeft de naam van het netwerk.
- **driver: host**: gebruikt het stuurprogramma host om een afgeschermd netwerk
  te maken.
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
  - **com.docker.network.bridge.name: "adguard-home"**: geeft het bridge-netwerk
    een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.adguard-home.network.description**: een label met een beschrijving van
    het netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  adguard-home_app:
    deploy:
      resources:
        limits:
          pids: 512 # Limits the number of processes and threads (fork bomb protection).
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: adguard-home
    image: docker.io/adguard/adguardhome:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/adguard-home/production/app:/opt/adguard-home/work
      - /docker/adguard-home/production/app:/opt/adguard-home/conf
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: adguard-home.local # Customize this with your own domain, e.g., `adguard-home.local` to `adguard-home.your-fqdn-here.com`.
    hostname: adguard-home
    networks:
      adguard-home_net:
        ipv4_address: 172.20.15.2
    ports:
      - "53:53/tcp" # plain DNS
      - "53:53/udp" # plain DNS
      - "67:67/udp" # DHCP server
      - "68:68/udp" # Client DHCP
      - "80:80/tcp" # HTTP
      - "443:443/tcp" # HTTPS
      - "443:443/udp" # HTTPS
      - "784:784/udp" # DNS over QUIC
      - "853:853/tcp" # DNS over TLS
      - "853:853/udp" # DNS over TLS
      - "3000:3000/tcp" # web admin port
      - "5443:5443/tcp" # DNSCrypt
      - "5443:5443/udp" # DNSCrypt
      # - "6060:6060/tcp" # HTTP (pprof)
      - "8853:8853/udp" # DNS over QUIC
    security_opt:
      - no-new-privileges:true
    labels:
      com.adguard-home.description:
        "is a network-wide software for blocking ads and tracking."
    healthcheck:
      disable: true
```

- **services**: definieert de services die worden uitgerold.
- **adguard-home_app**: de naam van de service voor de container van AdGuard
  Home.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: zorgt dat de container automatisch opnieuw start als
    die stopt.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt de grootte van een logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: adguard-home**: geeft de container de naam "adguard-home".
  - **image: docker.io/adguard/adguardhome**: gebruikt de image van AdGuard
    Home.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/adguard-home/production/app:/opt/adguard-home/work**: koppelt de
      werkmap.
    - **/docker/adguard-home/production/app:/opt/adguard-home/conf**: koppelt de
      configuratiemap.
  - **environment**: stelt omgevingsvariabelen in.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **domainname: adguard-home.local**: stelt de domeinnaam van de container in.
  - **hostname: adguard-home**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `adguard-home_net`.
    - **ipv4_address: 172.20.15.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host.
    - **53:53/tcp**: koppelt de DNS-poort (TCP).
    - **53:53/udp**: koppelt de DNS-poort (UDP).
    - **67:67/udp**: koppelt de poort van de DHCP-server.
    - **68:68/udp**: koppelt de DHCP-poort van de client.
    - **80:80/tcp**: koppelt de HTTP-poort.
    - **443:443/tcp**: koppelt de HTTPS-poort.
    - **853:853/tcp**: koppelt DNS over TLS (TCP).
    - **3000:3000/tcp**: koppelt de poort van de webbeheerinterface.
    - **5443:5443/tcp**: koppelt de DNSCrypt-poort.
    - **8853:8853/udp**: koppelt DNS over QUIC.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.adguard-home.description**: label met een beschrijving van AdGuard
      Home.
  - **healthcheck**: configuratie van de health check.
    - **disable: true**: zet de health check uit.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Zorg dat poort 53 op de host vrij is. Op veel Linux-distributies gebruikt
   `systemd-resolved` die.

2. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van AdGuard Home via deze URL:

**Installatiewizard (alleen bij de eerste start)**:

```bash
http://your-ip-address:3000
```

**Dashboard (na de installatie, op de poort die je in de wizard kiest)**:

```bash
http://your-ip-address:80
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: gemaakt tijdens de installatie

**Wachtwoord**: gemaakt tijdens de installatie

De installatiewizard heeft geen standaard inloggegevens: je maakt er het
beheerdersaccount in.

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om tijdens de installatie een sterke
gebruikersnaam en een sterk wachtwoord te maken.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit bestand `compose.yml` zet een Docker-omgeving op voor AdGuard Home, software
die op het hele netwerk advertenties en tracking blokkeert. De configuratie
definieert een eigen bridge-netwerk met vaste IP-instellingen en
beveiligingsinstellingen. De service AdGuard Home draait continu, met blijvende
opslag voor de gegevens van de toepassing. De opzet zorgt dat AdGuard Home
efficiënt en veilig draait, met passende logging en een passend herstartbeleid,
en is zo een uitstekend hulpmiddel om op het hele netwerk advertenties te
blokkeren.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/adguard-home/compose.yml
