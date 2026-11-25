---
title: "netdata.info"
description:
  "Rol een instantie van Netdata uit om infrastructuur te bewaken en problemen
  op te lossen. Met de configuratie van een eigen Docker-netwerk en de service
  Netdata, voor een goede en veilige monitoring."
url: "docker/compose-info/netdata"
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
  - Portainer
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Portainer
  - Docker Compose
  - Container Management
  - Docker Network
  - Portainer Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Portainer Service

weight: 4114

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt een instantie van Netdata in en rolt die uit met Docker Compose, om
infrastructuur te bewaken en problemen op te lossen.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `netdata`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: dit bestand stelt een eigen Docker-netwerk en een service
  Netdata in om infrastructuur te bewaken en problemen op te lossen. Het bevat
  uitgebreide netwerkinstellingen en serviceconfiguraties, zodat Netdata soepel
  en veilig draait.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: netdata

networks:
  netdata_net:
    attachable: false
    internal: false
    external: false
    name: netdata
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.4.0/24
          ip_range: 172.20.4.0/24
          gateway: 172.20.4.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "netdata"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.netdata.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `netdata_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk is niet extern gedefinieerd, maar wordt in
  dit Compose-bestand gemaakt.
- **name: netdata**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "netdata"**: geeft het bridge-netwerk een
    naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.netdata.network.description**: een label met een beschrijving van het
    netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  netdata_app:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: netdata
    image: ghcr.io/netdata/netdata:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      netdata_socket-proxy:
        condition: service_started
    volumes:
      - /docker/netdata/production/app/cache:/var/cache/netdata
      - /docker/netdata/production/app/config:/etc/netdata
      - /docker/netdata/production/app/lib:/var/lib/netdata
      - /etc/group:/host/etc/group:ro
      - /etc/localtime:/etc/localtime:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /etc/passwd:/host/etc/passwd:ro
      - /proc:/host/proc:ro
      - /run/dbus:/run/dbus:ro
      - /sys:/host/sys:ro
      - /var/log:/host/var/log:ro
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      DOCKER_USR: root
      DOCKER_HOST: netdata_socket-proxy:2375 # Resolves container names through the read-only socket proxy.
      NETDATA_EXTRA_APK_PACKAGES: lm-sensors
    domainname: netdata.local # Customize this with your own domain, e.g., `netdata.local` to `netdata.your-fqdn-here.com`.
    hostname: netdata
    networks:
      netdata_net:
        ipv4_address: 172.20.4.2
    ports:
      - "19999:19999/tcp" # HTTP
    security_opt:
      - apparmor:unconfined
      - no-new-privileges:true
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    labels:
      com.netdata.description:
        "is an infrastructure monitoring and troubleshooting."
    healthcheck:
      disable: false
      test: ["CMD", "/usr/sbin/health.sh"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: definieert de services die worden uitgerold.
- **netdata_app**: de naam van de service voor de container van Netdata.
  - **deploy.resources.limits.pids: 2048**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: zorgt dat de container altijd opnieuw start als die
    stopt of mislukt.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt de grootte van een logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: netdata**: geeft de container de naam "netdata".
  - **image: ghcr.io/netdata/netdata**: gebruikt de image van Netdata.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **depends_on**: start deze service pas nadat `netdata_socket-proxy` is
    gestart.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/netdata/production/app/cache:/var/cache/netdata**: bewaart de
      cachegegevens van Netdata.
    - **/docker/netdata/production/app/config:/etc/netdata**: bewaart de
      configuratiegegevens van Netdata.
    - **/docker/netdata/production/app/lib:/var/lib/netdata**: bewaart de
      bibliotheekgegevens van Netdata.
    - **/etc/group:/host/etc/group:ro**: koppelt het groepsbestand van de host
      alleen-lezen.
    - **/etc/localtime:/etc/localtime:ro**: koppelt het bestand met de lokale
      tijd van de host alleen-lezen.
    - **/etc/os-release:/host/etc/os-release:ro**: koppelt het
      os-release-bestand van de host alleen-lezen.
    - **/etc/passwd:/host/etc/passwd:ro**: koppelt het passwd-bestand van de
      host alleen-lezen.
    - **/proc:/host/proc:ro**: koppelt de map proc van de host alleen-lezen.
    - **/run/dbus:/run/dbus:ro**: koppelt de runtimemap van DBus van de host
      alleen-lezen.
    - **/sys:/host/sys:ro**: koppelt de map sys van de host alleen-lezen.
    - **/var/log:/host/var/log:ro**: koppelt de logmap van de host alleen-lezen.
  - **environment**: stelt omgevingsvariabelen in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **DOCKER_USR: root**: stelt root in als Docker-gebruiker.
    - **DOCKER_HOST: netdata_socket-proxy:2375**: leest de namen van de
      containers via de socketproxy die alleen leest, in plaats van via de
      Docker-socket.
    - **NETDATA_EXTRA_APK_PACKAGES: lm-sensors**: installeert extra pakketten
      (lm-sensors).
  - **domainname: netdata.local**: stelt de domeinnaam van de container in.
  - **hostname: netdata**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `netdata_net`.
    - **ipv4_address: 172.20.4.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de host aan poorten van de container.
    - **"19999:19999/tcp"**: koppelt TCP-poort 19999 op de host aan poort 19999
      in de container.
  - **security_opt**: beveiligingsopties voor de container.
    - **apparmor:unconfined**: draait de container zonder de beperkingen van
      AppArmor.
    - **no-new-privileges:true**: voorkomt dat de container extra rechten
      krijgt.
  - **cap_add**: voegt extra capabilities aan de container toe.
    - **SYS_PTRACE**: staat het tracen van processen toe.
    - **SYS_ADMIN**: staat verschillende beheerhandelingen toe.
  - **labels**: metadata van de container.
    - **com.netdata.description**: label met een beschrijving van Netdata.
  - **healthcheck**: configuratie van de health check.
    - **disable: false**: zet health checks aan voor de container.
    - **test**: geeft het commando voor de health check. Hier is dat
      `["CMD", "/usr/sbin/health.sh"]`.
    - **interval**: de tijd tussen twee health checks (10 seconden).
    - **timeout**: de tijd die een health check mag duren voordat die als
      mislukt geldt (5 seconden).
    - **retries**: het aantal opeenvolgende mislukkingen voordat de container
      als ongezond geldt (3 pogingen).
    - **start_period**: de beginperiode waarin een mislukte health check niet
      meetelt voor de pogingen (10 seconden).
    - **start_interval**: de tijd tussen health checks tijdens het opstarten (5
      seconden).

### `netdata_socket-proxy`

```yaml
services:
  netdata_socket-proxy:
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
    container_name: netdata_socket-proxy
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
      POST: 0 # Read-only: only GET and HEAD requests reach Docker.
    hostname: netdata_socket-proxy
    networks:
      netdata_net:
        ipv4_address: 172.20.4.3
    security_opt:
      - no-new-privileges:true
    labels:
      com.netdata.socket-proxy.description:
        "is a read-only Docker API proxy for Netdata."
