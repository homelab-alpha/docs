---
title: "portainer.info"
description:
  "Rol Portainer uit om Docker-omgevingen te beheren. Met de configuratie van
  een eigen Docker-netwerk en de service Portainer, voor een goede en veilige
  werking."
url: "docker/compose-info/portainer"
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

weight: 4120

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet. Het bestand
stelt services in en rolt ze uit met Docker Compose; het zet een instantie van
Portainer op om Docker-omgevingen te beheren.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `portainer`, ingesteld met `name:` op het hoogste niveau van
  het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: dit bestand stelt een eigen Docker-netwerk en een service
  Portainer in om Docker-containers te beheren. Het bevat uitgebreide
  netwerkinstellingen en serviceconfiguraties, zodat Portainer soepel en veilig
  draait.
- **RAW-compose-bestand**: [compose.yml]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: portainer

networks:
  portainer_net:
    attachable: false
    internal: false
    external: false
    name: portainer
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.1.0/24
          ip_range: 172.20.1.0/24
          gateway: 172.20.1.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "portainer"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.portainer.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `portainer_net`.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal: false**: het netwerk is van buitenaf bereikbaar.
- **external: false**: het netwerk is niet extern gedefinieerd, maar wordt in
  dit Compose-bestand gemaakt.
- **name: portainer**: geeft de naam van het netwerk.
- **driver: bridge**: gebruikt het stuurprogramma bridge voor een afgeschermd
  netwerk.
- **ipam**: stelt het beheer van IP-adressen voor het netwerk in.
  - **subnet**: definieert het subnet van het netwerk.
  - **ip_range**: beperkt het IP-bereik binnen het subnet.
  - **gateway**: stelt de gateway van het netwerk in.
- **driver_opts**: extra opties voor het netwerkstuurprogramma.
  - **default_bridge: "false"**: geeft aan dat dit niet de standaardbridge van
    Docker is.
  - **enable_icc: "true"**: zet communicatie tussen containers aan.
  - **enable_ip_masquerade: "true"**: laat uitgaand verkeer eruitzien alsof het
    van de host komt.
  - **host_binding_ipv4: "0.0.0.0"**: koppelt de bridge aan alle beschikbare
    IP-adressen van de host.
  - **bridge.name: "portainer"**: geeft het bridge-netwerk een naam.
  - **mtu: "1500"**: stelt de Maximum Transmission Unit (MTU) van het netwerk
    in.
- **labels**: metadata van het netwerk.
  - **com.portainer.network.description**: een label met een beschrijving van
    het netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  portainer_app:
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
    container_name: portainer
    image: docker.io/portainer/portainer-ee:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/portainer/production/app:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: portainer.local # Customize this with your own domain, e.g., `portainer.local` to `portainer.your-fqdn-here.com`.
    hostname: portainer
    networks:
      portainer_net:
        ipv4_address: 172.20.1.2
    ports:
      - "8000:8000/tcp" # Edge agents
      - "9443:9443/tcp" # HTTPS
    security_opt:
      - no-new-privileges:true
    labels:
      com.portainer.description:
        "deploy, configure, troubleshoot and secure containers."
    healthcheck:
      disable: true
```

- **services**: definieert de services die worden uitgerold.
- **portainer_app**: de naam van de service voor de container van Portainer.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: zorgt dat de container altijd opnieuw start als die
    stopt of crasht.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt de grootte van een logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: portainer**: geeft de container de naam "portainer".
  - **image: docker.io/portainer/portainer-ee**: gebruikt de image van
    Portainer.
  - **pull_policy: if_not_present**: haalt de image alleen op als die nog niet
    lokaal aanwezig is.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/portainer/production/app:/data**: bewaart de gegevens van
      Portainer.
    - **/var/run/docker.sock:/var/run/docker.sock**: geeft de container toegang
      tot de Docker-socket.
  - **environment**: stelt omgevingsvariabelen in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
  - **domainname: portainer.local**: stelt de domeinnaam van de container in.
  - **hostname: portainer**: stelt de hostnaam van de container in.
  - **networks**: koppelt de service aan het netwerk `portainer_net`.
    - **ipv4_address: 172.20.1.2**: geeft de container een vast IP-adres.
  - **ports**: koppelt poorten van de host aan poorten van de container.
    - **"8000:8000/tcp"**: koppelt TCP-poort 8000 op de host aan poort 8000 in
      de container.
    - **"9443:9443/tcp"**: koppelt TCP-poort 9443 op de host aan poort 9443 in
      de container.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges: true**: voorkomt dat de container extra rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.portainer.description**: label met een beschrijving van Portainer.
  - **healthcheck**: configuratie van de health check.
    - **disable: true**: zet health checks voor de container uit.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaard webtoegang {#default-web-access}

Open de webinterface van Portainer via deze URL:

```bash
https://your-ip-address:9443
```

Portainer wordt alleen via HTTPS gepubliceerd. Het gebruikt standaard een
zelfondertekend certificaat, dus je browser toont bij het eerste bezoek een
waarschuwing.

Poort 8000 is de tunnelserver voor Edge Agents.

## Standaard inloggegevens {#default-login-credentials}

{{% alert context="warning" %}}
Maak het beheerdersaccount binnen **5 minuten** na de eerste start. Daarna stopt
Portainer om veiligheidsredenen. Start de container opnieuw om het nog eens te
proberen:

```bash
docker compose restart
```
{{% /alert %}}

**Gebruikersnaam**: gemaakt tijdens de installatie

**Wachtwoord**: gemaakt tijdens de installatie

{{% alert context="warning" %}}
**Om veiligheidsredenen raden we sterk aan om tijdens de installatie een sterke
gebruikersnaam en een sterk wachtwoord te maken.**
{{% /alert %}}

## Conclusie {#conclusion}

Dit Compose-bestand zet een degelijke Docker-omgeving op voor Portainer, een
beheerinterface voor Docker. Het maakt een eigen bridge-netwerk met vaste
IP-instellingen en beveiligingsinstellingen. De service Portainer heeft
blijvende opslag, toegang tot de Docker-socket en verschillende netwerk- en
beveiligingsopties. De configuratie zorgt dat Portainer continu draait, na een
fout opnieuw start en efficiënt logt.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/portainer/compose.yml
