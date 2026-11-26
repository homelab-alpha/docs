---
title: "tls_certificate_status.info"
description:
  "Toon de vervaldatum en het aantal resterende dagen van alle certificaten in
  de TLS-map, met afsluitcodes voor gebruik in cron of een systemd-timer."
url: "openssl/script-info/tls-certificate-status"
aliases:
  - "openssl/script-info/ssl-certificate-status"
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
  - certificate expiry
  - monitoring
  - OpenSSL scripts
  - certificate management
  - exit codes
keywords:
  - certificate expiry check
  - OpenSSL monitoring
  - days left
  - cron certificate check
  - systemd timer

weight: 9112

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `tls_certificate_status.sh` bekijken. Dit script toont de
vervalstatus van alle certificaten in `$HOME/tls/certs`: de vertrouwde
identiteit, de root-CA, de tussenliggende CA en alle server- en
clientcertificaten. Per certificaat toont het de Common Name (CN), het soort
(root, tussenliggend, server of client), de vervaldatum en het aantal resterende
dagen. De lijst is gesorteerd op resterende dagen.

Het script leest alleen. Het wijzigt nooit een bestand. Het is geschikt voor
cron of een systemd-timer, omdat het het resultaat in zijn afsluitcode
teruggeeft.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `tls_certificate_status.sh`
- **Oude naam**: `ssl_certificate_status.sh` (een wrapper die dit script start)
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 1.3.0
- **Beschrijving**: dit script toont de vervalstatus van alle certificaten in
  `$HOME/tls/certs`: de vertrouwde identiteit, de root-CA, de tussenliggende CA
  en alle server- en clientcertificaten.
- **RAW-script**: [tls_certificate_status.sh]

## Gebruik {#usage}

```bash
./tls_certificate_status.sh [--warn-days N] [--ca-warn-days N] [--quiet] [-h|--help]
```

| Optie            | Betekenis                                                                                 |
| :--------------- | :---------------------------------------------------------------------------------------- |
| `--warn-days`    | N Waarschuw als een server- of clientcertificaat binnen N dagen verloopt (standaard: 30). |
| `--ca-warn-days` | N Waarschuw als een CA-certificaat binnen N dagen verloopt (standaard: 180).              |
| `--quiet`        | Toon alleen de certificaten die aandacht nodig hebben. Toon niets als alles geldig is.    |
| `-h`, `--help`   | Toon deze hulp.                                                                           |

De alias is `openssl-status`.

## Afsluitcodes {#exit-codes}

| Afsluitcode | Betekenis                                                                                                                              |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `0`         | Elk certificaat is langer geldig dan zijn drempel.                                                                                     |
| `1`         | Minstens één certificaat verloopt binnen zijn drempel.                                                                                 |
| `2`         | Minstens één certificaat is verlopen.                                                                                                  |
| `3`         | Er is een fout opgetreden (bijvoorbeeld een onleesbaar certificaat of een ontbrekende map). Een fout gaat voor op afsluitcodes 2 en 1. |

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- Een certificaat dat in de database van zijn autoriteit is ingetrokken (status
  R), wordt getoond met de status REVOKED. Het telt niet mee voor de
  afsluitcode. Dit geldt ook voor de root-CA en de tussenliggende CA.
- De `.crt`-kopieën en de keten- en HAProxy-bundels worden overgeslagen, omdat
  ze dezelfde certificaten bevatten als de `.pem`-bestanden.
- Datums worden in Bash berekend uit de notAfter-waarde van OpenSSL, zodat het
  script niet afhangt van het date-commando van een bepaald systeem.

## Uitgebreide uitleg {#detailed-explanation}

De onderstaande secties volgen het script van boven naar beneden. Functies die
hier niet zijn gedefinieerd, zoals `print_error`, komen uit
`scripts/lib/common.sh`.

### Standaardwaarden {#defaults}

```bash
# Defaults
warn_days=30
ca_warn_days=180
quiet=false
```

### De mappaden bepalen; het script stoppen bij een fout {#define-directory-paths-stop-script-on-error}

De mappaden bepalen; het script stoppen bij een fout. De functies hieronder
geven bewust een status terug, en de aanroepers bepalen wat een fout betekent.

```bash
# Define directory paths
# Stop script on error. The functions below return a status on purpose, and
# the callers decide what a failure means.
set -Eeuo pipefail
```

### De gedeelde functies laden {#load-the-shared-functions}

De gedeelde functies, zoals de meldingen en de controles, staan in
`scripts/lib/common.sh`.

```bash
# shellcheck source=scripts/lib/common.sh
source "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/lib/common.sh" || exit 3
set_base_dir
certs_dir="$base_dir/certs"
certs_root_dir="$certs_dir/root"
certs_intermediate_dir="$certs_dir/intermediate"
certs_certificates_dir="$certs_dir/certificates"
index_file="$base_dir/db/index.txt"
```

### Functie: de helptekst tonen {#function-show-the-help-text}

