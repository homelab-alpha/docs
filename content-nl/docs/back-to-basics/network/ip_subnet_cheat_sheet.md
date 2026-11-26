---
title: "Spiekbriefje voor IP-subnetten"
description:
  "Je ultieme gids om subnetten met IP onder de knie te krijgen, met klassen van
  IP-adressen, subnetmaskers, de CIDR-notatie en praktische berekeningen van
  subnetten."
url: "back-to-basics/network/ip-subnet-cheat-sheet"
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
  - IP subnet
  - subnetting
  - CIDR
  - subnet masks
keywords:
  - IP address classes
  - CIDR notation
  - subnetting calculations
  - network administration

weight: 2704

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Basisbegrippen {#basic-concepts}

### Klassen van IP-adressen {#ip-address-classes}

IP-adressen zijn ingedeeld in klassen, op basis van hun eerste bits. Een snel
overzicht:

- **Klasse A**: `1.0.0.0` tot `126.0.0.0`
  - Standaard subnetmasker: `255.0.0.0` (`/8`)
  - Aantal netwerken: 128 (2^7)
  - Hosts per netwerk: 16.777.214

- **Klasse B**: `128.0.0.0` tot `191.255.0.0`
  - Standaard subnetmasker: `255.255.0.0` (`/16`)
  - Aantal netwerken: 16.384 (2^14)
  - Hosts per netwerk: 65.534

- **Klasse C**: `192.0.0.0` tot `223.255.255.0`
  - Standaard subnetmasker: `255.255.255.0` (`/24`)
  - Aantal netwerken: 2.097.152 (2^21)
  - Hosts per netwerk: 254

### Bereiken van privé-IP-adressen {#private-ip-address-ranges}

Privé-IP-adressen worden binnen een netwerk gebruikt en zijn niet routeerbaar op
internet. Dit zijn de bereiken:

- **Klasse A**: `10.0.0.0` tot `10.255.255.255`
- **Klasse B**: `172.16.0.0` tot `172.31.255.255`
- **Klasse C**: `192.168.0.0` tot `192.168.255.255`

## Subnetmaskers en de CIDR-notatie {#subnet-masks-and-cidr-notation}

Subnetmaskers bepalen het netwerkdeel en het hostdeel van een IP-adres. De
notatie CIDR (Classless Inter-Domain Routing) geeft het subnetmasker in een
korte vorm.

| CIDR-notatie | Subnetmasker    | Bruikbare hosts | Stapgrootte subnet |
| ------------ | --------------- | --------------- | ------------------ |
| /8           | 255.0.0.0       | 16,777,214      | 16,777,216         |
| /9           | 255.128.0.0     | 8,388,606       | 8,388,608          |
| /10          | 255.192.0.0     | 4,194,302       | 4,194,304          |
| /11          | 255.224.0.0     | 2,097,150       | 2,097,152          |
| /12          | 255.240.0.0     | 1,048,574       | 1,048,576          |
| /13          | 255.248.0.0     | 524,286         | 524,288            |
| /14          | 255.252.0.0     | 262,142         | 262,144            |
| /15          | 255.254.0.0     | 131,070         | 131,072            |
| /16          | 255.255.0.0     | 65,534          | 65,536             |
| /17          | 255.255.128.0   | 32,766          | 32,768             |
| /18          | 255.255.192.0   | 16,382          | 16,384             |
| /19          | 255.255.224.0   | 8,190           | 8,192              |
| /20          | 255.255.240.0   | 4,094           | 4,096              |
| /21          | 255.255.248.0   | 2,046           | 2,048              |
| /22          | 255.255.252.0   | 1,022           | 1,024              |
| /23          | 255.255.254.0   | 510             | 512                |
| /24          | 255.255.255.0   | 254             | 256                |
| /25          | 255.255.255.128 | 126             | 128                |
| /26          | 255.255.255.192 | 62              | 64                 |
| /27          | 255.255.255.224 | 30              | 32                 |
| /28          | 255.255.255.240 | 14              | 16                 |
| /29          | 255.255.255.248 | 6               | 8                  |
| /30          | 255.255.255.252 | 2               | 4                  |

## Snel naslagwerk voor veelgebruikte subnetten {#quick-reference-for-common-subnets}

### Subnetten in klasse A {#class-a-subnetting}

| Subnetmasker  | CIDR | Bruikbare hosts | Opmerkingen   |
| ------------- | ---- | --------------- | ------------- |
| 255.0.0.0     | /8   | 16,777,214      | Standaard     |
| 255.240.0.0   | /12  | 1,048,574       |               |
| 255.255.0.0   | /16  | 65,534          | Veel gebruikt |
| 255.255.255.0 | /24  | 254             |               |

### Subnetten in klasse B {#class-b-subnetting}

| Subnetmasker    | CIDR | Bruikbare hosts | Opmerkingen   |
| --------------- | ---- | --------------- | ------------- |
| 255.255.0.0     | /16  | 65,534          | Standaard     |
| 255.255.240.0   | /20  | 4,094           |               |
| 255.255.255.0   | /24  | 254             | Veel gebruikt |
| 255.255.255.240 | /28  | 14              |               |

### Subnetten in klasse C {#class-c-subnetting}

| Subnetmasker    | CIDR | Bruikbare hosts | Opmerkingen         |
| --------------- | ---- | --------------- | ------------------- |
| 255.255.255.0   | /24  | 254             | Standaard           |
| 255.255.255.128 | /25  | 126             |                     |
| 255.255.255.192 | /26  | 62              |                     |
| 255.255.255.224 | /27  | 30              |                     |
| 255.255.255.240 | /28  | 14              |                     |
| 255.255.255.248 | /29  | 6               |                     |
| 255.255.255.252 | /30  | 2               | Point-to-pointlinks |

## Bijzondere bereiken van IP-adressen {#special-ip-address-ranges}

Bereiken van IP-adressen hebben elk een eigen doel, van lokale communicatie tot
testen en toekomstig gebruik. Hier volgt een uitgebreid overzicht van deze
bijzondere bereiken, overzichtelijk ingedeeld.

### Gereserveerde en privébereiken {#reserved-and-private-ranges}

| **IP-bereik**    | **Beschrijving** | **Opmerkingen**                                                           |
| ---------------- | ---------------- | ------------------------------------------------------------------------- |
| `0.0.0.0/8`      | "Dit" netwerk    | Gereserveerd, gebruikt voor routering en initialisatie.                   |
| `10.0.0.0/8`     | Privénetwerk     | Veel gebruikt voor interne communicatie in privénetwerken.                |
| `127.0.0.0/8`    | Loopback         | Gebruikt voor localhost (127.0.0.1), om netwerksoftware lokaal te testen. |
| `169.254.0.0/16` | Link-local       | Gebruikt voor Automatic Private IP Addressing (APIPA).                    |
| `172.16.0.0/12`  | Privénetwerk     | Gebruikt voor lokale communicatie binnen een privénetwerk.                |
| `192.168.0.0/16` | Privénetwerk     | Veel gebruikt in thuisnetwerken en kleine bedrijven.                      |

### Documentatie en testen {#documentation-and-testing}

| **IP-bereik**     | **Beschrijving** | **Opmerkingen**                                |
| ----------------- | ---------------- | ---------------------------------------------- |
| `192.0.2.0/24`    | TEST-NET-1       | Gereserveerd voor documentatie en voorbeelden. |
| `198.51.100.0/24` | TEST-NET-2       | Gereserveerd voor documentatie en voorbeelden. |
| `203.0.113.0/24`  | TEST-NET-3       | Gereserveerd voor documentatie en voorbeelden. |

### Bijzondere doelen {#specialized-purposes}

| **IP-bereik**     | **Beschrijving**                       | **Opmerkingen**                                                           |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| `192.88.99.0/24`  | Relay van IPv6 naar IPv4               | Gebruikt voor 6to4-relay, als hulp bij de overgang van IPv4 naar IPv6.    |
| `198.18.0.0/15`   | Benchmarken van netwerkkoppelapparaten | Gereserveerd voor het benchmarken van netwerkkoppelapparaten.             |
| `224.0.0.0/4`     | Multicast                              | Gereserveerd voor multicastverkeer.                                       |
| `240.0.0.0/4`     | Gereserveerd voor toekomstig gebruik   | Experimenteel, gereserveerd voor toekomstige protocollen of toepassingen. |
| `255.255.255.255` | Broadcast                              | Beperkte broadcast naar alle hosts in het lokale netwerk.                 |

## Uitleg in beeld en praktische voorbeelden {#visual-explanation-and-practical-examples}

### APIPA (Automatic Private IP Addressing)

- **Bereik**: `169.254.0.0/16`
- **Gebruik**: krijgt een apparaat geen IP-adres van DHCP, dan geeft het
  zichzelf een adres in dit bereik.
- **Voorbeeld**: een apparaat kan `169.254.45.1` gebruiken om lokaal te
  communiceren.

```plaintext
+---------------------+
| Device A            |
| IP: 169.254.45.1    |
+---------------------+
         |
         | (Link-local communication)
         |
+---------------------+
| Device B            |
| IP: 169.254.45.2    |
+---------------------+
```

### Loopback-adres {#loopback-address}

- **Bereik**: `127.0.0.0/8`
- **Gebruik**: netwerksoftware testen zonder extern netwerk. Veelgebruikt adres:
  `127.0.0.1`.
- **Voorbeeld**: webontwikkelaars die een webserver op hun eigen machine testen.

```plaintext
+---------------------------+
| Local Machine             |
|                           |
| Test Web Server:          |
| http://127.0.0.1          |
+---------------------------+
```

### Privénetwerkadressen {#private-network-addresses}

| **Bereik**       | **Gebruikelijk gebruik**                        |
| ---------------- | ----------------------------------------------- |
| `10.0.0.0/8`     | Grote privénetwerken (bijv. bedrijfsnetwerken). |
| `172.16.0.0/12`  | Middelgrote privénetwerken.                     |
| `192.168.0.0/16` | Kleine thuis- en bedrijfsnetwerken.             |

```plaintext
+----------------------------------------------+
| Home Router                                  |
|                                              |
| +-------------------+     +----------------+ |
| | Device A          |     | Device B       | |
| | IP: 192.168.1.2   |     | IP: 192.168.1.3| |
| +-------------------+     +----------------+ |
|                                              |
| Private Network: 192.168.1.0/24              |
+----------------------------------------------+
```

## Bijzondere IP-bereiken in de praktijk {#practical-usage-of-special-ip-ranges}

### Broadcastadres (255.255.255.255) {#broadcast-address-255255255255}

- **Gebruik**: een bericht sturen naar alle apparaten in het lokale
  netwerksegment.
- **Voorbeeld**: een DHCP-verzoek kan als broadcast naar `255.255.255.255` gaan.

### Multicastadres (224.0.0.0/4) {#multicast-address-2240004}

- **Gebruik**: gegevens tegelijk naar meerdere apparaten streamen.
- **Voorbeeld**: hulpmiddelen voor videovergaderen gebruiken vaak multicast om
  videostreams te verspreiden.

## Veelvoorkomende berekeningen {#common-calculations}

### Het bereik van een subnet bepalen {#determining-subnet-range}

1. **Bepaal het subnetmasker**.
2. **Bereken de blokgrootte**:
   `256 - the value in the subnet mask's relevant octet` (256 min de waarde in
   het betreffende octet van het subnetmasker).
3. **Maak een lijst van de subnetbereiken** met de blokgrootte.

#### Bijvoorbeeld {#for-example}

Voor `192.168.1.0/26`:

1. **Subnetmasker**: `255.255.255.192`
2. **Blokgrootte**: `256 - 192 = 64`
3. **Subnetten**:
   - `192.168.1.0` - `192.168.1.63`
   - `192.168.1.64` - `192.168.1.127`
   - `192.168.1.128` - `192.168.1.191`
   - `192.168.1.192` - `192.168.1.255`

### Bruikbare hosts berekenen {#calculating-usable-hosts}

- **Formule**: `2^n - 2`
  - `n` = het aantal hostbits.
- Voorbeeld voor `/26`:
  - Hostbits: `32 - 26 = 6`
  - Bruikbare hosts: `2^6 - 2 = 62`

### Binair naar decimaal omrekenen {#binary-to-decimal-conversion}

Binair naar decimaal omrekenen is belangrijk bij subnetten:

- Machten van 2: `2^0 = 1`, `2^1 = 2`, `2^2 = 4`, ..., `2^8 = 256`
- Voorbeeld: binair `11000000` is decimaal `192`.

### Oefeningen voor subnetten {#subnetting-practice-exercises}

1. **Bepaal het aantal subnetten en hosts per subnet** voor een opgegeven CIDR.
2. **Oefen met omrekenen van binair naar decimaal en terug**.
3. **Bereken subnetbereiken en broadcastadressen**.

## Snelle tips {#quick-tips}

- **Leer de veelgebruikte subnetmaskers en CIDR-notaties uit je hoofd**.
- **Gebruik vaste stappen** om subnetten eenvoudig te berekenen.
- **Houd rekening met groei**: maak subnetten groter dan je nu nodig hebt.
- **Documenteer je subnetschema**: leg je toewijzing van IP-adressen en je
  netwerkontwerp vast.
- **Oefenen, oefenen, oefenen**: wie regelmatig met verschillende situaties
  oefent, wordt beter in subnetten.

## Conclusie {#conclusion}

Dit spiekbriefje is een snel naslagwerk met de belangrijkste informatie over
subnetten, zodat je IP-netwerken efficiënt ontwerpt en beheert. Als je deze
bijzondere bereiken van IP-adressen kent, wijs je IP-adressen goed toe en
voorkom je conflicten.

Met kennis van deze bereiken kunnen netwerkbeheerders:

- **Efficiënte netwerken ontwerpen**: netwerksegmenten plannen en aanleggen die
  schaalbaar en overzichtelijk zijn.
- **IP-conflicten voorkomen**: gereserveerde en privé-IP-bereiken goed
  gebruiken, zodat adressen niet overlappen en er geen verbindingsproblemen
  ontstaan.
- **Problemen goed oplossen**: netwerkproblemen snel vinden en verhelpen,
  doordat ze de betekenis van verschillende IP-bereiken herkennen.
- **Vooruit plannen**: IP-adressen met het oog op de toekomst toewijzen,
  rekening houdend met groei en veranderingen van het netwerk.

Met dit spiekbriefje bij de hand ben je goed voorbereid op de complexiteit van
subnetten en het beheer van IP-adressen. Veel plezier met subnetten!
