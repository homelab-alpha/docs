---
title: "Gids voor wifikanalen in Europa"
description:
  "Een uitgebreide gids om in Europa de beste wifikanalen te kiezen voor de
  verschillende frequentiebanden en bandbreedtes."
url: "back-to-basics/network/"
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
  - Wi-Fi
  - Networking
  - Channels

keywords:
  - Wi-Fi channels
  - 2.4 GHz
  - 5 GHz
  - DFS
  - Europe

draft: true
weight: 2708

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="warning" %}}
**Let op** - Deze documentatie is nog in bewerking {{% /alert %}}

## Inleiding {#introduction}

De juiste wifikanalen kiezen is essentieel voor een stabiel en efficiënt
draadloos netwerk. In Europa, waar regelgeving en omgevingsfactoren de
prestaties van het netwerk kunnen beïnvloeden, maakt de keuze van de kanalen een
groot verschil. Deze gids geeft een uitgebreid overzicht van de aanbevolen
wifikanalen voor de banden van 2.4 GHz, 5 GHz en 6 GHz, met verschillende
bandbreedtes (Wi-Fi 4 tot Wi-Fi 7). Of je nu een thuisnetwerk opzet of een
groter zakelijk netwerk beheert: deze gids helpt je bij de keuze van de kanalen,
voor zo min mogelijk storing en zo goed mogelijke prestaties.

## Regelgeving en regionale verschillen {#regulatory-compliance-and-regional-differences}

### Europese regelgeving {#european-regulations}

- **Beperkingen van kanalen:** wees op de hoogte van de regels voor wifikanalen
  in Europa, met eventuele beperkingen voor het gebruik.
- **Verschillen per land:** de regels en beschikbare kanalen kunnen per Europees
  land verschillen. Controleer altijd de lokale regels voor de details.
- **Vermogensgrenzen:** in de EU zijn de 5 GHz-kanalen 36-48 beperkt tot gebruik
  binnenshuis. De kanalen 149-165 (5725-5875 MHz) vallen onder de regels voor
  apparaten met een kort bereik, met een veel lager vermogen (25 mW EIRP), en
  zijn niet in elk land beschikbaar.
- **6 GHz:** de lage 6 GHz-band (5945-6425 MHz) is in de hele EU zonder
  vergunning beschikbaar. De hoge 6 GHz-band (6425-7125 MHz) is op EU-niveau nog
  niet vrijgegeven voor wifi. Raadpleeg je nationale toezichthouder.

## De band van 2.4 GHz {#24-ghz-band}

### Aanbevolen kanalen voor een bandbreedte van 20 MHz {#recommended-channels-for-20-mhz-bandwidth}

- **Kanaal 1**: 2412 MHz
- **Kanaal 6**: 2437 MHz
- **Kanaal 11**: 2462 MHz

{{% alert context="primary" %}}
**Tip:** gebruik deze kanalen voor zo min mogelijk storing en zo goed mogelijke
prestaties.
{{% /alert %}}

### Te vermijden kanalen voor een bandbreedte van 20 MHz {#channels-to-avoid-for-20-mhz-bandwidth}

- **Kanaal 12 en 13**: 2467 MHz en 2472 MHz
- **Kanaal 14**: 2484 MHz (niet toegestaan in Europa)

### Aanbevolen kanalen voor een bandbreedte van 40 MHz {#recommended-channels-for-40-mhz-bandwidth}

- **Kanaal 3**: 2422 MHz (combineert de kanalen 1 en 5)
- **Kanaal 9**: 2452 MHz (combineert de kanalen 7 en 11)

{{% alert context="primary" %}}
**Let op:** een bandbreedte van 40 MHz wordt in de band van 2.4 GHz meestal
afgeraden, door het beperkte spectrum en de grotere kans op storing.
{{% /alert %}}

## De band van 5 GHz {#5-ghz-band}

### Aanbevolen kanalen voor een bandbreedte van 20 MHz {#recommended-channels-for-20-mhz-bandwidth-1}

- **Kanaal 36**: 5180 MHz
- **Kanaal 40**: 5200 MHz
- **Kanaal 44**: 5220 MHz
- **Kanaal 48**: 5240 MHz
- **Kanaal 149**: 5745 MHz
- **Kanaal 153**: 5765 MHz
- **Kanaal 157**: 5785 MHz
- **Kanaal 161**: 5805 MHz

{{% alert context="primary" %}}
**Tip:** deze kanalen geven betrouwbare verbindingen zonder risico op storing
door radar. {{% /alert %}}

### DFS-kanalen voor een bandbreedte van 20 MHz {#dfs-channels-for-20-mhz-bandwidth}