```bash
# Function to show the help text
show_help() {
  sed -n '/^# Usage:/,/^# Notes:/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
}
```

### Functie: controleren of een waarde een positief geheel getal is {#function-check-that-a-value-is-a-positive-integer}

```bash
# Function to check that a value is a positive integer
is_number() {
  [[ "$1" =~ ^[0-9]+$ ]]
}
```

### Functie: argumenten verwerken {#function-parse-arguments}

```bash
# Function to parse arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --warn-days)
      is_number "${2:-}" || {
        print_error "--warn-days needs a number of days."
        exit 3
      }
      warn_days="$2"
      shift 2
      ;;
    --ca-warn-days)
      is_number "${2:-}" || {
        print_error "--ca-warn-days needs a number of days."
        exit 3
      }
      ca_warn_days="$2"
      shift 2
      ;;
    --quiet)
      quiet=true
      shift
      ;;
    -h | --help)
      show_help
      exit 0
      ;;
    *)
      print_error "Unknown option: $1"
      exit 3
      ;;
    esac
  done
}
```

### Functie: een kalenderdatum omrekenen naar dagen sinds 1970-01-01 {#function-convert-a-calendar-date-to-days-since-1970-01-01}

```bash
# Function to convert a calendar date to days since 1970-01-01
days_from_civil() {
  local y=$1 m=$2 d=$3 era yoe doy doe
  ((m <= 2)) && ((y--))
  era=$((y / 400))
  yoe=$((y - era * 400))
  doy=$(((153 * (m > 2 ? m - 3 : m + 9) + 2) / 5 + d - 1))
  doe=$((yoe * 365 + yoe / 4 - yoe / 100 + doy))
  echo $((era * 146097 + doe - 719468))
}
```

### Functie: de notAfter-waarde van OpenSSL omrekenen naar epoch-seconden {#function-convert-the-openssl-notafter-value-to-epoch-seconds}

```bash
# Function to convert the OpenSSL notAfter value to epoch seconds
notafter_to_epoch() {
  local mon day time year hh mm ss month
  read -r mon day time year _ <<<"$1"
  case "$mon" in
  Jan) month=1 ;;
  Feb) month=2 ;;
  Mar) month=3 ;;
  Apr) month=4 ;;
  May) month=5 ;;
  Jun) month=6 ;;
  Jul) month=7 ;;
  Aug) month=8 ;;
  Sep) month=9 ;;
  Oct) month=10 ;;
  Nov) month=11 ;;
  Dec) month=12 ;;
  *) return 1 ;;
  esac
  IFS=: read -r hh mm ss <<<"$time"
  echo $(($(days_from_civil "$year" "$month" "$((10#$day))") * 86400 + 10#$hh * 3600 + 10#$mm * 60 + 10#$ss))
}
```

### Functie: het soort van een certificaat bepalen {#function-determine-the-type-of-a-certificate}

```bash
# Function to determine the type of a certificate
get_type() {
  local file="$1" location="$2" eku
  case "$location" in
  root) echo "root" ;;
  intermediate) echo "intermediate" ;;
  *)
    eku=$(openssl x509 -in "$file" -noout -ext extendedKeyUsage 2>/dev/null)
    if [[ "$eku" == *"TLS Web Server Authentication"* ]]; then
      echo "server"
    elif [[ "$eku" == *"TLS Web Client Authentication"* ]]; then
      echo "client"
    else
      echo "unknown"
    fi
    ;;
  esac
}
```

### Functie: de Common Name van een certificaat ophalen {#function-get-the-common-name-of-a-certificate}

```bash
# Function to get the Common Name of a certificate
get_cn() {
  local subject
  subject=$(openssl x509 -in "$1" -noout -subject -nameopt RFC2253 2>/dev/null) || return 1
  subject="${subject#*CN=}"
  echo "${subject%%,*}"
}
```

### Functie: controleren of een certificaat is ingetrokken {#function-check-if-a-certificate-is-revoked}

Functie die controleert of een certificaat is ingetrokken (status R) in de
database van de autoriteit die het heeft ondertekend. De vertrouwde identiteit
ondertekent zichzelf en heeft geen item in een database.

```bash
# Function to check if a certificate is revoked (status R) in the database of
# the authority that signed it. The trusted identity signs itself and has no
# database entry.
is_revoked() {
  local file="$1" location="$2" config database
  case "$location" in
  leaf) config="$base_dir/openssl.cnf/cert.cnf" ;;
  intermediate) config="$base_dir/openssl.cnf/ca.cnf" ;;
  root)
    [[ "$(basename "$file")" = "root_ca.pem" ]] || return 1
    config="$base_dir/openssl.cnf/root_ca.cnf"
    ;;
  *) return 1 ;;
  esac
  # Without a readable configuration file, use the database of the certificates
  database=$(config_database "$config") || database="$index_file"
  entry_is_revoked "$database" "$file"
}
```

### Functie: één certificaat controleren en het resultaat bewaren {#function-check-one-certificate-and-store-the-result}

