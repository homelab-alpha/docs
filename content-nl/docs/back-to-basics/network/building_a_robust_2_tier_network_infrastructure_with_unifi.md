---
title: "Een degelijke netwerkinfrastructuur in 2 lagen bouwen met UniFi"
description:
  "Ontdek hoe je een schaalbaar en efficiënt netwerk in 2 lagen ontwerpt met
  apparatuur van UniFi van Ubiquiti. Deze gids behandelt de basis van het
  samenvoegen van de core- en distributielaag, met een aparte toegangslaag, voor
  kleine tot middelgrote netwerken."
url:
  "back-to-basics/network/building-a-robust-2-tier-network-infrastructure
  with-unifi"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Network
tags:
  - UniFi
  - Network Design
  - 2-Tier Architecture
  - Network Infrastructure
  - Homelab Setup
keywords:
  - 2-tier network design
  - UniFi network infrastructure
  - Core-Distribution layer
  - Access layer design
  - Ubiquiti UniFi equipment

weight: 2701

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

Een netwerkarchitectuur in 2 lagen maakt het netwerkontwerp eenvoudiger: de
core- en distributielaag worden samengevoegd tot één laag, terwijl de
toegangslaag apart blijft. Deze aanpak past bij kleine tot middelgrote netwerken
en biedt een goede balans tussen prestaties, schaalbaarheid en beheerbaarheid.
Deze gids helpt je een netwerk in 2 lagen te ontwerpen met apparatuur van UniFi
van Ubiquiti.

## Core-distributielaag {#core-distribution-layer}

### Doel {#purpose}

De core-distributielaag combineert de functies van de traditionele core- en
distributielaag en zorgt voor snelle en betrouwbare verbindingen, het toepassen
van beleid en routering tussen de verschillende delen van het netwerk.

### Belangrijkste kenmerken {#key-features}

