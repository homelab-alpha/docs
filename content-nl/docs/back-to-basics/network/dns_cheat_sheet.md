---
title: "Spiekbriefje voor DNS"
description:
  "Een complete gids om het Domain Name System (DNS) te begrijpen, met de
  belangrijkste onderdelen, soorten records, manieren van opvragen, caching en
  het oplossen van problemen. Ideaal voor netwerkbeheerders en webontwikkelaars."
url: "back-to-basics/network/dns-cheat-sheet"
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
  - DNS
  - Network Administration
  - Web Development
  - DNS Records
  - Network Security
  - IT Infrastructure
keywords:
  - DNS basics
  - DNS cheat sheet
  - DNS resolver
  - DNS server
  - DNS records
  - DNS query types
  - DNS caching
  - DNS troubleshooting
  - DNSSEC
  - Network best practices

weight: 2703

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## De basis van DNS {#basics-of-dns}

Het **Domain Name System (DNS)** vertaalt leesbare domeinnamen (zoals
<www.example.com>) naar de IP-adressen waarmee computers elkaar op het netwerk
herkennen.

- **Domeinnaam**: een leesbare naam voor een IP-adres (bijv. <www.example.com>).
- **IP-adres**: een numeriek label voor elk apparaat in een computernetwerk
  (bijv. 192.168.1.1 voor IPv4 of 2001:0db8:85a3:0000:0000:8a2e:0370:7334 voor
  IPv6).

## Belangrijke onderdelen van DNS {#key-dns-components}

- **DNS-resolver**: het deel van DNS aan de kant van de client; het vraagt de
  DNS-server.
- **DNS-server**: het deel van DNS aan de kant van de server; het beantwoordt
  vragen met IP-adressen.
- **Root-nameservers**: de DNS-servers op het hoogste niveau, die vragen
  doorsturen naar de juiste TLD-servers (Top-Level Domain).
- **TLD-nameservers**: servers met de gegevens van alle domeinen binnen een
  topleveldomein (zoals .com en .org).
- **Gezaghebbende DNS-servers**: servers met de DNS-records van bepaalde
  domeinen.

## Veelvoorkomende soorten DNS-records {#common-dns-record-types}

- **A-record**: koppelt een domeinnaam aan een IPv4-adres.
- **AAAA-record**: koppelt een domeinnaam aan een IPv6-adres.
- **CNAME-record**: Canonical Name-record, dat een alias koppelt aan de echte
  (canonieke) domeinnaam.
- **MX-record**: Mail Exchange-record, dat de mailserver aangeeft die e-mail
  ontvangt.
- **NS-record**: Name Server-record, dat de gezaghebbende DNS-servers van het
  domein aangeeft.
- **TXT-record**: tekstrecord, vaak gebruikt voor extra informatie, zoals
  SPF-records voor de controle van e-mail.
- **SRV-record**: servicerecord, dat de locatie van servers voor bepaalde
  diensten aangeeft.
- **PTR-record**: pointerrecord, gebruikt voor reverse DNS-lookups.

## Soorten DNS-query's {#dns-query-types}

- **Recursieve query**: de DNS-resolver vraagt meerdere DNS-servers tot hij het
  uiteindelijke IP-adres vindt.
- **Iteratieve query**: de DNS-resolver vraagt de DNS-servers één voor één; elke
  server kan de resolver doorverwijzen naar een andere server.
- **Niet-recursieve query**: de DNS-resolver vraagt de DNS-server, en als die
  het gevraagde record heeft, antwoordt hij meteen.

## DNS-caching

- **DNS-cache**: tijdelijke opslag van de resultaten van DNS-query's, voor meer
  snelheid en minder belasting van DNS-servers.
- **TTL (Time To Live)**: hoe lang een DNS-record door een DNS-resolver of
  -server wordt bewaard.

## Het proces van DNS-resolutie {#dns-resolution-process}

1. **Begin van de query**: een gebruiker typt een domeinnaam in een browser.
2. **DNS-resolver**: de resolver kijkt in zijn cache. Staat het IP-adres er niet
   in, dan stuurt hij een query naar een root-DNS-server.
3. **Root-DNS-server**: antwoordt met het adres van een TLD-DNS-server.
4. **TLD-DNS-server**: antwoordt met het adres van de gezaghebbende DNS-server
   van het domein.
5. **Gezaghebbende DNS-server**: geeft het IP-adres van het domein.
6. **DNS-resolver**: geeft het IP-adres terug aan de browser van de gebruiker.
7. **Browser**: maakt verbinding met de server via het ontvangen IP-adres.

## DNS-providers

