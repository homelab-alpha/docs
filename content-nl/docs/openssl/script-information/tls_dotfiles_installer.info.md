---
title: "tls_dotfiles_installer.info"
description:
  "Een script dat OpenSSL-aliassen in het bestand .bashrc installeert en
  instelt, zonder dubbele items te maken."
url: "openssl/script-info/tls-dotfiles-installer"
aliases:
  - "openssl/script-info/ssl-dotfiles-installer"
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
  - OpenSSL
  - Bash
  - Shell Script
  - Configuration
keywords:
  - OpenSSL installer
  - Bash script
  - .bashrc configuration
  - Alias management
  - Shell scripting

weight: 9115

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `tls_dotfiles_installer.sh` bekijken. Dit script voegt de
aliassen van deze repository toe aan `~/.bashrc`. Het voorkomt dubbele items
door te controleren of ze al bestaan, en voegt de inhoud alleen toe als die
ontbreekt. Het script verwijdert of wijzigt geen ander bestand.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `tls_dotfiles_installer.sh`
- **Oude naam**: `ssl_dotfiles_installer.sh` (een wrapper die dit script start)
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 3.0.0
- **Beschrijving**: dit script voegt de aliassen van deze repository toe aan
  `~/.bashrc`.
- **RAW-script**: [tls_dotfiles_installer.sh]

## Gebruik {#usage}

```bash
./tls_dotfiles_installer.sh [-h|--help]
```

| Optie          | Betekenis       |
| :------------- | :-------------- |
| `-h`, `--help` | Toon deze hulp. |

Zonder opties voegt het script de aliassen toe aan `~/.bashrc`.

## Opmerkingen {#notes}

- Zorg dat de inhoud die wordt toegevoegd goed is opgemaakt, om conflicten met
  bestaande aliassen te voorkomen.
- Het script gaat uit van een vaste mapstructuur met het bestand
  `~/openssl/dotfiles/.bash_aliases` voor de aliassen.

## Uitgebreide uitleg {#detailed-explanation}

De onderstaande secties volgen het script van boven naar beneden.

### Het script stoppen bij een fout {#stop-script-on-error}

```bash
# Stop script on error
set -Eeuo pipefail
```

### De opties verwerken {#parse-the-options}

```bash
while [[ $# -gt 0 ]]; do
  case "$1" in
  -h | --help)
    sed -n '/^# Usage:/,/^$/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  *)
    echo "Error: Unknown option: $1" >&2
    exit 2
    ;;
  esac
done
```

### De paden naar de bestanden bepalen {#define-the-paths-to-the-files}

```bash
# Define the paths to the files
bashrc_path="$HOME/.bashrc"
aliases_path="$HOME/openssl/dotfiles/.bash_aliases"
```

### Controleren of .bashrc bestaat en beschrijfbaar is {#check-if-bashrc-exists-and-is-writable}

```bash
# Check if .bashrc exists and is writable
if [[ ! -w "$bashrc_path" ]]; then
  echo "Error: $bashrc_path is not writable. Please check your permissions." >&2
  exit 1
fi
```

### De benodigde configuratie aan .bashrc toevoegen als die er nog niet staat {#add-the-necessary-configuration-to-bashrc-if-its-not-already-present}

De benodigde configuratie aan .bashrc toevoegen als die er nog niet staat. Het
eerste patroon is de regel die oudere versies van dit script schreven.

```bash
# Add the necessary configuration to .bashrc if it's not already present. The
# first pattern is the line that older versions of this script wrote.
if grep -qF -e "if [ -f $aliases_path ]; then" -e "if [ -f \"$aliases_path\" ]; then" "$bashrc_path"; then
  echo "Configuration already exists in $bashrc_path"
else
  {
    echo "# Alias definitions for openssl."
    echo "# You may want to put all your additions into a separate file like"
    echo "# ~/openssl/dotfiles/.bash_aliases, instead of adding them here directly."
    echo ""
    echo "if [ -f \"$aliases_path\" ]; then"
    echo "  . \"$aliases_path\""
    echo "fi"
    echo ""
  } >>"$bashrc_path"
  echo "Configuration added to $bashrc_path"
fi
```

### De gebruiker melden dat het script klaar is {#inform-the-user-about-the-completion-of-the-script}

```bash
# Inform the user about the completion of the script
echo "Installation completed. Open a new shell to use the aliases."

exit 0
```

## Conclusie {#conclusion}

Dit script voegt de aliassen van deze repository toe aan `~/.bashrc`.

[tls_dotfiles_installer.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/tls_dotfiles_installer.sh
