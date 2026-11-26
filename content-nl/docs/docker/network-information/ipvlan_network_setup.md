---
title: "Een IPvlan-netwerk opzetten"
description:
  "Deze gids legt uit hoe je een Docker-netwerk van het type `ipvlan` opzet in
  de L2- en L3-modus, met VLAN's en IPv6, en hoe de host de containers bereikt
  via een shim-interface."
url: "docker/network-info/ipvlan-network-setup"
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
  - IPvlan
  - Container Networking
  - IPAM
  - VLAN
keywords:
  - Docker ipvlan network
  - ipvlan L2
  - ipvlan L3
  - Docker VLAN
  - host shim interface

weight: 4203

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Een `ipvlan`-netwerk geeft elke container een eigen IP-adres op je netwerk,
terwijl alle containers het MAC-adres van de interface van de host (de _parent_)
delen. Gebruik het als een container op een eigen adres bereikbaar moet zijn,
maar je switch, toegangspunt of hypervisor het aantal MAC-adressen per poort
beperkt. Het stuurprogramma heeft Linux-kernel 4.2 of nieuwer nodig.

Zie
[Een netwerkstuurprogramma kiezen](/docker/network-info/choosing-a-network-driver/)
voor een vergelijking met `bridge` en `macvlan`.

IPvlan heeft twee modi:

- **L2** (de standaard): de containers doen mee in het LAN van de
  parent-interface. Ze gebruiken de router van je LAN als gateway.
- **L3**: de containers krijgen een eigen subnet, dat de Docker-host routeert.
  Broadcast en multicast worden weggegooid, dus je router heeft een route naar
  dat subnet nodig.

De voorbeelden gebruiken dit LAN:

| Instelling               | Waarde                                         |
| :----------------------- | :--------------------------------------------- |
| LAN-subnet               | `192.168.1.0/24`                               |
| Router (gateway)         | `192.168.1.1`                                  |
| Bovenliggende interface  | `eth0` (controleer de jouwe met `ip -br link`) |
| Adressen voor containers | `192.168.1.192/27` (`.192` tot `.223`)         |
| Adres voor de host-shim  | `192.168.1.223`                                |

{{% alert context="warning" %}}
Houd het bereik van de containers buiten de DHCP-pool van je router, zodat geen
ander apparaat een van deze adressen krijgt.
{{% /alert %}}

## L2-modus {#l2-mode}

### Het netwerk maken met de CLI {#create-the-network-with-the-cli}

Maak het netwerk één keer, buiten de stacks, zodat `docker compose down` het
niet verwijdert:

```bash
docker network create \
  --driver ipvlan \
  --subnet 192.168.1.0/24 \
  --gateway 192.168.1.1 \
  --ip-range 192.168.1.192/27 \
  --aux-address host-shim=192.168.1.223 \
  --opt parent=eth0 \
  --opt ipvlan_mode=l2 \
  --label com.ipvlan.network.description="is an ipvlan network on the LAN." \
  ipvlan
```

