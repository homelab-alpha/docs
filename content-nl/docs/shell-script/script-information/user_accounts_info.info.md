---
title: "user_accounts_info.info"
description:
  "Haal uitgebreide informatie op over systeemaccounts en gewone
  gebruikersaccounts en deel ze in op basis van de waarden van UID en GID."
url: "shell-script/script-info/user-accounts-info"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Script Information
tags:
  - user management
  - account information
  - system administration
  - shell script
  - Linux
keywords:
  - user
  - accounts
  - system users
  - normal users
  - UID
  - GID
  - shell script
  - Linux administration
  - passwd file
  - login.defs
  - user
  - groups

weight: 10221

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}} Claude heeft bijgedragen aan dit document. Wees
daarom voorzichtig met de informatie hier en controleer die zo nodig.
{{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`user_accounts_info.sh`, is geschreven door GJS (homelab-alpha) en haalt
informatie op over de gebruikersaccounts van het systeem en ordent die. Het
deelt de accounts in als systeemaccounts en gewone gebruikers en toont de
belangrijkste gegevens in een vaste opmaak.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `user_accounts_info.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 7 december 2024
- **Versie**: 1.0.1
- **Beschrijving**: het script haalt informatie op over de gebruikersaccounts
  van het systeem en deelt ze in als systeemaccounts en gewone gebruikers.
- **RAW-script**: [user_accounts_info.sh]

## Overzicht {#overview}

Het script haalt de gegevens van gebruikersaccounts uit het bestand `passwd` van
het systeem en deelt ze in als systeemaccounts en gewone gebruikers, op basis
van de waarden van UID en GID in het bestand `login.defs`. Het verwerkt de
gegevens met `awk` en toont ze als tabel.

## Functies {#functions}

### `print_header()`

Deze functie toont een opgemaakte kop voor de uitvoer. Ze maakt met `echo` en
`printf` een kop in de vorm van een tabel.

```bash
print_header() {
  echo "==========================================================================================================="
  printf "%-15s %-15s %-30s %-25s %-20s\n" "UID" "GID" "Shell" "Username" "Groups"
  echo "==========================================================================================================="
}
```

## Hoofdprogramma {#main-program}

### Bestandspaden {#file-paths}

Het script bepaalt de paden naar de bestanden `login.defs` en `passwd`.

```bash
login_defs="/etc/login.defs"
passwd_file="/etc/passwd"
```

### Controleren of de bestanden bestaan {#file-existence-check}

Het controleert of de benodigde bestanden (`login.defs` en `passwd`) bestaan.
Ontbreekt er een, dan stopt het script met een foutmelding.

```bash
if [ ! -f "$login_defs" ] || [ ! -f "$passwd_file" ]; then
  echo "ERROR: Required files not found."
  exit 1
fi
```

### De grenzen van UID en GID ophalen {#retrieve-uid-and-gid-limits}

Het script haalt met `awk` de minimum- en maximumwaarden van UID en GID uit het
bestand `login.defs`.

```bash
min_uid=$(awk '/^UID_MIN/{print $2}' "$login_defs")
max_uid=$(awk '/^UID_MAX/{print $2}' "$login_defs")
min_gid=$(awk '/^GID_MIN/{print $2}' "$login_defs")
max_gid=$(awk '/^GID_MAX/{print $2}' "$login_defs")
```

### Controleren of `awk` beschikbaar is {#check-for-awk-availability}

Het controleert of `awk` op het systeem beschikbaar is. Zo niet, dan stopt het
script met een foutmelding.

```bash
if ! command -v awk &>/dev/null; then
  echo "ERROR: awk command not found."
  exit 1
fi
```

## Systeemaccounts tonen {#print-system-user-accounts}

Het script toont de kop voor de systeemaccounts en verwerkt daarna met `awk` het
bestand `passwd`. Het laat alleen de accounts zien die buiten het bereik van de
UID's en GID's van gewone gebruikers vallen, dus de systeemaccounts. Het haalt
ook de groepen van elke gebruiker op en toont die.

```bash
print_header "System User Accounts"
awk -F':' -v "min_uid=$min_uid" -v "max_uid=$max_uid" -v "min_gid=$min_gid" -v "max_gid=$max_gid" '
    function get_user_groups(username) {
        "id -Gn " username | getline groups
        close("id -Gn " username)
        return groups
    }
    !($3 >= min_uid && $3 <= max_uid && $4 >= min_gid && $4 <= max_gid) {
        printf "%-15s %-15s %-30s %-25s %-20s\n", "UID: "$3, "GID: "$4, "Shell: "$7, $1, get_user_groups($1)
    }' "$passwd_file" | sort -n -t ':' -k 2
```

## Gewone gebruikersaccounts tonen {#print-normal-user-accounts}

Op dezelfde manier toont het script de kop voor de gewone gebruikersaccounts en
verwerkt en toont het met `awk` de gegevens van de gebruikers binnen het
opgegeven bereik van UID en GID.

```bash
echo "" # Add a blank line between sections

print_header "Normal User Accounts"
awk -F':' -v "min_uid=$min_uid" -v "max_uid=$max_uid" -v "min_gid=$min_gid" -v "max_gid=$max_gid" '
    function get_user_groups(username) {
        "id -Gn " username | getline groups
        close("id -Gn " username)
        return groups
    }
    $3 >= min_uid && $3 <= max_uid && $4 >= min_gid && $4 <= max_gid {
        printf "%-15s %-15s %-30s %-25s %-20s\n", "UID: "$3, "GID: "$4, "Shell: "$7, $1, get_user_groups($1)
    }' "$passwd_file" | sort -n -t ':' -k 2
```

## Opmerkingen {#notes}

- Het script heeft leestoegang nodig tot de bestanden `/etc/login.defs` en
  `/etc/passwd`.
- Het gebruikt `awk` om de gegevens te verwerken.
- De uitvoer is gesorteerd op UID en GID, zodat die makkelijker te lezen is.

Dit script deelt de gegevens van gebruikersaccounts op een Unix-achtig systeem
goed in en toont ze, met een duidelijke scheiding tussen systeemaccounts en
gewone gebruikers.

[user_accounts_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/user_accounts_info.sh
