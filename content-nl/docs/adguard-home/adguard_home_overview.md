---
title: "Overzicht van AdGuard Home"
description:
  "Ontdek de functies en mogelijkheden van AdGuard Home in dit uitgebreide
  overzicht."
url: "adguard-home/overview"
aliases: ""
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - AdGuard Home
series:
  - AdGuard Home
tags:
  - AdGuard Home
keywords:
  - AdGuard Home
  - ad blocker
  - privacy protection
  - internet security
  - DNS filtering
  - network protection
  - home network
  - overview

weight: 1001

toc: true
katex: true
---

## Inleiding

AdGuard Home is krachtige en veelzijdige software die advertenties blokkeert en
je privacy beschermt. In deze repository vind je verschillende submappen met
onderdelen voor AdGuard Home, zoals filters en andere bestanden.

## Beschikbare filters van Homelab-Alpha

{{% alert context="warning" %}} De filters hieronder zijn mijn persoonlijke
filters voor AdGuard Home. Bekijk ze eerst goed, zodat je weet wat er wordt
geblokkeerd, toegestaan en/of omgeleid, voordat je er een gebruikt.
{{% /alert %}}

- [**Bekende Malafide Handelspartijen:**] filter met een lijst van
  handelspartijen (verkopers en handelaren) die bij de Nederlandse politie
  bekendstaan als frauduleus.
- [**Blocklist:**] filter dat is samengesteld uit verschillende andere filters
  en vereenvoudigd om beter te werken met het blokkeren van advertenties op
  DNS-niveau.
- [**Blocklist IP Addresses:**] filter dat is samengesteld uit verschillende
  andere filters en vereenvoudigd om beter te werken met het blokkeren van
  advertenties op DNS-niveau.
- [**Cookies:**] filter met een lijst die advertenties en het volgen voor
  advertenties blokkeert met cookiefilters.
- [**Cosmetic:**] filter met een lijst die advertenties, gesponsorde inhoud en
  andere ongewenste onderdelen van pagina's verbergt.
- [**DNS type:**] filter met een lijst die bepaalt wat voor soort DNS-verzoeken
  het zijn en daarna of ze met een regel in een DNS-blokkeerlijst moeten worden
  geblokkeerd.
- [**Fraudulent Trading Parties**] filter met een lijst van handelspartijen
  (verkopers en handelaren) die bekendstaan als frauduleus.
- [**IDNs:**] filter met een lijst die geïnternationaliseerde domeinnamen
  (IDN's) blokkeert.
- [**LabHost phishing domains:**] filter met 41.962 phishingdomeinen. De
  domeinen horen bij LabHost, een platform voor phishing-as-a-service (PhaaS)
  dat door de FBI is ontdekt.
- [**Malicious IP Addresses:**] filter met een lijst van bekende kwaadaardige
  IP-adressen. (Beschermt je netwerk tegen mogelijke bedreigingen.)
- [**Microsoft Whitelist:**] filter met een DNS-toestaanlijst voor Microsoft die
  toegestane domeinnamen doorlaat.
- [**NLconnect Reference List:**] filter met een lijst van nalevingsadvies voor
  internetaanbieders over EU-sancties.
- [**Regex:**] filter met een lijst die advertenties en het volgen voor
  advertenties blokkeert met reguliere expressies.
- [**SLDs:**] filter met een lijst die domeinen op het tweede niveau blokkeert.
- [**Sociale Media:**] filter met een lijst die websites van sociale media
  blokkeert.
- [**Third Level Domains:**] filter met een lijst die domeinen op het derde
  niveau blokkeert.
- [**TLDs:**] filter met een lijst die topleveldomeinen blokkeert.
- [**Whitelist:**] filter met een DNS-toestaanlijst die toegestane domeinnamen
  doorlaat.
- [**Wildcard:**] filter met een lijst die wildcard-DNS-records blokkeert.

## Bijdragen aan Homelab-Alpha - AdGuard Home

We waarderen je bijdrage en maken het je zo makkelijk mogelijk om bij te dragen
aan de repository Homelab-Alpha - adguard-home. Wijzigingen aan adguard-home
lopen via pull requests naar de branch `main`. Lees [hoe je
bijdraagt][contribute].

## Licentie

Dit project valt onder de **Creative Commons
Naamsvermelding-NietCommercieel-GelijkDelen 4.0 Internationaal-licentie** (CC
BY-NC-SA 4.0). Zie de pagina [licentie][license] voor de volledige licentietekst
en het bestand [NOTICE] voor de eisen aan de naamsvermelding.

[license]: /license/
[NOTICE]: https://github.com/homelab-alpha/adguard-home/blob/main/NOTICE
[**Bekende Malafide Handelspartijen:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/bekende_malafide_handelspartijen.txt
[**Blocklist:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/blocklist.txt
[**Blocklist IP Addresses:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/blocklist_ip_addresses.txt
[**Cookies:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/cookies.txt
[**Cosmetic:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/cosmetic.txt
[**DNS type:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/dns_type.txt
[**Fraudulent Trading Parties**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/fraudulent_trading_parties.txt
[**IDNs:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/idns.txt
[**LabHost phishing domains:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/refs/heads/main/filters/labhost_phishing_domains.txt
[**Malicious IP Addresses:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/malicious_ip_addresses.txt
[**Microsoft Whitelist:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/microsoft_whitelist.txt
[**NLconnect Reference List:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/nlconnect_reference_list.txt
[**Regex:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/regex.txt
[**SLDs:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/slds.txt
[**Sociale Media:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/sociale_media.txt
[**Third Level Domains:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/third_level_domains.txt
[**TLDs:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/tlds.txt
[**Whitelist:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/whitelist.txt
[**Wildcard:**]:
  https://raw.githubusercontent.com/homelab-alpha/adguard-home/main/filters/wildcard.txt
[contribute]: /contributing/contribute/
