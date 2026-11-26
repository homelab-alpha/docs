---
title: "VLAN's begrijpen: virtuele lokale netwerken"
description:
  "Verken de basis van VLAN's (Virtual Local Area Networks), hun voordelen voor
  netwerksegmentatie, beveiliging en prestaties, en leer hoe ze werken en worden
  gebruikt in modern netwerkbeheer."
url: "back-to-basics/network/understanding-vlans"
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
  - Network Security
  - Networking Basics
  - Network Management
keywords:
  - VLAN
  - Virtual Local Area Network
  - Network Segmentation
  - Network Security
  - VLAN Tagging
  - Network Performance
  - Networking Guide

weight: 2706

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Wat is een VLAN? {#what-is-a-vlan}

Een VLAN (Virtual Local Area Network) is een logische groep apparaten binnen een
netwerk. Apparaten kunnen zo worden gegroepeerd, ook als ze niet op hetzelfde
fysieke netwerk zitten. In feite deelt een VLAN een fysiek netwerk op in
meerdere kleinere, logische netwerken. Dat verbetert het netwerkbeheer, de
beveiliging en de prestaties.

### Hoe VLAN's werken {#how-vlans-work}

VLAN's werken door netwerkpakketten te taggen met een VLAN-ID (VID).
Netwerkapparaten, zoals switches, gebruiken deze tags om te bepalen bij welk
VLAN elk pakket hoort. Een uitgebreidere uitleg:

1. **VLAN-tagging:** stuurt een apparaat gegevens, dan krijgt het pakket een
   VLAN-tag. Die tag bevat de VLAN-ID, die aangeeft bij welk VLAN het pakket
   hoort.
2. **Verwerking door de switch:** switches lezen de VLAN-tag en sturen het
   pakket naar het juiste VLAN. Zo komen gegevens alleen bij apparaten in
   hetzelfde VLAN.
3. **Verkeer zonder tag:** bereikt een pakket zijn bestemming, dan wordt de
   VLAN-tag verwijderd en komen de gegevens bij het apparaat aan alsof het op
   een gewoon netwerk zit.

### Soorten VLAN's {#vlan-types}

1. **Standaard-VLAN:** het VLAN waaraan alle switchpoorten in het begin zijn
   toegewezen, meestal VLAN 1. Het wordt gebruikt voor algemeen netwerkverkeer.
2. **Data-VLAN:** speciaal ingesteld voor verkeer van gebruikers. Zo blijft het
   dataverkeer overzichtelijk en gescheiden.
3. **Voice-VLAN:** speciaal voor VoIP-verkeer (Voice over IP). Deze scheiding
   zorgt voor gesprekken van hoge kwaliteit, doordat spraakpakketten voorrang
   krijgen op gewone datapakketten.
4. **Beheer-VLAN:** alleen gebruikt om netwerkapparaten te beheren. Door het
   beheerverkeer apart te houden, verbetert de beveiliging en blijven
   beheercommando's en -gegevens gescheiden van het verkeer van gebruikers.
5. **Native VLAN:** verwerkt verkeer zonder tag, meestal ingesteld op VLAN 1.
   Het is belangrijk voor de samenwerking met oudere apparaten die geen
   VLAN-tagging ondersteunen.

## Waarom VLAN's gebruiken? {#why-use-vlans}

### 1. Segmentatie {#1-segmentation}

VLAN's scheiden netwerkverkeer, wat grote netwerken makkelijker te beheren
maakt, doordat je apparaten logisch groepeert naar functie, afdeling of team. In
een bedrijf kun je bijvoorbeeld aparte VLAN's hebben voor afdelingen als HR,
Financiën en Engineering. Deze logische segmentatie maakt het netwerkbeheer
eenvoudiger en de organisatie overzichtelijker.

### 2. Beveiliging {#2-security}

Door gevoelige gegevens en apparaten af te schermen, verbeteren VLAN's de
beveiliging en voorkomen ze toegang zonder toestemming. Apparaten van de
financiële afdeling kunnen bijvoorbeeld in een VLAN staan waar alleen het
financiële team bij kan, zodat onbevoegden niet bij gevoelige financiële
gegevens komen.

### 3. Prestaties {#3-performance}

VLAN's beperken broadcastverkeer, wat de netwerkprestaties kan verbeteren. In
een groot netwerk kan broadcastverkeer (dat naar alle apparaten gaat)
overweldigend worden. VLAN's houden broadcastverkeer binnen elk VLAN, zodat de
bandbreedte efficiënter wordt gebruikt.

### 4. Flexibiliteit {#4-flexibility}

Met VLAN's groepeer je apparaten logisch, los van hun fysieke plek. Apparaten
kunnen zo worden verplaatst of toegevoegd zonder de bekabeling aan te passen.
Verhuist een medewerker naar een ander kantoor, dan blijft zijn apparaat in
hetzelfde VLAN, met dezelfde netwerkinstellingen en toegangsrechten.

## Toepassingen in de praktijk {#real-world-applications}

- **Onderwijsinstellingen:** VLAN's scheiden de netwerken van studenten en
  personeel, zodat gevoelige administratieve gegevens veilig blijven voor de
  studenten.
- **Zorg:** aparte VLAN's voor patiëntgegevens, gastwifi en medische apparaten
  verbeteren de beveiliging en de netwerkprestaties.
- **Bedrijven:** bedrijven gebruiken VLAN's om afdelingen te scheiden, voor
  veilige en efficiënte communicatie binnen en tussen afdelingen.

## Conclusie {#conclusion}

VLAN's zijn essentieel voor modern netwerkbeheer en zorgen voor segmentatie,
beveiliging en betere prestaties. Door apparaten logisch te groeperen, helpen
VLAN's netwerkbeheerders grote en complexe netwerken efficiënt te beheren. Wie
met netwerkbeheer of -ontwerp bezig is, moet begrijpen hoe VLAN's werken en wat
ze opleveren.
