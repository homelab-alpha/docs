---
title: "pi-hole.info"
description:
  "Rol Pi-hole uit, een gebruiksvriendelijke DNS-sinkhole en DHCP-server die je
  zelf host. Deze gids behandelt de eigen Docker-netwerkinstellingen, de
  configuratie van de service Pi-hole en beveiligingsmaatregelen voor een
  efficiënte werking."
url: "docker/compose-info/pi-hole"
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
  - Pi-hole
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - Pi-hole
  - Docker Compose
  - Container Management
  - Docker Network
  - Pi-hole Configuration
  - Docker Setup
  - DNS Sinkhole
  - DHCP Server
  - Infrastructure Monitoring
  - Self-hosted Docker Management

weight: 4117

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Deze gids legt de opzet uit van **Pi-hole**, een blokkering van advertenties en
trackers op netwerkniveau die werkt als DNS-sinkhole en optioneel als
DHCP-server. Hieronder volgt een uitleg van de configuratie in het bestand
`compose.yml` om Pi-hole met Docker uit te rollen.

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `pi-hole`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: Homelab-Alpha
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service Pi-hole in, om
  advertenties te blokkeren en als DHCP-server te werken.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: pi-hole

networks:
  pi-hole_net:
    attachable: false
    internal: false
    external: false
    name: pi-hole
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.17.0/24
          ip_range: 172.20.17.0/24
          gateway: 172.20.17.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "pi-hole"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.pi-hole.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `pi-hole_net`.
- **attachable: false**: andere containers kunnen zich niet aan dit netwerk
  koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk wordt alleen in het Compose-bestand gemaakt.
- **name: pi-hole**: geeft het netwerk de naam `pi-hole`.
- **driver: bridge**: gebruikt het stuurprogramma bridge van Docker om het
  netwerk af te schermen.
- **ipam**: configuratie van het beheer van IP-adressen.
  - **driver: default**: het standaardstuurprogramma voor IPAM wordt gebruikt.
  - **config**: stelt het subnet, het IP-bereik en de gateway van het netwerk
    in.
    - **subnet**: 172.20.17.0/24 definieert het bereik van het netwerk.
    - **ip_range**: 172.20.17.0/24 beperkt het IP-bereik tot dit subnet.
    - **gateway**: 172.20.17.1 stelt de standaardgateway in.
- **driver_opts**: extra opties voor het stuurprogramma voor de
  netwerkconfiguratie.
  - **com.docker.network.bridge.default_bridge: "false"**: zorgt dat dit niet de
    standaardbridge is.
  - **com.docker.network.bridge.enable_icc: "true"**: zet communicatie tussen
    containers aan.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: staat
    masquerading van verkeer toe.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: koppelt het
    netwerk aan alle beschikbare IP-adressen van de host.
  - **com.docker.network.bridge.name: "pi-hole"**: geeft het bridge-netwerk de
    naam `pi-hole`.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.pi-hole.network.description**: beschrijft het netwerk als een
    afgeschermde bridge.

## Configuratie van de services {#services-configuration}