- `--ip-range` beperkt de adressen die Docker uitdeelt.
- `--aux-address` reserveert een adres, hier voor de
  [host-shim](#reach-the-containers-from-the-host).

### Het netwerk gebruiken in een stack {#use-the-network-in-a-stack}

```yaml
networks:
  ipvlan:
    external: true
    name: ipvlan

services:
  example_app:
    image: docker.io/library/nginx:stable
    networks:
      ipvlan:
        ipv4_address: 192.168.1.200
```

De service is nu vanaf je LAN bereikbaar op `http://192.168.1.200`. `ports`
heeft geen effect op dit netwerk: elke poort waarop de container luistert, is
bereikbaar.

### Het netwerk definiëren in Compose {#define-the-network-in-compose}

Je kunt het netwerk ook in `compose.yml` definiëren. Docker Compose verwijdert
het dan bij `docker compose down`:

```yaml
networks:
  ipvlan:
    name: ipvlan
    driver: ipvlan
    driver_opts:
      parent: eth0
      ipvlan_mode: l2
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
          ip_range: 192.168.1.192/27
          aux_addresses:
            host-shim: 192.168.1.223
```

## L3-modus {#l3-mode}

In de L3-modus gebruiken de containers een subnet dat niet je LAN is,
bijvoorbeeld `10.10.10.0/24`. De Docker-host is daarvoor de router. `--gateway`
wordt in deze modus niet gebruikt.

```bash
docker network create \
  --driver ipvlan \
  --subnet 10.10.10.0/24 \
  --opt parent=eth0 \
  --opt ipvlan_mode=l3 \
  ipvlan-l3
```

Voeg een statische route toe op je router, zodat het LAN de containers kan
bereiken:

| Bestemming      | Volgende hop                     |
| :-------------- | :------------------------------- |
| `10.10.10.0/24` | Het LAN-adres van de Docker-host |

Zonder deze route kunnen alleen de containers op de host elkaar bereiken.

## VLAN's

Gebruik een parent zoals `eth0.20` om het netwerk op VLAN 20 te zetten. Docker
maakt de subinterface en verwijdert die weer met `docker network rm`. De
switchpoort van de host moet dat VLAN doorgeven (een trunkpoort).

```bash
docker network create \
  --driver ipvlan \
  --subnet 192.168.20.0/24 \
  --gateway 192.168.20.1 \
  --opt parent=eth0.20 \
  ipvlan20
```

## IPv6

Voeg een IPv6-subnet van je LAN toe naast het IPv4-subnet:

```bash
docker network create \
  --driver ipvlan --ipv6 \
  --subnet 192.168.1.0/24 --gateway 192.168.1.1 --ip-range 192.168.1.192/27 \
  --subnet 2001:db8:1::/64 --gateway 2001:db8:1::1 \
  --opt parent=eth0 \
  ipvlan
```

Vervang `2001:db8:1::/64` (een prefix voor documentatie) door het IPv6-prefix
van je LAN. Voeg in Compose `enable_ipv6: true` toe en een tweede item onder
`ipam.config`.

## De containers vanaf de host bereiken {#reach-the-containers-from-the-host}

Linux blokkeert verkeer tussen de parent-interface en de IPvlan-containers erop.
De host kan de containers niet bereiken en de containers de host niet, terwijl
andere apparaten op het LAN dat wel kunnen. Los dit op door op de host een
IPvlan-interface (een _shim_) toe te voegen, op dezelfde parent, met het
gereserveerde adres:

```bash
sudo ip link add ipvlan-shim link eth0 type ipvlan mode l2
sudo ip addr add 192.168.1.223/32 dev ipvlan-shim
sudo ip link set ipvlan-shim up
sudo ip route add 192.168.1.192/27 dev ipvlan-shim
```

Deze commando's blijven niet bewaard na een herstart. Zet ze in de
netwerkconfiguratie van de host (bijvoorbeeld systemd-networkd of
NetworkManager) om ze blijvend te maken.

## Problemen oplossen {#troubleshooting}

| Probleem                                     | Controle                                                                                        |
| :------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| De host kan de container niet bereiken       | Verwacht: voeg de [host-shim](#reach-the-containers-from-the-host) toe.                         |
| Het LAN kan de container niet bereiken       | Controleer `parent`, het subnet en de gateway; controleer in de L3-modus de route op de router. |
| Twee apparaten gebruiken hetzelfde IP-adres  | Haal het bereik van de containers uit de DHCP-pool van de router.                               |
| `docker network create` mislukt              | Controleer of de parent-interface bestaat (`ip -br link`) en of de kernel IPvlan ondersteunt.   |
| Je router toont veel IP-adressen bij één MAC | Verwacht bij IPvlan; gebruik `macvlan` als je een MAC-adres per container nodig hebt.           |

Zie ook het
[deel over problemen oplossen](/docker/network-info/choosing-a-network-driver/#troubleshooting)
van het overzicht.
