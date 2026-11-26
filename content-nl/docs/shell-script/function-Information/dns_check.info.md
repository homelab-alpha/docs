---
title: "dns_check.info"
description:
  "Het script dns_check.info is een degelijk hulpmiddel om de netwerkverbinding
  en de bereikbaarheid van DNS-servers te controleren, onmisbaar bij het
  oplossen van netwerkproblemen. Ontdek hoe het werkt en hoe het helpt bij het
  vinden van netwerkproblemen."
url: "shell-script/function-info/dns-check"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Function Information
tags:
  - Shell Script
  - Network Diagnostics
  - DNS Server
  - Network Connectivity
  - Troubleshooting
  - Ping Test
  - Network Interface
keywords:
  - dns_check.info
  - shell script
  - network diagnostics
  - DNS server
  - network connectivity
  - troubleshooting
  - ping test
  - network interface

weight: 10102

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `dns_check.sh`,
is geschreven door GJS (homelab-alpha) en controleert de netwerkverbinding en de
bereikbaarheid van DNS-servers. Het voert geen vaste taak uit, maar helpt bij
het vinden van mogelijke netwerkproblemen.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `dns_check.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: het script controleert de netwerkverbinding en de
  bereikbaarheid van DNS-servers, als hulp bij het oplossen van
  netwerkproblemen.
- **RAW-script**: [dns_check.sh]

## Functie: dns-checker {#function-dns-checker}

Het script gebruikt de functie `dns-checker()` voor de netwerkcontroles. Laten
we de onderdelen bekijken:

## ANSI-kleurcodes {#ansi-color-codes}

```bash
green="\e[32m"   # Green color code
red="\e[31m"     # Red color code
end="\e[0m"      # Reset text formatting
```

Deze variabelen bevatten ANSI-kleurcodes voor groen, rood en het herstellen van
de tekstopmaak, zodat de logmeldingen beter leesbaar zijn.

## Tijdstempel {#timestamp}

```bash
stamp="$(date +'[%b %d, %Y - %H%M%S]')" # Timestamp for log messages
```

Deze regel maakt een tijdstempel voor de logmeldingen, zodat je ziet wanneer
elke netwerkgebeurtenis plaatsvond.

## Logfunctie {#logging-function}

```bash
function log_message() {
  local message="$1"
  echo -e "$stamp $message"
}
```

De functie `log_message()` zet een tijdstempel voor de meldingen en toont ze in
de console.

## Pingfunctie {#ping-checking-function}

```bash
function check_ping() {
  local host="$1"
  if ping -c 1 "$host" >/dev/null; then
    return 0
  else
    return 1
  fi
}
```

De functie `check_ping()` test met één ping of een opgegeven host bereikbaar is.
Ze geeft 0 terug als dat lukt en 1 als het mislukt.

## Controle van de DNS-servers {#dns-server-checks}

Het script controleert of de primaire en secundaire lokale (interne)
DNS-servers, zoals Pi-hole of AdGuard Home, bereikbaar zijn, en of er een
internetverbinding is.

Eerst pingt het de primaire lokale DNS-server en logt het de status. Is die niet
bereikbaar, dan pingt het de secundaire lokale DNS-server.

Daarna test het script de netwerkverbinding door `google.com` te bereiken. Lukt
dat niet, dan meldt het een mogelijk netwerkprobleem.

Lijkt het netwerk niet te werken, dan pingt het script externe DNS-servers
(`9.9.9.9` en `149.112.112.112`). Zo zie je of het probleem bij DNS ligt of bij
het netwerk in het algemeen.

## Netwerkinterfaces loggen {#network-interface-logging}

```bash
ifconfig >>"DNS_failure_interface_${stamp}.txt"
```

Bij netwerkproblemen schrijft het script de gegevens van de netwerkinterfaces
naar een logbestand met een tijdstempel, als hulp bij het verder oplossen.

## Conclusie {#conclusion}

Kortom: `dns_check.sh` is een uitgebreid hulpmiddel voor netwerkdiagnose. Het
controleert de bereikbaarheid van DNS-servers en de netwerkverbinding, en logt
de gegevens die je nodig hebt om problemen op te lossen.

[dns_check.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/dns_check.sh