```

- **netdata_socket-proxy**: de Docker-socketproxy die alleen leest.
  `netdata_app` bereikt de Docker-API via deze proxy op poort 2375, in plaats
  van de Docker-socket te koppelen.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: unless-stopped**: start de container opnieuw, tenzij die
    uitdrukkelijk is gestopt.
  - **logging**: gebruikt het stuurprogramma `json-file`, beperkt tot 1 MB per
    bestand en maximaal 2 bestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: netdata_socket-proxy**: geeft de container een naam.
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
    opvragen en bekijken van containers toe en `POST: 0` blokkeert elk verzoek
    dat iets wijzigt. Alleen verzoeken met `GET` en `HEAD` bereiken Docker.
  - **hostname: netdata_socket-proxy**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk van de stack met het vaste
    IP-adres `172.20.4.3`.
  - **security_opt: no-new-privileges:true**: voorkomt dat de container extra
    rechten krijgt.
  - **labels**: een label met een beschrijving.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start de stack. Netdata leest de namen van de containers via de socketproxy
   die alleen leest (`netdata_socket-proxy`), in plaats van via de
   Docker-socket:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Netdata via deze URL:

```bash
http://your-ip-address:19999
```

## Standaard inloggegevens {#default-login-credentials}

**Gebruikersnaam**: er is geen gebruikersnaam nodig.

**Wachtwoord**: er is geen wachtwoord nodig.

{{% alert context="warning" %}}
**Het lokale dashboard heeft geen login. Stel het niet open buiten je netwerk.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een degelijke Docker-omgeving op voor Netdata, een
systeem om infrastructuur te bewaken en problemen op te lossen. Het maakt een
eigen bridge-netwerk met vaste IP-instellingen en beveiligingsinstellingen. De
service Netdata heeft blijvende opslag, toegang tot de belangrijkste mappen van
de host en verschillende netwerk- en beveiligingsopties. De configuratie zorgt
dat Netdata continu draait, na een fout opnieuw start en efficiënt logt.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/netdata/compose.yml