- **Hoge snelheid**: gebruikt snelle switches.
- **Hoge beschikbaarheid**: met redundantie en fouttolerantie.
- **Beleid toepassen**: past toegangslijsten (ACL's) en quality of service (QoS)
  toe.
- **Schaalbaarheid**: kan meer verkeer en toekomstige groei aan.

### Ontwerpkeuzes {#design-considerations}

- **Redundantie**: gebruik redundante hardware en verbindingen om single points
  of failure te voorkomen.
- **Hoge bandbreedte**: gebruik verbindingen met een hoge capaciteit, zoals 10
  Gbps of meer.
- **Routering en switching**: gebruik degelijke protocollen voor routering en
  switching.
- **Beveiliging**: pas beveiligingsbeleid en VLAN-segmentatie toe.

### Voorbeeldconfiguratie {#example-configuration}

```yaml
core_distribution_layer:
  devices:
    - type: core_distribution_switch
      model: UniFi Switch Aggregation (USW-Aggregation)
      interfaces:
        - type: fiber_optic
          speed: 10Gbps
          redundancy: yes
    - type: core_distribution_router
      model: UniFi Dream Machine Pro Max (UDM-Pro-Max)
      protocols:
        - OSPF
        - BGP
      features:
        - ACLs
        - QoS
        - VLAN segmentation
```

#### Specificaties {#specifications}

**UniFi Switch Aggregation (USW-Aggregation)**

- **Interfaces**: 8x 10G SFP+-poorten
- **Prestaties**: 160 Gbps switchcapaciteit, 80 Gbps non-blocking doorvoer
- [Meer details](https://techspecs.ui.com/unifi/switching/usw-aggregation)

**UniFi Dream Machine Pro Max (UDM-Pro-Max)**

- **Interfaces**: 8x 1G RJ45-poorten, 1x 2.5G RJ45-poort, 2x 10G SFP+-poorten
  (standaard worden de 2.5G RJ45-poort en één 10G SFP+-poort als WAN gebruikt)
- **Functies**: ingebouwde beveiligingsgateway (tot 5 Gbps IDS/IPS-doorvoer),
  krachtige router, netwerkvideorecorder (2x 3.5"-schijfsleuven) en host voor de
  toepassing UniFi Network
- [Meer details](https://techspecs.ui.com/unifi/cloud-gateways/udm-pro-max)

## Toegangslaag {#access-layer}

### Doel {#purpose}

De toegangslaag is de rand van het netwerk, waar eindapparaten als computers,
printers en IoT-apparaten verbinding maken. Ze biedt het eerste niveau van
beveiliging en controle.

### Belangrijkste kenmerken {#key-features}

- **Apparaten verbinden**: verbindt de apparaten van eindgebruikers met het
  netwerk.
- **Poortbeveiliging**: regelt welke apparaten toegang krijgen en beveiligt het
  netwerk.
- **Power over Ethernet (PoE)**: voedt apparaten als IP-telefoons en draadloze
  toegangspunten.
- **Schaalbaarheid**: ondersteunt een groot aantal verbonden apparaten.

### Ontwerpkeuzes {#design-considerations}

- **Poortdichtheid**: zorg voor genoeg poorten voor alle eindapparaten.
- **Beveiliging**: pas poortbeveiliging en authenticatieprotocollen toe (bijv.
  802.1X).
- **PoE**: gebruik PoE voor apparaten die stroom via Ethernet nodig hebben.
- **Beheerbaarheid**: gebruik managed switches voor meer controle en monitoring.

### Voorbeeldconfiguratie {#example-configuration}

```yaml
access_layer:
  devices:
    - type: access_switch
      model: UniFi Switch Pro 24 PoE (USW-Pro-24-POE, 400W)
      interfaces:
        - type: copper
          speed: 1Gbps
          PoE: yes
          port_security: 802.1X
      features:
        - port_security
        - VLAN support
        - PoE
    - type: wireless_access_point
      model: UniFi U7 Pro (U7-Pro)
      connectivity:
        - type: Wi-Fi
          speed: 5.8Gbps
          PoE: yes
```

#### Specificaties {#specifications}

**UniFi Switch Pro 24 PoE (USW-Pro-24-POE, 400W)**

- **Interfaces**: 24x RJ45 Gigabit Ethernet-poorten, 2x 10G SFP+-uplinkpoorten
- **PoE**: 16x PoE+-poorten (tot 30W) en 8x PoE++-poorten (tot 60W), in totaal
  400W PoE-budget
- **Prestaties**: 88 Gbps switchcapaciteit, 44 Gbps non-blocking doorvoer
- [Meer details](https://techspecs.ui.com/unifi/switching/usw-pro-24-poe)

**UniFi U7 Pro (U7-Pro)**

- **Interfaces**: 1x 2.5GbE RJ45-poort
- **Wifi-standaarden**: 802.11a/b/g/n/ac/ax/be (Wi-Fi 5, Wi-Fi 6/6E, Wi-Fi 7)
- **Voeding**: PoE+
- **Doorvoer**: tot 5.8 Gbps op 6 GHz, tot 4.3 Gbps op 5 GHz, tot 688 Mbps op
  2.4 GHz
- [Meer details](https://techspecs.ui.com/unifi/wifi/u7-pro)

## Aanbevolen werkwijzen voor een netwerkontwerp in 2 lagen {#best-practices-for-2-tier-network-design}

1. **Redundantie en hoge beschikbaarheid**: zorg dat elke laag redundant is,
   zodat er geen single point of failure is. Gebruik technieken als link
   aggregation, redundante voedingen en apparaten met twee aansluitingen.

2. **Schaalbaarheid**: ontwerp je netwerk met het oog op toekomstige groei. Zorg
   dat elke laag kan worden uitgebreid zonder groot herontwerp.

3. **Beveiliging**: pas op elke laag degelijke beveiligingsmaatregelen toe.
   Gebruik firewalls, systemen voor het detecteren en voorkomen van inbraken
   (IDS/IPS) en netwerktoegangscontrole (NAC) om je netwerk te beschermen.

4. **Prestaties**: gebruik krachtige switches en routers om de vertraging klein
   te houden en gegevens snel te verwerken. Optimaliseer de
   routeringsprotocollen en gebruik QoS om belangrijk verkeer voorrang te geven.

5. **Beheer en monitoring**: gebruik uitgebreide hulpmiddelen voor netwerkbeheer
   en monitoring om de gezondheid en prestaties van het netwerk te bewaken.
   Gebruik de UniFi Controller voor centraal beheer en logging, zodat je
   problemen vroeg oplost.

6. **Documentatie**: houd uitgebreide documentatie bij van je netwerkontwerp,
   met de configuratie van apparaten, IP-adresschema's en netwerkdiagrammen. Dat
   is onmisbaar bij het oplossen van problemen en bij toekomstige upgrades.

## Conclusie {#conclusion}

Een netwerkinfrastructuur in 2 lagen met apparatuur van UniFi ontwerpen vraagt
om een zorgvuldige planning en aandacht voor de eigen eisen van elke laag. Met
de richtlijnen en aanbevolen werkwijzen in deze gids bouw je een degelijk,
schaalbaar en veilig netwerk, dat je organisatie soepel en efficiënt laat
werken.
