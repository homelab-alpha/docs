---
title: "revoke_tls_certificates.info"
description:
  "Trek een server- of clientcertificaat in en maak een lijst met ingetrokken
  certificaten (CRL), met een kopie van de database en een controle van de CRL."
url: "openssl/script-info/revoke-tls-certificates"
aliases:
  - "openssl/script-info/revoke-ssl-certificates"
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
  - certificate revocation
  - CRL
  - OpenSSL scripts
  - certificate management
  - exit codes
keywords:
  - revoke certificate
  - certificate revocation list
  - openssl ca revoke
  - openssl ca gencrl
  - homelab certificates

weight: 9110

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we het script `revoke_tls_certificates.sh` bekijken. Dit script trekt een
server- of clientcertificaat in en maakt een lijst met ingetrokken certificaten
(CRL). Het markeert het geldige item (status V) van de FQDN in
`$HOME/tls/db/index.txt` als ingetrokken (status R) met een reden, en maakt
daarna een nieuwe CRL in `$HOME/tls/crl/ca_crl.pem`, ondertekend door de
tussenliggende CA. Het script controleert de CRL met de CA-keten.

Met `--authority` trekt het script het certificaat van een autoriteit in, in de
database van de autoriteit die het heeft ondertekend, en maakt het de CRL van
die ondertekenaar:

```text
--authority ca       The intermediate CA. Database $HOME/tls/db/root_ca/,
                     CRL $HOME/tls/crl/root_crl.pem, signed by the root CA.
--authority root_ca  The root CA. Database $HOME/tls/db/trusted_id/, CRL
                     $HOME/tls/crl/trusted_id_crl.pem, signed by the trusted
                     identity.
```

De vertrouwde identiteit ondertekent zichzelf en kan niet worden ingetrokken:
verwijder haar in plaats daarvan uit de vertrouwde opslag.

Het script verwijdert geen enkel bestand. De sleutel, het certificaat en de
bundels van het ingetrokken certificaat blijven staan, dus stop er zelf mee ze
te gebruiken. Voordat de database wordt gewijzigd, wordt een kopie van
`index.txt` bewaard.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `revoke_tls_certificates.sh`
- **Oude naam**: `revoke_ssl_certificates.sh` (een wrapper die dit script start)
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 13 november 2026
- **Versie**: 1.3.0
- **Beschrijving**: dit script trekt een server- of clientcertificaat in en
  maakt een lijst met ingetrokken certificaten (CRL).
- **RAW-script**: [revoke_tls_certificates.sh]

## Gebruik {#usage}

```bash
./revoke_tls_certificates.sh [options] <fqdn>
./revoke_tls_certificates.sh [options] --authority <ca|root_ca>
./revoke_tls_certificates.sh [options] --crl-only [--authority <ca|root_ca>]
```

| Optie                | Betekenis                                                                                                                                     |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `<fqdn>`             | Trek het geldige certificaat met deze FQDN in.                                                                                                |
| `--authority <name>` | Trek de tussenliggende CA (ca) of de root-CA (`root_ca`) in. Met `--crl-only`: maak de CRL waarin die autoriteit staat, zonder intrekking.    |
| `--reason <reason>`  | De reden: unspecified (standaard), keyCompromise, affiliationChanged, superseded of cessationOfOperation. Met `--authority` ook caCompromise. |
| `--no-crl`           | Trek in, maar maak geen nieuwe CRL.                                                                                                           |
| `--crl-only`         | Maak alleen een nieuwe CRL. Er wordt niets ingetrokken en niets gevraagd. Gebruik dit om de CRL te vernieuwen voordat die verloopt.           |
| `--dry-run`          | Toon het plan en stop. Er wordt niets gevraagd of gewijzigd.                                                                                  |
| `--yes`              | Vraag niet om bevestiging (voor scripts).                                                                                                     |
| `-h`, `--help`       | Toon deze hulp.                                                                                                                               |

De alias is `openssl-revoke`.

