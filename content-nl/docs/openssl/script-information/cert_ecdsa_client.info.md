---
title: "cert_ecdsa_client.info"
description:
  "Dit script automatiseert het maken van een ECDSA-clientcertificaat: sleutel
  maken, CSR maken, certificaat uitgeven, extensiebestand maken, bundelen met de
  keten van de tussenliggende CA, en het certificaat en de ketenbundel
  controleren. Het zet het certificaat ook om naar verschillende formaten voor
  allerlei toepassingen."
url: "openssl/script-info/cert-ecdsa-client"
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
  - Client Certificate
  - OpenSSL
  - Certificate Automation
  - CSR
  - Certificate Issuance
  - Certificate Verification
keywords:
  - ECDSA client certificate generation
  - OpenSSL scripting
  - Automated certificate creation
  - CSR generation script
  - Certificate chain verification
  - SSL/TLS certificates
  - Security automation
  - PEM to CRT conversion
  - Key management
  - Digital certificate script

weight: 9103

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `cert_ecdsa_client.sh` bekijken. Dit script maakt een
ECDSA-clientcertificaat, ondertekend door de tussenliggende
certificaatautoriteit. Het maakt ook de ketenbundel. Het werk doet `cert.sh` in
dezelfde map. Dit script start het met `--algo` ecdsa `--role` client en geeft
alle andere opties door.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `cert_ecdsa_client.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script maakt een ECDSA-clientcertificaat, ondertekend
  door de tussenliggende certificaatautoriteit.
- **RAW-script**: [cert_ecdsa_client.sh]

## Gebruik {#usage}

```bash
./cert_ecdsa_client.sh [--fqdn <fqdn>] [--www] [--reuse-key] [-h|--help]
```

| Optie           | Betekenis                                                                                                           |
| :-------------- | :------------------------------------------------------------------------------------------------------------------ |
| `--fqdn <fqdn>` | Werk zonder vragen voor deze FQDN.                                                                                  |
| `--www`         | Voeg ook `www.<fqdn>` toe aan de alternatieve namen (SAN's).                                                        |
| `--reuse-key`   | Gebruik de bestaande privésleutel van deze FQDN opnieuw in plaats van een nieuwe te maken. De sleutel moet bestaan. |
| `-h`, `--help`  | Toon deze hulp.                                                                                                     |

De alias is `new-cert-client`.

Zonder `--fqdn` vraagt het script om de gegevens. De Common Name is altijd de
FQDN.

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Certificaten staan onder `$HOME/tls`.
- Een certificaat dekt de FQDN. Gebruik `--www` om `www.<fqdn>` toe te voegen.

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

exec bash "$script_dir/cert.sh" --algo ecdsa --role client "$@"
```

## Conclusie {#conclusion}

Dit script maakt een ECDSA-clientcertificaat, ondertekend door de tussenliggende
certificaatautoriteit.

[cert_ecdsa_client.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/certificate/cert_ecdsa_client.sh
