---
title: "Een bridge-netwerk opzetten"
description:
  "Deze gids legt uit hoe je een Docker-netwerk van het type `bridge` opzet in
  Compose en met de CLI, behandelt de opties van het stuurprogramma en IPv6, en
  beschrijft het IP-plan van de stacks van Homelab-Alpha."
url: "docker/network-info/bridge-network-setup"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker Network
tags:
  - Docker
  - Network
  - Bridge
  - Container Networking
  - IPAM
keywords:
  - Docker bridge network
  - Docker network setup
  - Docker Compose networks
  - IPAM
  - IP plan

weight: 4201

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Een `bridge`-netwerk is een privénetwerk op de Docker-host. Containers erop
krijgen een adres uit het subnet, bereiken elkaar op naam en bereiken het
internet via de host (IP-masquerading). Vanaf je LAN bereik je een container
alleen via een poort die de stack publiceert. Elke stack in `compose-files/`
gebruikt een eigen bridge-netwerk.

Zie
[Een netwerkstuurprogramma kiezen](/docker/network-info/choosing-a-network-driver/)
voor een vergelijking met `ipvlan` en `macvlan`.

## Voorbeeld met Compose {#compose-example}

Dit is het netwerkblok dat de stacks gebruiken. Vervang `example` door de naam
van de stack en `172.20.30.0/24` door een vrij subnet uit het
[IP-plan](#ip-plan-of-the-stacks).

```yaml
networks:
  example_net:
    attachable: false
    internal: false
    external: false
    name: example
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.30.0/24
          ip_range: 172.20.30.0/24
          gateway: 172.20.30.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "example"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.example.network.description: "is an isolated bridge network."

services:
  example_app:
    image: docker.io/library/nginx:stable
    networks:
      example_net:
        ipv4_address: 172.20.30.2
    ports:
      - "8080:80/tcp"
```

- De sleutel onder `networks:` (`example_net`) is de naam in het
  Compose-bestand. `name:` stelt de naam van het netwerk in Docker in.
- `ipv4_address` geeft de container een vast adres. Laat het weg, dan kiest
  Docker er een uit `ip_range`.
- `ports` publiceert poort 80 van de container op poort 8080 van de host.

## Voorbeeld met de CLI {#cli-example}

Maak hetzelfde netwerk één keer met `docker network create`, bijvoorbeeld als
meerdere stacks het delen:

```bash
docker network create \
  --driver bridge \
  --subnet 172.20.30.0/24 \
  --ip-range 172.20.30.0/24 \
  --gateway 172.20.30.1 \
  --opt com.docker.network.bridge.enable_icc=true \
  --opt com.docker.network.bridge.enable_ip_masquerade=true \
  --opt com.docker.network.bridge.host_binding_ipv4=0.0.0.0 \
  --opt com.docker.network.bridge.name=example \
  --opt com.docker.network.driver.mtu=1500 \
  --label com.example.network.description="is an isolated bridge network." \
  example
```

Een stack doet met `external: true` mee in dit netwerk. Docker Compose maakt of
verwijdert het dan niet:

```yaml
networks:
  example_net:
    external: true
    name: example
```

## Opties {#options}

| Compose-sleutel of CLI-optie                     | Standaard         | Betekenis                                                             |
| :----------------------------------------------- | :---------------- | :-------------------------------------------------------------------- |
| `internal` / `--internal`                        | `false`           | `true` blokkeert al het verkeer van en naar buiten het netwerk.       |
| `attachable` / `--attachable`                    | `false`           | `true` laat losse containers meedoen met `docker network connect`.    |
| `external`                                       | `false`           | Alleen Compose: `true` betekent dat het netwerk al bestaat.           |
| `ipam.config.subnet` / `--subnet`                | Kiest Docker      | Het adresbereik van het netwerk.                                      |
| `ipam.config.ip_range` / `--ip-range`            | Het subnet        | Het deel van het subnet dat Docker aan containers uitdeelt.           |
| `ipam.config.gateway` / `--gateway`              | Eerste adres      | Het adres van de host op dit netwerk.                                 |
| `com.docker.network.bridge.name`                 | `br-<id>`         | De naam van de Linux-bridge-interface op de host.                     |
| `com.docker.network.bridge.enable_icc`           | `true`            | Laat de containers op dit netwerk met elkaar praten.                  |
| `com.docker.network.bridge.enable_ip_masquerade` | `true`            | Laat de containers via de host het internet bereiken.                 |
| `com.docker.network.bridge.host_binding_ipv4`    | Alle adressen     | Het adres van de host waaraan gepubliceerde poorten worden gekoppeld. |
| `com.docker.network.driver.mtu`                  | `0` (geen limiet) | De MTU van de interfaces van de containers.                           |

De stacks zetten ook `com.docker.network.bridge.default_bridge: "false"`. Dat is
de waarde voor elk netwerk behalve het standaardnetwerk `bridge` van Docker.

## IPv6

Voeg `enable_ipv6: true` en een IPv6-subnet toe. Dit voorbeeld gebruikt een
prefix voor een unique local address (ULA):

```yaml
networks:
  example_net:
    name: example
    driver: bridge
    enable_ipv6: true
    ipam:
      config:
        - subnet: 172.20.30.0/24
          gateway: 172.20.30.1
        - subnet: fd00:172:20:30::/64
          gateway: fd00:172:20:30::1
```

Gebruik met de CLI `--ipv6` en een tweede `--subnet`:

```bash
docker network create --driver bridge --ipv6 \
  --subnet 172.20.30.0/24 --gateway 172.20.30.1 \
  --subnet fd00:172:20:30::/64 --gateway fd00:172:20:30::1 \
  example
```

Laat je het IPv6-subnet weg, dan kiest Docker zelf een ULA-prefix.

## IP-plan van de stacks {#ip-plan-of-the-stacks}

Elke productiestack heeft een eigen subnet `/24`, zodat de netwerken nooit
overlappen:

- `172.20.<n>.0/24` voor productiestacks.
- De gateway is `.1`; de containers beginnen bij `.2`.
- Een bètastack heeft geen eigen netwerk. Hij doet als extern netwerk mee in het
  netwerk van zijn productiestack en neemt de volgende vrije adressen. Start
  eerst de productiestack.

| Subnet           | Stack                                         | Netwerk                     | Gateway       |
| :--------------- | :-------------------------------------------- | :-------------------------- | :------------ |
| `172.19.3.0/24`  | `uptime-kuma`, `uptime-kuma-beta`             | `uptime-kuma`               | `172.19.3.1`  |
| `172.20.1.0/24`  | `portainer`                                   | `portainer`                 | `172.20.1.1`  |
| `172.20.2.0/24`  | `watchtower`                                  | `watchtower`                | `172.20.2.1`  |
| `172.20.4.0/24`  | `netdata`                                     | `netdata`                   | `172.20.4.1`  |
| `172.20.5.0/24`  | `jellyfin`                                    | `jellyfin`                  | `172.20.5.1`  |
| `172.20.6.0/24`  | `freshrss`                                    | `freshrss`                  | `172.20.6.1`  |
| `172.20.7.0/24`  | `dockge`                                      | `dockge`                    | `172.20.7.1`  |
| `172.20.8.0/24`  | `xen-orchestra`                               | `xen-orchestra`             | `172.20.8.1`  |
| `172.20.9.0/24`  | `dozzle`                                      | `dozzle`                    | `172.20.9.1`  |
| `172.20.10.0/24` | `openspeedtest`                               | `openspeedtest`             | `172.20.10.1` |
| `172.20.11.0/24` | `netboot`                                     | `netboot`                   | `172.20.11.1` |
| `172.20.12.0/24` | `plex`                                        | `plex`                      | `172.20.12.1` |
| `172.20.14.0/24` | `cloudbeaver`                                 | `cloudbeaver`               | `172.20.14.1` |
| `172.20.15.0/24` | `adguard-home`                                | `adguard-home`              | `172.20.15.1` |
| `172.20.16.0/24` | `mariadb`                                     | `mariadb`                   | `172.20.16.1` |
| `172.20.17.0/24` | `pi-hole`                                     | `pi-hole`                   | `172.20.17.1` |
| `172.20.18.0/24` | `portainer-edge-agent`                        | `edge-agent`                | `172.20.18.1` |
| `172.20.19.0/24` | `unifi-network-application`                   | `unifi-network-application` | `172.20.19.1` |
| `172.20.20.0/24` | `nginx-proxy-manager`                         | `nginx-proxy-manager`       | `172.20.20.1` |
| `172.20.21.0/24` | `haproxy`                                     | `haproxy`                   | `172.20.21.1` |
| `172.20.22.0/24` | `it-tools`                                    | `it-tools`                  | `172.20.22.1` |
| `172.20.23.0/24` | `speedtest-tracker`, `speedtest-tracker-beta` | `speedtest-tracker`         | `172.20.23.1` |
| `172.20.24.0/24` | `immich`                                      | `immich`                    | `172.20.24.1` |
| `172.20.25.0/24` | `postgresql`                                  | `postgresql`                | `172.20.25.1` |
| `172.20.26.0/24` | `mini-qr`                                     | `mini-qr`                   | `172.20.26.1` |
| `172.20.27.0/24` | `harborguard`                                 | `harborguard`               | `172.20.27.1` |

`uptime-kuma` is een uitzondering: die gebruikt `172.19.3.0/24` in plaats van
`172.20.3.0/24`. De bètastacks gebruiken deze adressen:

| Stack                    | Netwerk             | Database      | App           |
| :----------------------- | :------------------ | :------------ | :------------ |
| `uptime-kuma`            | `uptime-kuma`       | `172.19.3.2`  | `172.19.3.3`  |
| `uptime-kuma-beta`       | `uptime-kuma`       | `172.19.3.4`  | `172.19.3.5`  |
| `speedtest-tracker`      | `speedtest-tracker` | `172.20.23.2` | `172.20.23.3` |
| `speedtest-tracker-beta` | `speedtest-tracker` | `172.20.23.4` | `172.20.23.5` |

De Docker-socketproxy's die alleen lezen gebruiken `172.19.3.6` (`uptime-kuma`),
`172.19.3.7` (`uptime-kuma-beta`) en `172.20.4.3` (`netdata`).

Om een stack toe te voegen, kies je een vrij `<n>` (bijvoorbeeld
`172.20.13.0/24` of `172.20.28.0/24`) en controleer je met `docker network ls`
en `docker network inspect` dat geen ander netwerk op de host het gebruikt.

## Problemen oplossen {#troubleshooting}

| Probleem                                             | Controle                                                                                                  |
| :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| De service is niet bereikbaar vanaf het LAN          | Controleer `ports` in `compose.yml`, en of geen andere service de poort op de host gebruikt (`ss -tlnp`). |
| De container heeft geen internettoegang              | Controleer `internal: false` en `enable_ip_masquerade: "true"`, en of de host internettoegang heeft.      |
| Twee stacks kunnen elkaar niet bereiken              | Elke stack heeft een eigen netwerk. Koppel beide aan een gedeeld extern netwerk, of publiceer een poort.  |
| `Pool overlaps with other one on this address space` | Kies een ander subnet uit het IP-plan.                                                                    |

Zie ook het
[deel over problemen oplossen](/docker/network-info/choosing-a-network-driver/#troubleshooting)
van het overzicht.
