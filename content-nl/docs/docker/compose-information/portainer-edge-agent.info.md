---
title: "portainer-edge-agent.info"
description:
  "Rol de Portainer Edge Agent uit, voor een gebruiksvriendelijk beheer van
  stacks van Docker Compose dat je zelf host. Met eigen
  Docker-netwerkinstellingen, de configuratie van de service en
  beveiligingsmaatregelen voor een efficiënte en veilige werking."
url: "docker/compose-info/portainer-edge-agent"
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
  - Infrastructure Management
keywords:
  - Docker
  - Portainer
  - Docker Compose
  - Container Management
  - Docker Network
  - Portainer Edge Agent
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Infrastructure Monitoring
  - Self-hosted Docker Management

weight: 4119

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit bestand `compose.yml` doet om de Portainer
Edge Agent uit te rollen, voor een gebruiksvriendelijk beheer van stacks van
Docker Compose.

Hier volgt een uitgebreide uitleg:

## Gegevens van het Compose-bestand {#compose-file-metadata}

- **Bestandsnaam**: `compose.yml`
- **Projectnaam**: `portainer-edge-agent`, ingesteld met `name:` op het hoogste
  niveau van het bestand.
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 19 november 2026
- **Beschrijving**: stelt een Docker-netwerk en de service Portainer Edge Agent
  in om stacks van Docker Compose te beheren.
- **RAW-compose-bestand**: [compose.yml]
- **RAW-bestand .env**: [.env]
- **RAW-bestand stack.env**: [stack.env]

## Netwerkconfiguratie {#networks-configuration}

```yaml
---
name: portainer-edge-agent

networks:
  edge-agent_net:
    attachable: false
    internal: false
    external: false
    name: edge-agent
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.18.0/24
          ip_range: 172.20.18.0/24
          gateway: 172.20.18.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "edge-agent"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.edge-agent.network.description: "is an isolated bridge network."
```

- **networks**: dit deel definieert het eigen netwerk `edge-agent_net` voor de
  Portainer Edge Agent.
- **attachable**: staat op `false`: andere containers kunnen zich niet aan dit
  netwerk koppelen.
- **internal**: staat op `false`: het netwerk is van buitenaf bereikbaar.
- **external**: staat op `false`: het netwerk wordt in het Compose-bestand
  gemaakt.
- **name: edge-agent**: geeft de naam van het netwerk.
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
  - **com.docker.network.bridge.name: "edge-agent"**: geeft het bridge-netwerk
    een naam.
  - **com.docker.network.driver.mtu: "1500"**: stelt de Maximum Transmission
    Unit (MTU) van het netwerk in.
- **labels**: metadata van het netwerk.
  - **com.edge-agent.network.description**: een label met een beschrijving van
    het netwerk.

## Configuratie van de services {#services-configuration}

```yaml
services:
  edge-agent_app:
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
    container_name: edge-agent
    image: docker.io/portainer/agent:<tag> # The current tag is in the RAW compose.yml.
    volumes:
      - /docker/portainer/edge-agent/production/app:/data
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
      - /:/host:ro # Read-only view of the host file system for the host management features.
    env_file:
      # Compose loads each file that exists and skips a missing one:
      # '.env' for the Docker Compose CLI, 'stack.env' for Portainer.
      - path: .env
        required: false
      - path: stack.env
        required: false
    environment:
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      EDGE: 1
      EDGE_ID: ${PORTAINER_AGENT_ID} # Fill in the value in both the .env and stack.env files
      EDGE_KEY: ${PORTAINER_AGENT_KEY} # Fill in the value in both the .env and stack.env files
      EDGE_INSECURE_POLL: ${EDGE_INSECURE_POLL:-0} # Set to 1 in .env or stack.env only if the Portainer server uses a self-signed certificate.
    networks:
      edge-agent_net:
        ipv4_address: 172.20.18.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.edge-agent.description:
        "a remote environment is not directly accessible from docker server."
    healthcheck:
      disable: true
```