```bash
# Function to check one certificate and store the result
check_certificate() {
  local file="$1" location="$2"
  local cn type enddate epoch days threshold state

  cn=$(get_cn "$file") || {
    print_error "Cannot read certificate: $file"
    had_error=true
    return
  }
  [[ -n "$cn" ]] || cn=$(basename "$file" .pem)
  type=$(get_type "$file" "$location")
  enddate=$(openssl x509 -in "$file" -noout -enddate 2>/dev/null)
  enddate="${enddate#notAfter=}"
  epoch=$(notafter_to_epoch "$enddate") || {
    print_error "Cannot read the expiry date of: $file"
    had_error=true
    return
  }

  # Days left, rounded down. Negative when the certificate has expired.
  days=$(((epoch - now) / 86400))
  ((epoch < now)) && days=$((-(((now - epoch) + 86399) / 86400)))

  if [[ "$location" == "leaf" ]]; then
    threshold=$warn_days
  else
    threshold=$ca_warn_days
  fi

  # Use -checkend for the decision: it is the authoritative OpenSSL check.
  if is_revoked "$file" "$location"; then
    state="REVOKED"
  elif ! openssl x509 -in "$file" -noout -checkend 0 >/dev/null 2>&1; then
    state="EXPIRED"
    had_expired=true
  elif ! openssl x509 -in "$file" -noout -checkend "$((threshold * 86400))" >/dev/null 2>&1; then
    state="WARN"
    had_warning=true
  else
    state="OK"
  fi

  results+=("$(printf '%08d|%s|%s|%s|%s|%s' "$((days + 10000000))" "$days" "$cn" "$type" "$enddate" "$state")")
}
```

### Functie: een map doorzoeken op certificaten {#function-scan-a-directory-for-certificates}

```bash
# Function to scan a directory for certificates
scan_directory() {
  local dir="$1" location="$2" file name
  [[ -d "$dir" ]] || {
    print_error "Directory not found: $dir"
    had_error=true
    return
  }
  for file in "$dir"/*.pem; do
    [[ -f "$file" ]] || continue
    name=$(basename "$file")
    # Skip bundles and combined files, they hold copies of other certificates
    case "$name" in
    *_chain_bundle.pem | *_haproxy.pem | *_bundle.pem) continue ;;
    esac
    check_certificate "$file" "$location"
  done
}
```

### Functie: de resultaten tonen {#function-print-the-results}

```bash
# Function to print the results
print_results() {
  local days cn type enddate state color
  local reset="" green="" yellow="" red=""
  if [[ -t 1 ]]; then
    reset="\e[0m"
    green="\e[32m"
    yellow="\e[33m"
    red="\e[31m"
  fi

  [[ "${#results[@]}" -gt 0 ]] || return

  if [[ "$quiet" = false ]]; then
    printf '%-40s %-13s %-26s %6s  %s\n' "NAME (CN)" "TYPE" "EXPIRES" "DAYS" "STATUS"
  fi

  while IFS="|" read -r _ days cn type enddate state; do
    if [[ "$quiet" = true ]] && [[ "$state" = "OK" ]]; then
      continue
    fi
    case "$state" in
    OK) color="$green" ;;
    REVOKED) color="" ;;
    WARN) color="$yellow" ;;
    *) color="$red" ;;
    esac
    printf '%-40s %-13s %-26s %6s  %b%s%b\n' "$cn" "$type" "$enddate" "$days" "$color" "$state" "$reset"
  done < <(printf '%s\n' "${results[@]}" | sort -t'|' -k1,1)
}
```

### Hoofdproces {#main-process}

```bash
# Main process
had_error=false
had_warning=false
had_expired=false
results=()

parse_arguments "$@"

if ! command -v openssl >/dev/null 2>&1; then
  print_error "OpenSSL is not installed."
  exit 3
fi

if [[ ! -d "$certs_dir" ]]; then
  print_error "Certificate directory not found: $certs_dir"
  exit 3
fi

printf -v now '%(%s)T' -1

scan_directory "$certs_root_dir" "root"
scan_directory "$certs_intermediate_dir" "intermediate"
scan_directory "$certs_certificates_dir" "leaf"

print_results

if [[ "$quiet" = false ]]; then
  echo
  print_cyan "Thresholds: ${warn_days} days (server and client), ${ca_warn_days} days (CA)."
fi
```

### Afsluiten met het ernstigste resultaat {#exit-with-the-most-severe-result}

```bash
# Exit with the most severe result
if [[ "$had_error" = true ]]; then
  exit 3
elif [[ "$had_expired" = true ]]; then
  exit 2
elif [[ "$had_warning" = true ]]; then
  exit 1
fi
exit 0
```

## Conclusie {#conclusion}

Dit script toont de vervalstatus van alle certificaten in `$HOME/tls/certs`: de
vertrouwde identiteit, de root-CA, de tussenliggende CA en alle server- en
clientcertificaten.

[tls_certificate_status.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/tls_certificate_status.sh
