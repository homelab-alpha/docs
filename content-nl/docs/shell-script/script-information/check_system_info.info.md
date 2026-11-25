---
title: "check_system_info.info"
description:
  "Dit script geeft uitgebreide systeeminformatie: uptime, hardware,
  temperatuur, de status van systemctl, het geheugengebruik (RAM en SWAP),
  schijfruimte en inodes, en de laatste herstarts en afsluitingen. Een handig
  hulpmiddel voor systeembeheerders en gebruikers die snel de belangrijkste
  systeemgegevens van Linux willen bekijken."
url: "shell-script/script-info/check-system-info"
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
  - Shell Script
  - System Information
  - Linux
  - System Administration
  - Scripting
keywords:
  - Shell script
  - System info
  - System temperature
  - Uptime
  - Hardware details
  - systemctl status
  - RAM usage
  - SWAP usage
  - Disk usage
  - Disk usage inodes
  - Reboot events
  - Shutdown events

weight: 10203

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`check_system_info.sh`, is geschreven door GJS (homelab-alpha) en controleert
verschillende onderdelen van het systeem. Het toont de uptime, hardware,
temperatuur, de status van systemctl, het gebruik van RAM en SWAP,
schijfgebruik, inodes en de laatste herstarts en afsluitingen.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `check_system_info.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 18 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script toont systeeminformatie: de uptime, hardware,
  temperatuur, de status van systemctl, het gebruik van RAM en SWAP,
  schijfgebruik, inodes en de laatste herstarts en afsluitingen.
- **RAW-script**: [check_system_info.sh]

## Opbouw en functies van het script {#script-structure-and-functions}

### Scheidingslijnen tonen {#print-section-separators}

Het script heeft de functie `print_separator`, die een scheidingslijn toont voor
de overzichtelijkheid.

```bash
print_separator() {
    echo "────────────────────────────────────────────────────────────────────────────────"
}
```

### Controleren of een commando bestaat {#check-if-a-command-exists}

De hulpfunctie `command_exists` controleert of een commando op het systeem
beschikbaar is.

```bash
command_exists() {
    command -v "$1" >/dev/null 2>&1
}
```

### Eerste gegevens {#initial-information}

Toont de huidige datum, de gebruiker en de uptime van het systeem.

```bash
print_separator
echo "$(date) │ $(whoami)@$(hostname --all-ip-addresses) │ $(uptime --pretty)"
print_separator
```

## Controle op benodigde commando's {#checking-for-required-commands}

### Benodigde commando's controleren {#check-for-required-commands}

Het controleert of de benodigde commando's (`sensors`, `hostnamectl`, `df`,
`last`) beschikbaar zijn en toont de commando's die ontbreken.

```bash
missing_commands=()
if ! command_exists "sensors"; then
    missing_commands+=("sensors")
fi
if ! command_exists "hostnamectl"; then
    missing_commands+=("hostnamectl")
fi
if ! command_exists "df"; then
    missing_commands+=("df")
fi
if ! command_exists "last"; then
    missing_commands+=("last")
fi

if [ ${#missing_commands[@]} -eq 0 ]; then
    echo "All required software is present."
else
    echo "The following software is missing:"
    for cmd in "${missing_commands[@]}"; do
        echo " - $cmd"
    done
    echo "You can install missing software manually using your package manager."
fi
```

## Uitgebreide systeeminformatie {#detailed-system-information}

### Systeeminformatie {#system-info}

Toont het model van het systeem en de gegevens van de hostnaam.

```bash
print_separator
echo "System info:"
echo ""
if command_exists "cat"; then
    cat /proc/device-tree/model
else
    echo "ERROR: 'cat' command not found."
fi
echo ""
if command_exists "hostnamectl"; then
    hostnamectl
else
    echo "ERROR: 'hostnamectl' command not found."
fi
print_separator
```

### Systeemtemperatuur {#system-temperature}

Controleert en toont de temperatuur van het systeem met het commando `sensors`.

```bash
echo "System temperature:"
echo ""
if command_exists "sensors"; then
    sensors
else
    echo "ERROR: 'sensors' command not found."
fi
print_separator
```

### Status van systemctl {#systemctl-status}

Toont de status van systeemdiensten die zijn mislukt.

```bash
echo "Systemctl status:"
echo ""
if command_exists "systemctl"; then
    systemctl --failed
else
    echo "ERROR: 'systemctl' command not found."
fi
print_separator
```

### Gebruik van RAM en SWAP {#ramswap-usage}

Toont het gebruik van RAM en SWAP met het commando `free`.

```bash
echo "RAM/SWAP usage:"
echo ""
if command_exists "free"; then
    free --human
else
    echo "ERROR: 'free' command not found."
fi
print_separator
```

### Schijfgebruik {#disk-usage}

Geeft uitgebreide informatie over het schijfgebruik.

```bash
echo "Disk usage:"
echo ""
if command_exists "df"; then
    df --human-readable --type=ext4 --output=source,size,used,avail,pcent,target
else
    echo "ERROR: 'df' command not found."
fi
print_separator
```

### Gebruik van inodes {#disk-usage-inodes}

Toont het gebruik van inodes op de schijf.

```bash
echo "Disk usage inodes:"
echo ""
if command_exists "df"; then
    df --human-readable --inodes
else
    echo "ERROR: 'df' command not found."
fi
print_separator
```

### Laatste herstarts en afsluitingen {#last-rebootshutdown-events}

Toont de laatste drie keer dat het systeem is afgesloten.

```bash
echo "Last reboot/shutdown:"
echo ""
if command_exists "last"; then
    last --system | grep shutdown | head --lines=3
else
    echo "ERROR: 'last' command not found."
fi
print_separator
```

## Conclusie {#conclusion}

Het script is overzichtelijk opgebouwd en toont duidelijk de status van het
systeem en de software die ontbreekt voor bepaalde controles. Het is handig om
snel de staat van een Linux-systeem te bekijken.

[check_system_info.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/check_system_info.sh