```yaml
services:
  pi-hole_app:
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
    container_name: pi-hole
    image: ghcr.io/pi-hole/pihole:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/pi-hole/production/app:/etc/pihole
      - /docker/pi-hole/production/etc-dnsmasq.d:/etc/dnsmasq.d
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: pi-hole.local # Customize this with your own domain, e.g., `pi-hole.local` to `pi-hole.your-fqdn-here.com`.
    hostname: pi-hole
    networks:
      pi-hole_net:
        ipv4_address: 172.20.17.2
    ports:
      - "5353:53/tcp" # plain DNS
      - "5353:53/udp" # plain DNS
      - "67:67/udp" # DHCP
      - "3080:80/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    cap_add:
      - NET_ADMIN
    labels:
      com.pi-hole.description:
        "is a Linux network-level advertisement and Internet tracker blocking
        application which acts as a DNS sinkhole and optionally a DHCP server."
    healthcheck:
      disable: false
      test:
        [
          "CMD",
          "dig",
          "+short",
          "+norecurse",
          "+retry=0",
          "@127.0.0.1",
          "pi.hole",
        ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: dit deel definieert de services die worden uitgerold.
- **pi-hole_app**: de naam van de service voor de container van Pi-hole.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: de container start opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma `json-file`.
    - **max-size: "1M"**: beperkt de grootte van het logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: de wachttijd voordat de container geforceerd
    wordt gestopt.
  - **container_name: pi-hole**: geeft de container de naam `pi-hole`.
  - **image: ghcr.io/pi-hole/pihole**: gebruikt de image van Pi-hole.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen van de host in de container voor blijvende
    opslag van gegevens.
    - **./docker/pi-hole/production/app:/etc/pihole**: koppelt de
      configuratiemap van Pi-hole.
    - **/docker/pi-hole/production/etc-dnsmasq.d:/etc/dnsmasq.d**: koppelt de
      configuratiemap van DNS.
  - **environment**: stelt omgevingsvariabelen in voor de configuratie.
    - **PUID: "1000"**: stelt de gebruikers-ID in.
    - **PGID: "1000"**: stelt de groeps-ID in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam (pas zo nodig aan).
  - **domainname: pi-hole.local**: stelt de domeinnaam van de container in (pas
    zo nodig aan).
  - **hostname: pi-hole**: geeft de container de naam `pi-hole`.
  - **networks**: koppelt de service aan het netwerk `pi-hole_net`.
    - **ipv4_address: 172.20.17.2**: geeft een vast IP-adres.
  - **ports**: koppelt poorten van de container aan poorten van de host voor de
    DNS- en DHCP-diensten.
    - **5353:53/tcp**: koppelt de DNS-poort (TCP).
    - **5353:53/udp**: koppelt de DNS-poort (UDP).
    - **67:67/udp**: koppelt de DHCP-poort.
    - **3080:80/tcp**: koppelt de HTTP-poort van de webinterface.
  - **security_opt**: voegt beveiligingsopties aan de container toe.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten kan
      krijgen.
  - **cap_add**: voegt capabilities aan de container toe.
    - **NET_ADMIN**: geeft rechten voor netwerkbeheer.
  - **labels**: metadata van de container.
    - **com.pi-hole.description**: beschrijft Pi-hole als DNS-sinkhole en
      optionele DHCP-server.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet de health check aan.
    - **test**: voert het commando `dig` uit om de werking van Pi-hole te
      testen.
    - **interval: 10s**: voert de health check elke 10 seconden uit.
    - **timeout: 5s**: geeft de health check tot 5 seconden om af te ronden.
    - **retries: 3**: de health check mislukt na 3 opeenvolgende mislukkingen.
    - **start_period: 10s**: de beginperiode voordat mislukkingen meetellen (10
      seconden).
    - **start_interval: 5s**: de tijd tussen health checks tijdens het opstarten
      (5 seconden).

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Pi-hole via deze URL:

```bash
http://your-ip-address:3080/admin/login
```

DNS wordt gepubliceerd op poort 5353 (TCP en UDP).

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**:

Het wachtwoord voor de eerste installatie staat in de logs
(`docker logs pi-hole`). Zoek naar een regel zoals:

```log
No password set in environment or config file, assigning random password: <password>
```

Wijzig het daarna met:

```bash
docker exec -it pi-hole pihole setpassword
```

Het Compose-bestand stelt bewust geen wachtwoord in: een wachtwoord in
`FTLCONF_webserver_api_password` is zichtbaar in het Compose-bestand en kan niet
meer vanuit de container worden gewijzigd.

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om de standaard inloggegevens na de
eerste keer inloggen te wijzigen.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit bestand `compose.yml` stelt een Docker-omgeving in voor Pi-hole, een
DNS-sinkhole en optionele DHCP-server. Het definieert een eigen bridge-netwerk,
zet Pi-hole op met blijvende opslag en geeft verschillende opties voor
beveiliging en logging. Zo draait Pi-hole efficiënt en veilig in je Docker-opzet
en helpt het ongewenste advertenties en trackers op je netwerk te blokkeren.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/pi-hole/compose.yml