Zonder `--yes` toont het script het plan en vraagt het om bevestiging. Is de
sleutel die ondertekent versleuteld, dan vraagt het script om de wachtwoordzin,
of leest het die uit `TLS_CA_PASSPHRASE` (tussenliggende CA),
`TLS_ROOT_CA_PASSPHRASE` (root-CA) of `TLS_TRUSTED_ID_PASSPHRASE` (vertrouwde
identiteit).

## Afsluitcodes {#exit-codes}

| Afsluitcode | Betekenis                                                                                                                                        |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`         | Gelukt.                                                                                                                                          |
| `1`         | Een intrekking, de CRL of een controle is mislukt.                                                                                               |
| `2`         | Verkeerd gebruik of een fout bij de voorcontrole (bijvoorbeeld een onbekende FQDN of een certificaat dat niet geldig is). Er is niets gewijzigd. |

## Opmerkingen {#notes}

- De certificaten zijn voor een homelab en om te testen.
- De certificaten bevatten geen CRL-distributiepunt. Clients vinden de CRL niet
  vanzelf. Installeer de CRL waar die wordt gebruikt, bijvoorbeeld in de
  configuratie van HAProxy of nginx.
- Een CRL van de tussenliggende CA is 30 dagen geldig, van de root-CA 90 dagen
  en van de vertrouwde identiteit 365 dagen (`default_crl_days` in de
  configuratiebestanden). Maak op tijd een nieuwe CRL met `--crl-only`.
- Is een autoriteit ingetrokken, dan weigeren clients die de CRL gebruiken de
  certificaten eronder. Maak de autoriteit opnieuw met `--replace`, en daarna de
  certificaten eronder.
- Het script gaat naar `$HOME`, omdat configuratiebestanden die vóór versie
  0.2.0 naar `$HOME/tls/openssl.cnf` zijn gekopieerd `HOME = .` gebruiken.
- Het vernieuwingsscript (`renew_tls_certificates.sh`) markeert het oude item
  van een vernieuwd certificaat op dezelfde manier als vervangen, en de
  autoriteitsscripts doen dat met `--replace`. Voer daarna `--crl-only` uit om
  die items in de CRL te zetten.

## Uitgebreide uitleg {#detailed-explanation}

De secties hieronder volgen het script van boven naar beneden. Functies die hier
niet zijn gedefinieerd, zoals `print_error`, komen uit `scripts/lib/common.sh`.

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
source "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/lib/common.sh" || exit 2
set_base_dir
certs_dir="$base_dir/certs"
private_dir="$base_dir/private"
crl_dir="$base_dir/crl"
crl_backup_dir="$base_dir/crl-backup"
archive_root="$base_dir/archive"
database_backup_dir="$archive_root/_database"
```

### De autoriteit die ondertekent: haar configuratiebestand, certificaat, sleutel, keten en CRL {#the-authority-that-signs-its-configuration-file-certificate-key-chain-and-crl}

De autoriteit die ondertekent: haar configuratiebestand, certificaat, sleutel,
keten en CRL. `set_issuer` vult deze in.

```bash
# The authority that signs: its configuration file, certificate, key, chain,
# and CRL. set_issuer fills these in.
config_file=""
issuer_label=""
issuer_cert=""
issuer_key=""
issuer_chain=""
issuer_passphrase_env=""
crl_file=""
index_file=""
newcerts_dir=""
authority_cert=""
signer_passphrase=""
signer_options=()
```

### Standaardwaarden {#defaults}

```bash
# Defaults
target_fqdn=""
authority=""
reason="unspecified"
generate_crl=true
crl_only=false
dry_run=false
assume_yes=false
```

### Status {#state}

```bash
# State
plan_serials=()
plan_files=()
plan_expires=()
log=""
```

### Functie: de helptekst tonen {#function-show-the-help-text}

```bash
# Function to show the help text
show_help() {
  sed -n '/^# Usage:/,/^# Exit codes:/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
}
```

### Functie: controleren of een reden wordt ondersteund {#function-check-that-a-reason-is-supported}

