---
title: "VLAN-tagging: een diepere duik"
description:
  "VLAN-tagging is een essentiële techniek om netwerkverkeer binnen een VLAN te
  herkennen en te scheiden. Deze uitgebreide gids legt uit hoe VLAN-tagging
  werkt, welke soorten tags er zijn en hoe ze in modern netwerkbeheer worden
  gebruikt."
url: "back-to-basics/network/vlan-tagging"
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
  - VLAN
  - Network Segmentation
  - IEEE 802.1Q
  - Network Management
  - Trunk Ports
  - Access Ports
keywords:
  - VLAN Tagging
  - Network Traffic Segregation
  - Ethernet Frames
  - VLAN ID
  - IEEE 802.1Q Tagging
  - Inter-Switch Link (ISL)
  - Trunk Port Configuration
  - Access Port Configuration
  - Network Security
  - Network Performance
  - VoIP Traffic Management
  - Network Scalability

weight: 2707

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Wat is VLAN-tagging? {#what-is-vlan-tagging}

VLAN-tagging is een proces om netwerkverkeer binnen een VLAN te herkennen en te
scheiden. Daarbij krijgen Ethernetframes een VLAN-tag die aangeeft bij welk VLAN
elk pakket hoort. Met deze tags sturen netwerkapparaten, zoals switches en
routers, het verkeer naar het juiste VLAN, zodat de netwerksegmenten logisch
gescheiden blijven.

## Hoe VLAN-tagging werkt {#how-vlan-tagging-works}

### Taggen bij de bron {#tagging-at-the-source}

Stuurt een apparaat (bijv. een computer, server of VoIP-telefoon) een
datapakket, dan krijgt het een VLAN-ID van de netwerkinterface of van de switch
waarop het is aangesloten. De tag bevat een veld van 12 bits voor de VLAN-ID,
dat tot 4096 verschillende VLAN's kan aanduiden (van 0 tot 4095).

### Het getagde frame versturen {#transmitting-the-tagged-frame}

Het getagde frame gaat daarna over het netwerk. Switches en routers lezen de
VLAN-tag en bepalen daarmee de route van het frame. Switches sturen het frame
alleen naar poorten die lid zijn van hetzelfde VLAN, zodat het verkeer binnen
het eigen VLAN blijft.

### Verwerking door tussenliggende apparaten {#processing-by-intermediate-devices}

Terwijl het frame door het netwerk gaat, verwerken tussenliggende switches en
routers de VLAN-tag om het verkeer gescheiden te houden. Ze wijzigen de tag
niet, maar gebruiken die om het VLAN-beleid toe te passen. Moet een frame een
netwerkgrens oversteken (bijv. tussen twee VLAN's), dan regelt een router of een
laag 3-switch de routering.

### Tag verwijderen bij de bestemming {#untagging-at-the-destination}

Bereikt het frame zijn eindbestemming (een ander apparaat in hetzelfde VLAN of
een eindapparaat zoals een computer), dan wordt de VLAN-tag verwijderd voordat
het frame wordt afgeleverd. Zo verwerkt het ontvangende apparaat het frame als
een gewoon Ethernetframe, zonder iets te merken van de VLAN-tag die het onderweg
had.

## Soorten VLAN-tags {#types-of-vlan-tags}

### Tagging volgens IEEE 802.1Q {#ieee-8021q-tagging}

De meest gebruikte standaard voor VLAN-tagging is IEEE 802.1Q. Die voegt een tag
van 4 bytes in de header van het Ethernetframe in, tussen het MAC-adres van de
bron en de velden EtherType/Length.

De tag van 802.1Q bestaat uit:

- **Tag Protocol Identifier (TPID):** een veld van 2 bytes met de waarde 0x8100,
  dat aangeeft dat het frame een tag heeft.
- **Priority Code Point (PCP):** een veld van 3 bits voor voorrang bij Quality
  of Service (QoS).
- **Drop Eligible Indicator (DEI):** een veld van 1 bit dat aangeeft of het
  frame bij drukte mag worden weggegooid.
- **VLAN Identifier (VID):** een veld van 12 bits met de VLAN-ID.

### Tagging met ISL (Inter-Switch Link) {#isl-inter-switch-link-tagging}

ISL is een ouder protocol van Cisco dat het hele Ethernetframe verpakt met een
nieuwe header en trailer, met daarin de VLAN-ID. ISL is grotendeels verouderd en
vervangen door IEEE 802.1Q, omdat dat een standaard is en breder wordt
ondersteund.

## Trunkpoorten en toegangspoorten {#trunk-ports-and-access-ports}

### Trunkpoorten {#trunk-ports}

Trunkpoorten vervoeren verkeer van meerdere VLAN's tussen switches of tussen een
switch en een router. Ze gebruiken VLAN-tags om de VLAN's van elkaar te
onderscheiden en het verkeer goed te routeren. Trunkpoorten gebruiken meestal
tagging volgens IEEE 802.1Q.

### Toegangspoorten {#access-ports}

Toegangspoorten sluiten eindapparaten (bijv. computers en printers) aan op het
netwerk en vervoeren verkeer van één VLAN. Frames die bij een toegangspoort
binnenkomen, hebben geen tag, omdat het apparaat niets van VLAN's weet. De
switch wijst al het binnenkomende verkeer toe aan het VLAN van die toegangspoort
en tagt het uitgaande verkeer daarnaar.

## VLAN-tagging in de praktijk {#vlan-tagging-in-practice}

### Situatie 1: een netwerk met meerdere afdelingen {#scenario-1-multi-department-network}

Stel je een bedrijfsnetwerk voor met afdelingen als Financiën, HR en IT. Elke
afdeling heeft een eigen VLAN:

- **VLAN Financiën (VLAN 10)**
- **VLAN HR (VLAN 20)**
- **VLAN IT (VLAN 30)**

Een switch in dit netwerk heeft trunkpoorten naar andere switches en
toegangspoorten naar de apparaten van de afdelingen. Door VLAN-tagging blijven
pakketten van Financiën binnen VLAN 10, die van HR binnen VLAN 20 en die van IT
binnen VLAN 30, wat de beveiliging en het verkeersbeheer ten goede komt.

### Situatie 2: VoIP- en dataverkeer {#scenario-2-voip-and-data-traffic}

In een bedrijf met VoIP-telefoons scheidt VLAN-tagging het spraak- en
dataverkeer:

- **Data-VLAN (VLAN 100)**
- **Voice-VLAN (VLAN 200)**

Deze scheiding zorgt voor gesprekken van hoge kwaliteit, doordat VoIP-verkeer
voorrang krijgt en minder last heeft van dataverkeer.

## Voordelen van VLAN-tagging {#benefits-of-vlan-tagging}

1. **Betere beveiliging:** door verkeer binnen VLAN's af te schermen, is
   gevoelige informatie beschermd tegen toegang zonder toestemming.
2. **Betere netwerkprestaties:** kleinere broadcastdomeinen beperken overbodig
   verkeer en zorgen voor een beter gebruik van de bandbreedte.
3. **Eenvoudiger netwerkbeheer:** door apparaten logisch te groeperen, beheer je
   netwerken en los je problemen makkelijker op.
4. **Flexibiliteit en schaalbaarheid:** pas de VLAN-configuratie eenvoudig aan
   als het netwerk groeit of verandert, zonder fysiek iets om te bouwen.

## Conclusie {#conclusion}

VLAN-tagging is een fundamenteel onderdeel van modern netwerkbeheer, waarmee je
verkeer efficiënt segmenteert, beveiligt en beheert. Wie begrijpt hoe
VLAN-tagging werkt en hoe het in de praktijk wordt gebruikt, ontwerpt degelijke
en flexibele netwerkinfrastructuren.