Hieronder staan DNS-providers met hun belangrijkste functies en diensten, zodat
je de provider kiest die het best bij je past. Kun je niet kiezen of weet je
niet welke het best past, dan raadt Homelab-Alpha [Quad9](#quad9) aan.

{{% alert context="primary" %}}

**Opmerkingen**

- **DNS over UDP/TCP (Do53)**: de traditionele manier van DNS-resolutie via
  poort 53.
- **DNS over HTTPS (DoH)**: een protocol voor DNS-resolutie op afstand via het
  protocol HTTPS.
- **DNS over TLS (DoT)**: een beveiligingsprotocol dat DNS-query's en
  -antwoorden versleutelt en verpakt via het protocol TLS.
- **DNS over QUIC (DoQ)**: een protocol voor versleutelde DNS op basis van het
  transportprotocol QUIC (RFC 9250).
- **DNSCrypt**: een protocol dat de communicatie tussen een DNS-client en een
  DNS-resolver authenticeert, om DNS-spoofing te voorkomen.
- **DNSSEC**: DNS Security Extensions, een reeks specificaties die de
  integriteit en echtheid van DNS-gegevens waarborgen.
- **EDNS Padding**: een methode om DNS-pakketten op te vullen, zodat de grootte
  van DNS-query's en -antwoorden niets verraadt, voor meer privacy.
- **Filters**: geeft aan of de DNS-provider filters biedt, zoals het blokkeren
  van malware, advertenties of inhoud voor volwassenen.

{{% /alert %}}

### Quad9

| **Naam**                    | Quad9                                                             |
| --------------------------- | ----------------------------------------------------------------- |
| **Beschrijving**            | Gratis DNS zonder winstoogmerk, gericht op beveiliging en privacy |
| **Privacybeleid**           | [Quad9](https://www.quad9.net/privacy/policy/)                    |
| **IPv4-adressen**           | `9.9.9.9`, `149.112.112.112`                                      |
| **IPv6-adressen**           | `2620:fe::fe`, `2620:fe::9`                                       |
| **DNS over UDP/TCP (Do53)** | Ja                                                                |
| **DNS over HTTPS (DoH)**    | `https://dns.quad9.net/dns-query`                                 |
| **DNS over TLS (DoT)**      | `tls://dns.quad9.net`                                             |
| **DNS over QUIC (DoQ)**     | `quic://dns.quad9.net`                                            |
| **DNSCrypt**                | Ja                                                                |
| **DNSSEC**                  | Ja                                                                |
| **EDNS Padding**            | Ja                                                                |
| **Filters**                 | Malware, phishing                                                 |
| **Opmerkingen**             | Gericht op het blokkeren van kwaadaardige domeinen                |

### AdGuard DNS

| **Naam**                    | AdGuard DNS                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| **Beschrijving**            | DNS-dienst gericht op het blokkeren van advertenties en trackers |
| **Privacybeleid**           | [AdGuard DNS](https://adguard.com/en/privacy.html)               |
| **IPv4-adressen**           | `94.140.14.14`, `94.140.15.15`                                   |
| **IPv6-adressen**           | `2a10:50c0::ad1:ff`, `2a10:50c0::ad2:ff`                         |
| **DNS over UDP/TCP (Do53)** | Ja                                                               |
| **DNS over HTTPS (DoH)**    | `https://dns.adguard-dns.com/dns-query`                          |
| **DNS over TLS (DoT)**      | `tls://dns.adguard-dns.com`                                      |
| **DNS over QUIC (DoQ)**     | `quic://dns.adguard-dns.com`                                     |
| **DNSCrypt**                | Nee                                                              |
| **DNSSEC**                  | Ja                                                               |
| **EDNS Padding**            | Ja                                                               |
| **Filters**                 | Advertenties blokkeren, tracking                                 |
| **Opmerkingen**             | Ideaal om advertenties en trackers te blokkeren                  |

### Cloudflare

| **Naam**                    | Cloudflare                                              |
| --------------------------- | ------------------------------------------------------- |
| **Beschrijving**            | Snelle DNS-resolver met privacy voorop                  |
| **Privacybeleid**           | [Cloudflare](https://www.cloudflare.com/privacypolicy/) |
| **IPv4-adressen**           | `1.1.1.1`, `1.0.0.1`                                    |
| **IPv6-adressen**           | `2606:4700:4700::1111`, `2606:4700:4700::1001`          |
| **DNS over UDP/TCP (Do53)** | Ja                                                      |
| **DNS over HTTPS (DoH)**    | `https://dns.cloudflare.com/dns-query`                  |
| **DNS over TLS (DoT)**      | `tls://1dot1dot1dot1.cloudflare-dns.com`                |
| **DNS over QUIC (DoQ)**     | Niet ondersteund                                        |
| **DNSCrypt**                | Nee                                                     |
| **DNSSEC**                  | Ja                                                      |
| **EDNS Padding**            | Ja                                                      |
| **Filters**                 | Malware, inhoud voor volwassenen                        |
| **Opmerkingen**             | Bekend om snelheid en privacy                           |

### Google Public DNS

| **Naam**                    | Google Public DNS                                        |
| --------------------------- | -------------------------------------------------------- |
| **Beschrijving**            | Gratis, wereldwijde dienst voor DNS-resolutie            |
| **Privacybeleid**           | [Google Public DNS](https://policies.google.com/privacy) |
| **IPv4-adressen**           | `8.8.8.8`, `8.8.4.4`                                     |
| **IPv6-adressen**           | `2001:4860:4860::8888`, `2001:4860:4860::8844`           |
| **DNS over UDP/TCP (Do53)** | Ja                                                       |
| **DNS over HTTPS (DoH)**    | `https://dns.google/dns-query`                           |
| **DNS over TLS (DoT)**      | `tls://dns.google`                                       |
| **DNS over QUIC (DoQ)**     | Niet ondersteund                                         |
| **DNSCrypt**                | Nee                                                      |
| **DNSSEC**                  | Ja                                                       |
| **EDNS Padding**            | Ja                                                       |
| **Filters**                 | Nee                                                      |
| **Opmerkingen**             | Snel, betrouwbaar, zonder filters                        |

### Cisco OpenDNS

| **Naam**                    | OpenDNS                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| **Beschrijving**            | DNS-dienst met instelbare beveiliging en filters                       |
| **Privacybeleid**           | [OpenDNS](https://www.cisco.com/c/en/us/about/legal/privacy-full.html) |
| **IPv4-adressen**           | `208.67.222.222`, `208.67.220.220`                                     |
| **IPv6-adressen**           | `2620:119:35::35`, `2620:119:53::53`                                   |
| **DNS over UDP/TCP (Do53)** | Ja                                                                     |
| **DNS over HTTPS (DoH)**    | `https://doh.opendns.com/dns-query`                                    |
| **DNS over TLS (DoT)**      | Niet ondersteund                                                       |
| **DNS over QUIC (DoQ)**     | Niet ondersteund                                                       |
| **DNSCrypt**                | Ja                                                                     |
| **DNSSEC**                  | Ja                                                                     |
| **EDNS Padding**            | Nee                                                                    |
| **Filters**                 | Malware, phishing, eigen filters                                       |
| **Opmerkingen**             | Uitstekend voor gezinnen en kleine bedrijven                           |

## Veelgebruikte hulpmiddelen voor DNS {#common-dns-tools}

### dig

Een hulpmiddel voor netwerkbeheer op de opdrachtregel om DNS-nameservers te
bevragen.

```bash
dig example.com
dig +short example.com
dig example.com MX
dig -x 192.168.1.1
```

### nslookup

Een hulpmiddel voor netwerkbeheer op de opdrachtregel om via DNS de koppeling
tussen domeinnaam en IP-adres op te vragen.

```bash
nslookup example.com
nslookup -type=MX example.com
nslookup 192.168.1.1
```

### host

Een eenvoudig hulpmiddel voor DNS-lookups.

```bash
host example.com
host -t MX example.com
host 192.168.1.1
```

## Gevorderde begrippen van DNS {#advanced-dns-concepts}

- **DNSSEC (DNS Security Extensions)**: verbetert de beveiliging door
  cryptografische handtekeningen aan DNS-gegevens toe te voegen.
- **Anycast-routering**: een methode voor adressering en routering waarbij één
  bestemmingsadres meerdere routes heeft.
- **Split-horizon DNS**: geeft verschillende DNS-antwoorden afhankelijk van de
  bron van de DNS-query, vaak gebruikt voor interne tegenover externe
  gebruikers.

## Aanbevolen werkwijzen voor DNS {#dns-best-practices}

1. **Regelmatige updates**: zorg dat je DNS-records actueel en juist zijn.
2. **Gebruik DNSSEC**: gebruik DNSSEC om je te beschermen tegen DNS-spoofing en
   cache poisoning.
3. **Let op de TTL-waarden**: stel passende TTL-waarden in, met een goede balans
   tussen snelheid en actuele DNS-gegevens.
4. **Zorg voor redundantie**: gebruik meerdere DNS-servers voor betrouwbaarheid
   en beschikbaarheid.
5. **Regelmatige audits**: controleer je DNS regelmatig om fouten in de
   configuratie te vinden en te verhelpen.

## Problemen met DNS oplossen {#troubleshooting-dns-issues}

1. **Controleer de lokale DNS-cache**: leeg je DNS-cache om lokale
   cacheproblemen op te lossen.

   Op Linux

   ```bash
   sudo resolvectl flush-caches
   ```

   Op Windows

   ```bash
   ipconfig /flushdns
   ```

   Op macOS (Catalina en nieuwer, waaronder Sonoma, Sequoia en Tahoe)

   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

2. **Controleer de DNS-configuratie**: controleer de DNS-records met
   hulpmiddelen als `dig`, `nslookup` of `host`.
3. **Controleer de netwerkverbinding**: zorg dat je een stabiele
   netwerkverbinding hebt.
4. **Bekijk de logs van de DNS-server**: zoek in de logs van je DNS-servers naar
   foutmeldingen of ongebruikelijke activiteit.
5. **Neem contact op met je provider**: blijven de problemen, neem dan contact
   op met je internetprovider.

## Conclusie {#conclusion}

Wie met netwerkbeheer of webontwikkeling bezig is, moet DNS begrijpen. Dit
spiekbriefje geeft een volledig overzicht van de belangrijkste kanten van DNS,
van de basis tot gevorderde configuraties en het oplossen van problemen. Gebruik
het als naslag, zodat je DNS-opzet geoptimaliseerd en veilig is.