```bash
# Function to check that a reason is supported
is_valid_reason() {
  case "$1" in
  unspecified | keyCompromise | caCompromise | affiliationChanged | superseded | cessationOfOperation) return 0 ;;
  *) return 1 ;;
  esac
}
```

### Functie: de autoriteit kiezen die het in te trekken certificaat ondertekent {#function-select-the-authority-that-signs-the-certificate-to-revoke}

```bash
# Function to select the authority that signs the certificate to revoke
set_issuer() {
  case "$authority" in
  "")
    config_file="$base_dir/openssl.cnf/cert.cnf"
    issuer_label="intermediate CA"
    issuer_cert="$certs_dir/intermediate/ca.pem"
    issuer_key="$private_dir/intermediate/ca.pem"
    issuer_chain="$certs_dir/intermediate/ca_chain_bundle.pem"
    issuer_passphrase_env="TLS_CA_PASSPHRASE"
    crl_file="$crl_dir/ca_crl.pem"
    ;;
  ca)
    config_file="$base_dir/openssl.cnf/ca.cnf"
    issuer_label="root CA"
    issuer_cert="$certs_dir/root/root_ca.pem"
    issuer_key="$private_dir/root/root_ca.pem"
    issuer_chain="$certs_dir/root/root_ca_chain_bundle.pem"
    issuer_passphrase_env="TLS_ROOT_CA_PASSPHRASE"
    crl_file="$crl_dir/root_crl.pem"
    authority_cert="$certs_dir/intermediate/ca.pem"
    ;;
  root_ca)
    config_file="$base_dir/openssl.cnf/root_ca.cnf"
    issuer_label="trusted identity"
    issuer_cert="$certs_dir/root/trusted_id.pem"
    issuer_key="$private_dir/root/trusted_id.pem"
    issuer_chain="$certs_dir/root/trusted_id.pem"
    issuer_passphrase_env="TLS_TRUSTED_ID_PASSPHRASE"
    crl_file="$crl_dir/trusted_id_crl.pem"
    authority_cert="$certs_dir/root/root_ca.pem"
    ;;
  esac
}
```

### Functie: argumenten verwerken {#function-parse-arguments}

```bash
# Function to parse arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
    --reason)
      is_valid_reason "${2:-}" || {
        print_error "--reason needs one of: unspecified, keyCompromise, caCompromise, affiliationChanged, superseded, cessationOfOperation."
        exit 2
      }
      reason="$2"
      shift 2
      ;;
    --authority)
      case "${2:-}" in
      ca | root_ca) authority="$2" ;;
      *)
        print_error "--authority needs ca (the intermediate CA) or root_ca (the root CA)."
        exit 2
        ;;
      esac
      shift 2
      ;;
    --no-crl)
      generate_crl=false
      shift
      ;;
    --crl-only)
      crl_only=true
      shift
      ;;
    --dry-run)
      dry_run=true
      shift
      ;;
    --yes)
      assume_yes=true
      shift
      ;;
    -h | --help)
      show_help
      exit 0
      ;;
    -*)
      print_error "Unknown option: $1"
      exit 2
      ;;
    *)
      [[ -z "$target_fqdn" ]] || {
        print_error "Give only one FQDN."
        exit 2
      }
      target_fqdn="$1"
      shift
      ;;
    esac
  done

  if [[ "$crl_only" = true ]]; then
    [[ -z "$target_fqdn" ]] || {
      print_error "--crl-only does not take an FQDN."
      exit 2
    }
    [[ "$generate_crl" = true ]] || {
      print_error "--crl-only and --no-crl cannot be used together."
      exit 2
    }
  elif [[ -n "$authority" ]]; then
    [[ -z "$target_fqdn" ]] || {
      print_error "Use either an FQDN or --authority, not both."
      exit 2
    }
  else
    [[ -n "$target_fqdn" ]] || {
      print_error "Give an FQDN, or use --authority or --crl-only."
      exit 2
    }
  fi
  if [[ "$reason" = "caCompromise" ]] && [[ -z "$authority" ]]; then
    print_error "--reason caCompromise can only be used together with --authority."
    exit 2
  fi
  set_issuer
}
```

