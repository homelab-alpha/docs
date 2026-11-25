---
title: "Een macvlan-netwerk opzetten"
description:
  "Deze gids legt uit hoe je een Docker-netwerk van het type `macvlan` opzet,
  met VLAN's en IPv6, en hoe de host de containers bereikt via een
  shim-interface."
url: "docker/network-info/macvlan-network-setup"
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
  - Macvlan
  - Container Networking
  - IPAM
  - VLAN
keywords:
  - Docker macvlan network
  - macvlan setup
  - Docker VLAN
  - host shim interface
  - container MAC address

weight: 4204

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Een `macvlan`-netwerk maakt van elke container een apart apparaat op je netwerk,
met een eigen MAC-adres en IP-adres. Gebruik het als een container eruit moet
zien als een echte host op het LAN, bijvoorbeeld een DHCP-server, of een app die
apparaten met broadcasts vindt.

Zie
[Een netwerkstuurprogramma kiezen](/docker/network-info/choosing-a-network-driver/)
voor een vergelijking met `bridge` en `ipvlan`.

{{% alert context="warning" %}}
De netwerkinterface van de host en je switch moeten meerdere MAC-adressen op één
poort accepteren (promiscuous mode). Veel wifi-interfaces en sommige hypervisors
(bijvoorbeeld met MAC-filtering op de virtuele switch) doen dat niet. Gebruik in
dat geval `ipvlan`.
{{% /alert %}}

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

## Het netwerk maken met de CLI {#create-the-network-with-the-cli}

Maak het netwerk één keer, buiten de stacks, zodat `docker compose down` het
niet verwijdert:

```bash
docker network create \
  --driver macvlan \
  --subnet 192.168.1.0/24 \
  --gateway 192.168.1.1 \
  --ip-range 192.168.1.192/27 \
  --aux-address host-shim=192.168.1.223 \
  --opt parent=eth0 \
  --opt macvlan_mode=bridge \
  --label com.macvlan.network.description="is a macvlan network on the LAN." \
  macvlan
```

- `--ip-range` beperkt de adressen die Docker uitdeelt.
- `--aux-address` reserveert een adres, hier voor de
  [host-shim](#reach-the-containers-from-the-host).
- `macvlan_mode=bridge` (de standaard) laat containers op dezelfde parent direct
  met elkaar praten.

## Het netwerk gebruiken in een stack {#use-the-network-in-a-stack}

```yaml
networks:
  macvlan:
    external: true
    name: macvlan

services:
  example_app:
    image: docker.io/library/nginx:stable
    networks:
      macvlan:
        ipv4_address: 192.168.1.201
    mac_address: 02:42:c0:a8:01:c9
```

De service is nu vanaf je LAN bereikbaar op `http://192.168.1.201`. `ports`
heeft geen effect op dit netwerk: elke poort waarop de container luistert, is
bereikbaar.

`mac_address` is optioneel. Met een vast MAC-adres blijft hetzelfde item in je
router behouden (bijvoorbeeld een DHCP-reservering of een firewallregel) als de
container opnieuw wordt gemaakt. Gebruik een lokaal beheerd adres, dat begint
met `02`.

## Het netwerk definiëren in Compose {#define-the-network-in-compose}

Je kunt het netwerk ook in `compose.yml` definiëren. Docker Compose verwijdert
het dan bij `docker compose down`:

```yaml
networks:
  macvlan:
    name: macvlan
    driver: macvlan
    driver_opts:
      parent: eth0
      macvlan_mode: bridge
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
          ip_range: 192.168.1.192/27
          aux_addresses:
            host-shim: 192.168.1.223
```

## VLAN's

Gebruik een parent zoals `eth0.20` om het netwerk op VLAN 20 te zetten
(802.1Q-trunkmodus). Docker maakt de subinterface en verwijdert die weer met
`docker network rm`. De switchpoort van de host moet dat VLAN doorgeven.

```bash
docker network create \
  --driver macvlan \
  --subnet 192.168.20.0/24 \
  --gateway 192.168.20.1 \
  --opt parent=eth0.20 \
  macvlan20
```

## IPv6

Voeg een IPv6-subnet van je LAN toe naast het IPv4-subnet:

```bash
docker network create \
  --driver macvlan --ipv6 \
  --subnet 192.168.1.0/24 --gateway 192.168.1.1 --ip-range 192.168.1.192/27 \
  --subnet 2001:db8:1::/64 --gateway 2001:db8:1::1 \
  --opt parent=eth0 \
  macvlan
```

Vervang `2001:db8:1::/64` (een prefix voor documentatie) door het IPv6-prefix
van je LAN. Voeg in Compose `enable_ipv6: true` toe en een tweede item onder
`ipam.config`.

## De containers vanaf de host bereiken {#reach-the-containers-from-the-host}

Linux blokkeert verkeer tussen de parent-interface en de macvlan-containers
erop. De host kan de containers niet bereiken en de containers de host niet,
terwijl andere apparaten op het LAN dat wel kunnen. Los dit op door op de host
een macvlan-interface (een _shim_) toe te voegen, op dezelfde parent, met het
gereserveerde adres:

```bash
sudo ip link add macvlan-shim link eth0 type macvlan mode bridge
sudo ip addr add 192.168.1.223/32 dev macvlan-shim
sudo ip link set macvlan-shim up
sudo ip route add 192.168.1.192/27 dev macvlan-shim
```

Deze commando's blijven niet bewaard na een herstart. Zet ze in de
netwerkconfiguratie van de host (bijvoorbeeld systemd-networkd of
NetworkManager) om ze blijvend te maken.

Een andere mogelijkheid is de container ook aan een `bridge`-netwerk te
koppelen, zodat de host hem via dat netwerk bereikt.

## Problemen oplossen {#troubleshooting}

| Probleem                                    | Controle                                                                                              |
| :------------------------------------------ | :---------------------------------------------------------------------------------------------------- |
| De host kan de container niet bereiken      | Verwacht: voeg de [host-shim](#reach-the-containers-from-the-host) toe.                               |
| Het LAN kan de container niet bereiken      | Controleer `parent`, het subnet en de gateway, en of de switch meerdere MAC-adressen accepteert.      |
| Het werkt via een kabel, niet via wifi      | De meeste wifi-interfaces accepteren geen extra MAC-adressen; gebruik `ipvlan`.                       |
| Het werkt niet in een virtuele machine      | Sta promiscuous mode of het wijzigen van MAC-adressen toe op de virtuele switch, of gebruik `ipvlan`. |
| Twee apparaten gebruiken hetzelfde IP-adres | Haal het bereik van de containers uit de DHCP-pool van de router.                                     |

Zie ook het
[deel over problemen oplossen](/docker/network-info/choosing-a-network-driver/#troubleshooting)
van het overzicht.
