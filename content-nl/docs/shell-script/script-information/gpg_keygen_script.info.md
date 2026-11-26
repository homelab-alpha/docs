---
title: "gpg_keygen_script.info"
description:
  "Een uitgebreid shellscript om GPG-sleutelparen te maken, met een controle van
  de software, logging, uitgebreide uitvoer en een eigen GPG-map. Ideaal om
  veilige communicatie op te zetten."
url: "shell-script/script-info/gpg-keygen-script"
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
  - GPG
  - Key Generation
  - Security
  - Shell Script
  - Homelab
keywords:
  - GPG key pair
  - shell script
  - secure communication
  - script logging
  - verbose mode
  - software check
  - GPG directory

weight: 10208

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`gpg_keygen_script.sh`, is geschreven door GJS (homelab-alpha) en maakt een
GPG-sleutelpaar voor veilige communicatie. Het script controleert de benodigde
software, maakt het sleutelpaar en logt de acties. Het heeft ook opties voor
uitgebreide uitvoer en voor de GPG-map.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `gpg_keygen_script.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 7 december 2024
- **Versie**: 1.0.1
- **Beschrijving**: dit script maakt een GPG-sleutelpaar voor veilige
  communicatie. Het controleert de benodigde software, maakt het sleutelpaar en
  logt de acties. Het script heeft ook opties voor uitgebreide uitvoer en voor
  de GPG-map.
- **RAW-script**: [gpg_keygen_script.sh]

## Header van het script {#script-header}

Het script begint met gegevens en gebruiksinstructies, met een duidelijk
overzicht van het doel, de opties en voorbeelden van gebruik.

## Functies {#functions}

### Kleur en kopjes tonen {#color-and-header-printing}

- **print_cyan()**: deze functie toont tekst in cyaan, voor een betere
  leesbaarheid.

```bash
print_cyan() {
  echo -e "\e[36m$1\e[0m"
}
```

- **print_section_header()**: deze functie toont kopjes in cyaan om de delen van
  de uitvoer te scheiden.

```bash
print_section_header() {
  echo ""
  echo ""
  echo -e "$(print_cyan "=== $1 ===")"
}
```

### Uitgebreide informatie tonen {#verbose-information-display}

- **display_verbose_info()**: staat de uitgebreide modus aan, dan toont deze
  functie de GPG-sleutels in lange vorm.

```bash
display_verbose_info() {
  if [ "$verbose" == "true" ]; then
    print_section_header "GPG Key:"
    gpg --list-keys --keyid-format LONG
  fi
}
```

### Logging

- **log_message()**: deze functie schrijft meldingen met een tijdstempel naar
  een opgegeven logbestand, zodat alle acties en fouten worden vastgelegd.

```bash
log_message() {
  local timestamp
  timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  local message="$1"

  echo "${timestamp} - ${message}" | tee -a "$log_file" >&2
}
```

### Gebruiksinstructies {#usage-instructions}

- **display_usage()**: deze functie toont de gebruiksinstructies en sluit het
  script af. Ze wordt aangeroepen als je verkeerde opties op de opdrachtregel
  opgeeft.

```bash
display_usage() {
  echo "Usage: $0 [-v] [-d /path/to/gpg_directory]"
  echo "Options:"
  echo "  -v, --verbose    Enable verbose mode"
  echo "  -d, --directory  Specify the path to the GPG directory (default is \$HOME/.gnupg)"
  exit 1
}
```

### Controle van de software {#software-check}

- **check_required_software()**: deze functie controleert of GPG is
  geïnstalleerd. Zo niet, dan logt ze een fout en sluit ze het script af.

```bash
check_required_software() {
  if ! command -v "gpg" >/dev/null 2>&1; then
    log_message "Error: GPG is not installed. Please install GPG before running this script."
    exit 1
  else
    log_message "GPG is installed."
  fi
}
```

### Het sleutelpaar maken {#key-pair-generation}

- **generate_key_pair()**: deze functie maakt een nieuw GPG-sleutelpaar met
  `gpg --full-generate-key`. Ze logt het commando en toont een kopje.

```bash
generate_key_pair() {
  log_message "Generating new GPG key pair..."
  print_section_header "Generating new GPG key pair"
  log_message "Executing command: gpg --full-generate-key"
  gpg --full-generate-key
}
```

### Controleren of er al sleutels zijn {#key-file-existence-check}

- **check_key_file_existence()**: deze functie controleert of er al een
  GPG-sleutelpaar in de opgegeven map staat. Zo ja, dan logt ze een melding en
  stopt ze, zodat bestaande sleutels niet worden overschreven.

```bash
check_key_file_existence() {
  if [ -f "$gpg_dir/pubring.kbx" ]; then
    log_message "The GPG key pair already exists."
    log_message "=== end of the log ==="
    echo "$(print_cyan "Error:") The GPG key pair already exists."
    exit 1
  fi
}
```

### Opties op de opdrachtregel verwerken {#command-line-options-parsing}

- **parse_command_line_options()**: deze functie verwerkt de opties op de
  opdrachtregel (`-v` voor de uitgebreide modus en `-d` voor de GPG-map) en zet
  de bijbehorende variabelen.

```bash
parse_command_line_options() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    -v | --verbose)
      verbose=true
      shift
      ;;
    -d | --directory)
      shift
      gpg_dir="$1"
      shift
      ;;
    *)
      display_usage
      ;;
    esac
  done
}
```

## Signalen opvangen {#signal-trapping}

- **trap_handler**: deze functie vangt onderbrekingssignalen op (zoals `SIGINT`
  en `SIGTERM`), zodat het script netjes met onderbrekingen omgaat.

```bash
trap trap_handler SIGINT SIGTERM
```

## Uitvoering van het hoofdprogramma {#main-program-execution}

1. **Standaardwaarden**: zet de standaardwaarden voor de GPG-map en het
   logbestand.

```bash
gpg_dir="$HOME/.gnupg"
log_file="$gpg_dir/gpg_keygen_script.log"
```

2. **Logging starten**: begint de log, met een scheidingslijn als begin.

```bash
echo "" >>"$log_file" # Add an empty line after the marker for separation
log_message "=== beginning of the log ==="
log_message "Script execution started"
```

3. **Benodigde software controleren**: zorgt dat GPG is geïnstalleerd.

```bash
check_required_software
```

4. **Opties instellen**: stelt de opties in; de uitgebreide modus staat
   standaard uit.

```bash
verbose=false
```

5. **Opties op de opdrachtregel verwerken**: verwerkt de opgegeven opties.

```bash
parse_command_line_options "$@"
```

6. **Map en logbestand controleren**: controleert of de GPG-map en het
   logbestand bestaan en maakt ze als dat niet zo is.

```bash
if [ ! -d "$gpg_dir" ]; then
  mkdir -p "$gpg_dir" && log_message "Created directory: $gpg_dir"
fi

if [ ! -f "$log_file" ]; then
  touch "$log_file" && log_message "Created log file: $log_file"
fi
```

7. **Controleren of er al sleutels zijn**: zorgt dat er geen bestaand
   GPG-sleutelpaar wordt overschreven.

```bash
check_key_file_existence
```

8. **Sleutelpaar maken**: maakt het GPG-sleutelpaar.

```bash
generate_key_pair
```

9. **Uitgebreide informatie tonen**: staat de uitgebreide modus aan, dan toont
   het de gemaakte sleutels.

```bash
display_verbose_info
```

10. **Logging afronden**: markeert het einde van de log, als teken dat het
    script klaar is.

```bash
log_message "Script execution completed."
log_message "=== end of the log ==="
```

## Conclusie {#conclusion}

Het script `gpg_keygen_script.sh` is een uitgebreid hulpmiddel om
GPG-sleutelparen te maken. Het zorgt dat de benodigde software is geïnstalleerd,
gaat netjes om met invoer, toont uitgebreide uitvoer als dat nodig is, logt alle
acties en overschrijft geen bestaande sleutels. Zo is het een degelijke
oplossing om veilige communicatie op te zetten.

[gpg_keygen_script.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/gpg_keygen_script.sh