### Functie: controleren of alles aanwezig is, voordat er iets verandert {#function-check-that-everything-needed-is-present-before-anything-changes}

```bash
# Function to check that everything needed is present, before anything changes
preflight() {
  local missing=false file

  command -v openssl >/dev/null 2>&1 || {
    print_error "OpenSSL is not installed."
    exit 2
  }

  enter_home 2

  [[ -f "$config_file" ]] || {
    print_error "Required file not found: $config_file"
    exit 2
  }
  # The database of the authority that signs, as named in the configuration file
  index_file=$(config_database "$config_file") || {
    print_error "Cannot read the database path from $config_file."
    exit 2
  }
  newcerts_dir="$base_dir/newcerts"

  for file in \
    "$issuer_cert" \
    "$issuer_chain" \
    "$issuer_key" \
    "$index_file" \
    "$(dirname "$index_file")/crlnumber"; do
    if [[ ! -f "$file" ]]; then
      print_error "Required file not found: $file"
      missing=true
    fi
  done
  [[ -d "$crl_dir" ]] || {
    print_error "Directory not found: $crl_dir"
    missing=true
  }
  [[ "$missing" = false ]] || exit 2

  # The authority that signs must still be usable to sign the CRL
  if ! openssl x509 -in "$issuer_cert" -noout -checkend 0 >/dev/null 2>&1; then
    print_error "The certificate of the $issuer_label has expired or is not readable."
    exit 2
  fi
}
```

### Functie: om de wachtwoordzin van de ondertekenende sleutel vragen, als die is versleuteld {#function-ask-for-the-passphrase-of-the-key-that-signs-when-it-is-encrypted}

```bash
# Function to ask for the passphrase of the key that signs, when it is encrypted
prepare_signer() {
  if key_is_encrypted "$issuer_key"; then
    get_passphrase signer_passphrase "$issuer_passphrase_env" "$issuer_label key" || exit 2
    signer_options=(-passin env:TLS_SIGNER_PASSPHRASE)
  fi
}
```

### Functie: openssl ca uitvoeren met de sleutel van de ondertekenende autoriteit {#function-run-openssl-ca-with-the-key-of-the-authority-that-signs}

```bash
# Function to run openssl ca with the key of the authority that signs
signer_ca() {
  TLS_SIGNER_PASSPHRASE="$signer_passphrase" openssl ca -config "$config_file" \
    ${signer_options[@]+"${signer_options[@]}"} "$@" 9>&-
}
```

### Functie: de serienummers van de geldige (V) items van een FQDN tonen {#function-list-the-serial-numbers-of-the-valid-v-entries-of-an-fqdn}

```bash
# Function to list the serial numbers of the valid (V) entries of an FQDN
list_valid_serials() {
  awk -F'\t' -v cn="/CN=$1" '
    $1 == "V" && (substr($NF, length($NF) - length(cn) + 1) == cn || index($NF, cn "/")) { print $4 }' \
    "$index_file"
}
```

### Functie: controleren of een FQDN een item met status R heeft {#function-check-if-an-fqdn-has-an-entry-with-status-r}

```bash
# Function to check if an FQDN has an entry with status R
has_revoked_entry() {
  awk -F'\t' -v cn="/CN=$1" '
    $1 == "R" && (substr($NF, length($NF) - length(cn) + 1) == cn || index($NF, cn "/")) { found = 1 }
    END { exit !found }' "$index_file"
}
```

### Functie: het certificaat van een in te trekken autoriteit kiezen {#function-select-the-certificate-of-an-authority-to-revoke}

```bash
# Function to select the certificate of an authority to revoke
select_authority() {
  local serial enddate
  if [[ ! -f "$authority_cert" ]]; then
    print_error "Certificate not found: $authority_cert"
    exit 2
  fi
  if ! entry_is_valid "$index_file" "$authority_cert"; then
    print_error "The certificate of '$authority' has no valid entry in $index_file. It is already revoked, or it was issued with another database."
    exit 2
  fi
  serial=$(openssl x509 -in "$authority_cert" -noout -serial 2>/dev/null)
  enddate=$(openssl x509 -in "$authority_cert" -noout -enddate 2>/dev/null)
  plan_serials+=("${serial#serial=}")
  plan_files+=("$authority_cert")
  plan_expires+=("${enddate#notAfter=}")
}
```

