---
title: "cert_rsa_server.info"
description:
  "Automatiseer het maken en beheren van RSA-servercertificaten: sleutel maken,
  CSR maken, certificaat uitgeven, controleren en omzetten naar andere formaten."
url: "openssl/script-info/cert-rsa-server"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - OpenSSL
series:
  - Script Information
tags:
  - RSA certificates
  - server authentication
  - OpenSSL scripts
  - certificate management
  - certificate automation
keywords:
  - RSA server certificates
  - key generation
  - CSR creation
  - certificate issuance
  - certificate verification
  - format conversion

weight: 9107

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `cert_rsa_server.sh` bekijken. Dit script maakt een
RSA-servercertificaat, ondertekend door de tussenliggende certificaatautoriteit.
Het maakt ook de ketenbundel en een bundel voor HAProxy. Het werk doet `cert.sh`
in dezelfde map. Dit script start het met `--algo` rsa `--role` server en geeft
alle andere opties door.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `cert_rsa_server.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script maakt een RSA-servercertificaat, ondertekend door
  de tussenliggende certificaatautoriteit.
- **RAW-script**: [cert_rsa_server.sh]

## Gebruik {#usage}

```bash
./cert_rsa_server.sh [--fqdn <fqdn> [--ip <ipv4>[,<ipv4>...]]] [--reuse-key] [-h|--help]
```

| Optie           | Betekenis                                                                                                                                                                                                                             |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--fqdn <fqdn>` | Werk zonder vragen voor deze FQDN.                                                                                                                                                                                                    |
| `--ip <list>`   | Voeg een of meer IPv4-adressen toe aan de alternatieve namen, gescheiden door komma's (bijvoorbeeld 192.168.0.1,192.168.0.2). Een spatie na een komma mag (192.168.0.1, 192.168.0.2). Mag vaker voorkomen. Alleen samen met `--fqdn`. |
| `--reuse-key`   | Gebruik de bestaande privésleutel van deze FQDN opnieuw in plaats van een nieuwe te maken. De sleutel moet bestaan.                                                                                                                   |
| `-h`, `--help`  | Toon deze hulp.                                                                                                                                                                                                                       |

De alias is `new-cert-rsa-server`.

Zonder `--fqdn` vraagt het script om de gegevens. De Common Name is altijd de
FQDN.

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Certificaten staan onder `$HOME/tls`.
- Een certificaat dekt de FQDN en `www.<fqdn>`. Bij een wildcard-FQDN, zoals
  `*.example.test`, dekt het de wildcard en het domein zelf (example.test),
  omdat de wildcard www.example.test al dekt en het domein zelf niet.

## Uitgebreide uitleg {#detailed-explanation}

De secties hieronder volgen het script van boven naar beneden.

### `cert.sh` starten met de vaste opties {#start-certsh-with-the-fixed-options}

Het script toont een eigen helptekst bij `-h` en `--help`. Bij elke andere
aanroep start het `cert.sh` in dezelfde map met de vaste opties, en geeft het
alle andere opties door.

```bash
script_dir="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"

for argument in "$@"; do
  case "$argument" in
  -h | --help)
    sed -n '/^# Usage:/,/^$/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  esac
done

exec bash "$script_dir/cert.sh" --algo rsa --role server "$@"
```

## Conclusie {#conclusion}

Dit script maakt een RSA-servercertificaat, ondertekend door de tussenliggende
certificaatautoriteit.

[cert_rsa_server.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_rsa_server.sh