- **Kanaal 52**: 5260 MHz
- **Kanaal 56**: 5280 MHz
- **Kanaal 60**: 5300 MHz
- **Kanaal 64**: 5320 MHz
- **Kanaal 100**: 5500 MHz
- **Kanaal 104**: 5520 MHz
- **Kanaal 108**: 5540 MHz
- **Kanaal 112**: 5560 MHz
- **Kanaal 116**: 5580 MHz
- **Kanaal 120**: 5600 MHz
- **Kanaal 124**: 5620 MHz
- **Kanaal 128**: 5640 MHz
- **Kanaal 132**: 5660 MHz
- **Kanaal 136**: 5680 MHz
- **Kanaal 140**: 5700 MHz
- **Kanaal 144**: 5720 MHz (optioneel)

{{% alert context="primary" %}}
**Let op:** DFS-kanalen vereisen Dynamic Frequency Selection (DFS) en kunnen
last hebben van storing door radar. {{% /alert %}}

### Aanbevolen kanalen voor een bandbreedte van 40 MHz {#recommended-channels-for-40-mhz-bandwidth-1}

- **Kanaal 38**: 5190 MHz (combineert de kanalen 36 en 40)
- **Kanaal 46**: 5230 MHz (combineert de kanalen 44 en 48)
- **Kanaal 151**: 5755 MHz (combineert de kanalen 149 en 153)
- **Kanaal 159**: 5795 MHz (combineert de kanalen 157 en 161)

{{% alert context="primary" %}}
**Tip:** gebruik voor stabiele verbindingen deze kanalen buiten het DFS-bereik.
{{% /alert %}}

### DFS-kanalen voor een bandbreedte van 40 MHz {#dfs-channels-for-40-mhz-bandwidth}

- **Kanaal 54**: 5270 MHz (combineert de kanalen 52 en 56)
- **Kanaal 62**: 5310 MHz (combineert de kanalen 60 en 64)
- **Kanaal 102**: 5510 MHz (combineert de kanalen 100 en 104)
- **Kanaal 110**: 5550 MHz (combineert de kanalen 108 en 112)
- **Kanaal 118**: 5590 MHz (combineert de kanalen 116 en 120)
- **Kanaal 126**: 5630 MHz (combineert de kanalen 124 en 128)
- **Kanaal 134**: 5670 MHz (combineert de kanalen 132 en 136)

### Aanbevolen kanalen voor een bandbreedte van 80 MHz {#recommended-channels-for-80-mhz-bandwidth}

- **Kanaal 42**: 5210 MHz (combineert de kanalen 36, 40, 44 en 48)
- **Kanaal 155**: 5775 MHz (combineert de kanalen 149, 153, 157 en 161)

{{% alert context="primary" %}}
**Tip:** kies deze kanalen voor een balans tussen snelheid en stabiliteit.
{{% /alert %}}

### DFS-kanalen voor een bandbreedte van 80 MHz {#dfs-channels-for-80-mhz-bandwidth}

- **Kanaal 58**: 5290 MHz (combineert de kanalen 52, 56, 60 en 64)
- **Kanaal 106**: 5530 MHz (combineert de kanalen 100, 104, 108 en 112)
- **Kanaal 122**: 5610 MHz (combineert de kanalen 116, 120, 124 en 128)
- **Kanaal 138**: 5690 MHz (combineert de kanalen 132, 136, 140 en 144)

### Aanbevolen kanaal voor een bandbreedte van 160 MHz {#recommended-channel-for-160-mhz-bandwidth}

- **Kanaal 114**: 5570 MHz (combineert de kanalen 100, 104, 108, 112, 116, 120,
  124 en 128)

{{% alert context="primary" %}}
**Tip:** gebruik dit kanaal als je de hoogste snelheid nodig hebt en DFS wordt
ondersteund.
{{% /alert %}}

### Kanaal voor een bandbreedte van 160 MHz (lage 5 GHz) {#channel-for-160-mhz-bandwidth-lower-5-ghz}

- **Kanaal 50**: 5250 MHz (combineert de kanalen 36, 40, 44, 48, 52, 56, 60
  en 64)

{{% alert context="primary" %}}
**Let op:** dit kanaal bevat DFS-kanalen (52-64) en vereist dus ondersteuning
voor DFS. Wi-Fi 7 kent ook een niet-aaneengesloten modus van 240 MHz (160 MHz +
80 MHz), die zelden wordt gebruikt. {{% /alert %}}

## De band van 6 GHz (Wi-Fi 6E en Wi-Fi 7) {#6-ghz-band-wi-fi-6e-and-wi-fi-7}

De lage 6 GHz-band (5945-6425 MHz) biedt 480 MHz spectrum zonder DFS. Alleen
apparaten met Wi-Fi 6E of Wi-Fi 7 kunnen die gebruiken, en WPA3 is verplicht. In
de EU is de 6 GHz-band beperkt tot gebruik binnenshuis met een laag vermogen
(Low Power Indoor, LPI).

### Kanalen per bandbreedte {#channels-per-bandwidth}