### Functie: de in te trekken items kiezen {#function-select-the-entries-to-revoke}

```bash
# Function to select the entries to revoke
select_targets() {
  local serial cert enddate

  if [[ -n "$authority" ]]; then
    select_authority
    return
  fi

  case "$target_fqdn" in
  trusted_id | root_ca | ca)
    print_error "'$target_fqdn' is a CA certificate. Use --authority ca or --authority root_ca to revoke an authority."
    exit 2
    ;;
  esac
  is_valid_fqdn "$target_fqdn" || {
    print_error "'$target_fqdn' is not a valid FQDN."
    exit 2
  }

  while IFS= read -r serial; do
    [[ -n "$serial" ]] || continue
    cert="$newcerts_dir/$serial.pem"
    if [[ ! -f "$cert" ]]; then
      print_error "The certificate file of serial $serial is missing: $cert"
      exit 2
    fi
    enddate=$(openssl x509 -in "$cert" -noout -enddate 2>/dev/null)
    plan_serials+=("$serial")
    plan_files+=("$cert")
    plan_expires+=("${enddate#notAfter=}")
  done < <(list_valid_serials "$target_fqdn")

  if [[ "${#plan_serials[@]}" -eq 0 ]]; then
    if has_revoked_entry "$target_fqdn"; then
      print_error "No valid certificate found for $target_fqdn. It is already revoked."
    else
      print_error "No valid certificate found for $target_fqdn in $index_file."
    fi
    exit 2
  fi
}
```

### Functie: het plan tonen {#function-print-the-plan}

```bash
# Function to print the plan
print_plan() {
  local i
  print_cyan "=== Revocation plan ==="
  printf '%-40s %-42s %-26s %s\n' "NAME" "SERIAL" "EXPIRES" "REASON"
  for i in "${!plan_serials[@]}"; do
    printf '%-40s %-42s %-26s %s\n' "$target_name" "${plan_serials[$i]}" "${plan_expires[$i]}" "$reason"
  done
  echo
  echo "The database entry in $index_file is marked as revoked. No file is deleted."
  if [[ -n "$authority" ]]; then
    print_warning "Clients that use the CRL then refuse every certificate below this authority."
  fi
  if [[ "$generate_crl" = true ]]; then
    echo "A new CRL is generated in $crl_file."
  fi
}
```

### Functie: een kopie van de database bewaren voordat die verandert {#function-save-a-copy-of-the-database-before-it-changes}

```bash
# Function to save a copy of the database before it changes
backup_database() {
  local stamp
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  (umask 077 && mkdir -p "$database_backup_dir") || return 1
  (umask 077 && cp -p "$index_file" "$database_backup_dir/$backup_name.$stamp") || return 1
  log="$database_backup_dir/revoke.$stamp.log"
  echo "Database copy: $database_backup_dir/$backup_name.$stamp"
}
```

### Functie: de geplande items intrekken {#function-revoke-the-planned-entries}

```bash
# Function to revoke the planned entries
revoke_entries() {
  local i status=0
  for i in "${!plan_serials[@]}"; do
    if signer_ca -revoke "${plan_files[$i]}" -crl_reason "$reason" >>"$log" 2>&1; then
      echo "Revoked: ${plan_serials[$i]} ($reason)"
    else
      print_error "Cannot revoke serial ${plan_serials[$i]}. Last lines of $log:"
      tail -n 10 "$log" >&2
      status=1
    fi
  done

  # No valid entry may be left
  if [[ "$status" -eq 0 ]]; then
    if [[ -n "$authority" ]]; then
      if entry_is_valid "$index_file" "$authority_cert"; then
        print_error "The certificate of '$authority' still has a valid entry in $index_file."
        status=1
      fi
    elif [[ -n "$(list_valid_serials "$target_fqdn")" ]]; then
      print_error "$target_fqdn still has a valid entry in $index_file."
      status=1
    fi
  fi
  return $status
}
```

