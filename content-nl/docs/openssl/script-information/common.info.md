---
title: "common.info"
description:
  "De gedeelde functies van de OpenSSL-scripts: meldingen, de basismap,
  controles van invoer, wachtwoordzinnen, de vergrendeling en het archief."
url: "openssl/script-info/common"
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
  - OpenSSL
  - Bash
  - Shell Script
  - Library
keywords:
  - OpenSSL script
  - Bash library
  - Shared functions
  - Shell scripting

weight: 9108

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `common.sh` bekijken. Gedeelde functies voor de scripts in
deze repository. Dit bestand is geen programma: de andere scripts laden het met
"source". Het bevat de functies die elk script nodig heeft, zoals de meldingen,
de basismap met de terugval naar de oude naam `~/ssl`, de controle van een FQDN,
en de functies voor wachtwoordzinnen en het archief van de scripts voor
certificaatautoriteiten.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `common.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 1.0.0
- **Beschrijving**: gedeelde functies voor de scripts in deze repository.
- **RAW-script**: [common.sh]

## Gebruik {#usage}

```bash
source "<path to scripts>/lib/common.sh"
```

## Opmerkingen {#notes}

- Het bestand zet geen shellopties en voert geen commando uit bij het laden. Het
  zet alleen de statusvariabelen van `allow_second_entry`.
- De certificaten zijn voor een homelab en om te testen.

## Uitgebreide uitleg {#detailed-explanation}

De secties hieronder volgen het script van boven naar beneden.

### Functie: tekst in cyaan tonen {#function-print-text-in-cyan-color}

```bash
# Function to print text in cyan color
print_cyan() {
  echo -e "\e[36m$1\e[0m"
}
```

### Functie: een foutmelding tonen {#function-print-an-error-message}

```bash
# Function to print an error message
print_error() {
  echo "[ERROR] $1" >&2
}
```

### Functie: een waarschuwing tonen {#function-print-a-warning-message}

```bash
# Function to print a warning message
print_warning() {
  echo -e "\e[33m[WARNING] $1\e[0m" >&2
}
```

### Functie: sectiekoppen tonen {#function-print-section-headers}

```bash
# Function to print section headers
print_section_header() {
  echo
  print_cyan "=== $1 ==="
}
```

### Functie: het gebruik van het aanroepende script tonen {#function-show-the-usage-of-the-calling-script}

Functie die het gebruik van het aanroepende script toont. Ze toont de kopregels
vanaf "# Usage:" tot de eerste regel die past bij het patroon in `$1` (standaard
de eerste lege regel). Die laatste regel wordt niet getoond.

```bash
# Function to show the usage of the calling script. It prints the header lines
# from "# Usage:" up to the first line that matches the pattern in $1 (the
# default is the first empty line). That last line is not printed.
show_usage() {
  local until="${1:-^\$}"
  sed -n "/^# Usage:/,/${until}/p" "$0" | sed '$d' | sed 's/^# \{0,1\}//'
}
```

### Functie: stoppen als OpenSSL niet is geïnstalleerd {#function-stop-when-openssl-is-not-installed}

```bash
# Function to stop when OpenSSL is not installed
require_openssl() {
  if ! command -v openssl >/dev/null 2>&1; then
    print_error "OpenSSL is not installed. Install it before you run this script."
    exit "${1:-1}"
  fi
}
```

### Functie: `base_dir` instellen {#function-set-base_dir}

Functie die `base_dir` instelt. De oude naam `~/ssl` wordt gebruikt zolang
`~/tls` niet bestaat.

```bash
# Function to set base_dir. The old name ~/ssl is used while ~/tls does not
# exist.
set_base_dir() {
  base_dir="$HOME/tls"
  if [[ ! -e "$base_dir" && -d "$HOME/ssl" ]]; then
    base_dir="$HOME/ssl"
    echo "Warning: using the old directory $HOME/ssl. Run tls_directory_migrate.sh to move it to $HOME/tls." >&2
  fi
}
```

### Functie: naar `$HOME` gaan {#function-change-to-home}

Functie die naar `$HOME` gaat. Configuratiebestanden die vóór versie 0.2.0 naar
`~/tls/openssl.cnf` zijn gekopieerd, bevatten "HOME `=` .", dus hun paden hangen
af van de huidige map. De huidige bestanden gebruiken `$ENV::HOME` en hebben dit
niet nodig.

```bash
# Function to change to $HOME. Configuration files that were copied to
# ~/tls/openssl.cnf before version 0.2.0 contain "HOME = .", so their paths
# depend on the current directory. The current files use $ENV::HOME and do not
# need this.
enter_home() {
  cd "$HOME" || {
    print_error "Cannot change to $HOME."
    exit "${1:-1}"
  }
}
```

### Functie: controleren of een waarde een bruikbare FQDN is {#function-check-that-a-value-is-a-usable-fqdn}

Functie die controleert of een waarde een bruikbare FQDN is: labels van letters,
cijfers en koppeltekens, gescheiden door punten, met een optioneel wildcardlabel
aan het begin (`*.example.test`). De Common Name is maximaal 64 tekens.

```bash
# Function to check that a value is a usable FQDN: labels of letters, digits,
# and hyphens, separated by dots, with an optional wildcard label at the start
# (*.example.test). The Common Name has a maximum of 64 characters.
is_valid_fqdn() {
  local label='[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?'
  [[ -n "$1" && "${#1}" -le 64 && "$1" =~ ^(\*\.)?${label}(\.${label})*$ ]]
}
```

### Functie: het pad van de database tonen {#function-print-the-path-of-the-database}

Functie die het pad van de database (`index.txt`) toont dat een
configuratiebestand in de regel "database" geeft. Elke autoriteit heeft een
eigen database, en een configuratiebestand van een oudere versie kan nog de
gedeelde database noemen, daarom lezen de scripts het pad uit het bestand.
`$ENV::HOME` en `$HOME` worden de thuismap.

```bash
# Function to print the path of the database (index.txt) that a configuration
# file names in its "database" line. Every authority has its own database, and
# a configuration file from an older version can still name the shared one, so
# the scripts read the path from the file. $ENV::HOME and $HOME become the
# home directory.
config_database() {
  local value
  value=$(sed -n -E 's/^[[:space:]]*database[[:space:]]*=[[:space:]]*([^#[:space:]]+).*/\1/p' "$1" 2>/dev/null | head -n 1)
  [[ -n "$value" ]] || return 1
  value="${value//\$ENV::HOME/$HOME}"
  value="${value//\$HOME/$HOME}"
  printf '%s\n' "$value"
}
```

### Functie: controleren of `unique_subject` "yes" is in `index.txt.attr` {#function-check-if-unique_subject-is-yes-in-indextxtattr}

```bash
# Function to check if unique_subject is "yes" in index.txt.attr
unique_subject_enabled() {
  grep -Eq '^unique_subject[[:space:]]*=[[:space:]]*yes' "$1" 2>/dev/null
}
```

### Functie: om bevestiging vragen {#function-ask-for-confirmation}

Functie die om bevestiging vraagt. Alleen het antwoord "yes" gaat verder.

```bash
# Function to ask for confirmation. Only the answer "yes" continues.
confirm() {
  local answer
  read -r -p "Do you want to continue? (yes/no): " answer
  [[ "$answer" == "yes" ]]
}
```

### Functie: controleren of een privésleutel is versleuteld met een wachtwoordzin {#function-check-if-a-private-key-file-is-encrypted-with-a-passphrase}

```bash
# Function to check if a private key file is encrypted with a passphrase
key_is_encrypted() {
  grep -q 'ENCRYPTED' "$1" 2>/dev/null
}
```

### Functie: een wachtwoordzin ophalen {#function-get-a-passphrase}

Functie die een wachtwoordzin ophaalt. Het resultaat komt in de variabele met de
naam in `$1`. De omgevingsvariabele met de naam in `$2` wordt gebruikt als die
is ingesteld, zodat de scripts zonder vragen kunnen draaien. Anders wordt om de
wachtwoordzin gevraagd, en nog een tweede keer als `$4` "new" is.

```bash
# Function to get a passphrase. The result is stored in the variable named by
# $1. The environment variable named by $2 is used when it is set, so the
# scripts can run without questions. Otherwise the passphrase is asked for,
# and asked a second time when $4 is "new".
get_passphrase() {
  local target="$1" env_name="$2" label="$3" mode="${4:-existing}" first second
  if [[ -n "${!env_name:-}" ]]; then
    printf -v "$target" '%s' "${!env_name}"
    return 0
  fi
  if [[ ! -t 0 ]]; then
    print_error "The passphrase of the $label is needed. Set $env_name, or run the script in a terminal."
    return 1
  fi
  read -r -s -p "Enter the passphrase of the $label: " first
  echo >&2
  if [[ "$mode" == "new" ]]; then
    if [[ "${#first}" -lt 8 ]]; then
      print_error "Use a passphrase of 8 characters or more."
      return 1
    fi
    read -r -s -p "Enter the passphrase again: " second
    echo >&2
    if [[ "$first" != "$second" ]]; then
      print_error "The passphrases are not the same."
      return 1
    fi
  fi
  printf -v "$target" '%s' "$first"
}
```

### Functie: bestaande bestanden kopiëren naar een map met datum onder `$base_dir/archive/<label>/` voordat ze worden vervangen {#function-copy-existing-files-to-a-dated-folder-under-base_dirarchivelabel-before-they-are-replaced}

Functie die bestaande bestanden kopieert naar een map met datum onder
`$base_dir/archive/<label>/` voordat ze worden vervangen. Bestanden die niet
bestaan, worden overgeslagen. Bestaat er geen enkel bestand, dan wordt er niets
gemaakt.

```bash
# Function to copy existing files to a dated folder under
# $base_dir/archive/<label>/ before they are replaced. Files that do not exist
# are skipped. Nothing is created when no file exists.
archive_files() {
  local label="$1" stamp dir n=0 file found=false
  shift
  for file in "$@"; do
    [[ -f "$file" ]] && found=true
  done
  [[ "$found" == "true" ]] || return 0

  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  (umask 077 && mkdir -p "$base_dir/archive/$label") || return 1
  dir="$base_dir/archive/$label/$stamp"
  until (umask 077 && mkdir "$dir") 2>/dev/null; do
    n=$((n + 1))
    [[ "$n" -lt 100 ]] || return 1
    dir="$base_dir/archive/$label/$stamp-$n"
  done
  for file in "$@"; do
    [[ -f "$file" ]] || continue
    (umask 077 && mkdir -p "$dir/$(dirname "${file#"$base_dir"/}")" &&
      cp -p "$file" "$dir/${file#"$base_dir"/}") || return 1
  done
  echo "Archive: $dir"
}
```

### Functie: een IPv4-adres omzetten naar een getal {#function-convert-an-ipv4-address-to-a-number}

Functie die een IPv4-adres omzet naar een getal. Geeft 1 terug als de waarde
geen vier decimale octetten zonder voorloopnullen is, elk tussen 0 en 255.

```bash
# Function to convert an IPv4 address to a number. Returns 1 when the value is
# not four decimal octets without leading zeros, each between 0 and 255.
ipv4_to_number() {
  local octet octets number=0
  [[ "$1" =~ ^(0|[1-9][0-9]{0,2})(\.(0|[1-9][0-9]{0,2})){3}$ ]] || return 1
  IFS='.' read -r -a octets <<<"$1"
  for octet in "${octets[@]}"; do
    ((octet <= 255)) || return 1
    number=$((number * 256 + octet))
  done
  printf '%s\n' "$number"
}
```

### Functie: een getal omzetten naar een IPv4-adres {#function-convert-a-number-to-an-ipv4-address}

```bash
# Function to convert a number to an IPv4 address
number_to_ipv4() {
  printf '%d.%d.%d.%d\n' "$((($1 >> 24) & 255))" "$((($1 >> 16) & 255))" "$((($1 >> 8) & 255))" "$(($1 & 255))"
}
```

### Functie: een lijst van toegestane namen omzetten naar de waarde van de OpenSSL-extensie nameConstraints {#function-turn-a-list-of-permitted-names-into-the-value-of-the-openssl-nameconstraints-extension}

Functie die een lijst van toegestane namen omzet naar de waarde van de
OpenSSL-extensie nameConstraints. De lijst wordt gescheiden door komma's. Elk
item is `DNS:<domain>` (het domein en de subdomeinen) of
`IP:<IPv4 network>/<prefix>` (bijvoorbeeld `IP:192.168.0.0/16`). Spaties worden
genegeerd. Geeft 1 terug bij ongeldige invoer.

```bash
# Function to turn a list of permitted names into the value of the OpenSSL
# nameConstraints extension. The list is separated by commas. Each item is
# DNS:<domain> (the domain and its subdomains) or IP:<IPv4 network>/<prefix>
# (for example IP:192.168.0.0/16). Spaces are ignored. Returns 1 for invalid
# input.
build_name_constraints() {
  local list="${1// /}" item items value prefix number mask result="critical"
  if [[ -z "$list" || "$list" == ,* || "$list" == *, || "$list" == *,,* ]]; then
    return 1
  fi
  IFS=',' read -r -a items <<<"$list"
  for item in "${items[@]}"; do
    case "$item" in
    DNS:*)
      value="${item#DNS:}"
      [[ "$value" != \** ]] || return 1
      is_valid_fqdn "$value" || return 1
      result+=", permitted;DNS:$value"
      ;;
    IP:*/*)
      value="${item#IP:}"
      prefix="${value#*/}"
      [[ "$prefix" =~ ^(0|[1-9][0-9]?)$ ]] || return 1
      ((prefix <= 32)) || return 1
      number=$(ipv4_to_number "${value%/*}") || return 1
      mask=$(((0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF))
      result+=", permitted;IP:$(number_to_ipv4 "$((number & mask))")/$(number_to_ipv4 "$mask")"
      ;;
    *) return 1 ;;
    esac
  done
  printf '%s\n' "$result"
}
```

### Functie: een kopie van een configuratiebestand schrijven met één extra regel in een extensiesectie {#function-write-a-copy-of-a-configuration-file-with-one-extra-line-in-an-extension-section}

Functie die een kopie van een configuratiebestand schrijft met één extra regel
in een extensiesectie. Geeft 1 terug als de sectie niet bestaat.

Gebruik: `config_with_extension <configuration file> <section> <line> <output>`

```bash
# Function to write a copy of a configuration file with one extra line in an
# extension section. Returns 1 when the section does not exist.
# Usage: config_with_extension <configuration file> <section> <line> <output>
config_with_extension() {
  awk -v section="$2" -v line="$3" '
    { print }
    $0 ~ "^\\[[[:space:]]*" section "[[:space:]]*\\]" { print line; found = 1 }
    END { exit !found }' "$1" >"$4"
}
```

### Functie: de toegestane namen van de extensie nameConstraints van een certificaat tonen {#function-print-the-permitted-names-of-the-nameconstraints-extension-of-a-certificate}

Functie die de toegestane namen van de extensie nameConstraints van een
certificaat toont, één per regel (`DNS:<domain>` of `IP:<network>/<netmask>`).
Ze toont niets als het certificaat zo'n extensie niet heeft.

```bash
# Function to print the permitted names of the nameConstraints extension of a
# certificate, one per line (DNS:<domain> or IP:<network>/<netmask>). It prints
# nothing when the certificate has no such extension.
permitted_names() {
  openssl x509 -in "$1" -noout -ext nameConstraints 2>/dev/null | awk '
    /Permitted:/ { permitted = 1; next }
    /Excluded:/ { permitted = 0 }
    permitted { gsub(/^[[:space:]]+|[[:space:]]+$/, ""); if ($0 != "") print }' || true
}
```

### Functie: een naam controleren tegen de toegestane namen van een certificaat {#function-check-a-name-against-the-permitted-names-of-a-certificate}

Functie die een naam controleert tegen de toegestane namen van een certificaat.
Een naamtype (DNS of IP) zonder toegestaan item wordt niet beperkt.

Gebruik: `name_is_permitted <DNS:name or IP:address> <certificate>`

```bash
# Function to check a name against the permitted names of a certificate. A
# name type (DNS or IP) without a permitted entry is not limited.
# Usage: name_is_permitted <DNS:name or IP:address> <certificate>
name_is_permitted() {
  local type="${1%%:*}" value="${1#*:}" entry constraint limited=false address network mask
  while IFS= read -r entry; do
    [[ "$entry" == "$type":* ]] || continue
    limited=true
    constraint="${entry#*:}"
    if [[ "$type" == "DNS" ]]; then
      if [[ "${value,,}" == "${constraint,,}" || "${value,,}" == *".${constraint#.}" ]]; then
        return 0
      fi
    else
      address=$(ipv4_to_number "$value") || continue
      network=$(ipv4_to_number "${constraint%/*}") || continue
      mask=$(ipv4_to_number "${constraint#*/}") || continue
      if (((address & mask) == network)); then
        return 0
      fi
    fi
  done < <(permitted_names "$2")
  [[ "$limited" == "false" ]]
}
```

### Functie: de vergrendeling van de TLS-map nemen {#function-take-the-lock-of-the-tls-folder}

Functie die de vergrendeling van de TLS-map neemt, zodat twee scripts niet
tegelijk een database wijzigen. Een script dat de vergrendeling al heeft, start
een ander script met `TLS_LOCK_HELD=1`, en dat script slaat deze stap dan over.

Gebruik:
`acquire_lock <exit code> <seconds to wait, 0 for none> <error message>`

```bash
# Function to take the lock of the TLS folder, so two scripts do not change a
# database at the same time. A script that already holds the lock starts
# another script with TLS_LOCK_HELD=1, and that script then skips this step.
# Usage: acquire_lock <exit code> <seconds to wait, 0 for none> <error message>
acquire_lock() {
  local code="${1:-1}" wait="${2:-0}" message="${3:-Another certificate script is running.}"
  [[ "${TLS_LOCK_HELD:-}" != "1" ]] || return 0
  if ! command -v flock >/dev/null 2>&1; then
    print_warning "flock is not installed, so overlapping runs are not prevented."
    return 0
  fi
  exec 9>"$base_dir/.renew.lock"
  if [[ "$wait" -gt 0 ]]; then
    flock -w "$wait" 9 && return 0
  else
    flock -n 9 && return 0
  fi
  print_error "$message"
  exit "$code"
}
```

### Functie: nieuwe bestanden op hun plek zetten {#function-put-new-files-in-place}

Functie die nieuwe bestanden op hun plek zet. Elk bestand wordt eerst naast zijn
doel gekopieerd, met de rechten van de bron. Pas als alle kopieën zijn gelukt,
worden ze hernoemd, en tijdens die stap wordt een onderbreking genegeerd. Zo
laat een mislukte kopie, een volle schijf of Ctrl+C nooit een mengsel van oude
en nieuwe bestanden achter. Geeft 1 terug als een kopie mislukte (er is niets
gewijzigd), en 2 als een hernoeming mislukte (de bestanden zijn deels
vervangen).

Gebruik: `install_files <source> <target> [<source> <target>]...`

```bash
# Function to put new files in place. Every file is first copied next to its
# target, with the mode of the source. Only when all copies succeeded they are
# renamed, and an interrupt is ignored during that step. So a failed copy, a
# full disk, or Ctrl+C never leaves a mix of old and new files.
# Returns 1 when a copy failed (nothing was changed), and 2 when a rename
# failed (the files are partly replaced).
# Usage: install_files <source> <target> [<source> <target>]...
install_files() {
  local -a staged=() targets=()
  local source target i status=0 saved_traps
  while [[ $# -gt 1 ]]; do
    source="$1"
    target="$2"
    shift 2
    if ! cp -pf "$source" "$target.new.$$"; then
      rm -f "$target.new.$$" ${staged[@]+"${staged[@]}"}
      print_error "Cannot write $target. The existing files were not changed."
      return 1
    fi
    staged+=("$target.new.$$")
    targets+=("$target")
  done
  saved_traps=$(trap -p INT TERM)
  trap '' INT TERM
  for i in "${!staged[@]}"; do
    if ! mv -f "${staged[$i]}" "${targets[$i]}"; then
      print_error "Cannot replace ${targets[$i]}. The new file is ${staged[$i]}."
      status=2
    fi
  done
  trap - INT TERM
  eval "$saved_traps"
  return "$status"
}
```

### Functie: controleren dat geen onderwerp meer dan één geldig item heeft in een database (`index.txt`) {#function-check-that-no-subject-has-more-than-one-valid-entry-in-a-database-indextxt}

Functie die controleert dat geen onderwerp meer dan één geldig item heeft in een
database (`index.txt`). OpenSSL kan een database met zulke items niet laden
zolang `unique_subject` "yes" is.

```bash
# Function to check that no subject has more than one valid entry in a
# database (index.txt). OpenSSL cannot load a database with such entries while
# unique_subject is "yes".
database_is_unique() {
  [[ -z "$(awk -F'\t' '$1 == "V" { if (seen[$NF]++) print $NF }' "$1")" ]]
}
```

### Functie: controleren of het certificaat in `$3` een item heeft met de status in `$1` {#function-check-if-the-certificate-in-3-has-an-entry-with-the-status-in-1}

Functie die controleert of het certificaat in `$3` een item heeft met de status
in `$1` (V voor geldig, R voor ingetrokken) in de database in `$2`.

```bash
# Function to check if the certificate in $3 has an entry with the status in $1
# (V for valid, R for revoked) in the database in $2
entry_has_status() {
  local serial
  [[ -f "$2" ]] || return 1
  serial=$(openssl x509 -in "$3" -noout -serial 2>/dev/null) || return 1
  awk -F'\t' -v s="${serial#serial=}" -v want="$1" '
    function norm(x) { x = toupper(x); sub(/^0+/, "", x); return x }
    $1 == want && norm($4) == norm(s) { found = 1 }
    END { exit !found }' "$2"
}
```

### Functie: controleren of het certificaat in `$2` een geldig item heeft in de database in `$1` {#function-check-if-the-certificate-in-2-has-a-valid-entry-in-the-database-in-1}

```bash
# Function to check if the certificate in $2 has a valid entry in the database
# in $1
entry_is_valid() {
  entry_has_status V "$1" "$2"
}
```

### Functie: controleren of het certificaat in `$2` is ingetrokken in de database in `$1` {#function-check-if-the-certificate-in-2-is-revoked-in-the-database-in-1}

```bash
# Function to check if the certificate in $2 is revoked in the database in $1
entry_is_revoked() {
  entry_has_status R "$1" "$2"
}
```

### Status van `allow_second_entry` {#state-of-allow_second_entry}

```bash
# State of allow_second_entry
second_entry_attr=""
second_entry_original=""
second_entry_existed=false
```

### Functie: `unique_subject` op "no" zetten in het attribuutbestand van een database {#function-set-unique_subject-to-no-in-the-attribute-file-of-a-database}

Functie die `unique_subject` op "no" zet in het attribuutbestand van een
database (`index.txt.attr`), zodat een autoriteit opnieuw kan worden uitgegeven
terwijl het oude item nog geldig is. `restore_second_entry` zet het bestand
terug.

```bash
# Function to set unique_subject to "no" in the attribute file of a database
# (index.txt.attr), so an authority can be issued again while its old entry is
# still valid. restore_second_entry puts the file back.
allow_second_entry() {
  second_entry_attr="$1"
  second_entry_existed=false
  if [[ -f "$1" ]]; then
    second_entry_existed=true
    second_entry_original=$(cat "$1")
  fi
  echo "unique_subject = no" >"$1"
}
```

### Functie: het attribuutbestand terugzetten dat `allow_second_entry` heeft gewijzigd {#function-restore-the-attribute-file-that-allow_second_entry-changed}

Functie die het attribuutbestand terugzet dat `allow_second_entry` heeft
gewijzigd. Het bestand blijft op "no" zolang de database twee geldige items met
dezelfde naam heeft, omdat OpenSSL zo'n database met "yes" niet kan laden.

```bash
# Function to restore the attribute file that allow_second_entry changed. The
# file stays at "no" while the database holds two valid entries with the same
# name, because OpenSSL cannot load such a database with "yes".
restore_second_entry() {
  [[ -n "$second_entry_attr" ]] || return 0
  if ! database_is_unique "${second_entry_attr%.attr}"; then
    print_warning "${second_entry_attr%.attr} has valid entries with the same name. unique_subject stays 'no' in $second_entry_attr. Revoke the extra entry and set it back to 'yes'."
  elif [[ "$second_entry_existed" == "true" ]]; then
    printf '%s\n' "$second_entry_original" >"$second_entry_attr"
  else
    rm -f "$second_entry_attr"
  fi
  second_entry_attr=""
}
```

## Conclusie {#conclusion}

Gedeelde functies voor de scripts in deze repository.

[common.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/lib/common.sh
