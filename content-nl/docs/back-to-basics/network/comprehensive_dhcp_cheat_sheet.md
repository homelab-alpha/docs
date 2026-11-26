---
title:
  "Uitgebreid spiekbriefje voor DHCP: basis, configuratie en problemen oplossen"
description:
  "Een uitgebreide gids over DHCP, met de belangrijkste begrippen,
  configuratiestappen, soorten berichten, veelgebruikte opties, tips voor het
  oplossen van problemen en gevorderde onderwerpen als relay en failover."
url: "back-to-basics/network/comprehensive-dhcp-cheat-sheet"
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
  - Networking
  - DHCP
  - Network Configuration
  - IP Management
  - IT Essentials
  - Network Administration
keywords:
  - DHCP guide
  - IP address management
  - network configuration
  - DHCP server setup
  - troubleshooting DHCP
  - DHCP message types
  - DHCP options
  - DHCP relay
  - DHCP failover
  - Linux DHCP configuration

weight: 2702

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Overzicht {#overview}

Dit spiekbriefje is een uitgebreide gids over DHCP (Dynamic Host Configuration
Protocol), met de basis, configuratiestappen, soorten berichten, veelgebruikte
opties, tips voor het oplossen van problemen en gevorderde onderwerpen als relay
en failover.

## Wat is DHCP? {#what-is-dhcp}

DHCP is een protocol voor netwerkbeheer dat het instellen van apparaten op
IP-netwerken automatiseert. Het geeft apparaten IP-adressen en andere
netwerkinstellingen, zodat ze op een netwerk kunnen communiceren.

## Belangrijke begrippen {#key-terms}

- **DHCP-server**: een server die IP-adressen beheert en uitdeelt.
- **DHCP-client**: een apparaat dat een IP-adres krijgt van een DHCP-server.
- **IP-adres**: een unieke aanduiding van een apparaat op een netwerk.
- **Lease**: de tijd dat een DHCP-client een IP-adres mag gebruiken voordat het
  moet worden vernieuwd.
- **Scope**: het bereik van IP-adressen dat een DHCP-server aan clients kan
  geven.
- **Subnetmasker**: deelt een IP-adres op in een netwerkdeel en een hostdeel.
- **Standaardgateway**: het IP-adres van een router die verkeer naar andere
  netwerken doorstuurt.
- **DNS-server**: een server die domeinnamen vertaalt naar IP-adressen.

## Het DHCP-proces (DORA) {#dhcp-process-dora}

1. **Discovery**: de client stuurt een broadcastbericht DHCPDISCOVER om
   beschikbare DHCP-servers te vinden.
2. **Offer**: DHCP-servers antwoorden met een bericht DHCPOFFER en bieden een
   IP-adres aan.
3. **Request**: de client stuurt een bericht DHCPREQUEST naar de gekozen
   DHCP-server en vraagt het aangeboden IP-adres.
4. **Acknowledgment**: de DHCP-server stuurt een bericht DHCPACK en bevestigt de
   lease van het IP-adres.

## Soorten DHCP-berichten {#dhcp-message-types}

- **DHCPDISCOVER**: door clients gestuurd om beschikbare DHCP-servers te vinden.
- **DHCPOFFER**: door servers gestuurd als antwoord op DHCPDISCOVER, met een
  aangeboden IP-adres.
- **DHCPREQUEST**: door clients gestuurd om een aangeboden IP-adres te
  accepteren.
- **DHCPACK**: door servers gestuurd om de lease van het IP-adres te bevestigen.
- **DHCPNAK**: door servers gestuurd als het verzoek van de client niet kan
  worden ingewilligd.
- **DHCPDECLINE**: door clients gestuurd als het aangeboden IP-adres al in
  gebruik is.
- **DHCPRELEASE**: door clients gestuurd om een toegewezen IP-adres vrij te
  geven.
- **DHCPINFORM**: door clients gestuurd om lokale netwerkinstellingen op te
  vragen zonder een IP-adres toe te wijzen.

## Veelgebruikte DHCP-opties {#common-dhcp-options}

- **Optie 1**: subnetmasker
- **Optie 3**: standaardgateway
- **Optie 6**: DNS-server
- **Optie 12**: hostnaam
- **Optie 15**: domeinnaam
- **Optie 51**: leasetijd van het IP-adres
- **Optie 53**: soort DHCP-bericht
- **Optie 54**: identificatie van de DHCP-server
- **Optie 61**: identificatie van de client

## Voorbeeld van een DHCP-configuratie (ISC DHCP Server op Linux) {#dhcp-configuration-example-linux-isc-dhcp-server}

{{% alert context="warning" %}}
ISC DHCP (`isc-dhcp-server`) is in oktober 2022 aan het eind van zijn levensduur
gekomen en krijgt geen updates meer. Gebruik voor nieuwe installaties de
opvolger [Kea DHCP] of een lichte server zoals dnsmasq. Het voorbeeld hieronder
blijft nuttig om de configuratie van een DHCP-server te begrijpen en voor
bestaande installaties.
{{% /alert %}}

### De DHCP-server installeren {#install-dhcp-server}

```bash
sudo apt-get update
sudo apt-get install isc-dhcp-server
```

### Configuratiebestand: `/etc/dhcp/dhcpd.conf` {#configuration-file-etcdhcpdhcpdconf}

```bash
# Global Parameters
default-lease-time 600;
max-lease-time 7200;
authoritative;

# Network Configuration
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.100 192.168.1.200;
  option routers 192.168.1.1;
  option subnet-mask 255.255.255.0;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
  option domain-name "example.com";
}
```

### De DHCP-server opnieuw starten {#restart-dhcp-server}

```bash
sudo systemctl restart isc-dhcp-server
```

## Problemen met DHCP oplossen {#troubleshooting-dhcp}

- **De status van de DHCP-server controleren**:
  ```bash
  sudo systemctl status isc-dhcp-server
  ```
- **De DHCP-leases bekijken**:
  ```bash
  cat /var/lib/dhcp/dhcpd.leases
  ```
- **Zoeken naar DHCP-berichten**:
  ```bash
  sudo tail -f /var/log/syslog | grep dhcp
  ```
- **Het IP-adres vernieuwen (client)**:
  ```bash
  sudo dhclient -r
  sudo dhclient
  ```
  Op systemen met NetworkManager of systemd-networkd vernieuw je de lease met
  `nmcli device reapply <interface>` of `networkctl renew <interface>`.

## Aanbevolen werkwijzen {#best-practices}

1. **Plan het IP-adresschema**: ontwerp de reeksen IP-adressen zorgvuldig om
   conflicten te voorkomen.
2. **Beveilig de DHCP-server**: beperk de toegang en let op apparaten zonder
   toestemming.
3. **Maak regelmatig back-ups**: bewaar back-ups van de DHCP-configuratie en de
   leasebestanden.
4. **Monitoring**: volg de gezondheid en prestaties van de DHCP-server met
   hulpmiddelen voor monitoring.
5. **Beheer van de leasetijd**: stem de leasetijden af op wat het netwerk nodig
   heeft, zodat er genoeg adressen beschikbaar blijven.

## Beveiliging {#security-practices}

Een veilige DHCP-infrastructuur is essentieel voor een veilig en efficiënt
netwerk. Een paar maatregelen om te overwegen:

1. **Scherm de DHCP-server af**: zet de DHCP-server in een eigen netwerksegment
   om de toegang te beperken.
2. **Gebruik DHCP snooping**: zet DHCP snooping aan op je switches, zodat
   malafide DHCP-servers geen IP-adressen kunnen uitdelen.
3. **Authenticatie**: gebruik netwerktoegangscontrole met 802.1X, zodat alleen
   geauthenticeerde apparaten IP-adressen krijgen.
4. **Bewaak het DHCP-verkeer**: houd het DHCP-verkeer in de gaten met
   hulpmiddelen voor netwerkmonitoring en zoek naar ongebruikelijke activiteit.
5. **Toegangslijsten (ACL's)**: beperk met ACL's welke apparaten DHCP-verkeer
   mogen sturen of ontvangen.
6. **Regelmatige updates**: houd de software van de DHCP-server bijgewerkt om
   bekende kwetsbaarheden te dichten.

## Gevorderde onderwerpen {#advanced-topics}

### DHCP relay

Staan clients en DHCP-servers in verschillende subnetten, dan stuurt een
DHCP-relayagent de DHCP-berichten tussen hen door.

### DHCP relay instellen (Linux) {#configuring-dhcp-relay-linux}

```bash
sudo apt-get install isc-dhcp-relay

# Configuration File: /etc/default/isc-dhcp-relay
SERVERS="192.168.1.10" # IP of the DHCP Server
INTERFACES="eth0 eth1" # Interfaces to listen on

sudo systemctl restart isc-dhcp-relay
```

### DHCP failover

Voor een hoge beschikbaarheid stel je twee DHCP-servers in failovermodus in. Ze
delen de leasegegevens en verdelen de belasting.

### DHCP failover instellen (ISC DHCP Server) {#configuring-dhcp-failover-isc-dhcp-server}

In `/etc/dhcp/dhcpd.conf`:

```bash
# On Primary DHCP Server
failover peer "dhcp-failover" {
  primary;
  address 192.168.1.10;
  port 647;
  peer address 192.168.1.11;
  peer port 647;
  max-response-delay 60;
  max-unacked-updates 10;
  load balance max seconds 3;
  mclt 3600;
  split 128;
}

# On Secondary DHCP Server
failover peer "dhcp-failover" {
  secondary;
  address 192.168.1.11;
  port 647;
  peer address 192.168.1.10;
  peer port 647;
  max-response-delay 60;
  max-unacked-updates 10;
  load balance max seconds 3;
}
```

### Beeldmateriaal {#visual-aids}

Hieronder staan diagrammen die het DHCP-proces en de configuraties in beeld
brengen:

#### Diagram van het DHCP-proces (DORA) {#dhcp-process-dora-diagram}

```c
+--------+             +--------+             +--------+              +--------+
| Client |             | Server |             | Server |              | Client |
|        |--Discover-->|        |             |        |              |        |
|        |             |        |--Offer------|        |              |        |
|        |<------------|        |             |        |              |        |
|        |             |        |             |        |              |        |
|        |--Request--->|        |             |        |              |        |
|        |             |        |--ACK--------|        |              |        |
|        |<------------|        |             |        |              |        |
+--------+             +--------+             +--------+              +--------+
```

#### Diagram van de configuratie van DHCP failover {#dhcp-failover-configuration-diagram}

```c
+----------------+          +----------------+
| Primary DHCP   |          | Secondary DHCP |
| Server         |          | Server         |
| (192.168.1.10) |          | (192.168.1.11) |
|                |          |                |
|                |<-------->|                |
|                |          |                |
|                |<-------->|                |
+----------------+          +----------------+
```

## Situaties uit de praktijk {#real-world-scenarios}

Een paar situaties waarin het oplossen van DHCP-problemen en de aanbevolen
werkwijzen een rol spelen:

### Situatie 1: de IP-adressen zijn op {#scenario-1-ip-address-exhaustion}

- **Probleem**: gebruikers melden dat ze geen verbinding met het netwerk
  krijgen.
- **Oplossing**: controleer of de DHCP-scope genoeg IP-adressen heeft. Vergroot
  het bereik zo nodig of verkort de leasetijd, zodat adressen vaker opnieuw
  worden gebruikt.

### Situatie 2: een malafide DHCP-server {#scenario-2-rogue-dhcp-server}

- **Probleem**: apparaten krijgen verkeerde IP-adressen of netwerkinstellingen.
- **Oplossing**: zet DHCP snooping aan op de switches om DHCP-servers zonder
  toestemming te blokkeren. Zoek de malafide server en verwijder die.

### Situatie 3: netwerksegmentatie {#scenario-3-network-segmentation}

- **Probleem**: apparaten in andere subnetten krijgen geen IP-adressen.
- **Oplossing**: stel een DHCP-relayagent in die verzoeken tussen subnetten
  doorstuurt. Zorg voor een juiste relayconfiguratie en verbinding.

### Situatie 4: problemen bij het vernieuwen van leases {#scenario-4-lease-renewal-issues}

- **Probleem**: apparaten verliezen af en toe hun verbinding.
- **Oplossing**: zoek in de logs van de DHCP-server naar fouten bij het
  vernieuwen van leases. Pas de leasetijd aan en zorg dat de server genoeg
  capaciteit heeft voor de vernieuwingen.

### Situatie 5: verkeerd ingestelde DHCP-opties {#scenario-5-misconfigured-dhcp-options}

- **Probleem**: apparaten krijgen niet de juiste adressen van de DNS-servers.
- **Oplossing**: controleer de opties in het DHCP-configuratiebestand. Geef met
  `option domain-name-servers` de juiste DNS-servers op.

## Conclusie {#conclusion}

DHCP maakt netwerkbeheer eenvoudiger door het toewijzen en instellen van
IP-adressen te automatiseren. Wie de processen, configuraties en aanbevolen
werkwijzen begrijpt, zorgt voor een efficiënt en betrouwbaar netwerk.

Dit spiekbriefje is een snel naslagwerk voor de basis, de configuratie, het
oplossen van problemen en de gevorderde functies van DHCP. Houd het bij de hand
bij het beheren van DHCP in je netwerk.

[Kea DHCP]: https://www.isc.org/kea/