### Functie: de CRL maken en controleren {#function-generate-and-check-the-crl}

```bash
# Function to generate and check the CRL
create_crl() {
  local stamp count
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  if [[ -z "$log" ]]; then
    (umask 077 && mkdir -p "$database_backup_dir") || return 1
    log="$database_backup_dir/crl.$stamp.log"
  fi

  # Keep the previous CRL
  if [[ -f "$crl_file" ]]; then
    (umask 077 && mkdir -p "$crl_backup_dir" && cp -p "$crl_file" "$crl_backup_dir/$(basename "$crl_file" .pem).$stamp.pem") || {
      print_error "Cannot save the previous CRL. The CRL was not changed."
      return 1
    }
  fi

  signer_ca -gencrl -out "$crl_file.new" >>"$log" 2>&1 || {
    print_error "Cannot generate the CRL."
    rm -f "$crl_file.new"
    return 1
  }
  if ! openssl crl -in "$crl_file.new" -noout -CAfile "$issuer_chain" >>"$log" 2>&1; then
    print_error "The new CRL does not verify against the CA chain."
    rm -f "$crl_file.new"
    return 1
  fi
  mv "$crl_file.new" "$crl_file" || return 1
  chmod 644 "$crl_file"

  count=$(openssl crl -in "$crl_file" -noout -text | grep -c "Serial Number:")
  echo "CRL: $crl_file"
  echo "Revoked certificates in the CRL: $count"
  openssl crl -in "$crl_file" -noout -lastupdate -nextupdate
  print_warning "The certificates have no CRL distribution point. Install the CRL where it is used. Generate a new one with --crl-only before it expires."
}
```

### Hoofdproces {#main-process}

```bash
# Main process
parse_arguments "$@"
preflight
# Prevent a revocation during a renewal. The lock is taken before the plan is
# made, so the plan matches the database. The commands that this script starts
# do not inherit the lock (9>&-).
[[ "$dry_run" = true ]] || acquire_lock 2 0 "A renewal, a revocation, or a certificate script is running."

target_name="${target_fqdn:-$authority}"
backup_name="index.txt"
[[ -z "$authority" ]] || backup_name="index.txt.$(basename "$(dirname "$index_file")")"

if [[ "$crl_only" = false ]]; then
  select_targets
  print_plan
  if [[ "$dry_run" = true ]]; then
    exit 0
  fi
  if [[ "$assume_yes" = false ]] && ! confirm; then
    echo "Cancelled. Nothing was changed."
    exit 0
  fi
elif [[ "$dry_run" = true ]]; then
  echo "A new CRL would be generated in $crl_file."
  exit 0
fi

prepare_signer
status=0

if [[ "$crl_only" = false ]]; then
  backup_database || {
    print_error "Cannot save a copy of index.txt. Nothing was changed."
    exit 1
  }
  revoke_entries || status=1
fi
```

### De CRL maken, ook na een gedeeltelijke fout, zodat die past bij de database {#generate-the-crl-also-after-a-partial-failure-so-it-matches-the-database}

```bash
# Generate the CRL, also after a partial failure, so it matches the database
if [[ "$generate_crl" = true ]]; then
  create_crl || status=1
fi

if [[ "$status" -ne 0 ]]; then
  exit 1
fi

if [[ "$crl_only" = false ]]; then
  echo
  print_cyan "Revoked $target_name. The files of the certificate are still in place; stop using them."
  if [[ -n "$authority" ]]; then
    echo "Create the authority again with --replace, and then the certificates below it."
  fi
fi
exit 0
```

## Conclusie {#conclusion}

Dit script trekt een server- of clientcertificaat in en maakt een lijst met
ingetrokken certificaten (CRL).

[revoke_tls_certificates.sh]:
  https://raw.githubusercontent.com/homelab-alpha/openssl/refs/heads/main/scripts/revoke_tls_certificates.sh
