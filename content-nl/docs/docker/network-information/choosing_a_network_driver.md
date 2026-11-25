---
title: "Een netwerkstuurprogramma kiezen"
description:
  "Deze gids vergelijkt de Docker-netwerkstuurprogramma's bridge, ipvlan en
  macvlan, helpt je er een te kiezen, legt uit wanneer je een netwerk in Compose
  of met de CLI definieert en geeft veelvoorkomende stappen om problemen op te
  lossen."
url: "docker/network-info/choosing-a-network-driver"
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
  - IPvlan
  - Macvlan
  - Container Networking
keywords:
  - Docker network drivers
  - bridge vs macvlan
  - ipvlan vs macvlan
  - Docker networking
  - container networking

weight: 4202

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Docker biedt verschillende netwerkstuurprogramma's. Deze gids vergelijkt de drie
die de stacks in de [docker-repository](https://github.com/homelab-alpha/docker)
gebruiken of ondersteunen, en helpt je er een te kiezen. Elk stuurprogramma
heeft een eigen gids met voorbeelden voor Compose en de CLI:

- [Een bridge-netwerk opzetten](/docker/network-info/bridge-network-setup/)
- [Een IPvlan-netwerk opzetten](/docker/network-info/ipvlan-network-setup/)
- [Een macvlan-netwerk opzetten](/docker/network-info/macvlan-network-setup/)

## Vergelijking {#comparison}

| Eigenschap                    | `bridge`                         | `ipvlan`                           | `macvlan`                                             |
| :---------------------------- | :------------------------------- | :--------------------------------- | :---------------------------------------------------- |
| IP-adres van de container     | Privésubnet op de host           | Adres in je LAN (L2) of gerouteerd | Adres in je LAN                                       |
| Bereikbaar vanaf het LAN      | Alleen via gepubliceerde poorten | Ja, op een eigen IP-adres          | Ja, op een eigen IP-adres                             |
| MAC-adres                     | Per container, achter de host    | Deelt het MAC van de parent        | Eigen MAC per container                               |
| Host ↔ container              | Werkt                            | Geblokkeerd door Linux, shim nodig | Geblokkeerd door Linux, shim nodig                    |
| Container ↔ container op naam | Ja, op een eigen netwerk         | Ja, op hetzelfde netwerk           | Ja, op hetzelfde netwerk                              |
| Vereisten                     | Geen                             | Linux-kernel 4.2 of nieuwer        | Switch en netwerkkaart die veel MAC's accepteren      |
| Gebruikelijk gebruik          | Bijna elke stack                 | LAN-IP's waar MAC's beperkt zijn   | Apps die een eigen identiteit op het LAN nodig hebben |

## Welke gebruik je {#which-one-to-use}

- **Gebruik `bridge`** standaard. Elke stack in `compose-files/` gebruikt een
  eigen bridge-netwerk. De containers zijn afgeschermd van andere stacks, en je
  bereikt ze via de gepubliceerde poorten van de host.
- **Gebruik `ipvlan`** als een container een eigen IP-adres in je LAN nodig
  heeft, maar je switch, wifi-toegangspunt of virtualisatiehost het aantal
  MAC-adressen per poort beperkt. Alle containers delen het MAC-adres van de
  host.
- **Gebruik `macvlan`** als een container eruit moet zien als een apart apparaat
  op je LAN, met een eigen MAC-adres. Voorbeelden zijn een DHCP-server, een
  DNS-server die je router als aparte host moet zien, of een app die apparaten
  met broadcasts vindt.

{{% alert context="info" %}}
Met `ipvlan` en `macvlan` omzeilen de containers het publiceren van poorten door
Docker. Een service is bereikbaar op elke poort waarop die luistert, op het
IP-adres van de container. Gebruik een firewall op de container of op je netwerk
als je de toegang wilt beperken.
{{% /alert %}}

## Het netwerk definiëren in Compose of met de CLI {#define-the-network-in-compose-or-with-the-cli}

Er zijn twee manieren om een netwerk te maken, en beide werken voor elk
stuurprogramma:

- **In `compose.yml`**: het deel `networks:` van de stack definieert het
  netwerk. Docker Compose maakt het bij `docker compose up` en verwijdert het
  bij `docker compose down`. De stacks in de docker-repository werken zo.
- **Met `docker network create`**: je maakt het netwerk één keer, buiten een
  stack. Een stack doet er dan met `external: true` in mee. Gebruik deze manier
  als meerdere stacks één netwerk delen, of voor netwerken met `ipvlan` en
  `macvlan`, zodat een `docker compose down` het netwerk van je LAN niet
  verwijdert.

## Problemen oplossen {#troubleshooting}

Deze controles gelden voor elk stuurprogramma:

| Probleem                                                      | Controle                                                                                                |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| `Pool overlaps with other one on this address space`          | Een ander netwerk gebruikt het subnet. Voer `docker network ls` en `docker network inspect <name>` uit. |
| `network <name> declared as external, but could not be found` | Maak het netwerk eerst met `docker network create`.                                                     |
| De container krijgt een onverwacht IP-adres                   | Controleer `ip_range` en `ipv4_address`; het adres moet binnen het subnet liggen.                       |
| Containers bereiken elkaar niet op naam                       | Gebruik een eigen netwerk; het standaardnetwerk `bridge` heeft geen naamresolutie.                      |

Handige commando's:

```bash
docker network ls                       # List all networks
docker network inspect <name>           # Show the subnet, the gateway, and the containers
docker inspect <container> --format '{{json .NetworkSettings.Networks}}'
```
