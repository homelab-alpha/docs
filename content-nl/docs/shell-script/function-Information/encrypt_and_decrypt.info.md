---
title: "encrypt_and_decrypt.info"
description:
  "Een shellscript met functies om bestanden en mappen met AES-256 en OpenSSL te
  versleutelen en te ontsleutelen."
url: "shell-script/function-info/encrypt-and-decrypt"
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
  - encryption
  - decryption
  - AES-256
  - OpenSSL
  - shell script
  - data security
keywords:
  - encrypt files
  - decrypt files
  - shell script encryption
  - AES-256 encryption
  - OpenSSL encryption
  - data protection
  - command-line encryption

weight: 10103

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`encrypt_and_decrypt.sh`, is geschreven door GJS (homelab-alpha) en biedt
functies om bestanden of mappen te versleutelen en te ontsleutelen met het
versleutelingsalgoritme AES-256 en OpenSSL.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `encrypt_and_decrypt.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script biedt functies om bestanden of mappen te
  versleutelen en te ontsleutelen met AES-256 en OpenSSL.
- **RAW-script**: [encrypt_and_decrypt.sh]

## Overzicht van het script {#script-overview}

Het script definieert twee hoofdfuncties:

1. `file-encrypt`: versleutelt een opgegeven bestand of map.
2. `file-decrypt`: ontsleutelt een eerder versleuteld bestand of map.

## Functie: file-encrypt {#function-file-encrypt}

De functie `file-encrypt` versleutelt bestanden of mappen met het
versleutelingsalgoritme AES-256 en OpenSSL.

### Gebruik {#usage}

```bash
file-encrypt <input_file_or_directory>
```

- `<input_file_or_directory>`: het bestand of de map die wordt versleuteld.

### De code uitgelegd {#code-breakdown}

```bash
function file-encrypt() {
    if [ -z "$1" ]; then
        echo "Usage: file-encrypt <input_file_or_directory>"
        return 1
    fi

    local input="$1"
    local output="${input}.aes256"

    if [ -e "$output" ]; then
        echo "Error: Output file already exists. Please choose a different name."
        return 1
    fi

    openssl enc -aes-256-ctr -pbkdf2 -salt -in "$input" -out "$output"
    if openssl_exit_code=$? && [ $openssl_exit_code -eq 0 ]; then
        echo ""
        echo "${input} has been successfully encrypted as ${output}."
        chmod 644 "$output"
    else
        echo "Encryption failed."
    fi
}
```

1. **Controle van de parameter**: de functie controleert eerst of er een
   invoerbestand of -map is opgegeven. Zo niet, dan toont ze de gebruiksmelding
   en stopt ze met status 1.
2. **Variabelen**:
   - `input`: de naam van het invoerbestand of de invoermap.
   - `output`: de naam van het versleutelde uitvoerbestand, de invoernaam met
     `.aes256` erachter.
3. **Controle van het uitvoerbestand**: controleert of er al een bestand met de
   uitvoernaam bestaat. Zo ja, dan toont ze een foutmelding en stopt ze.
4. **Versleutelen**: versleutelt het invoerbestand met OpenSSL in AES-256 in
   CTR-modus, met PBKDF2 voor het afleiden van de sleutel en met een salt.
5. **Melding bij succes**: lukt het versleutelen, dan toont ze een melding en
   zet ze de rechten van het uitvoerbestand op `644`. Mislukt het, dan toont ze
   een foutmelding.

## Functie: file-decrypt {#function-file-decrypt}

### Doel {#purpose}

De functie `file-decrypt` ontsleutelt bestanden of mappen die met AES-256 en
OpenSSL zijn versleuteld.

### Gebruik {#usage}

```bash
file-decrypt <input_file>
```

- `<input_file>`: het bestand dat wordt ontsleuteld.

### De code uitgelegd {#code-breakdown}

```bash
function file-decrypt() {
    if [ -z "$1" ]; then
        echo "Usage: file-decrypt <input_file>"
        return 1
    fi

    local input="$1"
    local output="${input%.aes256}"

    if [ -e "$output" ]; then
        echo "Error: Output file already exists. Please choose a different name."
        return 1
    fi

    openssl enc -aes-256-ctr -pbkdf2 -d -salt -in "$input" -out "$output"
    if openssl_exit_code=$? && [ $openssl_exit_code -eq 0 ]; then
        echo ""
        echo "${input} has been successfully decrypted as ${output}."
        chmod 644 "$output"
    else
        echo "Decryption failed."
    fi
}
```

1. **Controle van de parameter**: net als bij `file-encrypt` controleert ze of
   er een invoerbestand is opgegeven. Zo niet, dan toont ze de gebruiksmelding
   en stopt ze met status 1.
2. **Variabelen**:
   - `input`: de naam van het invoerbestand.
   - `output`: de naam van het ontsleutelde uitvoerbestand, de invoernaam zonder
     de extensie `.aes256`.
3. **Controle van het uitvoerbestand**: controleert of er al een bestand met de
   uitvoernaam bestaat. Zo ja, dan toont ze een foutmelding en stopt ze.
4. **Ontsleutelen**: ontsleutelt het invoerbestand met OpenSSL in AES-256 in
   CTR-modus, met PBKDF2 voor het afleiden van de sleutel en met een salt.
5. **Melding bij succes**: lukt het ontsleutelen, dan toont ze een melding en
   zet ze de rechten van het uitvoerbestand op `644`. Mislukt het, dan toont ze
   een foutmelding.

## Conclusie {#conclusion}

Met deze stappen versleutelt en ontsleutelt het script bestanden en mappen
veilig, wat handig is om gevoelige gegevens te beschermen.

[encrypt_and_decrypt.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/encrypt_and_decrypt.sh
