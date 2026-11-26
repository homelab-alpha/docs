---
title: "cert_ecdsa_localhost.info"
description:
  "Automatiseert het maken van een ECDSA-certificaat voor localhost: sleutel
  maken, CSR, certificaat uitgeven en omzetten naar andere formaten."
url: "openssl/script-info/cert-ecdsa-localhost"
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
  - ECDSA
  - SSL
  - Certificate Generation
  - OpenSSL Script
  - Localhost Security
keywords:
  - ECDSA certificate
  - localhost SSL
  - OpenSSL automation
  - certificate signing request
  - SSL key generation
  - certificate verification
  - HAProxy SSL
  - certificate format conversion

weight: 9104

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `cert_ecdsa_localhost.sh` bekijken. Dit script maakt een
ECDSA-servercertificaat voor localhost, ondertekend door de tussenliggende
certificaatautoriteit. Het maakt ook de ketenbundel en een bundel voor HAProxy.
Het werk doet `cert.sh` in dezelfde map. Dit script start het met `--algo` ecdsa
`--role` server `--localhost` en geeft alle andere opties door.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `cert_ecdsa_localhost.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script maakt een ECDSA-servercertificaat voor localhost,
  ondertekend door de tussenliggende certificaatautoriteit.
- **RAW-script**: [cert_ecdsa_localhost.sh]

## Gebruik {#usage}

```bash
./cert_ecdsa_localhost.sh [--non-interactive] [--reuse-key] [-h|--help]
```

| Optie               | Betekenis                                                                                             |
| :------------------ | :---------------------------------------------------------------------------------------------------- |
| `--non-interactive` | Bewaard voor oudere commando's. Het script stelt nooit een vraag.                                     |
| `--reuse-key`       | Gebruik de bestaande privésleutel opnieuw in plaats van een nieuwe te maken. De sleutel moet bestaan. |
| `-h`, `--help`      | Toon deze hulp.                                                                                       |

De alias is `new-cert-localhost`.

De Common Name is localhost.

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Certificaten staan onder `$HOME/tls`.
- Het certificaat dekt localhost, `*.localhost` en 127.0.0.1.

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

exec bash "$script_dir/cert.sh" --algo ecdsa --role server --localhost "$@"
```

## Conclusie {#conclusion}

Dit script maakt een ECDSA-servercertificaat voor localhost, ondertekend door de
tussenliggende certificaatautoriteit.

[cert_ecdsa_localhost.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_ecdsa_localhost.sh