- **20 MHz**: kanalen 1, 5, 9, ..., 93 (24 kanalen, 5955-6415 MHz)
- **40 MHz**: kanalen 3, 11, 19, ..., 91 (12 kanalen)
- **80 MHz**: kanalen 7, 23, 39, 55, 71 en 87 (6 kanalen)
- **160 MHz**: kanalen 15, 47 en 79 (3 kanalen)
- **320 MHz** (Wi-Fi 7): kanaal 31 (6105 MHz, 5945-6265 MHz)

{{% alert context="primary" %}}
**Tip:** met kanalen van 80 MHz heb je zes kanalen die niet overlappen, waardoor
de 6 GHz-band goed geschikt is voor drukke omgevingen. Gebruik 160 MHz of 320
MHz alleen als je clients het ondersteunen en buurnetwerken niet overlappen.
{{% /alert %}}

## Kanaalbundeling {#channel-bonding}

### Kanaalbundeling begrijpen {#understanding-channel-bonding}

- **Definitie:** kanaalbundeling combineert meerdere kanalen om de bandbreedte
  te vergroten en de prestaties te verbeteren. Dit kan bij configuraties van 40
  MHz, 80 MHz en 160 MHz.
- **Invloed op de prestaties:** kanaalbundeling kan de doorvoer verhogen, maar
  ook de storing en de overlap met buurnetwerken vergroten.

## Storing en netwerkoptimalisatie {#interference-and-network-optimization}

### Storing beperken {#minimizing-interference}

- **Bronnen van storing:** herken veelvoorkomende bronnen van wifistoring, zoals
  andere draadloze apparaten, magnetrons en dikke bouwmaterialen.
- **Maatregelen:** gebruik hulpmiddelen om storing te analyseren en te beperken.
  Het aanpassen van de kanaalinstellingen en een betere plaatsing van de
  toegangspunten helpen.

### Netwerkplanning {#network-planning}

- **Dekking:** plan de indeling van je netwerk voor de beste dekking en
  prestaties. Gebruik zo nodig meerdere toegangspunten en plaats ze goed, om
  dode zones te voorkomen.
- **Optimalisatie:** volg de prestaties van het netwerk regelmatig en pas zo
  nodig aan, voor een stabiel en efficiënt netwerk.

## Beveiliging van wifi {#wlan-security}

### Je netwerk beveiligen {#securing-your-network}

- **Versleuteling:** gebruik de nieuwste beveiligingsprotocollen, zoals WPA3, om
  je wifinetwerk te beschermen tegen toegang zonder toestemming en tegen
  kwetsbaarheden. Op de 6 GHz-band is WPA3 (of Enhanced Open) verplicht.
- **Goede gewoonten:** werk de firmware van je router regelmatig bij en gebruik
  sterke, unieke wachtwoorden voor de beveiliging van je netwerk.

## Problemen oplossen {#troubleshooting}

### Veelvoorkomende problemen {#common-issues}

- **Problemen door storing:** zoek en verhelp problemen door storing van andere
  apparaten of netwerken.
- **Problemen met de prestaties:** onderzoek trage snelheden of
  verbindingsproblemen door de kanaalinstellingen en de netwerkconfiguratie te
  bekijken.

## Ondersteuning door hardware en software {#hardware-and-software-support}

### Compatibiliteit {#compatibility}

- **Hardware:** zorg dat je router of toegangspunt de kanalen en bandbreedtes
  ondersteunt die je wilt gebruiken.
- **Software:** controleer op firmware-updates en compatibiliteit van de
  software, voor de beste prestaties en ondersteuning van functies.

## Updates en de toekomst {#updates-and-future-considerations}

### Op de hoogte blijven {#staying-informed}

- **Veranderingen in de regels:** blijf op de hoogte van veranderingen in de
  regels en standaarden voor wifi die het gebruik van kanalen en de prestaties
  van het netwerk kunnen beïnvloeden.

- **Technologische vooruitgang:** blijf op de hoogte van nieuwe technieken en
  verbeteringen die je wifinetwerk beter kunnen maken.

## Samenvatting {#summary}

- **2.4 GHz:** gebruik de kanalen 1, 6 en 11 voor een bandbreedte van 20 MHz.
  Gebruik 40 MHz alleen als het echt nodig is.
- **5 GHz:** geef voorrang aan kanalen zonder DFS voor betrouwbare prestaties,
  en gebruik DFS-kanalen alleen als er geen andere mogelijkheden zijn.
- **DFS-kanalen:** DFS-kanalen bieden extra spectrum, maar kunnen minder stabiel
  zijn door storing van radar. Gebruik ze alleen als je apparatuur DFS
  ondersteunt.
- **6 GHz:** gebruik deze band voor clients met Wi-Fi 6E en Wi-Fi 7. Er is geen
  DFS, er zijn genoeg kanalen van 80 MHz en WPA3 is verplicht.

Deze gids helpt je de beste wifikanalen te kiezen voor een stabiel en efficiënt
netwerk in je Europese omgeving.