- **services**: definieert de services die worden uitgerold.
- **edge-agent_app**: de naam van de service voor de container van de Portainer
  Edge Agent.
  - **deploy.resources.limits.pids: 512**: beperkt het aantal processen en
    threads in de container, wat de host beschermt tegen fork bombs.
  - **restart: always**: zorgt dat de container automatisch opnieuw start.
  - **logging**: stelt de logging van de container in.
    - **driver: "json-file"**: gebruikt het logstuurprogramma voor
      JSON-bestanden.
    - **max-size: "1M"**: beperkt de grootte van een logbestand tot 1 MB.
    - **max-file: "2"**: bewaart maximaal 2 logbestanden.
  - **stop_grace_period: 1m**: wacht 1 minuut voordat de container geforceerd
    wordt gestopt.
  - **container_name: edge-agent**: geeft de container de naam "edge-agent".
  - **image: docker.io/portainer/agent**: gebruikt de image van de Portainer
    Edge Agent.
  - **volumes**: koppelt mappen of bestanden van de host in de container.
    - **/docker/portainer/edge-agent/production/app:/data**: koppelt de
      gegevensmap van de toepassing.
    - **/var/run/docker.sock:/var/run/docker.sock**: koppelt de Docker-socket.
    - **/var/lib/docker/volumes:/var/lib/docker/volumes**: koppelt de
      Docker-volumes.
    - **/:/host:ro**: koppelt de rootmap van de host alleen-lezen in de
      container.
  - **env_file**: laadt `.env` (Docker Compose-CLI) en `stack.env` (Portainer).
    Beide staan erin met `required: false`, zodat Compose het bestand dat
    ontbreekt overslaat.
    - **.env**: voor Docker Compose.
    - **stack.env**: voor Portainer.
  - **environment**: stelt omgevingsvariabelen in.
    - **TZ: Europe/Amsterdam**: zet de tijdzone op Amsterdam.
    - **EDGE: 1**: zet de Edge-functionaliteit aan.
    - **EDGE_ID**: geeft de ID van de Portainer Edge Agent op.
    - **EDGE_KEY**: geeft de sleutel van de Portainer Edge Agent op.
    - **EDGE_INSECURE_POLL: ${EDGE_INSECURE_POLL:-0}**: controleert standaard
      het TLS-certificaat van de Portainer-server. Zet `EDGE_INSECURE_POLL=1` in
      `.env` of `stack.env` alleen bij een zelfondertekend certificaat.
  - **networks**: koppelt de service aan het netwerk `edge-agent_net`.
    - **ipv4_address: 172.20.18.2**: geeft de container een vast IP-adres.
  - **security_opt**: beveiligingsopties voor de container.
    - **no-new-privileges:true**: zorgt dat de container geen nieuwe rechten
      krijgt.
  - **labels**: metadata van de container.
    - **com.edge-agent.description**: label met een beschrijving van de
      Portainer Edge Agent.
  - **healthcheck**: configuratie van de health check.
    - **disable: true**: zet health checks voor de container uit.

## Omgevingsvariabelen {#environment-variables}

Dit bestand bevat instellingen die verschillende toepassingen kunnen gebruiken
(zoals Docker-containers of je MySQL-server). De waarden zijn variabelen die om
veiligheidsredenen buiten de broncode staan.

### Variabelen in dit bestand {#variables-in-this-file}

```env
# Portainer Agent Configuration
# Change the Portainer Agent ID to a unique identifier
# Ensure it is a random and secure string.
PORTAINER_AGENT_ID=UniqueAgentID12345

# Portainer Agent Key: Change this to a secure, strong key
# Avoid using predictable patterns or common phrases.
PORTAINER_AGENT_KEY=SecureAgentKey67890

# TLS verification of the Portainer server: 0 verifies the certificate.
# Set to 1 only if the server uses a self-signed certificate.
EDGE_INSECURE_POLL=0
```

- **`PORTAINER_AGENT_ID`**: een unieke aanduiding van de Portainer-agent. Deze
  ID moet een willekeurige, veilige tekenreeks zijn, voor de beveiliging van je
  Portainer-omgeving.
- **`PORTAINER_AGENT_KEY`**: de sleutel die de communicatie tussen de
  Portainer-agent en de Portainer-server beveiligt. Ook dit moet een sterke,
  unieke tekenreeks zijn, zonder makkelijk te raden patronen.
- **`EDGE_INSECURE_POLL`**: `0` controleert het TLS-certificaat van de
  Portainer-server. Zet het alleen op `1` als de server een zelfondertekend
  certificaat gebruikt.

## Snel aan de slag {#quick-start}

{{% alert context="info" %}}
Vereist Docker Compose 2.24.0 of nieuwer.
{{% /alert %}}

1. Wijzig de waarden in `.env` (Docker Compose-CLI) of `stack.env` (Portainer),
   in ieder geval de wachtwoorden.

2. Voeg in Portainer een Edge Agent-omgeving toe en kopieer de Edge-ID en de
   Edge-sleutel naar `PORTAINER_AGENT_ID` en `PORTAINER_AGENT_KEY`.

3. De agent controleert het TLS-certificaat van de Portainer-server
   (`EDGE_INSECURE_POLL=0`). Gebruikt je server nog het zelfondertekende
   certificaat van Portainer, geef die dan een vertrouwd certificaat, of zet op
   eigen risico `EDGE_INSECURE_POLL=1` in `.env` of `stack.env`.

4. Start de stack:

   ```bash
   docker compose up -d
   ```

## Standaardtoegang {#default-access}

De Edge Agent heeft geen webinterface. Hij maakt verbinding met je
Portainer-server, waar de omgeving verschijnt zodra de agent draait.

## Standaard inloggegevens {#default-login-credentials}

De agent heeft geen login. Hij meldt zich aan met `PORTAINER_AGENT_ID` en
`PORTAINER_AGENT_KEY` uit het bestand `.env` of `stack.env`.

## Conclusie {#conclusion}

Dit Compose-bestand zet een Docker-omgeving op voor de Portainer Edge Agent, een
omgeving op afstand om Docker-hosts te beheren. De configuratie definieert een
eigen bridge-netwerk met vaste IP-instellingen en beveiligingsinstellingen. De
service Portainer Edge Agent draait continu, met blijvende opslag voor de
gegevens van de toepassing en de Docker-volumes. De opzet zorgt dat de Portainer
Edge Agent efficiënt en veilig draait, met passende logging en een passend
herstartbeleid.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/portainer-edge-agent/compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/portainer-edge-agent/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/portainer-edge-agent/stack.env
